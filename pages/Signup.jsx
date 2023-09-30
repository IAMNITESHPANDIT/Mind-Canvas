"use client";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "tailwindcss/tailwind.css";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  number: Yup.string()
    .required("Number is required")
    .matches(/^\d{10}$/, "Invalid number format"),
  role: Yup.string().required("Role is required"),
  image: Yup.mixed()
    .required("Image is required")
    .test(
      "fileSize",
      "File size too large",
      (value) => !value || value.size <= 500000
    ),
});

const Register = () => {
  const [image, setImage] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      number: "",
      role: "",
      image: null,
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
      const defulatImage =
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D&w=1000&q=80";

      // Handle form submission, including image upload
      const rawResponse = fetch(`/api/register`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
          number: values.number,
          role: values.role,
          image: defulatImage || values.image,
        }),
      });
      const content = rawResponse.json();
      console.log(content);
    },
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
    formik.setFieldValue("image", file);
  };

  return (
    <form onSubmit={formik.handleSubmit} className="max-w-md mx-auto">
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="name"
        >
          Name
        </label>
        <input
          type="text"
          name="name"
          onChange={formik.handleChange}
          value={formik.values.name}
          className="px-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        {formik.errors.name && formik.touched.name && (
          <p className="text-red-500 text-xs italic">{formik.errors.name}</p>
        )}
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="email"
        >
          Email
        </label>
        <input
          type="email"
          name="email"
          onChange={formik.handleChange}
          value={formik.values.email}
          className="px-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        {formik.errors.email && formik.touched.email && (
          <p className="text-red-500 text-xs italic">{formik.errors.email}</p>
        )}
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="password"
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          onChange={formik.handleChange}
          value={formik.values.password}
          className="px-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        {formik.errors.password && formik.touched.password && (
          <p className="text-red-500 text-xs italic">
            {formik.errors.password}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="number"
        >
          Number
        </label>
        <input
          type="text"
          name="number"
          onChange={formik.handleChange}
          value={formik.values.number}
          className="px-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        {formik.errors.number && formik.touched.number && (
          <p className="text-red-500 text-xs italic">{formik.errors.number}</p>
        )}
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="role"
        >
          Role
        </label>
        <select
          name="role"
          onChange={formik.handleChange}
          value={formik.values.role}
          className="px-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select a role</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
        {formik.errors.role && formik.touched.role && (
          <p className="text-red-500 text-xs italic">{formik.errors.role}</p>
        )}
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="image"
        >
          Profile Picture
        </label>
        <input
          type="file"
          name="image"
          onChange={handleImageUpload}
          className="px-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        {formik.errors.image && formik.touched.image && (
          <p className="text-red-500 text-xs italic">{formik.errors.image}</p>
        )}
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      >
        Register
      </button>
    </form>
  );
};

export default Register;
