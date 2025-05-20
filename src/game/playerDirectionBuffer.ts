import { DIRECTION } from "./drection";

export class PlayerDirectionBuffer {
    private directionBuffer: DIRECTION | undefined;
    private readonly playerMoveCost: number;
    private readonly inputPreChargeFrames: number;
    private readonly getLastMoveDirection: () => DIRECTION | undefined;

    constructor(playerMoveCost: number, inputPreChargeFrames: number, getLastMoveDirection: () => DIRECTION| undefined) {
        this.directionBuffer = undefined;
        this.playerMoveCost = playerMoveCost;
        this.inputPreChargeFrames = inputPreChargeFrames;
        this.getLastMoveDirection = getLastMoveDirection;
    }

    trySetDirectionBuffer(direction: DIRECTION, currentCharge: number) : boolean {
        if(this.getLastMoveDirection() !== undefined && direction === this.getLastMoveDirection()) {
            return false;
        }
        if (currentCharge >= this.playerMoveCost - this.inputPreChargeFrames) {
            this.directionBuffer = direction;
            return true;
        }
        return false;
    }

    consumeDirectionBuffer() {
        if (this.directionBuffer !== undefined) {
            const ret = this.directionBuffer;
            this.directionBuffer = undefined;
            return ret;
        }
        return undefined;
    }
}