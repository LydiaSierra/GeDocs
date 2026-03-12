import SenderInformationCard from "@/Components/SenderInformationCard/SenderInformationCard";
import PdfThumbnail from "@/Components/PdfThumbnail/PdfThumbnail";
import { MailContext } from "@/context/MailContext/MailContext";
import { useContext, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import {
    ArchiveBoxIcon,
    ArrowUturnLeftIcon,
    PaperAirplaneIcon,
} from "@heroicons/react/24/outline";

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

    const handleRespond = async () => {
        if (!responseText.trim()) return;

        try {
            setSending(true);

            await axios.post(`/api/pqrs/${currentMail.id}/respond`, {
                response_message: responseText,
            });
            await axios.post(`/api/pqr/${currentMail.id}/comunicaciones`, {
                message: responseText,
                requires_response: true,
            });
            // Optional UX improvements 👇

            alert("Respuesta enviada correctamente");

            // If responding should close or archive the mail:
            // setSelectedMail(null);
        } catch (error) {
            console.error("Respond error:", error);

            if (error.response) {
                console.error(error.response.data);
                alert(error.response.data.error);
            }
        } finally {
            setSending(false);
            setResponseText("");
        }
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

                {/* Attachments */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        Soportes Adjuntos
                    </h3>

                    {currentMail.attached_supports?.length === 0 ? (
                        <p className="text-gray-400 text-sm">
                            No hay archivos adjuntos
                        </p>
                    ) : (
                        <div className="flex flex-wrap gap-3">
                            {currentMail.attached_supports?.map((file) => (
                                <a
                                    key={file.id}
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group w-28 p-2 bg-gray-50 border border-gray-200 rounded-lg hover:border-primary/40 hover:shadow-sm transition text-center overflow-hidden"
                                >
                                    {["jpg", "jpeg", "png"].includes(
                                        file.type?.toLowerCase(),
                                    ) ? (
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
                                    ) : null}
                                    <p className="text-xs mt-1.5 truncate text-gray-600 group-hover:text-primary">
                                        {file.name}
                                    </p>
                                </a>
                            ))}
                        </div>
                    )}
                </div>

                {/* Response area */}
                <div className="border-t border-gray-100 pt-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Responder
                    </h3>
                    <textarea
                        className="textarea w-full bg-gray-50 border border-gray-200 rounded-lg focus:border-primary focus:outline-none resize-none min-h-[100px]"
                        placeholder="Escribe tu respuesta..."
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                    />
                    <div className="flex justify-end mt-2">
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
            </div>
        </div>
    );
}
