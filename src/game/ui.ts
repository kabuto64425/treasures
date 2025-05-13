import { GameScene } from "./gameScene";
import * as Utils from "./utils"
import * as GameConstants from "./gameConstants";

export class Ui {
    private scene: GameScene;
    private uiLayer: Phaser.GameObjects.Layer;

    private readyGoText: Phaser.GameObjects.BitmapText;

    private timeText: Phaser.GameObjects.BitmapText;
    private collectedTreasuresText: Phaser.GameObjects.BitmapText;

    private gameOverText: Phaser.GameObjects.BitmapText;
    private congratulationsText: Phaser.GameObjects.BitmapText;

    private progressBox: Phaser.GameObjects.Graphics;
    private progressBar: Phaser.GameObjects.Graphics;

    private play: Phaser.GameObjects.Image;

    private timerEvent: Phaser.Time.TimerEvent;

    private retry: Phaser.GameObjects.Image;
    private deleteRecord: Phaser.GameObjects.Image;

    private bestRecordText: Phaser.GameObjects.BitmapText;

    private barWidth = 250;
    private barHeight = 20;

    constructor(scene: GameScene) {
        this.scene = scene;
        this.uiLayer = scene.add.layer();
        this.uiLayer.setDepth(100);

        this.play = scene.make.image({ x: 214, y: 214, key: "play" }, false);
        this.uiLayer.add(this.play);

        this.timerEvent = new Phaser.Time.TimerEvent({
            delay: 0,
            repeat: 60 - 1,
            callbackScope: this,
            callback: function (this: Ui) {
                const current = this.timerEvent.getRepeatCount(); // 0〜59
                const progress = current / 60;

                this.progressBar.clear();
                this.progressBar.fillStyle(0xffff00, 0.8);
                this.progressBar.fillRect(0, 0, this.barWidth * progress, this.barHeight);

                if (current === 0) {
                    this.readyGoText.setText("GO");
                    this.progressBar.destroy();
                    this.progressBox.destroy();

                    this.scene.time.delayedCall(GameConstants.READY_DISPLAY_DURATION, () => {
                        this.readyGoText.destroy();
                        this.scene.getGeneralSupervision().startGame();
                    });
                }
            },
        });

        this.readyGoText = scene.make.bitmapText({ x: 214, y: 214, font: "font", text: "READY" }, false);
        this.readyGoText.setVisible(false);
        this.uiLayer.add(this.readyGoText);

        this.progressBox = scene.make.graphics({ x: 214, y: 320 }, false);
        this.progressBox.setVisible(false);
        this.progressBox.fillStyle(0x222222, 0.8);
        this.progressBox.fillRect(0, 0, this.barWidth, this.barHeight);
        this.uiLayer.add(this.progressBox);

        this.progressBar = scene.make.graphics({ x: 214, y: 320 }, false);
        this.progressBar.setVisible(false);
        this.progressBar.fillStyle(0xffff00, 0.8);
        this.progressBar.fillRect(0, 0, this.barWidth, this.barHeight);
        this.uiLayer.add(this.progressBar);

        this.retry = scene.make.image({ x: 800, y: 550, key: "retry" }, false);
        this.uiLayer.add(this.retry);

        this.deleteRecord = scene.make.image({ x: 1000, y: 550, key: "delete" }, false);
        this.uiLayer.add(this.deleteRecord);

        this.timeText = scene.make.bitmapText({ x: 645, y: 50, font: "font", text: "0:00.000" }, false);
        this.uiLayer.add(this.timeText);

        this.collectedTreasuresText = scene.make.bitmapText({ x: 645, y: 132, font: "font", text: `0/${Utils.calculateNumberOfTreasuresInALLRounds()}` }, false);
        this.uiLayer.add(this.collectedTreasuresText);

        this.gameOverText = scene.make.bitmapText({ x: 645, y: 214, font: "font", text: "GAME OVER!" }, false);
        this.gameOverText.setVisible(false);
        this.uiLayer.add(this.gameOverText);

        this.congratulationsText = scene.make.bitmapText({ x: 645, y: 214, font: "font", text: "CONGRATULATIONS!" }, false);
        this.congratulationsText.setVisible(false);
        this.uiLayer.add(this.congratulationsText);

        const bestText = scene.make.bitmapText({ x: 645, y: 296, font: "font", text: "BEST" }, false);
        this.uiLayer.add(bestText);
        this.bestRecordText = scene.make.bitmapText({ x: 645, y: 378, font: "font", text: this.scene.getBestRecord().createBestRecordStr() }, false);
        this.uiLayer.add(this.bestRecordText);
    }

    setupPlayButton() {
        this.play.setInteractive();

        this.play.on("pointerover", () => this.play.setTint(0x44ff44));
        this.play.on("pointerout", () => this.play.clearTint());

        this.play.on("pointerdown", () => {
            this.play.destroy();
            this.readyGoText.setVisible(true);
            this.progressBox.setVisible(true);
            this.progressBar.setVisible(true);

            this.scene.time.addEvent(this.timerEvent);
        });
    }

    setupRetryButton() {
        this.retry.setInteractive();

        this.retry.on("pointerover", () => this.retry.setTint(0x44ff44));
        this.retry.on("pointerout", () => this.retry.clearTint());

        const gameSceneGeneralSupervision = this.scene.getGeneralSupervision();

        this.retry.on("pointerdown", () => {
            if (gameSceneGeneralSupervision.isGamePlayed()) {
                this.scene.scene.restart();
            }
        });
    }

    setupDeleteRecordButton() {
        this.deleteRecord.setInteractive();

        this.deleteRecord.on("pointerover", () => this.deleteRecord.setTint(0x44ff44));
        this.deleteRecord.on("pointerout", () => this.deleteRecord.clearTint());

        this.deleteRecord.on("pointerdown", () => {
            this.scene.getBestRecord().deleteBestRecord();
            this.updateBestRecordText();
        });
    }

    updateTimeText() {
        this.timeText!.setText(`${Utils.createFormattedTimeFromFrame(this.scene.getGeneralSupervision().getElapsedFrame())}`);
    }

    updateCollectedTreasuresText() {
        const numberOfCollectedTreasures = this.scene.getGeneralSupervision().queryNumberOfCollectedTreasures();
        this.collectedTreasuresText!.setText(`${numberOfCollectedTreasures}/${Utils.calculateNumberOfTreasuresInALLRounds()}`);
    }

    updateBestRecordText() {
        this.bestRecordText.setText(this.scene.getBestRecord().createBestRecordStr());
    }

    showGameOverText() {
        this.gameOverText.setVisible(true);
    }

    showCongratulationsText() {
        this.congratulationsText.setVisible(true);
    }
}