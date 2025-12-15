import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const MailContext = createContext(null);

export function MailProvider({ children }) {
    const [mailCards, setMailCards] = useState([]);
    const [selectedMail, setSelectedMail] = useState('');

    const loadMailCards = () => {
        axios.get('/api/pqrs')
            .then((response) => {
                setMailCards(response.data.data);
            })
            .catch((error) => {
                alert(error.message);
            });
    };

    useEffect(() => {
        loadMailCards();
    }, []);

    return (
        <MailContext.Provider
            value={{
                mailCards,
                selectedMail,
                setSelectedMail,
                reloadMailCards: loadMailCards
            }}
        >
            {children}
        </MailContext.Provider>
    );
}
