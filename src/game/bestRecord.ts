export class BestRecord {
    private numberOfCollectedTreasures: number;
    private elapsedFrame: number | undefined;
    private isGameComplete: boolean;

    private enableUsingLocalstorage: boolean;

    constructor(enableUsingLocalstorage: boolean) {
        this.numberOfCollectedTreasures = 0;
        this.isGameComplete = false;
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
            if (bestRecordData.fastestCompleteElapsedFrame) {
                this.elapsedFrame = bestRecordData.fastestCompleteElapsedFrame;
            }
            if (bestRecordData.isGameComplete) {
                this.isGameComplete = bestRecordData.isGameComplete;
            }
        }
    }

    getBestRecord = () => {
        return {
            numberOfCollectedTreasures: this.numberOfCollectedTreasures,
            elapsedFrame: this.elapsedFrame
        }
    }

    private isNewRecord(isThisGameComplete: boolean, currentNumberOfCollectedTreasures: number, currentElapedFrame: number) {
        if (isThisGameComplete && this.isGameComplete) {
            // ゲームクリアなので、獲得宝数はベストレコードと並ぶはずだが、念の為確認
            if (currentNumberOfCollectedTreasures >= this.numberOfCollectedTreasures) {
                if (!this.elapsedFrame) {
                    return true;
                }
                return currentElapedFrame < this.elapsedFrame;
            }
            return false;
        }
        if(isThisGameComplete && !this.isGameComplete) {
            return true;
        }
        if(!isThisGameComplete && this.isGameComplete) {
            return false;
        }
        return currentNumberOfCollectedTreasures >= this.numberOfCollectedTreasures;
    }

    readonly updateBestRecord = (isThisGameComplete: boolean, currentNumberOfCollectedTreasures: number, currentElapedFrame: number) => {
        if (!this.isNewRecord(isThisGameComplete, currentNumberOfCollectedTreasures, currentElapedFrame)) {
            return false;
        }
        this.numberOfCollectedTreasures = currentNumberOfCollectedTreasures;
        if (isThisGameComplete) {
            this.elapsedFrame = currentElapedFrame;
        }
        this.isGameComplete = isThisGameComplete;

        if (this.enableUsingLocalstorage) {
            try {
                localStorage.setItem("bestRecord", JSON.stringify({
                    "bestNumberOfCollectedTreasures": this.numberOfCollectedTreasures,
                    "fastestCompleteElapsedFrame": this.elapsedFrame,
                    "isGameComplete" : this.isGameComplete
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