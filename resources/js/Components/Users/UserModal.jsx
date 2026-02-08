import { UserContext } from "@/context/UserContext/UserContext";
import React, { useContext } from "react";
import UserEdit from "./userModal/UserEdit";
import DeleteConfirm from "./DeleteConfirm";

function UserModal() {
    const { idSelected, setidSelected, edit, setEdit, isDelete, setIsDelete } =
        useContext(UserContext);

    if (idSelected !== null) {
        if (edit === false) {
            return (
                <div
                    className={`modal ${
                        idSelected ? "modal-open" : ""
                    } w-full h-full `}
                >
                    <div className="md:w-[50%] max-w-[90%] h-[70%] bg-white flex flex-col gap-5 relative rounded-md lg:p-10 p-3">
                        <button
                            className="btn btn-sm lg:btn-md btn-circle btn-ghost absolute right-2 top-2"
                            onClick={() => setidSelected(null)}
                        >
                            ✕
                        </button>

                        <h3 className="font-semibold lg:text-2xl text-lg w-full text-start">
                            {idSelected.roles[0]?.name === "Instructor"
                                ? "Detalles de Instructor"
                                : "Detalles de Aprendiz"}
                        </h3>

                        <div className=" w-full h-full flex flex-row items-start justify-between">
                            <div className="w-[25%] h-full hidden lg:block">
                                <div className="w-full h-full flex flex-col gap-4">
                                    <img
                                        className="w-full h-32 sm:h-36 lg:h-48 rounded-md object-cover"
                                        alt="profile pic"
                                        src="/images/girl-pic.jpg"
                                    />
                                    <div className="w-full flex flex-col justify-start">
                                        <h1 className="font-medium text-sm sm:text-base lg:text-lg text-start">
                                            {idSelected.name}
                                        </h1>
                                        <h3 className="font-light text-xs sm:text-sm lg:text-base text-start">
                                            {idSelected.roles[0].name}
                                        </h3>
                                    </div>
                                </div>
                            </div>

                            <div
                                className="lg:w-[70%] w-full h-[90%] lg:bg-none bg-white flex flex-col justify-start
                             lg:gap-5 xl:gap-5 gap-3 items-start rounded-lg"
                            >
                                <div className="w-full h-auto lg:hidden block">
                                    <div className="w-full h-auto flex flex-row justify-start items-center p-2 gap-3 border-b-2 border-solid">
                                        <img
                                            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover"
                                            alt="profile pic"
                                            src="/images/girl-pic.jpg"
                                        />
                                    </div>
                                </div>

                                <div className="w-full h-[80%] xl:h-[90%] grid grid-cols-2 grid-rows-4 gap-4 bg-[#F3F3F3] rounded-lg px-2 pb-2 overflow-y-scroll">
                                    <div className="bg-gray-100 lg:p-4 p-1 rounded flex flex-col items-start">
                                        <h1 className="font-light text-xs sm:text-sm lg:text-base">
                                            Nombre
                                        </h1>
                                        <h2 className="font-semibold text-xs sm:text-sm lg:text-base">
                                            {idSelected.name}
                                        </h2>
                                    </div>

                                    <div className="bg-gray-100 lg:p-4 p-1 rounded flex flex-col items-start">
                                        <h1 className="font-light text-xs sm:text-sm lg:text-base">
                                            Tipo de Documento
                                        </h1>
                                        <h2 className="font-semibold text-xs sm:text-sm lg:text-base">
                                            {idSelected.type_document === "CC"
                                                ? "Cedula de Ciudadania"
                                                : "Tarjeta de Identidad"}
                                        </h2>
                                    </div>

                                    <div className="bg-gray-100 lg:p-4 p-1 rounded flex flex-col items-start">
                                        <h1 className="font-light text-xs sm:text-sm lg:text-base">
                                            Numero de Documento
                                        </h1>
                                        <h2 className="font-semibold text-xs sm:text-sm lg:text-base">
                                            {idSelected.document_number}
                                        </h2>
                                    </div>

                                    <div className="bg-gray-100 lg:p-4 p-1 rounded flex flex-col items-start">
                                        <h1 className="font-light text-xs sm:text-sm lg:text-base">
                                            Correo Electronico
                                        </h1>
                                        <h2 className="font-semibold text-xs sm:text-sm lg:text-base">
                                            {idSelected.email}
                                        </h2>
                                    </div>

                                    <div className="bg-gray-100 lg:p-4 p-1 rounded flex flex-col items-start">
                                        <h1 className="font-light text-xs sm:text-sm lg:text-base">
                                            Fecha de Creacion
                                        </h1>
                                        <h2 className="font-semibold text-xs sm:text-sm lg:text-base">
                                            {new Date(
                                                idSelected.created_at
                                            ).toLocaleDateString()}
                                        </h2>
                                    </div>

                                    <div className="bg-gray-100 lg:p-4 p-1 rounded flex flex-col items-start">
                                        <h1 className="font-light text-xs sm:text-sm lg:text-base">
                                            Estado
                                        </h1>
                                        <h2 className="font-semibold text-xs sm:text-sm lg:text-base">
                                            {idSelected.status === "pending"
                                                ? "Pendiente"
                                                : "Activo"}
                                        </h2>
                                    </div>

                                    <div className="bg-gray-100 lg:p-4 p-1 rounded flex flex-col items-start">
                                        <h1 className="font-light text-xs sm:text-sm lg:text-base">
                                            {idSelected.roles[0].name ===
                                            "Instructor"
                                                ? "Fichas Asignadas"
                                                : "Ficha"}
                                        </h1>
                                        <h2 className="font-semibold text-xs sm:text-sm lg:text-base flex flex-col gap-1">
                                            {idSelected.sheet_numbers.length > 0
                                                ? idSelected.sheet_numbers.map(
                                                      (item) => (
                                                          <p key={item.number}>
                                                              {item.number}
                                                          </p>
                                                      )
                                                  )
                                                : "Sin Fichas"}
                                        </h2>
                                    </div>
                                </div>

                                <div className="w-full h-[10%] flex flex-row lg:justify-start justify-center lg:pl-4 pl-0 gap-10">
                                    <button
                                        className="lg:w-25 w-18 sm:w-20 lg:h-8 h-6 sm:h-7 rounded-[5px] bg-primary text-xs sm:text-sm lg:text-base cursor-pointer text-white border-none font-semibold text-center hover:border-solid border-2 hover:border-primary hover:bg-white hover:text-primary"
                                        onClick={() => {
                                            setIsDelete(false);
                                            setEdit(true);
                                        }}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="lg:w-25 w-18 sm:w-20 lg:h-8 h-6 sm:h-7 rounded-[5px] bg-[#EA4649] text-xs sm:text-sm lg:text-base cursor-pointer text-white border-none font-semibold text-center hover:border-solid border-2 hover:border-[#EA4649] hover:bg-white hover:text-[#EA4649]"
                                        onClick={() => {
                                            document
                                                .getElementById("my_modal_7")
                                                .showModal();
                                        }}
                                    >
                                        Borrar
                                    </button>
                                </div>
                            </div>
                            <DeleteConfirm />
                        </div>
                    </div>
                </div>
            );
        } else {
            return <UserEdit />;
        }
    }
}

export default UserModal;
