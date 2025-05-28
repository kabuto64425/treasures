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
    private readonly getPlayerRoomId: () => number;
    private readonly isFinalRound: () => boolean;
    private readonly onPlayerSpotted: (spottedRoomId: number) => void;
    private readonly getEnemyList: () => Enemy[];

    constructor(gameObjectFactory: Phaser.GameObjects.GameObjectFactory, iniRow: number,
        iniColumn: number, params: any, priorityScanDirections: DIRECTION[],
        strategy: SearchingStrategy, onPlayerCaptured: () => void,
        getFirstFootprint: () => Util.Position, stepOnFirstFootprint: () => void,
        isShortestDirection: (from: Util.Position, to: Util.Position, direction: DIRECTION) => boolean,
        getPlayerRoomId: () => number, isFinalRound: () => boolean, onPlayerSpotted: (spottedRoomId: number) => void,
        getEnemyList: () => Enemy[]
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
        this.isFinalRound = isFinalRound;
        this.onPlayerSpotted = onPlayerSpotted;
        this.getEnemyList = getEnemyList;
    }

    position() {
        return { row: this.row, column: this.column };
    }

    charge() {
        this.chargeAmount++;
    }

    setup() {
        this.draw();
        this.strategy.setup();
    }

    resolveEnemyFrame() {
        // 敵の状態変更判定
        if (this.isSearching()) {
            // プレイヤーと同室したら、追跡にする。
            if (this.roomId === this.getPlayerRoomId() || this.isFinalRound()) {
                this.state = EnemyState.CHASING;
                // プレーヤー同室 = 発見とみなすから
                this.onPlayerSpotted(this.getPlayerRoomId());
            }
        } else if (this.isChasing()) {
            // ファイナルラウンドの場合は常時追跡
            if (!this.isFinalRound()) {
                // 2部屋以上離れたら索敵にする
                if (Util.culculateRoomDistanceManhattan(this.roomId, this.getPlayerRoomId()) >= 2) {
                    this.state = EnemyState.SEARCHING;
                    // 索敵に変わると、更新する
                    this.strategy.updateStrategyInfo();
                }
            }
        }

        const behavior = this.behaviorMap[this.state];

        if (behavior.isChargeCompleted(this)) {
            const targetPosition = behavior.decideTagetPosition(this);
            const firstDirection = this.decideMoveDirection(targetPosition);
            if (firstDirection !== undefined) {
                // 基本は最短方向に移動するが、敵同士が互いに衝突した場合に備えて、
                // 時計回りで移動できる方向を調べて移動することで移動先を譲れるようにする
                for (const d of firstDirection.clockwiseFrom()) {
                    if (this.canMove(d)) {
                        this.move(d);
                        break;
                    }
                }
            }
            // 更新条件判定処理は、必要になればbehaviorを使って索敵モード時のみに実施するようにする。(今のところ不要だった)
            if (Util.isSamePosition(this.position(), this.strategy.getTargetPosition())) {
                // 目的地に到達したので更新
                this.strategy.updateStrategyInfo();
            }
        } else {
            this.charge();
        }

        this.handleFirstFootprintStep();
        this.roomId = Util.findRoomId(this.position());
        this.draw();

        this.strategy.resolveFrame();
    }

    private canMove(direction: DIRECTION | undefined) {
        if (direction === undefined) {
            return false;
        }
        const nextPosition = Util.calculateNextPosition(this.position(), direction);
        // 他の敵との衝突回避
        for (const enemy of this.getEnemyList()) {
            if (this !== enemy) {
                if (Util.isSamePosition(nextPosition, enemy.position())) {
                    return false;
                }
            }
        }
        return true;
    }

    private move(direction: DIRECTION | undefined) {
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

export interface SearchingStrategy {
    setup(): void;
    resolveFrame(): void;
    updateStrategyInfo(): void;
    getTargetPosition(): Util.Position;
}

//継承を使うべきか迷ったときは以下のように考えること：
// ★「AはBの一種である（is-a関係）」が成り立つ
// ★共通状態と共通ロジックがある

// → 今回は「FollowerStrategy等すれぞれのストラテジはBaseStrategyの一種」
// →framesSinceLastDestinationUpdate と resolveFrame() と共通ロジックがある
// なので、考えるべき点2つを両方満たしてるので、継承はありらしい。 by chatgpt
abstract class BaseStrategy implements SearchingStrategy {
    protected framesSinceLastDestinationUpdate = 0;

    resolveFrame(): void {
        this.framesSinceLastDestinationUpdate++;
        if (this.framesSinceLastDestinationUpdate >= GameConstants.DESTINATION_FORCE_UPDATE_INTERVAL * GameConstants.FPS) {
            this.updateStrategyInfo();
            this.framesSinceLastDestinationUpdate = 0;
        }
    }

    abstract setup(): void;
    abstract updateStrategyInfo(): void;
    abstract getTargetPosition(): Util.Position;
}

// パトロール型
// 隅の部屋を巡回する
export class PatrolStrategy extends BaseStrategy {
    private targetPosition: Util.Position;
    private targetRoomId: number;
    // patrolRouteIndexとwayPointRouteという変数名で意味合いは間違ってないみたい by chatgpt
    private patrolRouteIndex: number;
    private wayPointRouteIndex: number;

    constructor() {
        super();
        this.patrolRouteIndex = 0;
        this.wayPointRouteIndex = 0;

        this.targetRoomId = GameConstants.PATROL_ENEMY_ROOM_ROUTE[this.patrolRouteIndex];
        const wayPoints = GameConstants.ENEMY_SEARCH_WAYPOINTS[this.targetRoomId];
        this.targetPosition = wayPoints[this.wayPointRouteIndex];
        this.framesSinceLastDestinationUpdate = 0;
    }

    setup() {
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
        this.framesSinceLastDestinationUpdate = 0;
    }

    getTargetPosition(): Util.Position {
        return this.targetPosition;
    }
}

// 後追い型
// 最後にプレイヤーが見つかった部屋へ向かう
export class FollowerStrategy extends BaseStrategy {
    private targetPosition: Util.Position;
    private targetRoomId: number;

    private wayPointRouteIndex: number;

    private getLastSpottedRoomId: () => number;

    constructor(firstTargetRoomId: number, getLastSpottedRoomId: () => number) {
        super();
        this.wayPointRouteIndex = 0;
        this.targetRoomId = firstTargetRoomId;
        this.getLastSpottedRoomId = getLastSpottedRoomId;
        const wayPoints = GameConstants.ENEMY_SEARCH_WAYPOINTS[this.targetRoomId];
        this.targetPosition = wayPoints[this.targetRoomId];

        this.framesSinceLastDestinationUpdate = 0;
    }

    setup() {
    }

    resolveFrame(): void {
        this.framesSinceLastDestinationUpdate++;
        // 規定秒数経過で、目的地到達有無にかかわらず目的地更新
        if (this.framesSinceLastDestinationUpdate >= GameConstants.DESTINATION_FORCE_UPDATE_INTERVAL * GameConstants.FPS) {
            this.updateStrategyInfo();
        }
    }

    updateStrategyInfo(): void {
        const newTargetRoomId = this.getLastSpottedRoomId();
        const wayPoints = GameConstants.ENEMY_SEARCH_WAYPOINTS[newTargetRoomId];

        if (this.targetRoomId === newTargetRoomId) {
            this.wayPointRouteIndex = (this.wayPointRouteIndex + 1) % (wayPoints.length);
        } else {
            this.wayPointRouteIndex = 0;
        }
        this.targetRoomId = newTargetRoomId;

        this.targetPosition = wayPoints[this.wayPointRouteIndex];
        this.framesSinceLastDestinationUpdate = 0;
    }

    getTargetPosition(): Util.Position {
        return this.targetPosition;
    }
}

// 先回り型
// 最も宝の数が多い部屋へ向かう
export class InterceptStrategy extends BaseStrategy {
    private targetPosition?: Util.Position;
    private targetRoomId?: number;

    private wayPointRouteIndex: number;

    private findRoomIdWithMostTreasures: () => number;

    constructor(findRoomIdWithMostTreasures: () => number) {
        super();
        this.wayPointRouteIndex = 0;

        this.findRoomIdWithMostTreasures = findRoomIdWithMostTreasures;
    }

    setup() {
        this.updateStrategyInfo();
    }

    updateStrategyInfo(): void {
        const newTargetRoomId = this.findRoomIdWithMostTreasures();
        const wayPoints = GameConstants.ENEMY_SEARCH_WAYPOINTS[newTargetRoomId];

        if (this.targetRoomId === newTargetRoomId) {
            this.wayPointRouteIndex = (this.wayPointRouteIndex + 1) % (wayPoints.length);
        } else {
            this.wayPointRouteIndex = 0;
        }
        this.targetRoomId = newTargetRoomId;

        this.targetPosition = wayPoints[this.wayPointRouteIndex];
        this.framesSinceLastDestinationUpdate = 0;
    }

    getTargetPosition(): Util.Position {
        // undefined時に返すポジションは、考える。(??にする必要があるかも含めて)
        return this.targetPosition ?? { row: GameConstants.H - 2, column: GameConstants.W - 2 };
    }
}

// 裏取り型
// 敵が誰もいない部屋へ向かう
// (更新時は、現在の自分の部屋も含めて、敵が誰もいない部屋へ向かわせる。)
export class FlankingStrategy extends BaseStrategy {
    private targetPosition?: Util.Position;
    private targetRoomId?: number;

    private wayPointRouteIndex: number;

    private findRoomIdWithoutEnemies: () => number;

    constructor(findRoomIdWithoutEnemies: () => number) {
        super();
        this.wayPointRouteIndex = 0;
        this.findRoomIdWithoutEnemies = findRoomIdWithoutEnemies;
    }

    setup(): void {
        this.updateStrategyInfo();
    }

    updateStrategyInfo(): void {
        const newTargetRoomId = this.findRoomIdWithoutEnemies();
        const wayPoints = GameConstants.ENEMY_SEARCH_WAYPOINTS[newTargetRoomId];

        if (this.targetRoomId === newTargetRoomId) {
            this.wayPointRouteIndex = (this.wayPointRouteIndex + 1) % (wayPoints.length);
        } else {
            this.wayPointRouteIndex = 0;
        }
        this.targetRoomId = newTargetRoomId;

        this.targetPosition = wayPoints[this.wayPointRouteIndex];
        this.framesSinceLastDestinationUpdate = 0;
    }

    getTargetPosition(): Util.Position {
        // undefined時に返すポジションは、考える。(??にする必要があるかも含めて)
        return this.targetPosition ?? { row: GameConstants.H - 2, column: GameConstants.W - 2 };
    }
}