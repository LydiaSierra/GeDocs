import React, { useContext } from "react";
import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { UserContext } from "@/context/UserContext/UserContext";

function UserSearch() {
    const { content} = useContext(UserContext);
    return (
        <div className="w-full h-auto flex flex-col gap-5">
            <h1 className="text-2xl">
                 {content === "Instructor"
                            ? "Lista de Instructores"
                            : "Lista de Aprendices"}
            </h1>
            <div id="inbox-search" className="flex gap-2 w-[40%]">
                <div className="flex items-center bg-[#E8E8E8] px-2 rounded-md flex-1 min-w-0">
                    <input
                        placeholder="Buscar"
                        type="text"
                        className="input bg-[#E8E8E8] border-none focus:outline-none shadow-none w-full  truncate text-lg"
                    />
                    <MagnifyingGlassIcon className="size-5 mr-2 shrink-0 text-[#404142] cursor-pointer" />
                </div>
                <button className="p-3 rounded-md shrink-0 bg-[#E8E8E8] cursor-pointer hover:bg-accent">
                    <FunnelIcon className="size-6 text-[#404142] " />
                </button>
            </div>
        </div>
    );
}

export default UserSearch;
