import { DIRECTION } from "./drection";
import * as GameConstants from "./gameConstants";
import { IFieldActor } from "./iFieldActor";
import { PlayerDirectionBuffer } from "./playerDirectionBuffer";

export class Player {
    private readonly graphics: Phaser.GameObjects.Graphics;
    private row: number;
    private column: number;
    private chargeAmount: number;
    private readonly moveCost: number;

    private playerDirectionBuffer: PlayerDirectionBuffer;

    private elapsedFrameLastInput: number;

    constructor(gameObjectFactory: Phaser.GameObjects.GameObjectFactory, iniRow: number, iniColumn: number, params: any) {
        this.graphics = gameObjectFactory.graphics();
        this.row = iniRow;
        this.column = iniColumn;
        this.chargeAmount = 0;
        this.moveCost = params.playerMoveCost;
        this.playerDirectionBuffer = new PlayerDirectionBuffer(params.playerMoveCost, 4);
        this.elapsedFrameLastInput = 0;
    }

    position() {
        return { row: this.row, column: this.column };
    }

    private charge() {
        this.chargeAmount++;
    }

    private isChargeCompleted() {
        if (this.chargeAmount >= this.moveCost) {
            return true;
        }
        return false;
    }

    resolvePlayerFrame(playerDirection: DIRECTION | undefined) {
        if (playerDirection !== undefined) {
            this.playerDirectionBuffer.trySetDirectionBuffer(playerDirection, this.chargeAmount);
        }

        if(this.isChargeCompleted()) {
            const nextDirection = this.playerDirectionBuffer.consumeDirectionBuffer();
            if(nextDirection !== undefined) {
                if (this.canMove(nextDirection)) {
                    this.move(nextDirection);
                }
            }
        } else {
            this.charge();
        }
        this.elapsedFrameLastInput++;
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