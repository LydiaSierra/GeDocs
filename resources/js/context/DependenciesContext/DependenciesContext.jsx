import { createContext, useCallback, useEffect, useState } from "react";
import api from "@/lib/axios";

export const DependenciesContext = createContext();

export function DependenciesProvider({ children }) {
    const [dependencies, setDependencies] = useState([]);

    const fetchDependencies = useCallback(async () => {
        try {
            const res = await api.get("/api/dependency");

            if (!res.data?.dependencies) {
                console.log("ERROR AL OBTENER DEPENDENCIAS");
                return;
            }

            setDependencies(res.data.dependencies);
        } catch (error) {
            console.log("Error API (fetchDependencies):", error);
        }
    }, []);

    const createDependency = async (data) => {
        try {
            const res = await api.post("/api/dependency", data);

            if (!res.data?.dependency) {
                console.log("Error creando dependencia");
                return false;
            }

            await fetchDependencies();

            return true;
        } catch (error) {
            console.log("Error API (createDependency):", error);
            return false;
        }
    };

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

    const deleteDependency = async (id) => {
        try {
            const res = await api.delete(`/api/dependency/${id}`);

            if (!res.data?.success) {
                console.log("Error eliminando dependencia");
                return;
            }

            setDependencies((prev) => prev.filter((dep) => dep.id !== id));
        } catch (error) {
            console.log("Error API (deleteDependency):", error);
        }
    };

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
