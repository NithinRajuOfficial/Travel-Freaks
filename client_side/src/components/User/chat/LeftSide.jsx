import { useState } from "react";
import { Tooltip } from "@material-tailwind/react";
import { HiPlusSmall } from "react-icons/hi2";
import GroupModal from "./groupModal";
import { api } from "../../../api/api";
import { showError } from "../../../assets/tostify";
import UserCard from "./UserCard";

export default function LeftSide() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchStr, setSearchStr] = useState("");
  const [searchedUserData, setSearchedUserData] = useState([]);
  const isGroupModalOpen = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  const handleSearch = (e) => {
    setSearchStr(e.target.value);
  };

  const toggleSearch = async () => {
    try {
      // if (searchStr === "") {
      //   return showError("Please Enter the user name");
      // }
      const { data } = await api.get(`user/search?search=${searchStr}`);
      console.log(data, "ressssss");
      setSearchedUserData(data?.user);
    } catch (error) {
      console.error("Failed in searching user ERROR:", error);
      if (error?.response?.status === 404) {
        showError(error?.response?.data?.message);
      }
    }
  };

  return (
    <div className="bg-gray-200 h-[100%] rounded-bl-2xl rounded-tl-2xl">
      <div className="w-full h-20 bg-gray-300 flex justify-end items-center rounded-tl-2xl">
        <div className="w-full flex px-1 py-2 ">
          <input
            type="text"
            placeholder="Search here..."
            className="w-[60%] px-2 py-2 rounded-l-lg"
            onChange={handleSearch}
          />
          <button
            className="bg-blue-300 px-2 py-1 rounded-r-lg hover:bg-blue-400 hover:scale-105"
            onClick={toggleSearch}
          >
            Search
          </button>
        </div>
        <Tooltip content="New Group Chat">
          <span
            className=" text-3xl p-1 hover:cursor-pointer"
            onClick={isGroupModalOpen}
          >
            <HiPlusSmall />
          </span>
        </Tooltip>
        {isOpen && <GroupModal isOpen={isOpen} closeModal={closeModal} />}
      </div>
      <div className=" p-4 max-h-96 min-h-[85%] flex flex-col items-center overflow-y-auto">
        {searchedUserData.map((user) => (
          <UserCard key={user._id} user={user} />
        ))}
      </div>
    </div>
  );
}
