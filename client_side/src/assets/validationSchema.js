import * as Yup from "yup";

const loginFormValidationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid Email Address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const signupFormValidationSchema = Yup.object({
  name: Yup.string().trim().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  agreeTerms: Yup.bool().oneOf([true], "You must agree to the terms"),
});

const postFormInputValidations = Yup.object({
  title: Yup.string().trim().required("Title is required"),
  description: Yup.string().trim().required("Description is required"),
  image: Yup.mixed().when("isEdit", (isEdit, schema) => {
    // If isEditing is true (in edit mode) and a new image is required
    if (!isEdit) {
      return schema
        .required("Image is required")
        .test("fileSize", "Image size is too large", (value) => {
          return value && value.size <= 5000000; // For example, 5MB
        });
    }
    // If not in edit mode or no new image selected, no validation
    return schema;
  }),
  startDate: Yup.date()
    .required("Start Date is required")
    .min(new Date(), "Start Date cannot be a past date"),
  endDate: Yup.date()
    .required("End Date is required")
    .min(Yup.ref("startDate"), "End Date must be after Start Date")
    .test(
      "no-past-dates",
      "End Date cannot be a past date",
      function (endDate) {
        const startDate = this.resolve(Yup.ref("startDate"));
        return startDate <= endDate;
      }
    ),
  location: Yup.string().trim().required("Location is required"),
  itinerary: Yup.array().of(
    Yup.object().shape({
      day: Yup.number().required("Day is required"),
      activities: Yup.array().of(
        Yup.object().shape({
          description: Yup.string()
            .trim()
            .required("Activity description is required"),
          startTime: Yup.string()
            .required("Start Time is required")
            .test(
              "no-past-start-time",
              "Start Time cannot be in the past",
              function (startTime) {
                const currentDate = new Date();
                const selectedTime = new Date(
                  `${currentDate.toDateString()} ${startTime}`
                );
                return selectedTime >= currentDate;
              }
            ),
          endTime: Yup.string()
            .required("End Time is required")
            .test(
              "no-past-end-time",
              "End Time cannot be in the past",
              function (endTime) {
                const currentDate = new Date();
                const selectedTime = new Date(
                  `${currentDate.toDateString()} ${endTime}`
                );
                return selectedTime >= currentDate;
              }
            ),
        })
      ),
    })
  ),

  currency: Yup.string().when("isEdit", {
    is: false,
    then: Yup.string().trim().required("Currency is required"),
  }),
  amount: Yup.number().when("isEdit", {
    is: false,
    then: Yup.number()
      .required("Amount is required")
      .min(1, "Must be at least 1"),
  }),
  maxNoOfPeoples: Yup.number()
    .required("Maximum Number of People is required")
    .min(1, "Must be at least 1"),
});

export {
  loginFormValidationSchema,
  signupFormValidationSchema,
  postFormInputValidations,
};
