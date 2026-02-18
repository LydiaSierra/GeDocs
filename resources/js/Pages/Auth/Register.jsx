import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { toast } from "sonner";

export default function Register({ sheets }) {
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

        if (!data.type_document)
            return toast.error("Seleccione un tipo de documento");
        if (!data.document_number)
            return toast.error("Ingrese el número de documento");
        if (!data.name) return toast.error("Ingrese su nombre completo");
        if (!data.email) return toast.error("Ingrese un email válido");
        if (!data.role) return toast.error("Seleccione un rol");

        if (data.role === "Aprendiz" && !data.technical_sheet) {
            return toast.error("Seleccione su ficha");
        }

        if (data.password.length < 8) {
            return toast.error("La contraseña debe tener mínimo 8 caracteres");
        }

        if (data.password !== data.password_confirmation) {
            return toast.error("Las contraseñas no coinciden");
        }

        let toastId;

        post(route("register"), {
            onStart: () => {
                toastId = toast.loading("Registrando usuario...");
            },
            onSuccess: () => {
                toast.success("Solicitud de Registro Enviada");
            },
            onError: () => {
                toast.error("No se pudo registrar el usuario");
            },
            onFinish: () => {
                reset("password", "password_confirmation");
                if (toastId) toast.dismiss(toastId);
            },
        });
    };
console.log("Sheets:", sheets);
    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit}>
                <h1 className="text-2xl text-green-900 font-bold text-center mb-4">
                    Registrarse
                </h1>

                {/* Tipo documento */}
                <div className="mt-4">
                    <InputLabel
                        htmlFor="type_document"
                        value="Tipo de documento"
                    />
                    <select
                        id="type_document"
                        value={data.type_document}
                        onChange={(e) =>
                            setData("type_document", e.target.value)
                        }
                        className="mt-1 w-full border border-gray-500 rounded-md p-2"
                    >
                        <option value="">Seleccione un tipo</option>
                        <option value="CC">Cédula de Ciudadanía</option>
                        <option value="TI">Tarjeta de Identidad</option>
                        <option value="CE">Cédula de Extranjería</option>
                    </select>
                    <InputError
                        message={errors.type_document}
                        className="mt-2"
                    />
                </div>

                {/* Documento */}
                <div className="mt-4">
                    <InputLabel
                        htmlFor="document_number"
                        value="Número de documento"
                    />
                    <TextInput
                        id="document_number"
                        value={data.document_number}
                        className="mt-1 block w-full"
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
                        value={data.name}
                        className="mt-1 block w-full"
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
                        value={data.email}
                        className="mt-1 block w-full"
                        onChange={(e) => setData("email", e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                {/* Rol */}
                <div className="mt-4">
                    <InputLabel htmlFor="role" value="Rol" />
                    <select
                        id="role"
                        value={data.role}
                        onChange={(e) => setData("role", e.target.value)}
                        className="mt-1 w-full border border-gray-500 rounded-md p-2"
                    >
                        <option value="">Seleccione un rol</option>
                        <option value="Aprendiz">Aprendiz</option>
                        <option value="Instructor">Instructor</option>
                    </select>
                    <InputError message={errors.role} className="mt-2" />
                </div>

                {/* Ficha */}
                {data.role === "Aprendiz" && (
                    <div className="mt-4">
                        <InputLabel htmlFor="technical_sheet" value="Ficha" />
                        <select
                            id="technical_sheet"
                            value={data.technical_sheet}
                            onChange={(e) =>
                                setData("technical_sheet", e.target.value)
                            }
                            className="mt-1 w-full border border-gray-500 rounded-md p-2"
                        >
                            <option value="">Seleccione su ficha</option>
                            {sheets.map((sheet) => (
                                <option key={sheet.id} value={sheet.number}>
                                    {sheet.number}
                                </option>
                            ))}
                        </select>
                        <InputError
                            message={errors.technical_sheet}
                            className="mt-2"
                        />
                    </div>
                )}

                {/* Password */}
                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Contraseña" />
                    <TextInput
                        id="password"
                        type="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        onChange={(e) => setData("password", e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                {/* Confirm */}
                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirmar contraseña"
                    />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                    />
                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                {/* Actions */}
                <div className="mt-6 flex items-center justify-end gap-4">
                    <Link
                        href={route("login")}
                        className="text-sm text-gray-600 underline hover:text-gray-900"
                    >
                        ¿Ya estás registrado?
                    </Link>

                    <PrimaryButton disabled={processing}>
                        Registrarse
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
