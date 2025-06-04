import { ISingleRoundSupervision } from "./iSingleRoundSupervision";
import * as GameConstants from "./gameConstants";
import { FinalRoundSupervision } from "./finalRoundSupervision";
import { TreasuresRoundSupervision } from "./treasuresRoundSupervision";

export class RoundsSupervision {
    private currentRound: number;
    private readonly singleRoundSupervisionList: ISingleRoundSupervision[];
    private readonly onGameCompleted: () => void;

    constructor(onGameCompleted: () => void) {
        this.currentRound = 0;
        this.onGameCompleted = onGameCompleted;
        // +1でファイナルラウンドに対応しているのは暫定
        const totalRounds = GameConstants.numberOfTreasuresRounds + 1;
        this.singleRoundSupervisionList = Array.from({ length: totalRounds }, (_, i) =>
            (i === totalRounds - 1) ? new FinalRoundSupervision() : new TreasuresRoundSupervision()
        );
    }

    setup() {
        for (const round of this.singleRoundSupervisionList) {
            round.setup();
        }
    }

    updateProgressPerFrame() {
        // 次ラウンド進行判断・次ラウンド進行
        if (this.isCompletedCurrentRound()) {
            if (this.isFinalRound()) {
                this.onGameCompleted();
            } else {
                this.advanceRound();
                this.getCurrentRoundSupervision().startRound();
            }
        }
    }

    getCurrentRound() {
        return this.currentRound;
    }

    isFinalRound = () => {
        return this.getCurrentRoundSupervision().isFinalRound();
    }

    private isCompletedCurrentRound() {
        return this.getCurrentRoundSupervision().isRoundCompleted();
    }

    private advanceRound() {
        if (!this.isFinalRound()) {
            this.currentRound++;
        }
    }

    getCurrentRoundSupervision() {
        return this.singleRoundSupervisionList[this.currentRound];
    }

    readonly extractCurrentAppearanceTreasures = () => {
        return this.getCurrentRoundSupervision().extractAppearanceTreasures();
    }
}