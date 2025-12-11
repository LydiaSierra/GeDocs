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
            <div>
                <table className="w-full border-separate border-spacing-y-4 overflow-y-scroll">
                    <thead className="sticky top-0">
                        <tr className="bg-[#E8E8E8] h-10 ">
                            <th className="rounded-l-[7px]">Nombre</th>
                            <th>Identificacion</th>
                            <th>Email</th>
                            <th>Fecha de cración</th>
                            <th className="rounded-r-[7px]">Estado</th>
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
                                        className=" bg-white hover:bg-accent text-center cursor-pointer h-15 rounded-[7px]"
                                    >
                                        <td className="rounded-l-[7px] pl-5 font-medium text-xl text-neutral">
                                            <div className="h-full flex flex-row items-center justify-start gap-5">
                                                <img
                                                    className="w-10 rounded-full"
                                                    alt="profile pic"
                                                    src="/images/girl-pic.jpg"
                                                />
                                                {item.name}
                                            </div>
                                        </td>
                                        <td className="text-[#606164] font-normal">
                                            {item.document_number}
                                        </td>
                                        <td className="text-[#606164] font-normal">
                                            {item.email}
                                        </td>
                                        <td className="text-[#606164] font-normal">
                                            {new Date(
                                                item.created_at
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className=" text-[#606164] h-full font-normal rounded-r-[7px]">
                                            <div className="bg-[#E8E8E8] rounded-md w-[90%] h-auto">
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
