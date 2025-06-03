import { SceneContext } from "./sceneContext";

export class FieldSupervision {
    private readonly fieldGraphics;
    constructor() {
        this.fieldGraphics = SceneContext.make.graphics({
            lineStyle: { width: 1, color: 0x000000, alpha: 1 },
            fillStyle: { color: 0xffffff, alpha: 1 }
        });
    }

    setup() {
        
    }
}