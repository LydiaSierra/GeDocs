import TableSheets from "@/Components/Sheets/SheetsSidebar";
import UsersLayout from "@/Layouts/UsersLayout";
import { usePage } from "@inertiajs/react";
import React from "react";

export default function Sheets(){
    const {url}=usePage();
    return(
        <UsersLayout url={url}>
            <TableSheets/>
        </UsersLayout>
        
    )
}