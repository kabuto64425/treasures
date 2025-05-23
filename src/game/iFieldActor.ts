export interface IFieldActor {
    position(): {
        row: number;
        column: number;
    };

    onCollideWithPlayer(): void;
}