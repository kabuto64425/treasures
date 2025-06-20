import * as Util from "./utils";
import { GameSceneContainerContext } from "./gameSceneContainerContext";
import { IFieldActor } from "./iFieldActor";
import { SceneContext } from "./sceneContext";
import * as GameConstants from "./gameConstants";
import { DIRECTION } from "./drection";
import { Enemy } from "./enemy";
import { Position } from "./utils";

enum BossState {
    NON_APPEARANCE = 0,
    APPEARANCE = 1
};

export class Boss implements IFieldActor {
    private readonly image: Phaser.GameObjects.Image;
    private state: BossState;
    behaviorMap = {
        [BossState.NON_APPEARANCE]: new NonAppearanceBehavior(),
        [BossState.APPEARANCE]: new AppearanceBehavior()
    };

    private row: number;
    private column: number;
    private chargeAmount: number;
    private readonly size: number;
    private readonly cost: number;

    private readonly onPlayerCaptured: () => void;
    private readonly caluculatePointSymmetricPositions: () => Position[];
    private readonly isShortestDirection: (from: Util.Position, to: Util.Position, size: number, direction: DIRECTION) => boolean;
    private readonly isFinalRound: () => boolean;
    private readonly getEnemyList: () => Enemy[];
    private readonly getApperanceBossList: () => Boss[];
    private readonly isAllFloorInArea: (position: Util.Position, size: number) => boolean;

    constructor(iniRow: number, iniColumn: number,
        onPlayerCaptured: () => void,
        caluculatePointSymmetricPositions: () => Position[],
        isShortestDirection: (from: Util.Position, to: Util.Position, size: number, direction: DIRECTION) => boolean, isFinalRound: () => boolean,
        getEnemyList: () => Enemy[], getApperanceBossList: () => Boss[], isAllFloorInArea: (position: Util.Position, size: number) => boolean
    ) {
        this.image = SceneContext.make.image({ key: "enemy" }, false);
        this.image.setDepth(10);
        this.state = BossState.NON_APPEARANCE;
        this.row = iniRow;
        this.column = iniColumn;
        this.onPlayerCaptured = onPlayerCaptured;
        this.caluculatePointSymmetricPositions = caluculatePointSymmetricPositions;
        this.isShortestDirection = isShortestDirection;
        this.isFinalRound = isFinalRound;
        this.getEnemyList = getEnemyList;
        this.getApperanceBossList = getApperanceBossList;
        this.isAllFloorInArea = isAllFloorInArea;
        this.size = 3;
        this.cost = 12;

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
        this.image.setDisplayOrigin(1 / this.size, 0);
        this.image.setScale(this.size);
        this.hide();
        this.draw();
    }

    resolveBossFrame() {
        this.updateState();

        const behavior = this.behaviorMap[this.state];
        behavior.resolveFrame(this);
    }

    private updateState() {
        if(this.isAppearance()) {
            return;
        }
        if(!this.isFinalRound()) {
            return;
        }
        if(!this.isAllFloorInArea(this.position(), this.size)) {
            return;
        }
        if(!this.canPlaceAt(this.position())) {
            return;
        }
        this.state = BossState.APPEARANCE;
    }

    resolveFrameNonAppearance() {
        this.hide();

        this.draw();
    }

    resolveFrameAppearance() {
        this.show();

        if (this.isChargeCompleted()) {
            let firstDirection = undefined;

            // bossは、足跡とプレイヤーの位置関係から、目的地を決定する
            // 最後の足跡から順に目的候補を算出し、目的地候補に行けると分かったらその地点を目的地とする
            // プレイヤーの地点を中心に、ある足跡と点対象となる地点を目的地候補とする
            for (const position of this.caluculatePointSymmetricPositions()) {
                if (position.row < 0 || position.row >= GameConstants.H) {
                    continue;
                }
                if (position.column < 0 || position.column >= GameConstants.W) {
                    continue;
                }

                firstDirection = this.decideMoveDirection(position);
                if (firstDirection !== undefined) {
                    break;
                }
            }

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
        const nextPosition = Util.calculateNextPosition(this.position(), direction, false);
        if (nextPosition === undefined) {
            return false;
        }
        // 他の敵との衝突回避
        return this.canPlaceAt(nextPosition);
    }

    // 敵と衝突せず、かつそのポジションに壁や移動不可のものがないことを確認する
    private canPlaceAt(position : Util.Position) {
        // 他の敵との衝突回避
        for (const enemy of this.getEnemyList()) {
            if (Util.checkCollision(position, this.size, enemy.position(), enemy.getSize())) {
                return false;
            }
        }
        for (const boss of this.getApperanceBossList()) {
            if (this !== boss) {
                if (Util.checkCollision(position, this.size, boss.position(), boss.getSize())) {
                    return false;
                }
            }
        }
        if (!this.isAllFloorInArea(position, this.size)) {
            return false;
        }
        return true;
    }

    private move(direction: DIRECTION | undefined) {
        if (direction === undefined) {
            return;
        }
        // 移動先チェックをしているので、nextPositionは返ってくるはずだが、undefinedが万が一undefinedだった場合はそのままの位置にしておく
        const nextPosition = Util.calculateNextPosition(this.position(), direction, false) ?? this.position();
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

    private decideMoveDirection(targetPosition?: Util.Position) {
        if (targetPosition === undefined) {
            return undefined;
        }
        for (const d of DIRECTION.values()) {
            if (this.isShortestDirection({ row: this.row, column: this.column }, targetPosition, this.size, d)) {
                return d;
            }
        }
        return undefined;
    }

    readonly isAppearance = () => {
        return this.state === BossState.APPEARANCE;
    }
}

interface BossBehavior {
    resolveFrame(boss: Boss): void;
}

class NonAppearanceBehavior implements BossBehavior {
    resolveFrame(boss: Boss) {
        boss.resolveFrameNonAppearance();
    }
}

class AppearanceBehavior implements BossBehavior {
    resolveFrame(boss: Boss) {
        boss.resolveFrameAppearance();
    }
}