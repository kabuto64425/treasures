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
        // 最大半径は89
        // できればbaseを最大半径の○に×の十字キーっぽい見た目にしたい
        const joystick = (scene.plugins.get('rexVirtualJoyStick') as VirtualJoyStickPlugin).add(scene, {
            x: 89,
            y: 400,
            radius: 89,
            base: scene.add.circle(0, 0, 89, 0x888888),
            thumb: scene.add.circle(0, 0, 80, 0xcccccc),
            // 方向の制限（水平・垂直）も可能
            dir: '4dir',
            forceMin: 0,
        });

        this.cusorKeys = joystick.createCursorKeys();
    }

    static getCusorKeys() {
        return this.cusorKeys;
    }
}