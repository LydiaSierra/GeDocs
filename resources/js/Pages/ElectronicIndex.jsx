import { useEffect, useMemo } from "react";
import { usePage } from "@inertiajs/react";
import IndexTitle from "@/Components/ElectronicIndex/indexTitle";
import IndexTable from "@/Components/ElectronicIndex/indexTable";
import Header from "@/Components/Header/Header";

export default function ElectronicIndex(){
    const { url } = usePage();

    const queryParams = useMemo(() => new URLSearchParams(url.split("?")[1] || ""), [url]);
    const querySheetId = queryParams.get("sheet_id");
    const querySheetNumber = queryParams.get("sheet_number");

    const activeSheetId = querySheetId || localStorage.getItem("active_sheet_id");
    const activeSheetNumber = querySheetNumber || localStorage.getItem("active_sheet_number");

    useEffect(() => {
        if (querySheetId) {
            localStorage.setItem("active_sheet_id", querySheetId);
        }

        if (querySheetNumber) {
            localStorage.setItem("active_sheet_number", querySheetNumber);
        }
    }, [querySheetId, querySheetNumber]);

    useEffect(() => {
        const baseTitle = "Indice Electronico";
        document.title = activeSheetNumber
            ? `${baseTitle} | Ficha ${activeSheetNumber}`
            : baseTitle;
    }, [activeSheetNumber]);

    return(
        <div className="pt-16 px-4 pb-5 w-screen h-screen bg-gray-100" >
            <Header/>
            <div className="w-full h-full flex flex-col justify-start items-center gap-10 bg-white rounded-2xl border border-gray-100">
            <IndexTitle activeSheetId={activeSheetId} activeSheetNumber={activeSheetNumber} />
            <IndexTable/>
            </div>
        </div>
    )

}
