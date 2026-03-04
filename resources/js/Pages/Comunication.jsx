import axios from "axios";
import { useEffect, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { CheckCircleIcon, PaperClipIcon, ArrowPathIcon } from "@heroicons/react/24/solid";

export default function Comunication(params) {
    const [comunication, setComunication] = useState({});
    const [pqr, setPqr] = useState({});
    const [dependency, setDependency] = useState({});
    const [response, setResponse] = useState("");
    const [attachments, setAttachments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [toasts, setToasts] = useState([]);

    const pqrID = params.pqrID;

    const addToast = (type, message) => {
        const id = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        setToasts((prev) => [...prev, { id, type, message }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    };

    useEffect(() => {
        const url = "/api/pqr/responder";
        async function fetchComunication() {
            try {
                const res = await axios.get(`${url}/${pqrID}`);
                setComunication(res.data.data.communication);
                setPqr(res.data.data.pqr);
                setDependency(res.data.data.dependency || {});
            } catch (e) {
                console.error(e);
                addToast("error", "No se pudo cargar la información de la PQR o el enlace ha expirado.");
            } finally {
                setIsLoading(false);
            }
        }
        fetchComunication();
    }, [pqrID]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (response.trim().length < 10) {
            addToast("error", "La respuesta debe tener al menos 10 caracteres.");
            return;
        }

        setIsSubmitting(true);
        const data = new FormData();
        data.append("message", response);
        
        attachments.forEach((file) => {
            data.append("attachments[]", file);
        });

        try {
            await axios.post(`/api/pqr/responder/${pqrID}`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setSubmitted(true);
            addToast("success", "Respuesta enviada exitosamente.");
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.error || "Ocurrió un error al enviar la respuesta.";
            addToast("error", msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="text-gray-500 font-medium">Cargando información...</p>
                </div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <Head title="Respuesta Enviada" />
                <div className="bg-white rounded-2xl p-10 w-full max-w-md text-center shadow-md border border-gray-100">
                    <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircleIcon className="w-12 h-12 text-primary" />
                    </div>

                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        ¡Respuesta enviada con éxito!
                    </h1>

                    <p className="text-gray-600 mb-8 leading-relaxed">
                        Hemos recibido tu respuesta correctamente. El equipo responsable de la PQR continuará con el trámite correspondiente.
                    </p>

                    <Link
                        href="/"
                        className="btn btn-primary w-full text-white normal-case font-bold"
                    >
                        Volver al inicio
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 md:px-6">
            <Head title={`Responder PQR - ${pqr.affair || ""}`} />

            <div className="toast toast-top toast-end z-50">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`alert ${
                            toast.type === "success"
                                ? "alert-success"
                                : "alert-error"
                        } shadow-lg text-white font-medium`}
                    >
                        <span>{toast.message}</span>
                    </div>
                ))}
            </div>

            <div className="w-full max-w-3xl">
                {/* Header Section */}
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="mb-4">
                        <ApplicationLogo className="w-16 h-16 fill-current text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Atención de PQRS</h1>
                    <p className="text-gray-500 mt-2 text-lg">Sistema de Gestión Documental GeDocs</p>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Radicado Header */}
                    <div className="bg-gray-50/80 px-8 py-5 border-b border-gray-200 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                        <div>
                            <span className="text-xs uppercase tracking-wider font-bold text-gray-400">Radicado Interno</span>
                            <h2 className="text-xl font-extrabold text-primary">#{pqr.id}</h2>
                        </div>
                        <div className="sm:text-right">
                            <span className="text-xs uppercase tracking-wider font-bold text-gray-400">Asunto de la Solicitud</span>
                            <p className="font-semibold text-gray-800 truncate" title={pqr.affair}>
                                {pqr.affair}
                            </p>
                        </div>
                    </div>

                    <div className="p-8">
                        {/* Received message section */}
                        <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
                            <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
                                Mensaje de {dependency.name || "la Dependencia"}
                            </h3>
                            <div className="bg-gray-50 rounded-2xl p-6 text-gray-700 leading-relaxed border-l-[6px] border-primary shadow-sm">
                                <p className="italic font-medium">"{comunication.message}"</p>
                            </div>
                        </div>

                        <div className="divider opacity-50"></div>

                        {/* Form section */}
                        <form onSubmit={handleSubmit} className="mt-10">
                            <div className="form-control w-full mb-8">
                                <label className="label mb-1">
                                    <span className="label-text font-bold text-gray-700 text-base">Escriba su respuesta:</span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered h-44 w-full text-base focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 placeholder:text-gray-300"
                                    placeholder="Diligencie aquí los detalles de su respuesta..."
                                    value={response}
                                    onChange={(e) => setResponse(e.target.value)}
                                    required
                                    disabled={isSubmitting}
                                ></textarea>
                                <label className="label">
                                    <span className="label-text-alt text-gray-400 italic">Mínimo 10 caracteres para que sea válida.</span>
                                    <span className={`label-text-alt font-medium ${response.length < 10 ? 'text-error' : 'text-primary'}`}>
                                        {response.length} caracteres
                                    </span>
                                </label>
                            </div>

                            <div className="form-control w-full mb-10">
                                <label className="label mb-1">
                                    <span className="label-text font-bold text-gray-700 text-base">Adjuntar soportes (Opcional):</span>
                                </label>
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                    <div className="relative flex-1 group">
                                        <input
                                            type="file"
                                            className="file-input file-input-bordered file-input-primary w-full group-hover:border-primary transition-colors"
                                            multiple
                                            onChange={(e) => setAttachments(Array.from(e.target.files))}
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div className="bg-gray-100 p-3 rounded-lg flex items-center justify-center">
                                        <PaperClipIcon className="w-6 h-6 text-gray-400" />
                                    </div>
                                </div>
                                <label className="label">
                                    <span className="label-text-alt text-gray-400">PDF, Imágenes o Documentos (Máx. 5MB por archivo).</span>
                                </label>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting || response.length < 10}
                                    className={`btn btn-primary flex-1 text-white normal-case font-bold text-lg h-14 ${
                                        isSubmitting ? "loading" : ""
                                    }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <ArrowPathIcon className="w-5 h-5 animate-spin mr-2" />
                                            Enviando respuesta...
                                        </>
                                    ) : (
                                        "Enviar Respuesta Formal"
                                    )}
                                </button>
                                <Link
                                    href="/"
                                    className="btn btn-ghost normal-case text-gray-400 font-medium h-14"
                                >
                                    Cancelar
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Footer Credits */}
                <div className="mt-12 text-center">
                    <p className="text-gray-400 text-sm font-medium">
                        © {new Date().getFullYear()} GeDocs - Centro de Gestión Documental
                    </p>
                    <p className="text-gray-300 text-xs mt-1 italic">
                        Desarrollado para la gestión institucional eficiente.
                    </p>
                </div>
            </div>
        </div>
    );
}
