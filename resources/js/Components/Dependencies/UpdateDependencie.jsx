import React, { useContext, useState } from "react";
import { DependenciesContext } from "@/context/DependenciesContext/DependenciesContext";

export default function UpdateDependencie({ dependency }) {
    const { editDependency } = useContext(DependenciesContext);

    const [name, setName] = useState(dependency.name);
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        setLoading(true);

        await editDependency(dependency.id, { name });

        setLoading(false);
    };

    return (
        <div className="flex gap-2 items-center">
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input input-bordered input-sm"
            />

            <button
                onClick={handleUpdate}
                className={`btn btn-warning btn-sm bg-green-500 ${
                    loading ? "btn-disabled" : ""
                }`}
            >
                {loading ? "Guardando..." : "Editar"}
            </button>
        </div>
    );
}
