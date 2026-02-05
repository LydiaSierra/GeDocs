import {createContext, useEffect, useState} from "react";
import axios from "axios";
import api from "@/lib/axios.js";
import {toast} from "sonner";

export const MailContext = createContext(null);

export function MailProvider({children}) {
    const [mailCards, setMailCards] = useState([]);
    const [selectedMail, setSelectedMail] = useState('');
    const [loading, setLoading] = useState(false)


    const loadMailCards = async () => {
        try {
            setLoading(true)
            const res = await api.get('/api/pqrs');
            setMailCards(res.data.data);
        } catch (err) {
            toast.error(err?.response?.data?.message || err.message || "Error al hacer la peticion")
            throw new Error("Error al hacer la peticion")
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        loadMailCards();
    }, []);

    return (
        <MailContext.Provider
            value={{
                mailCards,
                setMailCards,
                selectedMail,
                setSelectedMail,
                loading,
                reloadMailCards: loadMailCards
            }}
        >
            {children}
        </MailContext.Provider>
    );
}
