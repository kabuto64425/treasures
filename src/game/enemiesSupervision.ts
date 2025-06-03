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
    findRoomIdWithoutEnemies: () => number
}

export class EnemiesSupervision {
    private readonly enemyList: Enemy[];
    private lastSpottedRoomId: number;
    private extractCurrentAppearanceTreasures: () => IFieldActor[];

    private readonly enemyStrategyOrders = [
        "Follower",
        "Patrol",
        "Intercept",
        "Flanking"
    ] as const;

    constructor(params: any,
        onPlayerCaptured: () => void, footprint: Footprint,
        isShortestDirection: (from: Util.Position, to: Util.Position, direction: DIRECTION) => boolean,
        getPlayerRoomId: () => number, isFinalRound: () => boolean, extractCurrentAppearanceTreasures: () => IFieldActor[]
    ) {
        this.lastSpottedRoomId = getPlayerRoomId();
        this.extractCurrentAppearanceTreasures = extractCurrentAppearanceTreasures;
        this.enemyList = Array.from({ length: GameConstants.numberOfEnemyies }, (_, i) => {
            return this.createEnemy(
                i, params, onPlayerCaptured,
                footprint, isShortestDirection, getPlayerRoomId, isFinalRound
            );
        });
    }

    private createEnemy(
        index: number, params: any,
        onPlayerCaptured: () => void, footprint: Footprint,
        isShortestDirection: (from: Util.Position, to: Util.Position, direction: DIRECTION) => boolean,
        getPlayerRoomId: () => number, isFinalRound: () => boolean
    ) {
        const strategyInitArgs: StrategyInitArgs = {
            firstTargetRoomId: this.lastSpottedRoomId,
            getLastSpottedRoomId: this.getLastSpottedRoomId,
            findRoomIdWithMostTreasures: this.findRoomIdWithMostTreasures,
            findRoomIdWithoutEnemies: this.findRoomIdWithoutEnemies
        };

        const strategy = this.createStrategy(this.enemyStrategyOrders[index], strategyInitArgs);

        return new Enemy(
            GameConstants.parametersOfEnemies[index].row, GameConstants.parametersOfEnemies[index].column,
            params, GameConstants.parametersOfEnemies[index].priorityScanDirections, strategy,
            onPlayerCaptured, footprint.getFirstPrint, footprint.onSteppedOnByEnemy,
            isShortestDirection, getPlayerRoomId, isFinalRound, this.onPlayerSpotted, this.getEnemyList
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
                return new FlankingStrategy(args.findRoomIdWithoutEnemies);
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

    readonly findRoomIdWithoutEnemies = () => {
        const roomIdList = this.getEnemyList().map(m => {
            return Util.findRoomId(m.position());
        });

        const roomIdSet = new Set(roomIdList);

        for (let i = 0; i < GameConstants.ROOM_COUNT; i++) {
            if (!roomIdSet.has(i)) {
                // とりあえず最初に見つけた部屋。
                // 優先度含めた細かい調整を実装する必要あり
                return i;
            }
        }
        // この処理が実行されることはないはずだが、undefinedを回避するため
        return GameConstants.ROOM_COUNT - 1;
    }
}