export class SceneContext {

    private static components: {
        add: Phaser.GameObjects.GameObjectFactory,
        make: Phaser.GameObjects.GameObjectCreator,
        scenePlugin: Phaser.Scenes.ScenePlugin,
        inputPlugin: Phaser.Input.InputPlugin,
        time: Phaser.Time.Clock
    };

    static setup(scene: Phaser.Scene) {
        this.components = {
            add: scene.add,
            make: scene.make,
            scenePlugin: scene.scene,
            inputPlugin: scene.input,
            time: scene.time,
        };
    }

    // これを使用してゲームの物体を生成すると、シーンに自動的に加わる
    static get add(): Phaser.GameObjects.GameObjectFactory {
        return this.components.add;
    }

    // これを使用してゲームの物体を生成してもシーンには自動的に加わらない。どこかのレイヤーなどに加えるときに使用
    static get make(): Phaser.GameObjects.GameObjectCreator {
        return this.components.make;
    }

    static get scenePlugin(): Phaser.Scenes.ScenePlugin {
        return this.components.scenePlugin;
    }

    static get inputPlugin(): Phaser.Input.InputPlugin {
        return this.components.inputPlugin;
    }

    static get time(): Phaser.Time.Clock {
        return this.components.time;
    }
}