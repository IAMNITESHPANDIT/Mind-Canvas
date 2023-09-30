import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string()
    .required("Description is required")
    .max(100, "Description must be at most 100 characters"),
  hashtags: Yup.array().test({
    name: "hashtags",
    test: function (value) {
      const { isUserAdded } = this.options.context; // Access the context
      if (isUserAdded && (!value || value.length === 0)) {
        return false; // Hashtags are mandatory if the user added fields
      }

      if (value && value.length > 0) {
        return value.every(
          (field) =>
            field &&
            field.trim() !== "" &&
            field.length <= 10 &&
            !/\s/.test(field)
        );
      }

      return true;
    },
    message:
      "Hashtags fields cannot be empty, must not exceed 10 characters, and should not contain spaces",
  }),
  image: Yup.string().url("Invalid URL").required("Image URL is required"),
});
