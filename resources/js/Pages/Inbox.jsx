import {DashboardLayout} from "@/Layouts/DashboardLayout.jsx";
import InboxSidebar from "@/Components/InboxSidebar/InboxSidebar.jsx";
import {MailReader} from "@/Components/MailReader/MailReader.jsx";
import InboxMailCard from "@/Components/InboxMailCard/InboxMailCard.jsx";
import {MailProvider} from "@/context/MailContext/MailContext";
import {useContext} from "react";


export default function Home() {

    return (
        <MailProvider>
            <DashboardLayout>
                <div className="flex h-full w-full">
                    <InboxSidebar/>
                    <MailReader/>
                </div>
            </DashboardLayout>
        </MailProvider>
    );
}
