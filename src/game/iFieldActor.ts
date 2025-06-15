export interface IFieldActor {
    position(): {
        row: number;
        column: number;
    };

    getSize(): number;

    onCollideWithPlayer(): void;
}