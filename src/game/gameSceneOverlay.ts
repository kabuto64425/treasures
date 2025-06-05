import { SceneContext } from "./sceneContext";
import * as GameConstants from "./gameConstants";

export class GameSceneOverlay {
    private static overlay: Phaser.GameObjects.Graphics;

    static setup() {
        this.overlay = SceneContext.add.graphics();
    }

    static onPauseGame() {
        this.overlay.clear();
        this.overlay.fillStyle(0xffffff, 0.5).fillRect(30, 8, GameConstants.FIELD_WIDTH, GameConstants.FIELD_HEIGHT);
        this.overlay.setDepth(99);
    }

    static onResumeGame() {
        this.overlay.clear();
    }

    static onPlayerCaptured() {
        this.overlay.clear();
        this.overlay.fillStyle(0xa52a2a, 0.5).fillRect(30, 8, GameConstants.FIELD_WIDTH, GameConstants.FIELD_HEIGHT);
        this.overlay.setDepth(99);
    }

    static onShowDeleteBestRecordModal() {
        this.overlay.clear();
        this.overlay.fillStyle(0xffffff, 0.5).fillRect(0, 0, GameConstants.D_WIDTH, GameConstants.D_WIDTH);
        this.overlay.setDepth(99);
    }
}