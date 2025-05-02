import Phaser from 'phaser';
import { GameSceneGeneralSupervision } from './gameSceneGeneralSupervision';

export class GameScene extends Phaser.Scene {
    private params: any;
    private gameSceneGeneralSupervision: GameSceneGeneralSupervision | undefined;

    private cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;

    constructor(params: any) {
        super('gameScene');
        this.params = params;
    }

    preload() {
        console.log("preload!!");
        this.load.atlas('fontatlas', '/treasures/bitmap-fonts-debug.png', '/treasures/bitmap-fonts.json');
        this.load.xml('azoXML', '/treasures/azo-fire.xml');

        this.load.image('play', '/treasures/play.svg');
        this.load.image('retry', '/treasures/retry.svg');
        
    }

    create() {
        console.log("create!!");

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
        console.log("update");
        // create内で確実に作成しているので、アサーションでもいけるはず
        const gameSceneGeneralSupervision = this.gameSceneGeneralSupervision!;
        if(gameSceneGeneralSupervision.isPlaying()) {
            gameSceneGeneralSupervision.updatePerFrame(this.cursors!);
        }
    }
}