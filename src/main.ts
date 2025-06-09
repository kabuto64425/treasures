import Phaser from "phaser";
import * as Game from "./game";
import { Logger } from "./game/logger";
import * as Util from "./game/utils"

import { JSX as JSXDom } from "jsx-dom";
import './style/fonts.css';

// Add global JSX namespace for jsx-dom
declare global {
    namespace JSX {
        interface IntrinsicElements extends JSXDom.IntrinsicElements { }
        interface Element extends HTMLElement { }
    }
}

const configFile = `/treasures//config/${(Util.isDebugEnv()) ? "dev.json" : "prod.json"}`

// ウィンドウの幅に応じてゲーム画面のサイズを変更する
function resizePhaserDom() {
    const el = window.document.getElementById("phaser");
    if (el) {
        const usableWidth = window.visualViewport?.width || window.innerWidth;
        const usableHeight = window.visualViewport?.height || window.innerHeight;
        el.style.width = `${usableWidth}px`;
        el.style.height = `${usableHeight}px`;
    }
}

// Phaser3オブジェクトを作る
function initGame(params: any) {
    // ウィンドウの幅に応じてゲーム画面のサイズを変更する
    resizePhaserDom();

    Logger.setLogLevel(params.logLevel);
    const bestRecord = new Game.BestRecord(params.enableUsingLocalstorage);
    // Phaser3の設定データ
    const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
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
        },
        pixelArt: true, // ← ドット絵用に重要！
        render: {
            antialias: false,           // キャンバスのアンチエイリアスをオフ
            pixelArt: true,             // 内部的にもピクセル補完を無効に
            antialiasGL: false,         // WebGLレンダラ用のアンチエイリアスもオフ
        },
        scale: {
            mode: Phaser.Scale.FIT, // parent: "phaser"なので、idがphaser要素のwidth,heightの大きさに応じてゲーム画面が拡大・縮小される
            parent: "phaser",
            //autoCenter: Phaser.Scale.CENTER_BOTH,
            width: Game.D_WIDTH,// ゲーム画面の横幅
            height: Game.D_HEIGHT// ゲーム画面の高さ
        }
    }
    return new Phaser.Game(config);
}

// エントリポイント
async function main() {
    const res = await fetch(configFile);
    const data = await res.json();
    await document.fonts.load("1em BestTen-CRT");
    await Promise.resolve(initGame(data));
    // ウィンドウのサイズが変更されるたびに
    // ウィンドウの幅に応じて動的にゲーム画面のサイズを変更するため
    await Promise.resolve(window.addEventListener('resize', resizePhaserDom));
}

main();