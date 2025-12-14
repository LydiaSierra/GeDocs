import React, { useEffect } from "react";

export default function ToastPdf({ show, onClose }) {

    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [show]);

    if (!show) return null;

    return (
        <div className="toast toast-top toast-end z-50">
            <div className="alert alert-success bg-primary text-white">
                <span> PDF generado correctamente! </span>
            </div>
        </div>
    );
}


   