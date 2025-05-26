import { DIRECTION } from "./drection";
import { Position } from "./utils";

export class DebugData {
    updateDuration: number = 0;
    frameDelta: number = 0;

    player: {
        chargeAmount?: number,
        position?: Position,
        lastMoveDirection?: DIRECTION
    } = {
            chargeAmount: undefined,
            position: undefined,
            lastMoveDirection: undefined
        };
}

export class DebugDataMediator {
    private static data: DebugData;

    static setDebugData(data: DebugData) {
        this.data = data;
    }

    static setPlayerDebugValue(data: Partial<DebugData["player"]>) {
        if (!this.data) {
            console.warn("DebugData is not set yet.");
            return;
        }
        Object.assign(this.data.player, data);
    }
}