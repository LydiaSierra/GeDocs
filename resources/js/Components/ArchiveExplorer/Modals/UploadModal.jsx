import { ArchiveDataContext } from '@/context/ArchiveExplorer/ArchiveDataContext';
import { PlusIcon } from '@heroicons/react/24/solid';
import React, { useContext, useState } from 'react'

const UploadModal = ({onOpen}) => {
    const {uploadFiles, currentFolder} = useContext(ArchiveDataContext)
    const [dragActive, setdragActive] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([])
    const [error, seterror] = useState("")
    const [isLoading, setIsLoading] = useState(false);

    const handleFiles = (files) => {
        seterror("")

        if (!files || files.length === 0) {
            setSelectedFiles([])
            return
        }

        const pdfFiles = Array.from(files).filter(file =>
            file.type === "application/pdf"
        );

        if (pdfFiles.length !== files.length) {
            seterror("Solo se permiten archivos pdf");
            return
        }

        setSelectedFiles(Array.from(files));
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setdragActive(false)
        handleFiles(e.dataTransfer.files);

    }

    return (
        <div className='fixed inset-0 bg-black/40 flex justify-center items-center z-50'>
            <div className="bg-white w-[450px] rounded-lg p-6 shadow">
                <h2 className="text-xl font-semibold mb-4">Subir archivos</h2>

                <div className={`border-2 border-dashed p-8 rounded-md flex flex-col gap-2 justify-center items-center ${dragActive ? "border-blue-500" : "border-gray-500"}`}
                    onDragOver={(e) => e.preventDefault()}
                    onDragEnter={() => setdragActive(true)}
                    onDragLeave={() => setdragActive(false)}
                    onDrop={handleDrop}
                >
                    <PlusIcon className='size-10' />
                    o
                    <label className="mt-2 cursor-pointer bg-blue-600 text-white px-4 py-2 rounded">
                        Elegir archivos
                        <input
                            type="file"
                            className="hidden"
                            multiple
                            onChange={(e) => handleFiles(e.target.files)}
                        />
                    </label>

                </div>
                {error &&
                    <h1 className='text-red-500 my-2'>{error}</h1>
                }


                {selectedFiles.length > 0 && (
                    <div className="mt-4">
                        <h3 className="font-medium">Archivos seleccionados:</h3>
                        <ul className="text-sm mt-2">
                            {selectedFiles.map((file, i) => (
                                <li key={i}>{file.name}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        className="px-4 py-2 rounded bg-gray-300"
                        onClick={() => {
                            onOpen(false)
                            setSelectedFiles([])
                            seterror("");
                        }}
                    >
                        Cancelar
                    </button>

                    {selectedFiles.length > 0 &&

                        <button
                            className="px-4 py-2 rounded bg-blue-600 text-white disabled:bg-gray-400"
                            disabled={isLoading}
                            onClick={async ()=>{
                                try {
                                    setIsLoading(true);
                                    await uploadFiles(currentFolder?.id ?? null, selectedFiles);
                                    onOpen(false);
                                    setSelectedFiles([]);
                                    seterror("");
                                } catch (err) {
                                    seterror(err.message || "Error al subir los archivos");
                                    setIsLoading(false);
                                }
                            }}
                        >
                            {isLoading ? "Subiendo..." : "Subir"}
                            
                        </button>
                    }
                </div>
            </div>
        </div>
    )
}

export default UploadModal