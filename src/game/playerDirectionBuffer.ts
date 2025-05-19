import { DIRECTION } from "./drection";
import { Logger } from "./logger";

export class PlayerDirectionBuffer {
    private readonly queue: { direction: DIRECTION, frame: number }[] = [];
    private readonly bufferLimitFrames: number;
    private readonly sameDirectionInputCooldownFrames : number

    private lastPushedDirection: DIRECTION | undefined;
    private lastPushedFrame: number | undefined;

    constructor(bufferLimitFrames: number, sameDirectionInputCooldownFrames: number) {
        this.bufferLimitFrames = bufferLimitFrames;
        this.sameDirectionInputCooldownFrames = sameDirectionInputCooldownFrames;
        this.lastPushedDirection = undefined;
        this.lastPushedFrame = undefined;
    }

    push(direction: DIRECTION, currentFrame: number) {
        if(this.lastPushedDirection && direction === this.lastPushedDirection) {
            if(this.lastPushedFrame && (currentFrame - this.lastPushedFrame <= this.sameDirectionInputCooldownFrames)) {
                return;
            }
        }
        this.queue.push({ direction, frame: currentFrame });
        this.lastPushedDirection = direction;
        this.lastPushedFrame = currentFrame;
    }

    getQueue() {
        return this.queue;
    }

    consume(currentFrame: number): DIRECTION | undefined {
        Logger.debug("consume");
        while (this.queue.length > 0) {
            const { direction, frame } = this.queue[0];
            if (currentFrame - frame <= this.bufferLimitFrames) {
                this.queue.shift();
                return direction;
            } else {
                this.queue.shift(); // 古いので破棄
            }
        }
        return undefined;
    }

    clear() {
        this.queue.length = 0;
    }
}