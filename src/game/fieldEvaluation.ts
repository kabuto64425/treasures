import { DIRECTION } from "./drection";
import * as GameConstants from "./gameConstants";
import { GameSceneContainerContext } from "./gameSceneContainerContext";
import { Logger } from "./logger";
import { SceneContext } from "./sceneContext";
import * as Util from "./utils"

export class FieldEvaluation {
    private readonly graphics: Phaser.GameObjects.Graphics;
    private readonly getEvaluationMap: () => Map<string, Map<string, boolean>[][]>;
    private readonly getPreEvalutatePriorityPositionList: () => Util.Position[];
    private readonly getFirstPrint: () => Util.Position;

    //@ts-ignore
    private readonly isWall: (position: Util.Position) => boolean;
    private readonly containsWallInArea: (position: Util.Position, size: number) => boolean;

    constructor(getEvaluationMap: () => Map<string, Map<string, boolean>[][]>, getPreEvalutatePriorityPositionList: () => Util.Position[], getFirstPrint: () => Util.Position, isWall: (position: Util.Position) => boolean, containsWallInArea: (position: Util.Position, size: number) => boolean) {
        this.graphics = SceneContext.make.graphics({});
        this.getFirstPrint = getFirstPrint;
        this.getEvaluationMap = getEvaluationMap;
        this.getPreEvalutatePriorityPositionList = getPreEvalutatePriorityPositionList;
        this.isWall = isWall;
        this.containsWallInArea = containsWallInArea;
    }

    setup(isVisible: boolean) {
        this.graphics.depth = 99;
        this.graphics.setVisible(isVisible);
        this.graphics.setActive(isVisible);
        GameSceneContainerContext.fieldContainer.add(this.graphics);
        this.draw();
    }

    preEvaluateMostPriorityPosition() {
        const preEvalutatePriorityPositionList = this.getPreEvalutatePriorityPositionList();
        if (preEvalutatePriorityPositionList.length == 0) {
            return;
        }
    }

    resolveFrame() {
        this.draw();
    }

    isShortestDirection = (from: Util.Position, to: Util.Position, size: number, direction: DIRECTION) => {
        const evaluationMap = this.getEvaluationMap();
        const mapKey = this.createMapKeyFromPosition(to, size);
        if (!evaluationMap.has(mapKey)) {
            evaluationMap.set(mapKey, this.createEvaluation(to, size));
        }
        // if内の処理によって、確実にgetで要素が取れてこれてるはずなので、アサーションつけても大丈夫なはず
        // undefinedを返さないために、??falseとしている。問題にはならないはず
        return evaluationMap.get(mapKey)![from.row][from.column].get(direction.keyName) ?? false;
    }

    private createMapKeyFromPosition(position: Util.Position, size: number) {
        return `${position.row},${position.column},${size}`;
    }

    private createEvaluation(centerPosition: Util.Position, size: number) {
        let now = performance.now();
        const map = [...Array(GameConstants.H)].map(() => [...Array(GameConstants.W)].map(() => this.generateDirectionFlagMap() as Map<string, boolean>));

        const queue = new Queue<[number, number]>();
        const dist = [...Array(GameConstants.H)].map(() => [...Array(GameConstants.W)].fill(-1));

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (!this.containsWallInArea({ row: centerPosition.row - i, column: centerPosition.column - j }, size)) {
                    queue.enqueue([centerPosition.row - i, centerPosition.column - j]);
                    dist[centerPosition.row - i][centerPosition.column - j] = 0;
                }
            }
        }

        while (!queue.isEmpty()) {
            // 直前で空チェックしてるので、アサーションでもいけるはず
            const v = queue.dequeue()!;
            for (const d of DIRECTION.values()) {
                const next_row: number = v[0] + d.dr;
                const next_column: number = v[1] + d.dc;

                if (next_row < 0 || GameConstants.H <= next_row) continue;
                if (next_column < 0 || GameConstants.W <= next_column) continue;

                // ファイナルラウンドの封鎖場所は評価対象とする
                // ファイナルラウンド時の敵のハマりを防ぐため
                if (this.containsWallInArea({ row: next_row, column: next_column }, size)) {
                    continue;
                }

                if (dist[next_row][next_column] !== -1) {
                    if (dist[next_row][next_column] === dist[v[0]][v[1]] + 1) {
                        map[next_row][next_column].set(d.reverse().keyName, true);
                    }
                    continue;
                }
                queue.enqueue([next_row, next_column]);
                dist[next_row][next_column] = dist[v[0]][v[1]] + 1;
                map[next_row][next_column].set(d.reverse().keyName, true);
            }
        }
        Logger.debug(`createEvaluation time:${performance.now() - now}`);
        return map;
    }


    private generateDirectionFlagMap() {
        const pairs = DIRECTION.values().map(d => [d.keyName, false] as [string, boolean]);
        return new Map<string, boolean>(pairs);
    }

    private draw() {
        // アクティブでなければ描画する必要がない。
        // ここの描画処理は時間を使うと考えられるので、アクティブでなければ実行させない
        if (this.graphics.active) {
            this.graphics.clear();
            this.graphics.lineStyle(0, 0x00ff00);
            this.graphics.fillStyle(0x00ff00);
            for (let i = 0; i < GameConstants.H; i++) {
                for (let j = 0; j < GameConstants.W; j++) {
                    this.isShortestDirection({ row: i, column: j }, this.getFirstPrint(), 1, DIRECTION.LEFT);
                    if (this.isShortestDirection({ row: i, column: j }, this.getFirstPrint(), 1, DIRECTION.LEFT)) {
                        this.graphics.fillRect(j * GameConstants.GRID_UNIT_SIZE, i * GameConstants.GRID_UNIT_SIZE + GameConstants.GRID_UNIT_SIZE / 2 - GameConstants.GRID_UNIT_SIZE / 10, GameConstants.GRID_UNIT_SIZE / 5, GameConstants.GRID_UNIT_SIZE / 5);
                    }
                    if (this.isShortestDirection({ row: i, column: j }, this.getFirstPrint(), 1, DIRECTION.UP)) {
                        this.graphics.fillRect(j * GameConstants.GRID_UNIT_SIZE + GameConstants.GRID_UNIT_SIZE / 2 - GameConstants.GRID_UNIT_SIZE / 10, i * GameConstants.GRID_UNIT_SIZE, GameConstants.GRID_UNIT_SIZE / 5, GameConstants.GRID_UNIT_SIZE / 5);
                    }
                    if (this.isShortestDirection({ row: i, column: j }, this.getFirstPrint(), 1, DIRECTION.RIGHT)) {
                        this.graphics.fillRect((j + 1) * GameConstants.GRID_UNIT_SIZE - GameConstants.GRID_UNIT_SIZE / 5, i * GameConstants.GRID_UNIT_SIZE + GameConstants.GRID_UNIT_SIZE / 2 - GameConstants.GRID_UNIT_SIZE / 10, GameConstants.GRID_UNIT_SIZE / 5, GameConstants.GRID_UNIT_SIZE / 5);
                    }
                    if (this.isShortestDirection({ row: i, column: j }, this.getFirstPrint(), 1, DIRECTION.DOWN)) {
                        this.graphics.fillRect(j * GameConstants.GRID_UNIT_SIZE + GameConstants.GRID_UNIT_SIZE / 2 - GameConstants.GRID_UNIT_SIZE / 10, (i + 1) * GameConstants.GRID_UNIT_SIZE - GameConstants.GRID_UNIT_SIZE / 5, GameConstants.GRID_UNIT_SIZE / 5, GameConstants.GRID_UNIT_SIZE / 5);
                    }
                }
            }
        }
    }
}

class Queue<T> {
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
