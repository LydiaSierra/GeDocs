import {createContext, useState, useEffect, useCallback} from "react";
import api from "@/lib/axios";
import {router, usePage} from "@inertiajs/react";

export const UserContext = createContext();

export function UserProvider({children}) {
    const [user, setUser] = useState([]);
    const [filter, setFilter] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchUser = useCallback(async() => {
        const res = await api.get("/api/users");
        if(res.data.succes === false){
            console.log("ERRROR AL OBTENER NOTIFICACIONES!")
            return;
        }
        setUser([])
    })

    // const markAsReadNotification = useCallback(async(id) => {
    //     const res = await api.post(`/api/notifications/${id}/mark-as-read`);
    //     if(res.data.succes === false){
    //         console.log("ERRROR AL MARCAR NOTIFICACIONES LEIDAS!")
    //         return;
    //     }
    // })

    useEffect(() => {
      fetchUser()
    


    }, [])
    

 
    return (
        <UserContext.Provider
            value={{
                // props
                user
            }}
        >
            {children}
        </UserContext.Provider>
    );
}
