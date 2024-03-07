import Modal from "react-modal";
import { IoIosCloseCircleOutline } from "react-icons/io";

export default function GroupModal({ isOpen, closeModal }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50"
      overlayClassName="fixed inset-0 flex justify-center items-center"
    >
      <div className="bg-white w-96 sm:w-96 h-96 p-4 rounded-lg flex flex-col justify-between">
        <span
          className="text-3xl flex justify-end hover:cursor-pointer"
          onClick={closeModal}
        >
          <IoIosCloseCircleOutline />
        </span>
        <div className="flex flex-col justify-center items-center">
          {/* Modal content goes here */}
        </div>
       
      </div>
    </Modal>
  );
}
