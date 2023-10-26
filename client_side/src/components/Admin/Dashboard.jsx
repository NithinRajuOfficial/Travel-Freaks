import { AdminSidebar } from "./AdminSidebar";
import { AdminNavbar } from "./AdminNavbar";
import LineGraph from "./graphs/LineGraph";

export function AdminDashboard() {
  return (
    <div className="flex">
      <AdminSidebar />

      <div className="flex flex-col flex-1">
        <AdminNavbar />

        <div className="flex-1 p-4 w-2/2 h-2/3">
          <LineGraph />
        </div>
      </div>
    </div>
  );
}
