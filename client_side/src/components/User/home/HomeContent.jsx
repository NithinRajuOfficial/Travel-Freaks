import { Button, Avatar, Typography } from "@material-tailwind/react";
import { useState } from "react";
import Modal from "react-modal";
import { PostCreationForm } from "../AddPost";
import { useSelector } from "react-redux";

export function HomeContent() {
  const user = useSelector((state) => state.user);
  // const modalStyles = {
  //   content: {
  //     width: "500px",
  //     height: "auto",
  //     margin: "auto",
  //     backgroundColor: "white",
  //     borderRadius: "8px",
  //     overflow: "hidden",
  //     border: "none",
  //   },
  //   overlay: {
  //     backgroundColor: "rgba(0, 0, 0, 0.5)",
  //     zIndex: 1000,
  //   },
  // };
  const modalStyles = {
    content: {
      maxWidth: "1000px",
      margin: "0 auto",
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
      zIndex: "50px",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
  };

  const closeButtonStyles = {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "#333",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-10 bg-white ml-20 mr-20 relative bottom-16 rounded-2xl shadow-2xl">
      <div className="flex justify-around flex-wrap">
        <div className="lg:flex-row flex flex-col justify-center items-center">
          <Avatar
            src=" https://cdn4.iconfinder.com/data/icons/hobbies-color-pop-vol-3/64/social-networking-512.png"
            alt="avatar"
            variant="rounded"
            withBorder={true}
            size="xl"
            color="green"
            className="p-0.5 sm:mr-2 hover:animate-pulse duration-300"
          />
          <Typography className="text-center">Discover paradise at every turn. 🌴🌊</Typography>
        </div>
        <div className="lg:flex-row flex flex-col justify-center items-center">
          <Avatar
            src="https://i.pinimg.com/originals/2f/a2/32/2fa2321cb1703d6eef32410774156fed.jpg"
            alt="avatar"
            variant="rounded"
            withBorder={true}
            size="xl"
            color="green"
            className="p-0.5 sm:mr-2 hover:animate-pulse duration-300"
          />
          <Typography className="text-center">Travel is better when shared. ✈️🌍</Typography>
        </div>
        <div className="lg:flex-row flex flex-col justify-center items-center">
          <Avatar
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgxGRVNF1kXX65JCvF7YaHi7uzgC2-M4jv8Q&usqp=CAU"
            alt="avatar"
            variant="rounded"
            size="xl"
            withBorder={true}
            color="green"
            className="p-0.5 sm:mr-2 hover:animate-pulse duration-300"
          />
          <Typography className="text-center">
            Capture the moments that take your breath away. 🌄❤️
          </Typography>
        </div>
        {user.isAuthenticated && (
          <div className="flex items-center">
            <Button className="h-12 capitalize" onClick={openModal}>
              Plan your Trip!.
            </Button>
          </div>
        )}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Create Post Modal"
          style={modalStyles}
        >
          <div className="flex justify-end">
            <Button
              onClick={closeModal}
              style={closeButtonStyles}
              className=" bg-blue-gray-900 font-black"
            >
              X
            </Button>
          </div>
          <div className="p-2 sm:p-4 mt-10">
            <PostCreationForm onSuccess={closeModal} />
          </div>
        </Modal>
      </div>
    </div>
  );
}
