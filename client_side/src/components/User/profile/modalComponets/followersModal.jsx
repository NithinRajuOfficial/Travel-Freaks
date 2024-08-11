/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import {
  Typography,
  Button,
  Card,
  List,
  ListItem,
  ListItemPrefix,
  Avatar,
  Tooltip,
} from "@material-tailwind/react";
import { defaultProImg } from "../../../../assets/constants";
import { api } from "../../../../api/api";

export default function FollowersModal({
  isFollowersModalOpen,
  setIsFollowersModalOpen,
}) {
  const [followersList, setFollowersList] = React.useState([]);
  const [userFollowStatus, setUserFollowStatus] = React.useState({});
  const getAllFollowers = async () => {
    try {
      const response = await api.get("user/followers");
      const followersList = response.data?.obj;
      let userStatus = {};
      followersList.forEach((follower) => {
        userStatus[follower.data?._id] = follower.isFollowing;
      });
      setUserFollowStatus(userStatus);
      setFollowersList(followersList);
    } catch (error) {
      console.error("Error happened while fetching followers list:", error);
    }
  };

  const closeFollowersModal = () => {
    setIsFollowersModalOpen(!isFollowersModalOpen);
  };

  const handleFollowUnfollow = async (userIdToFollow) => {
    try {
      const response = await api.post(
        `user/follow&unfollow?userIdToFollow=${userIdToFollow}`
      );
      setUserFollowStatus((prev) => {
        const updatedStatus = { ...prev, [userIdToFollow] : !response.data.toUnfollow };
        return updatedStatus;
      });
    } catch (error) {
      console.error("Error on follow or unfollow action:", error);
    }
  };

  React.useEffect(() => {
    getAllFollowers();
  }, [isFollowersModalOpen]);

  return (
    <Modal
      className="w-full md:w-2/3 lg:w-1/2 xl:w-1/3 h-full"
      isOpen={isFollowersModalOpen}
      onRequestClose={closeFollowersModal}
      contentLabel="Following Modal"
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
          overflow: "auto",
          WebkitOverflowScrolling: "touch",
          borderRadius: "4px",
          outline: "none",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          height: "80vh",
          minWidth: "300px",
          maxWidth: "90%",
        },
      }}
    >
      <div className="flex justify-end p-2">
        <Button
          className="rounded-full h-8 w-8 flex justify-center items-center "
          onClick={closeFollowersModal}
          color="gray"
          style={{ cursor: "pointer" }}
        >
          X
        </Button>
      </div>
      <div className="flex flex-col items-center">
        <Typography variant="h5">Your Followers</Typography>
        {/* Display a message when there are no users to show */}
        {followersList?.length === 0 ? (
          <Typography variant="body" color="blue-gray" className="mt-4">
            No users to display.
          </Typography>
        ) : (
          // Map over the users array and display user data
          followersList.map((user) => (
            <Card
              key={user?.data?._id}
              className="w-72 sm:w-80 h-20 mt-5 shadow-2xl hover:shadow-3xl transition duration-300 ease-in-out transform hover:-translate-y-1"
            >
              <List>
                <ListItem className="cursor-default">
                  <ListItemPrefix>
                    <Avatar
                    className="w-12 h-10 sm:w-12 sm:h-12"
                      variant="circular"
                      alt={user?.data?.name}
                      src={
                        user?.data?.profileImage
                          ? user?.data?.profileImage
                          : defaultProImg
                      } // You can replace this with the user's profile image
                    />
                  </ListItemPrefix>
                  <div className="flex justify-start w-48">
                    <Link
                      to={`/profile/${user?.data?._id}`}
                      onClick={() => closeFollowersModal()}
                    >
                      <Typography variant="h6" color="blue-gray">
                        {user?.data?.name}
                      </Typography>
                    </Link>
                  </div>
                  <span
                    className="flex text-sm justify-end hover:cursor-pointer"
                    onClick={() => handleFollowUnfollow(user?.data?._id)}
                  >
                    {userFollowStatus[user.data?._id] ? (
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
                          height="2em"
                          width="2em"
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
                          height="2em"
                          width="2em"
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
                    )}
                  </span>
                </ListItem>
              </List>
            </Card>
          ))
        )}
      </div>
    </Modal>
  );
}
