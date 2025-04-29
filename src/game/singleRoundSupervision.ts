import { TreasuresSupervision } from "./TreasuresSupervision";

export class SingleRoundSupervision {
    private treasuresSupervision: TreasuresSupervision;

    constructor() {
        this.treasuresSupervision = new TreasuresSupervision();
    }

    getTreasuresSupervision() {
        return this.treasuresSupervision;
    }
}