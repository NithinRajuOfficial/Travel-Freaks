import { useFormik } from "formik";
import * as Yup from "yup";
import { Card, Input, Button, Typography } from "@material-tailwind/react";

export function AdminLoginForm() {
  const formik = useFormik({
    initialValues: {
      userName: "",
      password: "",
    },
    validationSchema: Yup.object({
      userName: Yup.string().required("User Name is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: (values) => {
      console.log("Form submitted with values:", values);
    },
  });

  return (
    <div
      className="flex justify-center items-center h-screen"
      style={{
        background: "linear-gradient(135deg, #3498db, #8e44ad)",
      }}
    >
      <Card color="lightBlue" shadow={true} className="w-96 p-8">
        <Typography
          variant="h4"
          color="blueGray"
          className="mb-10 text-2xl text-gray-600"
        >
          Admin Login
        </Typography>
        <form className="space-y-6" onSubmit={formik.handleSubmit}>
          <div>
            <Input
              size="lg"
              label="User Name"
              name="username"
              value={formik.values.userName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.userName && formik.errors.userName && (
              <small className="text-red-300">{formik.errors.userName}</small>
            )}
          </div>
          <div>
            <Input
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
          <div className="flex justify-center" style={{ marginTop: "40px" }}>
            <Button
              color="lightBlue"
              className="bg-gradient-to-r from-lightBlue to-indigo-600 hover:from-lightBlue-500 hover:to-indigo-500"
              size="lg"
              type="submit"
            >
              Login
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
