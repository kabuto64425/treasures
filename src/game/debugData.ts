
export class DebugData {
    updateDuration: number = 0;
    frameDelta: number = 0;

    player: {
        chargeAmount: number
    } = {
            chargeAmount: 0
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