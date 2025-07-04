import * as Util from "./utils"
import * as GameConstants from "./gameConstants";
import { BestRecord } from "./bestRecord";
import { GameSceneGeneralSupervision } from "./gameSceneGeneralSupervision";
import { RestartButton } from "./restartButton";
import { Logger } from "./logger";

import { JSX as JSXDom } from "jsx-dom";
import { SceneContext } from "./sceneContext";
import { DeleteBestRecordButton } from "./deleteBestRecordButton";
import { GameSceneContainerContext } from "./gameSceneContainerContext";
import { DebugDataMediator } from "./debugData";
import { GameSceneSoundContext } from "./gameSceneSoundContext";
import HelpModal from "../tsx/helpModal";
import { GameSceneOverlay } from "./gameSceneOverlay";

declare global {
    namespace JSX {
        interface IntrinsicElements extends JSXDom.IntrinsicElements { }
        interface Element extends HTMLElement { }
    }
}

const textStyle = {
    fontFamily: 'BestTen-CRT',
    fontSize: '18px',
    color: '#000000'
};

export class Ui {
    private readonly clock: Phaser.Time.Clock;

    // コンテナ内でaddしたものの表示順は、depthに関係なく後からaddしたものが前に来るので注意
    private readonly leftContainer: Phaser.GameObjects.Container;
    private readonly rightContainer: Phaser.GameObjects.Container;

    private readonly readyGoText: Phaser.GameObjects.Text;

    private readonly timeText: Phaser.GameObjects.Text;
    private readonly collectedTreasuresText: Phaser.GameObjects.Text;

    private readonly gameOverText: Phaser.GameObjects.Text;
    private readonly congratulationsText: Phaser.GameObjects.Text;

    private readonly progressBox: Phaser.GameObjects.Graphics;
    private readonly progressBar: Phaser.GameObjects.Graphics;

    private readonly play: Phaser.GameObjects.Image;

    private timerEvent: Phaser.Time.TimerEvent;

    private readonly pause: Phaser.GameObjects.Image;

    private readonly help: Phaser.GameObjects.Image;

    private readonly restartButton: RestartButton;
    private readonly deleteBestRecordButton: DeleteBestRecordButton;

    private readonly bestElapsedFrameText: Phaser.GameObjects.Text;
    private readonly bestNumberOfCollectedTreasuresText: Phaser.GameObjects.Text;

    private readonly newRecordText: Phaser.GameObjects.Text;

    private readonly helpModal: Phaser.GameObjects.DOMElement;

    private readonly barWidth = 415;
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

    private readonly getBestRecord: () => {
        numberOfCollectedTreasures: number,
        elapsedFrame: number | undefined
    };

    private readonly requestStartGameFromUi: () => void;
    private readonly requestPauseGameFromUi: () => void;

    private readonly getApprovedActionInfo: () => {
        startGame: boolean,
        pauseGame: boolean,
        retryGame: boolean,
        deleteBestRecord: boolean
    };

    constructor(generalSupervision: GameSceneGeneralSupervision, bestRecord: BestRecord) {
        this.clock = SceneContext.time;

        this.isStandby = generalSupervision.isStandby;
        this.setReady = generalSupervision.setReady;

        this.pauseGame = generalSupervision.pauseGame;
        this.resumeGame = generalSupervision.resumeGame;

        this.isPlaying = generalSupervision.isPlaying;
        this.isPause = generalSupervision.isPause;

        this.queryCurrentRecord = generalSupervision.queryCurrentRecord;

        this.getBestRecord = bestRecord.getBestRecord;

        this.requestStartGameFromUi = generalSupervision.getInputCoordinator().requestStartGameFromUi;
        this.requestPauseGameFromUi = generalSupervision.getInputCoordinator().requestPauseGameFromUi;
        this.getApprovedActionInfo = generalSupervision.getInputCoordinator().getApprovedActionInfo;

        this.leftContainer = GameSceneContainerContext.leftContainer;
        this.rightContainer = GameSceneContainerContext.rightContainer;

        this.play = SceneContext.make.image({ x: 405, y: 277, key: "play" }, false);
        this.play.setScale(0.5859375);

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
                    this.readyGoText.setX(360);
                    this.progressBar.destroy();
                    this.progressBox.destroy();
                    GameSceneSoundContext.playGo();

                    this.clock.delayedCall(GameConstants.READY_DISPLAY_DURATION, () => {
                        this.readyGoText.destroy();
                        this.help.destroy();
                        generalSupervision.startGame();
                        this.restartButton.show();
                        this.pause.setVisible(true);
                    });
                }
            },
        });

        this.readyGoText = SceneContext.make.text({
            x: 255, y: 250, text: "READY", style: {
                fontFamily: 'BestTen-CRT',
                fontSize: '128px',
                color: '#000000',
                strokeThickness: 27
            }
        }, false);

        this.progressBox = SceneContext.make.graphics({ x: 255, y: 403 }, false);

        this.progressBar = SceneContext.make.graphics({ x: 255, y: 403 }, false);

        this.pause = SceneContext.make.image({ x: 30, y: 390, key: "pause" }, false);

        this.help = SceneContext.make.image({ x: 30, y: 210, key: "help" }, false);

        this.restartButton = new RestartButton(generalSupervision, { x: 30, y: 210 });

        this.deleteBestRecordButton = new DeleteBestRecordButton(bestRecord, generalSupervision, { x: 30, y: 570 });

        this.timeText = SceneContext.make.text({ x: 5, y: 40, text: "0:00.000", style: textStyle }, false);
        this.rightContainer.add(this.timeText);

        this.collectedTreasuresText = SceneContext.make.text({ x: 5, y: 70, text: `0/${Util.calculateNumberOfTreasuresInALLRounds()}`, style: textStyle }, false);
        this.rightContainer.add(this.collectedTreasuresText);

        this.gameOverText = SceneContext.make.text({ x: 5, y: 100, text: "GAME OVER!", style: textStyle }, false);
        this.gameOverText.setVisible(false);
        this.rightContainer.add(this.gameOverText);

        this.congratulationsText = SceneContext.make.text({ x: 5, y: 100, text: "CONGRATULATIONS!", style: textStyle }, false);
        this.congratulationsText.setVisible(false);
        this.rightContainer.add(this.congratulationsText);

        const bestText = SceneContext.make.text({ x: 5, y: 10, text: "BEST", style: textStyle }, false);
        this.leftContainer.add(bestText);

        const bestRecordStrObj = this.createBestRecordStrObj();
        this.bestElapsedFrameText = SceneContext.make.text({ x: 5, y: 40, text: bestRecordStrObj.completeTime, style: textStyle }, false);
        this.leftContainer.add(this.bestElapsedFrameText);

        this.bestNumberOfCollectedTreasuresText = SceneContext.make.text({ x: 5, y: 70, text: bestRecordStrObj.numberOfCollectedTreasures, style: textStyle }, false);
        this.leftContainer.add(this.bestNumberOfCollectedTreasuresText);

        this.newRecordText = SceneContext.make.text({ x: 5, y: 100, text: "New Record!", style: textStyle }, false);
        this.newRecordText.setVisible(false);
        this.leftContainer.add(this.newRecordText);

        this.helpModal = SceneContext.add.dom(415, 290, HelpModal(
            () => {
                // ゲームリスタートで閉じたと見せかける。
                generalSupervision.restartGame();
            }
        ));
        this.helpModal.setOrigin(0, 0);
        this.helpModal.setVisible(false);
    }

    setupPlayButton() {
        this.play.setOrigin(0, 0);

        // プレイボタンはフィールド上に配置するから
        GameSceneContainerContext.fieldContainer.add(this.play);
        this.play.setInteractive();

        this.play.on("pointerover", () => this.play.setTint(0x44ff44));
        this.play.on("pointerout", () => this.play.clearTint());

        this.play.on("pointerup", () => {
            this.requestStartGameFromUi();
        });
    }

    setupPauseButton() {
        this.pause.setOrigin(0, 0);
        this.pause.setScale(0.449);
        this.rightContainer.add(this.pause);
        this.pause.setVisible(false);
        this.pause.setInteractive();

        this.pause.on("pointerover", () => this.pause.setTint(0x44ff44));
        this.pause.on("pointerout", () => this.pause.clearTint());

        this.pause.on("pointerup", () => {
            this.requestPauseGameFromUi();
        });
    }

    setupHelpButton() {
        this.help.setOrigin(0, 0);
        this.help.setScale(0.449);
        this.rightContainer.add(this.help);

        this.help.setInteractive();

        this.help.on("pointerover", () => this.help.setTint(0x44ff44));
        this.help.on("pointerout", () => this.help.clearTint());

        this.help.on("pointerup", () => {
            GameSceneOverlay.onShowModal();
            SceneContext.scenePlugin.pause();
            this.helpModal.setVisible(true);
        });
    }

    setupReadyGoTextWithBar() {
        const fieldContainer = GameSceneContainerContext.fieldContainer;
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

    setupRestartButton() {
        this.restartButton.setup(this.rightContainer);
    }

    setupDeleteBestRecordButton() {
        this.deleteBestRecordButton.setup(this.rightContainer);
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
        this.updateDebugData();
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

    updateBestRecordText(isNewRecord: boolean) {
        const bestRecordStrObj = this.createBestRecordStrObj();
        this.bestElapsedFrameText.setText(bestRecordStrObj.completeTime);

        this.bestNumberOfCollectedTreasuresText.setText(bestRecordStrObj.numberOfCollectedTreasures);

        this.newRecordText.setVisible(isNewRecord);
    }

    private createBestRecordStrObj() {
        let bestCompleteTimeStr = "--:--.---";
        const bestElapsedFrame = this.getBestRecord().elapsedFrame;
        if (bestElapsedFrame !== undefined) {
            bestCompleteTimeStr = Util.createFormattedTimeFromFrame(bestElapsedFrame);
        }

        const bestNumberOfCollectedTreasuresStr = `${this.getBestRecord().numberOfCollectedTreasures}/${Util.calculateNumberOfTreasuresInALLRounds()}`

        return {
            completeTime: bestCompleteTimeStr,
            numberOfCollectedTreasures: bestNumberOfCollectedTreasuresStr
        } as const;
    }

    showGameOverText() {
        this.gameOverText.setVisible(true);
    }

    showCongratulationsText() {
        this.congratulationsText.setVisible(true);
    }

    updateDebugData() {
        DebugDataMediator.setPauseButtonValue(this.getPauseButtonValueData());
    }

    private getPauseButtonValueData() {
        return {
            displayWidth: this.pause.displayWidth,
            displayHeight: this.pause.displayHeight
        };
    }

    clean() {
        this.play.off("pointerover");
        this.play.off("pointerout");
        this.play.off("pointerup");
        this.pause.off("pointerover");
        this.pause.off("pointerout");
        this.pause.off("pointerup");
        this.deleteBestRecordButton.clean();
        this.restartButton.clean();
        this.help.destroy();
        this.helpModal.destroy();
    }
}