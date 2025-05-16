import Phaser from "phaser";

export class InputManager {
    private readonly inputPlugin: Phaser.Input.InputPlugin;
    private readonly keyMap: { [key: string]: Phaser.Input.Keyboard.Key };

    private readonly enterKey: Phaser.Input.Keyboard.Key;
    private readonly spaceKey: Phaser.Input.Keyboard.Key;

    //@ts-ignore審査かならず使う
    private isStartGameRequested = false;
    //@ts-ignore審査かならず使う
    private isRetryGameRequested = false;

    constructor(inputPlugin: Phaser.Input.InputPlugin) {
        this.inputPlugin = inputPlugin;
        this.keyMap = {};

        // キー登録
        this.enterKey = this.inputPlugin.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.spaceKey = this.inputPlugin.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    handleKeyboardInputs() {
        if (this.enterKey.isDown) {
            this.requestStartGame();
        }
        if (this.spaceKey.isDown) {
            this.requestRetryGame();
        }
    }

    // リクエスト→審査→採用結果を返す関数
    readonly requestStartGame = () => {
        this.isStartGameRequested = true;
    }

    readonly requestRetryGame = () => {
        this.isRetryGameRequested = true;
    }

    // 審査

    //結果を返す

    // @ts-ignore 使うときが来るかも。来なかったら消す
    private registerKeys(keyNames: string[]) {
        keyNames.forEach((keyName: string) => {
            const code = Phaser.Input.Keyboard.KeyCodes.ENTER;
            const key = this.inputPlugin.keyboard.addKey(code);
            this.keyMap[keyName] = key;
        });
    }

    // @ts-ignore 使うときが来るかも。来なかったら消す
    // ヘルパー: 特定のキーが現在押されているか
    private isKeyPressed(keyName: string) {
        const key = this.keyMap[keyName];
        return key?.isDown ?? false;
    }
}