import{
    createContext,
    useState,
    useEffect,
} from "react";

import api from "@/lib/axios";

export const ElectronicIndexContext = createContext();

export function ElectronicIndexProvider ({ children }) {

    return(
        <ElectronicIndexContext.Provider value={{}}>
            {children}
        </ElectronicIndexContext.Provider>
    )

}
