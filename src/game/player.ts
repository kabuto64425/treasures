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
    private lastMoveDirection: DIRECTION | undefined;

    private elapsedFrameLastInput: number;

    private isApprovedPlayerDirection: (direction: DIRECTION) => boolean;

    constructor(gameObjectFactory: Phaser.GameObjects.GameObjectFactory, iniRow: number, iniColumn: number, params: any, isApprovedPlayerDirection: (direction: DIRECTION) => boolean) {
        this.graphics = gameObjectFactory.graphics();
        this.row = iniRow;
        this.column = iniColumn;
        this.chargeAmount = 0;
        this.moveCost = params.playerMoveCost;
        this.playerDirectionBuffer = new PlayerDirectionBuffer(params.playerMoveCost, params.playerMoveCost, this.getLastMoveDirection);
        this.lastMoveDirection = undefined;
        this.elapsedFrameLastInput = 0;
        this.isApprovedPlayerDirection = isApprovedPlayerDirection;
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

    resolvePlayerFrame() {
        // 先行入力設定
        // 2方向入力されている場合は、どちらか一方を先行入力に設定
        for (const direction of DIRECTION.values()) {
            if (this.isApprovedPlayerDirection(direction)) {
                const res = this.playerDirectionBuffer.trySetDirectionBuffer(direction, this.chargeAmount);
                if (res) {
                    break;
                }
            }
        }

        if (this.isChargeCompleted()) {
            // 移動方向の決定
            // まずは先行入力が入っているか確認
            let nextDirection = this.playerDirectionBuffer.consumeDirectionBuffer();
            if (nextDirection === undefined) {
                // 先行入力が入ってない場合、入力されている方向とする
                // 2方向入力されている場合は、どちらか一方を移動方向にする
                for (const direction of DIRECTION.values()) {
                    if(this.isApprovedPlayerDirection(direction)) {
                        nextDirection = direction;
                    }
                }
            }

            // 移動してみる
            if (nextDirection !== undefined) {
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
        this.row += direction.dr;
        this.column += direction.dc;
        this.lastMoveDirection = direction;
        this.chargeAmount = 0;
    }

    draw() {
        this.graphics.clear();
        this.graphics.lineStyle(0, 0x0000ff);
        this.graphics.fillStyle(0x0000ff);
        this.graphics.fillRect(this.column * GameConstants.GRID_SIZE, this.row * GameConstants.GRID_SIZE, GameConstants.GRID_SIZE, GameConstants.GRID_SIZE);
    }

    readonly getLastMoveDirection = () => {
        return this.lastMoveDirection;
    }

    handleCollisionWith(actor: IFieldActor) {
        if (this.row === actor.position().row && this.column === actor.position().column) {
            actor.onCollideWithPlayer();
        }
    }
}