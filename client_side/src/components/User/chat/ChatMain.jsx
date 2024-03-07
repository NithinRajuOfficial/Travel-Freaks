import {NavbarDefault} from "../UserNavbar";
import LeftSide from "./LeftSide";
import Middle from "./Middle";

export default function ChatComponent() {
  return (

    <>
    <NavbarDefault/>
    <div className="md:grid grid-cols-3 grid-flow-col  px-10 py-20 h-screen  ">
      <span className="col-span-1">
      <LeftSide />
      </span>
     <span className="col-span-2 ">
     <Middle />
     </span>
    </div>
    </>
  );
}
