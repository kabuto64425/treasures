import { DIRECTION } from "./drection";
import { Position } from "./utils";

export class DebugData {
    updateDuration: number = 0;
    frameDelta: number = 0;

    player: {
        chargeAmount?: number,
        position?: Position,
        roomId?: number,
        lastMoveDirection?: DIRECTION
    } = {
            chargeAmount: undefined,
            position: undefined,
            lastMoveDirection: undefined
        };

    enemies: {
        chargeAmount?: number,
        position?: Position,
        roomId?: number
    }[] = [];
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

    static setEnemiesDebugValue(datas: Partial<DebugData["enemies"]>[number][]) {
        if (!this.data) {
            console.warn("DebugData is not set yet.");
            return;
        }
        for (const [index, data] of datas.entries()) {
            // 必要なら配列を拡張して安全にアクセス
            while (this.data.enemies.length <= index) {
                this.data.enemies.push({});
            }
            Object.assign(this.data.enemies[index], data);
        }
    }
}