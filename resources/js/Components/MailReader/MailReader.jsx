import SenderInformationCard from "@/components/SenderInformationCard/SenderInformationCard";
import { MailContext } from "@/context/MailContext/MailContext";
import { useContext, useEffect, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import card from "daisyui/components/card/index.js";

export function MailReader() {

    const { mailCards, selectedMail, setSelectedMail } = useContext(MailContext);
    const [currentMail, setCurrentMail] = useState(mailCards[0]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (mailCards.length > 0 && currentMail?.id !== mailCards[0].id) {
            setCurrentMail(mailCards[0]);
        }
    }, [mailCards]);

    useEffect(() => {
        if (!mailCards.length || !selectedMail) return;

        const index = mailCards.findIndex(item => item.id === selectedMail);
        if (index === -1) return;

        setCurrentIndex(index);

        // Evita re-render innecesario
        if (currentMail?.id !== mailCards[index].id) {
            setCurrentMail(mailCards[index]);
        }

    }, [selectedMail, mailCards]);

    if (!currentMail) {
        return (
            <div className="h-full w-full flex items-center justify-center text-gray-500">
                Cargando correo...
            </div>
        );
    }


    return (
        <div className={`
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
  `}>

            <button
                className="flex items-center gap-2 mb-4 lg:hidden text-gray-600"
                onClick={() => setSelectedMail(null)}
            >
                <ArrowLeftIcon className="w-5" />
                Volver
            </button>

            <div id="tag-container" className="flex flex-wrap gap-2">
                <div className="px-4 py-0.5 bg-senaGreen rounded-md font-bold text-white bg-primary">
                    {currentMail.request_type}
                </div>
            </div>


            <div id="serial-data" className="flex flex-wrap gap-3 my-2">
                <div className="font-bold text-lg">ID: {currentMail.id}</div>
                <div className="font-bold text-lg">{new Date(currentMail.created_at).toLocaleDateString()}</div>
            </div>


            <div className="mb-3">
                <h2 className="font-bold text-xl">{currentMail.affair}</h2>
            </div>


            <SenderInformationCard currentMail={currentMail}/>


            <div id="email-description" className="mt-4">
                <div className="font-bold text-lg mb-2">Descripción</div>
                <p className="text-justify">
                    {currentMail.description}
                </p>
            </div>


            <div className="my-3">
                <div className="font-bold text-lg mb-2">Soportes Adjuntos</div>
                <img className="w-40" src="/images/attached-pdf.png" alt="" />
            </div>


            <div className="w-full flex flex-col">
                <textarea
                    className="textarea w-full rounded-lg focus:outline-gray-200 my-2"
                    placeholder="Escribe tu respuesta..."
                />
                <button className="btn bg-senaGreen p-2 hover:bg-senaWashedGreen text-white rounded-lg self-end">
                    Enviar respuesta
                </button>
            </div>
        </div>
    );
}
