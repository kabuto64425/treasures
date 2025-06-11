import VirtualJoyStickPlugin from "phaser3-rex-plugins/plugins/virtualjoystick-plugin";

export class VirtualStickInput {
    private static cusorKeys: {
        up: Phaser.Input.Keyboard.Key;
        down: Phaser.Input.Keyboard.Key;
        left: Phaser.Input.Keyboard.Key;
        right: Phaser.Input.Keyboard.Key;
    };

    // VirtualJoyStick は Scene に強く結びついているため、
    // SceneContext を通さず直接 scene を渡すのが正しい設計判断らしい。 by chatgpt
    static setup(scene: Phaser.Scene) {
        const joystick = (scene.plugins.get('rexVirtualJoyStick') as VirtualJoyStickPlugin).add(scene, {
            x: 100,
            y: 400,
            radius: 50,
            base: scene.add.circle(0, 0, 50, 0x888888),
            thumb: scene.add.circle(0, 0, 25, 0xcccccc),
            // 方向の制限（水平・垂直）も可能
            dir: '4dir',
        });
        this.cusorKeys = joystick.createCursorKeys();
    }

    static getCusorKeys() {
        return this.cusorKeys;
    }
}