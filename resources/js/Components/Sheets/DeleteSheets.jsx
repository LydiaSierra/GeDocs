export default function DeleteSheets({ sheetToDelete, deleteSheet }) {
    const handleDelete = () => {
        if (!sheetToDelete) return;

        deleteSheet(sheetToDelete.id);

        // Cerrar modal de eliminar
        document.getElementById("delete_modal")?.close();

        // Asegurar que el modal de VER también esté cerrado
        document.getElementById("my_modal_3")?.close();
    };

    return (
        <dialog id="delete_modal" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">¿Eliminar ficha?</h3>

                <p className="py-4 text-gray-600">
                    Esta acción no se puede deshacer.
                </p>

                <div className="modal-action">
                    <form method="dialog">
                        <button className="btn">Cancelar</button>
                    </form>

                    <button onClick={handleDelete} className="btn btn-error">
                        Eliminar
                    </button>
                </div>
            </div>
        </dialog>
    );
}
