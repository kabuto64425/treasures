import * as GameConstants from "./gameConstants"
import { GameScene } from "./gameScene";

export class Ui {
    private scene: GameScene;
    private uiLayer: Phaser.GameObjects.Layer;
    //private timeText: Phaser.GameObjects.BitmapText | undefined;
    private retry: Phaser.GameObjects.Image;
    private deleteRecord: Phaser.GameObjects.Image;

    private bestRecordText: Phaser.GameObjects.BitmapText | undefined;

    constructor(scene: GameScene) {
        this.scene = scene;
        this.uiLayer = scene.add.layer();
        this.uiLayer.setDepth(100);

        this.retry = scene.make.image({ x: 800, y: 550, key: 'retry' }, false);
        this.uiLayer.add(this.retry);

        this.deleteRecord = scene.make.image({ x: 1000, y: 550, key: 'retry' }, false);
        this.uiLayer.add(this.deleteRecord);
    }

    setupRetryButton() {
        this.retry.setInteractive();

        this.retry.on('pointerover', () => this.retry.setTint(0x44ff44));
        this.retry.on('pointerout', () => this.retry.clearTint());

        const gameSceneGeneralSupervision = this.scene.getGeneralSupervision();

        this.retry.on('pointerdown', () => {
            if (gameSceneGeneralSupervision.isGamePlayed()) {
                this.scene.scene.restart();
            }
        });
    }

    setupDeleteRecordButton() {
        this.deleteRecord.setInteractive();

        this.deleteRecord.on('pointerover', () => this.deleteRecord.setTint(0x44ff44));
        this.deleteRecord.on('pointerout', () => this.deleteRecord.clearTint());

        this.deleteRecord.on('pointerdown', () => {
            this.scene.getBestRecord().deleteBestRecord();
            this.updateBestRecordText();
        });
    }

    updateBestRecordText() {
        const bestRecord = this.scene.getBestRecord();

        // 総宝数の取得方法は暫定
        const numberOfTreasuresInALLRounds = GameConstants.numberOfTreasures *(GameConstants.numberOfRounds - 1) + 1;
        this.bestRecordText!.setText(bestRecord.createBestRecordStr(numberOfTreasuresInALLRounds));
    }
}