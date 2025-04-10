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

const DIRECTION = {
    LEFT: { keyName: "LEFT", dr: 0, dc: -1, reverse() { return DIRECTION.RIGHT; } },
    UP: { keyName: "UP", dr: -1, dc: 0, reverse() { return DIRECTION.DOWN; } },
    RIGHT: { keyName: "RIGHT", dr: 0, dc: 1, reverse() { return DIRECTION.LEFT; } },
    DOWN: { keyName: "DOWN", dr: 1, dc: 0, reverse() { return DIRECTION.UP; } },
};

function getDirections() {
    return [DIRECTION.LEFT, DIRECTION.UP, DIRECTION.RIGHT, DIRECTION.DOWN];
}

const parameterPlayer = { row: 0, column: 0 };

const numberOfEnemyies = 4;
const parametersOfEnemies = [
    { row: 15, column: 29, priorityScanDirections: [DIRECTION.RIGHT, DIRECTION.DOWN, DIRECTION.LEFT, DIRECTION.UP] },
    { row: 23, column: 23, priorityScanDirections: [DIRECTION.DOWN, DIRECTION.LEFT, DIRECTION.UP, DIRECTION.RIGHT] },
    { row: 29, column: 15, priorityScanDirections: [DIRECTION.LEFT, DIRECTION.UP, DIRECTION.RIGHT, DIRECTION.DOWN] },
    { row: 29, column: 29, priorityScanDirections: [DIRECTION.UP, DIRECTION.RIGHT, DIRECTION.DOWN, DIRECTION.LEFT] }
];

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

    canMove(direction) {
        const toRow = this.row + direction.dr;
        const toCol = this.column + direction.dc;
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

    move(direction) {
        if (this.chargeAmount >= 3) {
            this.row += direction.dr;
            this.column += direction.dc;
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
    constructor(scene, iniRow, iniColumn, priorityScanDirections) {
        this.graphics = scene.add.graphics();
        this.row = iniRow;
        this.column = iniColumn;
        this.chargeAmount = 0;
        this.priorityScanDirections = priorityScanDirections;
    }

    charge() {
        this.chargeAmount++;
    }

    isChargeCompleted() {
        if (this.chargeAmount >= 6) {
            return true;
        }
        return false;
    }

    decideMoveDirection(shortestDirectionMaps) {
        for (const d of this.priorityScanDirections) {
            if (shortestDirectionMaps[this.row][this.column].get(d.keyName)) {
                return d;
            }
        }
        return null;
    }

    move(direction) {
        if (direction === null) {
            return;
        }
        if (this.chargeAmount >= 6) {
            this.row += direction.dr;
            this.column += direction.dc;
            this.chargeAmount = 0;
        }
    }

    draw() {
        this.graphics.clear();
        this.graphics.lineStyle(0xff0000);
        this.graphics.fillStyle(0xff0000);
        this.graphics.fillRect(this.column * GRID_SIZE, this.row * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    }
}

class FieldEvalution {
    constructor(scene) {
        this.shortestDirectionMaps = [...Array(H)].map(n => [...Array(W)].map(m => this.generateDirectionFlagMap()));
        this.graphics = scene.add.graphics();
        this.graphics.depth = 99;
    }

    generateDirectionFlagMap() {
        const pairs = getDirections().map(d => [d.keyName, false]);
        return new Map(pairs);
    }

    resetMapValues(dir, value) {
        Array.from(dir.entries()).forEach(([key,]) => {
            dir.set(key, value);
        });
    }

    updateEvaluation(playerRow, playerColumn) {
        this.shortestDirectionMaps.forEach(n => n.forEach(dir => { this.resetMapValues(dir, false) }));

        const queue = [];
        const dist = [...Array(H)].map(n => [...Array(W)].fill(-1));

        queue.push([playerRow, playerColumn]);
        dist[playerRow][playerColumn] = 0;

        while (queue.length > 0) {
            const v = queue.shift();
            for (const d of getDirections()) {
                const next_row = v[0] + d.dr;
                const next_column = v[1] + d.dc;

                if (next_row < 0 || H <= next_row) continue;
                if (next_column < 0 || W <= next_column) continue;

                if (field[next_row][next_column] === 1) continue;

                if (dist[next_row][next_column] !== -1) {
                    if (dist[next_row][next_column] === dist[v[0]][v[1]] + 1) {
                        this.shortestDirectionMaps[next_row][next_column].set(d.reverse().keyName, true);
                    }
                    continue;
                }
                queue.push([next_row, next_column]);
                dist[next_row][next_column] = dist[v[0]][v[1]] + 1;
                this.shortestDirectionMaps[next_row][next_column].set(d.reverse().keyName, true);
            }
        }
    }

    draw() {
        this.graphics.clear();
        this.graphics.lineStyle(0x00ff00);
        this.graphics.fillStyle(0x00ff00);
        for (let i = 0; i < H; i++) {
            for (let j = 0; j < W; j++) {
                if (this.shortestDirectionMaps[i][j].get(DIRECTION.LEFT.keyName)) {
                    this.graphics.fillRect(j * GRID_SIZE, i * GRID_SIZE + GRID_SIZE / 2 - GRID_SIZE / 10, GRID_SIZE / 5, GRID_SIZE / 5);
                }
                if (this.shortestDirectionMaps[i][j].get(DIRECTION.UP.keyName)) {
                    this.graphics.fillRect(j * GRID_SIZE + GRID_SIZE / 2 - GRID_SIZE / 10, i * GRID_SIZE, GRID_SIZE / 5, GRID_SIZE / 5);
                }
                if (this.shortestDirectionMaps[i][j].get(DIRECTION.RIGHT.keyName)) {
                    this.graphics.fillRect((j + 1) * GRID_SIZE - GRID_SIZE / 5, i * GRID_SIZE + GRID_SIZE / 2 - GRID_SIZE / 10, GRID_SIZE / 5, GRID_SIZE / 5);
                }
                if (this.shortestDirectionMaps[i][j].get(DIRECTION.DOWN.keyName)) {
                    this.graphics.fillRect(j * GRID_SIZE + GRID_SIZE / 2 - GRID_SIZE / 10, (i + 1) * GRID_SIZE - GRID_SIZE / 5, GRID_SIZE / 5, GRID_SIZE / 5);
                }
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

    let enemies = [...Array(numberOfEnemyies)].map((n, i) => {
        return {
            mode: 0, // 0:通常モード 1:猛進モード
            preDirect: -1,
            continueCount: 0, // 通常モードのときに同一方向に連続して何回進んだかをカウント
            differentCount: 0, // 猛進モードのときに進行方向と最短方向が異なる状態が何回連続で続いているかをカウント

            row: parametersOfEnemies[i].row,
            column: parametersOfEnemies[i].column
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
    this.player = new Player(this, parameterPlayer.row, parameterPlayer.column);
    this.player.draw();

    // フィールド評価
    this.fieldEvaluation = new FieldEvalution(this);
    this.fieldEvaluation.updateEvaluation(this.player.row, this.player.column);
    this.fieldEvaluation.draw();

    // 敵
    this.enemyList = [];
    for (let i = 0; i < numberOfEnemyies; i++) {
        const enemy = new Enemy(this, parametersOfEnemies[i].row, parametersOfEnemies[i].column, parametersOfEnemies[i].priorityScanDirections);
        this.enemyList.push(enemy);
        enemy.draw();
    }
}


function update(time, delta) {
    console.log("update")
    console.log(delta)

    // キーボードの情報を取得
    const cursors = this.input.keyboard.createCursorKeys();
    let input_dist = null;
    if (cursors.left.isDown) {
        console.log("Left!!");
        input_dist = DIRECTION.LEFT;
    } else if (cursors.up.isDown) {
        console.log("UP!!");
        input_dist = DIRECTION.UP;
    } else if (cursors.right.isDown) {
        console.log("Right!!");
        input_dist = DIRECTION.RIGHT;
    } else if (cursors.down.isDown) {
        console.log("Down!!");
        input_dist = DIRECTION.DOWN;
    }

    // プレイヤー
    if (this.player.isChargeCompleted()) {
        if (input_dist !== null && this.player.canMove(input_dist)) {
            this.player.move(input_dist);
        }
    } else {
        this.player.charge();
    }

    this.player.draw();

    // フィールド評価
    this.fieldEvaluation.updateEvaluation(this.player.row, this.player.column);
    this.fieldEvaluation.draw();

    // 敵
    for (const enemy of this.enemyList) {
        if (enemy.isChargeCompleted()) {
            let enemyDist = enemy.decideMoveDirection(this.fieldEvaluation.shortestDirectionMaps);
            enemy.move(enemyDist);
        } else {
            enemy.charge();
        }
        enemy.draw();
    }

    // 管理
    let isGameOver = false;
    for(const enemy of this.enemyList) {
        if(this.player.row === enemy.row && this.player.column === enemy.column) {
            isGameOver = true;
        }
    }
    if(isGameOver) {
        this.scene.pause();
    }
}