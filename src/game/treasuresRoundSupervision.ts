import { ISingleRoundSupervision } from "./iSingleRoundSupervision";
import { Treasure } from "./treasure";
import * as GameConstants from "./gameConstants";
import * as Util from "./utils";
import { GameSceneSoundContext } from "./gameSceneSoundContext";
import { Logger } from "./logger";

export class TreasuresRoundSupervision implements ISingleRoundSupervision {

    private readonly roundIndex: number;
    private readonly treasureList: Treasure[];
    private readonly isFloor: (position: Util.Position) => boolean;

    constructor(roundIndex: number, isFloor: (position: Util.Position) => boolean) {
        this.roundIndex = roundIndex;
        this.isFloor = isFloor;
        this.treasureList = Array.from({ length: GameConstants.numberOfTreasuresPerRound }, _ => {
            return new Treasure(false);
        });
    }

    setup(): void {
        this.setupTreasures();
    }

    private setupTreasures() {
        const excludedPositions = [...GameConstants.FINAL_ROUND_BLOCK_POSITIONS];

        const isExcludedPosition = (treasurePos: Util.Position) => {
            return excludedPositions.some(pos => {
                return pos.row === treasurePos.row && pos.column === treasurePos.column;
            });
        };

        for (const [index, treasure] of this.treasureList.entries()) {
            const treasureRoomIdIndex = this.roundIndex * GameConstants.numberOfTreasuresPerRound + index;
            const treasureRoomId = GameConstants.TREASURE_ROOM_ID_LIST[treasureRoomIdIndex];
            const roomRowColumn = Util.calculateRoomRowColumn(treasureRoomId);
            
            const rowBorders = [0, ...GameConstants.ROOM_ROW_BORDERS, GameConstants.H];
            const columnBorders = [0, ...GameConstants.ROOM_COLUMN_BORDERS, GameConstants.W];

            const rowFrom = rowBorders[roomRowColumn.roomRow];
            const rowTo = rowBorders[roomRowColumn.roomRow + 1] - 1;

            const columFrom = columnBorders[roomRowColumn.roomColumn];
            const columTo = columnBorders[roomRowColumn.roomColumn + 1] - 1;
            Logger.debug([rowFrom, rowTo, columFrom, columTo]);

            let treasurePos = { row:  Phaser.Math.Between(rowFrom, rowTo), column: Phaser.Math.Between(columFrom, columTo) };
            // 床に宝を配置しないようにする
            while (!this.isFloor(treasurePos) || isExcludedPosition(treasurePos)) {
                treasurePos = { row:  Phaser.Math.Between(rowFrom, rowTo), column: Phaser.Math.Between(columFrom, columTo) };
            }
            excludedPositions.push(treasurePos);
            treasure.setup(treasurePos);
        }
    }

    startRound(): void {
        this.setAllTreasuresStateAppearance();
        this.drawAllTreasures();
        // ファーストラウンド以外は、ラウンドアップの効果音を流すようにしたいから
        if(this.roundIndex !== 0) {
            GameSceneSoundContext.playRoundUp();
        }
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