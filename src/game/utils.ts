import { DIRECTION } from "./drection";
import * as GameConstants from "./gameConstants"

export type Position = {
    row: number,
    column: number
}

export function caluculateMsFromFrame(frame: number) {
    return Math.floor((frame * GameConstants.MS_PER_SECOND) / GameConstants.FPS);
}

export function createFormattedTimeFromFrame(frame: number) {
    const elapsedMs = caluculateMsFromFrame(frame);

    const msPerMinute = GameConstants.MS_PER_SECOND * GameConstants.SECONDS_PER_MINUTE;

    const minutes = Math.floor(elapsedMs / msPerMinute);
    const seconds = Math.floor((elapsedMs % msPerMinute) / GameConstants.MS_PER_SECOND);
    const milliseconds = Math.floor(elapsedMs % GameConstants.MS_PER_SECOND);

    return `${minutes.toString()}:${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(3, "0")}`;
}

export function calculateNumberOfTreasuresInALLRounds() {
    // 総宝数の取得方法は暫定
    return GameConstants.numberOfTreasuresPerRound * GameConstants.numberOfTreasuresRounds;
}

export function calculateNextPosition(position: Position, direction: DIRECTION): Position {
    return {
        row: (position.row + direction.dr + GameConstants.H) % GameConstants.H,
        column: (position.column + direction.dc + GameConstants.W) % GameConstants.W,
    }
}

export function isSamePosition(positionA: Position, positionB: Position) {
    return positionA.row === positionB.row && positionA.column === positionB.column;
}