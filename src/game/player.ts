import { DIRECTION } from "./drection";
import * as GameConstants from "./gameConstants";
import { GameScene } from "./gameScene";

export class Player {
    private graphics: Phaser.GameObjects.Graphics;
    private row: number;
    private column: number;
    private chargeAmount: number;
    private numberOfCollectedTreasures: number;

    constructor(scene: GameScene, iniRow: number, iniColumn: number) {
        this.graphics = scene.add.graphics();
        this.row = iniRow;
        this.column = iniColumn;
        this.chargeAmount = 0;
        this.numberOfCollectedTreasures = 0;
    }

    position() {
        return { row: this.row, column: this.column };
    }

    charge() {
        this.chargeAmount++;
    }

    isChargeCompleted() {
        if (this.chargeAmount >= 3) {
            return true;
        }
        return false;
    }

    canMove(direction: DIRECTION) {
        const toRow = this.row + direction.dr;
        const toCol = this.column + direction.dc;
        if (toRow < 0) {
            return false;
        }
        if (toRow >= GameConstants.H) {
            return false;
        }
        if (toCol < 0) {
            return false;
        }
        if (toCol >= GameConstants.W) {
            return false;
        }
        if (GameConstants.FIELD[toRow][toCol] === 1) {
            return false;
        }
        return true;
    }

    move(direction: DIRECTION) {
        if (this.chargeAmount >= 3) {
            this.row += direction.dr;
            this.column += direction.dc;
            this.chargeAmount = 0;
        }
    }

    addNumberOfCollectedTreasures() {
        this.numberOfCollectedTreasures++;
    }

    getNumberOfCollectedTreasures() {
        return this.numberOfCollectedTreasures;
    }

    draw() {
        this.graphics.clear();
        this.graphics.lineStyle(0, 0x0000ff);
        this.graphics.fillStyle(0x0000ff);
        this.graphics.fillRect(this.column * GameConstants.GRID_SIZE, this.row * GameConstants.GRID_SIZE, GameConstants.GRID_SIZE, GameConstants.GRID_SIZE);
    }
}