import { ISingleRoundSupervision } from "./iSingleRoundSupervision";
import { Treasure } from "./treasure";

export class TreasuresRoundSupervision implements ISingleRoundSupervision {

    private readonly treasureList: Treasure[];

    constructor(treasureList: readonly Treasure[]) {
        this.treasureList = [...treasureList];
    }

    startRound(): void {
        this.setAllTreasuresStateAppearance();
        this.drawAllTreasures();
    }

    isRoundCompleted(): boolean {
        return this.areAllTreasuresCollected();
    }

    isFinalRound(): boolean {
        return false;
    }

    extractAppearanceTreasures(): Treasure[] {
        return this.treasureList.filter(t => t.isAppearance());
    }

    private setAllTreasuresStateAppearance() {
        this.treasureList.forEach(t => t.setStateAppearance());
    }

    private drawAllTreasures() {
        this.treasureList.forEach(t => t.draw());
    }

    private areAllTreasuresCollected() {
        return this.treasureList.every(t => t.isCollected());
    }
}