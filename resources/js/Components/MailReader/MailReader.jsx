import SenderInformationCard from "@/components/SenderInformationCard/SenderInformationCard";
import { MailContext } from "@/context/MailContext/MailContext";
import { useContext, useEffect, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import {
    ArchiveBoxIcon,
    ArrowUturnLeftIcon,
} from "@heroicons/react/24/outline";
import card from "daisyui/components/card/index.js";

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
                response: responseText,
            });

            // Optional UX improvements 👇
            setResponseText("");
            alert("Respuesta enviada correctamente");

            // If responding should close or archive the mail:
            // setSelectedMail(null);
        } catch (error) {
            console.error("Respond error:", error);

            if (error.response) {
                console.error(error.response.data);
                alert("Error al enviar la respuesta");
            }
        } finally {
            setSending(false);
        }
    };

    const getThumbnail = (type) => {
        switch (type.toLowerCase()) {
            case "pdf":
                return "/images/attached-pdf.png";
            case "jpg":
            case "jpeg":
            case "png":
                return null;
            case "doc":
            case "docx":
                return "/images/attached-doc.png";
            default:
                return "/images/attached-file.png";
        }
    };

    if (!currentMail) {
        return (
            <div className="h-full w-full flex items-center justify-center text-gray-500">
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
                prev.filter((mail) => mail.id !== currentMail.id)
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

    console.log("attachments:", currentMail.attached_supports);

    return (
        <div
            className={`
    h-full
    w-full
    shadow-xl
    rounded-lg
    p-6
    overflow-y-auto
    bg-white
    transition-all duration-300 ease-in-out
    ${selectedMail ? "block" : "hidden"}
    lg:block
  `}
        >
            <div className="flex items-center justify-between mb-4 ">
                <button
                    className="flex items-center gap-2 text-gray-600"
                    onClick={() => setSelectedMail(null)}
                >
                    <ArrowLeftIcon className="w-5" />
                    Volver
                </button>

                <button
                    onClick={handleArchiveToggle}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-primary lg:hidden"
                >
                    {isArchiveView ? (
                        <>
                            <ArrowUturnLeftIcon className="w-5" />
                            Desarchivar
                        </>
                    ) : (
                        <>
                            <ArchiveBoxIcon className="w-5" />
                            Archivar
                        </>
                    )}
                </button>
            </div>

            <div id="tag-container" className="flex flex-wrap gap-2">
                <div className="px-4 py-0.5 bg-senaGreen rounded-md font-bold text-white bg-primary">
                    {currentMail.request_type}
                </div>
            </div>

            <div className="hidden lg:flex justify-end mb-2">
                <button
                    onClick={handleArchiveToggle}
                    className="flex items-center gap-2 btn text-white bg-primary font-medium text-lg hover:text-primary cursor-pointer"
                >
                    {isArchiveView ? (
                        <>
                            <ArrowUturnLeftIcon className="w-7" />
                            Desarchivar
                        </>
                    ) : (
                        <>
                            <ArchiveBoxIcon className="w-7" />
                            Archivar
                        </>
                    )}
                </button>
            </div>

            <div id="serial-data" className="flex flex-wrap gap-3 my-2">
                <div className="font-bold text-lg">ID: {currentMail.id}</div>
                <div className="font-bold text-lg">
                    {new Date(currentMail.created_at).toLocaleDateString()}
                </div>
            </div>

            <div className="mb-3">
                <h2 className="font-bold text-xl">{currentMail.affair}</h2>
            </div>

            <SenderInformationCard currentMail={currentMail} />

            <div id="email-description" className="mt-4">
                <div className="font-bold text-lg mb-2">Descripción</div>
                <p className="text-justify">{currentMail.description}</p>
            </div>

            <div className="my-3">
                <div className="font-bold text-lg mb-2">Soportes Adjuntos</div>

                {currentMail.attached_supports?.length === 0 && (
                    <p className="text-gray-400 text-sm">
                        No hay archivos adjuntos
                    </p>
                )}

                <div className="flex flex-wrap gap-4">
                    {currentMail.attached_supports?.map((file) => (
                        <a
                            key={file.id}
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-32 p-2 border rounded-lg hover:shadow-md transition text-center"
                        >
                            {["jpg", "jpeg", "png"].includes(file.type) ? (
                                <img
                                    src={file.url}
                                    alt={file.name}
                                    className="w-full h-24 object-cover rounded"
                                />
                            ) : (
                                <img
                                    src={getThumbnail(file.type)}
                                    alt={file.name}
                                    className="w-full h-24 object-contain"
                                />
                            )}

                            <p className="text-xs mt-2 truncate">{file.name}</p>
                        </a>
                    ))}
                </div>
            </div>

            <div className="w-full flex flex-col">
                <textarea
                    className="textarea w-full rounded-lg focus:outline-gray-200 my-2"
                    placeholder="Escribe tu respuesta..."
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                />
                <button
                    onClick={handleRespond}
                    disabled={sending}
                    className="btn bg-primary p-2 hover:bg-senaWashedGreen text-white rounded-lg self-end disabled:opacity-50"
                >
                    {sending ? "Enviando..." : "Enviar respuesta"}
                </button>
            </div>
        </div>
    );
}
