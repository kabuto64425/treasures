import * as GameConstants from "./gameConstants";
import { IFieldActor } from "./iFieldActor";
import { RecorderMediator } from "./recoder";
import { SceneContext } from "./sceneContext";
import { Position } from "./utils";

export class Treasure implements IFieldActor {
    private readonly graphics: Phaser.GameObjects.Graphics;
    private readonly color: number;
    // undefinedのまま呼び出すとエラー・バグになるので注意!!
    private row!: number;
    private column!: number;
    private state: number;

    // ファイナルランドのゴールかどうか。そもそもゴールと宝は扱いが別の気がするので、フラグで管理すべきか検討中
    private readonly isGoal;

    static readonly TREASURE_STATE = {
        NON_APPEARANCE: 0,
        APPEARANCE: 1,
        COLLECTED: 2,
    };

    constructor(color: number, isGoal: boolean) {
        this.graphics = SceneContext.make.graphics({});
        this.color = color;
        this.state = Treasure.TREASURE_STATE.NON_APPEARANCE;
        this.isGoal = isGoal;
    }

    setup(fieldContainer: Phaser.GameObjects.Container, position: Position) {
        fieldContainer.add(this.graphics);
        this.setPosition(position);
    }

    // 位置情報が取得される前にかならずこのメソッドを呼び出す
    private setPosition(position: Position) {
        this.row = position.row;
        this.column = position.column;
    }

    position() {
        return { row: this.row, column: this.column };
    }

    setStateAppearance() {
        this.state = Treasure.TREASURE_STATE.APPEARANCE;
    }

    setStateCollected() {
        this.state = Treasure.TREASURE_STATE.COLLECTED;
    }

    isAppearance() {
        return this.state === Treasure.TREASURE_STATE.APPEARANCE;
    }

    isCollected() {
        return this.state === Treasure.TREASURE_STATE.COLLECTED;
    }

    draw() {
        this.graphics.clear();
        this.graphics.lineStyle(0, this.color);
        this.graphics.fillStyle(this.color);
        this.graphics.fillRect(this.column * GameConstants.GRID_SIZE, this.row * GameConstants.GRID_SIZE, GameConstants.GRID_SIZE, GameConstants.GRID_SIZE);
    }

    show() {
        this.graphics.setVisible(true);
    }

    hide() {
        this.graphics.setVisible(false);
    }

    private clearDisplay() {
        this.graphics.clear();
    }

    onCollideWithPlayer(): void {
        this.state = Treasure.TREASURE_STATE.COLLECTED;
        this.clearDisplay();
        if (!this.isGoal) {
            RecorderMediator.notifyTreasureCollected();
        }
    }
}
