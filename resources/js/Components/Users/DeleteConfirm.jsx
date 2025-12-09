
function DeleteConfirm() {
    return (
        <dialog id="my_modal_7" className="modal">
            <div className="modal-box w-2/8 max-w-5xl ">
                <form method="dialog" className="flex flex-col gap-4">
                    <button className="btn btn-lg btn-circle btn-ghost absolute right-2 top-2">
                        ✕
                    </button>
                    <h1 className="text-3xl font-medium text-black">
                        ¿Estas seguro de Eliminar el Usuario?
                    </h1>

                    <div className="flex flex-col gap-4">
                        <button
                            className="cursor-pointer w-full h-12 text-2xl font-semibold bg-white border-solid 
                                                    text-[#EA4649] rounded-2xl hover:bg-none hover:text-white border-2 border-[#EA4649] hover:bg-[#EA4649]"
                        >
                            Cancelar
                        </button>

                        <button
                            className="cursor-pointer w-full h-12 text-2xl font-semibold bg-[#EA4649] 
                                                    text-white rounded-2xl hover:bg-white hover:text-[#EA4649] border-2 border-[#EA4649]"
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
