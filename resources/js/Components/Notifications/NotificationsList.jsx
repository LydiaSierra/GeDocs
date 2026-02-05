import React, {useState} from 'react'

export default function NotificationsList() {
  return (
        <div>
            <h1 className='font-bold text-2xl'> Solicitud del instructor </h1>

            <div className="containerList flex flex-col w-[180%] gap-4.5 mt-3">
                

                {/* Con un condicional se valida si seleccionaron las solicitudes de instructores */}
                <div className=' bg-white rounded-md py-2 px-2 flex flex-col relative hover:cursor-pointer'>
                    <div className='rounded-[50%] bg-[#3CACBB] w-3 h-3 absolute top-[-7px] right-1 z-50'> </div>
                    <div className='flex justify-between'>
                        <h1 className='font-semibold text-[#010515]'> Nuevo instructor</h1>
                        <h1 className='font-medium'> 08/06/2025 </h1>
                    </div>
                    <p className='text-[#606164]'> Solicitud de acceso: </p>
                    <p className='text-[#606164]'> Juan Jose Perez desea solicitar un nuevo acceso con el rol de instructor en el sistema </p>
                </div>

                <div className=' bg-white rounded-md pt-0.5 px-1.5 flex flex-col hover:cursor-pointer'>
                    <div className='flex justify-between'>
                        <h1 className='font-bold text-gray-400'> Nuevo instructor</h1>
                        <h1 className='text-gray-400'> 08/06/2025 </h1>
                    </div>
                    <p className='text-gray-300'> Solicitud de acceso: </p>
                    <p className='text-gray-300'> Juan Jose Perez desea solicitar un nuevo acceso con el rol de instructor en el sistema </p>
                </div>
        
                <div className=' bg-white rounded-md py-2 px-2 flex flex-col relative hover:cursor-pointer'>
                    <div className='rounded-[50%] bg-[#3CACBB] w-3 h-3 absolute top-[-7px] right-1 z-50'> </div>
                    <div className='flex justify-between'>
                        <h1 className='font-semibold text-[#010515]'> Nuevo instructor</h1>
                        <h1 className='font-medium'> 08/06/2025 </h1>
                    </div>
                    <p className='text-[#606164]'> Solicitud de acceso: </p>
                    <p className='text-[#606164]'> Juan Jose Perez desea solicitar un nuevo acceso con el rol de instructor en el sistema </p>
                </div>

                {/* Con un condiccional se valida si seleccionaron las solicitudes de aprendiz */}
                <div className=' bg-white rounded-md py-2 px-2 flex flex-col relative hover:cursor-pointer'>
                    <div className='rounded-[50%] bg-[#3CACBB] w-3 h-3 absolute top-[-7px] right-1 z-50'> </div>
                    <div className='flex justify-between'>
                        <h1 className='font-semibold text-[#010515]'> Nuevo Aprendiz </h1>
                        <h1 className='font-medium'> 08/06/2025 </h1>
                    </div>
                    <p className='text-[#606164]'> Solicitud de acceso: </p>
                    <p className='text-[#606164]'> Juan Jose Perez desea solicitar un nuevo acceso con el rol de Aprendiz en el sistema </p>
                </div>

                <div className=' bg-white rounded-md pt-0.5 px-1.5 flex flex-col hover:cursor-pointer'>
                    <div className='flex justify-between'>
                        <h1 className='font-bold text-gray-400'> Nuevo Aprendiz </h1>
                        <h1 className='text-gray-400'> 08/06/2025 </h1>
                    </div>
                    <p className='text-gray-300'> Solicitud de acceso: </p>
                    <p className='text-gray-300'> Juan Jose Perez desea solicitar un nuevo acceso con el rol de Aprendiz en el sistema </p>
                </div>
            </div>
        </div>        
  )
}
