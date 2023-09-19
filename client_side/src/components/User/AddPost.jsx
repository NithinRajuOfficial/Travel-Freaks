import {
  Card,
  Input,
  Button,
  Typography,
  Textarea,
} from "@material-tailwind/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { api } from "../../api/api";
import { useEffect } from "react";

// eslint-disable-next-line react/prop-types
export function PostCreationForm({ onSuccess }) {
  const initialValues = {
    title: "",
    description: "",
    image: null,
    startDate: null,
    endDate: null,
    location: "",
    itinerary: [
      { day: 1, activities: [{ description: "", startTime: "", endTime: "" }] },
    ],
    budget: { currency: "", amount: "" },
    maxNoOfPeoples: 0,
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    image: Yup.mixed()
      .required("Image is required")
      .test("fileSize", "Image size is too large", (value) => {
        return value && value.size <= 5000000; // For example, 5MB
      }),
    startDate: Yup.date().required("Start Date is required"),
    endDate: Yup.date()
      .required("End Date is required")
      .min(Yup.ref("startDate"), "End Date must be after Start Date"),
    location: Yup.string().required("Location is required"),
    itinerary: Yup.array().of(
      Yup.object().shape({
        day: Yup.number().required("Day is required"),
        activities: Yup.array().of(
          Yup.object().shape({
            description: Yup.string().required(
              "Activity description is required"
            ),
            startTime: Yup.string().required("Start Time is required"),
            endTime: Yup.string().required("End Time is required"),
          })
        ),
      })
    ),
    budget: Yup.object().shape({
      currency: Yup.string().required("Currency is required"),
      amount: Yup.number().required("Amount is required"),
    }),
    maxNoOfPeoples: Yup.number()
      .required("Maximum Number of People is required")
      .min(1, "Must be at least 1"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
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
      formData.append("budget", JSON.stringify(values.budget));
      formData.append("maxNoOfPeoples", values.maxNoOfPeoples);

      try {
        const response = await api.post("user/addPost", formData);
        const responseData = response.data;
        console.log(responseData, "response data...");
        onSuccess();
      } catch (error) {
        console.error("Post Creating error:", error);
      }
    },
  });

  useEffect(() => {
    // Generate itinerary items based on start and end dates
    if (formik.values.startDate && formik.values.endDate) {
      const startDate = new Date(formik.values.startDate);
      const endDate = new Date(formik.values.endDate);
      const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

      formik.setFieldValue(
        "itinerary",
        Array.from({ length: days }, (_, i) => ({
          day: i + 1,
          activities: [{ description: "", startTime: "", endTime: "" }],
        }))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.startDate, formik.values.endDate]);

  return (
    <Card color="transparent" shadow={false}>
      <Typography variant="h4" color="blue-gray">
        Trip Details
      </Typography>
      <form onSubmit={formik.handleSubmit} className="mt-4 space-y-4">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <Input
              size="lg"
              label="Title"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.title && formik.errors.title && (
              <small className="text-red-500  mt-1">
                {formik.errors.title}
              </small>
            )}
          </div>
          <div className="flex-1">
            <Input
              size="lg"
              label="Location"
              name="location"
              value={formik.values.location}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.location && formik.errors.location && (
              <small className="text-red-500  mt-1">
                {formik.errors.location}
              </small>
            )}
          </div>
        </div>

        <Textarea
          size="lg"
          label="Description"
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.description && formik.errors.description && (
          <small className="text-red-500  mt-1">
            {formik.errors.description}
          </small>
        )}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <Input
              type="date"
              size="lg"
              label="Start Date"
              name="startDate"
              value={formik.values.startDate || ""}
              onChange={(event) => {
                formik.setFieldValue("startDate", event.target.value);
              }}
              onBlur={formik.handleBlur}
            />
            {formik.touched.startDate && formik.errors.startDate && (
              <small className="text-red-500  mt-1">
                {formik.errors.startDate}
              </small>
            )}
          </div>
          <div className="flex-1">
            <Input
              type="date"
              size="lg"
              label="End Date"
              name="endDate"
              value={formik.values.endDate || ""}
              onChange={(event) => {
                formik.setFieldValue("endDate", event.target.value);
              }}
              onBlur={formik.handleBlur}
            />
            {formik.touched.endDate && formik.errors.endDate && (
              <small className="text-red-500  mt-1">
                {formik.errors.endDate}
              </small>
            )}
          </div>
        </div>

        {/* Itinerary */}
        {formik.values.itinerary.map((day, index) => (
          <div key={index} className="space-y-4">
            {day.activities.map((activity, activityIndex) => (
              <div
                key={activityIndex}
                className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
              >
                <div className="flex-1">
                  <Input
                    size="lg"
                    label={`Day ${day.day} Activity Description`}
                    name={`itinerary[${index}].activities[${activityIndex}].description`}
                    value={activity.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.itinerary?.[index]?.activities?.[
                    activityIndex
                  ]?.description &&
                    formik.errors.itinerary?.[index]?.activities?.[
                      activityIndex
                    ]?.description && (
                      <small className="text-red-500  mt-1">
                        {
                          formik.errors.itinerary?.[index]?.activities?.[
                            activityIndex
                          ]?.description
                        }
                      </small>
                    )}
                </div>
                <div className="flex-.5">
                  <Input
                    type="time"
                    size="lg"
                    label={`Day ${day.day} Activity Start Time`}
                    name={`itinerary[${index}].activities[${activityIndex}].startTime`}
                    value={activity.startTime}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.itinerary?.[index]?.activities?.[
                    activityIndex
                  ]?.startTime &&
                    formik.errors.itinerary?.[index]?.activities?.[
                      activityIndex
                    ]?.startTime && (
                      <small className="text-red-500  mt-1">
                        {
                          formik.errors.itinerary?.[index]?.activities?.[
                            activityIndex
                          ]?.startTime
                        }
                      </small>
                    )}
                </div>
                <div className="flex-.5">
                  <Input
                    type="time"
                    size="lg"
                    label={`Day ${day.day} Activity End Time`}
                    name={`itinerary[${index}].activities[${activityIndex}].endTime`}
                    value={activity.endTime}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.itinerary?.[index]?.activities?.[
                    activityIndex
                  ]?.endTime &&
                    formik.errors.itinerary?.[index]?.activities?.[
                      activityIndex
                    ]?.endTime && (
                      <small className="text-red-500  mt-1">
                        {
                          formik.errors.itinerary?.[index]?.activities?.[
                            activityIndex
                          ]?.endTime
                        }
                      </small>
                    )}
                </div>
              </div>
            ))}
          </div>
        ))}

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <Input
              size="lg"
              label="Budget Currency"
              name="budget.currency"
              type="text"
              value={formik.values.budget.currency}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.budget?.currency &&
              formik.errors.budget?.currency && (
                <small className="text-red-500  mt-1">
                  {formik.errors.budget.currency}
                </small>
              )}
          </div>
          <div className="flex-1">
            <Input
              size="lg"
              label="Budget Amount"
              name="budget.amount"
              type="number"
              value={formik.values.budget.amount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.budget?.amount && formik.errors.budget?.amount && (
              <small className="text-red-500  mt-1">
                {formik.errors.budget.amount}
              </small>
            )}
          </div>
        </div>
        <div className="flex justify-between sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="w-80">
            <Input
              size="lg"
              label="Max Number of People"
              name="maxNoOfPeoples"
              type="number"
              value={formik.values.maxNoOfPeoples}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.maxNoOfPeoples && formik.errors.maxNoOfPeoples && (
              <small className="text-red-500">
                {formik.errors.maxNoOfPeoples}
              </small>
            )}
          </div>
          <div className="w-96">
            {/* <label className="block text-blue-gray-600 text-lg font-semibold">
              Upload Images
            </label> */}
            <input
              type="file"
              accept="image/*"
              name="image"
              onChange={(event) => {
                formik.setFieldValue("image", event.target.files[0]);
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
                src={URL.createObjectURL(formik.values.image)}
                alt="Selected Image"
                className="max-h-36 mt-2"
              />
            )}
          </div>
        </div>

        <Button className="mt-4 sm:mt-6 " type="submit">
          Create Post
        </Button>
      </form>
    </Card>
  );
}
