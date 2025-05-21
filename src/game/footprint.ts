type Position = {
    row: number,
    column: number
}

export class Footprint {
    private readonly queue: { position: Position, frame: number }[] = [];

    private readonly bufferLimit: number;

    constructor(bufferLimit: number = 30) {
        this.bufferLimit = bufferLimit;
    }

    push(position: Position, currentFrame: number) {
        this.push(position, currentFrame);
    }

    getFirstPrint() {
        return this.queue[0].position;
    }

    removeFootprintsOlderThan(currentFrame: number) {
        
    }
}