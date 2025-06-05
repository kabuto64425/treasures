import * as GameConstants from "./gameConstants";
import { GameSceneContainerContext } from "./gameSceneContainerContext";
import { IFieldActor } from "./iFieldActor";
import { RecorderMediator } from "./recoder";
import { SceneContext } from "./sceneContext";
import { Position } from "./utils";

export class Treasure implements IFieldActor {
    private readonly image: Phaser.GameObjects.Image;
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
        this.image = SceneContext.make.image({ key: "dummy" }, false);
        this.graphics = SceneContext.make.graphics({}, false);
        this.color = color;
        this.state = Treasure.TREASURE_STATE.NON_APPEARANCE;
        this.isGoal = isGoal;
    }

    setup(position: Position) {
        this.setPosition(position);
        //GameSceneContainerContext.fieldContainer.add(this.graphics);
        GameSceneContainerContext.fieldContainer.add(this.image);
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
        if (this.isGoal) {
            this.image.setTexture("goal");
            this.image.setScale(1 / 26).setOrigin(-0.05, 0.2);
        } else {
            this.image.setTexture("treasure");
            this.image.setScale(1 / 20).setOrigin(-0.08, -0.05);
        }
        this.image.setPosition(this.column * GameConstants.GRID_SIZE, this.row * GameConstants.GRID_SIZE);
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
        this.image.destroy();
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
