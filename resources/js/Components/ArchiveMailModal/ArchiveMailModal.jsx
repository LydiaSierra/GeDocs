export default function ArchiveMailModal({ mail, onClose, onUnarchive }) {
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-lg p-6 space-y-4">
                <h2 className="text-xl font-bold">PQR #{mail.id}</h2>

                <p><b>Título:</b> {mail.affair}</p>
                <p><b>Descripción:</b> {mail.description}</p>
                <p><b>Solicitante:</b> {mail.sender_name}</p>
                <p><b>Tipo:</b> {mail.request_type}</p>
                <p><b>Estado:</b> {mail.response_status}</p>

                <div className="flex justify-end gap-2 pt-4">
                    <button
                        onClick={onClose}
                        className="btn btn-ghost"
                    >
                        Cerrar
                    </button>

                    <button
                        onClick={() => onUnarchive(mail.id)}
                        className="btn btn-primary"
                    >
                        Desarchivar
                    </button>
                </div>
            </div>
        </div>
    );
}
