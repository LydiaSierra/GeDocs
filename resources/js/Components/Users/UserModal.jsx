import { UserContext } from "@/context/UserContext/UserContext";
import React, { useContext } from "react";
import UserEdit from "./userModal/UserEdit";
import DeleteConfirm from "./DeleteConfirm";

function UserModal() {
    const {
        idSelected,
        setidSelected,
        edit,
        setEdit,
        setIsDelete,
    } = useContext(UserContext);

    if (!idSelected) return null;

    if (edit) {
        return <UserEdit />;
    }

    const roleName = idSelected.roles?.[0]?.name || "Usuario";

    return (
        <div className={`modal modal-open w-full h-full`}>
            <div className="md:w-[50%] max-w-[90%] h-[70%] bg-white flex flex-col gap-5 relative rounded-md lg:p-10 p-3">
                
                {/* Botón cerrar */}
                <button
                    className="btn btn-sm lg:btn-md btn-circle btn-ghost absolute right-2 top-2"
                    onClick={() => setidSelected(null)}
                >
                    ✕
                </button>

                <h3 className="font-semibold lg:text-2xl text-lg w-full text-start">
                    {roleName === "Instructor"
                        ? "Detalles de Instructor"
                        : roleName === "Dependencia"
                        ? "Detalles de Dependencia"
                        : "Detalles de Usuario"}
                </h3>

                <div className="w-full h-full flex flex-row items-start justify-between">
                    
                    {/* Sidebar desktop */}
                    <div className="w-[25%] h-full hidden lg:block">
                        <div className="w-full h-full flex flex-col gap-4">
                            <img
                                className="w-full h-32 sm:h-36 lg:h-48 rounded-md object-cover"
                                alt="profile pic"
                                src={idSelected.profile_photo || "/images/default-user-icon.png"}
                            />
                            <div className="w-full flex flex-col justify-start">
                                <h1 className="font-medium text-sm sm:text-base lg:text-lg text-start">
                                    {idSelected.name}
                                </h1>
                                <h3 className="font-light text-xs sm:text-sm lg:text-base text-start">
                                    {roleName}
                                </h3>
                            </div>
                        </div>
                    </div>

                    {/* Contenido */}
                    <div className="lg:w-[70%] w-full h-[90%] flex flex-col justify-start gap-4 items-start rounded-lg">
                        
                        {/* Header móvil */}
                        <div className="w-full lg:hidden block">
                            <div className="flex items-center p-2 gap-3 border-b-2">
                                <img
                                    className="w-8 h-8 rounded-full object-cover"
                                    alt="profile pic"
                                    src={idSelected.profile_photo || "/images/default-user-icon.png"}
                                />
                                <span className="font-semibold">
                                    {idSelected.name}
                                </span>
                            </div>
                        </div>

                        {/* Información */}
                        <div className="w-full h-[80%] grid grid-cols-2 gap-4 bg-[#F3F3F3] rounded-lg px-2 pb-2 overflow-y-auto">
                            
                            <InfoItem label="Nombre" value={idSelected.name} />

                            <InfoItem
                                label="Tipo de Documento"
                                value={
                                    idSelected.type_document === "CC"
                                        ? "Cédula de Ciudadanía"
                                        : "Tarjeta de Identidad"
                                }
                            />

                            <InfoItem
                                label="Número de Documento"
                                value={idSelected.document_number}
                            />

                            <InfoItem
                                label="Correo Electrónico"
                                value={idSelected.email}
                            />

                            <InfoItem
                                label="Fecha de Creación"
                                value={new Date(
                                    idSelected.created_at
                                ).toLocaleDateString()}
                            />

                            <InfoItem
                                label="Estado"
                                value={
                                    idSelected.status === "pending"
                                        ? "Pendiente"
                                        : "Activo"
                                }
                            />

                            <div className="bg-gray-100 lg:p-4 p-2 rounded flex flex-col items-start col-span-2">
                                <h1 className="font-light text-xs sm:text-sm lg:text-base">
                                    {roleName === "Instructor"
                                        ? "Fichas Asignadas"
                                        : "Ficha"}
                                </h1>

                                <div className="font-semibold text-xs sm:text-sm lg:text-base flex flex-col gap-1">
                                    {idSelected.sheet_numbers?.length > 0 ? (
                                        idSelected.sheet_numbers.map((item) => (
                                            <p key={item.number}>
                                                {item.number}
                                            </p>
                                        ))
                                    ) : (
                                        <p>Sin fichas</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="w-full flex flex-row lg:justify-start justify-center gap-6">
                            <button
                                className="px-4 py-1 rounded bg-primary text-white font-semibold hover:border hover:border-primary hover:bg-white hover:text-primary transition"
                                onClick={() => {
                                    setIsDelete(false);
                                    setEdit(true);
                                }}
                            >
                                Editar
                            </button>

                            <button
                                className="px-4 py-1 rounded bg-[#EA4649] text-white font-semibold hover:border hover:border-[#EA4649] hover:bg-white hover:text-[#EA4649] transition"
                                onClick={() =>
                                    document
                                        .getElementById("my_modal_7")
                                        ?.showModal()
                                }
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
}


const InfoItem = ({ label, value }) => (
    <div className="bg-gray-100 lg:p-4 p-2 rounded flex flex-col items-start">
        <h1 className="font-light text-xs sm:text-sm lg:text-base">
            {label}
        </h1>
        <h2 className="font-semibold text-xs sm:text-sm lg:text-base">
            {value || "—"}
        </h2>
    </div>
);

export default UserModal;
