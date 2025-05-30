import * as GameConstants from "./gameConstants";
import { GameSceneGeneralSupervision } from "./gameSceneGeneralSupervision";
import { SceneServices } from "./sceneServices";

export class RestartButton {
    private readonly image: Phaser.GameObjects.Image;
    private readonly clock: Phaser.Time.Clock;

    private timerEvent: Phaser.Time.TimerEvent;

    private readonly progressBox: Phaser.GameObjects.Graphics;
    private readonly progressBar: Phaser.GameObjects.Graphics;

    private readonly restartGame: () => void;
    private readonly hasGameStarted: () => boolean;

    private readonly requestRetryGameFromUi: () => void;

    private readonly barWidth = 70;
    private readonly barHeight = 17;

    private repeatCount = 0;

    private readonly timerEventConfig = {
        delay: 0,
        loop: true,
        callbackScope: this,
        callback: function (this: RestartButton) {
            this.requestRetryGameFromUi();
        },
    }

    constructor(generalSupervision: GameSceneGeneralSupervision,
        uiLayer: Phaser.GameObjects.Container,
        clock: Phaser.Time.Clock) {
        this.clock = clock;
        this.restartGame = generalSupervision.restartGame;
        this.hasGameStarted = generalSupervision.hasGameStarted;
        this.requestRetryGameFromUi = generalSupervision.getInputCoordinator().requestRetryGameFromUi;

        this.image = SceneServices.make.image({ x: 146, y: 550, key: "retry" }, false);
        this.image.setOrigin(0, 0);
        this.image.setScale(0.5);

        uiLayer.add(this.image);

        this.progressBox = SceneServices.make.graphics({ x: 109, y: 490, key: "retry" }, false);
        this.progressBox.setVisible(false);
        this.progressBox.fillStyle(0x222222, 0.8);
        this.progressBox.fillRect(0, 0, this.barWidth, this.barHeight);
        uiLayer.add(this.progressBox);
        this.progressBar = SceneServices.make.graphics({ x: 109, y: 490, key: "retry" }, false);
        this.progressBar.setVisible(false);
        this.progressBar.fillStyle(0xffff00, 0.8);
        this.progressBar.fillRect(0, 0, this.barWidth, this.barHeight);
        uiLayer.add(this.progressBar);

        this.timerEvent = new Phaser.Time.TimerEvent(this.timerEventConfig);
    }

    setup() {
        this.image.setInteractive();

        this.image.on("pointerdown", () => {
            this.clock.addEvent(this.timerEvent);
        });

        this.image.on("pointerup", () => {
            this.timerEvent.remove();
            this.timerEvent = new Phaser.Time.TimerEvent(this.timerEventConfig);
        });

        this.image.on("pointerout", () => {
            this.timerEvent.remove();
            this.timerEvent = new Phaser.Time.TimerEvent(this.timerEventConfig);
        });
    }

    handleApprovedAction(approved: boolean) {
        if (!this.hasGameStarted()) {
            return;
        }
        if (approved) {
            this.repeatCount++;
            this.progressBox.setVisible(true);
            this.progressBar.setVisible(true);

            const progress = (this.repeatCount / GameConstants.FPS);

            this.progressBar.clear();
            this.progressBar.fillStyle(0xffff00, 0.8);

            this.progressBar.fillRect(0, 0, this.barWidth * progress, this.barHeight);

            if (this.repeatCount >= GameConstants.FPS) {
                // 押し続けてたのでゲームリスタート
                this.restartGame();
            }
        } else {
            this.repeatCount = 0;
            this.progressBox.setVisible(false);
            this.progressBar.setVisible(false);
        }
    }
}