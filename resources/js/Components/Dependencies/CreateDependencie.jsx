import React, { useContext, useEffect, useState } from "react";
import { DependenciesContext } from "@/context/DependenciesContext/DependenciesContext";
import { usePage } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import api from "@/lib/axios";

export default function CreateDependencie() {

    const { props } = usePage();
    const rol = props?.auth?.user?.roles?.[0]?.name;

    const { createDependency } = useContext(DependenciesContext);

    const [name, setName] = useState("");
    const [sheetNumber, setSheetNumber] = useState("");
    const [sheets, setSheets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const fetchSheets = async () => {
        try {
            const result = await api.get("/api/sheets");
            setSheets(result.data.sheets || []);
        } catch (e) {
            console.log(e.response?.data);
        }
    };

    useEffect(() => {
        fetchSheets();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            return setMessage({
                type: "error",
                text: "Ingrese el nombre de la dependencia",
            });
        }

        if (!sheetNumber) {
            return setMessage({
                type: "error",
                text: "Debe seleccionar una ficha",
            });
        }

        setLoading(true);
        setMessage(null);

        const response = await createDependency({
            name: name.trim(),
            sheet_number_id: Number(sheetNumber),
        });

        if (response.success) {
            setName("");
            setSheetNumber("");
            setMessage({
                type: "success",
                text: "Dependencia creada exitosamente",
            });
        } else if (response.errors) {
            const firstError = Object.values(response.errors)[0][0];
            setMessage({
                type: "error",
                text: firstError,
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

    if (rol !== "Instructor" && rol !== "Admin") return null;

    return (
        <div className="flex flex-col gap-3">

            {message && (
                <div className={`alert alert-${message.type}`}>
                    {message.text}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="flex flex-wrap gap-3 items-end"
            >

                <div>
                    <InputLabel value="Nombre" />
                    <input
                        type="text"
                        className="input input-bordered"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nombre de dependencia"
                    />
                </div>

                <div>
                    <InputLabel value="Ficha" />
                    <select
                        value={sheetNumber}
                        onChange={(e) => setSheetNumber(e.target.value)}
                        className="select select-bordered"
                    >
                        <option value="">Seleccione ficha</option>

                        {sheets.map((sheet) => (
                            <option key={sheet.id} value={sheet.id}>
                                {sheet.number}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary"
                >
                    {loading ? "Creando..." : "Crear"}
                </button>

            </form>
        </div>
    );
}