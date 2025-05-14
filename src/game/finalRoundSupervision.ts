import { ISingleRoundSupervision } from "./iSingleRoundSupervision";
import { Player } from "./player";
import { Treasure } from "./treasure";

export class FinalRoundSupervision implements ISingleRoundSupervision {
    private goal: Treasure;

    constructor(gameObjectFactory: Phaser.GameObjects.GameObjectFactory, initRow: number, initColumn: number) {
        this.goal = new Treasure(gameObjectFactory, 0xffa500, initRow, initColumn);
    }
    
    startRound(): void {
        this.setStateAppearance();
        this.draw();
    }
    
    interactWithPlayer(player: Player): void {
        if (player.position().row === this.goal.position().row && player.position().column === this.goal.position().column) {
            this.goal.setStateCollected();
            this.goal.clearDisplay();
        }
    }
    
    isRoundCompleted(): boolean {
        return this.goal.isCollected();
    }

    isFinalRound(): boolean {
        return true;
    }

    setStateAppearance() {
        this.goal.setStateAppearance();
    }

    draw() {
        this.goal.draw();
    }
}