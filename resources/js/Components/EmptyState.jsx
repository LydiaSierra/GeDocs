import React from 'react'

const EmptyState = ({text}) => {
    return (
        <>
            {/* If there are no folders or files, display a message with an image. */}
            <div
                className="absolute inset-0"
            >
                <div className="w-full h-full relative flex justify-center items-center">
                    <div className="absolute inset-0 opacity-30 bg-[url(/images/imgLogin.png)] bg-no-repeat bg-center bg-contain grayscale" />
                    <div className="flex items-center justify-center h-full absolute">
                        <div className="text-center text-gray-400 font-bold text-xl flex justify-center items-center">
                            {text}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EmptyState