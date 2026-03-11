import {
    AcademicCapIcon,
    BellIcon,
    BuildingOffice2Icon,
    DocumentTextIcon,
    ListBulletIcon,
    UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Link, usePage } from "@inertiajs/react";
import { useContext } from "react";
import { UserContext } from "@/context/UserContext/UserContext";

function SidebarItem({ href, icon: Icon, label, active, onClick }) {
    return (
        <Link href={href} onClick={onClick}>
            <div
                className={`flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-colors md:text-base ${
                    active
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-700 hover:bg-slate-50"
                }`}
            >
                <Icon className="h-6 w-6 text-[#848484] md:h-7 md:w-7" />
                {label}
            </div>
        </Link>
    );
}

export default function SettingsSidebar() {
    const { url, props } = usePage();
    const { auth } = props;
    const userRole = auth.user.roles?.[0]?.name;
    const { setContent } = useContext(UserContext);

    const showUserManagement = userRole === "Admin" || userRole === "Instructor";
    const isAdmin = userRole === "Admin";

    return (
        <nav className="flex w-full flex-col gap-5 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex w-full flex-col items-start gap-3 md:gap-4">
                <SidebarItem
                    href={route("profile.edit")}
                    icon={UserCircleIcon}
                    label="Informacion de Perfil"
                    active={url === "/profile"}
                />
            </div>

            {showUserManagement && (
                <div className="flex w-full flex-col items-start gap-3 md:gap-4">
                    <h1 className="text-base font-semibold text-slate-500 md:text-lg lg:text-xl">
                        Usuarios
                    </h1>

                    <div className="flex flex-col gap-2 md:gap-3">
                        <SidebarItem
                            href={route("aprendiz")}
                            icon={AcademicCapIcon}
                            label="Aprendices"
                            active={url === "/users/aprendiz"}
                            onClick={() => setContent?.("Aprendiz")}
                        />

                        {isAdmin && (
                            <SidebarItem
                                href={route("instructor")}
                                icon={ListBulletIcon}
                                label="Instructores"
                                active={url === "/users/instructor"}
                                onClick={() => setContent?.("Instructor")}
                            />
                        )}

                        {isAdmin && (
                            <SidebarItem
                                href={route("sheets")}
                                icon={DocumentTextIcon}
                                label="Fichas"
                                active={url === "/sheets"}
                            />
                        )}
                    </div>
                </div>
            )}

            {showUserManagement && (
                <div className="flex w-full flex-col items-start gap-3 md:gap-4">
                    <h1 className="text-base font-semibold text-slate-500 md:text-lg lg:text-xl">
                        Solicitudes
                    </h1>

                    <div className="flex flex-col gap-2 md:gap-3">
                        <SidebarItem
                            href={route("notifications.index")}
                            icon={BellIcon}
                            label="Solicitudes"
                            active={url === "/notifications"}
                        />
                    </div>
                </div>
            )}

            <div className="flex w-full flex-col items-start gap-3 md:gap-4">
                <h1 className="text-base font-semibold text-slate-500 md:text-lg lg:text-xl">
                    Gestion Documental
                </h1>

                <div className="flex flex-col gap-2 md:gap-3">
                    <SidebarItem
                        href={route("dependencies")}
                        icon={BuildingOffice2Icon}
                        label="Dependencias"
                        active={url === "/dependencies"}
                    />
                </div>
            </div>
        </nav>
    );
}