import { UserContext } from "@/context/UserContext/UserContext";
import React, { useContext } from "react";
import { ArrowUturnLeftIcon, CameraIcon } from "@heroicons/react/24/solid";

function UserEdit() {
    const { idSelected, setidSelected, edit, setEdit, isDelete, setIsDelete } =
        useContext(UserContext);

    return (
        <div
            className={`modal ${idSelected ? "modal-open" : ""} w-full h-full `}
        >
            <div className="w-[50%] h-[75%] bg-white flex flex-col gap-5 relative rounded-md px-5 py-12 ">
                <button
                    className="btn btn-md btn-circle btn-ghost absolute left-2 top-2"
                    onClick={() => setEdit(false)}
                >
                    <ArrowUturnLeftIcon className="w-5 h-5" />
                </button>

                <h3 className="font-semibold text-2xl w-full text-start">
                    {idSelected.roles[0]?.name === "Instructor"
                        ? "Editar Instructor"
                        : "Editar Aprendiz"}
                </h3>

                <div className=" w-full h-[95%] rounded-lg flex bg-[#F3F3F3] flex-col items-center justify-center gap-4">
                    <div className="w-full h-auto flex flex-row justify-center items-center gap-4 relative">
                        <img
                            className="w-18 h-18 rounded-full "
                            alt="profile pic"
                            src="/images/girl-pic.jpg"
                        />
                        <div className="w-auto flex justify-start">
                            <h1 className="font-semibold w-full text-[20px] text-start">
                                {idSelected.name}
                            </h1>
                        </div>
                        <CameraIcon className="w-6 h-6 absolute fill-primary z-1 top-12 left-73 cursor-pointer" />
                    </div>

                    <div className="w-full h-[62%] grid grid-cols-2 grid-rows-3 gap-3 rounded-lg px-4 pb-4">
                        <div className="rounded flex flex-col items-start justify-start">
                            <h1 className="font-light text-[17px]">Nombres</h1>
                            <input
                                type="text"
                                className="w-[85%] h-[50%] border-solid focus:outline-none  border border-[#D9D9D9] rounded-lg p-1 text-[] bg-white"
                                value={idSelected.name.split(" ")[0]}
                            ></input>
                        </div>

                        <div className="rounded flex flex-col justify-start">
                            <h1 className="font-light text-[17px]">
                                Apellidos
                            </h1>
                            <input
                                type="text"
                                className="w-[85%] h-[50%] border-solid focus:outline-none  border border-[#D9D9D9] rounded-lg p-1 text-[] bg-white"
                                value={idSelected.name.split(" ")[1]}
                            ></input>
                        </div>

                        <div className="rounded flex flex-col justify-start">
                            <h1 className="font-light text-[17px]">
                                Tipo de Documento
                            </h1>
                            <select className="w-[85%] outline-none h-[50%] border-solid cursor-pointer hover:outline-none border border-[#D9D9D9] rounded-lg p-1 text-[] bg-white">
                                <option value="1">Seleccione Una Opcion</option>
                                <option value="1">Cedula de Ciudadania</option>
                                <option value="1">Trajeta de Identidad</option>
                            </select>
                        </div>

                        <div className="rounded flex flex-col justify-start">
                            <h1 className="font-light text-[17px]">
                                Correo Electronico
                            </h1>
                            <input
                                type="text"
                                className="w-[85%] h-[50%] border-solid focus:outline-none  border border-[#D9D9D9] rounded-lg p-1 text-[] bg-white"
                                value={idSelected.email}
                            ></input>
                        </div>

                        <div className="rounded flex flex-col justify-start">
                            <h1 className="font-light text-[17px]">Estado</h1>
                            <select className="w-[85%] outline-none h-[50%]  border-solid cursor-pointer hover:outline-none border border-[#D9D9D9] rounded-lg p-1 text-[] bg-white">
                                <option value="1">Seleccione un Estado</option>
                                <option value="1">Pendiente</option>
                                <option value="1">Activo</option>
                            </select>
                        </div>
                    </div>

                    <div className="w-full h-auto flex flex-row justify-center">
                        <button
                            className="w-25 h-8 rounded-[5px] bg-primary text-[18px] cursor-pointer text-white border-none font-semibold text-center hover:border-solid border-2 hover:border-primary hover:bg-white hover:text-primary"
                            onClick={() => {
                                setIsDelete(false);
                                setEdit(true);
                            }}
                        >
                            Guardar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserEdit;
