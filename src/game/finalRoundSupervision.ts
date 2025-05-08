import { GameScene } from "./gameScene";
import { ISingleRoundSupervision } from "./iSingleRoundSupervision";
import { Player } from "./player";
import { Treasure } from "./treasure";

export class FinalRoundSupervision implements ISingleRoundSupervision {
    private goal: Treasure;

    constructor(scene: GameScene, initRow: number, initColumn: number) {
        this.goal = new Treasure(scene, 0xffa500, initRow, initColumn);
    }
    
    startRound(): void {
        this.setStateAppearance();
        this.draw();
    }
    
    interactWithPlayer(player: Player): void {
        if (player.position().row === this.goal.position().row && player.position().column === this.goal.position().column) {
            this.goal.setStateCollected();
            this.goal.clearDisplay();
            player.addNumberOfCollectedTreasures();
        }
    }
    
    isRoundCompleted(): boolean {
        return this.goal.isCollected();
    }

    setStateAppearance() {
        this.goal.setStateAppearance();
    }

    draw() {
        this.goal.draw();
    }
}