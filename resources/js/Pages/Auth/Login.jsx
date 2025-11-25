import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import {Head, Link, router, useForm} from '@inertiajs/react';
import {XMarkIcon} from "@heroicons/react/24/outline";

export default function Login({status, canResetPassword}) {
    const {data, setData, post, processing, errors, reset} = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in"/>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <h1 className={"text-xl text-green-900 font-bold text-center"}>Iniciar Sesión</h1>
                <div>
                    <InputLabel htmlFor="email" value="Email"/>

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full outline-none"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2"/>
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Contraseña"/>

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full outline-none"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2"/>
                </div>


                <div className="mt-4 flex items-center justify-start">
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="rounded-md text-sm text-green-700"
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    )}
                </div>

                <a
                    href="#"
                    className="text-sm text-green-700 hover:underline cursor-pointer"
                    onClick={() => document.getElementById('my_modal_5').showModal()}
                >
                    ¿Olvidaste tu contraseña?
                </a>

                <div className={"flex justify-center my-4"}>

                    <PrimaryButton className="ms-2 w-full cursor-pointer" disabled={processing}>
                        Iniciar Sesion
                    </PrimaryButton>

                    <Link
                        href={route("register")}
                        className="block text-center ms-2 bg-transparent border border-green-800 text-green-800  px-4 py-2 text-xs font-semibold rounded-md w-full cursor-pointer"
                        disabled={processing}>
                        Registrarse
                    </Link>
                </div>
            </form>
            <dialog id="my_modal_5" className="modal">
                <div className="modal-box p-15">
                    <XMarkIcon className="absolute right-0 top-0 size-5 mr-5 mt-5 cursor-pointer"
                               onClick={() => document.getElementById("my_modal_5").close()}></XMarkIcon>
                    <h3 className="font-bold text-2xl text-center">Recuperar Contraseña</h3>
                    <p className="text-center text-lg">Ingresa tu correo para recuperar contraseña</p>
                    <div className="modal-action justify-center">
                        <form method="dialog" className="flex flex-col items-center gap-3">
                            <input
                                className="w-70 border border-gray-300 rounded-lg px-3 py-2 text-black placeholder:text-gray-600
                                focus:outline-none focus:ring-2 focus:ring-gray-700"
                                type="email"
                                placeholder="Ingresa tu correo"
                            />

                            <button className="btn border border-green-700 h-10 rounded-lg w-full">Enviar
                            </button>
                        </form>
                    </div>
                </div>
            </dialog>
        </GuestLayout>
    );
}
