import { ISingleRoundSupervision } from "./iSingleRoundSupervision";
import { Treasure } from "./treasure";
import * as GameConstants from "./gameConstants";

export class FinalRoundSupervision implements ISingleRoundSupervision {
    private readonly goal: Treasure;
    private onFinalRoundForFieldSupervision: () => void;

    constructor(onFinalRoundForFieldSupervision: () => void) {
        this.goal = new Treasure(true);
        this.onFinalRoundForFieldSupervision = onFinalRoundForFieldSupervision;
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
        // ファイナルラウンドをフィールドに通知
        // ループ道を塞ぐため
        this.onFinalRoundForFieldSupervision();
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