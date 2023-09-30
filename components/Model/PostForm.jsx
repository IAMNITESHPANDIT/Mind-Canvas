// components/PostForm.js
import React from "react";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import Button from "@components/button/Button";
import "../../styles/postform.style.scss";
import { AiOutlineDelete } from "react-icons/ai";

const PostForm = ({ data, onSubmit, mode, open, setOpen }) => {
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    hashtags: Yup.array().test({
      name: "hashtags",
      test: function (value) {
        const { isUserAdded } = this.options.context; // Access the context

        if (isUserAdded && (!value || value.length === 0)) {
          return false; // Hashtags are mandatory if the user added fields
        }

        if (value && value.length > 0) {
          return value.every(
            (field) => field && field.trim() !== "" && field.length <= 10
          );
        }

        return true;
      },
      message:
        "Hashtags fields cannot be empty and must not exceed 10 characters",
    }),
    image: Yup.string().url("Invalid URL").required("Image URL is required"),
  });

  const initialValues = {
    title: data?.title?.length > 0 ? data?.title : "",
    description: data?.description?.length > 0 ? data?.description : "",
    hashtags: data?.hashtags?.length > 0 ? data?.hashtags : [],
    image: data?.image?.length > 0 ? data?.image : "",
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center postForm">
          <div className="bg-white p-8 rounded shadow-md w-96">
            <h2 className="text-2xl font-bold mb-4">
              {mode === "view" ? "View Post" : "Add Post"}
            </h2>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values, { resetForm }) => {
                onSubmit(values);
                resetForm();
                setOpen(true);
              }}
            >
              <Form>
                <div className="mb-4">
                  <label
                    htmlFor="title"
                    className="block text-sm font-bold text-gray-700"
                  >
                    Title
                  </label>
                  <Field
                    type="text"
                    id="title"
                    name="title"
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:border-blue-500"
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="block text-sm font-bold text-gray-700"
                  >
                    Description
                  </label>
                  <Field
                    type="text"
                    id="description"
                    name="description"
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:border-blue-500"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="hashtags"
                    className="block text-sm font-bold text-gray-700"
                  >
                    Hashtags
                  </label>
                  <FieldArray name="hashtags">
                    {({ push, remove, form }) => (
                      <div>
                        {form.values.hashtags.map((_, index) => (
                          <div key={index} className="flex items-center">
                            <Field
                              type="text"
                              id={`hashtags[${index}]`}
                              name={`hashtags[${index}]`}
                              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:border-blue-500"
                            />
                            <AiOutlineDelete
                              className="m-2"
                              title="Delete"
                              onClick={() => remove(index)}
                            />
                          </div>
                        ))}

                        {!form.errors.hashtags && // Check if there are no errors in hashtags
                          form.values.hashtags.length <= 4 && (
                            <Button
                              btnName="Add HashTag"
                              btnClsName="hashBtn"
                              btnEvent={() => push("")}
                            />
                          )}
                      </div>
                    )}
                  </FieldArray>
                  <ErrorMessage
                    name="hashtags"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="image"
                    className="block text-sm font-bold text-gray-700"
                  >
                    Image URL
                  </label>
                  <Field
                    type="text"
                    id="image"
                    name="image"
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:border-blue-500"
                  />
                  <ErrorMessage
                    name="image"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    btnEvent={() => setOpen(false)}
                    btnName="Cancel"
                    btnClsName="mr-2 btnEvent"
                  ></Button>
                  {mode !== "view" && (
                    <button
                      type="submit"
                      className="btnEvent text-white py-2 px-4 rounded"
                    >
                      Submit
                    </button>
                  )}
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      )}
    </>
  );
};

export default PostForm;
