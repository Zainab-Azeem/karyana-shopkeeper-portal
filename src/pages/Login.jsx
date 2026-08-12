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
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[28px] border border-slate-200/70 bg-white shadow-[0_25px_70px_rgba(15,23,42,0.12)] lg:grid-cols-2">

          {/* Left Branding Section */}
          <div className="relative hidden overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">

            {/* Decorative glow */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

            <div className="relative z-10">
              {/* Logo */}
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10 shadow-lg backdrop-blur">
                <ShoppingBasket size={28} />
              </div>

              <p className="mt-10 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">
                Shopkeeper Portal
              </p>

              <h1 className="mt-3 text-4xl font-bold tracking-tight">
                Karyana Shop
              </h1>

              <p className="mt-5 max-w-sm text-[15px] leading-7 text-slate-300">
                Manage your products, customers,
                categories and suppliers from one
                simple shopkeeper portal.
              </p>

              {/* Small feature cards */}
              <div className="mt-9 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm">
                  <p className="text-sm font-semibold text-white">
                    Inventory
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Products & stock
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm">
                  <p className="text-sm font-semibold text-white">
                    Business
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Customers & suppliers
                  </p>
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <div className="mb-4 h-px bg-gradient-to-r from-white/20 to-transparent" />

              <p className="text-sm text-slate-400">
                Simple. Fast. Organized.
              </p>
            </div>
          </div>

          {/* Login Section */}
          <div className="flex items-center p-6 sm:p-10 lg:p-12">
            <div className="mx-auto w-full max-w-md">

              {/* Mobile Logo */}
              <div className="mb-8 flex items-center gap-3 lg:hidden">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white">
                  <ShoppingBasket size={21} />
                </div>

                <div>
                  <p className="font-bold text-slate-950">
                    Karyana Shop
                  </p>

                  <p className="text-xs text-slate-400">
                    Shopkeeper Portal
                  </p>
                </div>
              </div>

              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-500">
                Welcome
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Welcome back
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Sign in to continue to your shopkeeper portal.
              </p>

              <form
                onSubmit={handleSubmit(handleLogin)}
                className="mt-8 space-y-5"
              >
                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email
                  </label>

                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value:
                          /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message:
                          "Enter a valid email",
                      },
                    })}
                  />

                  {errors.email && (
                    <p className="mt-1.5 text-xs font-medium text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
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
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 pr-12 text-sm text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-50"
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
                      className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="mt-1.5 text-xs font-medium text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white shadow-[0_10px_25px_rgba(15,23,42,0.15)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-600 hover:shadow-[0_14px_30px_rgba(79,70,229,0.18)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
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

              <div className="mt-8 flex items-center justify-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                <p className="text-xs text-slate-400">
                  Karyana Shopkeeper Portal
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}