
import { InputSearch } from "@/components/ArchiveExplorer/InputSearch";
import { useContext, useEffect, useState } from "react";
import { DashboardLayout } from "@/Layouts/DashboardLayout";
import ContainerFolders from "@/Components/ArchiveExplorer/ContainerFolders";
import { ArchiveDataContext } from "@/context/ArchiveExplorer/ArchiveDataContext";
import UploadModal from "@/Components/ArchiveExplorer/Modals/UploadModal";

export default function Explorer() {
    const { openFolder, setHistoryStack, fetchFolders, currentFolder } = useContext(ArchiveDataContext);
    const [openModalUpload, setopenModalUpload] = useState(false);




    useEffect(() => {
        const savedHistory = JSON.parse(localStorage.getItem("folder_id"));

        if (savedHistory?.length > 0) {
            setHistoryStack(savedHistory);
            const lastFolder = savedHistory[savedHistory.length - 1];
            openFolder(lastFolder, false);
        } else {
            fetchFolders()
        }

    }, [])



    return (

        <>
            <DashboardLayout>
                <div className="bg-white h-full rounded-lg p-2 relative overflow-hidden">
                    <div className="flex justify-between items-center">
                        <InputSearch />
                        {currentFolder &&
                            <button className="py-2 px-4 rounded-md bg-primary text-white cursor-pointer"
                                onClick={() => {
                                    setopenModalUpload(true)
                                }}
                            >
                                Subir Archivo
                            </button>
                        }
                    </div>
                    <ContainerFolders />


                    {openModalUpload &&
                        <UploadModal onOpen={setopenModalUpload} />
                    }
                </div>

            </DashboardLayout>
        </>




    );
}
