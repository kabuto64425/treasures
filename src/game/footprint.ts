import { Position } from "./utils";

export class Footprint {
    private readonly queue: { position: Position, frame: number }[] = [];

    private readonly limit: number;
    private isLastprintStepped : boolean;

    constructor(limit: number = 30) {
        this.limit = limit;
        this.isLastprintStepped = false;
    }

    push(position: Position, currentFrame: number) {
        this.push(position, currentFrame);
    }

    getFirstPrint() {
        return this.queue[0].position;
    }

    isLastprintSteppedOnByEnemy() {
        return this.isLastprintStepped;
    }

    lastprintSteppedOnByEnemy() {
        this.isLastprintStepped = true;
    }

    resolveFootprintPerFrame(currentFrame: number) {
        // 足跡は必ず1つは残しておきたいから
        if (this.queue.length > 1) {
            this.removeFirstIfTooOld(currentFrame);
        }

        
    }

    private removeFirstIfTooOld(currentFrame: number) {
        const firstPrint = this.queue[0];
        if (currentFrame - firstPrint.frame > this.limit) {
            this.removeFirstPrint();
        }
    }

    removeFirstPrint() {
        this.queue.shift();
    }
}