import { SceneContext } from "./sceneContext";

export class GameSceneContainerContext {

    // // 必ずSceneContext.setup(this)よりも後にセットアップすること
    // コンテナ内でaddしたものの表示順は、depthに関係なく後からaddしたものが前に来るので注意
    private static containers: {
        fieldContainer: Phaser.GameObjects.Container,
        uiContainer: Phaser.GameObjects.Container
    };

    static setup() {
        this.containers = {
            fieldContainer:SceneContext.add.container(),
            uiContainer:SceneContext.add.container()
        } as const;

        this.containers.fieldContainer.setPosition(30, 8);
        this.containers.fieldContainer.setDepth(98);

        this.containers.uiContainer.setPosition(954, 0);
        this.containers.uiContainer.setDepth(98);
    }

    static get fieldContainer(): Phaser.GameObjects.Container {
        return this.containers.fieldContainer;
    }

    static get uiContainer(): Phaser.GameObjects.Container {
        return this.containers.uiContainer;
    }
}