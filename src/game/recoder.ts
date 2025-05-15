export class Recorder {
    private numberOfCollectedTreasures: number;
    private elapsedFrame: number;

    constructor() {
        this.numberOfCollectedTreasures = 0;
        this.elapsedFrame = 0;
    }

    // 宝から通知を受け取った時の処理(要命名)
    addNumberOfCollectedTreasures() {
        this.numberOfCollectedTreasures++;
    }

    // elapsedFrameを増やす処理(要命名)
    addElapsedFrame() {
        this.elapsedFrame++;
    }
}