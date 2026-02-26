import { createContext, useState } from "react";

export const RightClickContext = createContext();

export function RightClickProvider({ children }) {
    const [contextMenu, setContextMenu] = useState({
        visible: false,
        x: 0,
        y: 0,
        type: null,
    });

    const showContextMenu = (event, type) => {
        event.preventDefault();
        event.stopPropagation();

        const menuWidth = 224;
        const menuHeight = 160;
        let x = event.pageX;
        let y = event.pageY;

        if (x + menuWidth > window.innerWidth) x -= menuWidth;
        if (y + menuHeight > window.innerHeight) y -= menuHeight;

        setContextMenu({ visible: true, x, y, type });
    };

    const hideContextMenu = () => setContextMenu({ ...contextMenu, visible: false });

    return (
        <RightClickContext.Provider
            value={{
                contextMenu,
                showContextMenu,
                hideContextMenu,
            }}
        >
            {children}
        </RightClickContext.Provider>
    );
}
