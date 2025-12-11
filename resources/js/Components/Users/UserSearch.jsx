import React, { useContext, useEffect, useState } from "react";
import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { UserContext } from "@/context/UserContext/UserContext";

function UserSearch({ url }) {
    const {
        inputSearch,
        setInputSearch,
        searchUser,
        setIsSearching,
        isSearching,
        resetSearch,
        filteredUser,
        filterSelected,
        setFilterSelected,
    } = useContext(UserContext);

    const [openDrodown, setOpenDropdown] = useState(false);
    const [FilterText, setFilterText] = useState("");

    useEffect(() => {
        if (filterSelected === "name") {
            setFilterText("Nombre");
        } else if (filterSelected === "document_number") {
            setFilterText("Identificacion");
        } else if (filterSelected === "email") {
            setFilterText("Email");
        } else {
            setFilterText("");
        }
        if (isSearching) {
            searchUser(inputSearch, filterSelected);
        }
    }, [filterSelected]);

    return (
        <div className="w-full h-auto flex flex-col gap-5">
            <h1 className="text-2xl">
                {url === "/users/instructor"
                    ? "Lista de Instructores"
                    : url === "/users/aprendiz"
                    ? "Lista de Aprendices"
                    : "Lista de Fichas"}
            </h1>
            <div id="inbox-search" className="flex gap-2 w-[40%]">
                <div className="flex items-center bg-[#E8E8E8] px-2 rounded-md flex-1 min-w-0">
                    <input
                        placeholder="Buscar"
                        type="text"
                        value={inputSearch}
                        className="input bg-[#E8E8E8] border-none focus:outline-none shadow-none w-full  truncate text-lg"
                        onChange={(e) => {
                            const value = e.target.value;
                            setInputSearch(value);

                            if (value === "" && isSearching) {
                                searchUser("", filterSelected);
                                return;
                            }

                            if (isSearching) {
                                searchUser(value, filterSelected);
                            }
                        }}
                    />
                    <MagnifyingGlassIcon
                        className="size-5 mr-2 shrink-0 text-[#404142] cursor-pointer"
                        onClick={() => {
                            searchUser(inputSearch, filterSelected);
                        }}
                    />
                </div>
                <div
                    className={`relative p-3 rounded-md shrink-0 cursor-pointer hover:bg-accent 
                        ${openDrodown ? "bg-accent" : "bg-[#E8E8E8]"} `}
                    onClick={() => {
                        if (openDrodown === false) {
                            setOpenDropdown(true);
                        } else {
                            setOpenDropdown(false);
                        }
                    }}
                >
                    <div className="flex flex-row justify-center items-center gap-3">
                        <FunnelIcon className="size-6 text-[#404142] " />
                        {FilterText}
                    </div>
                    {openDrodown && (
                        <div className="absolute left-0 top-full w-40 h-auto bg-white shadow-lg rounded-md border z-20">
                            <ul className="py-2 text-sm text-neutral text-start">
                                <li
                                    className="px-4 py-2 hover:bg-accent cursor-pointer"
                                    onClick={() => {
                                        setOpenDropdown(false);
                                        setFilterSelected("name");
                                    }}
                                >
                                    Nombre
                                </li>
                                <li
                                    className="px-4 py-2 hover:bg-accent cursor-pointer"
                                    onClick={() => {
                                        setOpenDropdown(false);
                                        setFilterSelected("document_number");
                                    }}
                                >
                                    Identificacion
                                </li>
                                <li
                                    className="px-4 py-2 hover:bg-accent cursor-pointer"
                                    onClick={() => {
                                        setOpenDropdown(false);
                                        setFilterSelected("email");
                                    }}
                                >
                                    Email
                                </li>
                            </ul>
                        </div>
                    )}
                </div>

                {isSearching ? (
                    <button
                        className="`w-auto px-3 h-full rounded-[7px] bg-primary text-[16px] cursor-pointer text-white border-none font-semibold
                text-center hover:border-solid border-2 hover:border-primary hover:bg-white hover:text-primary"
                        onClick={() => {
                            resetSearch();
                        }}
                    >
                        Ver Todos
                    </button>
                ) : null}
            </div>
        </div>
    );
}

export default UserSearch;
