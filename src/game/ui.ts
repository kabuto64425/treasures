import * as Util from "./utils"
import * as GameConstants from "./gameConstants";
import { BestRecord } from "./bestRecord";
import { GameSceneGeneralSupervision } from "./gameSceneGeneralSupervision";
import { RestartButton } from "./restartButton";
import { Logger } from "./logger";

import { JSX as JSXDom } from "jsx-dom";
import { SceneContext } from "./sceneContext";
import { DeleteBestRecordButton } from "./deleteBestRecordButton";

declare global {
    namespace JSX {
        interface IntrinsicElements extends JSXDom.IntrinsicElements { }
        interface Element extends HTMLElement { }
    }
}

export class Ui {
    private readonly clock: Phaser.Time.Clock;

    // コンテナ内でaddしたものの表示順は、depthに関係なく後からaddしたものが前に来るので注意
    private readonly uiContainer: Phaser.GameObjects.Container;

    private readonly readyGoText: Phaser.GameObjects.BitmapText;

    private readonly timeText: Phaser.GameObjects.BitmapText;
    private readonly collectedTreasuresText: Phaser.GameObjects.BitmapText;

    private readonly gameOverText: Phaser.GameObjects.BitmapText;
    private readonly congratulationsText: Phaser.GameObjects.BitmapText;

    private readonly progressBox: Phaser.GameObjects.Graphics;
    private readonly progressBar: Phaser.GameObjects.Graphics;

    private readonly play: Phaser.GameObjects.Image;

    private timerEvent: Phaser.Time.TimerEvent;

    private readonly pause: Phaser.GameObjects.Image;

    private readonly restartButton: RestartButton;
    private readonly deleteBestRecordButton: DeleteBestRecordButton;

    private readonly bestRecordText: Phaser.GameObjects.BitmapText;

    private readonly barWidth = 250;
    private readonly barHeight = 20;

    private readonly isStandby: () => boolean;
    private readonly setReady: () => void;

    private readonly pauseGame: () => void;
    private readonly resumeGame: () => void;

    private readonly isPlaying: () => boolean;
    private readonly isPause: () => boolean;

    private readonly queryCurrentRecord: () => {
        elapsedFrame: number,
        numberOfCollectedTreasures: number
    };

    private readonly createBestRecordStr: () => string;

    private readonly requestStartGameFromUi: () => void;
    private readonly requestPauseGameFromUi: () => void;

    private readonly getApprovedActionInfo: () => {
        startGame: boolean,
        pauseGame: boolean,
        retryGame: boolean,
        deleteBestRecord: boolean
    };

    constructor(generalSupervision: GameSceneGeneralSupervision,
        bestRecord: BestRecord) {
        this.clock = SceneContext.time;

        this.isStandby = generalSupervision.isStandby;
        this.setReady = generalSupervision.setReady;

        this.pauseGame = generalSupervision.pauseGame;
        this.resumeGame = generalSupervision.resumeGame;

        this.isPlaying = generalSupervision.isPlaying;
        this.isPause = generalSupervision.isPause;

        this.queryCurrentRecord = generalSupervision.queryCurrentRecord;

        this.createBestRecordStr = bestRecord.createBestRecordStr;

        this.requestStartGameFromUi = generalSupervision.getInputCoordinator().requestStartGameFromUi;
        this.requestPauseGameFromUi = generalSupervision.getInputCoordinator().requestPauseGameFromUi;
        this.getApprovedActionInfo = generalSupervision.getInputCoordinator().getApprovedActionInfo;

        this.uiContainer = SceneContext.add.container();
        this.uiContainer.setPosition(954, 0);
        this.uiContainer.setDepth(98);

        this.play = SceneContext.make.image({ x: 214, y: 214, key: "play" }, false);

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

        this.readyGoText = SceneContext.make.bitmapText({ x: 214, y: 214, font: "font", text: "READY" }, false);

        this.progressBox = SceneContext.make.graphics({ x: 214, y: 320 }, false);

        this.progressBar = SceneContext.make.graphics({ x: 214, y: 320 }, false);

        this.pause = SceneContext.make.image({ x: 46, y: 550, key: "pause" }, false);
        this.pause.setOrigin(0, 0);
        this.pause.setScale(0.5);
        this.uiContainer.add(this.pause);

        this.restartButton = new RestartButton(generalSupervision, { x: 146, y: 550 });

        this.deleteBestRecordButton = new DeleteBestRecordButton(bestRecord, generalSupervision, { x: 241, y: 550 });

        this.timeText = SceneContext.make.bitmapText({ x: 16, y: 10, font: "font", text: "0:00.000" }, false);
        this.timeText.setScale(0.4);
        this.uiContainer.add(this.timeText);

        this.collectedTreasuresText = SceneContext.make.bitmapText({ x: 16, y: 92, font: "font", text: `0/${Util.calculateNumberOfTreasuresInALLRounds()}` }, false);
        this.collectedTreasuresText.setScale(0.4);
        this.uiContainer.add(this.collectedTreasuresText);

        this.gameOverText = SceneContext.make.bitmapText({ x: 16, y: 174, font: "font", text: "GAME OVER!" }, false);
        this.gameOverText.setVisible(false);
        this.gameOverText.setScale(0.4);
        this.uiContainer.add(this.gameOverText);

        this.congratulationsText = SceneContext.make.bitmapText({ x: 16, y: 174, font: "font", text: "CONGRATULATIONS!" }, false);
        this.congratulationsText.setVisible(false);
        this.congratulationsText.setScale(0.4);
        this.uiContainer.add(this.congratulationsText);

        const bestText = SceneContext.make.bitmapText({ x: 16, y: 256, font: "font", text: "BEST" }, false);
        this.uiContainer.add(bestText);
        bestText.setScale(0.4);
        this.bestRecordText = SceneContext.make.bitmapText({ x: 16, y: 338, font: "font", text: this.createBestRecordStr() }, false);
        this.bestRecordText.setScale(0.4);
        this.uiContainer.add(this.bestRecordText);
    }

    setupPlayButton(fieldContainer: Phaser.GameObjects.Container) {
        this.play.setOrigin(0, 0);

        // プレイボタンはフィールド上に配置するから
        fieldContainer.add(this.play);
        this.play.setInteractive();

        this.play.on("pointerover", () => this.play.setTint(0x44ff44));
        this.play.on("pointerout", () => this.play.clearTint());

        this.play.on("pointerup", () => {
            this.requestStartGameFromUi();
        });

        this.pause.setInteractive();

        this.pause.on("pointerover", () => this.pause.setTint(0x44ff44));
        this.pause.on("pointerout", () => this.pause.clearTint());

        this.pause.on("pointerup", () => {
            this.requestPauseGameFromUi();
        });
    }

    setupReadyGoTextWithBar(fieldContainer: Phaser.GameObjects.Container) {
        this.readyGoText.setVisible(false);
        fieldContainer.add(this.readyGoText);

        this.progressBox.setVisible(false);
        this.progressBox.fillStyle(0x222222, 0.8);
        this.progressBox.fillRect(0, 0, this.barWidth, this.barHeight);
        fieldContainer.add(this.progressBox);

        this.progressBar.setVisible(false);
        this.progressBar.fillStyle(0xffff00, 0.8);
        this.progressBar.fillRect(0, 0, this.barWidth, this.barHeight);
        fieldContainer.add(this.progressBar);
    }

    setupRetryLongButton() {
        this.restartButton.setup(this.uiContainer);
    }

    setupDeleteBestRecordButton() {
        this.deleteBestRecordButton.setup(this.uiContainer);
    }

    handleApprovedAction() {
        const approvedActionInfo = this.getApprovedActionInfo();
        if (approvedActionInfo.startGame) {
            if (this.isStandby()) {
                Logger.debug("startgame");
                this.executeStartGameAction();
            }
        }

        if (approvedActionInfo.pauseGame) {
            if (this.isPlaying()) {
                Logger.debug("pause");
                this.pauseGame();
            } else if (this.isPause()) {
                Logger.debug("resume");
                this.resumeGame();
            }
        }

        this.restartButton.handleApprovedAction(approvedActionInfo.retryGame);
        this.deleteBestRecordButton.handleApprovedAction(approvedActionInfo.deleteBestRecord);
    }

    private executeStartGameAction() {
        this.setReady();
        this.play.destroy();
        this.readyGoText.setVisible(true);
        this.progressBox.setVisible(true);
        this.progressBar.setVisible(true);
        // ゲームスタートが承認された時点で削除ボタンを押せないようにしたいから
        this.deleteBestRecordButton.hide();

        this.clock.addEvent(this.timerEvent);
    }

    updateTimeText() {
        this.timeText.setText(`${Util.createFormattedTimeFromFrame(this.queryCurrentRecord().elapsedFrame)}`);
    }

    updateCollectedTreasuresText() {
        const numberOfCollectedTreasures = this.queryCurrentRecord().numberOfCollectedTreasures;
        this.collectedTreasuresText.setText(`${numberOfCollectedTreasures}/${Util.calculateNumberOfTreasuresInALLRounds()}`);
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