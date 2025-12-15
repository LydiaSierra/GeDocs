import { UserContext } from "@/context/UserContext/UserContext";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { useContext, useState, useEffect } from "react";
import UserModal from "./UserModal";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

export const UserList = ({ url }) => {
    const {
        user,
        loading,
        ShowInformation,
        content,
        setContent,
        loadingSearch,
        isSearching,
        filteredUser,
    } = useContext(UserContext);

    const InfoView = isSearching ? filteredUser : user;

    useEffect(() => {
        if (url === "/users/instructor") {
            setContent("Instructor");
        } else if (url === "/users/aprendiz") {
            setContent("Dependencia");
        } else if (url === "/users/fichas") {
            setContent("Ficha");
        }
    }, [url]);

    if (loading) {
        return (
            <div className="w-full flex flex-col absolute top1/2 items-center justify-center z-100 h-full">
                <ArrowPathIcon className="size-8 animate-spin" />
                cargando.....
            </div>
        );
    } else if (loadingSearch) {
        return (
            <div className="w-auto h-auto flex flex-col absolute top-1/2 left-1/2 items-center justify-center z-100">
                <ArrowPathIcon className="size-8 animate-spin" />
                cargando.....
            </div>
        );
    } else {
        return (
            <div className="overflow-y-scroll w-full">
                <table className="w-full lg:border-separate lg:border-spacing-y-4 ">
                    <thead className="sticky top-0 h-auto">
                        <tr className="lg:bg-[#E8E8E8] bg-none lg:h-10 md:h-7 ">
                            <th className="md:rounded-l-[7px] rounded-tl-[7px] text-sm lg:text-lg md:w-auto">Nombre</th>
                            <th className="text-sm lg:text-lg md:w-auto">Identificacion</th>
                            <th className="hidden lg:table-cell">Email</th>
                            <th className="hidden lg:table-cell">Fecha de cración</th>
                            <th className="md:rounded-r-[7px] rounded-tr-[7px] text-sm lg:text-lg md:w-auto">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(() => {
                            const filtered = InfoView.filter((item) =>
                                item.roles.some((r) => r.name === content)
                            );
                            if (filtered.length === 0) {
                                if (isSearching) {
                                    return (
                                        <h1 className="absolute top-1/2 left-1/2">
                                            No hay resultados para mostrar.
                                        </h1>
                                    );
                                }
                            } else {
                                return filtered.map((item) => (
                                    <tr
                                        key={item.id}
                                        onClick={() => {
                                            ShowInformation(item.id);
                                        }}
                                        className=" lg:bg-white bg-none lg:border-none border-y border-solid border-[#DBDBDB]
                                        hover:bg-accent text-center cursor-pointer h-15 "
                                    >
                                        <td className="lg:pl-5 pl-2 lg:text-xl text-xs font-normal md:rounded-l-[7px] rounded-tl-[7px]">
                                            <div className="h-full flex flex-row items-center justify-start lg:gap-5 gap-2">
                                                <img
                                                    className="lg:w-10 w-8 rounded-full"
                                                    alt="profile pic"
                                                    src="/images/girl-pic.jpg"
                                                />
                                                {item.name}
                                            </div>
                                        </td>
                                        <td className="text-[#606164] lg:text-lg text-xs font-normal">
                                            {item.document_number}
                                        </td>
                                        <td className="text-[#606164] hidden lg:table-cell font-normal">
                                            {item.email}
                                        </td>
                                        <td className="text-[#606164] hidden lg:table-cell font-normal">
                                            {new Date(
                                                item.created_at
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className=" text-[#606164] h-full font-normal md:rounded-r-[7px] rounded-tr-[7px]yy">
                                            <div className="bg-[#E8E8E8] rounded-md lg:w-[90%] md:w-[70%] w-auto text-xs lg:text-lg h-auto">
                                                {item.status === "pending"
                                                    ? "Pendiente"
                                                    : "Activo"}
                                            </div>
                                        </td>
                                    </tr>
                                ));
                            }
                        })()}
                    </tbody>
                </table>
                <UserModal />
            </div>
        );
    }
};
