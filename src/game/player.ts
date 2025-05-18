import { DIRECTION } from "./drection";
import * as GameConstants from "./gameConstants";
import { IFieldActor } from "./iFieldActor";

export class Player {
    private readonly graphics: Phaser.GameObjects.Graphics;
    private row: number;
    private column: number;
    private chargeAmount: number;
    private readonly moveCost: number;

    private elapsedFrameLastInput: number;
    private nextDirection: DIRECTION | undefined;

    constructor(gameObjectFactory: Phaser.GameObjects.GameObjectFactory, iniRow: number, iniColumn: number, moveCost: number) {
        this.graphics = gameObjectFactory.graphics();
        this.row = iniRow;
        this.column = iniColumn;
        this.chargeAmount = 0;
        this.moveCost = moveCost;
        this.elapsedFrameLastInput = 0;
        this.nextDirection = undefined;
    }

    position() {
        return { row: this.row, column: this.column };
    }

    private charge() {
        this.chargeAmount++;
    }

    private setNextDirection(direction: DIRECTION) {
        this.nextDirection = direction;
    }

    private isChargeCompleted() {
        if (this.chargeAmount >= this.moveCost) {
            return true;
        }
        return false;
    }

    resolveActionPerFrame(playerDirection: DIRECTION | undefined) {
        if(this.elapsedFrameLastInput >= 5) {
            if (playerDirection !== undefined) {
                this.setNextDirection(playerDirection);
                this.elapsedFrameLastInput = 0;
            }
        } else {
            this.elapsedFrameLastInput++;
        }

        if (this.isChargeCompleted()) {
            this.resolveMoveInNextDirection();
        } else {
            this.charge();
        }
    }

    private resolveMoveInNextDirection() {
        if (this.nextDirection === undefined) {
            return;
        }

        const direction = this.nextDirection;
        this.nextDirection = undefined;

        if (this.canMove(direction)) {
            this.move(direction);
        }
    }

    private canMove(direction: DIRECTION) {
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

    private move(direction: DIRECTION) {
        if (this.chargeAmount >= this.moveCost) {
            this.row += direction.dr;
            this.column += direction.dc;
            this.chargeAmount = 0;
        }
    }

    draw() {
        this.graphics.clear();
        this.graphics.lineStyle(0, 0x0000ff);
        this.graphics.fillStyle(0x0000ff);
        this.graphics.fillRect(this.column * GameConstants.GRID_SIZE, this.row * GameConstants.GRID_SIZE, GameConstants.GRID_SIZE, GameConstants.GRID_SIZE);
    }

    handleCollisionWith(actor: IFieldActor) {
        if (this.row === actor.position().row && this.column === actor.position().column) {
            actor.onCollideWithPlayer();
        }
    }
}