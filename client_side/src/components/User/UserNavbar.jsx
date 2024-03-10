import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Navbar,
  Collapse,
  Typography,
  IconButton,
  Avatar,
  Button,
  Card,
  List,
  ListItem,
  ListItemPrefix,
  Tooltip,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  // Badge,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  ChevronDownIcon,
  // Cog6ToothIcon,
  // InboxArrowDownIcon,
  // LifebuoyIcon,
  PowerIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";
// import { BsChatSquareText  } from "react-icons/bs";
import { GiThreeFriends } from "react-icons/gi";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { clearUser } from "../../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { defaultProImg } from "../../assets/constants";
import { api } from "../../api/api";
import { LoginModal } from "./modals/Login&SignupModal";
import { showSuccess } from "../../assets/tostify";
// import ChatListModal from "./chat/SearchUsersModal";


export function NavbarDefault() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user);
  const [allUsers, setAllUsers] = React.useState([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [fetchingMore, setFetchingMore] = React.useState(false);
  const [allDataFetched, setAllDataFetched] = React.useState(false);
  const pageSize = 5;
  const modalContentRef = React.useRef(null);
  const [openNav, setOpenNav] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = React.useState(false);
  // const [isChatListModalOpen, setIsChatListModalOpen] = React.useState(false);
  console.log(userData,"ooo")
  // Define the logout function
  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      // Send a POST request to the logout route with the authorization header
      await axios.post("https://travelfreaks.nithin.website/api/auth/logout", null, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      // Clear tokens from local storage
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("accessToken");

      dispatch(clearUser());

      navigate("/");
      showSuccess("Logout Success")
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // function to get all the users from the database
  const getAllUsers = async () => {
    openModal();
    if (fetchingMore || allDataFetched) return;
    try {
      setFetchingMore(true);
      const response = await api.get(`user/getAllUsers`, {
        params: { page: currentPage, pageSize },
      });
      const newUsers = response.data.allUsersData;

      if (newUsers.length) {
        if (currentPage === 1) {
          setAllUsers([...new Set(newUsers)]);
        } else {
          setAllUsers((prevUsers) => {
            const uniqueUsers = new Map(
              prevUsers.map((user) => [user._id, user])
            );
            newUsers.forEach((user) => uniqueUsers.set(user._id, user));
            return [...uniqueUsers.values()];
          });
        }
      } else {
        setAllDataFetched(true);
      }
      setCurrentPage(currentPage + 1);
    } catch (error) {
      console.error("Something went wrong:", error);
    } finally {
      setFetchingMore(false);
    }
  };

  const handleScroll = () => {
    if (!modalContentRef.current || fetchingMore || allDataFetched) {
      return;
    }

    if (
      !fetchingMore &&
      modalContentRef.current.clientHeight +
        modalContentRef.current.scrollTop >=
        modalContentRef.current.scrollHeight - 100 &&
      currentPage > 1
    ) {
      getAllUsers();
    }
  };

  React.useEffect(() => {
    // Attach a scroll event listener
    window.addEventListener("scroll", handleScroll);
    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [fetchingMore]);

  // function for implementing follow
  const handleFollow = async (userIdToFollow) => {
    try {
      const response = await api.post(
        `user/follow&unfollow?userIdToFollow=${userIdToFollow}`
      );
      // Update the user's follow status in the allUsers array
      const updatedUsers = allUsers.map((user) => {
        if (user._id === userIdToFollow) {
          user.isFollowing = response.data.isFollowing;
        }
        return user;
      });

      // Set the updated array as the state
      setAllUsers(updatedUsers);
    } catch (error) {
      console.error("Error following that user:", error);
    }
  };

  // const toggleDrawer = () => {
  //   setIsChatListModalOpen(true)
  // };

  const navList = (
    <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <a href="#" className="flex items-center ">
        {/* <BsChatSquareText className="text-xl" onClick={toggleDrawer}/> */}
        </a>
      </Typography>
     
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
        onClick={getAllUsers}
      >
        <a href="#" className="flex items-center">
       < GiThreeFriends  className="text-xl"/>
        </a>
      </Typography>
    </ul>
  );

  // profile menu component
  const profileMenuItems = [
    userData?.isAuthenticated
      ? {
          label: "My Profile",
          icon: UserCircleIcon,
        }
      : null,

    // {
    //   label: "Inbox",
    //   icon: InboxArrowDownIcon,
    // },
    {
      label: userData?.isAuthenticated ? "Sign Out" : "Login",
      icon: userData?.name ? PowerIcon : ArrowRightOnRectangleIcon,
    },
  ];
  return (
    <Navbar className="mx-auto max-w-screen-xl py-2 px-4 lg:px-8 lg:py-4">
      {/* {isChatListModalOpen && <ChatListModal isOpen={isChatListModalOpen} closeChatModal={setIsChatListModalOpen}/> } */}
      <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
        <Typography
          as="a"
          href="#"
          className="mr-4 cursor-pointer py-1.5 font-medium"
          onClick={() => navigate("/")}
        >
          <span className="text-4xl font-bold text-blue-500">Travel</span>
          <span className="text-4xl font-bold text-green-500">Freaks</span>
        </Typography>
        <div className="hidden lg:block">{navList}</div>
        <div className="flex flex-col items-center">
          <Menu
            open={isMenuOpen}
            handler={setIsMenuOpen}
            placement="bottom-end"
          >
            <MenuHandler>
              <Button
                variant="text"
                color="blue-gray"
                className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto"
              >
                <Avatar
                  variant="circular"
                  size="sm"
                  alt=""
                  className="border border-gray-900 p-0.5"
                  src={
                    userData?.profileImage
                      ? userData.profileImage
                      : defaultProImg
                  }
                />
                <ChevronDownIcon
                  strokeWidth={2.5}
                  className={`h-3 w-3 transition-transform ${
                    isMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </Button>
            </MenuHandler>
            <MenuList className="p-1">
              {profileMenuItems.map((item) => {
                // Use a ternary operator to conditionally render MenuItem
                return item ? (
                  <MenuItem
                    key={item.label}
                    onClick={() => {
                      if (item.label === "Sign Out") {
                        handleLogout();
                      } else if (item.label === "My Profile") {
                        navigate("/profile");
                      } else if (item.label === "Login") {
                        setIsLoginModalOpen(true);
                      }
                    }}
                    className={`flex items-center gap-2 rounded ${
                      (userData && item.label === "Sign Out"
                        ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                        : "",
                      !userData && item.label === "Login"
                        ? "hover:bg-blue-500/10 focus:bg-blue-500/10 active:bg-blue-500/10"
                        : "")
                    }`}
                  >
                    {React.createElement(item.icon, {
                      className: `h-4 w-4 ${
                        userData && item.label === "Sign Out"
                          ? "text-red-500"
                          : !userData && item.label === "Login"
                          ? "text-blue-500"
                          : ""
                      }`,
                      strokeWidth: 2,
                    })}

                    <Typography
                      as="span"
                      variant="small"
                      className="font-normal"
                      color={
                        userData && item.label === "Sign Out"
                          ? "red"
                          : !userData && item.label === "Login"
                          ? "blue"
                          : ""
                      }
                    >
                      {item.label}
                    </Typography>
                  </MenuItem>
                ) : null;
              })}
            </MenuList>
          </Menu>
          {isLoginModalOpen && (
            <LoginModal
              isOpen={isLoginModalOpen}
              onRequestClose={() => setIsLoginModalOpen(false)}
            />
          )}
        </div>
        <Modal
          className="w-full md:w-2/3 lg:w-1/2 xl:w-1/3 h-full "
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          style={{
            overlay: {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,0.5)",
              zIndex: "99",
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
              maxWidth: "80%",
            },
          }}
        >
          <div ref={modalContentRef} className="flex justify-end">
            <Button
              className="rounded-full h-8 w-8 flex justify-center items-center mt-1 "
              onClick={closeModal}
              color="gray"
              style={{ cursor: "pointer" }}
            >
              X
            </Button>
          </div>
          <div></div>
          <div className="flex flex-col items-center">
            <Typography variant="h5">Find Your Fellow Travelers</Typography>
            {allUsers.length === 0 ? (
              // Display a message when there are no users to show
              <Typography variant="body" color="blue-gray" className="mt-4">
                No users to display.
              </Typography>
            ) : (
              // Map over the allUsers array and display user data
              allUsers.map((user) => (
                <Card
                  key={user._id}
                  className="w-80 h-20 mt-5 shadow-2xl hover:shadow-3xl transition duration-300 ease-in-out transform hover:-translate-y-1"
                >
                  <List>
                    <ListItem className="cursor-default">
                      <ListItemPrefix>
                        <Avatar
                          variant="circular"
                          alt={user._id}
                          src={user.profileImage || defaultProImg}
                        />
                      </ListItemPrefix>
                      <div className="flex justify-start w-48">
                        <Link to={`/profile/${user._id}`}>
                          <Typography
                            variant="h6"
                            color="blue-gray"
                            onClick={() => closeModal()}
                          >
                            {user.name}
                          </Typography>
                        </Link>
                      </div>
                      <span
                        className="flex justify-end hover:cursor-pointer"
                        onClick={() => handleFollow(user._id)}
                      >
                        {user.isFollowing ? (
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
        <IconButton
          variant="text"
          className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
          ripple={false}
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </IconButton>
      </div>
      <Collapse open={openNav}>
        <div className="container mx-auto">{navList}</div>
      </Collapse>
    </Navbar>
  );
}
