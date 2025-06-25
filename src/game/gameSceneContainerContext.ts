import { SceneContext } from "./sceneContext";

export class GameSceneContainerContext {

    // // 必ずSceneContext.setup(this)よりも後にセットアップすること
    // コンテナ内でaddしたものの表示順は、depthに関係なく後からaddしたものが前に来るので注意
    private static containers: {
        leftContainer: Phaser.GameObjects.Container,
        fieldContainer: Phaser.GameObjects.Container,
        rightContainer: Phaser.GameObjects.Container
    };

    static setup() {
        this.containers = {
            leftContainer:SceneContext.add.container(),
            fieldContainer:SceneContext.add.container(),
            rightContainer:SceneContext.add.container()
        } as const;

        this.containers.leftContainer.setPosition(0, 0);
        this.containers.leftContainer.setDepth(98);

        this.containers.fieldContainer.setPosition(178, 8);
        this.containers.fieldContainer.setDepth(98);

        this.containers.rightContainer.setPosition(1102, 0);
        this.containers.rightContainer.setDepth(98);
    }

    static get leftContainer(): Phaser.GameObjects.Container {
        return this.containers.leftContainer;
    }

    static get fieldContainer(): Phaser.GameObjects.Container {
        return this.containers.fieldContainer;
    }

    static get rightContainer(): Phaser.GameObjects.Container {
        return this.containers.rightContainer;
    }
}