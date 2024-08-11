import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Button, Typography } from "@material-tailwind/react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { InputTag } from "./input";
import { loginInputData } from "../../assets/constants";
import { loginFormValidationSchema } from "../../assets/validationSchema";
import { api } from "../../api/api";
import { setUser, loginSuccess, selectIsLoggedIn } from "../../redux/userSlice";
import { showSuccess, showError } from "../../assets/tostify";
import OAuth from "./UserGoogleAuth";
import OtpVerificationModal from "./OtpVerification";

// eslint-disable-next-line react/prop-types
export function LoginForm({ closeLoginModal, openSignupModal }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const [email, password] = loginInputData;
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [error, setError] = useState(null); // for showing the error message from the backend
  const [isVerification, setIsVerification] = useState(false);
  const [isEmail, setIsEmail] = useState("");
  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = loginFormValidationSchema;

  const onSubmit = async (values) => {
    try {
      const response = await api.post("auth/login", values);
      if (response.status === 403) {
        setError(response.data.error);
      }
      const { accessToken, refreshToken, user } = response.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      const filteredUserData = {
        _id: user._id,
        name: user.name,
        bio: user.bio,
        profileImage: user.profileImage,
      };

      dispatch(setUser(filteredUserData));
      setError(null);
      dispatch(loginSuccess());
      showSuccess(`Welcome back Mr.${user.name}`);
      closeLoginModal();
      navigate("/");
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setError(error.response.data.error);
      } else {
        console.error("Login error:", error);
        setError("Invalid Email or Password");
      }
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      closeLoginModal();
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const openOtpModal = () => {
    setIsOtpModalOpen(true);
  };

  const closeOtpModal = () => {
    setIsOtpModalOpen(false);
  };

  const handleEmailSubmit = async (email) => {
    try {
      setIsEmail(email);
      await api.post("auth/sendOtp", { email: email });
      openOtpModal();
      setIsVerification(true);
      showSuccess("Email address is verified");
    } catch (error) {
      console.error("Error occurred while verifying email address:", error);
      showError("Email address isn't recognized");
    }
  };

  const handleOtpSubmit = async (otp, remainingTime) => {
    try {
      const response = await api.post("auth/verifyOtp", {
        otp: otp,
        email: isEmail,
      });

      if (response.status === 201) {
        const { accessToken, refreshToken, user } = response.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        const filteredUserData = {
          _id: user._id,
          name: user.name,
          bio: user.bio,
          profileImage: user.profileImage,
        };

        dispatch(setUser(filteredUserData));
        setError(null);
        dispatch(loginSuccess());
        showSuccess(`Welcome Mr.${user.name}`);
        navigate("/");
      } else if (response.status === 400) {
        console.error(response.data.error);
      } else {
        console.error("Unexpected status code:", response.status);
      }
    } catch (error) {
      console.error("Error occurred while verifying OTP:", error);
      if (remainingTime === 0) {
        showError("Timer has expired, please retry.");
      } else {
        showError("Invalid OTP, please retry.");
      }
    }
  };

  return (
    <div className="p-6 flex justify-center items-center rounded-lg h-full bg-gradient-to-br from-blue-500 to-purple-600">
      <Card
        color="transparent"
        shadow={false}
        className="w-80 max-w-md px-6 py-8 rounded-lg"
      >
        <small className="text-red-300">{error}</small>
        <Typography variant="h5" color="white" className="mb-4 text-center">
          Welcome Back Traveler!!
        </Typography>
        <form className="space-y-6" onSubmit={formik.handleSubmit}>
          <InputTag data={email} formik={formik} />
          <InputTag data={password} formik={formik} />
          <Button className="mt-4" fullWidth type="submit">
            Log In
          </Button>
          <Typography color="white" className="text-center font-normal">
            Don&apos;t have an account?{" "}
            <a
              href="#"
              className="font-medium"
              onClick={() => {
                openSignupModal();
              }}
            >
              <span className=" text-black transition-colors duration-300 hover:text-white">Sign Up </span>
              
            </a>
          </Typography>
          <OAuth />
          <Button
            className="mt-4"
            fullWidth
            onClick={() => {
              setIsVerification(false);
              openOtpModal();
            }}
          >
            OTP Login
          </Button>
          <OtpVerificationModal
            isOpen={isOtpModalOpen}
            onRequestClose={closeOtpModal}
            onSubmit={isVerification ? handleOtpSubmit : handleEmailSubmit}
            isVerification={isVerification}
          />
        </form>
      </Card>
    </div>
  );
}
