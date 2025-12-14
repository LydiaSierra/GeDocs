import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import { DashboardLayout } from "@/Layouts/DashboardLayout";
import ProfileLayout from "@/Layouts/ProfileLayout";
import { useState } from "react";

export default function Edit({ mustVerifyEmail, status }) {
    const [openObject, setOpenObject] = useState(false);
    const [openObject1, setOpenObject1] = useState(false);
    return (
        <div className="overflow-y">
            <ProfileLayout
                setOpenObject={setOpenObject}
                openObject={openObject}
                openObject1={openObject1}
                setOpenObject1={setOpenObject1}
            >
                <div className="flex-1 h-[calc(100vh-4rem)] overflow-y-auto overflow-x-hidden py-4 px-4v ">
                    <div className="mx-auto max-w-4xl w-full space-y-4">
                        <div className="bg-white p-5 shadow-sm rounded-lg ">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="max-w-xl"
                            />
                        </div>

                        {openObject && (
                            <div className="  bg-white p-4 shadow-sm rounded-lg">
                                <UpdatePasswordForm className="max-w-xl" />
                            </div>
                        )}
                        {openObject1 && (
                            <div className=" bg-white p-4 shadow-sm rounded-lg">
                                <DeleteUserForm className="max-w-xl" />
                            </div>
                        )}
                    </div>
                </div>
            </ProfileLayout>
        </div>
    );
}
