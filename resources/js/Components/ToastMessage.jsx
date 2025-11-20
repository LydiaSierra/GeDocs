import React, {useEffect, useState} from 'react';
import {usePage} from "@inertiajs/react";

const ToastMessage = ({message}) => {
    const [show, setShow] = useState(false);
    const {pending} = usePage().props;


    useEffect(() => {
        if (pending) {
            setShow(true);

            const timeout = setInterval(()=>{
                setShow(false);
            }, 5000)

            return ()=> clearInterval(timeout)
        }
    }, [pending]);


    if (!show) return null;

    return (
        <div className={`toast toast-center toast-top transition-all duration-500 ${ show ? 'opacity-100' : 'opacity-0 '}`}>
            <div className="alert  bg-red-500 text-white font-bold">
                <span>{pending.message}</span>
            </div>
        </div>
    );
};

export default ToastMessage;
