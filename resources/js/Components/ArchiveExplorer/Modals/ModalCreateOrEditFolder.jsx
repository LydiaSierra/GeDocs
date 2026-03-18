import { useExplorerData } from '@/Hooks/useExplorer';
import React, { useState, useEffect } from 'react'
import { toast } from 'sonner';

const ModalCreateOrEditFolder = () => {

    const {
        currentFolder,
        createFolder,
        updateFolder,
        selectedItems,
        folders,
        activeSheetId
    } = useExplorerData();

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        folder_code: "",
        department: "",
    });

    const selected =
        selectedItems.length === 1 && selectedItems[0].type === 'folder'
            ? folders.find(f => f.id === selectedItems[0].id)
            : null;

    const options = ["sección", "subsección", "serie", "subserie"];

    const currentIndex = options.indexOf(currentFolder?.department);

    const validOptions =
        currentFolder
            ? options.slice(currentIndex + 1)
            : ["sección"];

    useEffect(() => {
        if (!selected) {
            if (validOptions.length > 0) {
                setFormData(prev => ({
                    ...prev,
                    department: validOptions[0]
                }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    department: ""
                }));
            }
        }
    }, [currentFolder]);

    useEffect(() => {
        if (selected) {
            setFormData({
                name: selected.name || "",
                folder_code: selected.folder_code || "",
                department: selected.department || "",
            });
        } else {
            setFormData({
                name: "",
                folder_code: "",
                department: "",
            });
        }
    }, [selected]);

    const createFolderSubmit = async (e) => {
        e.preventDefault();

        if (validOptions.length === 0) {
            toast.error("No se pueden crear más niveles aquí");
            return;
        }

        setLoading(true);

        try {
            const data = {
                name: formData.name,
                folder_code: formData.folder_code,
                parent_id: currentFolder?.id || null,
                department: formData.department,
                sheet_number_id: currentFolder ? null : activeSheetId,
            };

            await createFolder({ data });

            setFormData({ name: "", folder_code: "", department: "" });

            document.getElementById('createFolder').close();

        } catch (err) {
            toast.error("Error al crear la carpeta: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const editFolderSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = {
                name: formData.name,
                folder_code: formData.folder_code,
                parent_id: currentFolder?.id || null,
                department: formData.department,
            };

            await updateFolder({
                data,
                folderId: selected.id,
            });

            document.getElementById('createFolder').close();

        } catch (err) {
            toast.error(err?.message || "Error al editar la carpeta");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setLoading(false);
        document.getElementById('createFolder').close();
    };

    return (
        <dialog id='createFolder' className='modal'>
            <div className='modal-box'>

                <button
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                    onClick={handleCancel}
                >
                    ✕
                </button>

                <h2 className='text-2xl font-bold text-center mb-4'>
                    {selected ? "Editar Carpeta" : "Crear Carpeta"}
                </h2>

                <form
                    className='flex flex-col gap-8'
                    onSubmit={selected ? editFolderSubmit : createFolderSubmit}
                >
                    <div className='flex flex-col space-y-2'>
                        <label>Nombre de la Carpeta:</label>
                        <input
                            required
                            type="text"
                            className='border border-gray-300 rounded-md p-2'
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                        />
                    </div>

                    <div className='flex flex-col space-y-2'>
                        <label>Código de la Carpeta:</label>
                        <input
                            required
                            type="text"
                            className='border border-gray-300 rounded-md p-2'
                            value={formData.folder_code}
                            onChange={(e) =>
                                setFormData({ ...formData, folder_code: e.target.value })
                            }
                        />
                    </div>

                    <div className='flex flex-col space-y-2'>
                        <label>Clasificación:</label>

                        {validOptions.length > 0 ? (
                            <select
                                className='border border-gray-300 rounded-md p-2'
                                value={formData.department}
                                onChange={(e) =>
                                    setFormData({ ...formData, department: e.target.value })
                                }
                                required
                            >
                                {validOptions.map((item) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <p className="text-red-500 text-sm">
                                No se pueden crear más niveles dentro de "subserie"
                            </p>
                        )}
                    </div>

                    <div className='flex justify-center'>
                        <button
                            className='bg-primary text-white rounded-md px-4 py-2'
                            type='submit'
                            disabled={loading || validOptions.length === 0}
                        >
                            {loading
                                ? selected ? "Editando..." : "Creando..."
                                : selected ? "Guardar" : "Crear"}
                        </button>
                    </div>
                </form>
            </div>

            <form method="dialog" className="modal-backdrop" onClick={handleCancel}>
                <button>close</button>
            </form>
        </dialog>
    );
};

export default ModalCreateOrEditFolder;