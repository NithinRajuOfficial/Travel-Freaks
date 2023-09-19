import { useEffect, useState } from "react";
import {useDispatch, useSelector} from "react-redux"
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import { loginSuccess,selectIsLoggedIn} from "../../redux/userSlice";


// eslint-disable-next-line react/prop-types
export function LoginForm({closeLoginModal,openSignupModal}) {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Inavalid Email Address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  const [error, setError] = useState(null); // for showing the error message from the backend

  const onSubmit = async (values) => {
    try {
      const response = await api.post("auth/login", values);

      const { accessToken, refreshToken, user } = response.data;

      // Store the access token in localStorage
      localStorage.setItem("accessToken", accessToken);
      // Store the refresh token in localStorage or secure HttpOnly cookie (not recommended for security reasons)
      localStorage.setItem("refreshToken", refreshToken);
      console.log(accessToken, "acces1");
      console.log(refreshToken, "refresh1");
      console.log("Login sucess:", user);
      setError(null);
      dispatch(loginSuccess())
      navigate("/home");
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid Email or Password");
    }
  };

  useEffect(()=>{
    console.log("isLoggedIn:", isLoggedIn);
    if(isLoggedIn){
      console.log("Redirecting to /home");
      navigate("/home")
    }
  },[isLoggedIn,navigate])

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });
  return (
    <div className="flex justify-center items-center rounded-lg h-full bg-gradient-to-br from-blue-500 to-purple-600">
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
          <Input
            color="white"
            size="lg"
            label="Email"
            placeholder="Email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email && (
            <small className="text-red-300">{formik.errors.email}</small>
          )}
          <Input
            color="white"
            type="password"
            size="lg"
            label="Password"
            placeholder="Password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.password && formik.errors.password && (
            <small className="text-red-300">{formik.errors.password}</small>
          )}
          <Button className="mt-4" size="lg" fullWidth type="submit">
            Log In
          </Button>
          <Typography color="white" className="text-center font-normal">
            Don&apos;t have an account?{" "}
            <a href="#" className="font-medium text-white" onClick={()=>{closeLoginModal();openSignupModal()}}>
              Sign Up
            </a>
          </Typography>
        </form>
      </Card>
    </div>
  );
}
