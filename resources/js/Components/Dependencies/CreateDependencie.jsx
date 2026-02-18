import React, { useContext, useState } from "react";
import { DependenciesContext } from "@/context/DependenciesContext/DependenciesContext";

export default function CreateDependencie() {
    const { createDependency } = useContext(DependenciesContext);

    const [name, setName] = useState("");
    const [sheetNumber, setSheetNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const success = await createDependency({
            name,
            sheet_number_id: sheetNumber || null,
        });

        if (success) {
            setName("");
            setSheetNumber("");
            setMessage({
                type: "success",
                text: "Dependencia creada exitosamente",
            });
        } else {
            setMessage({
                type: "error",
                text: "No se pudo crear la dependencia",
            });
        }

        setLoading(false);

        setTimeout(() => setMessage(null), 3000);
    };

    return (
        <div className="flex flex-col gap-2">
            {message && (
                <div className={`alert alert-${message.type}`}>
                    <span>{message.text}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex gap-2 items-center">
                <input
                    type="text"
                    placeholder="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input input-bordered"
                    required
                />

                <input
                    type="number"
                    placeholder="Ficha"
                    value={sheetNumber}
                    onChange={(e) => setSheetNumber(e.target.value)}
                    className="input input-bordered"
                />

                <button
                    type="submit"
                    className={`btn btn-primary ${
                        loading ? "btn-disabled" : ""
                    }`}
                >
                    {loading ? "Creando..." : "Crear"}
                </button>
            </form>
        </div>
    );
}
