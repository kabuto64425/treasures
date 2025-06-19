export class TestScene extends Phaser.Scene {

    constructor() {
        super("test")
    }

    preload() {
    }

    create() {
        this.time.addEvent({
            delay: 5000,
            callback: () => {
                this.scene.restart();
            },
            loop: false
        });
    }

    update() {
    }
}