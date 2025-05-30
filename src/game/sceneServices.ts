export class SceneServices {
    private static scene: Phaser.Scene;


    static setScene(scene: Phaser.Scene) {
        this.scene = scene;
    }

    // これを使用してゲームの物体を生成すると、シーンに自動的に加わる
    static get add(): Phaser.GameObjects.GameObjectFactory {
        return this.scene.add;
    }

    // これを使用してゲームの物体を生成してもシーンには自動的に加わらない。どこかのレイヤーなどに加えるときに使用
    static get make(): Phaser.GameObjects.GameObjectCreator {
        return this.scene.make;
    }

    static get scenePlugin(): Phaser.Scenes.ScenePlugin {
        return this.scene.scene;
    }

    static get inputPlugin(): Phaser.Input.InputPlugin {
        return this.scene.input;
    }

    static get time(): Phaser.Time.Clock {
        return this.scene.time;
    }
}