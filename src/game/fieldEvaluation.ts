import { DIRECTION } from "./drection";
import * as GameConstants from "./gameConstants";
import { Position } from "./utils";

export class FieldEvaluation {
    private readonly aaaa: Map<Position, Map<DIRECTION, boolean>[][]>;

    private readonly shortestDirectionMaps: Map<string, boolean>[][];
    private readonly graphics: Phaser.GameObjects.Graphics;

    constructor(gameObjectFactory: Phaser.GameObjects.GameObjectFactory, isVisible: boolean) {
        this.aaaa = new Map<Position, Map<DIRECTION, boolean>[][]>();

        this.shortestDirectionMaps = [...Array(GameConstants.H)].map(() => [...Array(GameConstants.W)].map(() => this.generateDirectionFlagMap() as Map<string, boolean>));
        this.graphics = gameObjectFactory.graphics();
        this.graphics.depth = 99;
        this.graphics.setVisible(isVisible);
    }

    private generateDirectionFlagMap() {
        const pairs = DIRECTION.values().map(d => [d.keyName, false] as [string, boolean]);
        return new Map<string, boolean>(pairs);
    }

    private resetMapValues<K, V>(dir: Map<K, V>, value: V) {
        Array.from(dir.entries()).forEach(([key,]) => {
            dir.set(key, value);
        });
    }

    isShortestDirection(row: number, column: number, direction: DIRECTION) {
        return this.shortestDirectionMaps[row][column].get(direction.keyName);
    }

    updateEvaluation(startRow: number, startColumn: number) {
        this.shortestDirectionMaps.forEach(n => n.forEach(dir => { this.resetMapValues(dir, false) }));

        const queue = [];
        const dist = [...Array(GameConstants.H)].map(() => [...Array(GameConstants.W)].fill(-1));

        queue.push([startRow, startColumn]);
        dist[startRow][startColumn] = 0;

        while (queue.length > 0) {
            // 直前で空チェックしてるので、アサーションでもいけるはず
            const v = queue.shift()!;
            for (const d of DIRECTION.values()) {
                const next_row: number = v[0] + d.dr;
                const next_column: number = v[1] + d.dc;

                if (next_row < 0 || GameConstants.H <= next_row) continue;
                if (next_column < 0 || GameConstants.W <= next_column) continue;

                if (GameConstants.FIELD[next_row][next_column] === 1) continue;

                if (dist[next_row][next_column] !== -1) {
                    if (dist[next_row][next_column] === dist[v[0]][v[1]] + 1) {
                        this.shortestDirectionMaps[next_row][next_column].set(d.reverse().keyName, true);
                    }
                    continue;
                }
                queue.push([next_row, next_column]);
                dist[next_row][next_column] = dist[v[0]][v[1]] + 1;
                this.shortestDirectionMaps[next_row][next_column].set(d.reverse().keyName, true);
            }
        }
    }

    draw() {
        this.graphics.clear();
        this.graphics.lineStyle(0, 0x00ff00);
        this.graphics.fillStyle(0x00ff00);
        for (let i = 0; i < GameConstants.H; i++) {
            for (let j = 0; j < GameConstants.W; j++) {
                if (this.shortestDirectionMaps[i][j].get(DIRECTION.LEFT.keyName)) {
                    this.graphics.fillRect(j * GameConstants.GRID_SIZE, i * GameConstants.GRID_SIZE + GameConstants.GRID_SIZE / 2 -GameConstants. GRID_SIZE / 10, GameConstants.GRID_SIZE / 5, GameConstants.GRID_SIZE / 5);
                }
                if (this.shortestDirectionMaps[i][j].get(DIRECTION.UP.keyName)) {
                    this.graphics.fillRect(j * GameConstants.GRID_SIZE + GameConstants.GRID_SIZE / 2 - GameConstants.GRID_SIZE / 10, i * GameConstants.GRID_SIZE, GameConstants.GRID_SIZE / 5, GameConstants.GRID_SIZE / 5);
                }
                if (this.shortestDirectionMaps[i][j].get(DIRECTION.RIGHT.keyName)) {
                    this.graphics.fillRect((j + 1) * GameConstants.GRID_SIZE - GameConstants.GRID_SIZE / 5, i * GameConstants.GRID_SIZE + GameConstants.GRID_SIZE / 2 - GameConstants.GRID_SIZE / 10, GameConstants.GRID_SIZE / 5, GameConstants.GRID_SIZE / 5);
                }
                if (this.shortestDirectionMaps[i][j].get(DIRECTION.DOWN.keyName)) {
                    this.graphics.fillRect(j * GameConstants.GRID_SIZE + GameConstants.GRID_SIZE / 2 -GameConstants. GRID_SIZE / 10, (i + 1) * GameConstants.GRID_SIZE - GameConstants.GRID_SIZE / 5, GameConstants.GRID_SIZE / 5, GameConstants.GRID_SIZE / 5);
                }
            }
        }
    }
}