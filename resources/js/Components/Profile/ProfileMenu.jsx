import {
    UserCircleIcon,
    AcademicCapIcon,
    ListBulletIcon,
} from "@heroicons/react/24/outline";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { usePage } from "@inertiajs/react";

function ProfileMenu({
    setOpenObject,
    openObject,
    setOpenObject1,
    openObject1,
}) {
    const { url, props } = usePage();
    const rol = props.auth.user.roles[0].name;

    const showEditProfile = route().current("profile.edit");

    return (
        <div className="w-80 bg-white mt-18 rounded-lg flex flex-col items-center gap-1 overflow-hidden">
            <div className="w-full flex flex-col items-start gap-5 p-2">
                <a href={route("profile.edit")}>
                    <div
                        className={`flex items-center gap-2 text-lg font-medium hover:underline cursor-pointer ${
                            url === "/profile" ? "underline" : ""
                        }`}
                    >
                        <UserCircleIcon className="w-7 h-7 text-[#848484]" />
                        Informacion de Perfil
                    </div>
                </a>
            </div>

            {rol === "Admin" && (
                <div className="w-full flex flex-col items-start gap-5 p-2">
                    <h1 className="self-start text-[20px] text-[#848484]">
                        Usuarios
                    </h1>

                    <div className="flex flex-col gap-2">
                        <a href={route("aprendiz")}>
                            <div
                                className={`flex items-center gap-3 text-lg font-medium hover:underline cursor-pointer ${
                                    url === "/users/aprendiz" ? "underline" : ""
                                }`}
                            >
                                <AcademicCapIcon className="w-7 h-7 text-[#848484]" />
                                Aprendices
                            </div>
                        </a>

                        <a href={route("instructor")}>
                            <div
                                className={`flex items-center gap-3 text-lg font-medium hover:underline cursor-pointer ${
                                    url === "/users/instructor"
                                        ? "underline"
                                        : ""
                                }`}
                            >
                                <ListBulletIcon className="w-7 h-7 text-[#848484]" />
                                Instructores
                            </div>
                        </a>

                        <a href={route("sheets")}>
                            <div
                                className={`flex items-center gap-3 text-lg font-medium hover:underline cursor-pointer ${
                                    url === "/sheets" ? "underline" : ""
                                }`}
                            >
                                <UserCircleIcon className="w-7 h-7 text-[#848484]" />
                                Fichas
                            </div>
                        </a>
                    </div>
                </div>
            )}

            {/* SOLICITUDES */}
            <div className="w-full flex flex-col items-start gap-5 p-2">
                <h1 className="self-start text-[20px] text-[#848484]">
                    Solicitudes
                </h1>

                <div className="flex flex-col gap-2">
                    {rol !== "Dependencia" && (
                        <a href={route("notifications.index")}>
                            <div
                                className={`flex items-center gap-3 text-lg font-medium hover:underline cursor-pointer ${
                                    url === "/notifications" ? "underline" : ""
                                }`}
                            >
                                <UserCircleIcon className="w-7 h-7 text-[#848484]" />
                                Aprendices
                            </div>
                        </a>
                    )}

                    {rol === "Admin" && (
                        <a href={route("notifications.index")}>
                            <div
                                className="flex flex-row items-center cursor-pointer gap-3 w-full text-[#010515] lg:text-lg md:text-md text-xs
                             font-medium hover:underline"
                            >
                                <UserCircleIcon className="text-[#848484] md:w-8 md:h-8 w-7 h-7 lg:w-9 lg:h-8 -ml-1" />
                                Instructores
                            </div>
                        </a>
                    )}
                </div>
            </div>

            {/* GESTIÓN DOCUMENTAL */}
            <div className="w-full flex flex-col items-start gap-5 p-2">
                <h1 className="self-start text-[20px] text-[#848484]">
                    Gestion Documental
                </h1>

                <div className="flex flex-col gap-2">
                    <a href={route("dependencies")}>
                        <div
                            className={`flex items-center gap-2 text-lg font-medium hover:underline cursor-pointer ${
                                url === "/dependencies" ? "underline" : ""
                            }`}
                        >
                            <UserCircleIcon className="w-7 h-7 text-[#848484]" />
                            Dependencias
                        </div>
                    </a>

                    <div className="flex items-center gap-2 text-lg font-medium hover:underline cursor-pointer">
                        <UserCircleIcon className="w-7 h-7 text-[#848484]" />
                        Series y Subseries
                    </div>

                    <div className="flex items-center gap-2 text-lg font-medium hover:underline cursor-pointer">
                        <UserCircleIcon className="w-7 h-7 text-[#848484]" />
                        Secciones y Subsecciones
                    </div>

                    {/* EDITAR PERFIL */}
                    {showEditProfile && (
                        <>
                            <h1 className="self-start text-[20px] text-[#848484]">
                                Editar Perfil
                            </h1>

                            <div
                                className="flex items-center gap-2 text-lg font-medium hover:underline cursor-pointer"
                                onClick={() => setOpenObject((prev) => !prev)}
                            >
                                <PencilSquareIcon className="w-7 h-7 text-[#848484]" />
                                Cambiar Contraseña
                            </div>

                            {rol === "Admin" && (
                                <div
                                    className="flex items-center gap-2 text-lg font-medium hover:underline cursor-pointer"
                                    onClick={() =>
                                        setOpenObject1((prev) => !prev)
                                    }
                                >
                                    <TrashIcon className="w-7 h-7 text-[#848484]" />
                                    Eliminar Cuenta
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProfileMenu;
