import SenderInformationCard from "@/Components/SenderInformationCard/SenderInformationCard";
import PdfThumbnail from "@/Components/PdfThumbnail/PdfThumbnail";
import { PdfCommunicationModal } from "@/Components/PdfCommunicationModal/PdfCommunicationModal";
import { MailContext } from "@/context/MailContext/MailContext";
import { useContext, useMemo, useRef, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import api from "@/lib/axios.js";
import {
    ArchiveBoxIcon,
    ArrowUturnLeftIcon,
    PaperAirplaneIcon,
    ArrowUpTrayIcon,
    DocumentPlusIcon,
    CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { usePage } from "@inertiajs/react";

export function MailReader() {
    const {
        mailCards,
        selectedMail,
        setSelectedMail,
        setMailCards,
        isArchiveView, // boolean you pass from Inbox / Archive
    } = useContext(MailContext);

    const currentMail = mailCards.find((mail) => mail.id === selectedMail);

    const [responseText, setResponseText] = useState("");
    const [sending, setSending] = useState(false);
    const [responseUrl, setResponseUrl] = useState("");

    // Estado para subir PDF desde archivo
    const [uploadedPdfFile, setUploadedPdfFile] = useState(null);
    const pdfFileInputRef = useRef(null);

    // Estado para el modal de generar PDF
    const [pdfModalOpen, setPdfModalOpen] = useState(false);

    // Toast interno para éxito de PDF generado
    const [pdfSuccessUrl, setPdfSuccessUrl] = useState(null);

    const handleRespond = async () => {
        if (!responseText.trim()) return;

        try {
            setSending(true);

            // Construir payload como FormData para enviar texto y archivo en una sola petición
            const formData = new FormData();
            formData.append("message", responseText);
            formData.append("requires_response", "0"); // false

            if (uploadedPdfFile) {
                formData.append("attachments[]", uploadedPdfFile);
            }

            const commResponse = await api.post(
                `/api/pqr/${currentMail.id}/comunicaciones`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            setResponseUrl(commResponse.data.response_url);

            // Actualizar el estado local de la PQR a responded
            setMailCards((prev) =>
                prev.map((mail) =>
                    mail.id === currentMail.id
                        ? {
                              ...mail,
                              response_status: commResponse.data.pqr_status,
                              response_date: commResponse.data.response_date,
                          }
                        : mail
                )
            );

            alert("Respuesta enviada correctamente");
            setUploadedPdfFile(null);

        } catch (error) {
            console.error("Respond error:", error);

            if (error.response) {
                const errorMessage = error.response.data.error || error.response.data.message || "Error al enviar la respuesta";
                alert(errorMessage);
            } else {
                alert("Error de conexión. Por favor, intente nuevamente.");
            }
        } finally {
            setSending(false);
            setResponseText("");
        }
    };

    /** Maneja la selección del archivo PDF desde el disco */
    const handlePdfFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file && file.type === "application/pdf") {
            setUploadedPdfFile(file);
        } else if (file) {
            alert("Solo se permiten archivos PDF.");
            e.target.value = null;
        }
    };

    /** Callback cuando el PDF generado se guarda exitosamente */
    const handlePdfGenerated = (data) => {
        setPdfSuccessUrl(data.url);
        
        // Actualizar el estado local de la PQR a responded
        setMailCards((prev) =>
            prev.map((mail) =>
                mail.id === currentMail.id
                    ? {
                          ...mail,
                          response_status: data.pqr_status,
                          response_date: data.response_date,
                      }
                    : mail
            )
        );

        // Ocultar el banner después de 8 segundos
        setTimeout(() => setPdfSuccessUrl(null), 8000);
    };

    if (!currentMail) {
        return (
            <div className="h-full w-full hidden lg:flex items-center justify-center text-gray-500">
                <img
                    className="h-110 opacity-60"
                    src="/images/OBJECTS.svg"
                    alt=""
                />
            </div>
        );
    }

    const handleArchiveToggle = async () => {
        try {
            await axios.patch(`/api/pqrs/${currentMail.id}`, {
                archived: !isArchiveView,
            });

            setMailCards((prev) =>
                prev.filter((mail) => mail.id !== currentMail.id),
            );

            setSelectedMail(null); // triggers clean UI reset
        } catch (error) {
            console.error("Archive error FULL:", error);

            if (error.response) {
                console.error("Status:", error.response.status);
                console.error("Data:", error.response.data);
            } else if (error.request) {
                console.error("No response received:", error.request);
            } else {
                console.error("Request setup error:", error.message);
            }
        }
    };

    return (
        <div
            className={`
                h-full w-full lg:flex-1 lg:min-w-0
                rounded-lg
                overflow-y-auto
                bg-white
                transition-all duration-300 ease-in-out
                flex flex-col
                ${selectedMail ? "flex" : "hidden"}
                lg:flex
            `}
        >
            {/* Sticky top bar */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between shrink-0">
                <button
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors cursor-pointer"
                    onClick={() => setSelectedMail(null)}
                >
                    <ArrowLeftIcon className="w-4" />
                    Volver
                </button>

                <button
                    onClick={handleArchiveToggle}
                    className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-primary transition-colors cursor-pointer"
                >
                    {isArchiveView ? (
                        <>
                            <ArrowUturnLeftIcon className="w-4" />
                            Desarchivar
                        </>
                    ) : (
                        <>
                            <ArchiveBoxIcon className="w-4" />
                            Archivar
                        </>
                    )}
                </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-6 pb-[50px] md:pb-6 space-y-5">
                {/* Header: tag + metadata */}
                <div className="flex flex-wrap items-center gap-3">
                    <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full uppercase tracking-wide">
                        {currentMail.request_type}
                    </span>
                    <span className="text-sm text-gray-400 font-medium">
                        ID: {currentMail.id}
                    </span>
                    {(currentMail.response_status === 'responded' || currentMail.response_status === 'closed') && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded border border-green-200 uppercase">
                            Respondida
                        </span>
                    )}
                    <span className="text-sm text-gray-400">
                        {new Date(currentMail.created_at).toLocaleDateString()}
                    </span>
                </div>

                {/* Subject */}
                <h1 className="text-xl font-bold text-neutral leading-snug">
                    {currentMail.affair}
                </h1>

                {/* Sender card */}
                <SenderInformationCard currentMail={currentMail} />

                {/* Description */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Descripción
                    </h3>
                    <p className="text-sm text-neutral/80 leading-relaxed text-justify">
                        {currentMail.description}
                    </p>
                </div>

                {/* Attachments Section */}
                <div className="space-y-6">
                    {/* Soportes Originales (PQR) */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                            Soportes de la PQR
                        </h3>
                        
                        {currentMail.attached_supports?.filter(f => f.origin === 'REC' || f.origin === 'pqr' || !f.origin).length === 0 ? (
                            <p className="text-gray-400 text-xs italic ml-4">
                                No hay archivos originales
                            </p>
                        ) : (
                            <div className="flex flex-wrap gap-3">
                                {currentMail.attached_supports?.filter(f => f.origin === 'REC' || f.origin === 'pqr' || !f.origin).map((file) => (
                                    <FileCard key={file.id} file={file} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Soportes de Respuesta */}
                    {currentMail.attached_supports?.filter(f => f.origin === 'ENV' || f.origin === 'response').length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                Soportes de Respuesta
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {currentMail.attached_supports?.filter(f => f.origin === 'ENV' || f.origin === 'response').map((file) => (
                                    <FileCard key={file.id} file={file} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Response area */}
                <div className="border-t border-gray-100 pt-4 space-y-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Responder
                    </h3>

                    {currentMail.response_status === 'responded' || currentMail.response_status === 'closed' ? (
                        <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 text-center space-y-2">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full text-green-600 mb-2">
                                <CheckCircleIcon className="w-6 h-6" />
                            </div>
                            <h4 className="text-sm font-bold text-gray-800">PQR Respondida</h4>
                            <p className="text-xs text-gray-500 max-w-sm mx-auto">
                                Esta solicitud ya ha sido atendida y no permite más respuestas oficiales. 
                                {currentMail.response_date && (
                                    <span className="block mt-1">Fecha: {new Date(currentMail.response_date).toLocaleString()}</span>
                                )}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {/* Textarea de respuesta */}
                            <textarea
                                className="textarea w-full bg-gray-50 border border-gray-200 rounded-lg focus:border-primary focus:outline-none resize-none min-h-[100px] text-sm"
                                placeholder="Escribe tu respuesta final aquí..."
                                value={responseText}
                                onChange={(e) => setResponseText(e.target.value)}
                            />

                            {/* Botones de adjuntar PDF */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <input
                                    ref={pdfFileInputRef}
                                    type="file"
                                    accept="application/pdf"
                                    className="hidden"
                                    onChange={handlePdfFileChange}
                                    id="pdf-upload-input"
                                />

                                <button
                                    type="button"
                                    onClick={() => pdfFileInputRef.current?.click()}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:border-primary hover:text-primary transition"
                                >
                                    <ArrowUpTrayIcon className="w-4 h-4" />
                                    Subir Archivo
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setPdfModalOpen(true)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:border-primary hover:text-primary transition"
                                >
                                    <DocumentPlusIcon className="w-4 h-4" />
                                    Crear PDF
                                </button>

                                {uploadedPdfFile && (
                                    <span className="text-xs text-primary font-medium truncate max-w-[180px]">
                                        📎 {uploadedPdfFile.name}
                                        <button
                                            type="button"
                                            className="ml-1 text-gray-400 hover:text-red-500"
                                            onClick={() => {
                                                setUploadedPdfFile(null);
                                                if (pdfFileInputRef.current) pdfFileInputRef.current.value = null;
                                            }}
                                        >
                                            ✕
                                        </button>
                                    </span>
                                )}
                            </div>

                            {pdfSuccessUrl && (
                                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm text-green-700">
                                    <CheckCircleIcon className="w-4 h-4 shrink-0" />
                                    <span>PDF generado y guardado.</span>
                                    <a href={pdfSuccessUrl} target="_blank" rel="noopener noreferrer" className="underline font-semibold hover:text-green-900">
                                        Ver PDF
                                    </a>
                                </div>
                            )}

                            <div className="flex justify-end items-center gap-3">
                                {responseUrl && (
                                    <a target="_blank" href={responseUrl} className="text-xs text-primary underline" rel="noopener noreferrer">
                                        Enlace de respuesta
                                    </a>
                                )}
                                <button
                                    onClick={handleRespond}
                                    disabled={sending}
                                    className="btn btn-sm bg-primary text-white hover:bg-primary/90 border-none rounded-lg gap-1.5 disabled:opacity-50"
                                >
                                    <PaperAirplaneIcon className="w-4" />
                                    {sending ? "Enviando..." : "Enviar respuesta"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal de generar PDF */}
                <PdfCommunicationModal
                    isOpen={pdfModalOpen}
                    onClose={() => setPdfModalOpen(false)}
                    pqrId={currentMail?.id}
                    onSuccess={handlePdfGenerated}
                />
            </div>
        </div>
    );
}

/** Componente interno para mostrar la tarjeta de cada archivo */
function FileCard({ file }) {
    return (
        <a
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group w-28 p-2 bg-gray-50 border border-gray-200 rounded-lg hover:border-primary/40 hover:shadow-sm transition text-center overflow-hidden"
        >
            {["jpg", "jpeg", "png"].includes(file.type?.toLowerCase()) ? (
                <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-20 object-cover rounded"
                />
            ) : file.type?.toLowerCase() === "pdf" ? (
                <PdfThumbnail
                    url={file.url}
                    alt={file.name}
                    className="w-full h-20 object-cover rounded"
                />
            ) : (
                <div className="w-full h-20 flex items-center justify-center bg-gray-100 rounded text-gray-400 text-xs font-bold">
                    {file.type?.toUpperCase()}
                </div>
            )}
            <p className="text-[10px] mt-1.5 truncate text-gray-600 group-hover:text-primary">
                {file.name}
            </p>
        </a>
    );
}