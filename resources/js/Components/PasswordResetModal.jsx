import {XMarkIcon} from "@heroicons/react/24/outline";
import {useEffect, useState} from "react";
import {useForm} from '@inertiajs/react';

export default function PasswordResetModal() {

    const [showError, setShowError] = useState(false);

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        email: '',
    });

    const submitReset = (e) => {
        e.preventDefault();

        post(route('password.email'), {
            onSuccess: () => {
                document.getElementById("reset_modal").close();
                }
        });
    };

    useEffect(() => {
        if (errors.email) {
            setShowError(true);

            const timer = setTimeout(() => {
                setShowError(false);
            }, 3000); // hides after 3 seconds

            return () => clearTimeout(timer);
        }
    }, [errors]);


    return (
        <dialog id="reset_modal" className="modal">
            {showError && (
                <div className="toast toast-top toast-center">
                    <div className="alert alert-error">
                        <span>{errors.email}</span>
                    </div>
                </div>
            )}
            <div className="modal-box px-15 py-10">
                <XMarkIcon className="absolute right-0 top-0 size-5 mr-5 mt-5 cursor-pointer"
                           onClick={() => document.getElementById("reset_modal").close()}></XMarkIcon>
                <h3 className="font-bold text-2xl text-center">Recuperar Contraseña</h3>
                <p className="text-center text-lg">Ingresa tu correo para recuperar contraseña</p>
                {recentlySuccessful && (
                    <div className="mb-4 text-primary text-sm">
                        ¡Hemos enviado un enlace de recuperación a tu correo!
                    </div>
                )}
                <div className="modal-action justify-center">
                    <form onSubmit={submitReset} method="dialog" className="w-full flex flex-col items-center gap-3">
                        <input
                            className=" w-full border border-gray-300 rounded-lg px-3 py-3 text-black placeholder:text-gray-600
                                focus:outline-none focus:ring-2 focus:ring-gray-700"
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            placeholder="Ingresa tu correo"
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <button className="btn border text-white bg-primary text-lg py-5 rounded-lg w-full">Enviar</button>
                        <button onClick={() => {document.getElementById("reset_modal").close();}} className="btn border text-primary bg-white border-primary text-lg py-5 rounded-lg w-full">Cerrar</button>
                    </form>
                </div>
            </div>
        </dialog>
    )
}
