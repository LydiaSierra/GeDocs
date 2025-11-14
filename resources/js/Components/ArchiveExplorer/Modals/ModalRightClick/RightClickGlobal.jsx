import { ArchiveUIContext } from '@/context/ArchiveExplorer/ArchiveUIContext';
import { RightClickContext } from '@/context/ArchiveExplorer/RightClickContext';
import { DocumentPlusIcon, FolderPlusIcon } from '@heroicons/react/24/solid'
import React, { useContext } from 'react'

const ModalMenu = () => {
    const {contextMenu} = useContext(RightClickContext);
    return (
        <ul className="menu bg-base-200 rounded-box w-56 h-40 absolute z-50 shadow-lg"
            style={{ top: contextMenu.y, left: contextMenu.x }}
        >
            <li><button className="p-3 border-b border-gray-300" onClick={(e)=>{
                e.preventDefault();

            }}><FolderPlusIcon className="w-5 h-5 fill-green-800 stroke-white" /> Crear carpeta</button></li>
            <li><a className="p-3 border-b border-gray-300"><DocumentPlusIcon className="w-5 h-5 fill-green-800 stroke-white" /> Subir Archivo</a></li>
        </ul>
    )
}

export default ModalMenu