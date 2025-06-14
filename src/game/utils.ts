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

// 線形探索である
export function findRoomRowIndex(i: number): number {
    for (let row = 0; row < GameConstants.ROOM_ROW_COUNT - 1; row++) {
        if (i < GameConstants.ROOM_ROW_BORDERS[row]) {
            return row;
        }
    }
    return GameConstants.ROOM_ROW_COUNT - 1;
}

// 線形探索である
export function findRoomColumnIndex(i: number): number {
    for (let column = 0; column < GameConstants.ROOM_COLUMN_COUNT - 1; column++) {
        if (i < GameConstants.ROOM_COLUMN_BORDERS[column]) {
            return column;
        }
    }
    return GameConstants.ROOM_COLUMN_COUNT - 1;
}

export function findRoomId(position: Position) {
    const roomRow = findRoomRowIndex(position.row);
    const roomColumn = findRoomColumnIndex(position.column);
    return calculateRoomId(roomRow, roomColumn);
}

export function isDebugEnv() {
    return (import.meta.env.MODE === "development");
}

export function calculateRoomDistanceManhattan(roomId1: number, roomId2: number) {
    const room1RowColumn = calculateRoomRowColumn(roomId1);
    const room2RowColumn = calculateRoomRowColumn(roomId2);

    return Math.abs(room1RowColumn.roomRow - room2RowColumn.roomRow) + Math.abs(room1RowColumn.roomColumn - room2RowColumn.roomColumn);
}

export function calculateRoomRowColumn(roomId: number) {
    const roomRow = Math.floor(roomId / GameConstants.ROOM_COLUMN_COUNT);
    const roomColumn = roomId % GameConstants.ROOM_COLUMN_COUNT;
    return {roomRow: roomRow, roomColumn: roomColumn};
}

export function calculateRoomId(roomRow: number, roomColumn: number) {
    return roomColumn + roomRow * GameConstants.ROOM_COLUMN_COUNT;
}

export function findSurroundingRoomIds(roomId: number) {
    const roomRowColumn = calculateRoomRowColumn(roomId);
    const roomRow = roomRowColumn.roomRow;
    const roomColumn = roomRowColumn.roomColumn;

    const res = [];
    if (roomRow - 1 >= 0) {
        res.push(calculateRoomId(roomRow - 1, roomColumn));
    }
    if (roomColumn - 1 >= 0) {
        res.push(calculateRoomId(roomRow, roomColumn - 1));
    }
    if (roomRow + 1 <= GameConstants.ROOM_ROW_COUNT - 1) {
        res.push(calculateRoomId(roomRow + 1, roomColumn));
    }
    if (roomColumn + 1 <= GameConstants.ROOM_COLUMN_COUNT - 1) {
        res.push(calculateRoomId(roomRow, roomColumn + 1));
    }
    return res;
}
