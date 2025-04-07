const D_WIDTH = 600;
const D_HEIGHT = 600;

const H = 30;
const W = 30;

const playerPosInit = { row: 0, column: 0 };
const enemiesPosInit = [
    { row: 15, column: 29 },
    { row: 23, column: 23 },
    { row: 29, column: 15 },
    { row: 29, column: 29 }
];

const DIST = {
    LEFT: { dr: 0, dc: -1 },
    UP: { dr: -1, dc: 0 },
    RIGHT: { dr: 0, dc: 1 },
    DOWN: { dr: 1, dc: 0 }
};

class Player {
    constructor(scene, iniRow, iniColumn) {
        this.graphics = scene.add.graphics();
        this.row = iniRow;
        this.column = iniColumn;
        this.chargeAmount = 0;
    }

    charge() {
        this.chargeAmount++;
    }

    isChargeCompleted() {
        if (this.chargeAmount >= 3) {
            return true;
        }
        return false;
    }

    move(dist) {
        if (this.chargeAmount >= 3) {
            this.row += dist.dr;
            this.column += dist.dc;
            this.chargeAmount = 0;
        }
    }

    draw() {
        this.graphics.clear();
        this.graphics.lineStyle(0x0000ff);
        this.graphics.fillStyle(0x0000ff);
        this.graphics.fillRect(this.column * 20, this.row * 20, 20, 20);
    }


}

class Enemy {
    constructor(scene, iniRow, iniColumn) {
        this.graphics = scene.add.graphics();
        this.row = iniRow;
        this.column = iniColumn;
    }

    draw() {
        this.graphics.clear();
        this.graphics.lineStyle(0xff0000);
        this.graphics.fillStyle(0xff0000);
        this.graphics.fillRect(this.row * 20, this.column * 20, 20, 20);
    }
}

const field = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

// Phaser3の設定データ
const config = {
    type: Phaser.AUTO,
    width: D_WIDTH,// ゲーム画面の横幅
    height: D_HEIGHT,// ゲーム画面の高さ
    backgroundColor: '#FFFFFF', // 背景色を設定
    antialias: false,
    scene: {
        preload: preload,// 素材の読み込み時の関数
        create: create,// 画面が作られた時の関数
        update: update// 連続実行される関数
    },
    fps: {
        target: 24,// フレームレート
        forceSetTimeOut: true
    },
    physics: {
        default: "arcade",
        arcade: {
            debug: true,// スプライトに緑の枠を表示します
            gravity: { y: 300 }// 重力の方向とその強さ
        }
    }
}

// Phaser3オブジェクトを作る
let phaser = new Phaser.Game(config);

function preload() {
    console.log("preload!!");
}

function create() {
    console.log("create!!");

    let enemies = [...Array(4)].map((n, i) => {
        return {
            mode: 0, // 0:通常モード 1:猛進モード
            preDirect: -1,
            continueCount: 0, // 通常モードのときに同一方向に連続して何回進んだかをカウント
            differentCount: 0, // 猛進モードのときに進行方向と最短方向が異なる状態が何回連続で続いているかをカウント

            row: enemiesPosInit[i].row,
            column: enemiesPosInit[i].column
        }
    });

    // フィールド描画
    this.fieldGraphics = this.add.graphics({
        lineStyle: { width: 1, color: 0x000000, alpha: 1 },
        fillStyle: { color: 0xffffff, alpha: 1 }
    });
    for (let i = 0; i < H; i++) {
        for (let j = 0; j < W; j++) {
            this.fieldGraphics.strokeRect(j * 20, i * 20, 20, 20);
        }
    }

    // 壁描画
    for (let i = 0; i < H; i++) {
        for (let j = 0; j < W; j++) {
            if (field[i][j] == 1) {
                this.add.graphics({
                    lineStyle: { width: 1, color: 0x000000, alpha: 1 },
                    fillStyle: { color: 0x000000, alpha: 1 }
                }).fillRect(j * 20, i * 20, 20, 20);
            }
        }
    }

    // プレイヤー描画
    this.player = new Player(this, playerPosInit.row, playerPosInit.column);
    this.player.draw();

    // 敵描画
    this.enemyList = [];
    for (let i = 0; i < 4; i++) {
        this.enemyList.push(new Enemy(this, enemiesPosInit[i].row, enemiesPosInit[i].column));
        this.enemyList[i].draw();
    }
}

function update() {
    console.log("update!!");
    // キーボードの情報を取得
    const cursors = this.input.keyboard.createCursorKeys();
    let input_dist = null;
    if (cursors.left.isDown) {
        console.log("Left!!");
        input_dist = DIST.LEFT;
    } else if (cursors.up.isDown) {
        console.log("UP!!");
        input_dist = DIST.UP;
    } else if (cursors.right.isDown) {
        console.log("Right!!");
        input_dist = DIST.RIGHT;
    } else if (cursors.down.isDown) {
        console.log("Down!!");
        input_dist = DIST.DOWN;
    }

    if(this.player.isChargeCompleted()) {
        if(input_dist != null) {
            this.player.move(input_dist);
        }
    } else {
        this.player.charge();
    }

    this.player.draw();

    //const graphics = this.
    //graphics.fillStyle(0x000000, 1);
    //graphics.fillRect(0, 0, 20, 20);
}