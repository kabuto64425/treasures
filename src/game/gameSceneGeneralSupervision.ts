import { GameScene } from "./gameScene"
import { Player } from "./player"
import * as GameConstants from "./gameConstants"
import { DIRECTION } from "./drection";
import { FieldEvalution } from "./fieldEvalution";
import { Enemy } from "./enemy";
import { RoundsSupervision } from "../roundsSupervision";
import { SingleRoundSupervision } from "./singleRoundSupervision";
import { Treasure } from "./treasure";

export class GameSceneGeneralSupervision {
    private scene: GameScene;
    private params: any;

    private player: Player;
    private fieldEvaluation: FieldEvalution;
    private enemyList: Enemy[];
    private roundsSupervision: RoundsSupervision | undefined;
    private gameState: number;

    private elapsedFrame: number;
    private timeText: Phaser.GameObjects.BitmapText | undefined;

    private collectedTreasuresText: Phaser.GameObjects.BitmapText | undefined;

    private bestNumberOfCollectedTreasures: number;
    private fastestClearElapsedFrame: number | undefined;

    private bestRecordText: Phaser.GameObjects.BitmapText | undefined;

    private overlay: Phaser.GameObjects.Graphics | undefined;
    private gameOverText: Phaser.GameObjects.BitmapText | undefined;

    private congratulationsText: Phaser.GameObjects.BitmapText | undefined;

    static readonly GAME_STATE = {
        INITIALIZED: -1,
        STANDBY: 0,
        PLAYING: 1,
        GAME_CLEAR: 2,
        GAME_OVER: 3,
    };

    constructor(scene: GameScene, params: any) {
        this.params = params;
        this.elapsedFrame = 0;
        this.scene = scene;

        this.bestNumberOfCollectedTreasures = 0;

        this.gameState = GameSceneGeneralSupervision.GAME_STATE.INITIALIZED;

        // プレイヤー
        this.player = new Player(this.scene, GameConstants.parameterPlayer.row, GameConstants.parameterPlayer.column);

        //フィールド評価
        this.fieldEvaluation = new FieldEvalution(this.scene, this.params.visibleFieldEvaluation);

        // 敵
        this.enemyList = [];
        for (let i = 0; i < GameConstants.numberOfEnemyies; i++) {
            const enemy = new Enemy(this.scene, GameConstants.parametersOfEnemies[i].row, GameConstants.parametersOfEnemies[i].column, GameConstants.parametersOfEnemies[i].priorityScanDirections);
            this.enemyList.push(enemy);
        }
    }

    initTimeText() {
        this.timeText = this.scene.add.bitmapText(645, 50, 'font', "0:00.000");
    }

    updateTimeText() {
        this.timeText!.setText(`${this.createFormattedTimeFromFrame(this.elapsedFrame)}`);
    }

    updateElapsedFrame() {
        this.elapsedFrame++;
    }

    caluculateTimeFromFrame(frame: number) {
        return Math.floor((frame * 1000) / 60);
    }

    createFormattedTimeFromFrame(frame: number) {
        const elapsed = this.caluculateTimeFromFrame(frame);
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        const milliseconds = Math.floor(elapsed % 1000);

        return `${minutes.toString()}:${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(3, "0")}`;
    }

    initCollectedTreasuresText() {
        this.collectedTreasuresText = this.scene.add.bitmapText(645, 132, 'font', `${this.player.getNumberOfCollectedTreasures()}/${this.roundsSupervision!.queryNumberOfTreasuresInALLRounds()}`);
    }

    updateCollectedTreasuresText() {
        this.collectedTreasuresText!.setText(`${this.player.getNumberOfCollectedTreasures()}/${this.roundsSupervision!.queryNumberOfTreasuresInALLRounds()}`);
    }

    createBestRecordStr() {
        let fastestClearTimeStr = "--:--.---"
        if (this.fastestClearElapsedFrame) {
            fastestClearTimeStr = this.createFormattedTimeFromFrame(this.fastestClearElapsedFrame);
        }
        return `${this.bestNumberOfCollectedTreasures}/${this.roundsSupervision!.queryNumberOfTreasuresInALLRounds()}  ${fastestClearTimeStr}`;
    }

    initBestRecordText() {
        this.scene.add.bitmapText(645, 296, 'font', "BEST");
        this.bestRecordText = this.scene.add.bitmapText(645, 378, 'font', this.createBestRecordStr());
    }

    updateBestRecordText() {
        this.bestRecordText!.setText(this.createBestRecordStr());
    }

    isNewRecord() {
        if (this.isGameClear()) {
            // ゲームクリアなので、獲得宝数はベストレコードと並ぶはずだが、念の為確認
            if (this.player.getNumberOfCollectedTreasures() >= this.bestNumberOfCollectedTreasures) {
                if (!this.fastestClearElapsedFrame) {
                    return true;
                }
                return this.elapsedFrame < this.fastestClearElapsedFrame;
            }
            return false;
        }
        return this.player.getNumberOfCollectedTreasures() >= this.bestNumberOfCollectedTreasures;
    }

    startSupervision() {
        this.gameState = GameSceneGeneralSupervision.GAME_STATE.STANDBY;
        this.initTimeText();

        // フィールド描画
        const fieldGraphics = this.scene.add.graphics({
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
                    this.scene.add.graphics({
                        lineStyle: { width: 1, color: 0x000000, alpha: 1 },
                        fillStyle: { color: 0x000000, alpha: 1 }
                    }).fillRect(j * GameConstants.GRID_SIZE, i * GameConstants.GRID_SIZE, GameConstants.GRID_SIZE, GameConstants.GRID_SIZE);
                }
            }
        }

        const play = this.scene.add.image(214, 214, 'play');
        play.setInteractive();

        play.on('pointerover', () => play.setTint(0x44ff44));
        play.on('pointerout', () => play.clearTint());

        play.on('pointerdown', () => {
            play.destroy();
            this.gameState = GameSceneGeneralSupervision.GAME_STATE.PLAYING;
        });

        const uiLayer = this.scene.add.layer();
        uiLayer.setDepth(100);

        const retry = this.scene.make.image({ x: 800, y: 550, key: 'retry' }, false);
        uiLayer.add(retry);
        retry.setInteractive();

        retry.on('pointerover', () => retry.setTint(0x44ff44));
        retry.on('pointerout', () => retry.clearTint());

        retry.on('pointerdown', () => {
            if (this.isGamePlayed()) {
                this.scene.scene.restart();
            }
        });

        // ゲームオーバー時に表示するオーバレイ
        this.overlay = this.scene.add.graphics();
        this.overlay.fillStyle(0xd20a13, 0.5).fillRect(0, 0, GameConstants.D_WIDTH, GameConstants.D_HEIGHT);
        this.overlay.setDepth(99);
        this.overlay.setVisible(false);

        // ゲームオーバーテキスト
        this.gameOverText = this.scene.add.bitmapText(645, 214, 'font', "GAME OVER!");
        this.gameOverText.setVisible(false);

        // クリアおめでとうテキスト
        this.congratulationsText = this.scene.add.bitmapText(645, 214, 'font', "CONGRATULATIONS!");
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
        this.roundsSupervision = new RoundsSupervision(GameConstants.numberOfRounds);
        for (let i = 0; i < GameConstants.numberOfRounds - 1; i++) {
            const singleRoundSupervision = new SingleRoundSupervision();
            for (let j = 0; j < GameConstants.numberOfTreasures; j++) {
                let treasurePos = { row: Math.floor(Math.random() * GameConstants.H), column: Math.floor(Math.random() * GameConstants.W) };
                // 壁が存在するところに宝を配置しないようにする
                while (GameConstants.FIELD[treasurePos.row][treasurePos.column] === 1) {
                    treasurePos = { row: Math.floor(Math.random() * GameConstants.H), column: Math.floor(Math.random() * GameConstants.W) };
                }
                const treasure = new Treasure(this.scene, 0xffff00, treasurePos.row, treasurePos.column);
                singleRoundSupervision.getTreasuresSupervision().addTreasure(treasure);
            }

            this.roundsSupervision.setRoundSupervision(i, singleRoundSupervision);
        }

        const singleRoundSupervision = new SingleRoundSupervision();
        let treasurePos = { row: 0, column: 0 };
        const treasure = new Treasure(this.scene, 0xffa500, treasurePos.row, treasurePos.column);
        singleRoundSupervision.getTreasuresSupervision().addTreasure(treasure);

        this.roundsSupervision.setRoundSupervision(GameConstants.numberOfRounds - 1, singleRoundSupervision);

        this.roundsSupervision.getCurrentRoundSupervision().getTreasuresSupervision().setAllTreasuresStateAppearance();
        // 最初のラウンドの宝描画
        this.roundsSupervision.getCurrentRoundSupervision().getTreasuresSupervision().drawAllTreasures();

        this.initCollectedTreasuresText();

        // ベストレコード
        try {
            const bestRecordJSON = localStorage.getItem('bestRecord');
            if(bestRecordJSON) {
                const bestRecordData = JSON.parse(bestRecordJSON);
                if(bestRecordData.bestNumberOfCollectedTreasures) {
                    this.bestNumberOfCollectedTreasures = bestRecordData.bestNumberOfCollectedTreasures;
                }
                if(bestRecordData.fastestClearElapsedFrame) {
                    this.fastestClearElapsedFrame = bestRecordData.fastestClearElapsedFrame;
                }
            }
        }catch(e){

        }
        this.initBestRecordText();
    }

    updatePerFrame(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
        if (!this.isPlaying()) {
            return;
        }
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
        for (const treasure of roundsSupervision.getCurrentRoundSupervision().getTreasuresSupervision().extractAppearanceTreasureList()) {
            if (this.player.position().row === treasure.position().row && this.player.position().column === treasure.position().column) {
                treasure.setStateCollected();
                treasure.clearDisplay();
                this.player.addNumberOfCollectedTreasures();
            }
        }

        this.updateCollectedTreasuresText();

        // 次ラウンド進行判断・次ラウンド進行
        if (roundsSupervision.isCompletedCurrentRound()) {
            if (roundsSupervision.isFinalRound()) {
                this.congratulationsText!.setVisible(true);

                this.gameState = GameSceneGeneralSupervision.GAME_STATE.GAME_CLEAR;
                this.handleRecordUpdate();
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
                if (!this.params.noGameOverMode) {
                    this.overlay!.setVisible(true);
                    this.gameOverText!.setVisible(true);
                    this.gameState = GameSceneGeneralSupervision.GAME_STATE.GAME_OVER;
                    this.handleRecordUpdate();
                }
            }
        }
    }

    handleRecordUpdate() {
        if (this.isNewRecord()) {
            this.bestNumberOfCollectedTreasures = this.player.getNumberOfCollectedTreasures();
            if (this.isGameClear()) {
                this.fastestClearElapsedFrame = this.elapsedFrame;
            }

            // ローカルストレージに保存
            try {
                localStorage.setItem('bestRecord', JSON.stringify({
                    "bestNumberOfCollectedTreasures": this.bestNumberOfCollectedTreasures,
                    "fastestClearElapsedFrame": this.fastestClearElapsedFrame,
                }));
            } catch (e) {
            }

            this.updateBestRecordText();
        }
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
