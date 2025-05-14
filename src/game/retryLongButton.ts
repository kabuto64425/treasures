import * as GameConstants from "./gameConstants";
import { GameSceneGeneralSupervision } from "./gameSceneGeneralSupervision";

export class RetryLongButton {
    private readonly image: Phaser.GameObjects.Image;
    private readonly clock: Phaser.Time.Clock;
    private timerEvent: Phaser.Time.TimerEvent;

    private readonly scenePlugin: Phaser.Scenes.ScenePlugin;

    private readonly progressBox: Phaser.GameObjects.Graphics;
    private readonly progressBar: Phaser.GameObjects.Graphics;

    private readonly isGamePlayed: () => boolean;

    private readonly barWidth = 100;
    private readonly barHeight = 20;

    private readonly timerEventConfig = {
        delay: 0,
        repeat: GameConstants.FPS - 1,
        callbackScope: this,
        callback: function (this: RetryLongButton) {
            const remainingCount = this.timerEvent.getRepeatCount();
            const progress = 1 - (remainingCount / GameConstants.FPS);

            this.progressBar.clear();
            this.progressBar.fillStyle(0xffff00, 0.8);
            this.progressBar.fillRect(0, 0, this.barWidth * progress, this.barHeight);

            if (remainingCount <= 0) {
                this.scenePlugin.restart();
            }
        },
    }

    constructor(generalSupervision: GameSceneGeneralSupervision, uiLayer: Phaser.GameObjects.Layer, clock: Phaser.Time.Clock, scenePlugin: Phaser.Scenes.ScenePlugin, gameObjectCreator: Phaser.GameObjects.GameObjectCreator) {
        this.clock = clock;
        this.scenePlugin = scenePlugin;
        this.image = gameObjectCreator.image({ x: 800, y: 550, key: "retry" }, false);
        uiLayer.add(this.image);

        this.isGamePlayed = generalSupervision.isGamePlayed;

        this.progressBox = gameObjectCreator.graphics({ x: 750, y: 450, key: "retry" }, false);
        this.progressBox.setVisible(false);
        this.progressBox.fillStyle(0x222222, 0.8);
        this.progressBox.fillRect(0, 0, this.barWidth, this.barHeight);
        uiLayer.add(this.progressBox);
        this.progressBar = gameObjectCreator.graphics({ x: 750, y: 450, key: "retry" }, false);
        this.progressBar.setVisible(false);
        this.progressBar.fillStyle(0xffff00, 0.8);
        this.progressBar.fillRect(0, 0, this.barWidth, this.barHeight);
        uiLayer.add(this.progressBar);


        this.timerEvent = new Phaser.Time.TimerEvent(this.timerEventConfig);
    }

    setupButton() {
        this.image.setInteractive();

        this.image.on("pointerdown", () => {
            if (this.isGamePlayed()) {
                this.progressBox.setVisible(true);
                this.progressBar.setVisible(true);
                this.clock.addEvent(this.timerEvent);
            }
        });

        this.image.on("pointerup", () => {
            this.timerEvent.remove();
            this.progressBox.setVisible(false);
            this.progressBar.setVisible(false);
            this.timerEvent = new Phaser.Time.TimerEvent(this.timerEventConfig);
        });

        this.image.on("pointerout", () => {
            this.timerEvent.remove();
            this.progressBox.setVisible(false);
            this.progressBar.setVisible(false);
            this.timerEvent = new Phaser.Time.TimerEvent(this.timerEventConfig);
        });
    }
}