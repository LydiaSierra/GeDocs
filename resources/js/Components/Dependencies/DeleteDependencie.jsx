import React, { useContext, useState } from "react";
import { DependenciesContext } from "@/context/DependenciesContext/DependenciesContext";

export default function DeleteDependencie({ dependency }) {
    const { deleteDependency } = useContext(DependenciesContext);
    const [loading, setLoading] = useState(false);

    if (!dependency) return null; 

    const modalId = `delete_dependency_${dependency.id}`;

    const handleDelete = async () => {
        setLoading(true);
        await deleteDependency(dependency.id);
        setLoading(false);

        document.getElementById(modalId)?.close();
    };

    return (
        <>
            <button
                className="btn btn-error btn-sm"
                onClick={() => document.getElementById(modalId)?.showModal()}
            >
                Eliminar
            </button>

            <dialog id={modalId} className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">
                        ¿Eliminar dependencia?
                    </h3>

                    <p className="py-4 text-gray-600">
                        Esta acción no se puede deshacer.
                    </p>

                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn">Cancelar</button>
                        </form>

                        <button
                            onClick={handleDelete}
                            className={`btn btn-error ${
                                loading ? "btn-disabled" : ""
                            }`}
                        >
                            {loading ? "Eliminando..." : "Eliminar"}
                        </button>
                    </div>
                </div>
            </dialog>
        </>
    );
}
