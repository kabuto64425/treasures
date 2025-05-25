import GUI from "lil-gui";
import { GameScene } from "./gameScene";

export class DebugView {
    private readonly gui;
    readonly getUpdateDuration: () => number;
    readonly getFrameDelta: () => number;

    constructor(scene: GameScene) {
        this.gui = new GUI();
        this.getUpdateDuration = scene.getUpdateDuration.bind(scene);
        this.getFrameDelta = scene.getFrameDelta.bind(scene);
    }

    setup() {
        const view = this;
        this.gui.add({ get updateDuration() { return view.getUpdateDuration(); }}, "updateDuration").listen();
        this.gui.add({ get frameDelta() { return view.getFrameDelta(); }}, "frameDelta").listen();
    }

    // 読み取り専用なら setter は不要
}
