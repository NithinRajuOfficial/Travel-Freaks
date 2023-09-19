import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { api } from "../../api/api";

// eslint-disable-next-line react/prop-types
export function SignupForm({closeSignupModal,openLoginModal}) {
  const navigate = useNavigate();

  const initialValues = {
    name: "",
    email: "",
    password: "",
    agreeTerms: false,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    agreeTerms: Yup.bool().oneOf([true], "You must agree to the terms"),
  });

  const onSubmit = async (values) => {
    try {
      const response = await api.post("auth/signup", values);
      const { accessToken, refreshToken, user } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      console.log(accessToken, "accessTokenoo");
      console.log(refreshToken, "refreshTokenoo");
      console.log("Registration success:", user);

      navigate("/home");
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <div className="flex justify-center items-center h-full rounded-lg bg-gradient-to-br from-blue-500 to-teal-400">
      <Card color="transparent" shadow={false} className="w-80 max-w-md">
        <Typography variant="h4" color="blue-gray">
          Sign Up
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          Enter your details to register.
        </Typography>
        <form className="mt-8 mb-2" onSubmit={formik.handleSubmit}>
          <div className="mb-4 space-y-6">
            <Input
              color="white"
              size="lg"
              label="Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.name && formik.errors.name && (
              <small className="text-red-300">{formik.errors.name}</small>
            )}
            <Input
              color="white"
              size="lg"
              label="Email"
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
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password && (
              <small className="text-red-300">{formik.errors.password}</small>
            )}
          </div>
          <Checkbox
            label={
              <Typography
                variant="small"
                color="gray"
                className="flex items-center font-normal"
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
              <small className="text-red-300">{formik.errors.agreeTerms}</small>
            )}
          </div>
          <Button className="mt-6" fullWidth type="submit">
            Register
          </Button>
          <Typography color="gray" className="mt-4 text-center font-normal">
            Already have an account?{" "}
            <a href="#" className="font-medium text-gray-900" onClick={()=>{closeSignupModal();openLoginModal()}}>
              Sign In
            </a>
          </Typography>
        </form>
      </Card>
    </div>
  );
}
