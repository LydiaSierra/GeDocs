import {
    UserCircleIcon,
    AcademicCapIcon,
    ListBulletIcon,
} from "@heroicons/react/24/outline";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Link, usePage } from "@inertiajs/react";

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
        <div className="bg-white rounded-lg p-4 flex flex-col gap-4 md:gap-5 overflow-hidden">
            <div className="w-full flex flex-col items-start gap-3 md:gap-4">
                <Link href={route("profile.edit")}>
                    <div
                        className={`flex items-center gap-3 cursor-pointer font-medium hover:underline text-sm md:text-base lg:text-lg ${url === "/profile" ? "underline" : ""}`}
                    >
                        <UserCircleIcon className="w-6 h-6 md:w-7 md:h-7 text-[#848484]" />
                        Informacion de Perfil
                    </div>
                </Link>
            </div>

            {rol === "Admin" && (
                <div className="w-full flex flex-col items-start gap-3 md:gap-4">
                    <h1 className="text-[#848484] text-base md:text-lg lg:text-xl">
                        Usuarios
                    </h1>

                    <div className="flex flex-col gap-2 md:gap-3">
                        <Link href={route("aprendiz")}>
                            <div
                                className={`flex items-center gap-3 cursor-pointer font-medium hover:underline text-sm md:text-base lg:text-lg ${url === "/users/aprendiz" ? "underline" : ""}`}
                            >
                                <AcademicCapIcon className="w-6 h-6 md:w-7 md:h-7 text-[#848484]" />
                                Aprendices
                            </div>
                        </Link>

                        <Link href={route("instructor")}>
                            <div
                                className={`flex items-center gap-3 cursor-pointer font-medium hover:underline text-sm md:text-base lg:text-lg ${url === "/users/instructor" ? "underline" : ""}`}
                            >
                                <ListBulletIcon className="w-6 h-6 md:w-7 md:h-7 text-[#848484]" />
                                Instructores
                            </div>
                        </Link>

                        <Link href={route("sheets")}>
                            <div
                                className={`flex items-center gap-3 cursor-pointer font-medium hover:underline text-sm md:text-base lg:text-lg ${url === "/sheets" ? "underline" : ""}`}
                            >
                                <UserCircleIcon className="w-6 h-6 md:w-7 md:h-7 text-[#848484]" />
                                Fichas
                            </div>
                        </Link>
                    </div>
                </div>
            )}

            <div className="w-full flex flex-col items-start gap-3 md:gap-4">
                <h1 className="text-[#848484] text-base md:text-lg lg:text-xl">
                    Solicitudes
                </h1>

                <div className="flex flex-col gap-2 md:gap-3">
                    
                    {rol === "Admin" && (
                        <Link href={route("notifications.index")}>
                            <div
                                className="flex items-center gap-3 w-full text-[#010515] cursor-pointer font-medium hover:underline text-sm md:text-base lg:text-lg"
                            >
                                <UserCircleIcon className="text-[#848484] w-6 h-6 md:w-7 md:h-7" />
                                Solicitudes
                            </div>
                        </Link>
                    )}
                    {rol === "Instructor" && (
                        <Link href={route("notifications.index")}>
                            <div
                                className="flex items-center gap-3 w-full text-[#010515] cursor-pointer font-medium hover:underline text-sm md:text-base lg:text-lg"
                            >
                                <UserCircleIcon className="text-[#848484] w-6 h-6 md:w-7 md:h-7" />
                                Solicitudes
                            </div>
                        </Link>
                    )}
                </div>
            </div>

            <div className="w-full flex flex-col items-start gap-3 md:gap-4">
                <h1 className="text-[#848484] text-base md:text-lg lg:text-xl">
                    Gestion Documental
                </h1>

                <div className="flex flex-col gap-2 md:gap-3">
                    <Link href={route("dependencies")}>
                        <div
                            className={`flex items-center gap-3 cursor-pointer font-medium hover:underline text-sm md:text-base lg:text-lg ${url === "/dependencies" ? "underline" : ""}`}
                        >
                            <UserCircleIcon className="w-6 h-6 md:w-7 md:h-7 text-[#848484]" />
                            Dependencias
                        </div>
                    </Link>

                    <div className="flex items-center gap-3 cursor-pointer font-medium hover:underline text-sm md:text-base lg:text-lg">
                        <UserCircleIcon className="w-6 h-6 md:w-7 md:h-7 text-[#848484]" />
                        Series y Subseries
                    </div>

                    <div className="flex items-center gap-3 cursor-pointer font-medium hover:underline text-sm md:text-base lg:text-lg">
                        <UserCircleIcon className="w-6 h-6 md:w-7 md:h-7 text-[#848484]" />
                        Secciones y Subsecciones
                    </div>

                </div>
            </div>

            {showEditProfile && (
                <div className="w-full flex flex-col items-start gap-3 md:gap-4">
                    <h1 className="text-[#848484] text-base md:text-lg lg:text-xl">
                        Editar Perfil
                    </h1>
                    <div
                        className="flex items-center gap-3 cursor-pointer font-medium hover:underline text-sm md:text-base lg:text-lg"
                        onClick={() => setOpenObject((prev) => !prev)}
                    >
                        <PencilSquareIcon className="w-6 h-6 md:w-7 md:h-7 text-[#848484]" />
                        Cambiar Contraseña
                    </div>
                    {rol === "Admin" && (
                        <div
                            className="flex items-center gap-3 cursor-pointer font-medium hover:underline text-sm md:text-base lg:text-lg"
                            onClick={() => setOpenObject1((prev) => !prev)}
                        >
                            <TrashIcon className="w-6 h-6 md:w-7 md:h-7 text-[#848484]" />
                            Eliminar Cuenta
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default ProfileMenu;
