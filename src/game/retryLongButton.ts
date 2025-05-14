import * as GameConstants from "./gameConstants";

export class RetryLongButton {
    private readonly image: Phaser.GameObjects.Image;
    private timerEvent: Phaser.Time.TimerEvent;

    constructor(uiLayer: Phaser.GameObjects.Layer, gameObjectCreator: Phaser.GameObjects.GameObjectCreator) {
        this.image = gameObjectCreator.image({ x: 400, y: 400, key: "retry" }, false);
        uiLayer.add(this.image);

        this.timerEvent = new Phaser.Time.TimerEvent({
            delay: 0,
            repeat: GameConstants.FPS - 1,
            callbackScope: this,
            callback: function (this: RetryLongButton) {
                console.log(this.timerEvent.getRepeatCount());
            },
        });
    }

    setupButton() {
        this.image.setInteractive();

        /*this.image.on("pointerdown", () => {
            this.scene.time.addEvent(this.retryLongTimerEvent);
        });*/
    }
}