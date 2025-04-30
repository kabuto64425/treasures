import { GameScene } from "./gameScene";
import * as GameConstants from './gameConstants';

export class Treasure {
    private graphics: Phaser.GameObjects.Graphics;
    private color: number;
    private row: number;
    private column: number;
    private state: number;

    static readonly TREASURE_STATE = {
        NON_APPEARANCE: 0,
        APPEARANCE: 1,
        COLLECTED: 2,
    };

    constructor(scene: GameScene, color: number, iniRow: number, iniColumn: number) {
        this.graphics = scene.add.graphics();
        this.color = color;
        this.row = iniRow;
        this.column = iniColumn;
        this.state = Treasure.TREASURE_STATE.NON_APPEARANCE;
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
}
