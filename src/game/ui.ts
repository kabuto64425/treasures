import { GameScene } from "./gameScene";

export class Ui {
    private scene: GameScene;
    private uiLayer: Phaser.GameObjects.Layer;
    //private timeText: Phaser.GameObjects.BitmapText | undefined;
    private retry: Phaser.GameObjects.Image;
    private deleteRecord: Phaser.GameObjects.Image;

    private bestRecordText: Phaser.GameObjects.BitmapText;

    constructor(scene: GameScene) {
        this.scene = scene;
        this.uiLayer = scene.add.layer();
        this.uiLayer.setDepth(100);

        this.retry = scene.make.image({ x: 800, y: 550, key: 'retry' }, false);
        this.uiLayer.add(this.retry);

        this.deleteRecord = scene.make.image({ x: 1000, y: 550, key: 'retry' }, false);
        this.uiLayer.add(this.deleteRecord);

        this.bestRecordText = scene.make.bitmapText({ x: 645, y: 296, font: "font", text: this.scene.getBestRecord().createBestRecordStr() }, false);
        this.uiLayer.add(this.bestRecordText);
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
        this.bestRecordText.setText(this.scene.getBestRecord().createBestRecordStr());
    }
}