import { AdminSidebar } from "../AdminSidebar";
import { AdminNavbar } from "../AdminNavbar";
import {UserDetailsComponent} from "../userManagement/UserManagmentCom"

export function UserManagementMainComponent(){
    return(
        <div className="flex">
        <AdminSidebar />
  
        <div className="flex flex-col flex-1">
          <AdminNavbar />
  
          <div className="flex-1 p-4 w-2/2 h-2/3 mt-5">
            <UserDetailsComponent />
          </div>
        </div>
      </div>
    )
}