import {
  FolderIcon,
  InboxIcon,
  PlusCircleIcon
} from "@heroicons/react/24/solid";
import NavLink from "../NavLink";
import { Link, usePage } from "@inertiajs/react";

const InboxIconEnv = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3" />
  </svg>
);

export default function Sidebar() {
    const { props } = usePage();
    const user = props.auth.user;

    const isAprendiz = user.roles?.some(role => role.name === "Aprendiz");

    const links = [
        { id: "inbox", href: "inbox", icon: InboxIcon},
        { id: "archive", href: "archive", icon: InboxIconEnv },
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
            <div className="md:hidden fixed bottom-0 left-0 w-full bg-primary flex justify-around items-center py-1 z-20">
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
