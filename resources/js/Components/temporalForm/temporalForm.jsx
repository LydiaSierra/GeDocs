import Navbar from "@/components/Navbar/Navbar";

export default function temporalForm() {
    return (
        <div className="bg-senaGray min-h-screen flex flex-col">
            <Navbar />

            <div className="flex flex-1 justify-center items-center">
                <div className="flex flex-col items-center bg-white rounded-lg p-10 w-full max-w-2xl shadow-md">

                    <h1 className="font-bold text-2xl text-senaDarkGreen text-center mb-4">
                        Guardar Archivo
                    </h1>

                    <form className="w-full flex flex-col gap-6">

                        <div className="w-full">
                            <label
                                className="text-md font-light text-gray-600"
                                htmlFor="full-name"
                            >
                                Nombre del Archivo
                            </label>
                            <input
                                id="full-name"
                                type="text"
                                className="input w-full  py-2 mt-1"
                                placeholder="Escribe el nombre del archivo"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-md font-light text-gray-600" htmlFor="seccion">
                                    Sección
                                </label>
                                <select
                                    id="seccion"
                                    defaultValue=""
                                    className="select w-full px-4 py-2 mt-1 "
                                >
                                    <option value="" disabled>Seleccione...</option>
                                    <option>Crimson</option>
                                    <option>Amber</option>
                                    <option>Velvet</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-md font-light text-gray-600" htmlFor="subseccion">
                                    Sub Sección
                                </label>
                                <select
                                    id="subseccion"
                                    defaultValue=""
                                    className="select w-full px-4 py-2 mt-1 "
                                >
                                    <option value="" disabled>Seleccione...</option>
                                    <option>Crimson</option>
                                    <option>Amber</option>
                                    <option>Velvet</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-md font-light text-gray-600" htmlFor="serie">
                                    Serie
                                </label>
                                <select
                                    id="serie"
                                    defaultValue=""
                                    className="select w-full px-4 py-2 mt-1"
                                >
                                    <option value="" disabled>Seleccione...</option>
                                    <option>Crimson</option>
                                    <option>Amber</option>
                                    <option>Velvet</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-md font-light text-gray-600" htmlFor="subserie">
                                    Sub Serie
                                </label>
                                <select
                                    id="subserie"
                                    defaultValue=""
                                    className="select w-full px-4 py-2 mt-1 "
                                >
                                    <option value="" disabled>Seleccione...</option>
                                    <option>Crimson</option>
                                    <option>Amber</option>
                                    <option>Velvet</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-center mt-6">
                            <button
                                type="submit"
                                className="bg-senaGreen cursor-pointer hover:bg-green-700 text-white font-bold py-2 px-16 rounded-lg transition"
                            >
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
