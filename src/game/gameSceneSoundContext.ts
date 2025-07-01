import { SceneContext } from "./sceneContext";

export class GameSceneSoundContext {

    // // 必ずSceneContext.setup(this)よりも後にセットアップすること
    // コンテナ内でaddしたものの表示順は、depthに関係なく後からaddしたものが前に来るので注意
    private static sounds: {
        collect: Phaser.Sound.BaseSound,
        finalRound: Phaser.Sound.BaseSound,
        go: Phaser.Sound.BaseSound,
        lose: Phaser.Sound.BaseSound,
        roundUp: Phaser.Sound.BaseSound,
        win: Phaser.Sound.BaseSound
    };

    static setup() {
        this.sounds = {
            collect:SceneContext.sound.add("collect"),
            finalRound:SceneContext.sound.add("finalRound"),
            go:SceneContext.sound.add("go"),
            lose:SceneContext.sound.add("lose"),
            roundUp:SceneContext.sound.add("roundUp"),
            win:SceneContext.sound.add("win")
        } as const;
    }

    static playCollect() {
        this.sounds.collect.play();
    }

    static playFinalRound() {
        this.sounds.finalRound.play();
    }

    static playGo() {
        this.sounds.go.play();
    }

    static playLose() {
        this.sounds.lose.play();
    }

    static playRoundUp() {
        this.sounds.roundUp.play();
    }

    static playWin() {
        this.sounds.win.play();
    }
}