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
            <div className="w-[90%] md:w-[70%] lg:w-[50%] h-[90%] md:h-[90%] lg:h-[70%] bg-white flex flex-col gap-6 relative rounded-md px-6 py-10">
                {/* BOTÓN VOLVER */}
                <button
                    className="btn btn-circle btn-ghost absolute left-3 top-3"
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
                <div className="w-full flex flex-col items-center lg:gap-6 gap-3 bg-[#F3F3F3] rounded-lg py-6">
                    {/* PERFIL */}
                    <div className="flex flex-col lg:flex-row items-center gap-4 relative">
                        <div className="relative">
                            <img
                                className="w-20 h-20 rounded-full"
                                alt="profile pic"
                                src="/images/girl-pic.jpg"
                            />
                            <CameraIcon className="w-6 h-6 absolute bottom-0 right-0 text-primary cursor-pointer" />
                        </div>
                        <h1 className="font-semibold text-lg">
                            {idSelected?.name}
                        </h1>
                    </div>

                    {/* FORMULARIO */}
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 px-4">
                        {/* NOMBRE */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-light">
                                Nombres
                            </label>
                            <input
                                type="text"
                                className="w-full h-10 border border-[#D9D9D9] rounded-lg px-2 text-sm bg-white focus:outline-none"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                            />
                        </div>

                        {/* TIPO DOCUMENTO */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-light">
                                Tipo de Documento
                            </label>
                            <select
                                className="w-full h-10 border border-[#D9D9D9] rounded-lg px-2 text-sm bg-white focus:outline-none cursor-pointer"
                                value={documento}
                                onChange={(e) => setDocumento(e.target.value)}
                            >
                                <option value="">Seleccione una opción</option>
                                <option value="CC">Cédula de Ciudadanía</option>
                                <option value="TI">Tarjeta de Identidad</option>
                            </select>
                        </div>

                        {/* NÚMERO DOCUMENTO */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-light">
                                Número de Documento
                            </label>
                            <input
                                type="text"
                                className="w-full h-10 border border-[#D9D9D9] rounded-lg px-2 text-sm bg-white focus:outline-none"
                                value={numero_documento}
                                onChange={(e) =>
                                    setNumeroDocumento(e.target.value)
                                }
                            />
                        </div>

                        {/* EMAIL */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-light">
                                Correo Electrónico
                            </label>
                            <input
                                type="email"
                                className="w-full h-10 border border-[#D9D9D9] rounded-lg px-2 text-sm bg-white focus:outline-none"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {/* ESTADO */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-light">Estado</label>
                            <select
                                className="w-full h-10 border border-[#D9D9D9] rounded-lg px-2 text-sm bg-white focus:outline-none cursor-pointer"
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
                            className="px-6 h-10 rounded-md bg-primary text-white font-semibold hover:bg-white hover:text-primary border-2 border-primary transition"
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
