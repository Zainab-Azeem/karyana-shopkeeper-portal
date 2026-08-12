import { useState } from "react";
import {
  Eye,
  EyeOff,
  Loader2,
  ShoppingBasket,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  Navigate,
  useNavigate,
} from "react-router-dom";

import { loginUser } from "../api/AuthApi";
import useAuth from "../hooks/useAuth";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (data) => {
    try {
      const response = await loginUser(data);

      const token = response.data?.token;
      const user = response.data?.user;

      if (!token || !user) {
        toast.error("Login failed. Please try again.");
        return;
      }

      login(token, user);

      toast.success("Login successful");

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Invalid email or password");
      } else {
        toast.error(
          error.response?.data?.message ||
            "Something went wrong. Please try again."
        );
      }
    }
  };

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl lg:grid-cols-2">
          
          {/* Desktop Branding */}
          <div className="hidden bg-blue-600 p-12 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
                <ShoppingBasket size={28} />
              </div>

              <h1 className="mt-8 text-4xl font-bold">
                Karyana Shop
              </h1>

              <p className="mt-4 max-w-sm text-blue-100">
                Manage your products, customers,
                categories and suppliers from one
                simple shopkeeper portal.
              </p>
            </div>

            <p className="text-sm text-blue-200">
              Simple. Fast. Organized.
            </p>
          </div>

          {/* Login Section */}
          <div className="p-6 sm:p-10 lg:p-12">
            <div className="mx-auto w-full max-w-md">
              
        

              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Welcome back
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Sign in to your shopkeeper portal.
              </p>

              <form
                onSubmit={handleSubmit(handleLogin)}
                className="mt-8 space-y-5"
              >
                
                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email
                  </label>

                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    {...register("email", {
                      required:
                        "Email is required",
                      pattern: {
                        value:
                          /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message:
                          "Enter a valid email",
                      },
                    })}
                  />

                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Password
                  </label>

                  <div className="relative">
                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Enter your password"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                      {...register("password", {
                        required:
                          "Password is required",
                        minLength: {
                          value: 8,
                          message:
                            "Password must be at least 8 characters",
                        },
                      })}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                      {showPassword ? (
                        <EyeOff size={19} />
                      ) : (
                        <Eye size={19} />
                      )}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">
                      {
                        errors.password
                          .message
                      }
                    </p>
                  )}
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting && (
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                  )}

                  {isSubmitting
                    ? "Signing in..."
                    : "Login"}
                </button>
              </form>

              <p className="mt-8 text-center text-xs text-slate-400">
                Karyana Shopkeeper Portal
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}