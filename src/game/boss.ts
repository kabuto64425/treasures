import * as Util from "./utils";
import { GameSceneContainerContext } from "./gameSceneContainerContext";
import { IFieldActor } from "./iFieldActor";
import { SceneContext } from "./sceneContext";
import * as GameConstants from "./gameConstants";
import { DIRECTION } from "./drection";
import { Enemy } from "./enemy";

export class Boss implements IFieldActor {
    private readonly image: Phaser.GameObjects.Image;
    private row: number;
    private column: number;
    private chargeAmount: number;
    private readonly size: number;
    private readonly cost: number;

    private readonly onPlayerCaptured: () => void;
    private readonly isShortestDirection: (from: Util.Position, to: Util.Position, size: number, direction: DIRECTION) => boolean;
    private readonly playerPotision: () => Util.Position;
    private readonly getEnemyList: () => Enemy[];
    private readonly getBossList: () => Boss[];
    private readonly isAllFloorInArea: (position: Util.Position, size: number) => boolean;

    constructor(iniRow: number, iniColumn: number, onPlayerCaptured: () => void,
        isShortestDirection: (from: Util.Position, to: Util.Position, size: number, direction: DIRECTION) => boolean,
        playerPotision: () => Util.Position,
        getEnemyList: () => Enemy[], getBossList: () => Boss[], isAllFloorInArea: (position: Util.Position, size:number) => boolean
    ) {
        this.image = SceneContext.make.image({ key: "enemy" }, false);
        this.image.setDepth(10);
        this.row = iniRow;
        this.column = iniColumn;
        this.onPlayerCaptured = onPlayerCaptured;
        this.isShortestDirection = isShortestDirection;
        this.playerPotision = playerPotision;
        this.getEnemyList = getEnemyList;
        this.getBossList = getBossList;
        this.isAllFloorInArea = isAllFloorInArea;
        this.size = 3;
        this.cost = 20;

        this.chargeAmount = 0;
    }

    position(): { row: number; column: number; } {
        return { row: this.row, column: this.column };
    }

    getSize(): number {
        return this.size;
    }

    charge() {
        this.chargeAmount++;
    }

    setup() {
        GameSceneContainerContext.fieldContainer.add(this.image);
        this.image.setPosition(this.column * GameConstants.GRID_UNIT_SIZE, this.row * GameConstants.GRID_UNIT_SIZE);
        // 1ピクセル左にずらすとうまく収まるから。不都合があればまた調整
        this.image.setDisplayOrigin(1, 0);
        this.image.setScale(this.size);
        this.draw();
    }

    resolveBossFrame() {
        if (this.isChargeCompleted()) {
            const tagetPosition = this.playerPotision();
            const firstDirection = this.decideMoveDirection(tagetPosition);
            if (firstDirection !== undefined) {
                // 基本は最短方向に移動するが、敵同士が互いに衝突した場合に備えて、
                // 時計回りで移動できる方向を調べて移動することで移動先を譲れるようにする
                for (const d of firstDirection.clockwiseFrom()) {
                    if (this.canMove(d)) {
                        this.move(d);
                        break;
                    }
                }
            }
        } else {
            this.charge();
        }

        this.draw();
    }

    private canMove(direction: DIRECTION | undefined) {
        if (direction === undefined) {
            return false;
        }
        const nextPosition = Util.calculateNextPosition(this.position(), direction);
        // 他の敵との衝突回避
        for (const enemy of this.getEnemyList()) {
            if (Util.checkCollision(nextPosition, this.size, enemy.position(), enemy.getSize())) {
                return false;
            }
        }
        for (const boss of this.getBossList()) {
            if (this !== boss) {
                if (Util.checkCollision(nextPosition, this.size, boss.position(), boss.getSize())) {
                    return false;
                }
            }
        }
        if (!this.isAllFloorInArea({ row: nextPosition.row, column: nextPosition.column }, this.size)) {
            return false;
        }
        return true;
    }

    private move(direction: DIRECTION | undefined) {
        if (direction === undefined) {
            return;
        }
        const nextPosition = Util.calculateNextPosition(this.position(), direction);
        this.row = nextPosition.row;
        this.column = nextPosition.column;
        this.chargeAmount = 0;
    }

    private isChargeCompleted() {
        return this.chargeAmount >= this.cost;
    }

    private draw() {
        this.image.setPosition(this.column * GameConstants.GRID_UNIT_SIZE, this.row * GameConstants.GRID_UNIT_SIZE);
    }

    show() {
        this.image.setVisible(true);
    }

    hide() {
        this.image.setVisible(false);
    }

    onCollideWithPlayer(): void {
        this.onPlayerCaptured();
    }

    private decideMoveDirection(targetPosition: Util.Position) {
        for (const d of DIRECTION.values()) {
            if (this.isShortestDirection({ row: this.row, column: this.column }, targetPosition, this.size, d)) {
                return d;
            }
        }
        return undefined;
    }
}