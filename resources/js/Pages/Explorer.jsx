import Navbar from "@/components/Navbar/Navbar";
import Sidebar from "@/components/Sidebar/Sidebar";
import {Squares2X2Icon, PlusIcon} from "@heroicons/react/24/outline";
import ArchiveExplorer from "@/components/ArchiveExplorer/ArchiveExplorer";
import {InputSearch} from "@/components/ArchiveExplorer/InputSearch";
import {BreadCrumb} from "@/components/ArchiveExplorer/BreadCrumb";
import {ModalDetails} from "@/components/ArchiveExplorer/ModalDetails";
import {useContext, useState} from "react";
import {ArchiveDataContext} from "@/context/ArchiveDataContext";
import {ArchiveUIContext} from "@/context/ArchiveUIContext";
import {router, usePage} from "@inertiajs/react";
import {Inertia} from "@inertiajs/inertia";

export default function Explorer() {
    // 📦 Contextos
    const {handleSearch, searchTerm} = useContext(ArchiveDataContext);
    const {gridView, toggleGridView, showModal} = useContext(ArchiveUIContext);

    // 📍 Estado local solo para controlar el input de búsqueda
    const [inputSearchTerm, setInputSearchTerm] = useState(searchTerm || "");

    // 🔍 Al presionar Enter o botón, se dispara la búsqueda
    const handleSearchSubmit = () => {
        handleSearch(inputSearchTerm.trim());
    };

    const {parent_id} = usePage().props;

    const uploadFile = (e) => {
        const file = e.target.files[0];

        if (file) {
            const formData = new FormData();
            formData.append("file", file); // el nombre debe coincidir con el del backend
            formData.append('folder_id', parent_id);

            router.post("/upload", formData, {
                onStart: () => console.log("Subiendo archivo... ⏳"),
                onSuccess: () => console.log("Archivo subido correctamente ✅"),
                onError: (errors) => console.error("Error al subir:", errors),
            });
        }
    }

    return (
        <div
            className="bg-senaGray dark:bg-gray-800 min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300 relative">
            <Navbar/>
            <div className="flex">
                <Sidebar/>

                <div
                    className="flex flex-col h-[calc(100vh-80px-2.5rem)] w-full bg-white dark:bg-gray-800 lg:m-5 rounded-lg p-2 lg:p-5 gap-3 overflow-y-auto transition-colors duration-300 lg:shadow-md dark:shadow-none">

                    {/* 🔍 Barra de búsqueda + modo cuadrícula */}
                    <div className="flex gap-3 items-center justify-center lg:justify-start">
                        <InputSearch
                            inputSearchTerm={inputSearchTerm}
                            setInputSearchTerm={setInputSearchTerm}
                            handleSearch={handleSearchSubmit}
                        />

                        <button
                            className={`p-4 rounded-md hover:cursor-pointer transition-colors duration-300
                ${gridView
                                ? "bg-green-700 text-white dark:bg-green-600"
                                : "bg-gray-100 hover:bg-green-100 dark:bg-gray-700 dark:hover:bg-green-900"
                            }`}
                            onClick={toggleGridView}
                            title="Cambiar vista"
                        >
                            <Squares2X2Icon
                                className={`size-7 ${
                                    gridView ? "stroke-white" : "stroke-gray-800 dark:stroke-gray-200"
                                }`}
                            />
                        </button>
                    </div>

                    {/* 🧭 Navegación */}
                    <BreadCrumb/>

                    {/* 📁 Explorador principal */}
                    <ArchiveExplorer/>

                    {/* 🪟 Modal de detalles */}
                    {showModal && <ModalDetails/>}
                </div>
            </div>


            <div className={'absolute p-4 rounded-full bg-green-800 text-white bottom-3 right-3 cursor-pointer'}>

                {/*    ICONO DE AGREGAR*/}
                <label htmlFor="addFile">
                    <PlusIcon className={'w-5 h-5 text-white'}/>
                </label>
                <input onChange={uploadFile} type="file" id={'addFile'} hidden
                       accept={'.pdf, application/pdf, .docs, .xmls'}/>
            </div>
        </div>
    );
}
