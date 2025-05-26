import GUI from "lil-gui";
import { DebugData } from "./debugData";

export class DebugView {
    private readonly gui;
    private readonly data: DebugData;

    constructor(data: DebugData) {
        this.gui = new GUI();
        this.data = data;
    }

    setup() {
        const view = this; // ← this をキャプチャして保持
        this.gui.add(this.data, "updateDuration").listen();
        this.gui.add(this.data, "frameDelta").listen();
        this.gui.add({ get fps() { return 1000 / (view.data.frameDelta); } }, "fps").listen();

        const playerFolder = this.gui.addFolder('player');

        playerFolder.add({
            get chargeAmount() {
                return view.data.player.chargeAmount ?? "NONE"
            }
        }, "chargeAmount").listen();
        playerFolder.add({
            get row() {
                return view.data.player.position?.row ?? "NONE"
            }
        }, "row").listen();
        playerFolder.add({
            get column() {
                return view.data.player.position?.column ?? "NONE"
            }
        }, "column").listen();
        playerFolder.add({
            get lastMoveDirection() {
                return view.data.player.lastMoveDirection?.keyName ?? "NONE"
            }
        }, "lastMoveDirection").listen();
        /*const view = this;
        this.gui.add({ get updateDuration() { return view.getUpdateDuration(); }}, "updateDuration").listen();
        this.gui.add({ get frameDelta() { return view.getFrameDelta(); }}, "frameDelta").listen();*/
    }

    // 読み取り専用なら setter は不要
}
