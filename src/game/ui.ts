import { GameSceneGeneralSupervision } from "./gameSceneGeneralSupervision";
import { GameScene } from "./gameScene";

export class Ui {
    private uiLayer: Phaser.GameObjects.Layer;
    //private timeText: Phaser.GameObjects.BitmapText | undefined;
    private retry: Phaser.GameObjects.Image;
    private clearRecord: Phaser.GameObjects.Image;

    constructor(scene: GameScene) {
        this.uiLayer = scene.add.layer();
        this.uiLayer.setDepth(100);

        this.retry = scene.make.image({ x: 800, y: 550, key: 'retry' }, false);
        this.uiLayer.add(this.retry);

        this.clearRecord = scene.make.image({ x: 1000, y: 550, key: 'retry' }, false);
        this.uiLayer.add(this.clearRecord);
    }

    setupRetryButton(generalSupervision : GameSceneGeneralSupervision) {
        this.retry.setInteractive();

        this.retry.on('pointerover', () => this.retry.setTint(0x44ff44));
        this.retry.on('pointerout', () => this.retry.clearTint());

        this.retry.on('pointerdown', () => {
            if (generalSupervision.isGamePlayed()) {
                generalSupervision.getScene().scene.restart();
            }
        });
    }

    setuoClearRecordButton() {
        this.clearRecord.setInteractive();

        this.clearRecord.on('pointerover', () => this.clearRecord.setTint(0x44ff44));
        this.clearRecord.on('pointerout', () => this.clearRecord.clearTint());

        /*this.clearRecord.on('pointerdown', () => {
            this.bestRecord.deleteBestRecord();
            this.updateBestRecordText();
        });*/
    }
}