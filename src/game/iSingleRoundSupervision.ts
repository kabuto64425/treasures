import { Player } from "./player";

export interface ISingleRoundSupervision {
    startRound(): void;
    interactWithPlayer(player : Player): void;
    isRoundCompleted(): boolean;
    isFinalRound(): boolean;
}