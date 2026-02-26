import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Transition } from "@headlessui/react";
import { Link, useForm, usePage } from "@inertiajs/react";

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = "",
}) {
    const {
        props: {
            auth: { user },
        },
    } = usePage();

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route("profile.update"));
    };

    return (
        <section className={`w-full px-4 sm:px-6 lg:px-8 ${className}`}>
            <header className="max-w-2xl mx-auto">
                <h2 className="text-lg sm:text-xl font-medium text-gray-900">
                    Información de Perfil
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Actualice la información del perfil y la dirección de correo
                    electrónico de su cuenta.
                </p>
            </header>

            <form
                onSubmit={submit}
                className="mt-6 space-y-6 w-full max-w-2xl mx-auto"
            >
                <div>
                    <InputLabel htmlFor="name" value="Nombre" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        // value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Correo Electronico   " />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        onChange={(e) => setData("email", e.target.value)}
                        autoComplete="Nombre de usuario"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && !user.email_verified_at && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800">
                            Su dirección de correo electrónico no está
                            verificada.{" "}
                            <Link
                                href={route("verification.send")}
                                method="post"
                                as="button"
                                className="underline text-sm text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-md"
                            >
                                Haga clic aquí para volver a enviar el correo
                                electrónico de verificación.
                            </Link>
                        </p>

                        {status === "verification-link-sent" && (
                            <p className="mt-2 text-sm font-medium text-green-600">
                                Se ha enviado un nuevo enlace de verificación a
                                tu dirección de correo electrónico.
                            </p>
                        )}
                    </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <PrimaryButton
                        disabled={processing}
                        className="w-full sm:w-auto"
                    >
                        Guardar
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600 text-center sm:text-left">
                            Guardado.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
