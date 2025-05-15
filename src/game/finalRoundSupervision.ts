import { ISingleRoundSupervision } from "./iSingleRoundSupervision";
import { Treasure } from "./treasure";

export class FinalRoundSupervision implements ISingleRoundSupervision {
    private readonly goal: Treasure;

    constructor(gameObjectFactory: Phaser.GameObjects.GameObjectFactory, initRow: number, initColumn: number) {
        this.goal = new Treasure(gameObjectFactory, 0xffa500, initRow, initColumn);
    }
    
    startRound(): void {
        this.setStateAppearance();
        this.draw();
    }
    
    isRoundCompleted(): boolean {
        return this.goal.isCollected();
    }

    isFinalRound(): boolean {
        return true;
    }

    extractAppearanceTreasures(): Treasure[] {
        return [this.goal];
    }

    private setStateAppearance() {
        this.goal.setStateAppearance();
    }

    private draw() {
        this.goal.draw();
    }
}