import * as GameConstants from "./gameConstants";
import { GameSceneGeneralSupervision } from "./gameSceneGeneralSupervision";
import { SceneContext } from "./sceneContext";

export class RestartButton {
    private buttonContainer: Phaser.GameObjects.Container;

    private readonly image: Phaser.GameObjects.Image;
    private readonly clock: Phaser.Time.Clock;

    private timerEvent: Phaser.Time.TimerEvent;

    private readonly progressBox: Phaser.GameObjects.Graphics;
    private readonly progressBar: Phaser.GameObjects.Graphics;

    private readonly restartGame: () => void;
    private readonly hasGameStarted: () => boolean;

    private readonly requestRetryGameFromUi: () => void;

    private readonly barWidth = 100;
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

    // locationは、ボタンの左上の座標を表す。
    // プログレスバーはそのさらに上につくことに注意する
    // locationの宣言場所はコンストラクタで良いのか要検討
    constructor(generalSupervision: GameSceneGeneralSupervision,
        location: { x: number, y: number }) {
        this.buttonContainer = SceneContext.make.container(location);

        this.clock = SceneContext.time;
        this.restartGame = generalSupervision.restartGame;
        this.hasGameStarted = generalSupervision.hasGameStarted;
        this.requestRetryGameFromUi = generalSupervision.getInputCoordinator().requestRetryGameFromUi;
        
        // おそらくrestartというキーが使えなさそう。なので、restart_で代用している
        this.image = SceneContext.make.image({ x: 0, y: 0, key: "restart_" }, false);
        this.image.setOrigin(0, 0);
        this.image.setScale(0.449);

        this.progressBox = SceneContext.make.graphics({ x: 7, y: -38, key: "retart" }, false);
        this.progressBox.setVisible(false);
        this.progressBox.fillStyle(0x222222, 0.8);
        this.progressBox.fillRect(0, 0, this.barWidth, this.barHeight);
        this.progressBar = SceneContext.make.graphics({ x: 7, y: -38, key: "retart" }, false);
        this.progressBar.setVisible(false);
        this.progressBar.fillStyle(0xffff00, 0.8);
        this.progressBar.fillRect(0, 0, this.barWidth, this.barHeight);

        this.timerEvent = new Phaser.Time.TimerEvent(this.timerEventConfig);
    }

    setup(uiContainer: Phaser.GameObjects.Container) {
        uiContainer.add(this.buttonContainer);
        this.buttonContainer.add(this.image);
        this.buttonContainer.add(this.progressBox);
        this.buttonContainer.add(this.progressBar);

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