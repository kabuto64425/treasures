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

// isLoop: falseだと画面外に出ようとしたときはundefinedを返す。trueの場合は、上下左右がつながっているとみなしてポジションを返す。
export function calculateNextPosition(position: Position, direction: DIRECTION, isLoop: boolean): Position | undefined {
    if (isLoop) {
        return {
            row: (position.row + direction.dr + GameConstants.H) % GameConstants.H,
            column: (position.column + direction.dc + GameConstants.W) % GameConstants.W,
        }
    } else {
        const row = position.row + direction.dr;
        const column = position.column + direction.dc;

        if (row < 0 || row >= GameConstants.H) {
            return undefined;
        }

        if (column < 0 || column >= GameConstants.W) {
            return undefined;
        }

        return { row: row, column: column };
    }
}

// center地点を中心に、ある地点と点対象になる地点を算出する
export function calculatePointSymmetricPosition(center: Position, point: Position, isLoop: boolean = false) {
    const dr = center.row - point.row;
    const dc = center.column - point.column;

    const row = (isLoop) ? (center.row + dr + GameConstants.H) % GameConstants.H : center.row + dr;
    const column = (isLoop) ? (center.column + dc + GameConstants.W) % GameConstants.W : center.column + dc;
    return { row: row, column: column }
}

export function isSamePosition(positionA: Position, positionB: Position) {
    return positionA.row === positionB.row && positionA.column === positionB.column;
}

export function checkCollision(positionA: Position, sizeA: number, positionB: Position, sizeB: number) {
    const positionATopLeft = positionA;
    const positionABottomRight = { row: positionA.row + sizeA - 1, column: positionA.column + sizeA - 1 };

    const positionBTopLeft = positionB;
    const positionBBottomRight = { row: positionB.row + sizeB - 1, column: positionB.column + sizeB - 1 };

    if (positionABottomRight.row < positionBTopLeft.row) {
        return false;
    }

    if (positionATopLeft.row > positionBBottomRight.row) {
        return false;
    }

    if (positionABottomRight.column < positionBTopLeft.column) {
        return false;
    }

    if (positionATopLeft.column > positionBBottomRight.column) {
        return false;
    }

    return true;
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
    return { roomRow: roomRow, roomColumn: roomColumn };
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

export function isMobileOrTablet() {
    const ua = navigator.userAgent.toLowerCase();
    return /android|iphone|ipad|ipod|windows phone|mobile|tablet/.test(ua);
}
