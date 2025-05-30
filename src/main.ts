import Phaser from "phaser";
import * as Game from "./game";
import { Logger } from "./game/logger";
import * as Util from "./game/utils"

import { JSX as JSXDom } from "jsx-dom";

// Add global JSX namespace for jsx-dom
declare global {
    namespace JSX {
        interface IntrinsicElements extends JSXDom.IntrinsicElements { }
        interface Element extends HTMLElement { }
    }
}

const configFile = `/treasures//config/${(Util.isDebugEnv()) ? "dev.json" : "prod.json"}`

fetch(configFile)
    .then(res => res.json())
    .then(data => {
        initGame(data);
    });

// Phaser3オブジェクトを作る
function initGame(params: any) {
    Logger.setLogLevel(params.logLevel);
    const bestRecord = new Game.BestRecord(params.enableUsingLocalstorage);
    // Phaser3の設定データ
    const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: Game.D_WIDTH,// ゲーム画面の横幅
        height: Game.D_HEIGHT,// ゲーム画面の高さ
        backgroundColor: "#FFFFFF", // 背景色を設定
        antialias: false,
        scene: new Game.GameScene(params, bestRecord),
        fps: {
            target: Game.FPS,// フレームレート
            forceSetTimeOut: false
        },
        parent: "phaser",
        dom: {
            createContainer: true, // ← これがないと DOM 要素が表示されない
        },
        physics: {
            default: "arcade",
            arcade: {
                debug: true,// スプライトに緑の枠を表示します
                gravity: { y: 300 }// 重力の方向とその強さ
            }
        }
    }
    new Phaser.Game(config);
}