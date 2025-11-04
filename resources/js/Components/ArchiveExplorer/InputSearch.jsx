import { FunnelIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import React, {useEffect} from "react";
import {router} from "@inertiajs/react";

export const InputSearch = ({ inputSearchTerm, setInputSearchTerm, handleSearch }) => {


    return (
        <div id="inbox-search" className="flex gap-3">
            {/* Search field */}
            <div className="flex items-center bg-gray-100 px-2 rounded-md flex-grow max-w-sm">
                <input
                    placeholder="Buscar"
                    type="text"
                    className="bg-gray-100 text-black w-full focus:outline-none border-none"
                    value={inputSearchTerm}
                    onChange={(e) => setInputSearchTerm(e.target.value)}
                />

                {inputSearchTerm ? (
                    <XMarkIcon
                        className="size-7 stroke-black hover:cursor-pointer"
                    />
                ) : (
                    <MagnifyingGlassIcon
                        className="size-7 stroke-black hover:cursor-pointer"
                        onClick={() => handleSearch(inputSearchTerm)}
                    />
                )}
            </div>

            {/* Filter button */}
            <button className="p-4 bg-gray-100 rounded-md hover:bg-[#A7F1FB] transition">
                <FunnelIcon className="size-7 stroke-black" />
            </button>
        </div>
    );
};
