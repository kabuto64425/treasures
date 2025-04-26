import Phaser from 'phaser';

const D_WIDTH = 1700;
const D_HEIGHT = 630;

const GRID_SIZE = 21;

const H = 30;
const W = 30;

/*
requestAnimationFameを使用しているので、60しか設定できないと思っていて良い。
ディスプレイのフレッシュレートに依存しているみたいで、多くのフレッシュレートが60のため60固定
*/
const FPS = 60;

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
            // ビルドエラー防止のため
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

const numberOfTreasures = 5;

const numberOfRounds = 7;

class Player {
    private graphics: Phaser.GameObjects.Graphics;
    private row: number;
    private column: number;
    private chargeAmount: number;

    constructor(scene: GameScene, iniRow: number, iniColumn: number) {
        this.graphics = scene.add.graphics();
        this.row = iniRow;
        this.column = iniColumn;
        this.chargeAmount = 0;
    }

    position() {
        return { row: this.row, column: this.column };
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
    private graphics: Phaser.GameObjects.Graphics;
    private row: number;
    private column: number;
    private chargeAmount: number;
    private priorityScanDirections: DIRECTION[];

    constructor(scene: GameScene, iniRow: number, iniColumn: number, priorityScanDirections: DIRECTION[]) {
        this.graphics = scene.add.graphics();
        this.graphics.depth = 10;
        this.row = iniRow;
        this.column = iniColumn;
        this.chargeAmount = 0;
        this.priorityScanDirections = priorityScanDirections;
    }

    position() {
        return { row: this.row, column: this.column };
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

    decideMoveDirection(fieldEvaluation: FieldEvalution) {
        for (const d of this.priorityScanDirections) {
            if (fieldEvaluation.isShortestDirection(this.row, this.column, d)) {
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

class TreasuresSupervision {
    private treasureList: Treasure[];

    constructor() {
        this.treasureList = [];
    }

    addTreasure(treasure: Treasure) {
        this.treasureList.push(treasure);
    }

    getTreasureList() {
        return this.treasureList;
    }

    setAllTreasuresStateAppearance() {
        this.treasureList.forEach(t => t.setStateAppearance());
    }

    drawAllTreasures() {
        this.treasureList.forEach(t => t.draw());
    }

    areAllTreasuresCollected() {
        return this.treasureList.every(t => t.isCollected());
    }
}

class SingleRoundSupervision {
    private treasuresSupervision: TreasuresSupervision;

    constructor() {
        this.treasuresSupervision = new TreasuresSupervision();
    }

    getTreasuresSupervision() {
        return this.treasuresSupervision;
    }
}

export class RoundsSupervision {
    private currentRound: number;
    private singleRoundSupervisionList: SingleRoundSupervision[];

    constructor(numberOfRound: number) {
        this.currentRound = 0;
        this.singleRoundSupervisionList = new Array(numberOfRound);
    }

    getCurrentRound() {
        return this.currentRound;
    }

    isFinalRound() {
        return this.currentRound === (numberOfRounds - 1);
    }

    isCompletedCurrentRound() {
        return this.getCurrentRoundSupervision().getTreasuresSupervision().areAllTreasuresCollected();
    }

    advanceRound() {
        if (!this.isFinalRound()) {
            this.currentRound++;
        }
    }

    getCurrentRoundSupervision() {
        return this.singleRoundSupervisionList[this.currentRound];
    }

    setRoundSupervision(round: number, singleRoundSupervision: SingleRoundSupervision) {
        this.singleRoundSupervisionList[round] = singleRoundSupervision;
    }
}

class Treasure {
    private graphics: Phaser.GameObjects.Graphics;
    private color: number;
    private row: number;
    private column: number;
    private state: number;

    static readonly TREASURE_STATE = {
        NON_APPEARANCE: 0,
        APPEARANCE: 1,
        COLLECTED: 2,
    };

    constructor(scene: GameScene, color: number, iniRow: number, iniColumn: number) {
        this.graphics = scene.add.graphics();
        this.color = color;
        this.row = iniRow;
        this.column = iniColumn;
        this.state = Treasure.TREASURE_STATE.NON_APPEARANCE;
    }

    position() {
        return { row: this.row, column: this.column };
    }

    setStateAppearance() {
        this.state = Treasure.TREASURE_STATE.APPEARANCE;
    }

    setStateCollected() {
        this.state = Treasure.TREASURE_STATE.COLLECTED;
    }

    isCollected() {
        return this.state === Treasure.TREASURE_STATE.COLLECTED;
    }

    place(row: number, column: number) {
        this.row = row;
        this.column = column;
    }

    draw() {
        this.graphics.clear();
        this.graphics.lineStyle(0, this.color);
        this.graphics.fillStyle(this.color);
        this.graphics.fillRect(this.column * GRID_SIZE, this.row * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    }

    clearDisplay() {
        this.graphics.clear();
    }
}

class FieldEvalution {
    private shortestDirectionMaps: Map<string, boolean>[][];
    private graphics: Phaser.GameObjects.Graphics;

    constructor(scene: GameScene, isVisible: boolean) {
        this.shortestDirectionMaps = [...Array(H)].map(() => [...Array(W)].map(() => this.generateDirectionFlagMap() as Map<string, boolean>));
        this.graphics = scene.add.graphics();
        this.graphics.depth = 99;
        this.graphics.setVisible(isVisible);
    }

    private generateDirectionFlagMap() {
        const pairs = DIRECTION.values().map(d => [d.keyName, false] as [string, boolean]);
        return new Map<string, boolean>(pairs);
    }

    private resetMapValues<K, V>(dir: Map<K, V>, value: V) {
        Array.from(dir.entries()).forEach(([key,]) => {
            dir.set(key, value);
        });
    }

    isShortestDirection(row: number, column: number, direction: DIRECTION) {
        return this.shortestDirectionMaps[row][column].get(direction.keyName);
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

class GameSceneGeneralSupervision {
    private scene: GameScene;
    private params: any;

    private player: Player;
    private fieldEvaluation: FieldEvalution;
    private enemyList: Enemy[];
    private roundsSupervision: RoundsSupervision | undefined;
    private gameState: number;

    private elapsedFrame: number;
    private timeText: Phaser.GameObjects.BitmapText | undefined;

    private overlay: Phaser.GameObjects.Graphics | undefined;
    private gameOverText: Phaser.GameObjects.BitmapText | undefined;

    private congratulationsText: Phaser.GameObjects.BitmapText | undefined;

    static readonly GAME_STATE = {
        INITIALIZED: -1,
        PLAYING: 0,
        GAME_CLEAR: 1,
        GAME_OVER: 2,
    };

    constructor(scene: GameScene, params: any) {
        this.params = params;
        this.elapsedFrame = 0;
        this.scene = scene;

        this.gameState = GameSceneGeneralSupervision.GAME_STATE.INITIALIZED;

        // プレイヤー
        this.player = new Player(this.scene, parameterPlayer.row, parameterPlayer.column);

        //フィールド評価
        this.fieldEvaluation = new FieldEvalution(this.scene, this.params.visibleFieldEvaluation);

        // 敵
        this.enemyList = [];
        for (let i = 0; i < numberOfEnemyies; i++) {
            const enemy = new Enemy(this.scene, parametersOfEnemies[i].row, parametersOfEnemies[i].column, parametersOfEnemies[i].priorityScanDirections);
            this.enemyList.push(enemy);
        }
    }

    initTimeText() {
        this.timeText = this.scene.add.bitmapText(645, 50, 'font', "0:00.000");
    }

    updateTimeText() {
        this.timeText!.setText(`${this.createFormattedTime()}`);
    }

    updateElapsedFrame() {
        this.elapsedFrame++;
    }

    calculateElapsedTime() {
        return Math.floor((this.elapsedFrame * 1000) / 60);
    }

    createFormattedTime() {
        const elapsed = this.calculateElapsedTime();
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        const milliseconds = Math.floor(elapsed % 1000);

        return `${minutes.toString()}:${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(3, "0")}`;
    }

    startSupervision() {
        this.gameState = GameSceneGeneralSupervision.GAME_STATE.PLAYING;
        this.initTimeText();

        // フィールド描画
        const fieldGraphics = this.scene.add.graphics({
            lineStyle: { width: 1, color: 0x000000, alpha: 1 },
            fillStyle: { color: 0xffffff, alpha: 1 }
        });
        for (let i = 0; i < H; i++) {
            for (let j = 0; j < W; j++) {
                fieldGraphics.strokeRect(j * GRID_SIZE, i * GRID_SIZE, GRID_SIZE, GRID_SIZE);
            }
        }

        // 壁描画
        for (let i = 0; i < H; i++) {
            for (let j = 0; j < W; j++) {
                if (field[i][j] === 1) {
                    this.scene.add.graphics({
                        lineStyle: { width: 1, color: 0x000000, alpha: 1 },
                        fillStyle: { color: 0x000000, alpha: 1 }
                    }).fillRect(j * GRID_SIZE, i * GRID_SIZE, GRID_SIZE, GRID_SIZE);
                }
            }
        }

        // ゲームオーバー時に表示するオーバレイ
        this.overlay = this.scene.add.graphics();
        this.overlay.fillStyle(0xd20a13, 0.5).fillRect(0, 0, D_WIDTH, D_HEIGHT);
        this.overlay.depth = 99;
        this.overlay.setVisible(false);

        // ゲームオーバーテキスト
        this.gameOverText = this.scene.add.bitmapText(645, 132, 'font', "GAME OVER!");
        this.gameOverText.setVisible(false);

        // クリアおめでとうテキスト
        this.congratulationsText = this.scene.add.bitmapText(645, 132, 'font', "CONGRATULATIONS!");
        this.congratulationsText.setVisible(false);

        // プレイヤー描画
        this.player.draw();

        // フィールド評価
        this.fieldEvaluation.updateEvaluation(this.player.position().row, this.player.position().column);
        this.fieldEvaluation.draw();

        // 敵描画
        for (const enemy of this.enemyList) {
            enemy.draw();
        }

        // ラウンド進行監督
        this.roundsSupervision = new RoundsSupervision(numberOfRounds);
        for (let i = 0; i < numberOfRounds - 1; i++) {
            const singleRoundSupervision = new SingleRoundSupervision();
            for (let j = 0; j < numberOfTreasures; j++) {
                let treasurePos = { row: Math.floor(Math.random() * H), column: Math.floor(Math.random() * W) };
                // 壁が存在するところに宝を配置しないようにする
                while (field[treasurePos.row][treasurePos.column] === 1) {
                    treasurePos = { row: Math.floor(Math.random() * H), column: Math.floor(Math.random() * W) };
                }
                const treasure = new Treasure(this.scene, 0xffff00, treasurePos.row, treasurePos.column);
                singleRoundSupervision.getTreasuresSupervision().addTreasure(treasure);
            }

            this.roundsSupervision.setRoundSupervision(i, singleRoundSupervision);
        }

        const singleRoundSupervision = new SingleRoundSupervision();
        for (let j = 0; j < numberOfTreasures; j++) {
            let treasurePos = { row: 0, column: 0 };
            const treasure = new Treasure(this.scene, 0xffa500, treasurePos.row, treasurePos.column);
            singleRoundSupervision.getTreasuresSupervision().addTreasure(treasure);
        }

        this.roundsSupervision.setRoundSupervision(numberOfRounds - 1, singleRoundSupervision);

        this.roundsSupervision.getCurrentRoundSupervision().getTreasuresSupervision().setAllTreasuresStateAppearance();
        // 最初のラウンドの宝描画
        this.roundsSupervision.getCurrentRoundSupervision().getTreasuresSupervision().drawAllTreasures();
    }

    updatePerFrame(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
        this.updateElapsedFrame();
        this.updateTimeText();

        // キーボードの情報を取得
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
        // create内で確実に作成しているので、アサーションでもいけるはず
        const fieldEvaluation = this.fieldEvaluation!;
        fieldEvaluation.updateEvaluation(this.player.position().row, this.player.position().column);
        fieldEvaluation.draw();

        // 敵
        // create内で確実に作成しているので、アサーションでもいけるはず
        for (const enemy of this.enemyList) {
            if (enemy.isChargeCompleted()) {
                let enemyDist = enemy.decideMoveDirection(fieldEvaluation);
                enemy.move(enemyDist);
            } else {
                enemy.charge();
            }
            enemy.draw();
        }

        // 現在の宝との回収判定・回収
        const roundsSupervision = this.roundsSupervision!;
        for (const treasure of roundsSupervision.getCurrentRoundSupervision().getTreasuresSupervision().getTreasureList()) {
            if (this.player.position().row === treasure.position().row && this.player.position().column === treasure.position().column) {
                treasure.setStateCollected();
                treasure.clearDisplay();
            }
        }

        // 次ラウンド進行判断・次ラウンド進行
        if (roundsSupervision.isCompletedCurrentRound()) {
            if (roundsSupervision.isFinalRound()) {
                this.congratulationsText!.setVisible(true);

                this.gameState = GameSceneGeneralSupervision.GAME_STATE.GAME_CLEAR;
            } else {
                roundsSupervision.advanceRound();
                roundsSupervision.getCurrentRoundSupervision().getTreasuresSupervision().setAllTreasuresStateAppearance();
                roundsSupervision.getCurrentRoundSupervision().getTreasuresSupervision().drawAllTreasures();
            }
        }

        // 敵との接触判定・ゲームオーバー更新
        for (const enemy of this.enemyList) {
            if (this.player.position().row === enemy.position().row && this.player.position().column === enemy.position().column) {
                // create内で確実に作成しているので、アサーションでもいけるはず
                if(!this.params.noGameOverMode) {
                    this.overlay!.setVisible(true);
                    this.gameOverText!.setVisible(true);
                    this.gameState = GameSceneGeneralSupervision.GAME_STATE.GAME_OVER;
                }
            }
        }
    }

    isGameOver() {
        return this.gameState === GameSceneGeneralSupervision.GAME_STATE.GAME_OVER;
    }

    isGameClear() {
        return this.gameState === GameSceneGeneralSupervision.GAME_STATE.GAME_CLEAR;
    }
}

class GameScene extends Phaser.Scene {
    private params: any;
    private gameSceneGeneralSupervision: GameSceneGeneralSupervision | undefined;

    private cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;

    constructor() {
        super('gameScene');
    }

    preload() {
        console.log("preload!!");
        this.load.atlas('fontatlas', '/treasures/bitmap-fonts-debug.png', '/treasures/bitmap-fonts.json');

        this.load.xml('azoXML', '/treasures/azo-fire.xml');
    }

    create() {
        console.log("create!!");
        this.params = globalParams;
        console.log(this.params);
        console.log(this.textures.get('fontatlas'));
        console.log(this.cache.xml.get('azoXML'));

        Phaser.GameObjects.BitmapText.ParseFromAtlas(this, 'font', 'fontatlas', 'azo-fire', 'azoXML');

        this.cursors = this.input.keyboard.createCursorKeys();
        this.gameSceneGeneralSupervision = new GameSceneGeneralSupervision(this, this.params);
        this.gameSceneGeneralSupervision.startSupervision();
    }

    // デバッグ用
    busyWait(ms: number) {
        const start = performance.now();
        while (performance.now() - start < ms) { }
    }

    update(_time: number, _delta: number) {
        console.log("update")
        console.log(_delta)
        // create内で確実に作成しているので、アサーションでもいけるはず
        const gameSceneGeneralSupervision = this.gameSceneGeneralSupervision!;
        gameSceneGeneralSupervision.updatePerFrame(this.cursors!);
        if (gameSceneGeneralSupervision.isGameClear()) {
            this.scene.pause();
            return;
        }
        if (gameSceneGeneralSupervision.isGameOver()) {
            this.scene.pause();
            return;
        }
    }
}

let globalParams: any = null;

fetch('/treasures//params.json')
    .then(res => res.json())
    .then(data => {
        globalParams = data;
        startGameWithParams(globalParams);
    });

// Phaser3オブジェクトを作る
function startGameWithParams(_params: any) {
    // Phaser3の設定データ
    const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: D_WIDTH,// ゲーム画面の横幅
        height: D_HEIGHT,// ゲーム画面の高さ
        backgroundColor: '#FFFFFF', // 背景色を設定
        antialias: false,
        scene: GameScene,
        fps: {
            target: FPS,// フレームレート
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