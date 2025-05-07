import { ISingleRoundSupervision } from "./iSingleRoundSupervision";
import { Treasure } from "./treasure";

export class TreasuresRoundSupervision implements ISingleRoundSupervision {

    private treasureList: Treasure[];

    constructor(treasureList: readonly Treasure[]) {
        this.treasureList = [...treasureList];
    }

    isObjectiveMet(): boolean {
        return this.treasureList.every(t => t.isCollected());
    }

    extractAppearanceTreasureList() {
        return this.treasureList.filter(t => t.isAppearance());
    }

    setAllTreasuresStateAppearance() {
        this.treasureList.forEach(t => t.setStateAppearance());
    }

    drawAllTreasures() {
        this.treasureList.forEach(t => t.draw());
    }

    areAllTreasuresCollected() {
        return this.treasureList.every(t => t.isCollected());
    }
}