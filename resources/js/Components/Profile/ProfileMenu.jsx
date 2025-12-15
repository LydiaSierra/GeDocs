import {
    UserCircleIcon,
    AcademicCapIcon,
    ListBulletIcon,
} from "@heroicons/react/24/outline";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

function ProfileMenu({
    setOpenObject,
    openObject,
    setOpenObject1,
    openObject1,
}) {
    const showEditProfile = route().current("profile.edit");

    return (
        <div className="w-90 bg-white mt-18 rounded-lg flex flex-col items-center gap-1 overflow-hidden">
            {/* PERFIL */}
            <div className="w-full flex flex-col items-start gap-5 p-2">
                <div className="flex flex-row items-center cursor-pointer gap-2 w-full text-[#010515] text-lg font-medium hover:underline">
                    <UserCircleIcon className="text-[#848484] w-7 h-7" />
                    <a href={route("profile.edit")}>Informacion de Perfil</a>
                </div>
            </div>

            {/* USUARIOS */}
            <div className="w-full flex flex-col items-start gap-5 p-2">
                <h1 className="self-start text-[20px] text-[#848484]">
                    Usuarios
                </h1>

                <div className="flex flex-col gap-2">
                    <a href={route("aprendiz")}>
                        <div className="flex items-center gap-3 text-lg font-medium hover:underline cursor-pointer">
                            <AcademicCapIcon className="w-7 h-7 text-[#848484]" />
                            Aprendices
                        </div>
                    </a>

                    <a href={route("instructor")}>
                        <div className="flex items-center gap-3 text-lg font-medium hover:underline cursor-pointer">
                            <ListBulletIcon className="w-7 h-7 text-[#848484]" />
                            Instructores
                        </div>
                    </a>

                    <a href={route("sheets")}>
                        <div className="flex items-center gap-3 text-lg font-medium hover:underline cursor-pointer">
                            <UserCircleIcon className="w-7 h-7 text-[#848484]" />
                            Fichas
                        </div>
                    </a>
                </div>
            </div>

            {/* SOLICITUDES */}
            <div className="w-full flex flex-col items-start gap-5 p-2">
                <h1 className="self-start text-[20px] text-[#848484]">
                    Solicitudes
                </h1>

                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 text-lg font-medium hover:underline cursor-pointer">
                        <UserCircleIcon className="w-7 h-7 text-[#848484]" />
                        Aprendices
                    </div>

                    <div className="flex items-center gap-3 text-lg font-medium hover:underline cursor-pointer">
                        <UserCircleIcon className="w-7 h-7 text-[#848484]" />
                        Instructores
                    </div>
                </div>
            </div>

            {/* GESTIÓN DOCUMENTAL */}
            <div className="w-full flex flex-col items-start gap-5 p-2">
                <h1 className="self-start text-[20px] text-[#848484]">
                    Gestion Documental
                </h1>

                <div className="flex flex-col gap-2">
                    <a href={route("dependencies")}>
                        <div className="flex items-center gap-2 text-lg font-medium hover:underline cursor-pointer">
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

                    {/* 👉 EDITAR PERFIL (SOLO profile.edit) */}
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

                            <div
                                className="flex items-center gap-2 text-lg font-medium hover:underline cursor-pointer"
                                onClick={() => setOpenObject1((prev) => !prev)}
                            >
                                <TrashIcon className="w-7 h-7 text-[#848484]" />
                                Eliminar Cuenta
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProfileMenu;
