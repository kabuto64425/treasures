export class Recorder {
    private numberOfCollectedTreasures: number;
    private elapsedFrame: number;

    constructor() {
        this.numberOfCollectedTreasures = 0;
        this.elapsedFrame = 0;
    }

    addNumberOfCollectedTreasures() {
        this.numberOfCollectedTreasures++;
    }

    addElapsedFrame() {
        this.elapsedFrame++;
    }

    readonly getNumberOfCollectedTreasures = () => {
        return this.numberOfCollectedTreasures;
    }

    readonly getElapsedFrame = () => {
        return this.elapsedFrame;
    }
}

export class RecorderMediator {
    private static recorder: Recorder;

    static setRecoder(recorder: Recorder) {
        this.recorder = recorder;
    }

    static notifyTreasureCollected() {
        this.recorder.addNumberOfCollectedTreasures();
    }
}