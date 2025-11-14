import { createContext, useEffect, useState } from "react";
import api from "@/lib/axios";
import { router } from "@inertiajs/react";

// Create a context to share folder and file data across components
export const ArchiveDataContext = createContext();

export function ArchiveDataProvider({ children }) {

    // State to store the list of folders
    const [folders, setFolders] = useState([]);

    // State to store the list of files
    const [files, setFiles] = useState([]);

    // Loading state to handle API request status
    const [loading, setLoading] = useState(false);

    // Stack to keep track of folder navigation history
    const [historyStack, setHistoryStack] = useState([]);

    // Current folder ID (null means the root directory)
    const [parentId, setParentId] = useState(null);

    // Fetch folders and files from the API depending on the current folder (parentId)
    const fetchFolders = async (parentId = null) => {
        try {
            setLoading(true);

            // Determine the API endpoint based on whether we are inside a folder or in the root
            const endpoint = parentId
                ? `/api/folders/parent_id/${parentId}`
                : `/api/folders`;

            // Make the API request
            const res = await api(endpoint);

            // If the response is successful, update folders and files
            if (res.data.success) {
                setFolders(res.data.folders || []);
                setFiles(res.data.files || []);
            }
        } catch (e) {
            console.log("Error loading folders: " + e);
        } finally {
            setLoading(false);
        }
    };

    // Handle navigation when the user opens a folder
    const handleFolderNavegation = (newParentId) => {
        // Add the new folder ID to the navigation history
        setHistoryStack((prev) => [...prev, newParentId]);

        // Update the current parent ID (null means root)
        setParentId(newParentId ?? null);

        // Save the folder ID in localStorage for persistence
        localStorage.setItem("folder_id", newParentId);
    };

    // Go back to the previous folder in the navigation history
    const goBack = () => {
        setHistoryStack(prevState => {
            const newStack = [...prevState];

            // Remove the current folder from the stack
            newStack.pop();

            // Get the previous folder ID or null if there is none
            const lastId = newStack[newStack.length - 1] ?? null;

            // Update the current folder and save it in localStorage
            setParentId(lastId);
            localStorage.setItem("folder_id", lastId);

            return newStack;
        });
    };

    // Whenever parentId changes, fetch the corresponding folders and files
    useEffect(() => {
        fetchFolders(parentId);
    }, [parentId]);

    // Provide all data and actions to any component that uses this context
    return (
        <ArchiveDataContext.Provider
            value={{
                folders,
                setFolders,
                files,
                setFiles,
                parentId,
                setParentId,
                loading,
                setLoading,
                fetchFolders,
                handleFolderNavegation,
                goBack,
                historyStack
            }}
        >
            {children}
        </ArchiveDataContext.Provider>
    );
}
