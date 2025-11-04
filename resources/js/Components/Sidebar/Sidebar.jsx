
import { ArchiveBoxIcon, FolderIcon, InboxIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import NavLink from "../NavLink";

export default function Sidebar() {

    const links = [
        { id: "inbox", href: "inbox", icon: InboxIcon },
        { id: "archive", href: "archive", icon: ArchiveBoxIcon },
        { id: "explorer", href: "explorer", icon: FolderIcon },
    ];

    return (
        <>

            <div className="hidden md:flex h-[calc(100dvh-80px)] w-20 bg-green-800 flex-col justify-between items-center py-5">
                <div className="flex flex-col items-center gap-3">
                    {links.map((link) => {
                        return (
                            <NavLink
                                key={link.id}
                                href={route(link.href)}
                                active={route().current(link.href)}
                                
                            >
                                <link.icon className="size-14" />
                            </NavLink>
                        );
                    })}
                </div>


            </div>


            <div className="md:hidden fixed bottom-0 left-0 w-full bg-senaGreen flex justify-around items-center py-2 z-50">
                {links.map((link) => {
                    return (
                        <NavLink
                            key={link.id}
                            href={route(link.href)}
                            active={route().current(link.href)}
                        >
                            <link.icon className="size-14 fill-white" />
                        </NavLink>
                    );
                })}

                {/* <Link href="/form" className="hover:cursor-pointer rounded-md">
                    <PlusCircleIcon className="size-12 fill-white" />
                </Link> */}
            </div>
        </>
    );
}
