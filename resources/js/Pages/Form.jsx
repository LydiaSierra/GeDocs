import { CheckCircleIcon, PaperClipIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import axios from "axios";
import { Link, router, usePage } from "@inertiajs/react";
export default function Form() {
    const [toasts, setToasts] = useState([]);

    const addToast = (type, message) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, type, message }]);

        // auto remove after 4s
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    };

    const resetForm = () => {
        setFormData({
            document_type: "CC",
            document: "",
            sender_name: "",
            email: "",
            affair: "",
            description: "",
            request_type: "Peticion",
            number: "",
            attachments: [],
        });

        setSubmitted(false);
    };

    const [submitted, setSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        document_type: "CC",
        document: "",
        sender_name: "",
        email: "",
        affair: "",
        description: "",
        request_type: "Peticion",
        number: "",
        attachments: [],
    });

    const formDataHandler = (e) => {
        const { name, value, type, files } = e.target;

        if (name === "document" && !/^\d*$/.test(value)) return;
        if (name === "number" && !/^\d*$/.test(value)) return;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "file" ? Array.from(files) : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();

        // Append normal fields
        Object.entries(formData).forEach(([key, value]) => {
            if (key === "attachments") {
                value.forEach((file) => {
                    data.append("attachments[]", file);
                });
            } else if (value !== "" && value !== null) {
                data.append(key, value);
            }
        });

        try {
            const response = await axios.post(
                "/api/pqrs", // adjust route
                data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setSubmitted(true);
            addToast("success", "PQRS enviada correctamente");
        } catch (error) {
            if (error.response?.status === 422) {
                const validationErrors = error.response.data.errors;

                Object.values(validationErrors).forEach((messages) => {
                    messages.forEach((msg) => addToast("error", msg));
                });
            } else if (error.response?.data?.error) {
                addToast("error", error.response.data.error);
            } else {
                addToast("error", "Ocurrió un error inesperado");
            }
        }
    };

    if (submitted) {
        return (
            <div className="bg-senaGray min-h-screen flex items-center justify-center">
                <div className="bg-white rounded-lg p-10 w-full max-w-lg text-center shadow-md">
                    <CheckCircleIcon className="w-20 h-20 text-primary mx-auto mb-4" />

                    <h1 className="text-2xl font-bold text-senaDarkGreen mb-2">
                        ¡PQRS enviada con éxito!
                    </h1>

                    <p className="text-neutral mb-6">
                        Hemos recibido tu solicitud correctamente. Nuestro
                        equipo la revisará y te dará respuesta dentro de los
                        tiempos establecidos.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={resetForm}
                            className="btn bg-primary text-white px-6"
                        >
                            Enviar otra PQRS
                        </button>

                        <a
                            href="/"
                            className="btn btn-outline outline-primary text-primary px-6"
                        >
                            Volver al inicio
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="toast toast-top toast-end z-50">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`alert ${
                            toast.type === "success"
                                ? "alert-success"
                                : "alert-error"
                        }`}
                    >
                        <span>{toast.message}</span>
                    </div>
                ))}
            </div>
            <div className="bg-senaGray min-h-screen flex flex-col">
                <div className="flex flex-1 justify-center">
                    <div className="flex flex-col items-center bg-white m-5 rounded-lg p-5 w-full max-w-6xl">
                        <div className="absolute top-4 left-4 cursor-pointer hover:bg-green-600 rounded-full h-9 w-9 justify-center items-center hover:text-white">
                            <Link href={route("inbox")}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="size-6 text-senaDarkGreen items-center w-8 ml-0.5 mt-1.5 hover:text-white"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </Link>
                        </div>

                        <h1 className="font-bold text-2xl text-senaDarkGreen text-center mb-4">
                            Diligenciar PQRS
                        </h1>

                        <form
                            className="w-full flex flex-col items-center"
                            onSubmit={handleSubmit}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-3 w-full md:w-3/5">
                                <div>
                                    <label
                                        className="text-md font-light text-gray-600"
                                        htmlFor="sender_name"
                                    >
                                        Nombre Completo
                                    </label>
                                    <input
                                        name="sender_name"
                                        id="sender_name"
                                        type="text"
                                        className="input w-full"
                                        value={formData.sender_name}
                                        onChange={formDataHandler}
                                    />
                                </div>
                                <div>
                                    <label
                                        className="text-md font-light text-gray-600"
                                        htmlFor="number"
                                    >
                                        Número de Ficha
                                    </label>
                                    <input
                                        name="number"
                                        id="number"
                                        type="text"
                                        className="input w-full"
                                        value={formData.number}
                                        onChange={formDataHandler}
                                    />
                                </div>
                                <div>
                                    <label
                                        className="text-md font-light text-gray-600"
                                        htmlFor="document_type"
                                    >
                                        Tipo de Documento
                                    </label>
                                    <select
                                        name="document_type"
                                        id="document_type"
                                        className="select w-full"
                                        value={formData.document_type}
                                        onChange={formDataHandler}
                                    >
                                        <option>CC</option>
                                        <option>TI</option>
                                        <option>CE</option>
                                    </select>
                                </div>
                                <div>
                                    <label
                                        className="text-md font-light text-gray-600"
                                        htmlFor="document"
                                    >
                                        Número de Documento
                                    </label>
                                    <input
                                        name="document"
                                        id="document"
                                        type="text"
                                        className="input w-full"
                                        value={formData.document}
                                        onChange={formDataHandler}
                                    />
                                </div>
                                <div>
                                    <label
                                        className="text-md font-light text-gray-600"
                                        htmlFor="email"
                                    >
                                        Correo Electrónico
                                    </label>
                                    <input
                                        name="email"
                                        id="email"
                                        type="email"
                                        className="input w-full"
                                        value={formData.email}
                                        onChange={formDataHandler}
                                    />
                                </div>
                                <div>
                                    <label
                                        className="text-md font-light text-gray-600"
                                        htmlFor="request_type"
                                    >
                                        Tipo de Solicitud
                                    </label>
                                    <select
                                        name="request_type"
                                        id="request_type"
                                        className="select w-full"
                                        value={formData.request_type}
                                        onChange={formDataHandler}
                                    >
                                        <option>Peticion</option>
                                        <option>Queja</option>
                                        <option>Reclamo</option>
                                        <option>Sugerencia</option>
                                    </select>
                                </div>
                            </div>

                            <div className="w-full md:w-3/5">
                                <label
                                    className="text-md font-light text-gray-600"
                                    htmlFor="affair"
                                >
                                    Asunto
                                </label>
                                <input
                                    name="affair"
                                    id="affair"
                                    type="text"
                                    className="input w-full"
                                    value={formData.affair}
                                    onChange={formDataHandler}
                                />
                            </div>

                            <div className="w-full md:w-3/5 my-3">
                                <label
                                    className="text-md font-light text-gray-600"
                                    htmlFor="description"
                                >
                                    Descripción de la solicitud
                                </label>
                                <textarea
                                    name="description"
                                    id="description"
                                    className="textarea w-full my-2"
                                    placeholder="Escribe aquí tu solicitud"
                                    rows="5"
                                    value={formData.description}
                                    maxLength={1000}
                                    onChange={formDataHandler}
                                ></textarea>
                                <small
                                    style={{
                                        display: "block",
                                        textAlign: "right",
                                        color:
                                            formData.description.length >
                                            1000 * 0.9
                                                ? "#d97706"
                                                : "#6b7280",
                                    }}
                                >
                                    {1000 - formData.description.length}{" "}
                                    characters left
                                </small>
                            </div>

                            <div className="flex w-full md:w-3/5 items-center gap-2">
                                <label className="btn" htmlFor="attachments">
                                    Adjuntar Soportes{" "}
                                </label>
                                <PaperClipIcon className="size-5" />
                                <input
                                    name="attachments"
                                    id="attachments"
                                    type="file"
                                    onChange={formDataHandler}
                                    multiple
                                    placeholder="Adjuntar Soportes"
                                />
                            </div>

                            <div className="flex w-full md:w-3/5 my-3 gap-3 items-start">
                                <input
                                    type="checkbox"
                                    defaultChecked
                                    className="checkbox checkbox-success mt-1"
                                />
                                <label>
                                    Autorizo el tratamiento de mis datos
                                    personales conforme a la Ley 1581 de 2012
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="btn bg-primary text-white font-bold px-16 rounded-lg"
                            >
                                Enviar PQRS
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
