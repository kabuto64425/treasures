import Phaser from "phaser";
import { Logger } from "./logger";
import { DIRECTION } from "./drection";

const NO_PRESS_RANK = -1;

export class InputCoordinator {
    private readonly inputPlugin: Phaser.Input.InputPlugin;
    private readonly keyMap: { [key: string]: Phaser.Input.Keyboard.Key };

    private readonly cursorKey: Phaser.Types.Input.Keyboard.CursorKeys;
    private readonly enterKey: Phaser.Input.Keyboard.Key;
    private readonly spaceKey: Phaser.Input.Keyboard.Key;
    private readonly shiftKey: Phaser.Input.Keyboard.Key;

    private isStartGameRequestedFromKey = false;
    private isRetryGameRequestedFromKey = false;
    private isPauseGameRequestedFromKey = false;

    private isStartGameRequestedFromUi = false;
    private isRetryGameRequestedFromUi = false;
    private isPauseGameRequestedFromUi = false;

    private readonly cursorKeysPressOrderRankMap: Map<string, number>;

    private approvedActionInfo: {
        readonly startGame: boolean,
        readonly pauseGame: boolean,
        readonly retryGame: boolean,
        readonly playerDirection: DIRECTION | undefined
    };

    constructor(inputPlugin: Phaser.Input.InputPlugin) {
        this.inputPlugin = inputPlugin;
        this.keyMap = {};

        // キー登録
        this.cursorKey = this.inputPlugin.keyboard.createCursorKeys();
        this.enterKey = this.inputPlugin.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.spaceKey = this.inputPlugin.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.shiftKey = this.inputPlugin.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        this.approvedActionInfo = {
            startGame: false,
            pauseGame: false,
            retryGame: false,
            playerDirection: undefined
        }

        const mapPairs = DIRECTION.values().map(d => [d.keyName, NO_PRESS_RANK] as [string, number]);
        this.cursorKeysPressOrderRankMap = new Map<string, number>(mapPairs);
    }

    private maxRankCusorKeysPressOrder() {
        return Math.max(Math.max(...this.cursorKeysPressOrderRankMap.values()));
    }

    private pickDirectionMaxOrderRank() {
        const maxRank = this.maxRankCusorKeysPressOrder();
        if (maxRank === NO_PRESS_RANK) {
            return undefined;
        }
        for (const direction of DIRECTION.values()) {
            const value = this.cursorKeysPressOrderRankMap.get(direction.keyName);
            if (value === maxRank) {
                return direction;
            }
        }
        // ここまで来ないはずだけど、念の為
        return undefined;
    }

    private updateCursorKeyRank(cursorKey: Phaser.Input.Keyboard.Key, direction: DIRECTION, maxRank: number, inputInspector: string[]) {
        if (cursorKey.isDown) {
            inputInspector.push(direction.keyName);
            if (this.cursorKeysPressOrderRankMap.get(direction.keyName) === NO_PRESS_RANK) {
                this.cursorKeysPressOrderRankMap.set(direction.keyName, maxRank + 1);
            }
        } else {
            this.cursorKeysPressOrderRankMap.set(direction.keyName, NO_PRESS_RANK);
        }
    }

    handleKeyboardInputs() {
        if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
            this.requestStartGameFromKey();
        }
        if (this.shiftKey.isDown) {
            this.requestRetryGameFromKey();
        }
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.requestPauseGameFromKey();
        }

        const maxRank = Math.max(this.maxRankCusorKeysPressOrder(), 0);

        // デバッグ用
        const inputInspector: string[] = [];

        this.updateCursorKeyRank(this.cursorKey.left, DIRECTION.LEFT, maxRank, inputInspector);
        this.updateCursorKeyRank(this.cursorKey.up, DIRECTION.UP, maxRank, inputInspector);
        this.updateCursorKeyRank(this.cursorKey.right, DIRECTION.RIGHT, maxRank, inputInspector);
        this.updateCursorKeyRank(this.cursorKey.down, DIRECTION.DOWN, maxRank, inputInspector);
    }

    private readonly requestStartGameFromKey = () => {
        Logger.debug("requestStartGame");
        this.isStartGameRequestedFromKey = true;
    }

    private readonly requestRetryGameFromKey = () => {
        Logger.debug("requestRetryGame");
        this.isRetryGameRequestedFromKey = true;
    }

    private readonly requestPauseGameFromKey = () => {
        Logger.debug("requestPauseGame");
        this.isPauseGameRequestedFromKey = true;
    }

    readonly requestStartGameFromUi = () => {
        Logger.debug("requestStartGame");
        this.isStartGameRequestedFromUi = true;
    }

    readonly requestRetryGameFromUi = () => {
        Logger.debug("requestRetryGame");
        this.isRetryGameRequestedFromUi = true;
    }

    readonly requestPauseGameFromUi = () => {
        Logger.debug("requestPauseGame");
        this.isPauseGameRequestedFromUi = true;
    }

    // 審査
    approveRequestedAction() {
        // ゲームメニューに関する審査
        let startGame = false;
        let pauseGame = false;
        let retryGame = false;

        if(this.isPauseGameRequestedFromUi) {
            pauseGame = true;
        }else if (this.isRetryGameRequestedFromUi) {
            retryGame = true;
        } else if (this.isStartGameRequestedFromUi) {
            startGame = true;
        } else if (this.isPauseGameRequestedFromKey) {
            pauseGame = true;
        } else if (this.isRetryGameRequestedFromKey) {
            retryGame = true;
        } else if (this.isStartGameRequestedFromKey) {
            startGame = true;
        }

        // 審査結果
        this.approvedActionInfo = {
            startGame: startGame,
            pauseGame: pauseGame,
            retryGame: retryGame,
            playerDirection: this.pickDirectionMaxOrderRank()
        }

        // 審査終了処理
        // 申請に関するフラグをリセット
        this.isStartGameRequestedFromKey = false;
        this.isRetryGameRequestedFromKey = false;
        this.isPauseGameRequestedFromKey = false;
        this.isStartGameRequestedFromUi = false;
        this.isRetryGameRequestedFromUi = false;
        this.isPauseGameRequestedFromUi = false;
    }

    // 審査結果は渡せるようにしておく
    getApprovedActionInfo = () => {
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