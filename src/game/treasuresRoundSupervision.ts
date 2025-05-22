import { ISingleRoundSupervision } from "./iSingleRoundSupervision";
import { Treasure } from "./treasure";
import * as GameConstants from "./gameConstants";

export class TreasuresRoundSupervision implements ISingleRoundSupervision {

    private readonly treasureList: Treasure[];

    constructor(gameObjectFactory: Phaser.GameObjects.GameObjectFactory) {
        this.treasureList = Array.from({ length: GameConstants.numberOfTreasuresRounds }, _ => {
            return new Treasure(gameObjectFactory, 0xffff00, false);
        });
    }
    
    setup(): void {
        this.setupTreasurePositions();
    }

    private setupTreasurePositions() {
        for (const treasure of this.treasureList) {
            let treasurePos = { row: Math.floor(Math.random() * GameConstants.H), column: Math.floor(Math.random() * GameConstants.W) };
            // 壁が存在するところに宝を配置しないようにする
            while (GameConstants.FIELD[treasurePos.row][treasurePos.column] === 1) {
                treasurePos = { row: Math.floor(Math.random() * GameConstants.H), column: Math.floor(Math.random() * GameConstants.W) };
            }
            treasure.setPosition(treasurePos);
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