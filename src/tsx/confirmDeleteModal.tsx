import { h } from "jsx-dom";

type ConfirmDeleteModalProps = {
    onConfirm: () => void;
    onCancel: () => void;
};

function ConfirmDeleteModal({ onConfirm, onCancel }: ConfirmDeleteModalProps) {
    const root = (
        <div class="box has-text-centered" style="background-color: #ffd6d6;" font-family="BestTen-CRT">
            <div class="field">
                <label class="label">
                    Are you sure you want to delete your best record?
                </label>
            </div>

            <div class="columns is-justify-content-space-around">
                <div class="column">
                    <button class="button is-danger is-rounded" id="backButton">
                        <span class="icon">
                            <i class="mdi mdi-delete-forever-outline is-size-4 fa-fw"></i>
                        </span>
                        <span>Yes</span>
                    </button>
                </div>
                <div class="column">
                    <button class="button is-primary is-rounded" id="startButton">
                        <span class="icon">
                            <i class="mdi mdi-arrow-u-left-top is-size-4 fa-fw"></i>
                        </span>
                        <span>No</span>
                    </button>
                </div>
            </div>
        </div>
    );

    // イベントを追加
    requestAnimationFrame(() => {
        root.querySelector("#backButton")?.addEventListener("click", onConfirm);
        root.querySelector("#startButton")?.addEventListener("click", onCancel);
    });

    return root;
}

export default ConfirmDeleteModal