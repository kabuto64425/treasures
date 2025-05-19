import { DIRECTION } from "./drection";

export class PlayerDirectionBuffer {
    private directionBuffer: DIRECTION | undefined;
    private readonly playerMoveCost: number;
    private readonly inputPreChargeFrames: number;

    constructor(playerMoveCost: number, inputPreChargeFrames: number) {
        this.directionBuffer = undefined;
        this.playerMoveCost = playerMoveCost;
        this.inputPreChargeFrames = inputPreChargeFrames;
    }

    trySetDirectionBuffer(direction: DIRECTION, currentCharge: number) {
        if (currentCharge >= this.playerMoveCost - this.inputPreChargeFrames) {
            this.directionBuffer = direction;
        }
    }

    consumeDirectionBuffer() {
        if(this.directionBuffer !== undefined) {
            const ret = this.directionBuffer;
            this.directionBuffer = undefined;
            return ret;
        }
        return undefined;
    }
}