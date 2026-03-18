import SenderInformationCard from "@/Components/SenderInformationCard/SenderInformationCard";
import PdfThumbnail from "@/Components/PdfThumbnail/PdfThumbnail";
import { MailContext } from "@/context/MailContext/MailContext";
import { useContext, useState, useMemo } from "react";
import { usePage } from "@inertiajs/react";
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
        isArchiveView, 
    } = useContext(MailContext);

    const { auth, dependencies = [] } = usePage().props;
    const userRole = auth?.user?.roles?.[0]?.name;
    const isInstructor = userRole === 'Instructor';
    const isAdmin = userRole === 'Admin';

    const currentMail = mailCards.find((mail) => mail.id === selectedMail);

    const relevantDependencies = useMemo(() => {
        if (!currentMail) return [];
        return dependencies.filter(
            (dep) => dep.sheet_number_id === currentMail.sheet_number_id
        );
    }, [dependencies, currentMail]);

    const [responseText, setResponseText] = useState("");
    const [sending, setSending] = useState(false);
    const [responseUrl, setResponseUrl] = useState("");

    const handleRespond = async () => {
        if (!responseText.trim()) return;

        try {
            setSending(true);

            const respondRes = await axios.post(`/api/pqrs/${currentMail.id}/respond`, {
                response_message: responseText,
            });

            // Actualizar el estado de la PQR
            setMailCards((prev) =>
                prev.map((mail) =>
                    mail.id === currentMail.id
                        ? { ...mail, ...respondRes.data.data }
                        : mail
                )
            );

            await axios
                .post(`/api/pqr/${currentMail.id}/comunicaciones`, {
                    message: responseText,
                    requires_response: true,
                })
                .then((response) => {
                    setResponseUrl(response.data.response_url);
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

    const handleAssignDate = async (days) => {
        try {
            const response = await axios.patch(`/api/pqrs/${currentMail.id}`, {
                response_days: days,
            });

            setMailCards((prev) =>
                prev.map((mail) =>
                    mail.id === currentMail.id
                        ? { ...mail, response_time: response.data.data.response_time }
                        : mail
                )
            );

            // Cerrar el menú desplegable al hacer clic
            const elem = document.activeElement;
            if (elem) {
                elem.blur();
            }
        } catch (error) {
            console.error("Assign date error:", error);
            if (error.response) {
                alert(error.response.data.message || error.response.data.error || "Error al asignar fecha");
            }
        }
    };

    const handleAssignDependency = async (dependencyId) => {
        try {
            const response = await axios.patch(`/api/pqrs/${currentMail.id}`, {
                dependency_id: dependencyId,
            });

            setMailCards((prev) =>
                prev.map((mail) =>
                    mail.id === currentMail.id
                        ? { ...mail, dependency: response.data.data.dependency, dependency_id: response.data.data.dependency_id }
                        : mail
                )
            );

            const elem = document.activeElement;
            if (elem) {
                elem.blur();
            }
        } catch (error) {
            console.error("Assign dependency error:", error);
            if (error.response) {
                alert(error.response.data.message || error.response.data.error || "Error al asignar dependencia");
            }
        }
    };

    // Calculate time remaining to response
    const getDeadlineColor = (createdDateStr, responseDateStr) => {
        if (!createdDateStr || !responseDateStr) return "text-gray-700";

        const now = new Date();
        const created = new Date(createdDateStr);
        const deadline = new Date(responseDateStr);

        // Calculate total time assigned and time left
        const totalDuration = deadline.getTime() - created.getTime();
        const timeRemaining = deadline.getTime() - now.getTime();

        // If the deadline is already passed, it's 0% time left
        const remainingPercentage = totalDuration > 0
            ? (timeRemaining / totalDuration) * 100
            : 0;

        // More than 80% left
        if (remainingPercentage > 80) return "text-primary";
        // Between 40% and 80% left
        if (remainingPercentage > 40) return "text-[#F0DA30]";
        // Below 40% (or overdue)
        return "text-red-600";
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

                    {/* -------------Button to assing a limit date----------------*/}
                    {""}
                    <div className="flex items-center gap-2 ml-auto">
                        {(isInstructor || isAdmin) && relevantDependencies.length > 0 && (
                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="btn btn-sm btn-outline border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-primary">
                                    {currentMail.dependency ? currentMail.dependency.name : "Asignar Dependencia"}
                                </div>
                                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-64 max-h-60 overflow-y-auto">
                                    <li className="menu-title">Seleccionar Dependencia</li>
                                    {relevantDependencies.map((dep) => (
                                        <li key={dep.id}>
                                            <a
                                                className={currentMail.dependency_id === dep.id ? "bg-primary/10 text-primary font-medium" : ""}
                                                onClick={() => handleAssignDependency(dep.id)}
                                            >
                                                {dep.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {currentMail.response_date ? (
                            <span className="text-sm font-medium text-[#34A853]">
                                ¡PQR respondida con éxito!
                            </span>
                        ) : currentMail.response_time ? (
                            new Date() > new Date(currentMail.response_time) ? (
                                <span className="text-sm font-medium text-red-600">
                                    Vencida
                                </span>
                            ) : (
                                <span className={`text-sm font-medium ${getDeadlineColor(currentMail.created_at, currentMail.response_time)}`}>
                                    Fecha límite: {new Date(currentMail.response_time).toLocaleDateString()}
                                </span>
                            )
                        ) : (
                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="btn btn-sm btn-primary text-white">
                                    Asignar fecha límite
                                </div>
                                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                    <li><a onClick={() => handleAssignDate(10)}>10 días </a></li>
                                    <li><a onClick={() => handleAssignDate(15)}>15 días </a></li>
                                    <li><a onClick={() => handleAssignDate(30)}>30 días </a></li>
                                </ul>
                            </div>
                        )}
                    </div>
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
                    {currentMail.response_time && !currentMail.response_date && new Date() > new Date(currentMail.response_time) ? (
                        <div className="p-4 bg-white border border-red-200 rounded-lg flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                                <span className="text-red-500 text-xl">⚠️</span>
                            </div>
                            <div>
                                <h3 className="text-red-700 font-medium mb-0.5">¡Tiempo de Respuesta Excedido!</h3>
                                <p className="text-sm font-medium">Esta PQR excedió el tiempo de respuesta y ya no puede ser respondida.</p>
                            </div>
                        </div>
                    ) : (
                        <>
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
                                {responseUrl ? (
                                    <a
                                        target="_blank"
                                        href={responseUrl}
                                        className="mr-5"
                                    >
                                        Enlace de respuestas
                                    </a>
                                ) : (
                                    ""
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
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
