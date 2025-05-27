import * as Util from "./utils";
import { DIRECTION } from "./drection";
import * as GameConstants from "./gameConstants";
import { IFieldActor } from "./iFieldActor";

enum EnemyState {
    SEARCHING = 0,
    CHASING = 1
}

export class Enemy implements IFieldActor {
    private readonly graphics: Phaser.GameObjects.Graphics;
    private state: EnemyState;
    behaviorMap = {
        [EnemyState.SEARCHING]: new SearchingBehavior(),
        [EnemyState.CHASING]: new ChasingBehavior()
    };

    private row: number;
    private column: number;
    private roomId: number;
    private readonly moveCostSearching: number;
    private readonly moveCostChasing: number;

    private chargeAmount: number;
    private readonly priorityScanDirections: DIRECTION[];
    private readonly strategy: SearchingStrategy;
    private readonly onPlayerCaptured: () => void;
    private readonly getFirstFootprint: () => Util.Position;
    private readonly stepOnFirstFootprint: () => void;
    private readonly isShortestDirection: (from: Util.Position, to: Util.Position, direction: DIRECTION) => boolean;
    private readonly getPlayerRoomId: () => number

    constructor(gameObjectFactory: Phaser.GameObjects.GameObjectFactory, iniRow: number,
        iniColumn: number, params: any, priorityScanDirections: DIRECTION[],
        strategy: SearchingStrategy, onPlayerCaptured: () => void,
        getFirstFootprint: () => Util.Position, stepOnFirstFootprint: () => void,
        isShortestDirection: (from: Util.Position, to: Util.Position, direction: DIRECTION) => boolean,
        getPlayerRoomId: () => number
    ) {
        this.graphics = gameObjectFactory.graphics();
        this.graphics.depth = 10;
        this.state = EnemyState.SEARCHING;
        this.row = iniRow;
        this.column = iniColumn;
        this.roomId = Util.findRoomId({ row: this.row, column: this.column });
        this.moveCostSearching = params.enemyMoveCostSearching;
        this.moveCostChasing = params.enemyMoveCostChasing;

        this.chargeAmount = 0;
        this.priorityScanDirections = priorityScanDirections;
        this.strategy = strategy;
        this.onPlayerCaptured = onPlayerCaptured;
        this.getFirstFootprint = getFirstFootprint;
        this.stepOnFirstFootprint = stepOnFirstFootprint;
        this.isShortestDirection = isShortestDirection;
        this.getPlayerRoomId = getPlayerRoomId;
    }

    position() {
        return { row: this.row, column: this.column };
    }

    charge() {
        this.chargeAmount++;
    }

    setup() {
        this.draw();
    }

    resolveEnemyFrame() {
        // 敵の状態変更判定
        if (this.isSearching()) {
            // プレイヤーと同室したら、追跡にする。
            if (this.roomId === this.getPlayerRoomId()) {
                this.state = EnemyState.CHASING;
            }
        } else if (this.isChasing()) {
            // 2部屋以上離れたら索敵にする
            if (Util.culculateRoomDistanceManhattan(this.roomId, this.getPlayerRoomId()) >= 2) {
                this.state = EnemyState.SEARCHING;
                // 索敵に変わると、更新する
                this.strategy.updateStrategyInfo();
            }
        }

        const behavior = this.behaviorMap[this.state];

        if (behavior.isChargeCompleted(this)) {
            const targetPosition = behavior.decideTagetPosition(this);
            const direction = this.decideMoveDirection(targetPosition);
            this.move(direction);
            // 更新条件判定処理は、必要になればbehaviorを使って索敵モード時のみに実施するようにする。(今のところ不要だった)
            if(Util.isSamePosition(this.position(), this.strategy.getTargetPosition())) {
                // 目的地に到達したので更新
                this.strategy.updateStrategyInfo();
            }
        } else {
            this.charge();
        }

        this.handleFirstFootprintStep();
        this.roomId = Util.findRoomId(this.position());
        this.draw();
    }

    move(direction: DIRECTION | undefined) {
        if (direction === undefined) {
            return;
        }
        const nextPosition = Util.calculateNextPosition(this.position(), direction);
        this.row = nextPosition.row;
        this.column = nextPosition.column;
        this.chargeAmount = 0;
    }

    getDebugValueData() {
        return {
            state: EnemyState[this.state],
            chargeAmount: this.chargeAmount,
            position: this.position(),
            roomId: this.roomId
        };
    }

    private draw() {
        this.graphics.clear();
        this.graphics.lineStyle(0, 0xff0000);
        this.graphics.fillStyle(0xff0000);
        this.graphics.fillRect(this.column * GameConstants.GRID_SIZE, this.row * GameConstants.GRID_SIZE, GameConstants.GRID_SIZE, GameConstants.GRID_SIZE);
    }

    show() {
        this.graphics.setVisible(true);
    }

    hide() {
        this.graphics.setVisible(false);
    }

    onCollideWithPlayer(): void {
        this.onPlayerCaptured();
    }

    handleFirstFootprintStep() {
        if (Util.isSamePosition(this.position(), this.getFirstFootprint())) {
            this.stepOnFirstFootprint();
        }
    }

    private readonly isSearching = () => {
        return this.state === EnemyState.SEARCHING;
    }

    private readonly isChasing = () => {
        return this.state === EnemyState.CHASING;
    }

    getChargeAmount() {
        return this.chargeAmount;
    }

    isChargeCompletedSearching() {
        return this.isChargeCompleted(this.moveCostSearching);
    }

    isChargeCompletedChasing() {
        return this.isChargeCompleted(this.moveCostChasing);
    }

    private isChargeCompleted(cost: number) {
        return this.chargeAmount >= cost;
    }

    decideTagetPositionSearching() {
        return this.strategy.getTargetPosition();
    }

    decideTagetPositionChasing() {
        return this.getFirstFootprint();
    }

    private decideMoveDirection(targetPosition: Util.Position) {
        for (const d of this.priorityScanDirections) {
            if (this.isShortestDirection({ row: this.row, column: this.column }, targetPosition, d)) {
                return d;
            }
        }
        return undefined;
    }
}

interface EnemyBehavior {
    isChargeCompleted(enemy: Enemy): boolean;
    decideTagetPosition(enemy: Enemy): Util.Position;
}

class SearchingBehavior implements EnemyBehavior {
    isChargeCompleted(enemy: Enemy): boolean {
        return enemy.isChargeCompletedSearching();
    }
    decideTagetPosition(enemy: Enemy): Util.Position {
        return enemy.decideTagetPositionSearching();
    }
}

class ChasingBehavior implements EnemyBehavior {
    isChargeCompleted(enemy: Enemy): boolean {
        return enemy.isChargeCompletedChasing();
    }
    decideTagetPosition(enemy: Enemy): Util.Position {
        return enemy.decideTagetPositionChasing();
    }
}

interface SearchingStrategy {
    updateStrategyInfo(): void;
    getTargetPosition(): Util.Position;
}

export class PatrolStrategy implements SearchingStrategy {
    private targetPosition: Util.Position;
    private targetRoomId: number;
    // patrolRouteIndexとwayPointRouteという変数名で意味合いは間違ってないみたい by chatgpt
    private patrolRouteIndex: number;
    private wayPointRouteIndex: number;

    constructor() {
        this.patrolRouteIndex = 0;
        this.wayPointRouteIndex = 0;

        this.targetRoomId = GameConstants.PATROL_ENEMY_ROOM_ROUTE[this.patrolRouteIndex];
        const wayPoints = GameConstants.ENEMY_SEARCH_WAYPOINTS[this.targetRoomId];
        this.targetPosition = wayPoints[this.wayPointRouteIndex];
    }

    updateStrategyInfo() {
        this.patrolRouteIndex = (this.patrolRouteIndex + 1) % (GameConstants.PATROL_ENEMY_ROOM_ROUTE.length);
        const newTargetRoomId = GameConstants.PATROL_ENEMY_ROOM_ROUTE[this.patrolRouteIndex];
        const wayPoints = GameConstants.ENEMY_SEARCH_WAYPOINTS[newTargetRoomId];

        if (this.targetRoomId === newTargetRoomId) {
            this.wayPointRouteIndex = (this.wayPointRouteIndex + 1) % (wayPoints.length);
        } else {
            this.wayPointRouteIndex = 0;
        }
        this.targetRoomId = newTargetRoomId;

        this.targetPosition = wayPoints[this.wayPointRouteIndex];
    }

    getTargetPosition(): Util.Position {
        return this.targetPosition;
    }
}