import { DocumentTextIcon, UserCircleIcon } from "@heroicons/react/24/solid";

export default function InboxMailCard() {
    return (
        <div className="w-full p-4 border border-senaWashedBlue bg-white rounded-lg flex items-center gap-3 mb-3 overflow-hidden">

            <div id="selector" className="h-20 w-1 rounded-xl bg-senaWashedBlue shrink-0"></div>


            <div className="flex-1 min-w-0">

                <div id="mail-card-tags" className="flex items-start justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap min-w-0">
                        <div id="mail-card-type" className="bg-gray-200 py-1 px-2 rounded-md text-sm shrink-0">
                            Queja
                        </div>
                        <div id="mail-card-serial" className="text-sm truncate">10010025</div>
                        <div id="mail-card-date" className="text-sm shrink-0">08/09/2025</div>
                    </div>
                    <div className="text-right text-sm shrink-0">
                        <div>Límite</div>
                        <div>08/22/2025</div>
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


                <div id="mail-card-footer" className="flex justify-between items-center min-w-0">
                    <div id="mail-card-sender" className="flex items-center gap-1 min-w-0">
                        <UserCircleIcon className="w-5 shrink-0" />
                        <div className="truncate text-sm">Antonio Antoniez</div>
                    </div>
                    <DocumentTextIcon className="w-5 shrink-0" />
                </div>
            </div>
        </div>
    );
}
