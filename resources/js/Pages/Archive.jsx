import Sidebar from "@/components/Sidebar/Sidebar";
import { FunnelIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import ArchiveTable from "@/components/ArchiveTable/ArchiveTable";
import { InputSearch } from "@/components/ArchiveExplorer/InputSearch";
import Header from "@/Components/Header/Header";
import { DashboardLayout } from "@/Layouts/DashboardLayout";

export default function Archive() {
    return (
        <div className="bg-senaGray">
            <DashboardLayout>
                <div className="bg-white p-4 rounded-md h-full overflow-auto">
                    <InputSearch />
                    <ArchiveTable />
                </div>
            </DashboardLayout>

        </div>
    );
}
