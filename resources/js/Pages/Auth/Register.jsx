import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { toast } from "sonner";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        type_document: "",
        document_number: "",
        name: "",
        email: "",
        role: "",
        technical_sheet: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();

        if (!data.type_document) {
            toast.error("Seleccione un tipo de documento");
            return;
        }

        if (!data.document_number) {
            toast.error("Ingrese el número de documento");
            return;
        }

        if (!data.name) {
            toast.error("Ingrese su nombre completo");
            return;
        }

        if (!data.email) {
            toast.error("Ingrese un email válido");
            return;
        }

        if (!data.role) {
            toast.error("Seleccione un rol");
            return;
        }

        if (data.role === "Aprendiz" && !data.technical_sheet) {
            toast.error("Seleccione su ficha");
            return;
        }

        if (data.password.length < 8) {
            toast.error("La contraseña debe tener mínimo 8 caracteres");
            return;
        }

        if (data.password !== data.password_confirmation) {
            toast.error("Las contraseñas no coinciden");
            return;
        }

        let toastId;

        post(route("register"), {
            onStart: () => {
                toastId = toast.loading("Registrando usuario");
            },
            onSuccess: () => {
                toast.success("Solicitud de Registro Enviada");
            },
            onError: () => {
                toast.error("No se pudo registrar el usuario");
            },
            onFinish: () => {
                reset("password", "password_confirmation");
                if (toastId) {
                    toast.dismiss(toastId);
                }
            },
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit}>
                <h1 className="text-2xl text-green-900 font-bold text-center mb-4">
                    Registrarse
                </h1>

                {/* Tipo de documento */}
                <div className="mt-4">
                    <InputLabel
                        htmlFor="type_document"
                        value="Tipo de documento"
                    />
                    <select
                        id="type_document"
                        name="type_document"
                        value={data.type_document}
                        onChange={(e) =>
                            setData("type_document", e.target.value)
                        }
                        className="mt-1 w-full border border-gray-500 rounded-md p-2"
                    >
                        <option value="" disabled>
                            Seleccione un tipo
                        </option>
                        <option value="CC">Cédula de Ciudadanía (CC)</option>
                        <option value="TI">Tarjeta de Identidad (TI)</option>
                        <option value="CE">Cédula de Extranjería (CE)</option>
                    </select>
                    <InputError
                        message={errors.type_document}
                        className="mt-2"
                    />
                </div>

                {/* Número de documento */}
                <div className="mt-4">
                    <InputLabel
                        htmlFor="document_number"
                        value="Número de documento"
                    />
                    <TextInput
                        id="document_number"
                        type="text"
                        name="document_number"
                        value={data.document_number}
                        className="mt-1 block w-full outline-none"
                        autoComplete="off"
                        onChange={(e) =>
                            setData("document_number", e.target.value)
                        }
                    />
                    <InputError
                        message={errors.document_number}
                        className="mt-2"
                    />
                </div>

                {/* Nombre */}
                <div className="mt-4">
                    <InputLabel htmlFor="name" value="Nombre completo" />
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full outline-none"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData("name", e.target.value)}
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                {/* Email */}
                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full outline-none"
                        autoComplete="username"
                        onChange={(e) => setData("email", e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                {/* Rol */}
                <div className="mt-4">
                    <InputLabel htmlFor="role" value="Rol" />
                    <select
                        id="role"
                        name="role"
                        value={data.role}
                        onChange={(e) => setData("role", e.target.value)}
                        className="mt-1 w-full border border-gray-500 rounded-md p-2"
                    >
                        <option value="" disabled>
                            Seleccione un rol
                        </option>
                        <option value="Aprendiz">Aprendiz</option>
                        <option value="Instructor">Instructor</option>
                    </select>
                    <InputError message={errors.role} className="mt-2" />
                </div>

                {data.role === "Aprendiz" && (
                    <div className="mt-4">
                        <InputLabel htmlFor="technical_sheet" value="Ficha" />
                        <select
                            id="technical_sheet"
                            name="technical_sheet"
                            value={data.technical_sheet}
                            onChange={(e) =>
                                setData("technical_sheet", e.target.value)
                            }
                            className="mt-1 w-full border border-gray-500 rounded-md p-2"
                        >
                            <option value="" disabled>
                                Seleccione su ficha
                            </option>
                            <option value="3002085">3002085</option>
                            <option value="3002087">3002087</option>
                        </select>
                        <InputError
                            message={errors.technical_sheet}
                            className="mt-2"
                        />
                    </div>
                )}

                {/* Contraseña */}
                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Contraseña" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full outline-none"
                        autoComplete="new-password"
                        onChange={(e) => setData("password", e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                {/* Confirmar contraseña */}
                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirmar contraseña"
                    />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full outline-none"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                    />
                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                {/* Botón */}
                <div className="mt-4 flex items-center justify-end">
                    <Link
                        href={route("login")}
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        ¿Ya estás registrado?
                    </Link>

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Registrarse
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
