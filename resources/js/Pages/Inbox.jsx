import Navbar from "@/Components/Navbar/Navbar.jsx";
import Sidebar from "@/Components/Sidebar/Sidebar.jsx";
import InboxSidebar from "@/Components/InboxSidebar/InboxSidebar.jsx";
import MailReader from "@/Components/MailReader/MailReader.jsx";

export default function Home() {
    return (
        <div className="bg-senaGray">
            <Navbar></Navbar>
            <div className="md:flex w-full">
                <Sidebar></Sidebar>
                <div className="flex md:h-[calc(100vh-80px-2.5rem)] md:w-[calc(107vw-80px)] bg-gray-300 m-3 lg:m-3 rounded-lg lg:p-2 gap-2">
                    <InboxSidebar></InboxSidebar>
                    <MailReader></MailReader>
                </div>
            </div>
        </div>
    );
}
