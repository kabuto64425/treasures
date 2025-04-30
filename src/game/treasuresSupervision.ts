import { Treasure } from "./treasure";

export class TreasuresSupervision {
    private treasureList: Treasure[];
    private numberOfTreasures: number;

    constructor() {
        this.treasureList = [];
        this.numberOfTreasures = 0;
    }

    addTreasure(treasure: Treasure) {
        this.treasureList.push(treasure);
        this.numberOfTreasures++;
    }

    getTreasureList() {
        return this.treasureList;
    }

    extractAppearanceTreasureList() {
        return this.treasureList.filter(t => t.isAppearance());
    }

    getNumberOfTreasures() {
        return this.numberOfTreasures;
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
