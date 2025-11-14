import { ArchiveDataContext } from '@/context/ArchiveExplorer/ArchiveDataContext';
import { ArchiveUIContext } from '@/context/ArchiveExplorer/ArchiveUIContext';
import { usePage } from '@inertiajs/react';
import React, { useContext } from 'react';

const ModalHandleFolder = () => {
    const { handleModalFolder, inputNameFolder, setinputNameFolder } = useContext(ArchiveUIContext);
    const {createFolder} = useContext(ArchiveDataContext);

  const { props } = usePage();
  const parent_id = props.parent_id || null; // <- aquí llega desde Laravel
    return (
        <div>
            <dialog id="my_modal_2" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Nombre de la Carpeta</h3>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        createFolder(parent_id);
                        handleModalFolder("my_modal_2");
                    }}>
                        <input
                            type="text"
                            className="input outline-0 my-3 w-full"
                            value={inputNameFolder}
                            onChange={(e) => setinputNameFolder(e.target.value)}
                        />
                        <div className="modal-action">
                            {/* CANCEL BUTTON */}
                            <button
                                type="button"
                                className="btn bg-gray-400"
                                onClick={() => handleModalFolder("my_modal_2")}
                            >
                                Cancelar
                            </button>

                            {/* BUTTON CREATE FOLDER */}
                            <button type='submit' className="btn bg-green-800 text-white">Crear Carpeta</button>
                        </div>
                    </form>
                </div>

                <form method="dialog" className="modal-backdrop">
                    <button onClick={() => handleModalFolder("my_modal_2")}>close</button>
                </form>
            </dialog>
        </div>
    );
};

export default ModalHandleFolder;
