import ConfirmDeleteModal from "../tsx/confirmDeleteModal";
import { BestRecord } from "./bestRecord";
import * as GameConstants from "./gameConstants";
import { GameSceneGeneralSupervision } from "./gameSceneGeneralSupervision";
import { Logger } from "./logger";
import { SceneContext } from "./sceneContext";

export class DeleteBestRecordButton {
    private buttonContainer: Phaser.GameObjects.Container;

    private readonly image: Phaser.GameObjects.Image;
    private readonly clock: Phaser.Time.Clock;

    private timerEvent: Phaser.Time.TimerEvent;

    private readonly progressBox: Phaser.GameObjects.Graphics;
    private readonly progressBar: Phaser.GameObjects.Graphics;

    private readonly deleteModal: Phaser.GameObjects.DOMElement;

    private readonly requestDeleteBestRecordFromUi: () => void;
    private readonly getOverlay: () => Phaser.GameObjects.Graphics;

    private readonly barWidth = 70;
    private readonly barHeight = 17;

    private repeatCount = 0;

    private readonly timerEventConfig = {
        delay: 0,
        loop: true,
        callbackScope: this,
        callback: function (this: DeleteBestRecordButton) {
            this.requestDeleteBestRecordFromUi();
        },
    }

    // locationは、ボタンの左上の座標を表す。
    // プログレスバーはそのさらに上につくことに注意する
    // locationの宣言場所はコンストラクタで良いのか要検討
    constructor(bestRecord: BestRecord, generalSupervision: GameSceneGeneralSupervision,
        location: { x: number, y: number }) {
        this.buttonContainer = SceneContext.make.container(location);

        this.clock = SceneContext.time;
        this.requestDeleteBestRecordFromUi = generalSupervision.getInputCoordinator().requestDeleteBestRecordFromUi;
        this.getOverlay = generalSupervision.getOverlay;

        this.image = SceneContext.make.image({ x: 0, y: 0, key: "delete" }, false);
        this.image.setOrigin(0, 0);
        this.image.setScale(0.5);

        this.progressBox = SceneContext.make.graphics({ x: 0, y: -23, key: "retry" }, false);
        this.progressBox.setVisible(false);
        this.progressBox.fillStyle(0x222222, 0.8);
        this.progressBox.fillRect(0, 0, this.barWidth, this.barHeight);

        this.progressBar = SceneContext.make.graphics({ x: 0, y: -23, key: "retry" }, false);
        this.progressBar.setVisible(false);
        this.progressBar.fillStyle(0xffff00, 0.8);
        this.progressBar.fillRect(0, 0, this.barWidth, this.barHeight);

        this.timerEvent = new Phaser.Time.TimerEvent(this.timerEventConfig);

        this.deleteModal = SceneContext.add.dom(277, 290, ConfirmDeleteModal({
            onConfirm: () => {
                bestRecord.deleteBestRecord();
                // ゲームリスタートで閉じたと見せかける。
                generalSupervision.restartGame();
            },
            onCancel: () => {
                // ゲームリスタートで閉じたと見せかける。
                generalSupervision.restartGame();
            }
        }));
        this.deleteModal.setOrigin(0, 0);
        Logger.debug(this.deleteModal.width);
        this.deleteModal.setVisible(false);
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

    hide() {
        this.buttonContainer.setVisible(false);
    }

    handleApprovedAction(approved: boolean) {
        if (approved) {
            const requiredHoldFrames = GameConstants.FPS * 10;
            this.repeatCount++;
            this.progressBox.setVisible(true);
            this.progressBar.setVisible(true);

            const progress = (this.repeatCount / requiredHoldFrames);

            this.progressBar.clear();
            this.progressBar.fillStyle(0xffff00, 0.8);

            this.progressBar.fillRect(0, 0, this.barWidth * progress, this.barHeight);

            if (this.repeatCount >= requiredHoldFrames) {
                // 押し続けてたので削除ウィンドウ表示
                this.getOverlay().clear();
                this.getOverlay().fillStyle(0xffffff, 0.5).fillRect(0, 0, GameConstants.D_WIDTH, GameConstants.D_WIDTH);
                this.getOverlay().setDepth(99);
                SceneContext.scenePlugin.pause();
                this.deleteModal.setVisible(true);
            }
        } else {
            this.repeatCount = 0;
            this.progressBox.setVisible(false);
            this.progressBar.setVisible(false);
        }
    }
}