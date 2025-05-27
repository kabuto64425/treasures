import { DebugDataMediator } from "./debugData";
import { DIRECTION } from "./drection";
import { Enemy, PatrolStrategy } from "./enemy";
import { Footprint } from "./footprint";
import * as GameConstants from "./gameConstants"
import * as Util from "./utils";

export class EnemiesSupervision {
    enemyList: Enemy[];

    constructor(gameObjectFactory: Phaser.GameObjects.GameObjectFactory, params: any,
        onPlayerCaptured: () => void, footprint: Footprint,
        isShortestDirection: (from: Util.Position, to: Util.Position, direction: DIRECTION) => boolean,
        getPlayerRoomId: () => number, isFinalRound: () => boolean
    ) {

        this.enemyList = Array.from({ length: GameConstants.numberOfEnemyies }, (_, i) => new Enemy(
            gameObjectFactory, GameConstants.parametersOfEnemies[i].row, GameConstants.parametersOfEnemies[i].column,
            params, GameConstants.parametersOfEnemies[i].priorityScanDirections, new PatrolStrategy(),
            onPlayerCaptured, footprint.getFirstPrint, footprint.onSteppedOnByEnemy,
            isShortestDirection, getPlayerRoomId, isFinalRound
        ));
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
}