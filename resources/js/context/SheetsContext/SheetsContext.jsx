import { createContext, useCallback, useEffect, useState } from "react";
import api from "@/lib/axios";

export const SheetsContext = createContext();

export function SheetsProvider({ children }) {
    const [sheets, setSheets] = useState([]);

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

    useEffect(() => {
        fetchSheets();
    }, [fetchSheets]);

    return (
        <SheetsContext.Provider value={{ sheets, fetchSheets }}>
            {children}
        </SheetsContext.Provider>
    );
}
