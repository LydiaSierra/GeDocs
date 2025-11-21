import {DashboardLayout} from "@/Layouts/DashboardLayout.jsx";
import InboxSidebar from "@/Components/InboxSidebar/InboxSidebar.jsx";
import MailReader from "@/Components/MailReader/MailReader.jsx";


export default function Home() {
    return (
      <DashboardLayout>
          <div className="flex h-full">
              <InboxSidebar></InboxSidebar>
              <MailReader></MailReader>
          </div>
      </DashboardLayout>
    );
}
