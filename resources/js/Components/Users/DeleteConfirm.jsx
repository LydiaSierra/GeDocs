import { UserContext } from "@/context/UserContext/UserContext";
import { useContext } from "react";
import { toast } from "sonner";
import { router, usePage } from "@inertiajs/react";

function DeleteConfirm() {
    const { DeleteInfo, idSelected } = useContext(UserContext);

    const DeleteUser = async () => {
        let toastId;

        try {
            toastId = toast.loading("Eliminando Usuario");
            await DeleteInfo(
                idSelected.id
            );
            toast.success("Usuario Eliminado con exito");
        } catch (err) {
            toast.error(
                err?.response?.data?.message ||
                    err?.message ||
                    err ||
                    "Error al hacer la petición",
            );
        } finally {
            if (toastId) {
                toast.dismiss(toastId);
            }
        }
    };

    return (
        <dialog id="my_modal_7" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">¿Eliminar Usuario?</h3>

                <p className="py-4 text-gray-600">
                    Esta acción no se puede deshacer.
                </p>

                <div className="modal-action">
                    <form method="dialog">
                        <button className="btn">Cancelar</button>
                    </form>

                    <button
                        onClick={() => {
                            DeleteUser();
                        }}
                        className="btn btn-error"
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </dialog>
    );
}

export default DeleteConfirm;
