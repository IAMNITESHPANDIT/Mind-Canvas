"use client";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { login } from "@lib/method";
import { signIn } from "next-auth/react";
import "tailwindcss/tailwind.css";

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const { success, token, role, userId } = await login(
        values.email,
        values.password
      );
      if (success) {
        sessionStorage.setItem("USER_TOKEN", token);
        sessionStorage.setItem("ROLE", role);
        sessionStorage.setItem("USER_ID", userId);
        router.push("/Dashboard");
      }
    },
  });

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        className="max-w-md p-4 bg-white rounded shadow"
        onSubmit={formik.handleSubmit}
      >
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <div className="mb-4">
          <input
            type="text"
            name="email"
            onChange={formik.handleChange}
            value={formik.values.email}
            placeholder="Email"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
          />
          {formik.errors.email && formik.touched.email && (
            <div className="text-red-500 text-sm">{formik.errors.email}</div>
          )}
        </div>
        <div className="mb-4">
          <input
            type="password"
            name="password"
            onChange={formik.handleChange}
            value={formik.values.password}
            placeholder="Password"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
          />
          {formik.errors.password && formik.touched.password && (
            <div className="text-red-500 text-sm">{formik.errors.password}</div>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none"
        >
          Login
        </button>
      </form>
      <button className="text-green-600" onClick={() => signIn()}>
        Sign In
      </button>
    </div>
  );
};

export default Login;
