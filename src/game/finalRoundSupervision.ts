import { ISingleRoundSupervision } from "./iSingleRoundSupervision";
import { Treasure } from "./treasure";
import * as GameConstants from "./gameConstants";

export class FinalRoundSupervision implements ISingleRoundSupervision {
    private readonly goal: Treasure;

    constructor() {
        this.goal = new Treasure(0xffa500, true);
    }

    setup(): void {
        this.setupGoalPosition();
    }

    private setupGoalPosition() {
        this.goal.setup(GameConstants.goalPosition);
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