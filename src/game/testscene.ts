import ConfirmDeleteModal from "../tsx/confirmDeleteModal";

export class TestScene extends Phaser.Scene {

    constructor() {
        super("test")
    }

    preload() {
    }

    create() {
        const modal = this.add.dom(277, 290, ConfirmDeleteModal({
            onConfirm: () => {
                modal.destroy();
                this.scene.restart();
            },
            onCancel: () => {
            }
        }));
    }

    update() {
    }
}