
import Sidebar from "@/Components/Sidebar/Sidebar.jsx";
import Inbox from "@/Pages/Inbox";
import {MailReader} from "@/Components/MailReader/MailReader";
import { PaperClipIcon } from "@heroicons/react/24/solid";

export default function Form() {
    return (

        <div className="bg-senaGray min-h-screen flex flex-col">

            <div className="flex flex-1 justify-center">
                <div className="flex flex-col items-center bg-white m-5 rounded-lg p-5 w-full max-w-6xl">
                    <h1 className="font-bold text-2xl text-senaDarkGreen text-center mb-4">
                        Diligenciar PQRS
                    </h1>

                    <form
                        action=""
                        className="w-full flex flex-col items-center"
                    >

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-3 w-full md:w-3/5">
                            <div>
                                <label
                                    className="text-md font-light text-gray-600"
                                    htmlFor="document-type"
                                >
                                    Tipo de Documento
                                </label>
                                <select
                                    id="document-type"
                                    defaultValue=" "
                                    className="select w-full"
                                >
                                    <option disabled> </option>
                                    <option>CC</option>
                                    <option>TI</option>
                                    <option>CE</option>
                                </select>
                            </div>
                            <div>
                                <label
                                    className="text-md font-light text-gray-600"
                                    htmlFor="document-number"
                                >
                                    Número de Documento
                                </label>
                                <input
                                    id="document-number"
                                    type="text"
                                    className="input w-full"
                                />
                            </div>
                            <div>
                                <label
                                    className="text-md font-light text-gray-600"
                                    htmlFor="full-name"
                                >
                                    Nombre Completo
                                </label>
                                <input
                                    id="full-name"
                                    type="text"
                                    className="input w-full"
                                />
                            </div>
                            <div>
                                <label
                                    className="text-md font-light text-gray-600"
                                    htmlFor="email-address"
                                >
                                    Correo Electrónico
                                </label>
                                <input
                                    id="email-address"
                                    type="text"
                                    className="input w-full"
                                />
                            </div>
                        </div>


                        <div className="w-full md:w-3/5">
                            <label
                                className="text-md font-light text-gray-600"
                                htmlFor="subject"
                            >
                                Asunto
                            </label>
                            <input id="subject" type="text" className="input w-full" />
                        </div>

                        <div className="w-full md:w-3/5 my-3">
                            <label
                                className="text-md font-light text-gray-600"
                                htmlFor="request-description"
                            >
                                Descripción de la solicitud
                            </label>
                            <textarea
                                id="request-description"
                                className="textarea w-full my-2"
                                placeholder="Escribe aquí tu solicitud"
                                rows='15'
                            ></textarea>
                        </div>


                        <div className="flex w-full md:w-3/5 items-center gap-2">
                            <button className="btn">Adjuntar Soportes</button>
                            <PaperClipIcon className="size-5" />
                        </div>


                        <div className="flex w-full md:w-3/5 my-3 gap-3 items-start">
                            <input
                                type="checkbox"
                                defaultChecked
                                className="checkbox checkbox-success mt-1"
                            />
                            <label>
                                Autorizo el tratamiento de mis datos personales
                                conforme a la Ley 1581 de 2012
                            </label>
                        </div>


                        <button
                            type="submit"
                            className="btn bg-senaGreen text-white font-bold px-16 rounded-lg"
                        >
                            Enviar PQRS
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
