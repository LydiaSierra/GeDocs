import { createContext, useEffect, useState } from "react";
import api from "@/lib/axios";
import { router } from "@inertiajs/react";

// Create a context to share folder and file data across components
export const ArchiveDataContext = createContext();

export function ArchiveDataProvider({ children }) {

    // State to store the list of folders
    const [folders, setFolders] = useState([]);
    const [allFolders, setallFolders] = useState([])
    const [currentFolder, setcurrentFolder] = useState(null);

    // State to store the list of files
    const [files, setFiles] = useState([]);

    // Loading state to handle API request status
    const [loading, setLoading] = useState(false);

    // Stack to keep track of folder navigation history
    const [historyStack, setHistoryStack] = useState([]);

    // Fetch folders and files from the API depending on the current folder (parentId)
    const fetchFolders = async (parentId = null) => {
        try {
            setLoading(true);

            // Determine the API endpoint based on whether we are inside a folder or in the root

            // Make the API request
            const res = await api.get("/api/folders");

            // If the response is successful, update folders and files
            if (res.data.success === true) {
                setFolders(res.data.folders || []);
                setFiles([]);
                setcurrentFolder(null)
            }

        } catch (e) {
            console.log("Error loading folders: " + e);
        } finally {
            setLoading(false);
        }
    };

    // Handle navigation when the user opens a folder
    const openFolder = async (folderId, addToHistory = false) => {
        try {
            setLoading(true)
            const res = await api.get("/api/folders/parent_id/" + folderId);
            // Add the new folder ID to the navigation history
            if (addToHistory) {
                setHistoryStack((prev) => {
                    const newHistory = [...prev, folderId];
                    localStorage.setItem("folder_id", JSON.stringify(newHistory));
                    return newHistory;
                });
            }

            if (!res.data.success) {
                throw new Error("Error al obtener las carpetas");
            }
            setcurrentFolder(res.data.folder);
            setFolders(res.data.children);
            setFiles(res.data.files);

            // Save the folder ID in localStorage for persistence

        } catch (err) {
            throw new Error("Error al hacer la peticion" + err);
        } finally {
            setLoading(false);
        }

    };

    // Go back to the previous folder in the navigation history
    const goBack = () => {
        setHistoryStack(prevState => {
            if (prevState.length <= 1) {
                fetchFolders();
                localStorage.removeItem("folder_id")
                return []
            }

            const newHistory = [...prevState];
            newHistory.pop();
            const lasId = newHistory[newHistory.length - 1];
            localStorage.setItem("folder_id", JSON.stringify(newHistory));
            openFolder(lasId, false);
            return newHistory;

        });
    };

    const getAllFolders = async () => {
        const res = await api.get("/api/folders-all");

        if (!res.data.success) {
            throw new Error("Error al obtener la API");
        }


        setallFolders(res.data.folders)
    }

    const uploadFiles = async (folderId, files) => {
        try {

            if (!files || files.length === 0) {
                throw new Error("No hay archivos seleccionados");
            }

            const formData = new FormData();

            Array.from(files).forEach(file => {
                formData.append('files[]', file);
            });

            const res = await api.post(`/api/folders/${folderId}/upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (!res.data.success) {
                throw new Error("Error: " + res.data.message);
            }
            setFiles(prev => [...prev, ...(Array.isArray(res.data.files) ? res.data.files : [])]);
        } catch (err) {
            console.error("Error al hacer la petición: ", err.message || err);
            throw err;
        }
    };


    const deleteFile = async (fileId) => {
        try {
            await api.delete(`/api/folders/file/${fileId}`);

            // Actualizar estado local instantáneamente
            setFiles(prev => prev.filter(f => f.id !== fileId));

        } catch (error) {
            console.error("Error eliminando archivo:", error);
        }
    };

 
    // Whenever parentId changes, fetch the corresponding folders and files
    useEffect(() => {
        getAllFolders()
    }, []);

    // Provide all data and actions to any component that uses this context
    return (
        <ArchiveDataContext.Provider
            value={{
                folders,
                setFolders,
                files,
                setFiles,
                loading,
                setLoading,
                fetchFolders,
                openFolder,
                goBack,
                historyStack,
                setHistoryStack,
                currentFolder,
                allFolders,
                uploadFiles,
                deleteFile,

            }}
        >
            {children}
        </ArchiveDataContext.Provider>
    );
}
