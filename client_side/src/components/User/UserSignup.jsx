import { Card, Checkbox, Button, Typography } from "@material-tailwind/react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { InputTag } from "./input";
import { signupFormValidationSchema } from "../../assets/validationSchema";
import { signupInputData } from "../../assets/constants";
import { api } from "../../api/api";
import { setUser, loginSuccess } from "../../redux/userSlice";
import OAuth from "./UserGoogleAuth";
import { showSuccess } from "../../assets/tostify";

// eslint-disable-next-line react/prop-types
export function SignupForm({ closeSignupModal, openLoginModal }) {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [name, email, password] = signupInputData;
  const initialValues = {
    name: "",
    email: "",
    password: "",
    agreeTerms: false,
  };

  const validationSchema = signupFormValidationSchema;

  const onSubmit = async (values) => {
    try {
      const response = await api.post("auth/signup", values);
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
      dispatch(loginSuccess());
      showSuccess(`Welcome Mr.${user.name}`);
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.response.data.message);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <div className="p-6 flex justify-center items-center h-full rounded-lg bg-gradient-to-br from-blue-500 to-teal-400">
      <Card color="transparent" shadow={false} className="w-80 max-w-md">
        <small className="text-red-300">{error}</small>
        <Typography variant="h4" color="blue-gray">
          Sign Up
        </Typography>
        <Typography className="mt-1 font-normal text-gray-800">
          Enter your details to register.
        </Typography>
        <form className="mt-8 mb-2" onSubmit={formik.handleSubmit}>
          <div className="mb-4 space-y-6">
            <InputTag data={name} formik={formik} />
            <InputTag data={email} formik={formik} />
            <InputTag data={password} formik={formik} />
          </div>
          <Checkbox
            label={
              <Typography
                variant="small"
                className="flex items-center font-normal hover:cursor-default text-gray-800"
              >
                I agree the
                <a
                  href="#"
                  className="font-medium transition-colors hover:text-gray-900"
                >
                  &nbsp;Terms and Conditions
                </a>
              </Typography>
            }
            containerProps={{ className: "-ml-2.5" }}
            name="agreeTerms"
            checked={formik.values.agreeTerms}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <div>
            {formik.touched.agreeTerms && formik.errors.agreeTerms && (
              <small className="text-red-300 ">
                {formik.errors.agreeTerms}
              </small>
            )}
          </div>
          <Button className="mt-3" fullWidth type="submit">
            Register
          </Button>
          <Typography color="gray" className="mt-4 text-center font-normal">
            Already have an account?{" "}
            <a
              href="#"
              className="font-medium text-black transition-colors duration-300 hover:text-white"
              onClick={() => {
                closeSignupModal();
                openLoginModal();
              }}
            >
              Login In
            </a>
          </Typography>
          <OAuth />
        </form>
      </Card>
    </div>
  );
}
