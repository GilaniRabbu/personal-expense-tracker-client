/* eslint-disable */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLoginUserMutation } from "@/redux/api/authApi";
import { toast } from "sonner";

export default function LoginForm() {
  // Default credentials
  const defaultCredentials = {
    email: "gilani@gmail.com",
    password: "1234567",
  };

  const [userLogin, { isLoading }] = useLoginUserMutation();
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: defaultCredentials.email,
    password: defaultCredentials.password,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login form submitted:", formData);

    try {
      const res = await userLogin(formData).unwrap();
      console.log("Login success:", res);

      if (res.success) {
        router.push("/dashboard");
        toast.success(res.message);
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <section
      className={`px-5 py-10 md:py-0 md:min-h-screen md:flex md:items-center md:justify-center`}
    >
      <div className="w-full max-w-lg mx-auto shadow-lg p-8 rounded-md bg-white">
        <h2 className="text-3xl font-bold text-center mb-6 text-slate-800">
          Login
        </h2>

        <form className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1 text-slate-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email address"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1 text-slate-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none"
              required
            />
            <p className="mt-2 text-sm cursor-pointer text-[#07824D] hover:underline">
              Forgot password?
            </p>
          </div>

          <button
            onClick={handleSubmit}
            className={`w-full cursor-pointer py-2 rounded-lg transition-all duration-300 bg-[#07824D] text-white hover:bg-zinc-900 hover:text-white ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-slate-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-[#07824D] hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </section>
  );
}
