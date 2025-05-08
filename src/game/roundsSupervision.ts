import { ISingleRoundSupervision } from "./iSingleRoundSupervision";

export class RoundsSupervision {
    private numberOfRounds: number;
    private currentRound: number;
    private singleRoundSupervisionList: ISingleRoundSupervision[];

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
        return this.getCurrentRoundSupervision().isRoundCompleted();
    }

    advanceRound() {
        if (!this.isFinalRound()) {
            this.currentRound++;
        }
    }

    getCurrentRoundSupervision() {
        return this.singleRoundSupervisionList[this.currentRound];
    }

    setRoundSupervision(round: number, singleRoundSupervision: ISingleRoundSupervision) {
        this.singleRoundSupervisionList[round] = singleRoundSupervision;
    }
}