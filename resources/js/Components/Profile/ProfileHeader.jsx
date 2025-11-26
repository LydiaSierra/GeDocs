import {BellIcon} from "@heroicons/react/24/outline";
import {Link, router, usePage} from "@inertiajs/react";
import { UserCircleIcon,AcademicCapIcon,ListBulletIcon } from "@heroicons/react/24/outline"
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { TrashIcon } from '@heroicons/react/24/outline';
export default function ProfileHeader() {
    const {props} = usePage();
    const user = props.auth.user;

    return (
        <header
            className="bg-white shadow-sm px-4 h-14 flex justify-between items-center fixed top-0 left-0 z-50 w-screen">

            {/* LEFT SIDE */}
            <div className="flex items-center gap-3">

                {/* MENU HAMBURGUESA - SOLO MOVIL */}
                <div className="dropdown lg:hidden">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current"> 
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path> </svg>
                    </div>

                    <ul
                        tabIndex="-1"
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-56 p-2 shadow">

                        {/* Perfil */}
                        <li>
                            <a>
                            <div className="flex flex-row items-center cursor-pointer gap-2 w-full text-[#010515] text-sm font-medium hover:underline">
                                <UserCircleIcon className="text-[#848484] w-5 h-5" />
                                Información de Perfil
                            </div>
                            </a>
                        </li>

                        {/* Usuarios */}
                        <li className="mt-1 mb-1">
                            <h1 className="self-start text-[14px] font-semibold text-[#848484]">
                            Usuarios
                            </h1>
                        </li>

                        <li>
                            <a>
                            <div className="flex flex-row items-center cursor-pointer gap-2 w-full text-[#010515] text-sm font-medium hover:underline">
                                <AcademicCapIcon className="text-[#848484] w-5 h-5" />
                                Aprendices
                            </div>
                            </a>
                        </li>

                        <li>
                            <a>
                            <div className="flex flex-row items-center cursor-pointer gap-2 w-full text-[#010515] text-sm font-medium hover:underline">
                                <ListBulletIcon className="text-[#848484] w-5 h-5" />
                                Instructores
                            </div>
                            </a>
                        </li>

                        {/* Solicitudes */}
                        <li className="mt-2 mb-1">
                            <h1 className="self-start text-[14px] font-semibold text-[#848484]">
                            Solicitudes
                            </h1>
                        </li>

                        <li>
                            <a>
                            <div className="flex flex-row items-center cursor-pointer gap-2 w-full text-[#010515] text-sm font-medium hover:underline">
                                <UserCircleIcon className="text-[#848484] w-5 h-5" />
                                Aprendices
                            </div>
                            </a>
                        </li>

                        <li>
                            <a>
                            <div className="flex flex-row items-center cursor-pointer gap-2 w-full text-[#010515] text-sm font-medium hover:underline">
                                <UserCircleIcon className="text-[#848484] w-5 h-5" />
                                Instructores
                            </div>
                            </a>
                        </li>

                        {/* Gestión Documental */}
                        <li className="mt-2 mb-1">
                            <h1 className="self-start text-[14px] font-semibold text-[#848484]">
                            Gestión Documental
                            </h1>
                        </li>

                        <li>
                            <a>
                            <div className="flex flex-row items-center cursor-pointer gap-2 w-full text-[#010515] text-sm font-medium hover:underline">
                                <UserCircleIcon className="text-[#848484] w-5 h-5" />
                                Dependencias
                            </div>
                            </a>
                        </li>

                        <li>
                            <a>
                            <div className="flex flex-row items-center cursor-pointer gap-2 w-full text-[#010515] text-sm font-medium hover:underline">
                                <UserCircleIcon className="text-[#848484] w-5 h-5" />
                                Series y Subseries
                            </div>
                            </a>
                        </li>

                        <li>
                            <a>
                            <div className="flex flex-row items-center cursor-pointer gap-2 w-full text-[#010515] text-sm font-medium hover:underline">
                                <UserCircleIcon className="text-[#848484] w-5 h-5" />
                                Secciones y Subsecciones
                            </div>
                            </a>
                        </li>

                        {/* Editar Perfil */}
                        <li className="mt-2 mb-1">
                            <h1 className="self-start text-[14px] font-semibold text-[#848484]">
                            Editar Perfil
                            </h1>
                        </li>

                        <li>
                            <a>
                            <div className="flex flex-row items-center cursor-pointer gap-2 w-full text-[#010515] text-sm font-medium hover:underline">
                                <PencilSquareIcon className="text-[#848484] w-5 h-5" />
                                Cambiar Contraseña
                            </div>
                            </a>
                        </li>

                        <li>
                            <a>
                            <div className="flex flex-row items-center cursor-pointer gap-2 w-full text-[#010515] text-sm font-medium hover:underline">
                                <TrashIcon className="text-[#848484] w-5 h-5" />
                                Eliminar Cuenta
                            </div>
                            </a>
                        </li>

                        </ul>

                </div>

                {/* LOGO */}
                <a href="/">
                    <img src="/gedocs-logo.svg" alt="gedocs logo" className="h-8"/>
                </a>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex gap-4 items-center h-full">

                {/* NOTIFICATION ICON */}
                <Link href={route("notifications.index")}>
                    <BellIcon className="w-8 cursor-pointer"/>
                </Link>

                {/* USER DROPDOWN */}
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button"
                         className="cursor-pointer rounded-md gap-3 flex items-center">
                        <img
                            className="w-10 rounded-full"
                            alt="profile pic"
                            src="/images/girl-pic.jpg"
                        />
                    </div>

                    <ul tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-max p-2 shadow overflow-hidden">

                        <div className="border-b border-gray-500 p-2 mb-2">
                            <div className="flex justify-between items-center mb-2 gap-8">
                                <p>{user?.name}</p>
                                <p className="text-gray-500 text-xs">{user?.role}</p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">{user?.email}</p>
                            </div>
                        </div>

                        <li>
                            <a>Settings</a>
                        </li>

                        <li>
                            <button
                                onClick={() => router.post("/logout")}
                            >
                                Cerrar sesión
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    );
}
