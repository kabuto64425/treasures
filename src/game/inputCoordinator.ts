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

        this.cusorKeysPressOrderRank = {
            arrowUp: NO_PRESS_RANK,
            arrowDown: NO_PRESS_RANK,
            arrowLeft: NO_PRESS_RANK,
            arrowRight: NO_PRESS_RANK,
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
        if(maxRank === NO_PRESS_RANK) {
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
        if (this.enterKey.isDown) {
            this.requestStartGameFromKey();
        }
        if (this.spaceKey.isDown) {
            this.requestRetryGameFromKey();
        }

        const maxRank = Math.max(this.maxRankCusorKeysPressOrder(), 1);

        if (this.cursorKey.left.isDown) {
            if(this.cusorKeysPressOrderRank.arrowLeft === NO_PRESS_RANK) {
                this.cusorKeysPressOrderRank.arrowLeft = maxRank + 1;
            }
        } else {
            this.cusorKeysPressOrderRank.arrowLeft = NO_PRESS_RANK;
        }

        if (this.cursorKey.up.isDown) {
            if(this.cusorKeysPressOrderRank.arrowUp === NO_PRESS_RANK) {
                this.cusorKeysPressOrderRank.arrowUp = maxRank + 1;
            }
        } else {
            this.cusorKeysPressOrderRank.arrowUp = NO_PRESS_RANK;
        }

        if (this.cursorKey.right.isDown) {
            if(this.cusorKeysPressOrderRank.arrowRight === NO_PRESS_RANK) {
                this.cusorKeysPressOrderRank.arrowRight = maxRank + 1;
            }
        } else {
            this.cusorKeysPressOrderRank.arrowRight = NO_PRESS_RANK;
        }

        if (this.cursorKey.down.isDown) {
            if(this.cusorKeysPressOrderRank.arrowDown === NO_PRESS_RANK) {
                this.cusorKeysPressOrderRank.arrowDown = maxRank + 1;
            }
        } else {
            this.cusorKeysPressOrderRank.arrowDown = NO_PRESS_RANK;
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