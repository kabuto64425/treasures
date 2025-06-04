import { GameSceneContainerContext } from "./gameSceneContainerContext";
import { SceneContext } from "./sceneContext";

export class WrapArrow {
    private readonly container: Phaser.GameObjects.Container;
    private readonly sprite: Phaser.GameObjects.Sprite;
    private readonly frameGraphics: Phaser.GameObjects.Graphics;
    private readonly visibleWrapArrowFrameGraphic: boolean;

    constructor(location: { x: number, y: number }, angle: number, visibleWrapArrowFrameGraphic: boolean) {
        this.container = SceneContext.make.container({ x: location.x, y: location.y }, false);
        this.sprite = SceneContext.make.sprite(
            { x: WrapArrowFactory.size.width / 2, y: WrapArrowFactory.size.height / 2, key: "emotion", frame: 204 },
            false
        ).setAngle(angle).play("iconAnim");

        this.frameGraphics = SceneContext.make.graphics({}, false);
        this.visibleWrapArrowFrameGraphic = visibleWrapArrowFrameGraphic;
    }

    setup() {
        GameSceneContainerContext.fieldContainer.add(this.container);

        this.container.add(this.sprite);
        this.frameGraphics.strokeRect(0, 0, WrapArrowFactory.size.width, WrapArrowFactory.size.height);
        this.container.add(this.frameGraphics);

        this.frameGraphics.setVisible(this.visibleWrapArrowFrameGraphic);
        this.hide();
    }

    bringToTop() {
        GameSceneContainerContext.fieldContainer.bringToTop(this.container);
    }

    show() {
        this.container.setVisible(true);
    }

    hide() {
        this.container.setVisible(false);
    }

    pauseAnimation() {
        this.sprite.anims.pause();
    }

    resumeAnimation() {
        this.sprite.anims.resume();
    }
}

export class WrapArrowFactory {
    private static width: number;
    private static height: number;

    // 必ずSceneContext.setup(this)よりも後にセットアップすること
    static setup() {
        const textureFrame = SceneContext.textures.get('emotion').get(204);
        this.width = textureFrame.width;
        this.height = textureFrame.height;

        // アニメーションの作成
        SceneContext.anims.create({
            key: 'iconAnim',
            frames: SceneContext.anims.generateFrameNumbers('emotion', { start: 204, end: 205 }),
            frameRate: 2,
            repeat: -1 // 無限ループ
        });
    }

    static get size() {
        return {
            width: this.width,
            height: this.height
        };
    }

    // 矢印の真ん中を中心に下向きから時計回りにangle度だけ回転後、画像の左上を基準に配置する
    static makeWrapAroundArrow(location: { x: number, y: number }, angle: number, visibleWrapArrowFrameGraphic: boolean) {
        return new WrapArrow(location, angle, visibleWrapArrowFrameGraphic);
    }
}