import React from "react";
import axios from "axios";
import {
  Navbar,
  MobileNav,
  Typography,
  IconButton,
  Avatar,
  Button,
} from "@material-tailwind/react";
import {useNavigate} from "react-router-dom"
import { clearUser } from "../../redux/userSlice";
import { useDispatch } from "react-redux";

export function NavbarDefault() {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  

  const [openNav, setOpenNav] = React.useState(false);

  // Define the logout function
  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      // if (!refreshToken) {
      //   // Handle the case where authTokens are missing
      //    navigate("/");
      // }

      // Send a POST request to the logout route with the authorization header
      await axios.post("http://localhost:5500/api/auth/logout", null, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      // Clear tokens from local storage
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("accessToken");
     

      dispatch(clearUser())
  
      navigate("/")

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

  const navList = (
    <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <a href="#" className="flex items-center">
          Home
        </a>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <a href="#" className="flex items-center">
          Communities
        </a>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <a href="#" className="flex items-center">
          Trips
        </a>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <a href="#" className="flex items-center">
          Profile
        </a>
      </Typography>
    </ul>
  );

  return (
    <Navbar className="mx-auto max-w-screen-xl py-2 px-4 lg:px-8 lg:py-4">
      <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
        <Typography
          as="a"
          href="#"
          className="mr-4 cursor-pointer py-1.5 font-medium"
        >
          <span className="text-4xl font-bold text-blue-500">Travel</span>
          <span className="text-4xl font-bold text-green-500">Freaks</span>
        </Typography>
        <div className="hidden lg:block">{navList}</div>
        <div className="flex flex-col items-center">
          <Avatar
            size="lg"
            alt="avatar"
            src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80"
            className="border border-green-500 shadow-xl shadow-green-900/20 ring-4 ring-white-500/30"
          />
          {/* Logout Button */}
          <Button
            onClick={()=>{
              handleLogout()
            }}
            color="secondary"
            size="xs"
            rounded={true}
            className="mt-2 px-2 py-1 text-xs font-semibold"
          >
            Logout
          </Button>
        </div>
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
      <MobileNav open={openNav}>
        <div className="container mx-auto">{navList}</div>
      </MobileNav>
    </Navbar>
  );
}
