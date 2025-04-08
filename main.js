const D_WIDTH = 600;
const D_HEIGHT = 600;

const GRID_SIZE = 20;

const H = 30;
const W = 30;

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

    canMove(dist) {
        const toRow = this.row + dist.dr;
        const toCol = this.column + dist.dc;
        if (toRow < 0) {
            return false;
        }
        if (toRow >= H) {
            return false;
        }
        if (toCol < 0) {
            return false;
        }
        if (toCol >= W) {
            return false;
        }
        if (field[toRow][toCol] === 1) {
            return false;
        }
        return true;
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
        this.graphics.fillRect(this.column * GRID_SIZE, this.row * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    }


}

class Enemy {
    constructor(scene, iniRow, iniColumn) {
        this.graphics = scene.add.graphics();
        this.row = iniRow;
        this.column = iniColumn;
    }

    decideDirection() {
    }

    draw() {
        this.graphics.clear();
        this.graphics.lineStyle(0xff0000);
        this.graphics.fillStyle(0xff0000);
        this.graphics.fillRect(this.row * GRID_SIZE, this.column * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    }
}

class FieldEvalution {
    constructor() {
        this.shortestDirectionFlags = [...Array(H)].map(n => [...Array(W)].map(m => [...Array(4).fill(false)]));
    }

    updateEvaluation(playerRow, playerColumn) {
        this.shortestDirectionFlags.forEach(n => n.forEach(m => m.fill(false)));

        const distEntries = Object.entries(DIST);

        const queue = [];
        const dist = [...Array(H)].map(n => [...Array(W)].fill(-1));
        let pre = [...Array(H)].map(n => [...Array(W)].fill(-1));

        queue.push([playerRow, playerColumn]);
        dist[playerRow][playerColumn] = 0;

        while (queue.length > 0) {
            const v = queue.shift();
            // 左、上、右、下の順でチェック
            for (let i = 0; i < distEntries.length; i++) {
                const [key, d] = distEntries[i];
                const next_row = v[0] + d.dr;
                const next_column = v[1] + d.dc;

                if (next_row < 0 || H <= next_row) continue;
                if (next_column < 0 || W <= next_column) continue;

                if (field[next_row][next_column] === 1) continue;

                if (dist[next_row][next_column] !== -1) {
                    if (dist[next_row][next_column] === dist[v[0]][v[1]] + 1) {
                        this.shortestDirectionFlags[next_row][next_column][i] = true;
                    }
                    continue;
                }
                queue.push([next_row, next_column]);
                dist[next_row][next_column] = dist[v[0]][v[1]] + 1;
                pre[next_row][next_column] = i;
                this.shortestDirectionFlags[next_row][next_column][i] = true;
            }
        }
    }
}

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
        target: 60,// フレームレート
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
            this.fieldGraphics.strokeRect(j * GRID_SIZE, i * GRID_SIZE, GRID_SIZE, GRID_SIZE);
        }
    }

    // 壁描画
    for (let i = 0; i < H; i++) {
        for (let j = 0; j < W; j++) {
            if (field[i][j] === 1) {
                this.add.graphics({
                    lineStyle: { width: 1, color: 0x000000, alpha: 1 },
                    fillStyle: { color: 0x000000, alpha: 1 }
                }).fillRect(j * GRID_SIZE, i * GRID_SIZE, GRID_SIZE, GRID_SIZE);
            }
        }
    }

    // プレイヤー
    this.player = new Player(this, playerPosInit.row, playerPosInit.column);
    this.player.draw();

    // 敵
    this.enemyList = [];
    for (let i = 0; i < 4; i++) {
        this.enemyList.push(new Enemy(this, enemiesPosInit[i].row, enemiesPosInit[i].column));
        this.enemyList[i].draw();
    }

    // フィールド評価
    this.fieldEvaluation = new FieldEvalution();
    this.fieldEvaluation.updateEvaluation(this.player.row, this.player.column);
}

function update() {
    //この関数の実行時間を計測。デバッグ用。
    const begin = Date.now();

    //console.log("update!!");
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

    if (this.player.isChargeCompleted()) {
        if (input_dist !== null && this.player.canMove(input_dist)) {
            this.player.move(input_dist);
        }
    } else {
        this.player.charge();
    }

    this.fieldEvaluation.updateEvaluation(this.player.row, this.player.column);

    this.player.draw();

    //この関数の実行時間を計測。デバッグ用。
    console.log(Date.now() - begin);
}