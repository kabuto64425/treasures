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

        const playerFolder = this.gui.addFolder("player");

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
            get roomId() {
                return view.data.player.roomId ?? "NONE"
            }
        }, "roomId").listen();
        playerFolder.add({
            get lastMoveDirection() {
                return view.data.player.lastMoveDirection?.keyName ?? "NONE"
            }
        }, "lastMoveDirection").listen();

        const enemiesFolder = this.gui.addFolder("enemies");
        for (const [index, enemy] of view.data.enemies.entries()) {
            const enemyFolder = enemiesFolder.addFolder(`enemy${index}`);
            enemyFolder.add({
                get chargeAmount() {
                    return enemy.chargeAmount ?? "NONE"
                }
            }, "chargeAmount").listen();
            enemyFolder.add({
                get row() {
                    return enemy.position?.row ?? "NONE"
                }
            }, "row").listen();
            enemyFolder.add({
                get column() {
                    return enemy.position?.column ?? "NONE"
                }
            }, "column").listen();
            enemyFolder.add({
                get roomId() {
                    return enemy.roomId ?? "NONE"
                }
            }, "roomId").listen();
        }

    }
}
