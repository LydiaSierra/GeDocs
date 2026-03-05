import axios from "axios";
import { useEffect, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { 
    CheckCircleIcon, 
    PaperClipIcon, 
    ArrowPathIcon,
    ChatBubbleLeftRightIcon,
    DocumentTextIcon,
    ArrowLeftIcon
} from "@heroicons/react/24/solid";

export default function Comunication({ pqrID }) {
    const [comunication, setComunication] = useState({});
    const [pqr, setPqr] = useState({});
    const [dependency, setDependency] = useState({});
    const [response, setResponse] = useState("");
    const [attachments, setAttachments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [toasts, setToasts] = useState([]);

    const addToast = (type, message) => {
        const id = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        setToasts((prev) => [...prev, { id, type, message }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    };

    useEffect(() => {
        async function fetchComunication() {
            try {
                const res = await axios.get(`/api/pqr/responder/${pqrID}`);
                setComunication(res.data.data.communication);
                setPqr(res.data.data.pqr);
                setDependency(res.data.data.dependency || {});
            } catch (e) {
                console.error(e);
                addToast("error", "No se pudo cargar la información o el enlace ha expirado.");
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
                headers: { "Content-Type": "multipart/form-data" },
            });
            setSubmitted(true);
            addToast("success", "Respuesta enviada exitosamente.");
        } catch (error) {
            console.error(error);
            addToast("error", error.response?.data?.error || "Error al enviar la respuesta.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="text-gray-500 font-medium animate-pulse">Cargando información...</p>
                </div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <Head title="Respuesta Enviada" />
                <div className="bg-white rounded-3xl p-10 w-full max-w-md text-center shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-300">
                    <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircleIcon className="w-12 h-12 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2 font-outfit">¡Respuesta enviada!</h1>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        Tu respuesta ha sido registrada exitosamente en el sistema GeDocs. El equipo encargado continuará con tu solicitud.
                    </p>
                    <Link href="/" className="btn btn-primary w-full text-white font-bold rounded-xl shadow-lg shadow-primary/20">
                        Volver al inicio
                    </Link>
                </div>
            </div>
        );
    }

   return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-5 px-4 sm:px-6">
        <Head title={`Responder - ${pqr.affair || 'Comunicación'}`} />

        {/* Alertas */}
        <div className="toast toast-top toast-end z-50">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`alert shadow-lg text-white font-medium rounded-xl ${
                        toast.type === "success"
                            ? "alert-success"
                            : "alert-error"
                    }`}
                >
                    <span>{toast.message}</span>
                </div>
            ))}
        </div>

        <div className="max-w-4xl mx-auto space-y-8">

            {/* Header */}
            <div className="flex flex-col items-center text-center space-y-3">
                <img
                    src="/images/imgLogin.png"
                    alt="Logo"
                    className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
                />
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    Atención Ciudadana
                </h1>
                <p className="text-gray-500 text-sm sm:text-base">
                    Sistema de Gestión Documental GeDocs
                </p>
            </div>

            {/* Conteiner principal */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

                <div className="bg-gray-50 px-6 sm:px-10 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
                    
                    <div>
                        <span className="text-xs uppercase tracking-widest font-semibold text-gray-400">
                            Radicado
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                            <DocumentTextIcon className="w-5 h-5 text-primary" />
                            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                                #{pqr.id}
                            </h2>
                        </div>
                    </div>

                    <div className="sm:text-right">
                        <span className="text-xs uppercase tracking-widest font-semibold text-gray-400">
                            Asunto
                        </span>
                        <p
                            className="font-semibold text-gray-700 max-w-xs truncate"
                            title={pqr.affair}
                        >
                            {pqr.affair}
                        </p>
                    </div>
                </div>

                {/* Contenido */}
                <div className="p-6 sm:p-10 space-y-10">

                    {/* Mensaje */}
                    <section className="space-y-3">
                        <h3 className="text-sm font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
                            <ChatBubbleLeftRightIcon className="w-5 h-5" />
                            Mensaje de {dependency.name || "la Dependencia"}
                        </h3>

                        <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 shadow-sm">
                            <p className="italic text-gray-700 text-base sm:text-lg">
                                "{comunication.message}"
                            </p>
                        </div>
                    </section>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="space-y-8">

                       
                        <div className="space-y-2">
                            <label className="font-semibold text-gray-700">
                                Escriba su respuesta de manera formal
                            </label>

                            <textarea
                                className="w-full h-40 sm:h-48 rounded-2xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition p-4 resize-none"
                                placeholder="Redacte aquí su respuesta detallada..."
                                value={response}
                                onChange={(e) => setResponse(e.target.value)}
                                required
                                disabled={isSubmitting}
                            />

                            <div className="flex justify-between text-xs">
                                <span className="text-gray-400 italic">
                                    Mínimo 10 caracteres
                                </span>
                                <span
                                    className={`font-semibold ${
                                        response.length < 10
                                            ? "text-red-500"
                                            : "text-primary"
                                    }`}
                                >
                                    {response.length} caracteres
                                </span>
                            </div>
                        </div>

                        {/* Archivos adjuntos necesarios  */}
                        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex flex-col sm:flex-row gap-4 sm:items-center">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 font-semibold text-gray-700">
                                    <PaperClipIcon className="w-5 h-5 text-gray-400" />
                                    Anexar Soportes
                                </div>
                                <p className="text-xs text-gray-400">
                                    Opcional. PDF, JPG o PNG (Máx. 5MB).
                                </p>
                            </div>

                            <input
                                type="file"
                                className="file-input file-input-bordered file-input-primary w-full sm:max-w-xs rounded-xl"
                                multiple
                                onChange={(e) =>
                                    setAttachments(Array.from(e.target.files))
                                }
                                disabled={isSubmitting}
                            />
                        </div>

                      
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">

                            <button
                                type="submit"
                                disabled={isSubmitting || response.length < 10}
                                className="flex-1 h-14 rounded-2xl bg-primary text-white font-semibold shadow-md hover:shadow-lg transition hover:scale-[1.01] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {isSubmitting ? (
                                    <>
                                        <ArrowPathIcon className="w-5 h-5 animate-spin mr-2" />
                                        Enviando...
                                    </>
                                ) : (
                                    "Enviar Respuesta"
                                )}
                            </button>

                            <Link
                                href="/"
                                className="h-14 px-4 rounded-2xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-100 transition flex items-center justify-center"
                            >
                                Cancelar
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            {/* footer */}
            <div className="text-center pt-6">
                <p className="text-gray-400 text-sm">
                    © {new Date().getFullYear()} Sena GeDocs
                </p>
                <p className="text-gray-300 text-xs uppercase tracking-wider">
                    Gestión Documental
                </p>
            </div>
        </div>
    </div>
);
}
