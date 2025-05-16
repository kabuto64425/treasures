import Phaser from "phaser";

export class InputCoordinator {
    private readonly inputPlugin: Phaser.Input.InputPlugin;
    private readonly keyMap: { [key: string]: Phaser.Input.Keyboard.Key };

    private readonly enterKey: Phaser.Input.Keyboard.Key;
    private readonly spaceKey: Phaser.Input.Keyboard.Key;

    private isStartGameRequested = false;
    private isRetryGameRequested = false;

    private approvedActionInfo : {
        startGame: boolean,
        retryGame: boolean
    }

    constructor(inputPlugin: Phaser.Input.InputPlugin) {
        this.inputPlugin = inputPlugin;
        this.keyMap = {};

        // キー登録
        this.enterKey = this.inputPlugin.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.spaceKey = this.inputPlugin.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.approvedActionInfo = {
            startGame: false,
            retryGame: false,
        }
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
    approveRequestedAction() {
        let startGame = false;
        let retryGame = false;

        if(this.isRetryGameRequested) {
            retryGame = true;
        } else if(this.isStartGameRequested) {
            startGame = true;
        }

        this.approvedActionInfo = {
            startGame : startGame,
            retryGame : retryGame,
        }

        this.isStartGameRequested = false;
        this.isRetryGameRequested = false;
    }

    //結果を返す
    getApprovedActionInfo = () => {
        // 書き換えができてしまうので、余裕があれば書き換えできないように何かしら対応したい
        return this.approvedActionInfo;
    }

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