import { createContext, useCallback, useEffect, useState } from "react";
import api from "@/lib/axios";

export const DependenciesContext = createContext();

export function DependenciesProvider({ children }) {
    const [dependencies, setDependencies] = useState([]);

    // =============================
    // OBTENER TODAS LAS DEPENDENCIAS
    // =============================
    const fetchDependencies = useCallback(async () => {
        try {
            const res = await api.get("/api/dependency");

            // Tu API no retorna success en index
            if (!res.data?.dependencies) {
                console.log("ERROR AL OBTENER DEPENDENCIAS");
                return;
            }

            setDependencies(res.data.dependencies);
        } catch (error) {
            console.log("Error API (fetchDependencies):", error);
        }
    }, []);

    // =============================
    // CREAR DEPENDENCIA
    // =============================
    const createDependency = async (data) => {
        try {
            const res = await api.post("/api/dependency", data);

            if (!res.data?.dependency) {
                console.log("Error creando dependencia");
                return false;
            }

            // Opción 1: refrescar todo
            await fetchDependencies();

            return true;
        } catch (error) {
            console.log("Error API (createDependency):", error);
            return false;
        }
    };

    // =============================
    // EDITAR DEPENDENCIA
    // =============================
    const editDependency = async (id, data) => {
        try {
            const res = await api.put(`/api/dependency/${id}`, data);

            if (!res.data?.success) {
                console.log("Error editando dependencia");
                return false;
            }

            await fetchDependencies();
            return true;
        } catch (error) {
            console.log("Error API (editDependency):", error);
            return false;
        }
    };

    // =============================
    // ELIMINAR DEPENDENCIA
    // =============================
    const deleteDependency = async (id) => {
        try {
            const res = await api.delete(`/api/dependency/${id}`);

            if (!res.data?.success) {
                console.log("Error eliminando dependencia");
                return;
            }

            // Eliminar local sin recargar todo
            setDependencies((prev) => prev.filter((dep) => dep.id !== id));
        } catch (error) {
            console.log("Error API (deleteDependency):", error);
        }
    };

    // =============================
    // CARGA INICIAL
    // =============================
    useEffect(() => {
        fetchDependencies();
    }, []);

    return (
        <DependenciesContext.Provider
            value={{
                dependencies,
                fetchDependencies,
                createDependency,
                editDependency,
                deleteDependency,
            }}
        >
            {children}
        </DependenciesContext.Provider>
    );
}
