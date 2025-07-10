export class DIRECTION {
    static readonly LEFT = new DIRECTION(0, "LEFT", 0, -1);
    static readonly UP = new DIRECTION(1, "UP", -1, 0);
    static readonly RIGHT = new DIRECTION(2, "RIGHT", 0, 1);
    static readonly DOWN = new DIRECTION(3, "DOWN", 1, 0);

    private constructor(
        public readonly id: number,
        public readonly keyName: string,
        public readonly dr: number,
        public readonly dc: number
    ) { }

    reverse(): DIRECTION {
        switch (this) {
            case DIRECTION.LEFT: return DIRECTION.RIGHT;
            case DIRECTION.RIGHT: return DIRECTION.LEFT;
            case DIRECTION.UP: return DIRECTION.DOWN;
            case DIRECTION.DOWN: return DIRECTION.UP;
            // ビルドエラー防止のため
            default: return DIRECTION.RIGHT;
        }
    }

    static values(): DIRECTION[] {
        return [DIRECTION.LEFT, DIRECTION.UP, DIRECTION.RIGHT, DIRECTION.DOWN] as const;
    }

    // ある方向から時計回りで方向リストを取得
    clockwiseFrom(): DIRECTION[] {
        const directions = DIRECTION.values();
        const startIndex = directions.indexOf(this);
        return [...directions.slice(startIndex), ...directions.slice(0, startIndex)];
    }
}