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
                    <div className="w-[50%] h-[70%] bg-white flex flex-col gap-5 relative rounded-md p-10">
                        <button
                            className="btn btn-md btn-circle btn-ghost absolute right-2 top-2"
                            onClick={() => setidSelected(null)}
                        >
                            ✕
                        </button>

                        <h3 className="font-semibold text-2xl w-full text-start">
                            {idSelected.roles[0]?.name === "Instructor"
                                ? "Detalles de Instructor"
                                : "Detalles de Aprendiz"}
                        </h3>

                        <div className=" w-full h-full flex flex-row items-center justify-between">
                            <div className="w-[25%] h-full flex flex-col gap-4">
                                <img
                                    className="w-full h-41 rounded-md "
                                    alt="profile pic"
                                    src="/images/girl-pic.jpg"
                                />
                                <div className="w-full flex flex-col justify-start">
                                    <h1 className="font-medium text-[17px] text-start">
                                        {idSelected.name}
                                    </h1>
                                    <h3 className="font-light text-[13px] text-start">
                                        {idSelected.roles[0].name}
                                    </h3>
                                </div>
                            </div>

                            <div className="w-[70%] h-full flex flex-col justify-start gap-5 items-center rounded-lg">
                                <div className="w-full h-[80%] grid grid-cols-2 grid-rows-4 gap-4 bg-[#F3F3F3] rounded-lg px-2 overflow-y-scroll">
                                    <div className="bg-gray-100 p-4 rounded flex flex-col items-start">
                                        <h1 className="font-light text-[17px]">
                                            Nombre
                                        </h1>
                                        <h2 className="font-semibold text-[18px]">
                                            {idSelected.name}
                                        </h2>
                                    </div>

                                    <div className="bg-gray-100 p-4 rounded flex flex-col items-start">
                                        <h1 className="font-light text-[17px]">
                                            Tipo de Documento
                                        </h1>
                                        <h2 className="font-semibold text-[18px]">
                                            {idSelected.type_document === "CC"
                                                ? "Cedula de Ciudadania"
                                                : "Tarjeta de Identidad"}
                                        </h2>
                                    </div>

                                    <div className="bg-gray-100 p-4 rounded flex flex-col items-start">
                                        <h1 className="font-light text-[17px]">
                                            Numero de Documento
                                        </h1>
                                        <h2 className="font-semibold text-[18px]">
                                            {idSelected.document_number}
                                        </h2>
                                    </div>

                                    <div className="bg-gray-100 p-4 rounded flex flex-col items-start">
                                        <h1 className="font-light text-[17px]">
                                            Correo Electronico
                                        </h1>
                                        <h2 className="font-semibold text-[18px]">
                                            {idSelected.email}
                                        </h2>
                                    </div>

                                    <div className="bg-gray-100 p-4 rounded flex flex-col items-start">
                                        <h1 className="font-light text-[17px]">
                                            Fecha de Creacion
                                        </h1>
                                        <h2 className="font-semibold text-[18px]">
                                            {new Date(
                                                idSelected.created_at
                                            ).toLocaleDateString()}
                                        </h2>
                                    </div>

                                    <div className="bg-gray-100 p-4 rounded flex flex-col items-start">
                                        <h1 className="font-light text-[17px]">
                                            Estado
                                        </h1>
                                        <h2 className="font-semibold text-[18px]">
                                            {idSelected.status === "pending"
                                                ? "Pendiente"
                                                : "Activo"}
                                        </h2>
                                    </div>

                                    <div className="bg-gray-100 p-4 rounded flex flex-col items-start">
                                        <h1 className="font-light text-[17px]">
                                            {idSelected.roles[0].name === "Instructor"
                                                ? "Fichas Asignadas"
                                                : "Ficha"}
                                        </h1>
                                        <h2 className="font-semibold text-[18px] flex flex-col gap-1">
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

                                <div className="w-full h-[10%] flex flex-row justify-start pl-4 gap-10">
                                    <button
                                        className="w-25 h-8 rounded-[5px] bg-primary text-[18px] cursor-pointer text-white border-none font-semibold text-center hover:border-solid border-2 hover:border-primary hover:bg-white hover:text-primary"
                                        onClick={() => {
                                            setIsDelete(false);
                                            setEdit(true);
                                        }}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="w-25 h-8 rounded-[5px] bg-[#EA4649] text-[18px] cursor-pointer text-white border-none font-semibold text-center hover:border-solid border-2 hover:border-[#EA4649] hover:bg-white hover:text-[#EA4649]"
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
