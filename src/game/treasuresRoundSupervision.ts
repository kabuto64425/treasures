import { ISingleRoundSupervision } from "./iSingleRoundSupervision";
import { Treasure } from "./treasure";
import * as GameConstants from "./gameConstants";
import * as Util from "./utils";

export class TreasuresRoundSupervision implements ISingleRoundSupervision {

    private readonly treasureList: Treasure[];
    private readonly isFloor: (position: Util.Position) => boolean;

    constructor(isFloor: (position: Util.Position) => boolean) {
        this.isFloor = isFloor;
        this.treasureList = Array.from({ length: GameConstants.numberOfTreasuresPerRound }, _ => {
            return new Treasure(false);
        });
    }

    setup(): void {
        this.setupTreasures();
    }

    private setupTreasures() {
        GameConstants.FINAL_ROUND_BLOCK_POSITIONS;
        const excludedPositions = [...GameConstants.FINAL_ROUND_BLOCK_POSITIONS];

        const isExcludedPosition = (treasurePos: Util.Position) => {
            return excludedPositions.some(pos => {
                return pos.row === treasurePos.row && pos.column === treasurePos.column;
            });
        };

        for (const treasure of this.treasureList) {
            let treasurePos = { row: Math.floor(Math.random() * GameConstants.H), column: Math.floor(Math.random() * GameConstants.W) };
            // 床に宝を配置しないようにする
            while (!this.isFloor(treasurePos) || isExcludedPosition(treasurePos)) {
                treasurePos = { row: Math.floor(Math.random() * GameConstants.H), column: Math.floor(Math.random() * GameConstants.W) };
            }
            excludedPositions.push(treasurePos);
            treasure.setup(treasurePos);
        }
    }

    startRound(): void {
        this.setAllTreasuresStateAppearance();
        this.drawAllTreasures();
    }

    isRoundCompleted(): boolean {
        return this.areAllTreasuresCollected();
    }

    isFinalRound(): boolean {
        return false;
    }

    extractAppearanceTreasures(): Treasure[] {
        return this.treasureList.filter(t => t.isAppearance());
    }

    handlePause(): void {
        this.treasureList.forEach(treasure => {
            treasure.hide();
        });
    }

    handleResume(): void {
        this.treasureList.forEach(treasure => {
            treasure.show();
        });
    }

    private setAllTreasuresStateAppearance() {
        this.treasureList.forEach(t => t.setStateAppearance());
    }

    private drawAllTreasures() {
        this.treasureList.forEach(t => t.draw());
    }

    private areAllTreasuresCollected() {
        return this.treasureList.every(t => t.isCollected());
    }
}