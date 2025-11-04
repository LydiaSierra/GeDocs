import Navbar from "@/components/Navbar/Navbar";
import Sidebar from "@/components/Sidebar/Sidebar";
import {FunnelIcon, MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import ArchiveTable from "@/components/ArchiveTable/ArchiveTable";
import { InputSearch } from "@/components/ArchiveExplorer/InputSearch";

export default function Archive() {
    return (
        <div className="bg-senaGray">
            <Navbar></Navbar>
            <div className="flex">
                <Sidebar></Sidebar>
                <div className="flex flex-col h-[calc(100vh-80px-2.5rem)] w-[calc(110vw-80px)] bg-white m-5 rounded-lg p-5 gap-3">
                   <InputSearch />
                    <ArchiveTable />
                </div>
            </div>

        </div>
    );
}