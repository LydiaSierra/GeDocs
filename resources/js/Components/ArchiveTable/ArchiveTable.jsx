import { useEffect, useState } from "react";
import axios from "axios";
import ArchiveMailModal from "@/components/ArchiveMailModal/ArchiveMailModal";
import api from "@/lib/axios.js";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import EmptyState from "../EmptyState";

export default function ArchiveTable() {
    const [mails, setMails] = useState([]);
    const [selectedMail, setSelectedMail] = useState(null);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        setLoading(true)
        api.get("/api/pqrs?archived=true")
            .then(res => {
                setMails(res.data.data ?? res.data)
                setLoading(false)


            })
            .catch(err => console.error(err));
    }, []);

    const unarchiveMail = async (id) => {
        await axios.patch(`/api/pqrs/${id}`, { archived: false });
        setMails(prev => prev.filter(mail => mail.id !== id));
        setSelectedMail(null);
    };

    return (
        <>
            {/* DESKTOP */}
            <div className="hidden md:block overflow-x-auto">
                {loading ?
                    <div className={"flex justify-center items-center h-40"}>

                        <div className={"flex gap-2 items-center text-gray-500"}>
                            <ArrowPathIcon className={"animate-spin size-6"} />
                            Cargando
                        </div>
                    </div>

                    :
                    <>
                        <table className="w-full table-auto border-separate border-spacing-y-2">
                            <thead className="sticky top-0">
                                <tr className="bg-gray-500 text-white">
                                    <th className="py-3 rounded-l-md">ID</th>
                                    <th>Título</th>
                                    <th>Solicitante</th>
                                    <th>Tipo</th>
                                    <th>Estado</th>
                                    <th className="rounded-r-md">Fecha</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mails.map(mail => (
                                    <tr
                                        key={mail.id}
                                        onClick={() => setSelectedMail(mail)}
                                        className="cursor-pointer odd:bg-gray-100 even:bg-gray-200 hover:bg-senaLightBlue text-center hover:bg-accent"
                                    >
                                        <td className="py-3 rounded-l-md">{mail.id}</td>
                                        <td className="truncate max-w-[200px]">{mail.affair}</td>
                                        <td>{mail.sender_name}</td>
                                        <td>{mail.request_type}</td>
                                        <td>{mail.response_status}</td>
                                        <td className="rounded-r-md">{new Date(mail.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {mails.length === 0 &&
                            <div className=" relative h-[50vh]">
                                <EmptyState text={"No hay email archivados"} />
                            </div>
                        }
                    </>

                }

            </div>

            {/* MOBILE */}
            <div className="md:hidden space-y-3">
                {mails.length === 0 &&
                    <div className=" relative h-[50vh]">
                        <EmptyState text={"No hay email archivados"} />
                    </div>
                }
                {mails.map(mail => (
                    <div
                        key={mail.id}
                        onClick={() => setSelectedMail(mail)}
                        className="bg-gray-100 p-3 rounded-lg shadow cursor-pointer"
                    >
                        <p><b>ID:</b> {mail.id}</p>
                        <p><b>Título:</b> {mail.affair}</p>
                        <p><b>Solicitante:</b> {mail.sender_name}</p>
                        <p><b>Estado:</b> {mail.response_status}</p>
                    </div>
                ))}
            </div>

            {/* MODAL */}
            {selectedMail && (
                <ArchiveMailModal
                    mail={selectedMail}
                    onClose={() => setSelectedMail(null)}
                    onUnarchive={unarchiveMail}
                />
            )}
        </>
    );
}
