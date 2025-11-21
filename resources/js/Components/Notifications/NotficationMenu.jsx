import { UserCircleIcon,AcademicCapIcon,ListBulletIcon } from "@heroicons/react/24/outline"

function NotficationMenu() {
  return (
    <div className="w-[23%] bg-white mt-5 rounded-lg flex flex-col items-center gap-1">

        {/* Perlfil Info */}
        <div className="w-full h-auto flex flex-col  items-start gap-2">
            <div className="w-5/5 flex flex-col items-start gap-5 p-2">
                    <div className="flex flex-row items-center cursor-pointer gap-2 w-full text-[#010515] text-lg 
                    font-medium hover:underline">
                        <UserCircleIcon className="text-[#848484] w-10 h-10" />
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
                        <AcademicCapIcon className="text-[#848484] w-10 h-10" />
                        Aprendices
                    </div>
                </a>
                
                <div className="flex flex-row items-center cursor-pointer gap-3 w-full text-[#010515] text-lg font-medium hover:underline">
                    <ListBulletIcon className="text-[#848484] w-10 h-10" />
                    Instructores
                </div>

                <div className="flex flex-row items-center cursor-pointer gap-3 w-full text-[#010515] text-lg font-medium hover:underline">
                    <UserCircleIcon className="text-[#848484] w-10 h-10" />
                    Fichas
                </div>
            </div>
            
        </div>

        {/* request */}

        <div className="w-5/5 flex flex-col items-start gap-5 p-2">

            <h1 className="self-start text-[20px] text-[#848484]">
                Solicitudes
            </h1>

            <div className="w-full h-auto flex flex-col  items-start gap-2">
                
                <div className="flex flex-row items-center cursor-pointer gap-3 w-full text-[#010515] text-lg font-medium hover:underline">
                    <UserCircleIcon className="text-[#848484] w-10 h-10" />
                    Aprendices
                </div>
                
                <div className="flex flex-row items-center cursor-pointer gap-3 w-full text-[#010515] text-lg font-medium hover:underline">
                    <UserCircleIcon className="text-[#848484] w-10 h-10" />
                    Instructores
                </div>

            </div>
            
        </div>

        {/* Document manage */}

        <div className="w-5/5 flex flex-col items-start gap-5 p-2">

            <h1 className="self-start text-[20px] text-[#848484]">
                Gestion Documental
            </h1>

            <div className="w-full h-auto flex flex-col  items-start gap-2">
                
                <div className="flex flex-row items-center cursor-pointer gap-3 w-full text-[#010515] text-lg font-medium hover:underline">
                    <UserCircleIcon className="text-[#848484] w-10 h-10" />
                    Dependencias
                </div>
                
                <div className="flex flex-row items-center cursor-pointer gap-3 w-full text-[#010515] text-lg font-medium hover:underline">
                    <UserCircleIcon className="text-[#848484] w-10 h-10" />
                    Series y Subseries
                </div>

                <div className="flex flex-row items-center cursor-pointer gap-3 w-full text-[#010515] text-lg font-medium hover:underline">
                    <UserCircleIcon className="text-[#848484] w-10 h-10" />
                    Secciones y Subsecciones
                </div>
            </div>
            
        </div>


    </div>
  )
}

export default NotficationMenu