import { SceneContext } from "./sceneContext";

export class WrapArrowFactory {
    private static halfWidth: number;
    private static halfHeight: number;

    // 必ずSceneContext.setup(this)よりも後にセットアップすること
    static setup() {
        const textureFrame = SceneContext.textures.get('emotion').get(204);
        this.halfWidth = textureFrame.width / 2;
        this.halfHeight = textureFrame.height / 2;

        // アニメーションの作成
        SceneContext.anims.create({
            key: 'iconAnim',
            frames: SceneContext.anims.generateFrameNumbers('emotion', { start: 204, end: 205 }),
            frameRate: 2,
            repeat: -1 // 無限ループ
        });
    }

    // 矢印の真ん中を中心に下向きから時計回りにangle度だけ回転後、画像の左上を基準に配置する
    static makeWrapAroundArrow(location: { x: number, y: number }, angle: number) {
        // 左上に画像を配置する Container を作る
        const container = SceneContext.make.container({ x: location.x, y: location.y }, false);
        container.add(SceneContext.make.sprite({ x: this.halfWidth, y: this.halfHeight, key: "emotion", frame: 204 }, false).setAngle(angle).play("iconAnim"));
        return container;
    }
}