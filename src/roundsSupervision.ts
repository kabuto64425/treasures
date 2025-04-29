import { SingleRoundSupervision } from "./game/singleRoundSupervision";

export class RoundsSupervision {
    private numberOfRounds: number;
    private currentRound: number;
    private singleRoundSupervisionList: SingleRoundSupervision[];

    constructor(numberOfRound: number) {
        this.numberOfRounds = numberOfRound;
        this.currentRound = 0;
        this.singleRoundSupervisionList = new Array(numberOfRound);
    }

    getCurrentRound() {
        return this.currentRound;
    }

    isFinalRound() {
        return this.currentRound === (this.numberOfRounds - 1);
    }

    isCompletedCurrentRound() {
        return this.getCurrentRoundSupervision().getTreasuresSupervision().areAllTreasuresCollected();
    }

    advanceRound() {
        if (!this.isFinalRound()) {
            this.currentRound++;
        }
    }

    getCurrentRoundSupervision() {
        return this.singleRoundSupervisionList[this.currentRound];
    }

    setRoundSupervision(round: number, singleRoundSupervision: SingleRoundSupervision) {
        this.singleRoundSupervisionList[round] = singleRoundSupervision;
    }

    queryNumberOfTreasuresInSingleRound(round: number) {
        return this.singleRoundSupervisionList[round].getTreasuresSupervision().getNumberOfTreasures();
    }

    queryNumberOfTreasuresInALLRounds() {
        return Array.from({ length: this.numberOfRounds }, (_, i) =>{
            console.log(this.queryNumberOfTreasuresInSingleRound(i));
            return this.queryNumberOfTreasuresInSingleRound(i);
        }).reduce((sum, treasures) => sum + treasures, 0);
    }
}