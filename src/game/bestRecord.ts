import * as Utils from "./utils"

export class BestRecord {
    private numberOfCollectedTreasures: number;
    private elapsedFrame: number | undefined;

    private enableUsingLocalstorage: boolean;

    constructor(enableUsingLocalstorage: boolean) {
        this.numberOfCollectedTreasures = 0;
        this.enableUsingLocalstorage = enableUsingLocalstorage;

        if (!enableUsingLocalstorage) {
            return;
        }

        const bestRecordJSON = localStorage.getItem("bestRecord");

        if (bestRecordJSON) {
            const bestRecordData = JSON.parse(bestRecordJSON);
            if (bestRecordData.bestNumberOfCollectedTreasures) {
                this.numberOfCollectedTreasures = bestRecordData.bestNumberOfCollectedTreasures;
            }
            if (bestRecordData.fastestClearElapsedFrame) {
                this.elapsedFrame = bestRecordData.fastestClearElapsedFrame;
            }
        }
    }

    getNumberOfCollectedTreasures() {
        return this.numberOfCollectedTreasures;
    }

    getElapsedFrame() {
        return this.elapsedFrame;
    }

    readonly createBestRecordStr = () => {
        let clearTimeStr = "--:--.---";
        if (this.elapsedFrame) {
            clearTimeStr = Utils.createFormattedTimeFromFrame(this.elapsedFrame);
        }
        return `${this.numberOfCollectedTreasures}/${Utils.calculateNumberOfTreasuresInALLRounds()} ${clearTimeStr}`;
    }

    private isNewRecord(isGameClear: boolean, currentNumberOfCollectedTreasures: number, currentElapedFrame: number) {
        if (isGameClear) {
            // ゲームクリアなので、獲得宝数はベストレコードと並ぶはずだが、念の為確認
            if (currentNumberOfCollectedTreasures >= this.numberOfCollectedTreasures) {
                if (!this.elapsedFrame) {
                    return true;
                }
                return currentElapedFrame < this.elapsedFrame;
            }
            return false;
        }
        return currentNumberOfCollectedTreasures >= this.numberOfCollectedTreasures;
    }

    readonly updateBestRecord = (isGameClear: boolean, currentNumberOfCollectedTreasures: number, currentElapedFrame: number) => {
        if (!this.isNewRecord(isGameClear, currentNumberOfCollectedTreasures, currentElapedFrame)) {
            return false;
        }
        this.numberOfCollectedTreasures = currentNumberOfCollectedTreasures;
        if (isGameClear) {
            this.elapsedFrame = currentElapedFrame;
        }

        if (this.enableUsingLocalstorage) {
            try {
                localStorage.setItem("bestRecord", JSON.stringify({
                    "bestNumberOfCollectedTreasures": this.numberOfCollectedTreasures,
                    "fastestClearElapsedFrame": this.elapsedFrame,
                }));
            } catch (e) {
            }
        }

        return true;
    }

    readonly deleteBestRecord = () => {
        this.numberOfCollectedTreasures = 0;
        this.elapsedFrame = undefined;

        if (this.enableUsingLocalstorage) {
            try {
                localStorage.removeItem("bestRecord");
            } catch (e) {

            }
        }
    }
}