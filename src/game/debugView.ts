import GUI, { Controller } from "lil-gui";
import { DebugData } from "./debugData";

export class DebugView {
    private readonly gui;
    private readonly data: DebugData;

    // コントローラを保持（あとで手動更新）
    private controllers: Record<string, Controller> = {};

    constructor(data: DebugData) {
        this.gui = new GUI();
        this.data = data;
    }

    setup() {
        const c = this.controllers;

        // 各種数値の表示
        c.updateDuration = this.gui.add(this.data, "updateDuration");
        c.frameDelta = this.gui.add({ frameDelta: 0 }, "frameDelta");
        c.fps = this.gui.add({ fps: "0" }, "fps");
        c.scaleX = this.gui.add({ scaleX: 1 }, "scaleX");
        c.scaleY = this.gui.add({ scaleY: 1 }, "scaleY");

        // サイズ表示
        c.actualWidth = this.gui.add({ actualWidth: "NONE" }, "actualWidth");
        c.actualHeight = this.gui.add({ actualHeight: "NONE" }, "actualHeight");

        const playerFolder = this.gui.addFolder("player");
        c.player_chargeAmount = playerFolder.add({ chargeAmount: "NONE" }, "chargeAmount");
        c.player_row = playerFolder.add({ row: "NONE" }, "row");
        c.player_column = playerFolder.add({ column: "NONE" }, "column");
        c.player_roomId = playerFolder.add({ roomId: "NONE" }, "roomId");
        c.player_lastMoveDirection = playerFolder.add({ lastMoveDirection: "NONE" }, "lastMoveDirection");

        const enemiesFolder = this.gui.addFolder("enemies");

        this.data.enemies.forEach((_, index) => {
            const enemyFolder = enemiesFolder.addFolder(`enemy${index}`);
            c[`enemy${index}_state`] = enemyFolder.add({ state: "NONE" }, "state");
            c[`enemy${index}_chargeAmount`] = enemyFolder.add({ chargeAmount: "NONE" }, "chargeAmount");
            c[`enemy${index}_row`] = enemyFolder.add({ row: "NONE" }, "row");
            c[`enemy${index}_column`] = enemyFolder.add({ column: "NONE" }, "column");
            c[`enemy${index}_roomId`] = enemyFolder.add({ roomId: "NONE" }, "roomId");
        });

    }

    update() {
        // update() 内などで手動更新
        //const d = this.data;
        const c = this.controllers;

        c.updateDuration.updateDisplay();

        //c.updateDuration.setValue(d.updateDuration);
        //c.frameDelta.setValue(d.frameDelta);
        //c.fps.setValue(d.fps);
        //c.scaleX.setValue(d.scaleX.toFixed(2));
        //c.scaleY.setValue(d.scaleY.toFixed(2));

        /*const w = d.pauseButton.displayWidth;
        const h = d.pauseButton.displayHeight;
        c.actualWidth.setValue(w !== undefined ? (w / d.scaleX).toFixed(2) : "NONE");
        c.actualHeight.setValue(h !== undefined ? (h / d.scaleY).toFixed(2) : "NONE");

        const p = d.player;
        c.player_chargeAmount.setValue(p.chargeAmount ?? "NONE");
        c.player_row.setValue(p.position?.row ?? "NONE");
        c.player_column.setValue(p.position?.column ?? "NONE");
        c.player_roomId.setValue(p.roomId ?? "NONE");
        c.player_lastMoveDirection.setValue(p.lastMoveDirection?.keyName ?? "NONE");

        d.enemies.forEach((enemy, index) => {
            c[`enemy${index}_state`].setValue(enemy.state ?? "NONE");
            c[`enemy${index}_chargeAmount`].setValue(enemy.chargeAmount ?? "NONE");
            c[`enemy${index}_row`].setValue(enemy.position?.row ?? "NONE");
            c[`enemy${index}_column`].setValue(enemy.position?.column ?? "NONE");
            c[`enemy${index}_roomId`].setValue(enemy.roomId ?? "NONE");
        });*/
    }

    destroy() {
        this.gui.destroy(); // ← これで lil-gui の DOM/リスナーが全て消える
    }
}
