import {Link, usePage} from '@inertiajs/react';
import {useEffect, useState} from "react";

export default function GuestLayout({children}) {

    const { props } = usePage();
    const pending = props.pending; // lo que mandamos desde redirect()->with('pending')
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (pending) {
            setShowModal(true);
        }
    }, [pending]);


    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2  items-center justify-items-center bg-gray-200 md:bg-white p-2 md:p-0 max-w-5xl m-auto">
            <div className={"flex justify-center my-2 md:hidden"}>
                <img src="/gedocs-logo.svg" alt=""/>
            </div>

            <div className={`bg-white w-full max-w-sm p-4 rounded-md shadow md:shadow-none  ${usePage().url === "/register" ? 'h-screen overflow-auto' : ''}`}>
                <div className={" justify-center my-2 hidden md:flex"}>
                    <img src="/gedocs-logo.svg" alt=""/>
                </div>
                {children}

            </div>
            <div className={"hidden md:inline-block"}>
                <img src="/images/imgLogin.png" alt=""/>
            </div>
        </div>
    );
}
