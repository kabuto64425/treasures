export class Queue<T> {
    private stackPush: T[] = [];
    private stackPop: T[] = [];

    enqueue(value: T): void {
        this.stackPush.push(value);
    }

    dequeue(): T | undefined {
        if (this.stackPop.length === 0) {
            while (this.stackPush.length > 0) {
                this.stackPop.push(this.stackPush.pop()!);
            }
        }
        return this.stackPop.pop();
    }

    isEmpty(): boolean {
        return this.stackPush.length === 0 && this.stackPop.length === 0;
    }
}