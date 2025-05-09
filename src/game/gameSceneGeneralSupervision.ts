import { GameScene } from "./gameScene"
import { Player } from "./player"
import * as GameConstants from "./gameConstants"
import { DIRECTION } from "./drection";
import { FieldEvalution } from "./fieldEvalution";
import { Enemy } from "./enemy";
import { RoundsSupervision } from "./roundsSupervision";
import { TreasuresRoundSupervision } from "./treasuresRoundSupervision";
import { Treasure } from "./treasure";
import { BestRecord } from "./bestRecord";
import { Ui } from "./ui";
import { FinalRoundSupervision } from "./finalRoundSupervision";

export class GameSceneGeneralSupervision {
    private params: any;
    private bestRecord: BestRecord;

    private ui: Ui;

    private player: Player;
    private fieldEvaluation: FieldEvalution;
    private enemyList: Enemy[];
    private roundsSupervision: RoundsSupervision | undefined;
    private gameState: number;

    private elapsedFrame: number;

    private overlay: Phaser.GameObjects.Graphics | undefined;

    static readonly GAME_STATE = {
        INITIALIZED: -1,
        STANDBY: 0,
        PLAYING: 1,
        GAME_CLEAR: 2,
        GAME_OVER: 3,
    };

    constructor(scene: GameScene, params: any, bestRecord: BestRecord) {
        this.params = params;
        this.bestRecord = bestRecord;
        this.elapsedFrame = 0;

        this.gameState = GameSceneGeneralSupervision.GAME_STATE.INITIALIZED;

        this.ui = new Ui(scene);

        // プレイヤー
        this.player = new Player(scene, GameConstants.parameterPlayer.row, GameConstants.parameterPlayer.column);

        //フィールド評価
        this.fieldEvaluation = new FieldEvalution(scene, this.params.visibleFieldEvaluation);

        // 敵
        this.enemyList = [];
        for (let i = 0; i < GameConstants.numberOfEnemyies; i++) {
            const enemy = new Enemy(scene, GameConstants.parametersOfEnemies[i].row, GameConstants.parametersOfEnemies[i].column, GameConstants.parametersOfEnemies[i].priorityScanDirections);
            this.enemyList.push(enemy);
        }
    }

    updateElapsedFrame() {
        this.elapsedFrame++;
    }

    setupSupervision(scene: GameScene) {
        this.gameState = GameSceneGeneralSupervision.GAME_STATE.STANDBY;
        this.ui.setupPlayButton();
        this.ui.setupRetryButton();
        this.ui.setupDeleteRecordButton();

        // フィールド描画
        const fieldGraphics = scene.add.graphics({
            lineStyle: { width: 1, color: 0x000000, alpha: 1 },
            fillStyle: { color: 0xffffff, alpha: 1 }
        });
        for (let i = 0; i < GameConstants.H; i++) {
            for (let j = 0; j < GameConstants.W; j++) {
                fieldGraphics.strokeRect(j * GameConstants.GRID_SIZE, i * GameConstants.GRID_SIZE, GameConstants.GRID_SIZE, GameConstants.GRID_SIZE);
            }
        }

        // 壁描画
        for (let i = 0; i < GameConstants.H; i++) {
            for (let j = 0; j < GameConstants.W; j++) {
                if (GameConstants.FIELD[i][j] === 1) {
                    scene.add.graphics({
                        lineStyle: { width: 1, color: 0x000000, alpha: 1 },
                        fillStyle: { color: 0x000000, alpha: 1 }
                    }).fillRect(j * GameConstants.GRID_SIZE, i * GameConstants.GRID_SIZE, GameConstants.GRID_SIZE, GameConstants.GRID_SIZE);
                }
            }
        }

        // ゲームオーバー時に表示するオーバレイ
        this.overlay = scene.add.graphics();
        this.overlay.fillStyle(0xd20a13, 0.5).fillRect(0, 0, GameConstants.D_WIDTH, GameConstants.D_HEIGHT);
        this.overlay.setDepth(99);
        this.overlay.setVisible(false);

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
        // +1でファイナルラウンドに対応しているのは暫定
        this.roundsSupervision = new RoundsSupervision(GameConstants.numberOfTreasuresRounds + 1);
        for (let i = 0; i < GameConstants.numberOfTreasuresRounds; i++) {
            const treasureList = [];
            for (let j = 0; j < GameConstants.numberOfTreasuresPerRound; j++) {
                let treasurePos = { row: Math.floor(Math.random() * GameConstants.H), column: Math.floor(Math.random() * GameConstants.W) };
                // 壁が存在するところに宝を配置しないようにする
                while (GameConstants.FIELD[treasurePos.row][treasurePos.column] === 1) {
                    treasurePos = { row: Math.floor(Math.random() * GameConstants.H), column: Math.floor(Math.random() * GameConstants.W) };
                }
                const treasure = new Treasure(scene, 0xffff00, treasurePos.row, treasurePos.column);
                treasureList.push(treasure);
            }

            this.roundsSupervision.setRoundSupervision(i, new TreasuresRoundSupervision(treasureList));
        }

        // ファイナルラウンド
        let goalPos = { row: 0, column: 0 };
        this.roundsSupervision.setRoundSupervision(GameConstants.numberOfTreasuresRounds, new FinalRoundSupervision(scene, goalPos.row, goalPos.column));
    }

    startGame() {
        this.gameState = GameSceneGeneralSupervision.GAME_STATE.PLAYING;
        // 最初のラウンドの宝描画
        // setup内で確実に作成しているので、アサーションでもいけるはず
        this.roundsSupervision!.getCurrentRoundSupervision().startRound();
    }

    updatePerFrame(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
        if (!this.isPlaying()) {
            return;
        }
        this.updateElapsedFrame();
        this.ui.updateTimeText();

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
        // setup内で確実に作成しているので、アサーションでもいけるはず
        const fieldEvaluation = this.fieldEvaluation!;
        fieldEvaluation.updateEvaluation(this.player.position().row, this.player.position().column);
        fieldEvaluation.draw();

        // 敵
        // setup内で確実に作成しているので、アサーションでもいけるはず
        for (const enemy of this.enemyList) {
            if (enemy.isChargeCompleted()) {
                let enemyDist = enemy.decideMoveDirection(fieldEvaluation);
                enemy.move(enemyDist);
            } else {
                enemy.charge();
            }
            enemy.draw();
        }

         // setup内で確実に作成しているので、アサーションでもいけるはず
        const roundsSupervision = this.roundsSupervision!;
        roundsSupervision.getCurrentRoundSupervision().interactWithPlayer(this.player);

        this.ui.updateCollectedTreasuresText();

        // 次ラウンド進行判断・次ラウンド進行
        if (roundsSupervision.isCompletedCurrentRound()) {
            if (roundsSupervision.isFinalRound()) {
                this.ui.showCongratulationsText();

                this.gameState = GameSceneGeneralSupervision.GAME_STATE.GAME_CLEAR;
                this.bestRecord.updateBestRecord(this.isGameClear(), this.player.getNumberOfCollectedTreasures(), this.elapsedFrame);
                this.ui.updateBestRecordText();
            } else {
                roundsSupervision.advanceRound();
                roundsSupervision.getCurrentRoundSupervision().startRound();
            }
        }

        // 敵との接触判定・ゲームオーバー更新
        for (const enemy of this.enemyList) {
            if (this.player.position().row === enemy.position().row && this.player.position().column === enemy.position().column) {
                if (!this.params.noGameOverMode) {
                    // setup内で確実に作成しているので、アサーションでもいけるはず
                    this.overlay!.setVisible(true);
                    this.ui.showGameOverText();
                    this.gameState = GameSceneGeneralSupervision.GAME_STATE.GAME_OVER;
                    this.bestRecord.updateBestRecord(this.isGameClear(), this.player.getNumberOfCollectedTreasures(), this.elapsedFrame);
                    this.ui.updateBestRecordText();
                }
            }
        }
    }

    getElapsedFrame() {
        return this.elapsedFrame;
    }

    queryNumberOfCollectedTreasures() {
        return this.player.getNumberOfCollectedTreasures();
    }

    isPlaying() {
        return this.gameState === GameSceneGeneralSupervision.GAME_STATE.PLAYING;
    }

    isGameOver() {
        return this.gameState === GameSceneGeneralSupervision.GAME_STATE.GAME_OVER;
    }

    isGameClear() {
        return this.gameState === GameSceneGeneralSupervision.GAME_STATE.GAME_CLEAR;
    }

    isGamePlayed() {
        return this.isPlaying() || this.isGameOver() || this.isGameClear();
    }
}
