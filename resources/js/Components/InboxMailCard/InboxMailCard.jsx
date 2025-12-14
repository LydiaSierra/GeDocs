import {DocumentTextIcon, UserCircleIcon} from "@heroicons/react/24/solid";
import {useContext} from "react";
import {MailContext} from "@/Pages/Inbox.jsx";

export default function InboxMailCard({card}) {

    const {selectedMail, setSelectedMail} = useContext(MailContext);


    return (<div
        className="w-full p-4 border border-senaWashedBlue bg-white rounded-lg flex items-center gap-3 mb-3 overflow-hidden cursor-pointer"
        onClick={() => {
            setSelectedMail(card.id);
            console.log(selectedMail);
        }}>

        <div id="selector" className="h-20 w-1 rounded-xl bg-senaWashedBlue shrink-0"></div>


        <div className="flex-1 min-w-0">

            <div
                id="mail-card-tags"
                className="flex flex-wrap items-start justify-between gap-2"
            >
                <div className="flex items-center gap-2 min-w-0 flex-wrap">
                    <div
                        id="mail-card-type"
                        className="bg-gray-200 py-1 px-2 rounded-md text-sm shrink-0"
                    >
                        {
                            (card.request_type)
                        }
                    </div>
                    <div
                        id="mail-card-serial"
                        className="text-sm truncate max-w-[80px] sm:max-w-[120px]"
                    >
                        {card.id}
                    </div>
                    <div id="mail-card-date" className="text-sm shrink-0">
                        {new Date(card.created_at).toLocaleDateString()}
                    </div>
                </div>
                <div className="text-right text-sm shrink-0">
                    <div>Límite</div>
                    <div>jueputa</div>
                </div>
            </div>


            <div id="mail-card-content" className="mt-2 mb-3 min-w-0">
                <h3
                    id="mail-card-subject"
                    className="font-semibold truncate"
                >
                    {card.affair}
                </h3>
                <p
                    id="mail-card-description"
                    className="text-gray-600 text-sm overflow-hidden text-ellipsis line-clamp-1"
                >
                    {card.description}
                </p>
            </div>


            <div
                id="mail-card-footer"
                className="flex justify-between items-center min-w-0"
            >
                <div
                    id="mail-card-sender"
                    className="flex items-center gap-1 min-w-0"
                >
                    <UserCircleIcon className="w-5 shrink-0"/>
                    <div className="truncate text-sm max-w-[120px] sm:max-w-[200px]">
                        {card.user_id}
                    </div>
                </div>
                <DocumentTextIcon className="w-5 shrink-0"/>
            </div>
        </div>
    </div>);
}
