import { UserContext } from "@/context/UserContext/UserContext";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { useContext } from "react";

export const UserList = () => {
    const {user} = useContext(UserContext);

    return (
        <div>
            <table className="w-full border-separate border-spacing-y-4 overflow-y-scroll">
                <thead className="sticky top-0">
                    <tr className="bg-[#E8E8E8] h-10 ">
                        <th className="rounded-l-[7px]">Nombre</th>
                        <th>Identificacion</th>
                        <th>Email</th>
                        <th>Telefono</th>
                        <th >Estado</th>
                        <th className="rounded-r-[7px]"> </th>
                    </tr>

                </thead> 
                <tbody>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <tr
                            key={i}
                            className=" bg-white hover:bg-accent text-center cursor-pointer h-15 rounded-[7px]"
                        >
                            <td className="rounded-l-[7px] pl-5 font-medium text-xl text-neutral">
                                <div className="h-full flex flex-row items-center justify-center gap-5">
                                    <img
                                        className="w-10 rounded-full"
                                        alt="profile pic"
                                        src="/images/girl-pic.jpg"
                                    />
                                    Lily Martinez
                                </div>
                            </td>
                            <td className="text-[#606164] font-normal">
                                1234567890
                            </td>
                            <td className="text-[#606164] font-normal">
                                Antonio.Antonies@gmail.com
                            </td>
                            <td className="text-[#606164] font-normal">
                                3221234567
                            </td>
                            <td className=" text-[#606164] font-normal">
                                <div className="bg-[#E8E8E8] rounded-md">
                                    Con Fciha
                                </div>
                            </td>
                            <td className="rounded-r-[7px] px-2">

                                <EllipsisVerticalIcon className="w-5 h-5 cursor-pointer hover:bg-gray-400 rounded-[50%]" />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
