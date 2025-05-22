import { ISingleRoundSupervision } from "./iSingleRoundSupervision";
import * as GameConstants from "./gameConstants";
import { FinalRoundSupervision } from "./finalRoundSupervision";
import { TreasuresRoundSupervision } from "./treasuresRoundSupervision";

export class RoundsSupervision {
    private currentRound: number;
    private readonly singleRoundSupervisionList: ISingleRoundSupervision[];

    constructor(gameObjectFactory: Phaser.GameObjects.GameObjectFactory) {
        this.currentRound = 0;
        this.singleRoundSupervisionList = Array.from({ length: GameConstants.numberOfTreasuresRounds }, (_, i) =>
            (i === GameConstants.numberOfTreasuresRounds - 1)? new FinalRoundSupervision(gameObjectFactory) : new TreasuresRoundSupervision(gameObjectFactory)
        );
    }

    setup() {
        for(const round of this.singleRoundSupervisionList) {
            round.setup();
        }
    }

    // リファクタリングで、実装する
    updateProgressPerFrame() {
        
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