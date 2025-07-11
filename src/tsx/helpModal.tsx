import { h } from "jsx-dom";

function HelpModal(onOk: () => void) {
    const root = (
        <div class="box BestTen-CRT" style="background-color: #ffffff; font-size:18px;">
            <div class="field">
                Please note: This game contains sound effects 🔊.<br />
                <br />
                You are <img src="./player_2.png" class="help_dialog_icon"></img>.<br />
                Use the arrow keys to move.<br />
                <img src="./treasure.png" class="help_dialog_icon"></img> will appear in groups of 5.<br />
                Collect a total of 30 <img src="./treasure.png" class="help_dialog_icon"></img>.<br />
                Then, head for <img src="./goal.png" class="help_dialog_icon"></img> - it's the same place where you started.<br />
                If you reach <img src="./goal.png" class="help_dialog_icon"></img>, you clear the game.<br />
                But if you touch <img src="./enemy.png" class="help_dialog_icon"></img>, it's game over.<br />
                Try to reach <img src="./goal.png" class="help_dialog_icon"></img> as quickly as you can!<br />
                <br />
                Press Enter to start the game.<br />
                Press Space to pause.<br />
                Hold R to restart.<br />
                <br />
                This game has been tested on Microsoft Edge.<br />
                For the best experience, set your browser's frame rate to 60 FPS.<br />
                Note: The game may not run smoothly without a graphics accelerator.<br />
            </div>

            <div class="columns has-text-centered is-justify-content-space-around">
                <div class="column">
                    <button class="button is-primary is-rounded" id="backButton">
                        <span class="BestTen-CRT">Close</span>
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