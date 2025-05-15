import { IFieldActor } from "./iFieldActor";

export interface ISingleRoundSupervision {
    startRound(): void;
    isRoundCompleted(): boolean;
    isFinalRound(): boolean;
    extractAppearanceTreasures(): IFieldActor[];
}