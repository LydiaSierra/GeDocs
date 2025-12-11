import {DashboardLayout} from "@/Layouts/DashboardLayout.jsx";
import InboxSidebar from "@/Components/InboxSidebar/InboxSidebar.jsx";
import {MailReader} from "@/Components/MailReader/MailReader.jsx";
import {createContext, useEffect, useState} from "react";
import InboxMailCard from "@/Components/InboxMailCard/InboxMailCard.jsx";

export const MailContext = createContext();


export default function Home() {

    const [mailCards, setMailCards] = useState([]);
    const [selectedMail, setSelectedMail] = useState('');


    const loadMailCards = () => {
        axios.get('/api/pqrs')
            .then((response) => {
                setMailCards(response.data.data);
            })
            .catch((error) => {
                alert(error.message);
            })
    }

    useEffect(() => {
        loadMailCards();
    }, []);


    return (
        <MailContext.Provider value={{mailCards, selectedMail, setSelectedMail}}>
            <DashboardLayout>
                <div className="flex h-full">
                    <InboxSidebar>
                        {mailCards.map((card) => {
                            return (
                                <InboxMailCard key={card.id} card={card}/>
                            )
                        })}
                    </InboxSidebar>
                    <MailReader/>
                </div>
            </DashboardLayout>
        </MailContext.Provider>
    );
}
