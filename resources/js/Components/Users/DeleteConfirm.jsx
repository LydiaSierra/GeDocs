import { UserContext } from "@/context/UserContext/UserContext";
import { useContext } from "react";

function DeleteConfirm() {
    const { DeleteInfo, idSelected } = useContext(UserContext);

    return (
        <dialog id="my_modal_7" className="modal">
            <div className="modal-box lg:w-2/8 w-[90%] ">
                <form method="dialog" className="flex flex-col gap-4">
                    <button className="btn btn-lg btn-circle btn-ghost absolute right-2 top-2">
                        ✕
                    </button>
                    <h1 className="md:text-3xl text-2xl font-medium text-black">
                        ¿Estas seguro de Eliminar el Usuario?
                    </h1>

                    <div className="flex flex-col gap-4">
                        <button
                            className="cursor-pointer lg:w-full w-4/5 lg:h-12 md:h-10 lg:text-2xl self-center text-xl font-semibold bg-white border-solid 
                            text-[#EA4649] lg:rounded-2xl rounded-xl hover:bg-none hover:text-white border-2 border-[#EA4649] hover:bg-[#EA4649]"
                        >
                            Cancelar
                        </button>

                        <button
                            className="cursor-pointer lg:w-full w-4/5 lg:h-12 md:h-10 lg:text-2xl self-center text-xl font-semibold bg-[#EA4649] 
                            text-white lg:rounded-2xl rounded-xl hover:bg-white hover:text-[#EA4649] border-2 border-[#EA4649]"

                            onClick={()=>{
                                DeleteInfo(idSelected.id)
                            }}
                        >
                            Confirmar
                        </button>
                    </div>
                </form>
            </div>
        </dialog>
    );
}

export default DeleteConfirm;
