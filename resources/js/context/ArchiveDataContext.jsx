
import { createContext, useEffect, useState, useCallback } from "react";
import {router} from "@inertiajs/react";

export const ArchiveDataContext = createContext();

export function ArchiveDataProvider({ children }) {

    // States for handle the data fetching and navigation bewtteen folders, files and searching
    const [folders, setFolders] = useState([]);
    const [files, setFiles] = useState([]);
    const [parentId, setParentId] = useState(null);
    const [stack, setStack] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);

    let folderUrl = '';
    let fileUrl = '';

    // Navigate to a specific folder by its ID and name, updating the stack accordingly

    const navigateToFolder = (id, name) => {
        if (!id) {
            // 🏠 Si es "Home", reinicia navegación
            setParentId(null);
            setStack([]);
            setSearchTerm("");
            return;
        }

        router.get('explorer', {parent_id: id});
        setStack((prev) => {
            // 🔹 Buscar si la carpeta ya está en el stack
            const existingIndex = prev.findIndex((item) => item.id === id);

            if (existingIndex !== -1) {
                // 🔙 Si ya existe, recortamos el stack hasta ese punto
                const newStack = prev.slice(0, existingIndex + 1);
                setParentId(id);
                return newStack;
            }

            // 🆕 Si es una carpeta nueva, la agregamos al final
            const newStack = [...prev, { id, name }];
            setParentId(id);
            return newStack;
        });

        // 🔄 Limpiamos búsqueda (si aplica)
        setSearchTerm("");
    };

    // Navigate back to the previous folder in the stack
    const navigateBack = () => {
        const newStack = [...stack];
        newStack.pop();
        const previous = newStack[newStack.length - 1];
        setParentId(previous ? previous.id : null);
        setStack(newStack);
        setSearchTerm("");
    };

    // Handle search by setting the search term

    const handleSearch = (term) => {
        setSearchTerm(term);

        if (term.trim() === "") {
            router.get("explorer", { parent_id: parentId });
            return;
        }

        router.get("explorer", { search: term });
    };



   // Provide the context values to the children components
    return (
        <ArchiveDataContext.Provider
            value={{
                folders,
                setFolders,
                files,
                parentId,
                stack,
                loading,
                searchTerm,
                setSearchTerm,
                navigateToFolder,
                navigateBack,
                handleSearch,
            }}
        >
            {children}
        </ArchiveDataContext.Provider>
    );
}


