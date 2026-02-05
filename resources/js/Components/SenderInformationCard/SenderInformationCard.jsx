import { UserCircleIcon } from "@heroicons/react/24/solid";

export default function InboxMailCard({currentMail}) {
    return (
        <div className="w-full bg-neutral-content rounded-xl p-6">

            {/* Title */}
            <h2 className="text-lg font-bold mb-4">
                Información del solicitante
            </h2>

            {/* Main content */}
            <div className="flex gap-6 items-start">

                {/* Avatar */}
                <UserCircleIcon className="size-20 text-neutral shrink-0" />

                {/* Info grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-4 w-full">

                    {/* Item */}
                    <div>
                        <p className="text-sm text-neutral/60">Solicitante</p>
                        <p className="font-semibold">{currentMail.sender_name}</p>
                    </div>

                    <div>
                        <p className="text-sm text-neutral/60">Identificación</p>
                        <p className="font-semibold">{currentMail.document_type} {currentMail.document}</p>
                    </div>

                    <div>
                        <p className="text-sm text-neutral/60">Dirección</p>
                        <p className="font-semibold">Calle 123 #45-67</p>
                    </div>

                    <div>
                        <p className="text-sm text-neutral/60">Correo Electrónico</p>
                        <p className="font-semibold break-all">
                            {currentMail.email}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-neutral/60">Teléfono de contacto</p>
                        <p className="font-semibold">300 123 4567</p>
                    </div>

                    <div>
                        <p className="text-sm text-neutral/60">Dependencia destinataria</p>
                        <p className="font-semibold">Tesorería</p>
                    </div>

                </div>
            </div>
        </div>
    );
}
