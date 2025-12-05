    import { UserCircleIcon,AcademicCapIcon,ListBulletIcon } from "@heroicons/react/24/outline"
    import { PencilSquareIcon } from '@heroicons/react/24/outline';
    import { TrashIcon } from '@heroicons/react/24/outline';
    function ProfileMenu() {
    return (
        <div className="w-[97%] bg-white mt-18 rounded-lg flex flex-col items-center gap-1 overflow-hidden">

            {/* Perfil Info */}
            <div className="w-full h-auto flex flex-col  items-start gap-2">
                <div className="w-5/5 flex flex-col items-start gap-5 p-2">
                        <div className="flex flex-row items-center cursor-pointer gap-2 w-full text-[#010515] text-lg 
                        font-medium hover:underline">
                            <UserCircleIcon className="text-[#848484] w-7 h-7" />
                            Informacion de Perfil
                        </div>
                </div>

            </div>
            
            {/* Users */}
            <div className="w-5/5 flex flex-col items-start gap-5 p-2">

                <h1 className="self-start text-[20px] text-[#848484]">
                    Usuarios
                </h1>

                <div className="w-full h-auto flex flex-col  items-start gap-2">
                    
                    <a href="#">
                        <div className="flex flex-row items-center cursor-pointer gap-3 w-full text-[#010515] text-lg font-medium hover:underline">
                            <AcademicCapIcon className="text-[#848484] w-7 h-7" />
                            Aprendices
                        </div>
                    </a>
                    
                    <a href="#">
                        <div className="flex flex-row items-center cursor-pointer gap-3 w-full text-[#010515] text-lg font-medium hover:underline">
                            <ListBulletIcon className="text-[#848484] w-7 h-7" />
                            Instructores
                        </div>
                    </a>

                    <a href={route('sheets')}>
                        <div className="flex flex-row items-center cursor-pointer gap-3 w-full text-[#010515] text-lg font-medium hover:underline">
                            <UserCircleIcon className="text-[#848484] w-7 h-7" />
                            Fichas
                        </div>
                
                    </a>

                </div>
                
            </div>

            {/* request */}

            <div className="w-5/5 flex flex-col items-start gap-5 p-2">

                <h1 className="self-start text-[20px] text-[#848484]">
                    Solicitudes
                </h1>

                <div className="w-full h-auto flex flex-col  items-start gap-2">
                    
                    <a href="#">
                        <div className="flex flex-row items-center cursor-pointer gap-3 w-full text-[#010515] text-lg font-medium hover:underline">
                            <UserCircleIcon className="text-[#848484] w-7 h-7" />
                            Aprendices
                        </div>
                    </a>
                    
                    <a href="#">
                        <div className="flex flex-row items-center cursor-pointer gap-3 w-full text-[#010515] text-lg font-medium hover:underline">
                            <UserCircleIcon className="text-[#848484] w-7 h-7" />
                            Instructores
                        </div>
                    </a>

                </div>
                
            </div>

            

            <div className="w-5/5 flex flex-col items-start gap-5 p-2">

                <h1 className="self-start text-[20px] text-[#848484]">
                    Gestion Documental
                </h1>

                <div className="w-full h-auto flex flex-col  items-start gap-2">
                    
                    <a href={route('dependencies')}>
                        <div className="flex flex-row items-center cursor-pointer gap-2 w-full text-[#010515] text-lg font-medium hover:underline">
                            <UserCircleIcon className="text-[#848484] w-7 h-7" />
                            Dependencias
                        </div>
                    </a>
                    
                    <a href="#">
                        <div className="flex flex-row items-center cursor-pointer gap-2 w-full text-[#010515] text-lg font-medium hover:underline">
                            <UserCircleIcon className="text-[#848484] w-7 h-7" />
                            Series y Subseries
                        </div>
                    </a>

                    <a href="#">
                        <div className="flex flex-row items-center cursor-pointer gap-2 w-full text-[#010515] text-lg font-medium hover:underline">
                            <UserCircleIcon className="text-[#848484] w-7 h-7" />
                            Secciones y Subsecciones
                        </div>
                    </a>

                    <h1 className="self-start text-[20px] text-[#848484]">
                    Editar Perfil
                    </h1>

                    <a href="#">
                        <div className="flex flex-row items-center cursor-pointer gap-2 w-full text-[#010515] text-lg font-medium hover:underline">
                            <PencilSquareIcon className="text-[#848484] w-7 h-7" />
                            Cambiar Contraseña
                        </div>
                    </a>

                    <a href="#">
                        <div className="flex flex-row items-center cursor-pointer gap-2 w-full text-[#010515] text-lg font-medium hover:underline">
                            <TrashIcon className="text-[#848484] w-7 h-7" />
                            Eliminar Cuenta
                        </div>
                    </a>





                </div>
                
            </div>


        </div>
    )
    }

    export default ProfileMenu;