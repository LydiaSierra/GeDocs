import { ExplorerDataContext } from "@/context/Explorer/ExplorerDataContext";
import { ExplorerUIContext } from "@/context/Explorer/ExplorerUIContext";
import { usePage } from "@inertiajs/react";
import { useContext } from "react";

/**
 * Custom hook to access ExplorerDataContext
 * This provides access to all data-related state and actions
 * such as folders, files, selection, navigation, downloads, etc.
 */
export const useExplorerData = () => {
    // useContext allows consuming the nearest ExplorerDataContext provider
    return useContext(ExplorerDataContext);
};

/**
 * Custom hook to access ExplorerUIContext
 * This is typically used for UI-related state such as
 * view modes, drawers, modals, or layout preferences
 */
export const useExplorerUI = () => {
    // Returns UI state and actions related to the explorer interface
    return useContext(ExplorerUIContext);
};

/**
 * Custom hook to determine if the current user
 * has permission to edit folders/files
 *
 * It reads the authenticated user from Inertia's page props
 * and checks the user's role
 */
export const useCanEdit = () => {
    // Get the current user's role from Inertia shared props
    const role = usePage().props.auth.user.roles[0].name;

    // User can edit only if role is Admin or Instructor
    const canEdit = role === "Admin" || role === "Instructor";

    // Return a boolean flag to be used in components
    return canEdit;
};

/**
 * Utility hook/function to retrieve the currently selected item
 * (either a folder or a file) with full data
 *
 * This is useful when only ONE item is selected and you need
 * its full object instead of just its ID/type
 */
export const getSelectedItem = () => {
    // Access explorer data: selected items, folders and files
    const { selectedItems, folders, files } = useExplorerData();

    // Get the first selected item (single-selection logic)
    const selected = selectedItems[0];

    // If there is a selected item:
    // - If it's a folder, find it in the folders array
    // - If it's a file, find it in the files array
    // Otherwise, return null
    return selected
        ? selected.type === 'folder'
            ? folders.find(f => f.id === selected.id)
            : files.find(f => f.id === selected.id)
        : null;
};
