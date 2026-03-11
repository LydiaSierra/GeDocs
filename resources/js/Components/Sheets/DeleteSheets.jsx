export default function DeleteSheets({ sheetToDelete, deleteSheet }) {
    const handleDelete = () => {
        if (!sheetToDelete) return;

        deleteSheet(sheetToDelete.id);

        // Close the delete modal
        document.getElementById("delete_modal")?.close();

        // Ensure the details modal is also closed
        document.getElementById("my_modal_3")?.close();
    };

    return (
        <dialog id="delete_modal" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">¿Eliminar ficha?</h3>

                <p className="py-4 text-gray-600">
                    Esta acción no se puede deshacer. Ten en cuenta que al eliminar, las dependencias ligadas a la ficha se eliminarán de igual forma.
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
