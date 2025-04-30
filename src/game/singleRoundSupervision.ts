import { TreasuresSupervision } from "./treasuresSupervision";

export class SingleRoundSupervision {
    private treasuresSupervision: TreasuresSupervision;

    constructor() {
        this.treasuresSupervision = new TreasuresSupervision();
    }

    getTreasuresSupervision() {
        return this.treasuresSupervision;
    }
}