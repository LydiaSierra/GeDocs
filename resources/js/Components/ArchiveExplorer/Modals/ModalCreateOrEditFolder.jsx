import { ArchiveDataContext } from '@/context/ArchiveExplorer/ArchiveDataContext';
import { ArchiveUIContext } from '@/context/ArchiveExplorer/ArchiveUIContext';
import React, { useContext, useState, useRef, useEffect } from 'react'
import { toast } from 'sonner';

const ModalCreateOrEditFolder = () => {
    const { currentFolder, createFolder, updateFolder } = useContext(ArchiveDataContext);
    const { selectedFolder, toogleShowModalFolder, setSelectedFolder } = useContext(ArchiveUIContext);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        folder_code: "",
    });

    const createFolderSubmit = async (e) => {
        e.preventDefault();
        document.getElementById('createFolder').close();

        setLoading(true);
        try {

            const data = {
                name: formData.name,
                folder_code: formData.folder_code,
                parent_id: currentFolder?.id || null,
                department: currentFolder?.department || "sección",
            };

            await createFolder({
                data,
            });
            setSelectedFolder(null);
            setFormData({
                name: "",
                folder_code: "",
            });

        } catch (err) {

            toast.error("Error al crear la carpeta: " + err.message);

        } finally {
            setLoading(false);
        }
    };


    const editFolderSubmit = async (e) => {
        e.preventDefault();
        document.getElementById('createFolder').close();
        setLoading(true);


        try {
            const form = new FormData(e.target);

            const data = {
                name: form.get("name"),
                folder_code: form.get("folder_code"),
                parent_id: currentFolder?.id || null,
                departament: currentFolder?.departament || "sección",
            };

            await updateFolder({
                data,
                folderId: selectedFolder.id,
            });
            setSelectedFolder(null);
        } catch (err) {
            toast.error(err?.message || "Error al editar la carpeta");
        } finally {
            setLoading(false);
        }
    };



    const handleCancel = () => {
        setLoading(false);
        setSelectedFolder(null);
        document.getElementById('createFolder').close();
    };

    useEffect(() => {
        if (selectedFolder) {
            setFormData({
                name: selectedFolder.name || "",
                folder_code: selectedFolder.folder_code || ""
            });
        } else {
            setFormData({
                name: "",
                folder_code: ""
            });
        }
    }, [selectedFolder]);




    return (
        <dialog id='createFolder' className='modal'>
            <div className='modal-box'>
                <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={handleCancel}>✕</button>
                </form>



                <h2 className='text-2xl font-bold text-center'>{selectedFolder ? "Editar Carpeta" : "Crear Carpeta"}</h2>

                {selectedFolder ? (
                    <form className='flex flex-col gap-8' onSubmit={editFolderSubmit}>
                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="folder_name">Nombre de la Carpeta:</label>
                            <input required type="text" value={formData.name || ""} id="folder_name" name="name" className='border border-gray-300 rounded-md p-2' placeholder='Ejem: Actas'
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="folder_code">Codigo de la Carpeta:</label>
                            <input required type="text" value={formData.folder_code || ""} id="folder_code" name="folder_code" className='border border-gray-300 rounded-md p-2' placeholder='Ejem: 110'
                                onChange={(e) => setFormData({ ...formData, folder_code: e.target.value })}
                            />
                        </div>

                        <div className='flex items-center justify-center gap-2'>

                            <button className='bg-primary text-white rounded-md px-4 py-2 cursor-pointer' type='submit' disabled={loading}>
                                {loading ? "Editando..." : "Guardar"}
                            </button>
                        </div>

                    </form>
                ) : (
                    <form className='flex flex-col gap-8' onSubmit={createFolderSubmit}>
                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="folder_name">Nombre de la Carpeta:</label>
                            <input required type="text" name="name" className='border border-gray-300 rounded-md p-2' placeholder='Ejem: Actas'
                                value={formData.name || ""}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="folder_code">Codigo de la Carpeta:</label>
                            <input required type="text" name="folder_code" className='border border-gray-300 rounded-md p-2' placeholder='Ejem: 110'
                                value={formData.folder_code || ""}
                                onChange={(e) => setFormData({ ...formData, folder_code: e.target.value })}
                            />
                        </div>

                        <div className='flex items-center justify-center gap-2'>
                            <button className='bg-primary text-white rounded-md px-4 py-2 cursor-pointer' type='submit' disabled={loading}>
                                {loading ? "Creando..." : "Crear"}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            <form method="dialog" class="modal-backdrop" onClick={handleCancel}>
                <button>close</button>
            </form>
        </dialog>
    )
}

export default ModalCreateOrEditFolder
