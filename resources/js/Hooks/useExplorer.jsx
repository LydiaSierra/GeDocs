import { router, usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import { useState, useCallback, useEffect } from 'react';

// External store to share state without Context
let store = {
    allFolders: [],
    currentFolder: null,
    selectedItems: [],
    isMultipleSelection: false,
    pendingDelete: null,
    files: [],
    loading: false,
    loadingAllFolders: false,
    historyStack: [],
    activeSheetId: null,
    folders: [],
    archivedFolders: [],
    archivedFiles: [],
    archivedMode: false,
    gridView: false,
    showDropFolders: false,
    inputSearchTerm: ""
};

let listeners = [];

const emitChange = () => {
    listeners.forEach(listener => listener());
};

const setStore = (updates) => {
    store = { ...store, ...updates };
    emitChange();
};

let lastSyncedFilters = null;
let lastSyncedProps = null;

export const useExplorer = () => {
    const { props, url } = usePage();
    const { folders: propsFolders, files: propsFiles, currentFolder: propsCurrentFolder, filters } = props;

    // Local state to trigger re-renders
    const [, setTick] = useState(0);
    const forceUpdate = useCallback(() => setTick(tick => tick + 1), []);

    useEffect(() => {
        listeners.push(forceUpdate);
        return () => {
            listeners = listeners.filter(l => l !== forceUpdate);
        };
    }, [forceUpdate]);

    // Sync state with Inertia props
    useEffect(() => {
        // Prevent redundant syncs if props haven't changed since last sync
        if (lastSyncedProps === props && lastSyncedFilters === filters) return;
        lastSyncedProps = props;
        lastSyncedFilters = filters;

        const updates = {};

        // Sync folders and files
        if (propsFolders !== undefined) updates.folders = propsFolders || [];
        if (propsFiles !== undefined) updates.files = propsFiles || [];
        if (propsCurrentFolder !== undefined) updates.currentFolder = propsCurrentFolder || null;
        if (props.allFolders !== undefined) updates.allFolders = props.allFolders || [];

        // Sync sheet ID from URL filters
        if (filters?.sheet_id) {
            updates.activeSheetId = Number(filters.sheet_id);
        } else if (url === '/explorer' && !filters?.folder_id && !filters?.buscador) {
            // We are explicitly at the root of selection, clear active sheet
            updates.activeSheetId = null;
        } else if (!store.activeSheetId) {
            // Fallback to localStorage if no activeSheetId and no explicit root
            const savedSheet = localStorage.getItem("active_sheet_id");
            if (savedSheet) updates.activeSheetId = Number(savedSheet);
        }

        // Sync search term only if it's present in filters to avoid resetting local state
        if (filters?.buscador !== undefined) {
            updates.inputSearchTerm = filters.buscador;
        }

        if (Object.keys(updates).length > 0) {
            setStore(updates);
        }
    }, [propsFolders, propsFiles, propsCurrentFolder, props.allFolders, filters, url]);

    // Initialize grid view from localStorage
    useEffect(() => {
        const savedView = localStorage.getItem("gridView");
        if (savedView) setStore({ gridView: savedView === "true" });

        const savedHistory = JSON.parse(localStorage.getItem("folder_id"));
        if (savedHistory?.length > 0) {
            setStore({ historyStack: savedHistory });
        }
    }, []);

    // --- ACTIONS ---

    const openFolder = (folderId, addToHistory = true) => {
        setStore({ selectedItems: [] });
        const params = { folder_id: folderId };
        if (store.activeSheetId) params.sheet_id = store.activeSheetId;

        router.get(route('explorer'), params, {
            preserveState: true,
            onStart: () => setStore({ loading: true }),
            onFinish: () => setStore({ loading: false }),
            onSuccess: () => {
                if (addToHistory) {
                    const newHistory = [...store.historyStack, folderId];
                    localStorage.setItem("folder_id", JSON.stringify(newHistory));
                    setStore({ historyStack: newHistory });
                }
            }
        });
    };

    const fetchFolders = (folderId = null, sheetId = null) => {
        const params = {};
        if (folderId) params.folder_id = folderId;
        if (sheetId) params.sheet_id = sheetId;

        router.get(route('explorer'), params, {
            preserveState: true,
            onStart: () => setStore({ loading: true }),
            onFinish: () => setStore({ loading: false }),
        });
    };

    const goBack = () => {
        setStore({ selectedItems: [], isMultipleSelection: false });

        if (store.historyStack.length === 0) {
            fetchFolders(null, store.activeSheetId);
            return;
        }

        const newHistory = [...store.historyStack];
        newHistory.pop();

        localStorage.setItem("folder_id", JSON.stringify(newHistory));
        setStore({ historyStack: newHistory });

        if (newHistory.length === 0) {
            fetchFolders(null, store.activeSheetId);
        } else {
            const lastId = newHistory[newHistory.length - 1];
            openFolder(lastId, false);
        }
    };

    const getAllFolders = () => {
        // No longer needed as an action since allFolders comes from props
    };

    const uploadFiles = (folderId, files) => {
        if (!files || files.length === 0) {
            toast.error("No hay archivos seleccionados");
            return;
        }

        router.post(route('folders.upload', folderId), {
            files: Array.from(files)
        }, {
            forceFormData: true,
            onStart: () => setStore({ loading: true }),
            onFinish: () => setStore({ loading: false }),
            onSuccess: () => toast.success("Archivos subidos con éxito"),
            onError: () => toast.error("Error al subir archivos"),
        });
    };

    const createFolder = ({ data }) => {
        let toastId = toast.loading("Creando Carpeta");
        const folderData = { ...data };
        if (!folderData.parent_id && store.activeSheetId) {
            folderData.sheet_number_id = store.activeSheetId;
        }

        router.post(route('folders.store'), folderData, {
            onSuccess: () => {
                toast.dismiss(toastId);
                toast.success("Carpeta creada con éxito");
            },
            onError: () => {
                toast.dismiss(toastId);
                toast.error("Error al crear carpeta", {
                    description: "Verifica que no exista es mismo año"
                });
            }
        });
    };

    const updateFolder = ({ data, folderId }) => {
        let toastId = toast.loading("Editando carpeta");
        router.put(route('folders.update', folderId), data, {
            onSuccess: () => {
                toast.dismiss(toastId);
                toast.success("Carpeta editada con éxito");
            },
            onError: () => {
                toast.dismiss(toastId);
                toast.error("Error al editar carpeta", {
                    description: "Verifica que no exista es mismo año"
                });
            }
        });
    };

    const fetchArchived = useCallback(async (sheetId = null) => {
        setStore({ loading: true });
        try {
            const baseUrl = route('folders.archived');
            const url = sheetId ? `${baseUrl}?sheet_id=${sheetId}` : baseUrl;

            const response = await fetch(url);
            const data = await response.json();
            if (data.success) {
                setStore({
                    archivedFolders: data.folders || [],
                    archivedFiles: data.files || [],
                    loading: false
                });
            }
        } catch (error) {
            console.error("Error fetching archived items:", error);
            setStore({ loading: false });
        }
    }, []);

    const restoreSelection = (manualItems = null) => {
        const foldersToRestore = manualItems ? manualItems.folders : store.selectedItems.filter(i => i.type === 'folder').map(i => i.id);
        const filesToRestore = manualItems ? manualItems.files : store.selectedItems.filter(i => i.type === 'file').map(i => i.id);

        if (foldersToRestore.length === 0 && filesToRestore.length === 0) return;

        let toastId = toast.loading("Restaurando elementos...");
        router.post(route('folders.restoreMixed'), {
            folders: foldersToRestore,
            files: filesToRestore
        }, {
            onSuccess: () => {
                toast.dismiss(toastId);
                toast.success("Elementos restaurados");
                setStore({ selectedItems: [] });
                if (store.archivedMode) {
                    fetchArchived(store.activeSheetId);
                } else {
                    fetchFolders(store.currentFolder?.id, store.activeSheetId);
                }
            },
            onError: () => {
                toast.dismiss(toastId);
                toast.error("Error al restaurar");
            },
            preserveState: true
        });
    };

    const selectItem = (id, type, event) => {
        const exists = store.selectedItems.find(item => item.id === id && item.type === type);
        let newSelection = [];

        if (event.shiftKey || store.isMultipleSelection) {
            if (exists) {
                newSelection = store.selectedItems.filter(item => !(item.id === id && item.type === type));
            } else {
                newSelection = [...store.selectedItems, { id, type }];
            }
        } else {
            newSelection = [{ id, type }];
        }

        setStore({ selectedItems: newSelection });
    };

    const isSelected = (id, type) => {
        return store.selectedItems.some(item => item.id === id && item.type === type);
    };

    const deleteSelection = () => {
        setStore({ selectedItems: [], isMultipleSelection: false });
    };

    const deleteSelectionItemsMixed = (manualItems = null) => {
        // Handle case where manualItems might be a React event object
        const itemsToProcess = Array.isArray(manualItems) ? manualItems : store.selectedItems;

        const foldersToDelete = itemsToProcess.filter(i => i.type === 'folder').map(i => i.id);
        const filesToDelete = itemsToProcess.filter(i => i.type === 'file').map(i => i.id);

        if (foldersToDelete.length === 0 && filesToDelete.length === 0) {
            toast.error("No hay elementos seleccionados");
            return;
        }

        // Optimistic UI: remove from current view
        setStore({
            folders: store.folders.filter(f => !foldersToDelete.includes(f.id)),
            files: store.files.filter(f => !filesToDelete.includes(f.id)),
            selectedItems: [],
            isMultipleSelection: false
        });

        document.getElementById("drawer-information")?.close();
        document.getElementById("confirmDeleteFolder")?.close();

        router.post(route('folders.deleteMixed'), {
            folders: foldersToDelete,
            files: filesToDelete
        }, {
            onSuccess: () => {
                toast.success("Elementos archivados", {
                    action: {
                        label: "Deshacer",
                        onClick: () => restoreSelection({
                            folders: foldersToDelete,
                            files: filesToDelete
                        })
                    },
                    duration: 5000
                });

                // Recargar datos desde el servidor
                fetchFolders(store.currentFolder?.id, store.activeSheetId);

                if (store.archivedMode) fetchArchived(store.activeSheetId);
            },
            onError: () => {
                toast.error("Error al archivar");
                fetchFolders(store.currentFolder?.id, store.activeSheetId);
            }
        });
    };

    const globalSearch = (term) => {
    setStore({ inputSearchTerm: term });

    if (!term.trim()) {
        const params = {};
        if (store.activeSheetId) params.sheet_id = store.activeSheetId;
        if (store.currentFolder?.id) params.folder_id = store.currentFolder.id;
        // Si hay historial, usar el último folder_id del stack
        else if (store.historyStack.length > 0) {
            params.folder_id = store.historyStack[store.historyStack.length - 1];
        }

        router.get(route('explorer'), params, {
            preserveState: true,
            onStart: () => setStore({ loading: true }),
            onFinish: () => setStore({ loading: false }),
        });
        return;
    }

    const params = { buscador: term };
    if (store.activeSheetId) params.sheet_id = store.activeSheetId;

    router.get(route('explorer'), params, {
        preserveState: true,
        onStart: () => setStore({ loading: true }),
        onFinish: () => setStore({ loading: false }),
    });
};

    const downloadZip = async () => {
        if (store.selectedItems.length === 0) return;

        const files = store.selectedItems.filter(i => i.type === 'file').map(i => i.id);
        const folders = store.selectedItems.filter(i => i.type === 'folder').map(i => i.id);

        if (files.length === 1 && folders.length === 0) {
            window.location.href = route('folders.download', files[0]);
            return;
        }

        const form = document.createElement('form');
        form.method = 'POST';
        form.action = route('folders.downloadMixedZip');
        form.target = '_blank';

        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (token) {
            const input = document.createElement('input');
            input.type = 'hidden'; input.name = '_token'; input.value = token;
            form.appendChild(input);
        }

        files.forEach(id => {
            const input = document.createElement('input');
            input.type = 'hidden'; input.name = 'files[]'; input.value = id;
            form.appendChild(input);
        });

        folders.forEach(id => {
            const input = document.createElement('input');
            input.type = 'hidden'; input.name = 'folders[]'; input.value = id;
            form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    };

    // UI ACTIONS
    const toggleGridView = () => {
        const newValue = !store.gridView;
        localStorage.setItem("gridView", newValue);
        setStore({ gridView: newValue });
    };

    const toggleDropFolders = () => {
        setStore({ showDropFolders: !store.showDropFolders });
    };

    const formatSize = (size) => {
        if (!size) return "0 KB";
        const units = ["B", "KB", "MB", "GB", "TB"];
        const index = Math.floor(Math.log(size) / Math.log(1024));
        return `${(size / Math.pow(1024, index)).toFixed(2)} ${units[index]}`;
    };

    const setInputSearchTerm = (term) => setStore({ inputSearchTerm: term });
    const setHistoryStack = (stack) => setStore({ historyStack: stack });
    const setActiveSheetId = (id) => setStore({ activeSheetId: id });
    const setIsMultipleSelection = (val) => setStore({ isMultipleSelection: val });
    const setSelectedItems = (items) => setStore({ selectedItems: items });
    const setArchivedMode = (val, sheetId = null) => {
        const currentSheetId = sheetId ?? store.activeSheetId;
        setStore({ archivedMode: val, selectedItems: [] });
        if (val) fetchArchived(currentSheetId);
    };

    // Permissions
    const role = props.auth?.user?.roles?.[0]?.name;
    const canEdit = role === "Admin" || role === "Instructor";

    return {
        ...store,
        canEdit,
        openFolder,
        fetchFolders,
        goBack,
        getAllFolders,
        uploadFiles,
        createFolder,
        updateFolder,
        selectItem,
        isSelected,
        deleteSelection,
        deleteSelectionItemsMixed,
        globalSearch,
        downloadZip,
        toggleGridView,
        toggleDropFolders,
        formatSize,
        setInputSearchTerm,
        setHistoryStack,
        setActiveSheetId,
        setIsMultipleSelection,
        setSelectedItems,
        setArchivedMode,
        fetchArchived,
        restoreSelection
    };
};

/**
 * Backward compatibility aliases
 */
export const useExplorerData = useExplorer;
export const useExplorerUI = useExplorer;
export const useCanEdit = () => useExplorer().canEdit;
export const getSelectedItem = () => {
    const { selectedItems, folders, files } = useExplorer();
    const selected = selectedItems[0];
    return selected
        ? selected.type === 'folder'
            ? folders.find(f => f.id === selected.id)
            : files.find(f => f.id === selected.id)
        : null;
};
