import Phaser from "phaser";
import { Logger } from "./logger";
import { DIRECTION } from "./drection";

export class InputCoordinator {
    private readonly inputPlugin: Phaser.Input.InputPlugin;
    private readonly keyMap: { [key: string]: Phaser.Input.Keyboard.Key };

    // カーソルが押されたときの経過フレームを記録する用。
    private elapsedFrame: number;

    private readonly cursorKey: Phaser.Types.Input.Keyboard.CursorKeys;
    private readonly enterKey: Phaser.Input.Keyboard.Key;
    private readonly spaceKey: Phaser.Input.Keyboard.Key;

    private readonly cusorKeysPressOrderRank: {
        arrowUp: number,
        arrowDown: number,
        arrowLeft: number,
        arrowRight: number
    };

    private isStartGameRequestedFromKey = false;
    private isRetryGameRequestedFromKey = false;

    private isStartGameRequestedFromUi = false;
    private isRetryGameRequestedFromUi = false;

    private approvedActionInfo: {
        readonly startGame: boolean,
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

        this.elapsedFrame = 0;

        this.cusorKeysPressOrderRank = {
            arrowUp: -1,
            arrowDown: -1,
            arrowLeft: -1,
            arrowRight: -1,
        };

        this.approvedActionInfo = {
            startGame: false,
            retryGame: false,
            playerDirection: undefined
        }
    }

    private maxRankCusorKeysPressOrder() {
        return Math.max(...Object.values(this.cusorKeysPressOrderRank));
    }

    private pickDirectionMaxOrderRank() {
        const maxRank = this.maxRankCusorKeysPressOrder();
        if(maxRank <= 0) {
            return undefined;
        }
        if(this.cusorKeysPressOrderRank.arrowLeft === maxRank) {
            return DIRECTION.LEFT;
        }
        if(this.cusorKeysPressOrderRank.arrowUp === maxRank) {
            return DIRECTION.UP;
        }
        if(this.cusorKeysPressOrderRank.arrowRight === maxRank) {
            return DIRECTION.RIGHT;
        }
        if(this.cusorKeysPressOrderRank.arrowDown === maxRank) {
            return DIRECTION.DOWN;
        }
        // ここまで来ないはずだけど、念の為
        return undefined;
    }

    handleKeyboardInputs() {
        this.elapsedFrame++;
        if (this.enterKey.isDown) {
            this.requestStartGameFromKey();
        }
        if (this.spaceKey.isDown) {
            this.requestRetryGameFromKey();
        }

        const maxRank = Math.max(this.maxRankCusorKeysPressOrder(), 1);

        if (this.cursorKey.left.isDown) {
            this.cusorKeysPressOrderRank.arrowLeft = maxRank + 1;
        } else {
            this.cusorKeysPressOrderRank.arrowLeft = -1;
        }

        if (this.cursorKey.up.isDown) {
            this.cusorKeysPressOrderRank.arrowUp = maxRank + 1;
        } else {
            this.cusorKeysPressOrderRank.arrowUp = -1;
        }

        if (this.cursorKey.right.isDown) {
            this.cusorKeysPressOrderRank.arrowRight = maxRank + 1;
        } else {
            this.cusorKeysPressOrderRank.arrowRight = -1;
        }

        if (this.cursorKey.down.isDown) {
            this.cusorKeysPressOrderRank.arrowDown = maxRank + 1;
        } else {
            this.cusorKeysPressOrderRank.arrowDown = -1;
        }
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
        let startGame = false;
        let retryGame = false;

        if (this.isRetryGameRequestedFromUi) {
            retryGame = true;
        } else if (this.isStartGameRequestedFromUi) {
            Logger.debug("isStartGameRequestedFromUi");
            startGame = true;
        } else if (this.isRetryGameRequestedFromKey) {
            retryGame = true;
        } else if (this.isStartGameRequestedFromKey) {
            startGame = true;
        }

        this.approvedActionInfo = {
            startGame: startGame,
            retryGame: retryGame,
            playerDirection: this.pickDirectionMaxOrderRank()
        }

        this.isStartGameRequestedFromKey = false;
        this.isRetryGameRequestedFromKey = false;
        this.isStartGameRequestedFromUi = false;
        this.isRetryGameRequestedFromUi = false;
    }

    //結果を返す
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