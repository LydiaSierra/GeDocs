import Header from "@/Components/Header/Header.jsx";
import React, {useContext} from "react";
import SettingsBar from "../Components/SettingsBar/SettingsBar"

const UsersLayout = ({children,url}) => {
    return (
        <>
            <div className='bg-gray-100 flex flex-col h-screen w-screen justify-center'>
                <Header/>
                <div className='flex h-full pl-3 pb-3 pt-12 rounded-lg gap-10 '>
                    <SettingsBar url={url}/>

                    <div className='lg:pt-3 pt-5 pb-2 w-full h-full '>
                        <div className={"lg:p-2 w-full h-full flex flex-col gap-5 lg:pr-10 pr-2"}>
                            {children}
                        </div>

                    </div>
                </div>

            </div>
        </>
    )
}

export default UsersLayout;
