import { ISingleRoundSupervision } from "./iSingleRoundSupervision";
import { Player } from "./player";
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

    interactWithPlayer(player: Player): void {
        for (const treasure of this.extractAppearanceTreasureList()) {
            if (player.position().row === treasure.position().row && player.position().column === treasure.position().column) {
                treasure.setStateCollected();
                treasure.clearDisplay();
                player.addNumberOfCollectedTreasures();
            }
        }
    }

    isRoundCompleted(): boolean {
        return this.areAllTreasuresCollected();
    }

    isFinalRound(): boolean {
        return false;
    }

    private extractAppearanceTreasureList() {
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