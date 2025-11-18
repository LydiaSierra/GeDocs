import React, {useEffect, useState} from 'react';

const ToastMessage = ({message}) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (message) {
            setShow(true);

            const timeout = setInterval(()=>{
                setShow(false);
            }, 5000)

            return ()=> clearInterval(timeout)
        }
    }, [message]);


    if (!show) return null;

    return (
        <div className={`toast toast-center toast-top transition-all duration-500 ${ show ? 'opacity-100' : 'opacity-0 '}`}>
            <div className="alert  bg-red-500 text-white font-bold">
                <span>{message}</span>
            </div>
        </div>
    );
};

export default ToastMessage;
