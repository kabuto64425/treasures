import { Position } from "./utils";
import * as GameConstants from "./gameConstants";
import { Logger } from "./logger";
import { SceneContext } from "./sceneContext";

export class Footprint {
    private readonly queue: { position: Position, frame: number }[];
    private readonly graphics: Phaser.GameObjects.Graphics;

    private readonly limit: number;
    private isFirstPrintStepped: boolean;

    constructor(limit: number) {
        this.graphics = SceneContext.make.graphics({});
        this.queue = [];
        this.limit = limit;
        this.isFirstPrintStepped = false;
    }

    setup(fieldContainer: Phaser.GameObjects.Container, isVisible: boolean) {
        fieldContainer.add(this.graphics);
        this.graphics.setVisible(isVisible);
    }

    push(position: Position, currentFrame: number) {
        this.queue.push({ position: position, frame: currentFrame });
    }

    readonly getFirstPrint = () => {
        return this.queue[0].position;
    }

    readonly onSteppedOnByEnemy = () => {
        this.isFirstPrintStepped = true;
    }

    resolveFootprintPerFrame(currentFrame: number) {
        // 足跡は必ず1つは残しておきたいから
        if (this.queue.length > 1) {
            // 足跡の削除対象は、一番古い足跡のみ
            // 削除条件は、どちらか一方を満たした場合
            // ・敵に踏まれた
            // ・一定フレーム経過
            if (this.isFirstPrintStepped || this.isFirstPrintTooOld(currentFrame)) {
                this.removeFirstPrint();
            }
        }
        // 次のフレームに備えてフラグをリセット
        this.isFirstPrintStepped = false;
        this.draw();
    }

    private draw() {
        this.graphics.clear();
        this.graphics.lineStyle(0, 0x0000ff, 0.3);
        this.graphics.fillStyle(0x0000ff, 0.3);
        for (const footprint of this.queue) {
            footprint.position;
            this.graphics.fillRect(footprint.position.column * GameConstants.GRID_SIZE, footprint.position.row * GameConstants.GRID_SIZE, GameConstants.GRID_SIZE, GameConstants.GRID_SIZE);
        }
    }

    private isFirstPrintTooOld(currentFrame: number) {
        const firstPrint = this.queue[0];
        return (currentFrame - firstPrint.frame > this.limit);
    }

    private removeFirstPrint() {
        Logger.debug("removefirstprint");
        this.queue.shift();
    }
}