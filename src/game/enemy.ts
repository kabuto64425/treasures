import * as Util from "./utils";
import { DIRECTION } from "./drection";
import * as GameConstants from "./gameConstants";
import { FieldEvaluation } from "./fieldEvaluation";
import { IFieldActor } from "./iFieldActor";

enum EnemyState {
    SEARCHING = 0,
    CHASING = 1
}

export class Enemy implements IFieldActor {
    private readonly graphics: Phaser.GameObjects.Graphics;
    private state: EnemyState;
    behaviorMap = {
        [EnemyState.SEARCHING]: new SearchingBehavior(),
        [EnemyState.CHASING]: new ChasingBehavior()
    };

    private row: number;
    private column: number;
    private roomId: number;
    private readonly moveCostSearching: number;
    private readonly moveCostChasing: number;

    private chargeAmount: number;
    private readonly priorityScanDirections: DIRECTION[];
    private readonly onPlayerCaptured: () => void;
    private readonly getFirstFootprint: () => Util.Position;
    private readonly stepOnFirstFootprint: () => void;

    constructor(gameObjectFactory: Phaser.GameObjects.GameObjectFactory, iniRow: number,
        iniColumn: number, params: any, priorityScanDirections: DIRECTION[], onPlayerCaptured: () => void,
        getFirstFootprint: () => Util.Position, stepOnFirstFootprint: () => void
    ) {
        this.graphics = gameObjectFactory.graphics();
        this.graphics.depth = 10;
        this.state = EnemyState.SEARCHING;
        this.row = iniRow;
        this.column = iniColumn;
        this.roomId = Util.findRoomId({ row: this.row, column: this.column });
        this.moveCostSearching = params.enemyMoveCostSearching;
        this.moveCostChasing = params.enemyMoveCostChasing;

        this.chargeAmount = 0;
        this.priorityScanDirections = priorityScanDirections;
        this.onPlayerCaptured = onPlayerCaptured;
        this.getFirstFootprint = getFirstFootprint;
        this.stepOnFirstFootprint = stepOnFirstFootprint;
    }

    position() {
        return { row: this.row, column: this.column };
    }

    charge() {
        this.chargeAmount++;
    }

    setup() {

    }

    resolveEnemyFrame(fieldEvaluation: FieldEvaluation, playerRoomId: number) {
        // 敵の状態変更判定
        if (this.isSearching()) {
            // プレイヤーと同室したら、追いかける。
            if (this.roomId === playerRoomId) {
                this.state = EnemyState.CHASING;
            }
        } else if (this.isChasing()) {
            // 今は仮実装
            // 2部屋以上離れたら探索にする予定
            if (this.roomId !== playerRoomId) {
                this.state = EnemyState.SEARCHING;
            }
        }

        const behavior = this.behaviorMap[this.state];

        if (behavior.isChargeCompleted(this)) {
            const direction = behavior.decideMoveDirection(this, fieldEvaluation);
            this.move(direction);
        } else {
            this.charge();
        }

        this.handleFirstFootprintStep();
        this.roomId = Util.findRoomId(this.position());
    }

    move(direction: DIRECTION | undefined) {
        if (direction === undefined) {
            return;
        }
        const nextPosition = Util.calculateNextPosition(this.position(), direction);
        this.row = nextPosition.row;
        this.column = nextPosition.column;
        this.chargeAmount = 0;
    }

    getPlayerDebugValueData() {
        return {
            state: EnemyState[this.state],
            chargeAmount: this.chargeAmount,
            position: this.position(),
            roomId: this.roomId
        };
    }

    draw() {
        this.graphics.clear();
        this.graphics.lineStyle(0, 0xff0000);
        this.graphics.fillStyle(0xff0000);
        this.graphics.fillRect(this.column * GameConstants.GRID_SIZE, this.row * GameConstants.GRID_SIZE, GameConstants.GRID_SIZE, GameConstants.GRID_SIZE);
    }

    show() {
        this.graphics.setVisible(true);
    }

    hide() {
        this.graphics.setVisible(false);
    }

    onCollideWithPlayer(): void {
        this.onPlayerCaptured();
    }

    handleFirstFootprintStep() {
        if (Util.isSamePosition(this.position(), this.getFirstFootprint())) {
            this.stepOnFirstFootprint();
        }
    }

    private readonly isSearching = () => {
        return this.state === EnemyState.SEARCHING;
    }

    private readonly isChasing = () => {
        return this.state === EnemyState.CHASING;
    }

    getChargeAmount() {
        return this.chargeAmount;
    }

    isChargeCompletedSearching() {
        return this.isChargeCompleted(this.moveCostSearching);
    }

    isChargeCompletedChasing() {
        return this.isChargeCompleted(this.moveCostChasing);
    }

    private isChargeCompleted(cost: number) {
        return this.chargeAmount >= cost;
    }

    // 仮実装
    decideMoveDirectionSearching(fieldEvaluation: FieldEvaluation) {
        for (const d of this.priorityScanDirections) {
            if (fieldEvaluation.isShortestDirection(this.row, this.column, d)) {
                return d;
            }
        }
        return undefined;
    }

    decideMoveDirectionChasing(fieldEvaluation: FieldEvaluation) {
        for (const d of this.priorityScanDirections) {
            if (fieldEvaluation.isShortestDirection(this.row, this.column, d)) {
                return d;
            }
        }
        return undefined;
    }
}

interface EnemyBehavior {
    isChargeCompleted(enemy: Enemy): boolean;
    decideMoveDirection(enemy: Enemy, fieldEvaluation: FieldEvaluation): DIRECTION | undefined;
}

class SearchingBehavior implements EnemyBehavior {
    isChargeCompleted(enemy: Enemy): boolean {
        return enemy.isChargeCompletedSearching();
    }
    decideMoveDirection(enemy: Enemy, fe: FieldEvaluation): DIRECTION | undefined {
        return enemy.decideMoveDirectionSearching(fe);
    }
}

class ChasingBehavior implements EnemyBehavior {
    isChargeCompleted(enemy: Enemy): boolean {
        return enemy.isChargeCompletedChasing();
    }
    decideMoveDirection(enemy: Enemy, fe: FieldEvaluation): DIRECTION | undefined {
        return enemy.decideMoveDirectionChasing(fe);
    }
}