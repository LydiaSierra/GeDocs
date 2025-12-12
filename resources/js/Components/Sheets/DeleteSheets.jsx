import React from "react";

export default function DeleteSheets({ sheetToDelete, deleteSheet }) {
    return (
        <dialog id="delete_modal" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">¿Eliminar ficha?</h3>

                <p className="py-4">
                    Está a punto de eliminar la ficha{" "}
                    <b>{sheetToDelete?.number}</b>. Esta acción no se puede
                    deshacer.
                </p>

                <div className="flex justify-end gap-3 mt-4">
                    <form method="dialog">
                        <button className="btn btn-neutral">Cancelar</button>
                    </form>

                    <button
                        className="btn btn-error"
                        onClick={async () => {
                            await deleteSheet(sheetToDelete.id);

                            document.getElementById("delete_modal").close();
                        }}
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </dialog>
    );
}
