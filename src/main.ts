import Phaser from 'phaser';

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

class DIRECTION {
    static readonly LEFT = new DIRECTION("LEFT", 0, -1);
    static readonly UP = new DIRECTION("UP", -1, 0);
    static readonly RIGHT = new DIRECTION("RIGHT", 0, 1);
    static readonly DOWN = new DIRECTION("DOWN", 1, 0);

    private constructor(
        public readonly keyName: string,
        public readonly dr: number,
        public readonly dc: number
    ) { }

    reverse(): DIRECTION {
        switch (this) {
            case DIRECTION.LEFT: return DIRECTION.RIGHT;
            case DIRECTION.RIGHT: return DIRECTION.LEFT;
            case DIRECTION.UP: return DIRECTION.DOWN;
            case DIRECTION.DOWN: return DIRECTION.UP;
            // 念のため
            default: return DIRECTION.RIGHT;
        }
    }

    static values(): DIRECTION[] {
        return [DIRECTION.LEFT, DIRECTION.UP, DIRECTION.RIGHT, DIRECTION.DOWN];
    }
}

const parameterPlayer = { row: 0, column: 0 };

const numberOfEnemyies = 4;
const parametersOfEnemies = [
    { row: 15, column: 29, priorityScanDirections: [DIRECTION.RIGHT, DIRECTION.DOWN, DIRECTION.LEFT, DIRECTION.UP] },
    { row: 23, column: 23, priorityScanDirections: [DIRECTION.DOWN, DIRECTION.LEFT, DIRECTION.UP, DIRECTION.RIGHT] },
    { row: 29, column: 15, priorityScanDirections: [DIRECTION.LEFT, DIRECTION.UP, DIRECTION.RIGHT, DIRECTION.DOWN] },
    { row: 29, column: 29, priorityScanDirections: [DIRECTION.UP, DIRECTION.RIGHT, DIRECTION.DOWN, DIRECTION.LEFT] }
];

const numberOfTreasures = 10;

class Player {
    graphics: Phaser.GameObjects.Graphics;
    row: number;
    column: number;
    chargeAmount: number;

    constructor(scene: Phaser.Scene, iniRow: number, iniColumn: number) {
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

    canMove(direction: DIRECTION) {
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

    move(direction: DIRECTION) {
        if (this.chargeAmount >= 3) {
            this.row += direction.dr;
            this.column += direction.dc;
            this.chargeAmount = 0;
        }
    }

    draw() {
        this.graphics.clear();
        this.graphics.lineStyle(0, 0x0000ff);
        this.graphics.fillStyle(0x0000ff);
        this.graphics.fillRect(this.column * GRID_SIZE, this.row * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    }


}

class Enemy {
    graphics: Phaser.GameObjects.Graphics;
    row: number;
    column: number;
    chargeAmount: number;
    priorityScanDirections: DIRECTION[];

    constructor(scene: Phaser.Scene, iniRow: number, iniColumn: number, priorityScanDirections: DIRECTION[]) {
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

    decideMoveDirection(shortestDirectionMaps: Map<string, boolean>[][]) {
        for (const d of this.priorityScanDirections) {
            if (shortestDirectionMaps[this.row][this.column].get(d.keyName)) {
                return d;
            }
        }
        return null;
    }

    move(direction: DIRECTION | null) {
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
        this.graphics.lineStyle(0, 0xff0000);
        this.graphics.fillStyle(0xff0000);
        this.graphics.fillRect(this.column * GRID_SIZE, this.row * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    }
}

class Treasure {
    graphics: Phaser.GameObjects.Graphics;
    row: number;
    column: number;
    state: number;

    static readonly TREASURE_STATE = {
        NON_APPEARANCE: 0,
        APPEARANCE: 1,
        COLLECTED: 2,
    };

    constructor(scene: Phaser.Scene, iniRow: number, iniColumn: number) {
        this.graphics = scene.add.graphics();
        this.row = iniRow;
        this.column = iniColumn;
        this.state = Treasure.TREASURE_STATE.NON_APPEARANCE;
    }

    place(row: number, column: number) {
        this.row = row;
        this.column = column;
    }

    draw() {
        this.graphics.clear();
        this.graphics.lineStyle(0, 0xffff00);
        this.graphics.fillStyle(0xffff00);
        this.graphics.fillRect(this.column * GRID_SIZE, this.row * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    }

    clearDisplay() {
        this.graphics.clear();
    }
}

class FieldEvalution {
    shortestDirectionMaps: Map<string, boolean>[][];
    graphics: Phaser.GameObjects.Graphics;

    constructor(scene: Phaser.Scene) {
        this.shortestDirectionMaps = [...Array(H)].map(() => [...Array(W)].map(() => this.generateDirectionFlagMap() as Map<string, boolean>));
        this.graphics = scene.add.graphics();
        this.graphics.depth = 99;
    }

    generateDirectionFlagMap() {
        const pairs = DIRECTION.values().map(d => [d.keyName, false] as [string, boolean]);
        return new Map<string, boolean>(pairs);
    }

    resetMapValues<K, V>(dir: Map<K, V>, value: V) {
        Array.from(dir.entries()).forEach(([key,]) => {
            dir.set(key, value);
        });
    }

    updateEvaluation(playerRow: number, playerColumn: number) {
        this.shortestDirectionMaps.forEach(n => n.forEach(dir => { this.resetMapValues(dir, false) }));

        const queue = [];
        const dist = [...Array(H)].map(() => [...Array(W)].fill(-1));

        queue.push([playerRow, playerColumn]);
        dist[playerRow][playerColumn] = 0;

        while (queue.length > 0) {
            // 直前で空チェックしてるので、アサーションでもいけるはず
            const v = queue.shift()!;
            for (const d of DIRECTION.values()) {
                const next_row: number = v[0] + d.dr;
                const next_column: number = v[1] + d.dc;

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
        this.graphics.lineStyle(0, 0x00ff00);
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

class TestScene extends Phaser.Scene {
    fieldGraphics: Phaser.GameObjects.Graphics | undefined;
    player: Player | undefined;
    fieldEvaluation: FieldEvalution | undefined;
    enemyList: Enemy[] | undefined;
    treasureList: Treasure[] | undefined;

    constructor() {
        super('testScene');
    }

    preload() {
        console.log("preload!!");
    }

    create() {
        console.log("create!!");

        /*let enemies = [...Array(numberOfEnemyies)].map((n, i) => {
            return {
                mode: 0, // 0:通常モード 1:猛進モード
                preDirect: -1,
                continueCount: 0, // 通常モードのときに同一方向に連続して何回進んだかをカウント
                differentCount: 0, // 猛進モードのときに進行方向と最短方向が異なる状態が何回連続で続いているかをカウント

                row: parametersOfEnemies[i].row,
                column: parametersOfEnemies[i].column
            }
        });*/

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

        // 宝
        this.treasureList = [];
        for (let i = 0; i < numberOfTreasures; i++) {
            let treasurePos = { row: Math.floor(Math.random() * H), column: Math.floor(Math.random() * W) };
            // 壁が存在するところに宝を配置しないようにする
            while (field[treasurePos.row][treasurePos.column] === 1) {
                treasurePos = { row: Math.floor(Math.random() * H), column: Math.floor(Math.random() * W) };
            }
            const treasure = new Treasure(this, treasurePos.row, treasurePos.column);
            this.treasureList.push(treasure);
            treasure.draw();
        }
    }

    update(_time: number, delta: number) {
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
        // create内で確実に作成しているので、アサーションでもいけるはず
        const player = this.player!;
        if (player.isChargeCompleted()) {
            if (input_dist !== null && player.canMove(input_dist)) {
                player.move(input_dist);
            }
        } else {
            player.charge();
        }

        player.draw();

        // フィールド評価
        // create内で確実に作成しているので、アサーションでもいけるはず
        const fieldEvaluation = this.fieldEvaluation!;
        fieldEvaluation.updateEvaluation(player.row, player.column);
        fieldEvaluation.draw();

        // 敵
        // create内で確実に作成しているので、アサーションでもいけるはず
        const enemyList = this.enemyList!;
        for (const enemy of enemyList) {
            if (enemy.isChargeCompleted()) {
                let enemyDist = enemy.decideMoveDirection(fieldEvaluation.shortestDirectionMaps);
                enemy.move(enemyDist);
            } else {
                enemy.charge();
            }
            enemy.draw();
        }

        // 管理
        let isGameOver = false;
        for (const enemy of enemyList) {
            if (player.row === enemy.row && player.column === enemy.column) {
                isGameOver = true;
            }
        }
        if (isGameOver) {
            //this.scene.pause();
        }
        
        // create内で確実に作成しているので、アサーションでもいけるはず
        const treasureList = this.treasureList!;
        for (const treasure of treasureList) {
            if(player.row === treasure.row && player.column === treasure.column) {
                treasure.clearDisplay();
            }
        }
    }
}

// Phaser3の設定データ
const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: D_WIDTH,// ゲーム画面の横幅
    height: D_HEIGHT,// ゲーム画面の高さ
    backgroundColor: '#FFFFFF', // 背景色を設定
    antialias: false,
    scene: TestScene,
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
new Phaser.Game(config);