import { createContext, useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import { router, usePage } from "@inertiajs/react";

export const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [idSelected, setidSelected] = useState(null);
    const [content, setContent]=useState(null);

    const fetchUser = useCallback(async () => {
        const res = await api.get("/api/users");
        if (res.data.success === false) {
            console.log("ERRROR AL OBTENER USUARIOS!");
            return;
        }
        setUser(res.data.data);
        setLoading(false);
    });

    const ShowInformation = (id) => {
        setidSelected(user.find((item) => item.id === id));
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <UserContext.Provider
            value={{
                // props
                user,
                loading,
                ShowInformation,
                idSelected,
                setidSelected,
                content,
                setContent
            }}
        >
            {children}
        </UserContext.Provider>
    );
}
