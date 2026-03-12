import React, { useContext, useEffect, useState } from "react";
import { DependenciesContext } from "@/context/DependenciesContext/DependenciesContext";
import CreateDependencie from "./CreateDependencie";
import UpdateDependencie from "./UpdateDependencie";
import DeleteDependencie from "./DeleteDependencie";
import api from "@/lib/axios";
import { ArrowPathIcon, BuildingOffice2Icon } from "@heroicons/react/24/outline";

export default function DependenciesSettingsSection() {
    const [sheets, setSheets] = useState([]);
    const [loading, setLoading] = useState(true);

    const { dependencies, fetchDependencies } = useContext(DependenciesContext);

    const fetchSheet = async () => {
        try {
            const result = await api.get("api/sheets");
            if (!result) return;
            setSheets(result.data.sheets);
        } catch (e) {
            console.error(e.message);
        }
    };

    const getInformation = async () => {
        await fetchDependencies();
        await fetchSheet();
        setLoading(false);
    };

    useEffect(() => {
        getInformation();
    }, []);

    const getSheetNumber = (sheetNumberId) => {
        const sheet = sheets.find((s) => s.id === sheetNumberId);
        return sheet ? sheet.number : "";
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-slate-400">
                    <ArrowPathIcon className="size-7 animate-spin" />
                    <span className="text-sm">Cargando dependencias...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <BuildingOffice2Icon className="size-5 text-slate-500" />
                    <h2 className="text-base font-semibold text-slate-800">Dependencias</h2>
                    {dependencies.length > 0 && (
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                            {dependencies.length}
                        </span>
                    )}
                </div>
                <CreateDependencie />
            </div>

            {/* List */}
            {dependencies.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center">
                    <BuildingOffice2Icon className="size-10 text-slate-300" />
                    <p className="text-sm text-slate-400">No hay dependencias registradas</p>
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {dependencies.map((dependency) => (
                        <div
                            key={dependency.id}
                            className="collapse collapse-arrow rounded-xl border border-slate-200 bg-white shadow-sm"
                        >
                            <input type="checkbox" />

                            <div className="collapse-title flex items-center justify-between gap-2 py-3 px-4">
                                <span className="font-medium text-slate-800 text-sm">
                                    {dependency.name}
                                </span>
                                <span className="mr-6 shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-500">
                                    Ficha #{getSheetNumber(dependency.sheet_number_id)}
                                </span>
                            </div>

                            <div className="collapse-content px-4 pb-4">
                                <hr className="mb-4 border-slate-100" />
                                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                                    <UpdateDependencie dependency={dependency} />
                                    <DeleteDependencie dependency={dependency} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}