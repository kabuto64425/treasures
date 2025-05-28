import { DebugDataMediator } from "./debugData";
import { DIRECTION } from "./drection";
import { Enemy, FollowerStrategy, PatrolStrategy, SearchingStrategy } from "./enemy";
import { Footprint } from "./footprint";
import * as GameConstants from "./gameConstants"
import * as Util from "./utils";

interface StrategyInitArgs {
    firstTargetRoomId: number,
    getLastSpottedRoomId: () => number
}

export class EnemiesSupervision {
    private readonly enemyList: Enemy[];
    private lastSpottedRoomId: number;

    private readonly enemyStrategyOrders = [
        "Follower",
        "Patrol",
        "Patrol",
        "Patrol"
    ] as const;

    constructor(gameObjectFactory: Phaser.GameObjects.GameObjectFactory, params: any,
        onPlayerCaptured: () => void, footprint: Footprint,
        isShortestDirection: (from: Util.Position, to: Util.Position, direction: DIRECTION) => boolean,
        getPlayerRoomId: () => number, isFinalRound: () => boolean
    ) {
        this.lastSpottedRoomId = getPlayerRoomId();
        this.enemyList = Array.from({ length: GameConstants.numberOfEnemyies }, (_, i) => {
            return this.createEnemy(
                i, gameObjectFactory, params,onPlayerCaptured,
                footprint, isShortestDirection, getPlayerRoomId, isFinalRound
            );
        });
    }

    private createEnemy(
        index: number,
        gameObjectFactory: Phaser.GameObjects.GameObjectFactory, params: any,
        onPlayerCaptured: () => void, footprint: Footprint,
        isShortestDirection: (from: Util.Position, to: Util.Position, direction: DIRECTION) => boolean,
        getPlayerRoomId: () => number, isFinalRound: () => boolean
    ) {
        const strategyInitArgs: StrategyInitArgs = {
            firstTargetRoomId: this.lastSpottedRoomId,
            getLastSpottedRoomId: this.getLastSpottedRoomId
        };

        const strategy = this.createStrategy(this.enemyStrategyOrders[index], strategyInitArgs);

        return new Enemy(
            gameObjectFactory, GameConstants.parametersOfEnemies[index].row, GameConstants.parametersOfEnemies[index].column,
            params, GameConstants.parametersOfEnemies[index].priorityScanDirections, strategy,
            onPlayerCaptured, footprint.getFirstPrint, footprint.onSteppedOnByEnemy,
            isShortestDirection, getPlayerRoomId, isFinalRound, this.onPlayerSpotted
        );
    }

    private createStrategy(order: string, args: StrategyInitArgs): SearchingStrategy {
        switch (order) {
            case "Follower":
                return new FollowerStrategy(args.firstTargetRoomId, args.getLastSpottedRoomId);
            case "Patrol":
                return new PatrolStrategy();
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

    getEnemyList() {
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
}