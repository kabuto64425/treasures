import { DIRECTION } from "./drection";
import * as GameConstants from "./gameConstants";
import { FieldEvalution } from "./fieldEvalution";
import { IFieldActor } from "./iFieldActor";

export class Enemy implements IFieldActor {
    private readonly graphics: Phaser.GameObjects.Graphics;
    private row: number;
    private column: number;
    private chargeAmount: number;
    private readonly priorityScanDirections: DIRECTION[];

    constructor(gameObjectFactory: Phaser.GameObjects.GameObjectFactory, iniRow: number, iniColumn: number, priorityScanDirections: DIRECTION[]) {
        this.graphics = gameObjectFactory.graphics();
        this.graphics.depth = 10;
        this.row = iniRow;
        this.column = iniColumn;
        this.chargeAmount = 0;
        this.priorityScanDirections = priorityScanDirections;
    }

    position() {
        return { row: this.row, column: this.column };
    }

    charge() {
        this.chargeAmount++;
    }

    isChargeCompleted() {
        if (this.chargeAmount >= 6) {
            return true;
        }
        return false;
    }

    decideMoveDirection(fieldEvaluation: FieldEvalution) {
        for (const d of this.priorityScanDirections) {
            if (fieldEvaluation.isShortestDirection(this.row, this.column, d)) {
                return d;
            }
        }
        return null;
    }

    move(direction: DIRECTION | null) {
        if (direction === null) {
            return;
        }
        if (this.chargeAmount >= 6) {
            this.row += direction.dr;
            this.column += direction.dc;
            this.chargeAmount = 0;
        }
    }

    draw() {
        this.graphics.clear();
        this.graphics.lineStyle(0, 0xff0000);
        this.graphics.fillStyle(0xff0000);
        this.graphics.fillRect(this.column * GameConstants.GRID_SIZE, this.row * GameConstants.GRID_SIZE, GameConstants.GRID_SIZE, GameConstants.GRID_SIZE);
    }

    onCollideWithPlayer(): void {
        // 総監督が持つゲームオーバー処理(実装予定)を実行
    }
}
