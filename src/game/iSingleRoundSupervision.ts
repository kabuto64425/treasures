import { IFieldActor } from "./iFieldActor";

export interface ISingleRoundSupervision {
    // 宝の配置などに使う
    setup(): void;

    startRound(): void;
    isRoundCompleted(): boolean;
    isFinalRound(): boolean;
    extractAppearanceTreasures(): IFieldActor[];
    handlePause(): void;
    handleResume(): void;
}