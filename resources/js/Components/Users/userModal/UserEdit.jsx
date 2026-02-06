import { UserContext } from "@/context/UserContext/UserContext";
import React, { useContext, useState, useEffect } from "react";
import { ArrowUturnLeftIcon, CameraIcon } from "@heroicons/react/24/solid";

function UserEdit() {
    const { idSelected, setEdit, UpdateInfo, loadingEdit } =
        useContext(UserContext);

    const [nombre, setNombre] = useState("");
    const [documento, setDocumento] = useState("");
    const [numero_documento, setNumeroDocumento] = useState("");
    const [email, setEmail] = useState("");
    const [estado, setEstado] = useState("");

    useEffect(() => {
        if (idSelected) {
            setNombre(idSelected.name);
            setDocumento(idSelected.type_document);
            setNumeroDocumento(idSelected.document_number);
            setEmail(idSelected.email);
            setEstado(idSelected.status);
        }
    }, [idSelected]);

    return (
        <div
            className={`modal ${idSelected ? "modal-open" : ""} w-full h-full ${
                loadingEdit ? "cursor-not-allowed" : ""
            }`}
        >
            <div className="w-[90%] md:w-[70%] lg:w-[50%] h-[90%] md:h-[90%] lg:h-[75%] bg-white flex flex-col gap-6 relative rounded-md px-6 py-10">
                {/* BOTÓN VOLVER */}
                <button
                    className="btn btn-circle btn-ghost absolute left-3 top-2"
                    onClick={() => setEdit(false)}
                >
                    <ArrowUturnLeftIcon className="w-5 h-5" />
                </button>

                {/* TÍTULO */}
                <h3 className="font-semibold text-xl lg:text-2xl">
                    {idSelected?.roles[0]?.name === "Instructor"
                        ? "Editar Instructor"
                        : "Editar Aprendiz"}
                </h3>

                {/* CONTENIDO */}
                <div className="w-full lg:h-[90%] h-[92%] flex flex-col items-center lg:gap-5 gap-2 bg-[#F3F3F3] rounded-lg py-4">
                    {/* PERFIL */}
                    <div className="flex flex-col lg:flex-row items-center lg:gap-4 gap-2 relative">
                        <div className="relative">
                            <img
                                className="lg:w-15 w-14 lg:h-15 h-14 rounded-full"
                                alt="profile pic"
                                src="/images/girl-pic.jpg"
                            />
                            <CameraIcon className="lg:w-6 w-5 lg:h-6 h-6 absolute bottom-0 right-0 text-primary cursor-pointer" />
                        </div>
                        <h1 className="font-semibold text-lg">
                            {idSelected?.name}
                        </h1>
                    </div>

                    {/* FORMULARIO */}
                    <div className="w-full h-[70%] grid grid-cols-1 lg:grid-cols-2 lg:gap-4 gap-2 px-4">
                        {/* NOMBRE */}
                        <div className="flex flex-col items-center gap-1">
                            <label className="text-sm text-center md:text-start font-light">
                                Nombres
                            </label>
                            <input
                                type="text"
                                className="lg:w-full w-[80%] lg:h-8 h-7 border border-[#D9D9D9] rounded-lg px-2 text-sm bg-white focus:outline-none"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                            />
                        </div>

                        {/* TIPO DOCUMENTO */}
                        <div className="flex flex-col items-center gap-1">
                            <label className="text-sm font-light">
                                Tipo de Documento
                            </label>
                            <select
                                className="lg:w-full w-[80%] lg:h-8 h-7 border border-[#D9D9D9] rounded-lg px-2 text-sm bg-white focus:outline-none cursor-pointer"
                                value={documento}
                                onChange={(e) => setDocumento(e.target.value)}
                            >
                                <option value="">Seleccione una opción</option>
                                <option value="CC">Cédula de Ciudadanía</option>
                                <option value="TI">Tarjeta de Identidad</option>
                            </select>
                        </div>

                        {/* NÚMERO DOCUMENTO */}
                        <div className="flex flex-col items-center gap-1">
                            <label className="text-sm font-light">
                                Número de Documento
                            </label>
                            <input
                                type="text"
                                className="lg:w-full w-[80%] lg:h-8 h-7 border border-[#D9D9D9] rounded-lg px-2 text-sm bg-white focus:outline-none"
                                value={numero_documento}
                                onChange={(e) =>
                                    setNumeroDocumento(e.target.value)
                                }
                            />
                        </div>

                        {/* EMAIL */}
                        <div className="flex flex-col items-center gap-1">
                            <label className="text-sm font-light">
                                Correo Electrónico
                            </label>
                            <input
                                type="email"
                                className="lg:w-full w-[80%] lg:h-8 h-7 border border-[#D9D9D9] rounded-lg px-2 text-sm bg-white focus:outline-none"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {/* ESTADO */}
                        <div className="flex flex-col items-center gap-1">
                            <label className="text-sm font-light">Estado</label>
                            <select
                                className="lg:w-full w-[80%] lg:h-8 h-7 border border-[#D9D9D9] rounded-lg px-2 text-sm bg-white focus:outline-none cursor-pointer"
                                value={estado}
                                onChange={(e) => setEstado(e.target.value)}
                            >
                                <option value="">Seleccione un estado</option>
                                <option value="pending">Pendiente</option>
                                <option value="active">Activo</option>
                            </select>
                        </div>
                    </div>

                    {/* BOTÓN */}
                    <div className="w-full flex justify-center mt-4">
                        <button
                            className="lg:px-4 px-2  lg:h-8 h-7 lg:text-md text-sm rounded-md bg-primary 
                            text-white font-semibold hover:bg-white hover:text-primary border-2 border-primary transition"
                            onClick={() => {
                                UpdateInfo(
                                    nombre,
                                    documento,
                                    numero_documento,
                                    email,
                                    estado,
                                    idSelected.id
                                );
                            }}
                        >
                            Guardar
                        </button>
                    </div>
                </div>
            </div>

            {/* LOADING */}
            {loadingEdit && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-white border-2 border-primary text-primary px-4 py-2 rounded-md z-50">
                    Actualizando usuario...
                </div>
            )}
        </div>
    );
}

export default UserEdit;
