import { createContext, useEffect, useState } from "react";
import api from "@/lib/axios";
import { router } from "@inertiajs/react";
import { toast } from "sonner";

// Create a context to share folder and file data across components
export const ExplorerDataContext = createContext();

export function ExplorerDataProvider({ children }) {

    // Stores the list of folders currently visible in the UI
    // This changes when navigating between folders
    const [folders, setFolders] = useState([]);

    // Stores the complete list of all folders in the system
    // Used mainly for selects, moves, or global operations
    const [allFolders, setallFolders] = useState([]);

    // Stores the folder that is currently opened by the user
    // Null means the user is at the root level
    const [currentFolder, setcurrentFolder] = useState(null);

    // Stores the currently selected items (files and/or folders)
    // Each item contains an id and a type ('file' or 'folder')
    const [selectedItems, setSelectedItems] = useState([]);

    // Controls whether multiple selection mode is active
    // Used to allow selecting multiple items without holding Shift
    const [isMultipleSelection, setIsMultipleSelection] = useState(false);

    // Stores temporary deletion data for undo functionality
    // Contains deleted items and a timeout reference
    const [pendingDelete, setPendingDelete] = useState(null);

    // Stores the list of files inside the currently opened folder
    const [files, setFiles] = useState([]);

    // Indicates whether an API request is in progress
    // Used to show loaders and prevent duplicate actions
    const [loading, setLoading] = useState(false);
    const [loadingAllFolders, setLoadingAllFolders] = useState(false);

    // Keeps track of folder navigation history (breadcrumb/back navigation)
    // Each entry is a folder ID
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
            throw new Error("Error loading folders: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle navigation when the user opens a folder
    const openFolder = async (folderId, addToHistory = false) => {
        setSelectedItems([]);
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
        setSelectedItems([]);
        setIsMultipleSelection(false);

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
        try {
            setLoadingAllFolders(true);
            const res = await api.get("/api/folders-all");

            if (!res.data.success) {
                throw new Error("Error al obtener la API");
            }
            setallFolders(res.data.folders)
            setLoadingAllFolders(false);
        } catch (err) {
            setLoadingAllFolders(false)
            throw new Error("Error al hacer la petición: ", err.message || err);
           
        }
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
            console.error("Error al hacer la petición: ", err?.response?.data?.message || err);
            throw err;
        }
    };


    const createFolder = async ({ data }) => {
        let toastId;
        try {
            toastId = toast.loading("Creando Carpeta");
            const res = await api.post(`/api/folders`, data);

            if (!res.data.success) {
                toast.error(res.data?.message || "Error")
                toast.dismiss(toastId);
                throw new Error("Error: " + res.data?.message || "Error");
            }
            folders.unshift(res.data.folder);
            toast.dismiss(toastId);
            toast.success("Carpeta creada con éxito");
            getAllFolders()

        } catch (err) {
            toast.dismiss(toastId);
            throw new Error(err.response?.data?.message || "Error");
        }
    };

    const selectItem = (id, type, event) => {
        setSelectedItems(prev => {
            const exists = prev.find(item => item.id === id && item.type === type);

            // SHIFT o modo múltiple
            if (event.shiftKey || isMultipleSelection) {
                if (exists) {
                    return prev.filter(item => !(item.id === id && item.type === type));
                }
                return [...prev, { id, type }];
            }

            // Click normal
            return [{ id, type }];
        });
    };

    const isSelected = (id, type) => {
        return selectedItems.some(
            item => item.id === id && item.type === type
        );
    };


    const deleteSelection = () => {
        setSelectedItems([])
        setIsMultipleSelection(false);
    }

    const updateFolder = async ({ data, folderId }) => {
        let toastId;

        try {
            toastId = toast.loading("Editando carpeta");

            await api.put(`/api/folders/${folderId}`, data);

            setFolders(prev =>
                prev.map(f => f.id === folderId ? { ...f, ...data } : f)
            );

            toast.success("Carpeta editada con éxito");
            toast.dismiss(toastId);
            getAllFolders()

        } catch (err) {
            toast.dismiss(toastId);
            throw new Error(err.response?.data?.message || "Error");
        }
    };


    // Deletes selected folders and files with undo support (delayed backend deletion)
    const deleteSelectionItemsMixed = () => {

        // Extract IDs of selected items that are folders
        const foldersToDelete = selectedItems
            .filter(i => i.type === 'folder') // keep only folders
            .map(i => i.id);                  // extract their IDs

        // Extract IDs of selected items that are files
        const filesToDelete = selectedItems
            .filter(i => i.type === 'file')   // keep only files
            .map(i => i.id);                  // extract their IDs

        // If nothing is selected, show an error and stop execution
        if (foldersToDelete.length === 0 && filesToDelete.length === 0) {
            toast.error("No hay elementos seleccionados");
            return;
        }

        // Store full folder objects that will be deleted,
        // including their original position in the array (__index)
        // This is required to restore them in the correct position on undo
        const deletedFolders = folders
            .map((folder, index) =>
                foldersToDelete.includes(folder.id)
                    ? { ...folder, __index: index }
                    : null
            )
            .filter(Boolean); // remove null values

        // Same logic as folders, but for files
        const deletedFiles = files
            .map((file, index) =>
                filesToDelete.includes(file.id)
                    ? { ...file, __index: index }
                    : null
            )
            .filter(Boolean);

        // Optimistically remove folders from UI immediately
        setFolders(prev =>
            prev.filter(f => !foldersToDelete.includes(f.id))
        );

        // Optimistically remove files from UI immediately
        setFiles(prev =>
            prev.filter(f => !filesToDelete.includes(f.id))
        );

        // Clear selection state
        setSelectedItems([]);
        setIsMultipleSelection(false);

        // Close the information drawer (UI cleanup)
        document.getElementById("drawer-information").close();

        // Schedule the real backend deletion after 10 seconds
        const timeoutId = setTimeout(async () => {
            try {
                // Send delete request to backend (logical delete)
                await api.post('/api/folders/delete-mixed', {
                    folders: foldersToDelete,
                    files: filesToDelete
                });

                // Notify user that items were sent to trash
                toast.success("Elementos eliminados", {
                    description: "Enviados a la papelera"
                });
            } catch (err) {
                // Throw error if backend deletion fails
                throw new Error(
                    "Error al eliminar " +
                    err.response?.data?.message || err.message
                );
            } finally {
                // Clear pending delete state regardless of outcome
                setPendingDelete(null);
            }
        }, 10000); // 10-second undo window

        // Store data needed to undo the deletion
        const undoData = {
            folders: deletedFolders, // folders with original positions
            files: deletedFiles,     // files with original positions
            timeoutId                // timeout reference to cancel deletion
        };

        // Save pending delete state
        setPendingDelete(undoData);

        // Show toast with undo action
        toast("Enviando a la papelera", {
            description: "Puedes deshacer esta acción",
            action: {
                label: "Deshacer",
                onClick: () => undoDeleteMixed(undoData)
            },
            duration: 10000
        });
    };

    const globalSearch = async (term) => {
        if (!term.trim()) {
            fetchFolders();
            return;
        }

        try {
            setLoading(true);
            const res = await api.get('/api/search', {
                params: { q: term }
            });

            if (res.data.success) {
                setFolders(res.data.folders);
                setFiles(res.data.files);
                setcurrentFolder(null); // global mode
            }
        } catch (err) {
            toast.error("Error al buscar " + err.message);
        } finally {
            setLoading(false);
        }
    };



    // Restores folders and files if user clicks "Undo"
    const undoDeleteMixed = (data) => {
        // If there is nothing to undo, exit early
        if (!data) return;

        // Cancel the scheduled backend deletion
        clearTimeout(data.timeoutId);

        // Restore folders to their original positions
        setFolders(prev => {
            const updated = [...prev];
            data.folders
                .sort((a, b) => a.__index - b.__index) // restore order
                .forEach(folder => {
                    updated.splice(folder.__index, 0, folder);
                });
            return updated;
        });

        // Restore files to their original positions
        setFiles(prev => {
            const updated = [...prev];
            data.files
                .sort((a, b) => a.__index - b.__index) // restore order
                .forEach(file => {
                    updated.splice(file.__index, 0, file);
                });
            return updated;
        });

        // Clear pending delete state
        setPendingDelete(null);

        // Notify user that changes were undone
        toast.success("Cambios deshechos");
    };


    // Downloads selected files and/or folders as a ZIP file
    const downloadZip = async () => {

        // Prevent download if nothing is selected
        if (selectedItems.length === 0) {
            throw new Error("No hay elementos seleccionados");
        }

        // Extract IDs of selected files
        const files = selectedItems
            .filter(i => i.type === 'file') // keep only files
            .map(i => i.id);                // extract their IDs

        // Extract IDs of selected folders
        const folders = selectedItems
            .filter(i => i.type === 'folder') // keep only folders
            .map(i => i.id);                  // extract their IDs

        // If only one file is selected and no folders,
        // perform a direct download instead of creating a ZIP
        if (files.length === 1 && folders.length === 0) {
            window.location.href = `/api/folders/file/download/${files[0]}`;
            return; // stop execution
        }

        // Mixed selection (files + folders or multiple items):
        // request a ZIP file from the backend
        const res = await api.post(
            '/api/folders/download-mixed-zip',
            { files, folders },             // payload with selected IDs
            { responseType: 'blob' }        // expect binary ZIP data
        );

        // Trigger browser download of the ZIP file
        downloadBlob(res.data, 'GecDocs-descarga');
    };


    // Forces the browser to download a Blob as a file
    const downloadBlob = (blob, name) => {

        // Create a temporary object URL from the binary data
        const url = window.URL.createObjectURL(new Blob([blob]));

        // Create a temporary anchor element
        const link = document.createElement('a');

        // Generate current date and time for filename
        const date = new Date();
        const time = date.toLocaleTimeString();

        // Set the download URL
        link.href = url;

        // Build a dynamic filename with date and time
        link.setAttribute(
            'download',
            `${name}-${date.toISOString().split('T')[0]}-${time.replace(" ", "-")}.zip`
        );

        // Append the link to the DOM (required for some browsers)
        document.body.appendChild(link);

        // Programmatically trigger the download
        link.click();

        // Remove the link from the DOM
        link.remove();
    };

    // Provide all data and actions to any component that uses this context
    return (
        <ExplorerDataContext.Provider
            value={{
                folders,
                isSelected,
                setFolders,
                files,
                setFiles,
                downloadZip,
                selectItem,
                fetchFolders,
                openFolder,
                goBack,
                historyStack,
                setHistoryStack,
                currentFolder,
                allFolders,
                loadingAllFolders,
                isMultipleSelection,
                setSelectedItems,
                globalSearch,
                setIsMultipleSelection,
                loading,
                setLoading,
                uploadFiles,
                getAllFolders,
                deleteSelectionItemsMixed,
                createFolder,
                updateFolder,
                setcurrentFolder,
                selectedItems,
                deleteSelection

            }}
        >
            {children}
        </ExplorerDataContext.Provider>
    );
}
