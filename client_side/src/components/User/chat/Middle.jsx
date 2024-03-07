import { AiOutlineSend } from "react-icons/ai";
import { CgAttachment } from "react-icons/cg";

export default function Middle() {
  return (
    <div className=" h-full ">
      <div className="w-full h-[90%] p-2 bg-gray-400 overflow-x-hidden overflow-y-auto rounded-tr-2xl">
   
      </div>

      <form className="w-full h-[10%] flex items-center border-gray-400 border-2 rounded-br-2xl">
        <span className="text-4xl p-2  hover:scale-110 cursor-pointer text-blue-gray-700">
          <CgAttachment />
        </span>
        <input
          type="text"
          placeholder="Enter the Message..."
          className="w-[90%] p-4 outline-none rounded-3xl bg-gray-200"
        />
        <span className="text-4xl p-2 text-green-400 hover:scale-110 cursor-pointer hover:text-green-500 ">
          <AiOutlineSend />
        </span>
      </form>
    </div>
  );
}
