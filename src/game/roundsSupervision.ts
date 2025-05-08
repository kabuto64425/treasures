import { ISingleRoundSupervision } from "./iSingleRoundSupervision";

export class RoundsSupervision {
    private currentRound: number;
    private singleRoundSupervisionList: ISingleRoundSupervision[];

    constructor(numberOfRound: number) {
        this.currentRound = 0;
        this.singleRoundSupervisionList = new Array(numberOfRound);
    }

    getCurrentRound() {
        return this.currentRound;
    }

    isFinalRound() {
        return this.getCurrentRoundSupervision().isFinalRound();
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