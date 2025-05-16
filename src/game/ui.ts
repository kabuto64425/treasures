import * as Utils from "./utils"
import * as GameConstants from "./gameConstants";
import { BestRecord } from "./bestRecord";
import { GameSceneGeneralSupervision } from "./gameSceneGeneralSupervision";
import { RetryLongButton } from "./retryLongButton";

export class Ui {
    private readonly clock: Phaser.Time.Clock;
    private readonly scenePlugin: Phaser.Scenes.ScenePlugin;

    private readonly uiLayer: Phaser.GameObjects.Layer;

    private readonly readyGoText: Phaser.GameObjects.BitmapText;

    private readonly timeText: Phaser.GameObjects.BitmapText;
    private readonly collectedTreasuresText: Phaser.GameObjects.BitmapText;

    private readonly gameOverText: Phaser.GameObjects.BitmapText;
    private readonly congratulationsText: Phaser.GameObjects.BitmapText;

    private readonly progressBox: Phaser.GameObjects.Graphics;
    private readonly progressBar: Phaser.GameObjects.Graphics;

    private readonly play: Phaser.GameObjects.Image;

    private timerEvent: Phaser.Time.TimerEvent;

    private readonly retryLongButton: RetryLongButton;

    private readonly deleteRecord: Phaser.GameObjects.Image;

    private readonly bestRecordText: Phaser.GameObjects.BitmapText;

    private readonly barWidth = 250;
    private readonly barHeight = 20;

    private readonly queryCurrentRecord: () => {
        elapsedFrame: number,
        numberOfCollectedTreasures: number
    };

    private readonly createBestRecordStr: () => string;
    private readonly deleteBestRecord: () => void;

    private readonly requestStartGame: () => void;

    // @ts-ignore 採用結果をもとに処理する方針なので、後で必ず使う
    private readonly queryAcceptedUiActionInfo: () => {
        isStartGameRequested: boolean,
        isRetryGameRequested: boolean
    };

    constructor(generalSupervision: GameSceneGeneralSupervision, gameObjectFactory: Phaser.GameObjects.GameObjectFactory, gameObjectCreator: Phaser.GameObjects.GameObjectCreator, clock: Phaser.Time.Clock, scenePlugin: Phaser.Scenes.ScenePlugin, bestRecord: BestRecord) {
        this.clock = clock;
        this.scenePlugin = scenePlugin;

        this.queryCurrentRecord = generalSupervision.queryCurrentRecord;

        this.createBestRecordStr = bestRecord.createBestRecordStr;
        this.deleteBestRecord = bestRecord.deleteBestRecord;

        this.requestStartGame = generalSupervision.getInputManager().requestStartGame;
        this.queryAcceptedUiActionInfo = generalSupervision.getInputManager().queryAcceptedUiActionInfo;

        this.uiLayer = gameObjectFactory.layer();
        this.uiLayer.setDepth(100);

        this.play = gameObjectCreator.image({ x: 214, y: 214, key: "play" }, false);
        this.uiLayer.add(this.play);

        this.timerEvent = new Phaser.Time.TimerEvent({
            delay: 0,
            repeat: GameConstants.FPS - 1,
            callbackScope: this,
            callback: function (this: Ui) {
                const remainingCount = this.timerEvent.getRepeatCount();
                const progress = remainingCount / GameConstants.FPS;

                this.progressBar.clear();
                this.progressBar.fillStyle(0xffff00, 0.8);
                this.progressBar.fillRect(0, 0, this.barWidth * progress, this.barHeight);

                if (remainingCount <= 0) {
                    this.readyGoText.setText("GO");
                    this.progressBar.destroy();
                    this.progressBox.destroy();

                    this.clock.delayedCall(GameConstants.READY_DISPLAY_DURATION, () => {
                        this.readyGoText.destroy();
                        generalSupervision.startGame();
                    });
                }
            },
        });

        this.readyGoText = gameObjectCreator.bitmapText({ x: 214, y: 214, font: "font", text: "READY" }, false);
        this.readyGoText.setVisible(false);
        this.uiLayer.add(this.readyGoText);

        this.progressBox = gameObjectCreator.graphics({ x: 214, y: 320 }, false);
        this.progressBox.setVisible(false);
        this.progressBox.fillStyle(0x222222, 0.8);
        this.progressBox.fillRect(0, 0, this.barWidth, this.barHeight);
        this.uiLayer.add(this.progressBox);

        this.progressBar = gameObjectCreator.graphics({ x: 214, y: 320 }, false);
        this.progressBar.setVisible(false);
        this.progressBar.fillStyle(0xffff00, 0.8);
        this.progressBar.fillRect(0, 0, this.barWidth, this.barHeight);
        this.uiLayer.add(this.progressBar);

        this.retryLongButton = new RetryLongButton(generalSupervision, this.uiLayer, this.clock, this.scenePlugin, gameObjectCreator);

        this.deleteRecord = gameObjectCreator.image({ x: 1000, y: 550, key: "delete" }, false);
        this.uiLayer.add(this.deleteRecord);

        this.timeText = gameObjectCreator.bitmapText({ x: 645, y: 10, font: "font", text: "0:00.000" }, false);
        this.uiLayer.add(this.timeText);

        this.collectedTreasuresText = gameObjectCreator.bitmapText({ x: 645, y: 92, font: "font", text: `0/${Utils.calculateNumberOfTreasuresInALLRounds()}` }, false);
        this.uiLayer.add(this.collectedTreasuresText);

        this.gameOverText = gameObjectCreator.bitmapText({ x: 645, y: 174, font: "font", text: "GAME OVER!" }, false);
        this.gameOverText.setVisible(false);
        this.uiLayer.add(this.gameOverText);

        this.congratulationsText = gameObjectCreator.bitmapText({ x: 645, y: 174, font: "font", text: "CONGRATULATIONS!" }, false);
        this.congratulationsText.setVisible(false);
        this.uiLayer.add(this.congratulationsText);

        const bestText = gameObjectCreator.bitmapText({ x: 645, y: 256, font: "font", text: "BEST" }, false);
        this.uiLayer.add(bestText);
        this.bestRecordText = gameObjectCreator.bitmapText({ x: 645, y: 338, font: "font", text: this.createBestRecordStr() }, false);
        this.uiLayer.add(this.bestRecordText);
    }

    setupPlayButton() {
        this.play.setInteractive();

        this.play.on("pointerover", () => this.play.setTint(0x44ff44));
        this.play.on("pointerout", () => this.play.clearTint());

        this.play.on("pointerup", () => {
            this.requestStartGame();
        });

        this.play.on("pointerup", () => {
            this.play.destroy();
            this.readyGoText.setVisible(true);
            this.progressBox.setVisible(true);
            this.progressBar.setVisible(true);

            this.clock.addEvent(this.timerEvent);
        });
    }

    setupRetryLongButton() {
        this.retryLongButton.setupButton();
    }

    setupDeleteRecordButton() {
        this.deleteRecord.setInteractive();

        this.deleteRecord.on("pointerover", () => this.deleteRecord.setTint(0x44ff44));
        this.deleteRecord.on("pointerout", () => this.deleteRecord.clearTint());

        this.deleteRecord.on("pointerdown", () => {
            this.deleteBestRecord();
            this.updateBestRecordText();
        });
    }

    updateTimeText() {
        this.timeText!.setText(`${Utils.createFormattedTimeFromFrame(this.queryCurrentRecord().elapsedFrame)}`);
    }

    updateCollectedTreasuresText() {
        const numberOfCollectedTreasures = this.queryCurrentRecord().numberOfCollectedTreasures;
        this.collectedTreasuresText!.setText(`${numberOfCollectedTreasures}/${Utils.calculateNumberOfTreasuresInALLRounds()}`);
    }

    updateBestRecordText() {
        this.bestRecordText.setText(this.createBestRecordStr());
    }

    showGameOverText() {
        this.gameOverText.setVisible(true);
    }

    showCongratulationsText() {
        this.congratulationsText.setVisible(true);
    }
}