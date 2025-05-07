import { GameScene } from "./gameScene";
import { ISingleRoundSupervision } from "./iSingleRoundSupervision";
import { Treasure } from "./treasure";

export class FinalRoundSupervision implements ISingleRoundSupervision {
    private goal: Treasure;

    constructor(scene: GameScene, initRow: number, initColumn: number) {
        this.goal = new Treasure(scene, 0xffa500, initRow, initColumn);
    }

    isObjectiveMet(): boolean {
        return this.goal.isCollected();
    }

    setStateAppearance() {
        this.goal.setStateAppearance();
    }

    draw() {
        this.goal.draw();
    }
}