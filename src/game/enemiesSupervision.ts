import { DebugDataMediator } from "./debugData";
import { DIRECTION } from "./drection";
import { Enemy, FlankingStrategy, FollowerStrategy, InterceptStrategy, PatrolStrategy, SearchingStrategy } from "./enemy";
import { Footprint } from "./footprint";
import * as GameConstants from "./gameConstants"
import { IFieldActor } from "./iFieldActor";
import * as Util from "./utils";

interface StrategyInitArgs {
    firstTargetRoomId: number,
    getLastSpottedRoomId: () => number,
    findRoomIdWithMostTreasures: () => number,
    findRoomIdNotBeingScouted: () => number
}

export class EnemiesSupervision {
    private readonly enemyList: Enemy[];
    private lastSpottedRoomId: number;
    private extractCurrentAppearanceTreasures: () => IFieldActor[];

    // 敵が索敵部屋とすべき条件と合致するかをどの部屋から見ていくか？その順番を記録する配列
    private roomConditionCheckOrder: number[];
    // 最後にroomConditionCheckOrderの順番を更新してから経過したフレーム数
    private framesSinceRoomCheckOrderUpdate = 0;

    private readonly enemyStrategyOrders = [
        "Follower",
        "Patrol",
        "Intercept",
        "Flanking"
    ] as const;

    constructor(params: any,
        onPlayerCaptured: () => void, footprint: Footprint,
        isShortestDirection: (from: Util.Position, to: Util.Position, direction: DIRECTION) => boolean,
        getPlayerRoomId: () => number, isFinalRound: () => boolean, extractCurrentAppearanceTreasures: () => IFieldActor[],
        isFloor: (position: Util.Position) => boolean
    ) {
        this.lastSpottedRoomId = getPlayerRoomId();
        this.extractCurrentAppearanceTreasures = extractCurrentAppearanceTreasures;
        this.enemyList = Array.from({ length: GameConstants.numberOfEnemyies }, (_, i) => {
            return this.createEnemy(
                i, params, onPlayerCaptured,
                footprint, isShortestDirection, getPlayerRoomId, isFinalRound, isFloor
            );
        });
        this.framesSinceRoomCheckOrderUpdate = 0;
        this.roomConditionCheckOrder = [...GameConstants.INITIAL_ROOM_CONDITION_CHECK_ORDER];
    }

    private createEnemy(
        index: number, params: any,
        onPlayerCaptured: () => void, footprint: Footprint,
        isShortestDirection: (from: Util.Position, to: Util.Position, direction: DIRECTION) => boolean,
        getPlayerRoomId: () => number, isFinalRound: () => boolean,
        isFloor: (position: Util.Position) => boolean
    ) {
        const strategyInitArgs: StrategyInitArgs = {
            firstTargetRoomId: this.lastSpottedRoomId,
            getLastSpottedRoomId: this.getLastSpottedRoomId,
            findRoomIdWithMostTreasures: this.findRoomIdWithMostTreasures,
            findRoomIdNotBeingScouted: this.findRoomIdNotBeingScouted
        };

        const strategy = this.createStrategy(this.enemyStrategyOrders[index], strategyInitArgs);

        return new Enemy(
            GameConstants.parametersOfEnemies[index].row, GameConstants.parametersOfEnemies[index].column,
            params, GameConstants.parametersOfEnemies[index].priorityScanDirections, strategy,
            onPlayerCaptured, footprint.getFirstPrint, footprint.onSteppedOnByEnemy,
            isShortestDirection, getPlayerRoomId, isFinalRound, this.onPlayerSpotted, this.getEnemyList,
            isFloor
        );
    }

    private createStrategy(order: string, args: StrategyInitArgs): SearchingStrategy {
        switch (order) {
            case "Follower":
                return new FollowerStrategy(args.firstTargetRoomId, args.getLastSpottedRoomId);
            case "Patrol":
                return new PatrolStrategy();
            case "Intercept":
                return new InterceptStrategy(args.findRoomIdWithMostTreasures);
            case "Flanking":
                return new FlankingStrategy(args.findRoomIdNotBeingScouted);
            default:
                throw new Error(`Unknown strategy type: ${order}`);
        }
    }

    setup() {
        for (const enemy of this.enemyList) {
            enemy.setup();
        }
        DebugDataMediator.setEnemiesDebugValue(
            this.enemyList.map(e => { return e.getDebugValueData() })
        );
    }

    resolveFrame() {
        this.framesSinceRoomCheckOrderUpdate++;

        if(this.framesSinceRoomCheckOrderUpdate >= GameConstants.DESTINATION_FORCE_UPDATE_INTERVAL) {
            // 最後にroomConditionCheckOrderの順番を更新してから一定時間経過したから、ローテーション
            const roomId = this.roomConditionCheckOrder.shift();
            if(roomId !== undefined) {
                this.roomConditionCheckOrder.push(roomId);
            }
            this.framesSinceRoomCheckOrderUpdate = 0;
        }

        for (const enemy of this.enemyList) {
            enemy.resolveEnemyFrame();
        }
        DebugDataMediator.setEnemiesDebugValue(
            this.enemyList.map(e => { return e.getDebugValueData() })
        );
    }

    readonly getEnemyList = () => {
        return this.enemyList;
    }

    handlePause() {
        this.enemyList.forEach(enemy => {
            enemy.hide();
        });
    }

    handleResume() {
        this.enemyList.forEach(enemy => {
            enemy.show();
        });
    }

    // spotには「見つける」という意味がある
    onPlayerSpotted = (spottedRoomId: number) => {
        this.lastSpottedRoomId = spottedRoomId;
    }

    readonly getLastSpottedRoomId = () => {
        return this.lastSpottedRoomId;
    }

    readonly findRoomIdWithMostTreasures = () => {
        const roomIdCountsMap = new Map<number, number>();

        for (const treasure of this.extractCurrentAppearanceTreasures()) {
            const roomId = Util.findRoomId(treasure.position());
            const count = roomIdCountsMap.get(roomId) ?? 0;
            roomIdCountsMap.set(roomId, count + 1);
        }

        const maxCount = Math.max(...roomIdCountsMap.values());

        for (const [key, value] of roomIdCountsMap) {
            // とりあえず最初に見つけた部屋。
            // 優先度含めた細かい調整を実装する必要あり
            if (value === maxCount) {
                return key;
            }
        }
        // この処理が実行されることはないはずだが、undefinedを回避するため
        return GameConstants.ROOM_COUNT - 1;
    }

    readonly findRoomIdNotBeingScouted = () => {
        const roomIdList = this.getEnemyList().map(m => {
            return m.getTargetRoomId();
        });

        const roomIdSet = new Set(roomIdList);

        for (const candidateRoomId of this.roomConditionCheckOrder) {
            if (!roomIdSet.has(candidateRoomId)) {
                // とりあえず最初に見つけた部屋。
                // 優先度含めた細かい調整を実装する必要あり
                return candidateRoomId;
            }
        }
        // この処理が実行されることはないはずだが、undefinedを回避するため
        return GameConstants.ROOM_COUNT - 1;
    }
}