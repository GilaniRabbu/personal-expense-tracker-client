/* eslint-disable */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useCreateUserMutation } from "@/redux/api/userApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [createAccount, { isLoading }] = useCreateUserMutation();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sign Up form submitted:", formData);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (
      !formData.email ||
      !formData.phone ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      toast.error("All fields are required");
      return;
    }

    try {
      const { confirmPassword, ...rest } = formData;
      const res = await createAccount(rest).unwrap();
      if (res.success) {
        toast.success(res.message);
        router.push("/");
      }
    } catch (err: any) {
      console.error("Sign Up error:", err);
      toast.error(err.message);
    }
  };

  return (
    <section className="px-5 py-10">
      <div className="w-full max-w-lg mx-auto shadow-lg p-8 rounded-md bg-white">
        <h2 className="text-3xl font-bold text-center mb-6 text-slate-800">
          Sign Up
        </h2>

        <form className="space-y-5">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium mb-1 text-slate-700"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="Enter your first name"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none"
              required
            />
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium mb-1 text-slate-700"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Enter your last name"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none"
              required
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium mb-1 text-slate-700"
            >
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none"
              required
            />
          </div>

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
              placeholder="Create a password"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none"
              required
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium mb-1 text-slate-700"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none"
              required
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`w-full cursor-pointer py-2 rounded-lg transition-all duration-300 bg-[#07824D] text-white hover:bg-zinc-900 hover:text-white ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {/* Login link */}
        <p className="mt-6 text-center text-slate-600">
          Already have an account?{" "}
          <Link
            href="/"
            className="font-semibold text-[#07824D] hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}
