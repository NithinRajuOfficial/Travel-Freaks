/* eslint-disable react/prop-types */
import { Card, Button, Typography, Spinner } from "@material-tailwind/react";
import { useFormik } from "formik";
import { api } from "../../api/api";
import { useEffect, useState } from "react";
import { postFormInputValidations } from "../../assets/validationSchema";
import { postInputData } from "../../assets/constants";
import { InputTag, ItineryErrorValidations } from "./input";
import { useDispatch } from "react-redux";
import { showSuccess, showError } from "../../assets/tostify";
import {
  fetchPostStart,
  fetchPostSuccess,
  fetchPostFailure,
} from "../../redux/postSlice";
// eslint-disable-next-line react/prop-types

export function PostCreationForm({ onSuccess, postData, isEdit }) {
  const [status, setStatus] = useState(false);
  const [
    title,
    startDate,
    endDate,
    location,
    currency,
    amount,
    maxNumberOfPeoples,
    description,
  ] = postInputData;
  const dispatch = useDispatch();
  const [imageSource, setImageSource] = useState("");
  const initialValues = postData || {
    title: "",
    description: "",
    image: null,
    startDate: "",
    endDate: "",
    location: "",
    itinerary: [
      { day: 1, activities: [{ description: "", startTime: "", endTime: "" }] },
    ],
    currency: "",
    amount: "",
    maxNoOfPeoples: 0,
  };

  const validationSchema = postFormInputValidations;

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      console.log(values, "///");
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("image", values.image);
      // Convert string dates to Date objects
      const startDate = new Date(values.startDate);
      const endDate = new Date(values.endDate);
      formData.append("startDate", startDate.toISOString());
      formData.append("endDate", endDate.toISOString());
      formData.append("location", values.location);
      formData.append("itinerary", JSON.stringify(values.itinerary));
      formData.append("amount", JSON.stringify(values.amount));
      formData.append("currency", values.currency);
      formData.append("maxNoOfPeoples", values.maxNoOfPeoples);
      isEdit ? editPost(formData) : addPost(formData);
    },
  });

  async function addPost(formData) {
    try {
      dispatch(fetchPostStart());
      setStatus(true);
      const response = await api.post("user/addPost", formData);
      const createdPostData = response.data;
      dispatch(fetchPostSuccess(createdPostData));
      onSuccess();
      showSuccess("Successfully Created Post");
      setStatus(false);
    } catch (error) {
      dispatch(fetchPostFailure(error.message));
      console.error("Post Creating error:", error);
      showError("Post Creating error, please try again");
    }
  }

  async function editPost(formData) {
    try {
      dispatch(fetchPostStart());
      const response = await api.patch(
        `user/editPost/${postData._id}`,
        formData
      );
      const updatedPostData = response.data?.post;
      console.log(updatedPostData, "))))))))))");
      dispatch(fetchPostSuccess(updatedPostData));
      onSuccess();
      showSuccess("Post Edited Successfully");
    } catch (error) {
      dispatch(fetchPostFailure(error.message));
      console.error("Post Creating error:", error);
      showError("Editing Post Failed, please try again.");
    }
  }

  useEffect(() => {
    // Generate or update itinerary items based on start and end dates
    if (formik.values.startDate && formik.values.endDate) {
      const newStartDate = new Date(formik.values.startDate);
      const newEndDate = new Date(formik.values.endDate);

      // Calculate the number of days, including both start and end dates
      const days = Math.ceil(
        (newEndDate - newStartDate) / (1000 * 60 * 60 * 24) + 1
      );

      // Check if the itinerary length needs to be increased
      if (days > formik.values.itinerary.length) {
        const currentItinerary = formik.values.itinerary;
        const newItinerary = Array.from({ length: days }, (_, i) => {
          if (i < currentItinerary.length) {
            return currentItinerary[i];
          } else {
            return {
              day: i + 1,
              activities: [{ description: "", startTime: "", endTime: "" }],
            };
          }
        });
        formik.setFieldValue("itinerary", newItinerary);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.startDate, formik.values.endDate]);

  // // date formatting code
  // function convertDate(inputDate) {
  //   // Create a Date object from the input date string
  //   const date = new Date(inputDate);

  //   // Get the year, month, and day components
  //   const year = date.getUTCFullYear();
  //   const month = (date.getUTCMonth() + 1).toString().padStart(2, "0"); // Add 1 to month (0-indexed) and pad with '0'
  //   const day = date.getUTCDate().toString().padStart(2, "0"); // Pad day with '0'

  //   // Combine the components into the desired format
  //   const formattedDate = `${year}-${month}-${day}`;

  //   return formattedDate;
  // }

  return (
    <Card color="transparent" shadow={false} className="relative">
      <Typography variant="h4" color="blue-gray">
        Trip Details
      </Typography>
      <form onSubmit={formik.handleSubmit} className="mt-4 space-y-4">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <InputTag data={title} formik={formik} status={status} />
          </div>
          <div className="flex-1">
            <InputTag data={location} formik={formik} status={status} />
          </div>
        </div>

        <InputTag
          data={description}
          formik={formik}
          type={"textarea"}
          status={status}
        />
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <InputTag data={startDate} formik={formik} status={status} />
          </div>
          <div className="flex-1">
            <InputTag data={endDate} formik={formik} status={status} />
          </div>
        </div>

        {/* Itinerary */}
        {formik.values.itinerary.map((day, index) => (
          <ItineryErrorValidations
            key={index}
            day={day}
            index={index}
            formik={formik}
            status={status}
          />
        ))}

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <InputTag data={currency} formik={formik} status={status} />
          </div>
          <div className="flex-1">
            <InputTag data={amount} formik={formik} status={status} />
          </div>
        </div>
        <div className="flex justify-between sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="w-80">
            <InputTag
              data={maxNumberOfPeoples}
              formik={formik}
              status={status}
            />
          </div>
          <div className="w-96">
            {/* <label className="block text-blue-gray-600 text-lg font-semibold">
              Upload Images
            </label> */}
            <input
              type="file"
              accept="image/*"
              name="image"
              disabled={status ? status : false}
              onChange={(event) => {
                formik.setFieldValue("image", event.target.files[0]);
                const selectedImage = event.target.files[0];
                if (selectedImage) {
                  setImageSource(URL.createObjectURL(selectedImage));
                }
              }}
              onBlur={formik.handleBlur}
            />
            {formik.touched.image && formik.errors.image && (
              <small className="text-red-500 ml-16 ">
                {formik.errors.image}
              </small>
            )}
            {formik.values.image && (
              <img
                src={imageSource || (postData ? formik.values.image : "")}
                alt="Selected Image"
                className="max-h-36 mt-2"
              />
            )}
          </div>
        </div>

        <Button
          className="mt-4 sm:mt-6 "
          type="submit"
          disabled={status ? status : false}
        >
          {isEdit ? "Update Post" : "Create Post"}
        </Button>
      </form>
      <Spinner color="indigo"
        className={`h-16 w-16 text-gray-900/50  absolute top-1/2 left-1/2 ${
          !status ? "hidden" : ""
        }`}
      />
    </Card>
  );
}
