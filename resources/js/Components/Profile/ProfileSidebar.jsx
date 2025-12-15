import api from "@/lib/axios";
import { PencilIcon, UserIcon } from "@heroicons/react/24/outline";
import { router, usePage } from "@inertiajs/react";
import { useState } from "react";
import { toast } from "sonner";

const ProfileSidebar = ({ className = "" }) => {
    const {
        props: {
            auth: { user },
        },
    } = usePage();
    const [loadingPhoto, setLoadingPhoto] = useState(true)


    const UploatPhoto = async (e) => {
        try {
            let toastId;
            toastId =  toast.loading(user.profile_photo ? "Actualizando Imagen" : "Subiendo imagen");
            const file = e.target.files[0]
            if (!file) return;

            const form = new FormData();
            form.append("profile_photo", file);

            await api.post("/api/profile/photo", form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            toast.success(user.profile_photo ? "Foto actualizada" : "Foto subida")
            toast.dismiss(toastId);
            router.reload({ only: ["auth"] });
        } catch (err) {
            toast.error(err?.response?.data?.message || err?.message || err || "Error al hacer la peticion")
            throw new Error(err?.response?.data?.message || err?.message || err || "Error al hacer la peticion");

        } finally {
            setLoadingPhoto(false)
        }

    }
    return (
        <aside
            className={`h-full  flex flex-col items-center text-gray-800 ${className}`}
        >
            <h1 className="text-lg font-semibold text-black mb-4 mt-2">
                Información de Usuario
            </h1>

            <div className="w-70 bg-white rounded-2xl p-4 flex flex-col items-center shadow">
                <div className="my-3 relative">
                    {loadingPhoto && (
                        <div className="skeleton h-40 w-40 rounded-xl absolute inset-0" />
                    )}

                    {user.profile_photo ? (
                        <img
                            src={user.profile_photo}
                            className={` ${loadingPhoto ? "opacity-0 w-40 h-40" : "opacity-100  w-full"
                                }`}
                            onLoad={() => setLoadingPhoto(false)}
                            onError={() => setLoadingPhoto(false)}
                        />
                    ) : (
                        <UserIcon className="h-40 w-40 text-gray-400" />
                    )}



                    <div enctype="multipart/form-data">
                        <label htmlFor="photo" className="absolute z-10 -bottom-5 right-0 p-2 bg-primary text-white rounded-lg cursor-pointer" >
                            <PencilIcon className="size-6 " />
                        </label>
                        <input type="file" id="photo" className="hidden" name="profile_photo" accept="image/*" onChange={UploatPhoto} />
                    </div>
                </div>



                <h2 className="text-md font-medium">{user.name}</h2>

                <p className="text-sm text-gray-500">{user.email}</p>
            </div>
        </aside>
    );
};

export default ProfileSidebar;
