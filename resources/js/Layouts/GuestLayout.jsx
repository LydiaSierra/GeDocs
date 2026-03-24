import {Link, usePage} from '@inertiajs/react';
import {useEffect, useState} from "react";
import ToastMessage from "@/Components/ToastMessage.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import {XMarkIcon} from "@heroicons/react/24/outline";

export default function GuestLayout({children}) {


    return (
        <div
            className="min-h-screen flex flex-col justify-center gap-6 md:grid md:grid-cols-2 items-center justify-items-center bg-gray-200 md:bg-white p-4 md:p-0 max-w-5xl m-auto">
            <div className={"flex justify-center md:hidden"}>
                <img src="/gedocs-logo.svg" alt=""/>
            </div>

            <div
                className={`bg-white w-full max-w-sm p-4 rounded-md shadow md:shadow-none  ${usePage().url === "/register" ? 'h-screen overflow-auto' : ''}`}>
                <div className={" justify-center my-2 hidden md:flex"}>
                    <img src="/gedocs-logo.svg" alt=""/>
                </div>
                {children}

            </div>
            <div className={"hidden md:inline-block"}>
                <img src="/images/OBJECTS.svg" alt=""/>
            </div>
            <ToastMessage/>
        </div>
    );
}
