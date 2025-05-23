import { ISingleRoundSupervision } from "./iSingleRoundSupervision";
import * as GameConstants from "./gameConstants";
import { FinalRoundSupervision } from "./finalRoundSupervision";
import { TreasuresRoundSupervision } from "./treasuresRoundSupervision";

export class RoundsSupervision {
    private currentRound: number;
    private readonly singleRoundSupervisionList: ISingleRoundSupervision[];
    private readonly onGameCompleted: () => void;

    constructor(gameObjectFactory: Phaser.GameObjects.GameObjectFactory, onGameCompleted: () => void) {
        this.currentRound = 0;
        this.onGameCompleted = onGameCompleted;
        // +1でファイナルラウンドに対応しているのは暫定
        this.singleRoundSupervisionList = Array.from({ length: GameConstants.numberOfTreasuresRounds + 1 }, (_, i) =>
            (i === GameConstants.numberOfTreasuresRounds - 1)? new FinalRoundSupervision(gameObjectFactory) : new TreasuresRoundSupervision(gameObjectFactory)
        );
    }

    setup() {
        for(const round of this.singleRoundSupervisionList) {
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

    private isFinalRound() {
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
}