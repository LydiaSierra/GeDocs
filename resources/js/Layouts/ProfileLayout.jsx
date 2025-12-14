import ProfileHeader from "@/Components/Profile/ProfileHeader.jsx";
import ProfileMenu from "@/Components/Profile/ProfileMenu.jsx";
import ProfileSidebar from "@/Components/Profile/ProfileSidebar.jsx";

const ProfileLayout = ({
    children,
    setOpenObject,
    openObject,
    setOpenObject1,
    openObject1,
}) => {
    return (
        <div className="bg-gray-100 h-screen overflow-hidden">
            {/* HEADER */}
            <ProfileHeader
                setOpenObject={setOpenObject}
                openObject={openObject}
                setOpenObject1={setOpenObject1}
                openObject1={openObject1}
            />

            {/* CONTENEDOR PRINCIPAL */}
            <div className="flex flex-col md:flex-row h-full">
                {/* MENU LATERAL (desktop) */}
                <aside className="hidden md:flex w-[26%] p-2">
                    <ProfileMenu
                        setOpenObject={setOpenObject}
                        openObject={openObject}
                        setOpenObject1={setOpenObject1}
                        openObject1={openObject1}
                    />
                </aside>

                {/* CONTENIDO */}
                <main className="flex-1 pt-16 px-4 overflow-hidden">
                    <div className="flex flex-col md:flex-row items-center md:items-start md:gap-6">
                        {/* PROFILE SIDEBAR */}
                        <div className="w-full md:w-auto flex justify-center md:justify-start">
                            <ProfileSidebar />
                        </div>

                        {/* MAIN CONTENT */}
                        <div className="w-full max-w-5xl">{children}</div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ProfileLayout;
