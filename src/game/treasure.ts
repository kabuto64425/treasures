import * as GameConstants from "./gameConstants";
import { IFieldActor } from "./iFieldActor";
import { RecorderMediator } from "./recoder";

export class Treasure implements IFieldActor {
    private readonly graphics: Phaser.GameObjects.Graphics;
    private readonly color: number;
    private row: number;
    private column: number;
    private state: number;

    // ファイナルランドのゴールかどうか。そもそもゴールと宝は扱いが別の気がするので、フラグで管理すべきか検討中
    private readonly isGoal;

    static readonly TREASURE_STATE = {
        NON_APPEARANCE: 0,
        APPEARANCE: 1,
        COLLECTED: 2,
    };

    constructor(gameObjectFactory: Phaser.GameObjects.GameObjectFactory, color: number, iniRow: number, iniColumn: number, isGoal: boolean) {
        this.graphics = gameObjectFactory.graphics();
        this.color = color;
        this.row = iniRow;
        this.column = iniColumn;
        this.state = Treasure.TREASURE_STATE.NON_APPEARANCE;
        this.isGoal = isGoal;
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

    place(row: number, column: number) {
        this.row = row;
        this.column = column;
    }

    draw() {
        this.graphics.clear();
        this.graphics.lineStyle(0, this.color);
        this.graphics.fillStyle(this.color);
        this.graphics.fillRect(this.column * GameConstants.GRID_SIZE, this.row * GameConstants.GRID_SIZE, GameConstants.GRID_SIZE, GameConstants.GRID_SIZE);
    }

    clearDisplay() {
        this.graphics.clear();
    }

    onCollideWithPlayer(): void {
        this.state = Treasure.TREASURE_STATE.COLLECTED;
        this.clearDisplay();
        if(!this.isGoal) {
            RecorderMediator.notifyTreasureCollected();
        }
    }
}
