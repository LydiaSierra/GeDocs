import {
  ArchiveBoxIcon,
  FolderIcon,
  InboxIcon,
  PlusCircleIcon
} from "@heroicons/react/24/solid";
import NavLink from "../NavLink";
import { Link, usePage } from "@inertiajs/react";

export default function Sidebar() {
    const { props } = usePage();
    const user = props.auth.user;

    const isAprendiz = user.roles?.some(role => role.name === "Aprendiz");

    const links = [
        { id: "inbox", href: "inbox", icon: InboxIcon, roles: ["Admin", "Instructor"] },
        { id: "archive", href: "archive", icon: ArchiveBoxIcon },
        { id: "explorer", href: "explorer", icon: FolderIcon },
    ];

    const filteredLinks = links.filter(link => {
        if (!link.roles) return true;
        return !isAprendiz;
    });

    return (
        <>
            {/* Desktop */}
            <aside className="hidden md:flex h-screen px-2 bg-primary flex-col justify-between items-center pt-16 pb-4">
                <div className="flex flex-col items-center gap-3">
                    {filteredLinks.map(link => (
                        <NavLink
                            key={link.id}
                            href={route(link.href)}
                            active={route().current(link.href)}
                        >
                            <link.icon className="size-10" />
                        </NavLink>
                    ))}
                </div>

                <Link href={route('form')} className="hover:cursor-pointer rounded-md">
                    <PlusCircleIcon className="size-10 fill-white" />
                </Link>
            </aside>

            {/* Mobile */}
            <div className="md:hidden fixed bottom-0 left-0 w-full bg-primary flex justify-around items-center py-1 z-50">
                {filteredLinks.map(link => (
                    <NavLink
                        key={link.id}
                        href={route(link.href)}
                        active={route().current(link.href)}
                    >
                        <link.icon className="size-8" />
                    </NavLink>
                ))}

                <Link href={route('form')} className="hover:cursor-pointer rounded-md">
                    <PlusCircleIcon className="size-8 fill-white" />
                </Link>
            </div>
        </>
    );
}
