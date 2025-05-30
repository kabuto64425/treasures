import { ISingleRoundSupervision } from "./iSingleRoundSupervision";
import { Treasure } from "./treasure";
import * as GameConstants from "./gameConstants";

export class FinalRoundSupervision implements ISingleRoundSupervision {
    private readonly goal: Treasure;

    constructor() {
        this.goal = new Treasure(0xffa500, true);
    }

    setup(fieldContainer: Phaser.GameObjects.Container): void {
        this.setupGoalPosition(fieldContainer);
    }

    private setupGoalPosition(fieldContainer: Phaser.GameObjects.Container) {
        this.goal.setup(fieldContainer, GameConstants.goalPosition);
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

    handlePause(): void {
        this.goal.hide();
    }

    handleResume(): void {
        this.goal.show();
    }

    private setStateAppearance() {
        this.goal.setStateAppearance();
    }

    private draw() {
        this.goal.draw();
    }
}