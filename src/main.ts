import Phaser from "phaser";
import * as Game from "./game";
import { Logger } from "./game/logger";

fetch("/treasures//params.json")
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