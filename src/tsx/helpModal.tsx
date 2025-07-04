import { h } from "jsx-dom";

function HelpModal(onOk: () => void) {
    const root = (
        <div class="box has-text-centered BestTen-CRT" style="background-color: #ffd6d6;">
            <div class="field">
                <label class="label">
                    You are the player.
                    Use the arrow keys to move.
                    Treasures will appear in groups of five.
                    Collect a total of 30 treasures.
                    Then, head for the goal.
                    If you reach the goal, you clear the game.
                    But if you touch an enemy, it's game over.
                    Try to reach the goal as fast as you can!
                </label>
            </div>

            <div class="columns is-justify-content-space-around">
                <div class="column">
                    <button class="button is-danger is-rounded" id="backButton">
                        <span class="icon">
                            <i class="mdi mdi-delete-forever-outline is-size-4 fa-fw"></i>
                        </span>
                        <span class="BestTen-CRT">Yes</span>
                    </button>
                </div>
            </div>
        </div>
    );

    // イベントを追加
    requestAnimationFrame(() => {
        root.querySelector("#backButton")?.addEventListener("click", onOk);
    });

    return root;
}

export default HelpModal