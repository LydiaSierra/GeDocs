import { useEffect, useState } from "react";
import axios from "axios";
import ArchiveMailModal from "@/components/ArchiveMailModal/ArchiveMailModal";

export default function ArchiveTable() {
    const [mails, setMails] = useState([]);
    const [selectedMail, setSelectedMail] = useState(null);

    useEffect(() => {
        axios.get("/api/pqrs?archived=true")
            .then(res => setMails(res.data.data ?? res.data))
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
                <table className="w-full table-auto border-separate border-spacing-y-2">
                    <thead className="sticky top-0">
                    <tr className="bg-gray-500 text-white">
                        <th>ID</th>
                        <th>Título</th>
                        <th>Solicitante</th>
                        <th>Tipo</th>
                        <th>Estado</th>
                        <th>Fecha</th>
                    </tr>
                    </thead>
                    <tbody>
                    {mails.map(mail => (
                        <tr
                            key={mail.id}
                            onClick={() => setSelectedMail(mail)}
                            className="cursor-pointer odd:bg-gray-100 even:bg-gray-200 hover:bg-senaLightBlue text-center"
                        >
                            <td>{mail.id}</td>
                            <td className="truncate max-w-[200px]">{mail.affair}</td>
                            <td>{mail.sender_name}</td>
                            <td>{mail.request_type}</td>
                            <td>{mail.response_status}</td>
                            <td>{new Date(mail.created_at).toLocaleDateString()}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* MOBILE */}
            <div className="md:hidden space-y-3">
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
