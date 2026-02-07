import React, { useContext } from "react";
import { DependenciesContext } from "@/context/DependenciesContext/DependenciesContext";
import CreateDependencie from "./CreateDependencie";
import UpdateDependencie from "./UpdateDependencie";
import DeleteDependencie from "./DeleteDependencie";

export default function DependenciesSidebar() {
    const { dependencies } = useContext(DependenciesContext);

    return (
        <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                    Dependencias
                </h1>

                <div className="w-full sm:w-auto">
                    <CreateDependencie />
                </div>
            </header>

          
            <div className="space-y-3">
                {dependencies.length === 0 && (
                    <div className="alert alert-info">
                        <span>No hay dependencias registradas</span>
                    </div>
                )}

                {dependencies.map((dependency) => (
                    <div
                        key={dependency.id}
                        className="
                            collapse collapse-arrow
                            bg-base-100
                            border border-base-300
                            rounded-lg
                        "
                    >
                        <input type="checkbox" />

                        <div className="collapse-title flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                            <span className="font-semibold text-base sm:text-lg">
                                {dependency.name}
                            </span>

                            <span className="text-xs sm:text-sm text-gray-500">
                                Ficha #{dependency.sheet_number_id}
                            </span>
                        </div>

                        <div className="collapse-content">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="text-sm text-gray-600">
                                    <p>
                                        <span className="font-medium">
                                            Ficha:
                                        </span>{" "}
                                        {dependency.sheet_number_id}
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                                    <UpdateDependencie
                                        dependency={dependency}
                                    />

                                    <DeleteDependencie
                                        dependency={dependency}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
