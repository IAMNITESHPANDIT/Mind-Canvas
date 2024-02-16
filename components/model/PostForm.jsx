import React from "react";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import Button from "@components/button/Button";
import "../../styles/postform.style.scss";
import { AiOutlineDelete } from "react-icons/ai";
import { validationSchema } from "./PostSchema";
import Head from "next/head";

const PostForm = ({ data, onSubmit, mode, open, setOpen }) => {
  const initialValues = {
    _id: data?._id ? data?._id : "",
    title: data?.title?.length > 0 ? data?.title : "",
    description: data?.description?.length > 0 ? data?.description : "",
    hashtags: data?.hashtags?.length > 0 ? data?.hashtags : [],
    image: data?.image?.length > 0 ? data?.image : "",
  };
  const pageTitle =
    mode === "view" ? "View Post" : mode === "edit" ? "Edit Post" : "Add Post";
  const pageDescription =
    mode === "view"
      ? "View and explore post details."
      : "Create or edit a post with our easy-to-use form.";

  const shouldRenderAddButton = (form) => {
    return (
      !form.errors.hashtags &&
      form.values.hashtags.length <= 4 &&
      mode !== "view"
    );
  };

  const viewHandler = (mode) => {
    return mode === "view";
  };

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Head>
      {open && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center postForm ">
          <div className="bg-white p-8 rounded shadow-md w-96">
            <h2 className="text-2xl font-bold mb-4">
              {mode === "view"
                ? "View Post"
                : mode == "edit"
                ? "Edit Post"
                : "Add Post"}
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
                    disabled={viewHandler(mode)}
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
                    disabled={viewHandler(mode)}
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
                              disabled={viewHandler(mode)}
                              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:border-blue-500"
                            />
                            {!viewHandler(mode) && (
                              <AiOutlineDelete
                                className="m-2 cursor-pointer"
                                title="Delete"
                                onClick={() => remove(index)}
                              />
                            )}
                          </div>
                        ))}

                        {shouldRenderAddButton(form) && (
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
                    disabled={viewHandler(mode)}
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
