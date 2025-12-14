import { usePage } from "@inertiajs/react";

const ProfileSidebar = ({ className = "" }) => {
    const {
        props: {
            auth: { user },
        },
    } = usePage();

    return (
        <aside
            className={`h-full flex flex-col items-center text-gray-800 ${className}`}
        >
            <h1 className="text-lg font-semibold text-black mb-4 mt-2">
                Información de Usuario
            </h1>

            <div className="w-72 bg-white rounded-2xl p-4 flex flex-col items-center shadow mt:2">
                <img
                    src="/images/girl-pic.jpg"
                    alt="Profile picture"
                    className="w-48 h-48 object-cover rounded-2xl mb-4"
                />

                <h2 className="text-md font-medium">{user.name}</h2>

                <p className="text-sm text-gray-500">{user.email}</p>
            </div>
        </aside>
    );
};

export default ProfileSidebar;
