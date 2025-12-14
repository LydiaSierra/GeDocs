import { createContext, useCallback, useEffect, useState } from "react";
import api from "@/lib/axios";

export const SheetsContext = createContext();

export function SheetsProvider({ children }) {
    const [sheets, setSheets] = useState([]);

    // Obtener todas las fichas
    const fetchSheets = useCallback(async () => {
        try {
            const res = await api.get("/api/sheets");

            if (!res.data?.success) {
                console.log("ERROR AL OBTENER LAS FICHAS");
                return;
            }

            setSheets(res.data.sheets || []);
        } catch (error) {
            console.log("Error API:", error);
        }
    }, []);

    // Eliminar ficha
    const deleteSheet = async (id) => {
        try {
            const res = await api.delete(`/api/sheets/${id}`);

            if (!res.data?.success) {
                console.log("Error al eliminar");
                return;
            }

            // Eliminar de la lista sin recargar
            setSheets((prev) => prev.filter((s) => s.id !== id));
        } catch (error) {
            console.log("Error API:", error);
        }
    };

    // Editar ficha
    const editSheet = async (id, data) => {
        try {
            const res = await api.put(`/api/sheets/${id}`, data);

            if (!res.data?.success) {
                console.log("Error editando la ficha");
                return false;
            }

            await fetchSheets(); // Actualiza lista

            return true;
        } catch (error) {
            console.log("Error API:", error);
            return false;
        }
    };

    // Cargar fichas al inicio
    useEffect(() => {
        fetchSheets();
    }, []);

    return (
        <SheetsContext.Provider
            value={{
                sheets,
                fetchSheets,
                deleteSheet,
                editSheet, 
            }}
        >
            {children}
        </SheetsContext.Provider>
    );
}
