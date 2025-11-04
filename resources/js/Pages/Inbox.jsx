import Navbar from "@/Components/Navbar/Navbar.jsx";
import Sidebar from "@/Components/Sidebar/Sidebar.jsx";
import InboxSidebar from "@/Components/InboxSidebar/InboxSidebar.jsx";
import MailReader from "@/Components/MailReader/MailReader.jsx";

export default function Home() {
    return (
        <div className="bg-senaGray">
            <Navbar></Navbar>
            <div className="flex">
                <Sidebar></Sidebar>
                <div className="flex h-[calc(100vh-80px-2.5rem)] w-[calc(107vw-80px)] bg-white m-5 rounded-lg">
                    <InboxSidebar></InboxSidebar>
                    <MailReader></MailReader>
                </div>
            </div>
        </div>
    );
}
