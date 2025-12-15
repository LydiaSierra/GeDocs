import { DocumentTextIcon, UserCircleIcon } from "@heroicons/react/24/solid";

export default function InboxMailCard({currentMail}) {
    return (
        <div className="w-full p-4 bg-neutral-content rounded-lg flex items-center gap-3 mb-3 overflow-hidden">

            <div id="selector" className="h-20 w-1 rounded-xl bg-senaWashedBlue shrink-0"></div>


            <div className="flex-1 min-w-0">

                <div id="mail-card-tags" className="flex items-start justify-between gap-2 flex-wrap">
                    <div className="text-xl font-black">
                        Información del solicitante
                    </div>
                </div>

                <div className="flex">
                    <UserCircleIcon className="size-24" />
                    <div>
                        <div>
                            <div>Solicitante</div>
                            <div>{currentMail.sender_name}</div>
                        </div>
                    </div>
                </div>

                <div id="mail-card-content" className="mt-2 mb-3 min-w-0">
                    <h3 id="mail-card-subject" className="font-semibold truncate">
                        Queja generalizada
                    </h3>
                    <p
                        id="mail-card-description"
                        className="text-gray-600 text-sm overflow-hidden text-ellipsis line-clamp-2"
                    >
                        Instructor de la ficha 912221043 lleva 4 semanas sin asistir a clases
                    </p>
                </div>


                <div id="mail-card-footer" className="flex justify-end min-w-0">
                    <DocumentTextIcon className="w-5 shrink-0" />
                </div>
            </div>
        </div>
    );
}
