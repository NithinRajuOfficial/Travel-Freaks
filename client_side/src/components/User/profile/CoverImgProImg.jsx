import { useState } from "react";
import Modal from "react-modal";
import { Breadcrumbs, Typography, Button } from "@material-tailwind/react";
import { api } from "../../../api/api";
import { UserDetailsEditForm } from "./UserDetailsEditForm";

export function CoverProfileImageDetails() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userData, setUserData] = useState(null)
  const handleEditClick = async() => {

    // fetching data from the database
    try {
      const response = await api.get("user/userDetails")
      const userDetails = response.data.userDetails
      console.log("response:",response.data.userDetails);
      setUserData(userDetails)
    } catch (error) {
      console.error("Error fetching user data:",error);
    }
    setIsEditModalOpen(true);
  };

  const closeModal = () => {
    setIsEditModalOpen(false);
  };

  return (
    <div className="relative h-96 w-full">
      <img
        className="absolute inset-0 w-full h-full object-cover"
        src="https://images.unsplash.com/photo-1682407186023-12c70a4a35e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80"
        alt="nature image"
      />
      <div className="absolute inset-0 top-52 left-20 flex flex-wrap items-end">
        <img
          className="h-64 w-64 rounded-full object-cover object-center"
          src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80"
          alt="profile image"
        />

        <div
          className="ml-64 w-full flex justify-between  "
          style={{ marginTop: "-40px" }}
        >
          <h1 className="text-3xl inline-block">
            Catherin Jacob{" "}
            <span className="inline-block cursor-pointer">
              <svg
                className="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 18"
                onClick={handleEditClick}
              >
                <path d="M6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm-1.391 7.361.707-3.535a3 3 0 0 1 .82-1.533L7.929 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h4.259a2.975 2.975 0 0 1-.15-1.639ZM8.05 17.95a1 1 0 0 1-.981-1.2l.708-3.536a1 1 0 0 1 .274-.511l6.363-6.364a3.007 3.007 0 0 1 4.243 0 3.007 3.007 0 0 1 0 4.243l-6.365 6.363a1 1 0 0 1-.511.274l-3.536.708a1.07 1.07 0 0 1-.195.023Z" />
              </svg>
            </span>
          </h1>

          <div className="flex justify-end ">
            <Breadcrumbs className="opacity-100">
              <a href="#" className="opacity-100">
                Following
              </a>
            </Breadcrumbs>
            <Breadcrumbs className="w-24 ml-5 opacity-100">
              <a href="#" className="opacity-100">
                Followers
              </a>
            </Breadcrumbs>
          </div>
        </div>
        <Typography
          variant="lead"
          color="blue-gray"
          className=" ml-64 text-sm font-mono break-normal"
          style={{ maxWidth: "250px" }}
        >
          Material Tailwind is a CSS framework that combines the ease of use of
          Tailwind CSS with the power of Material Design.
        </Typography>
      </div>
      <Modal className="w-2/6 h-full"
        isOpen={isEditModalOpen}
        onRequestClose={closeModal}
        contentLabel="Edit User Details"
        style={{
          overlay: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0, 0, 0, 0.5)", // Reduce background opacity
          },
          content: {
            position: "relative",
            top: "auto",
            left: "auto",
            right: "auto",
            bottom: "auto",
            border: "none",
            background: "whitesmoke",
            overflow: "hidden",
            WebkitOverflowScrolling: "touch",
            borderRadius: "4px",
            outline: "none",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Add shadow
            height: "95%",
            minWidth: "300px",
            maxWidth: "80%",
          },
        }}
      >
       <div className="flex justify-end">
       <Button
         className="rounded-full h-8 w-8 flex justify-center items-center "
          onClick={closeModal}
          color="gray"
          style={{ cursor: "pointer" }}
        >
          X
        </Button>
       </div>
        <UserDetailsEditForm userData={userData} closeModal={closeModal} />
      </Modal>
    </div>
  );
}
