import Phaser from "phaser";
import { Logger } from "./logger";
import { DIRECTION } from "./drection";

export class InputCoordinator {
    private readonly inputPlugin: Phaser.Input.InputPlugin;
    private readonly keyMap: { [key: string]: Phaser.Input.Keyboard.Key };

    private readonly cursorKey: Phaser.Types.Input.Keyboard.CursorKeys;
    private readonly enterKey: Phaser.Input.Keyboard.Key;
    private readonly spaceKey: Phaser.Input.Keyboard.Key;

    private isStartGameRequestedFromKey = false;
    private isRetryGameRequestedFromKey = false;

    private isStartGameRequestedFromUi = false;
    private isRetryGameRequestedFromUi = false;

    private readonly requestedPlayerDirectionMap: Map<string, boolean>;

    private approvedGameMenuActionInfo: {
        readonly startGame: boolean,
        readonly retryGame: boolean,
    };

    private readonly approvedPlayerDirectionMap: Map<string, boolean>;

    constructor(inputPlugin: Phaser.Input.InputPlugin) {
        this.inputPlugin = inputPlugin;
        this.keyMap = {};

        // キー登録
        this.cursorKey = this.inputPlugin.keyboard.createCursorKeys();
        this.enterKey = this.inputPlugin.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.spaceKey = this.inputPlugin.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.approvedGameMenuActionInfo = {
            startGame: false,
            retryGame: false,
        }

        const mapPairs = DIRECTION.values().map(d => [d.keyName, false] as [string, boolean]);
        this.requestedPlayerDirectionMap = new Map<string, boolean>(mapPairs);
        this.approvedPlayerDirectionMap = new Map<string, boolean>(mapPairs);
    }

    handleKeyboardInputs() {
        if (this.enterKey.isDown) {
            this.requestStartGameFromKey();
        }
        if (this.spaceKey.isDown) {
            this.requestRetryGameFromKey();
        }

        this.requestedPlayerDirectionMap.set(DIRECTION.LEFT.keyName, this.cursorKey.left.isDown);
        this.requestedPlayerDirectionMap.set(DIRECTION.UP.keyName, this.cursorKey.up.isDown);
        this.requestedPlayerDirectionMap.set(DIRECTION.RIGHT.keyName, this.cursorKey.right.isDown);
        this.requestedPlayerDirectionMap.set(DIRECTION.DOWN.keyName, this.cursorKey.down.isDown);
    }

    private readonly requestStartGameFromKey = () => {
        Logger.debug("requestStartGame");
        this.isStartGameRequestedFromKey = true;
    }

    private readonly requestRetryGameFromKey = () => {
        Logger.debug("requestRetryGame");
        this.isRetryGameRequestedFromKey = true;
    }

    readonly requestStartGameFromUi = () => {
        Logger.debug("requestStartGame");
        this.isStartGameRequestedFromUi = true;
    }

    readonly requestRetryGameFromUi = () => {
        Logger.debug("requestRetryGame");
        this.isRetryGameRequestedFromUi = true;
    }

    // 審査
    approveRequestedAction() {
        // ゲームメニューに関する審査
        let startGame = false;
        let retryGame = false;

        if (this.isRetryGameRequestedFromUi) {
            retryGame = true;
        } else if (this.isStartGameRequestedFromUi) {
            startGame = true;
        } else if (this.isRetryGameRequestedFromKey) {
            retryGame = true;
        } else if (this.isStartGameRequestedFromKey) {
            startGame = true;
        }

        // 審査結果
        this.approvedGameMenuActionInfo = {
            startGame: startGame,
            retryGame: retryGame,
        }

        // プレーヤーの進行方向に関する審査(審査結果のセットも含む)
        this.approvedPlayerDirectionMap.forEach((_, key) => {
            this.approvedPlayerDirectionMap.set(key, false);
        });
        if(!this.requestedPlayerDirectionMap.get(DIRECTION.LEFT.keyName) || !this.requestedPlayerDirectionMap.get(DIRECTION.RIGHT.keyName)) {
            if(this.requestedPlayerDirectionMap.get(DIRECTION.LEFT.keyName)) {
                this.approvedPlayerDirectionMap.set(DIRECTION.LEFT.keyName, true);
            }
            if(this.requestedPlayerDirectionMap.get(DIRECTION.RIGHT.keyName)) {
                this.approvedPlayerDirectionMap.set(DIRECTION.RIGHT.keyName, true);
            } 
        }

        if(!this.requestedPlayerDirectionMap.get(DIRECTION.UP.keyName) || !this.requestedPlayerDirectionMap.get(DIRECTION.DOWN.keyName)) {
            if(this.requestedPlayerDirectionMap.get(DIRECTION.UP.keyName)) {
                this.approvedPlayerDirectionMap.set(DIRECTION.UP.keyName, true);
            }
            if(this.requestedPlayerDirectionMap.get(DIRECTION.DOWN.keyName)) {
                this.approvedPlayerDirectionMap.set(DIRECTION.DOWN.keyName, true);
            } 
        }


        // 審査終了処理
        // 申請に関するフラグをリセット
        this.isStartGameRequestedFromKey = false;
        this.isRetryGameRequestedFromKey = false;
        this.isStartGameRequestedFromUi = false;
        this.isRetryGameRequestedFromUi = false;
        this.requestedPlayerDirectionMap.forEach((_, key) => {
            this.requestedPlayerDirectionMap.set(key, false);
        });
    }

    // 審査結果は渡せるようにしておく
    // ゲームメニューに関する審査
    getApprovedGameMenuActionInfo = () => {
        return this.approvedGameMenuActionInfo;
    }

    // プレーヤー進行方向に関する審査結果
    isApprovedPlayerDirection = (direction : DIRECTION) => {
        // DIRECTIONが持つ全方向、確実に値を持っているはず。
        // なので、引数がDIRECTIONだと、マップが持ってないキーが指定されることはないはず。
        // アサーションでも問題ない。
        return this.approvedPlayerDirectionMap.get(direction.keyName)!;
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