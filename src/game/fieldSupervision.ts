import { GameSceneContainerContext } from "./gameSceneContainerContext";
import { SceneContext } from "./sceneContext";
import * as GameConstants from "./gameConstants";
import * as Util from "./utils"
import { WrapArrow, WrapArrowFactory } from "./wrapArrowFactory";

export class FieldSupervision {
    private readonly fieldGraphics: Phaser.GameObjects.Graphics;
    private readonly visibleRoomRanges: boolean;
    private readonly playerPosition: () => Util.Position;

    private readonly wrapAroundArrowRegistryList: {
        viewRange: { topLeft: Util.Position, bottomRight: Util.Position },
        wrapAroundArrowList: WrapArrow[]
    }[];

    constructor(params: any, playerPosition: () => Util.Position) {
        this.fieldGraphics = SceneContext.make.graphics({
            lineStyle: { width: 1, color: 0x000000, alpha: 1 },
            fillStyle: { color: 0xffffff, alpha: 1 }
        });
        this.visibleRoomRanges = params.visibleRoomRanges;

        this.wrapAroundArrowRegistryList = [
            // 左上→左下
            {
                viewRange: { topLeft: { row: 0, column: 3 }, bottomRight: { row: 3, column: 4 } },
                wrapAroundArrowList: [
                    WrapArrowFactory.makeWrapAroundArrow({ x: 4 * GameConstants.GRID_SIZE - 17, y: 0 * GameConstants.GRID_SIZE - 4 }, 180, params.visibleWrapArrowFrameGraphic),
                    WrapArrowFactory.makeWrapAroundArrow({ x: 4 * GameConstants.GRID_SIZE - 17, y: 31 * GameConstants.GRID_SIZE + 8 }, 180, params.visibleWrapArrowFrameGraphic)
                ]
            },
            // 左下→左上
            {
                viewRange: { topLeft: { row: GameConstants.H - 4, column: 3 }, bottomRight: { row: GameConstants.H - 1, column: 4 } },
                wrapAroundArrowList: [
                    WrapArrowFactory.makeWrapAroundArrow({ x: 4 * GameConstants.GRID_SIZE - 16, y: 0 * GameConstants.GRID_SIZE - 17 }, 0, params.visibleWrapArrowFrameGraphic),
                    WrapArrowFactory.makeWrapAroundArrow({ x: 4 * GameConstants.GRID_SIZE - 16, y: 31 * GameConstants.GRID_SIZE - 5 }, 0, params.visibleWrapArrowFrameGraphic)
                ]
            },
            //右上→右下
            {
                viewRange: { topLeft: { row: 0, column: GameConstants.W - 5 }, bottomRight: { row: 3, column: GameConstants.W - 4 } },
                wrapAroundArrowList: [
                    WrapArrowFactory.makeWrapAroundArrow({ x: 38 * GameConstants.GRID_SIZE - 17, y: 0 * GameConstants.GRID_SIZE - 4 }, 180, params.visibleWrapArrowFrameGraphic),
                    WrapArrowFactory.makeWrapAroundArrow({ x: 38 * GameConstants.GRID_SIZE - 17, y: 31 * GameConstants.GRID_SIZE + 8 }, 180, params.visibleWrapArrowFrameGraphic)
                ]
            },
            // 右下→右上
            {
                viewRange: { topLeft: { row: GameConstants.H - 4, column: GameConstants.W - 5 }, bottomRight: { row: GameConstants.H - 1, column: GameConstants.W - 4 } },
                wrapAroundArrowList: [
                    WrapArrowFactory.makeWrapAroundArrow({ x: 38 * GameConstants.GRID_SIZE - 16, y: 0 * GameConstants.GRID_SIZE - 17 }, 0, params.visibleWrapArrowFrameGraphic),
                    WrapArrowFactory.makeWrapAroundArrow({ x: 38 * GameConstants.GRID_SIZE - 16, y: 31 * GameConstants.GRID_SIZE - 5 }, 0, params.visibleWrapArrowFrameGraphic)
                ]
            },
        ];

        this.playerPosition = playerPosition;;
    }

    setup() {
        const fieldContainer = GameSceneContainerContext.fieldContainer;
        fieldContainer.add(this.fieldGraphics);

        for (let i = 0; i < GameConstants.H; i++) {
            for (let j = 0; j < GameConstants.W; j++) {
                this.fieldGraphics.strokeRect(j * GameConstants.GRID_SIZE, i * GameConstants.GRID_SIZE, GameConstants.GRID_SIZE, GameConstants.GRID_SIZE);
            }
        }

        if (this.visibleRoomRanges) {
            const roomGraphics = SceneContext.make.graphics({
                lineStyle: { width: 1, color: 0x000000, alpha: 1 },
                fillStyle: { color: 0xffffff, alpha: 1 },
            });
            roomGraphics.setDepth(-1);
            for (let i = 0; i < GameConstants.H; i++) {
                for (let j = 0; j < GameConstants.W; j++) {
                    const roomRow = Util.findRoomRowIndex(i);
                    const roomColumn = Util.findRoomColumnIndex(j);

                    // 2次元グラデーション
                    const ratioY = roomRow / (GameConstants.ROOM_ROW_COUNT); // 縦方向の割合
                    const ratioX = roomColumn / (GameConstants.ROOM_COLUMN_COUNT); // 横方向の割合

                    // 左上(赤)→右下(青)のグラデーション
                    const r = Math.round(255 * (1 - ratioX) * (1 - ratioY));
                    const g = Math.round(255 * ratioX * (1 - ratioY));
                    const b = Math.round(255 * ratioY);

                    const color = (r << 16) | (g << 8) | b;

                    roomGraphics.fillStyle(color, 0.5);
                    roomGraphics.fillRect(j * GameConstants.GRID_SIZE, i * GameConstants.GRID_SIZE, GameConstants.GRID_SIZE, GameConstants.GRID_SIZE);
                }
            }
            fieldContainer.add(roomGraphics);
        }

        for (const wrapAroundArrowResistry of this.wrapAroundArrowRegistryList) {
            for (const wrapAroundArrow of wrapAroundArrowResistry.wrapAroundArrowList) {
                wrapAroundArrow.setup();
            }
        }

        // 壁描画
        for (let i = 0; i < GameConstants.H; i++) {
            for (let j = 0; j < GameConstants.W; j++) {
                if (GameConstants.FIELD[i][j] === 1) {
                    const fillRect = SceneContext.make.graphics({
                        lineStyle: { width: 1, color: 0x000000, alpha: 1 },
                        fillStyle: { color: 0x000000, alpha: 1 }
                    }).fillRect(j * GameConstants.GRID_SIZE, i * GameConstants.GRID_SIZE, GameConstants.GRID_SIZE, GameConstants.GRID_SIZE);
                    fieldContainer.add(fillRect);
                }
            }
        }
    }

    updatePerFrame() {
        const playerPostion = this.playerPosition();
        for (const wrapAroundArrowResistry of this.wrapAroundArrowRegistryList) {
            const top = wrapAroundArrowResistry.viewRange.topLeft.row;
            const left = wrapAroundArrowResistry.viewRange.topLeft.column;
            const bottom = wrapAroundArrowResistry.viewRange.bottomRight.row;
            const right = wrapAroundArrowResistry.viewRange.bottomRight.column;

            if ((playerPostion.row >= top && playerPostion.row <= bottom) && (playerPostion.column >= left && playerPostion.column <= right)) {
                for (const wrapAroundArrow of wrapAroundArrowResistry.wrapAroundArrowList) {
                    wrapAroundArrow.show();
                }
            } else {
                for (const wrapAroundArrow of wrapAroundArrowResistry.wrapAroundArrowList) {
                    wrapAroundArrow.hide();
                }
            }
        }
    }

    handlePause() {
        for (const wrapAroundArrowResistry of this.wrapAroundArrowRegistryList) {
            for (const wrapAroundArrow of wrapAroundArrowResistry.wrapAroundArrowList) {
                wrapAroundArrow.pauseAnimation();
            }
        }
    }

    handleResume() {
        for (const wrapAroundArrowResistry of this.wrapAroundArrowRegistryList) {
            for (const wrapAroundArrow of wrapAroundArrowResistry.wrapAroundArrowList) {
                wrapAroundArrow.resumeAnimation();
            }
        }
    }
}