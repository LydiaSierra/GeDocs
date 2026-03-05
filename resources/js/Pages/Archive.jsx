import ArchiveTable from "@/Components/ArchiveTable/ArchiveTable";
import { InputSearch } from "@/Components/ArchiveExplorer/InputSearch";
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
