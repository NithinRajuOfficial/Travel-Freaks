/* eslint-disable no-inner-declarations */
/* eslint-disable react/no-unknown-property */
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Modal from "react-modal";
import { useSelector } from "react-redux";
import {
  Breadcrumbs,
  Typography,
  Button,
  Tooltip,
} from "@material-tailwind/react";
import { useDispatch } from "react-redux";
import { setUser } from "../../../redux/userSlice";
import { api } from "../../../api/api";
import { UserDetailsEditForm } from "./UserDetailsEditForm";
import {
  defaultProImg,
  defaultCoverImg,
  defaultMainCoverImg,
} from "../../../assets/constants";
import FollowingModal from "./modalComponets/followingModal";
import FollowersModal from "./modalComponets/followersModal";

export function CoverProfileImageDetails(Id) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isImageUploadModalOpen, setIsImageUploadModalOpen] = useState(false);
  const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [otherUsers, setOtherUsers] = useState(null);
  const [isFollowing, setIsFollowing] = useState();
  const userToDisplay = Id.userId != undefined ? !userData : user;
  // const { name, bio, profileImage, coverImg } = userToDisplay;

  const initialValues = {
    coverImg: "",
  };

  const validationSchema = Yup.object({
    coverImg: Yup.mixed()
      .test("fileSize", "Image size is too large", (value) => {
        // Check if value is a File object
        if (value instanceof File) {
          return value.size <= 5 * 1024 * 1024;
        }
        // If value is not a File object (e.g., null or empty), consider it valid
        return true;
      })
      .test("fileType", "Invalid file type", (value) => {
        // Check if value is a File object and its type starts with "image/"
        if (value instanceof File) {
          return value.type?.startsWith("image/") || false;
        }
        // If value is not a File object (e.g., null or empty), consider it valid
        return true;
      }),
  });

  const handleEditClick = async () => {
    // fetching data from the database
    try {
      const response = await api.get(`user/userDetails/${user?._id}`);
      const userDetails = response.data.userDetails;
      if (userDetails) {
        setUserData(userDetails);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
    setIsEditModalOpen(true);
  };

  const closeModal = () => {
    setIsEditModalOpen(false);
  };

  const handleUserDataUpdate = (updatedUserData) => {
    setUserData(updatedUserData);
  };

  const closeImageUploadModal = () => {
    setIsImageUploadModalOpen(false);
  };

  const handleCoverImgEdit = () => {
    setIsImageUploadModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Perform image type and size validation
      if (
        (file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024) ||
        !file.type // Allow empty file
      ) {
        formik.setFieldValue("coverImg", file);
      } else {
        formik.setFieldValue("coverImg", null);
      }
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (values.coverImg) {
          const formData = new FormData();
          formData.append("coverImg", values.coverImg);
          const response = await api.post("user/editCoveImg", formData);
          const updatedUserDeatails = response.data.user;
          dispatch(setUser(updatedUserDeatails));
          if (response) {
            setIsImageUploadModalOpen(false);
          }
        }
      } catch (error) {
        console.error("Error adding or updating cover img:", error);
      }
    },
  });

  function handleFollowingModalContents() {
    setIsFollowingModalOpen(true);
  }

  function handleFollowersModalContents() {
    setIsFollowersModalOpen(true);
  }

  useEffect(() => {
    // Check if userId is defined
    if (Id.userId != undefined) {
      async function fetchOtherUsersDetails() {
        try {
          const response = await api.get(`user/userDetails/${Id.userId}`);
          const userDetails = response.data.userDetails;
          setIsFollowing(response.data.isFollowing);
          if (userDetails) {
            setOtherUsers(userDetails);
          }
          setIsFollowingModalOpen(false);
          setIsFollowersModalOpen(false);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }

      fetchOtherUsersDetails();
    } else {
      setOtherUsers(null);
    }
  }, [Id.userId]);

  // follow and unfollow
  const handleFollowAndUnfollow = async () => {
    try {
      const userId = otherUsers._id;
      const response = await api.post(
        `user/follow&unfollow?userIdToFollow=${userId}`
      );
      setIsFollowing(response.data.isFollowing);
    } catch (error) {
      console.error("Following or Unfollowing action failed:", error);
    }
  };

  return (
    <div className="relative h-auto lg:h-96 w-full">
      <img
        className={`absolute inset-0 h-52 w-full sm:h-full object-cover`}
        src={
          otherUsers
            ? otherUsers.coverImg || defaultMainCoverImg
            : userToDisplay?.coverImg || defaultMainCoverImg
        }
        alt="nature image"
      />

      {
        <div className="absolute inset-0 top-40 sm:top-56 left-6 sm:left-20 flex flex-wrap items-end">
          {!Id?.userId && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-8 h-8 top-4 sm:top-32 absolute cursor-pointer right-1 text-green-600"
              onClick={handleCoverImgEdit}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          )}

          <Modal
            className="w-full md:w-2/3 lg:w-1/2 xl:w-1/3 h-full p-2"
            isOpen={isImageUploadModalOpen}
            onRequestClose={closeImageUploadModal}
            contentLabel="Edit Cover Image"
            style={{
              overlay: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0,0,0,0.5)",
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
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                height: "80vh",
                minWidth: "300px",
                maxWidth: "80%",
              },
            }}
          >
            <div className="flex justify-end">
              <Button
                className="rounded-full h-8 w-8 flex justify-center items-center "
                onClick={closeImageUploadModal}
                color="gray"
                style={{ cursor: "pointer" }}
              >
                X
              </Button>
            </div>
            <form
              className="p-4 md:p-10 flex flex-col items-center"
              onSubmit={formik.handleSubmit}
            >
              <input
                type="file"
                name="coverImg"
                accept="image/*"
                className="ml-36"
                onChange={handleImageChange}
              />

              <img
                className="mt-6 object-cover w-[80%] h-96"
                src={
                  formik.values.coverImg instanceof File
                    ? URL.createObjectURL(formik.values.coverImg)
                    : userData?.coverImg || defaultCoverImg
                }
                alt="Cover image"
              />
              <button
                type="submit"
                className=" mt-6 w-40 bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 hover:font-semibold transition duration-300"
              >
                Upload Image
              </button>
            </form>
          </Modal>

          <img
            className="w-28 sm:w-64 rounded-full object-cover object-center"
            src={
              otherUsers
                ? otherUsers?.profileImage || defaultProImg
                : userToDisplay?.profileImage || defaultProImg
            }
            alt="profile image"
          />
          <div className="ml-32 -mt-14 sm:-mt-16 sm:ml-64 w-full flex flex-col sm:flex-row justify-between items-start">
            <h1 className="text-2xl sm:text-3xl inline-block">
              {otherUsers ? otherUsers?.name : userToDisplay?.name}
              <span className="ml-5 inline-block cursor-pointer">
                {user && otherUsers ? (
                  isFollowing ? (
                    <Tooltip
                      content={
                        <Typography>
                          <small>UnFollow!.!</small>
                        </Typography>
                      }
                    >
                      <svg
                        viewBox="0 0 64 64"
                        fill="currentColor"
                        height="1em"
                        width="1em"
                        onClick={handleFollowAndUnfollow}
                      >
                        <g
                          fill="none"
                          stroke="red"
                          strokeMiterlimit={10}
                          strokeWidth={6}
                        >
                          <path d="M18 20h2M46 20h-2M32 47h31V5H1v42h17v12z" />
                        </g>
                        <path
                          fill="none"
                          stroke="red"
                          strokeMiterlimit={10}
                          strokeWidth={6}
                          d="M40 38a8 8 0 00-16 0"
                        />
                      </svg>
                    </Tooltip>
                  ) : (
                    <Tooltip
                      content={
                        <Typography>
                          <small>Follow!.!</small>
                        </Typography>
                      }
                    >
                      <svg
                        viewBox="0 0 64 64"
                        fill="currentColor"
                        height="1em"
                        width="1em"
                        onClick={handleFollowAndUnfollow}
                      >
                        <g
                          fill="none"
                          stroke="green"
                          strokeMiterlimit={10}
                          strokeWidth={6}
                        >
                          <path d="M24 30a8 8 0 0016 0M18 20h2M46 20h-2" />
                          <path d="M32 47h31V5H1v42h17v12z" />
                        </g>
                      </svg>
                    </Tooltip>
                  )
                ) : (
                  user && (
                    <svg
                      className="w-5 sm:w-6 text-gray-800 dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 18"
                      onClick={handleEditClick}
                    >
                      <path d="M6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm-1.391 7.361.707-3.535a3 3 0 0 1 .82-1.533L7.929 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h4.259a2.975 2.975 0 0 1-.15-1.639ZM8.05 17.95a1 1 0 0 1-.981-1.2l.708-3.536a1 1 0 0 1 .274-.511l6.363-6.364a3.007 3.007 0 0 1 4.243 0 3.007 3.007 0 0 1 0 4.243l-6.365 6.363a1 1 0 0 1-.511.274l-3.536.708a1.07 1.07 0 0 1-.195.023Z" />
                    </svg>
                  )
                )}
              </span>
            </h1>

            {!otherUsers ? (
              <div className="flex justify-end mt-2">
                <Breadcrumbs className="opacity-100">
                  <a
                    href="#"
                    className="opacity-100"
                    onClick={handleFollowingModalContents}
                  >
                    Following
                  </a>
                </Breadcrumbs>
                <Breadcrumbs className="w-24 ml-5 opacity-100">
                  <a
                    href="#"
                    className="opacity-100"
                    onClick={handleFollowersModalContents}
                  >
                    Followers
                  </a>
                </Breadcrumbs>
              </div>
            ) : (
              ""
            )}
          </div>
          <Typography
            variant="lead"
            color="blue-gray"
            className=" ml-32 sm:ml-64 mt-2 text-sm max-w-[200px] sm:max-w-[310px] break-words"
          >
            {otherUsers ? otherUsers?.bio : userToDisplay?.bio}
          </Typography>
        </div>
      }
      <Modal
        className="w-2/6 h-full"
        isOpen={isEditModalOpen}
        onRequestClose={closeModal}
        contentLabel="Edit User Details"
        style={{
          overlay: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0, 0, 0, 0.5)",
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
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            height: "95%",
            minWidth: "330px",
            maxWidth: "80%",
          },
        }}
      >
        <div className="flex justify-end p-2">
          <Button
            className="rounded-full h-8 w-8 flex justify-center items-center "
            onClick={closeModal}
            color="gray"
            style={{ cursor: "pointer" }}
          >
            X
          </Button>
        </div>
        <UserDetailsEditForm
          userData={userData}
          closeModal={closeModal}
          onUserDataUpdate={handleUserDataUpdate}
        />
      </Modal>
      <FollowingModal
        isFollowingModalOpen={isFollowingModalOpen}
        setIsFollowingModalOpen={setIsFollowingModalOpen}
      />
      <FollowersModal
        isFollowersModalOpen={isFollowersModalOpen}
        setIsFollowersModalOpen={setIsFollowersModalOpen}
      />
    </div>
  );
}
