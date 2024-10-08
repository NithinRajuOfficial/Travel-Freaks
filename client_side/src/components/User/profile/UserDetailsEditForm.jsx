/* eslint-disable react/prop-types */
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Card,
  Input,
  Button,
  Typography,
  Textarea,
  Spinner
} from "@material-tailwind/react";
// import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../../../redux/userSlice";
import { api } from "../../../api/api";
import { defaultProImg } from "../../../assets/constants";
import { showError, showSuccess } from "../../../assets/tostify";


export function UserDetailsEditForm({
  userData,
  closeModal,
  onUserDataUpdate,
}) {
  const dispatch = useDispatch();
  // const [updateUserData,setUpdatedUserData] = useState(userData)
  const [loading,setLoading] = useState(false)
  const initialValues = {
    profileImage: userData ? userData.profileImage || "" : "",
    bio: userData ? userData.bio || "" : "",
    name: userData ? userData.name : "",
    email: userData ? userData.email : "",
    oldPassword: "",
    newPassword: "",
  };

  const validationSchema = Yup.object({
    profileImage: Yup.mixed()
      .test("fileSize", "Image size is too large", (value) => {
        // Check if value is a File object
        if (value instanceof File) {
          // Check if the file size is greater than 1MB (1024 * 1024 bytes)
          return value.size <= 2024 * 2024;
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
      bio: Yup.string()
    .required("Bio is required")
    .trim()
    .test("wordCount", "Bio must be 50 words or less", (value) => {
      if (value) {
        const wordCount = value.trim().split(/\s+/).length;
        return wordCount <= 50;
      }
      return true;
    }),
    name: Yup.string()
      .required("Name is required")
      .trim(),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const onSubmit = async (values) => {
    const formData = new FormData();
    formData.append("profileImage", values.profileImage);
    formData.append("bio", values.bio);
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("oldPassword", values.oldPassword);
    formData.append("newPassword", values.newPassword);
    
    try {
      setLoading(true)
      const response = await api.patch("user/updateUserDetails", formData);
      setLoading(false)
      const updatedUserDeatails = response.data.user;

      dispatch(setUser(updatedUserDeatails));

      onUserDataUpdate(updatedUserDeatails);
      //closing the modal after response
      closeModal();
      showSuccess(`Mr.${updatedUserDeatails.name}, your deatails are updated`)
    } catch (error) {
      console.error("Error while updating user details:", error);
      showError(`Mr.${userData.name}, please retry`)
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
    validateOnChange: true,
    validateOnBlur: true,
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Perform image type and size validation
      if (
        (file.type.startsWith("image/") && file.size <= 5024 * 5024) ||
        !file.type // Allow empty file
      ) {
        formik.setFieldValue("profileImage", file);
      } else {
        // If validation fails, set to existing profile image or null
        formik.setFieldValue(
          "profileImage",
          userData?.profileImage || null
        );
      }
    }
  };
  

  return (
    <Card
      color="transparent"
      shadow={false}
      className="flex flex-col items-center justify-center relative"
    >
      <Typography variant="h5" color="blue-gray">
        Update Profile
      </Typography>
      <form
        className="mt-4 w-80 max-w-screen-lg sm:w-96 flex flex-col items-center justify-center "
        onSubmit={formik.handleSubmit}
      >
        {/* Profile Image Upload */}
        <div className="mb-2">
          <input
            type="file"
            accept="image/*"
            id="profileImageInput"
            name="profileImage"
            onChange={handleImageChange}
            className="hidden"
            disabled={loading ? true : false}
          />
          <label htmlFor="profileImageInput" className="cursor-pointer">
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
              <img
                src={
                  formik.values.profileImage instanceof File
                    ? URL.createObjectURL(formik.values.profileImage)
                    : userData?.profileImage || defaultProImg 
                }
                alt="Profile Image"
                className="w-32 h-32 rounded-full object-cover"
              />
              <div className="absolute inset-0 items-center justify-center bg-gray-800 bg-opacity-50 hidden">
                <span className="text-white">Change Image</span>
              </div>
            </div>
          </label>
          {formik.errors.profileImage && (
            <small className="text-red-300">{formik.errors.profileImage}</small>
          )}
        </div>

        {/* Bio */}
        <div className="mb-2 w-72">
          <Textarea
            size="lg"
            label="Bio"
            id="bio"
            name="bio"
            value={formik.values.bio}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={loading ? true : false}
          />
          {formik.touched.bio && formik.errors.bio && (
            <small className="text-red-300">{formik.errors.bio}</small>
          )}
        </div>

        {/* Name */}
        <div className="mb-2 w-72">
          <Input
            size="lg"
            label="Name"
            id="name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={loading ? true : false}
          />
          {formik.touched.name && formik.errors.name && (
            <small className="text-red-300">{formik.errors.name}</small>
          )}
        </div>

        {/* Email */}
        <div className="mb-2 w-72">
          <Input
            size="lg"
            label="Email"
            id="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={loading ? true : false}
          />
          {formik.touched.email && formik.errors.email && (
            <small className="text-red-300">{formik.errors.email}</small>
          )}
        </div>

        {/* Old Password */}
        <div className="mb-2 w-72">
          <Input
            size="lg"
            type="password"
            label="Old Password"
            id="oldPassword"
            name="oldPassword"
            value={formik.values.oldPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={loading ? true : false}
          />
          {formik.touched.oldPassword && formik.errors.oldPassword && (
            <small className="text-red-300">{formik.errors.oldPassword}</small>
          )}
        </div>

        {/* New Password */}
        <div className="mb-2 w-72">
          <Input
            size="lg"
            type="password"
            label="New Password"
            id="newPassword"
            name="newPassword"
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={loading ? true : false}
          />
          {formik.touched.newPassword && formik.errors.newPassword && (
            <small className="text-red-300">{formik.errors.newPassword}</small>
          )}
        </div>

        {/* Update Button */}
        <Button className="mt-3" disabled={loading ? true : false} type="submit">
          Update Profile
        </Button>
      </form>
      <Spinner className={`h-16 w-16 text-gray-900/50 absolute ${!loading? "hidden" : ""}`} />
    </Card>
  );
}
