
import { ArchiveBoxIcon, FolderIcon, InboxIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import NavLink from "../NavLink";
import {Link, usePage} from "@inertiajs/react";

export default function Sidebar() {

    const { props } = usePage();
    const user = props.auth.user;

    const links = [
        { id: "inbox", href: "inbox", icon: InboxIcon },
        { id: "archive", href: "archive", icon: ArchiveBoxIcon},
        { id: "explorer", href: "explorer", icon: FolderIcon },
    ];

    return (
        <>

            <aside className="hidden md:flex h-screen px-2 bg-primary flex-col justify-between items-center pt-16 pb-4">
                <div className="flex flex-col items-center gap-3">
                    {links.map(link => (
                            <NavLink
                                key={link.id}
                                href={route(link.href)}
                                active={route().current(link.href)}
                            >
                                <link.icon className="size-10" />
                            </NavLink>
                        ))}


                </div>
                <Link href="/form" className="hover:cursor-pointer rounded-md">
                    <PlusCircleIcon className="size-10 fill-white" />
                </Link>

            </aside>


            <div className="md:hidden fixed bottom-0 left-0 w-full bg-primary flex justify-around items-center py-2 z-50">
                {links.map((link) => {
                    return (
                        <NavLink
                            key={link.id}
                            href={route(link.href)}
                            active={route().current(link.href)}
                        >
                            <link.icon className="size-8" />
                        </NavLink>
                    );
                })}


            </div>
        </>
    );
}
