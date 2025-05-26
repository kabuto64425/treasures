import * as Util from "./utils";
import { DIRECTION } from "./drection";
import { Footprint } from "./footprint";
import * as GameConstants from "./gameConstants";
import { IFieldActor } from "./iFieldActor";
import { PlayerDirectionBuffer } from "./playerDirectionBuffer";
import { DebugDataMediator } from "./debugData";

export class Player {
    private readonly graphics: Phaser.GameObjects.Graphics;
    private row: number;
    private column: number;
    private roomId: number;
    private chargeAmount: number;
    private readonly moveCost: number;

    private playerDirectionBuffer: PlayerDirectionBuffer;
    private lastMoveDirection: DIRECTION | undefined;

    private footPrint: Footprint;

    constructor(gameObjectFactory: Phaser.GameObjects.GameObjectFactory, iniRow: number, iniColumn: number, params: any) {
        this.graphics = gameObjectFactory.graphics();
        this.row = iniRow;
        this.column = iniColumn;
        this.roomId = Util.findRoomId({ row: this.row, column: this.column });
        this.chargeAmount = 0;
        this.moveCost = params.playerMoveCost;
        // 先行入力受付は、暫定チャージ中いつでもできるように第２引数を指定している。多分これで確定しそう。
        this.playerDirectionBuffer = new PlayerDirectionBuffer(params.playerMoveCost, params.playerMoveCost, this.getLastMoveDirection);
        this.lastMoveDirection = undefined;
        this.footPrint = new Footprint(gameObjectFactory, params.visibleFootPrint, params.footPrintLimitFrame);
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

    setup(currentFrame: number) {
        this.footPrint.push(this.position(), currentFrame);
    }

    resolvePlayerFrame(playerDirection: DIRECTION | undefined, currentFrame: number) {
        // 先行入力設定
        // 2方向入力されている場合は、どちらか一方を先行入力に設定
        if (playerDirection !== undefined) {
            this.playerDirectionBuffer.trySetDirectionBuffer(playerDirection, this.chargeAmount);
        }

        if (this.isChargeCompleted()) {
            // 移動方向の決定
            // まずは先行入力が入っているか確認
            let nextDirection = this.playerDirectionBuffer.consumeDirectionBuffer();
            if (nextDirection === undefined && playerDirection !== undefined) {
                nextDirection = playerDirection;
            }

            // 移動してみる
            if (nextDirection !== undefined) {
                if (this.canMove(nextDirection)) {
                    this.move(nextDirection, currentFrame);
                }
            }
        } else {
            this.charge();
        }

        this.roomId = Util.findRoomId(this.position());
        this.footPrint.resolveFootprintPerFrame(currentFrame);

        this.updateDebugData();
    }

    getFootPrint() {
        return this.footPrint;
    }

    updateDebugData() {
        DebugDataMediator.setPlayerDebugValue(this.getPlayerDebugValueData());
    }

    private getPlayerDebugValueData() {
        return {
            chargeAmount: this.chargeAmount,
            position: this.position(),
            roomId: this.roomId,
            lastMoveDirection: this.lastMoveDirection
        };
    }

    private canMove(direction: DIRECTION) {
        const nextPosition = Util.calculateNextPosition(this.position(), direction);
        if (GameConstants.FIELD[nextPosition.row][nextPosition.column] === 1) {
            return false;
        }
        return true;
    }

    private move(direction: DIRECTION, currentFrame: number) {
        const nextPosition = Util.calculateNextPosition(this.position(), direction);
        this.row = nextPosition.row;
        this.column = nextPosition.column;
        this.lastMoveDirection = direction;
        this.footPrint.push(this.position(), currentFrame);
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

    readonly getRoomId = () => {
        return this.roomId;
    }

    handleCollisionWith(actor: IFieldActor) {
        if (Util.isSamePosition(this.position(), actor.position())) {
            actor.onCollideWithPlayer();
        }
    }
}