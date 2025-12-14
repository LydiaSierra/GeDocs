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
        <div className="bg-gray-100 min-h-screen">
            {/* HEADER */}
            <ProfileHeader
                setOpenObject={setOpenObject}
                openObject={openObject}
                setOpenObject1={setOpenObject1}
                openObject1={openObject1}
            />

            <div className="flex flex-col md:flex-row min-h-screen">
                <aside className="hidden md:flex w-[26%] p-2">
                    <ProfileMenu
                        setOpenObject={setOpenObject}
                        openObject={openObject}
                        setOpenObject1={setOpenObject1}
                        openObject1={openObject1}
                    />
                </aside>

                <main className="flex-1 pt-16 px-4 overflow-y-auto md:h-[calc(100vh-4rem)] -ml-2">
                    <div className="flex flex-col md:flex-row items-center md:items-start md:gap-6">
                        {/* PROFILE SIDEBAR */}
                        <div className="w-full md:w-auto flex justify-center md:justify-start">
                            <ProfileSidebar />
                        </div>

                        <div className="w-full max-w-5xl">{children}</div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ProfileLayout;
