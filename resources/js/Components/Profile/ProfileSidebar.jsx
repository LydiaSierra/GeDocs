import React, { useContext } from "react";

// Foto de perfil y nombre

const ProfileSidebar = () => {
    return (
        <div className="h-full flex  text-gray-800">
            <div>
                <h1 className="flex text-black justify-center">
                    Informacion de Usuario
                </h1>
                <div className="w-70 bg-white rounded-2xl h- justify-center mt-6">
                    <img
                        src="./images/girl-pic.jpg"
                        alt=""
                        className="flex w-60 justify-center ml-5  rounded-2xl"
                    />
                </div>
            </div>
        </div>
    );
};

export default ProfileSidebar;
