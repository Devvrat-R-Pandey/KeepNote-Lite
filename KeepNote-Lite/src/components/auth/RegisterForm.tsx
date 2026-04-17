// components/auth/RegisterForm.tsx
import { useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useUiStore } from "../../store/uiStore";
import { emailValidation, passwordValidation, nameValidation } from "../../utils/validation";

interface RegisterFormInputs {
  name: string;
  email: string;
  password: string;
  role: "admin" | "editor" | "viewer";
}

export const RegisterForm = () => {
  const register_user = useAuthStore((s) => s.register);
  const loading = useAuthStore((s) => s.loading);
  const error = useAuthStore((s) => s.error);
  const registerSuccess = useAuthStore((s) => s.registerSuccess);
  const clearRegisterSuccess = useAuthStore((s) => s.clearRegisterSuccess);
  const clearError = useAuthStore((s) => s.clearError);
  const showToast = useUiStore((s) => s.showToast);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    mode: "onChange",
    defaultValues: { role: "admin" },
  });

  // On success — show toast & redirect to login
  useEffect(() => {
    if (!registerSuccess) return;
    showToast("Account created! Please log in. ✅", "success");
    const timer = setTimeout(() => {
      clearRegisterSuccess();
      navigate("/login");
    }, 2000);
    return () => clearTimeout(timer);
  }, [registerSuccess, showToast, clearRegisterSuccess, navigate]);

  const onSubmit = useCallback(
    async (data: RegisterFormInputs) => {
      clearError();
      await register_user(data.email, data.password, data.name, data.role);
    },
    [register_user, clearError]
  );

  // Success state
  if (registerSuccess) {
    return (
      <div className="text-center space-y-3 py-4">
        <p className="text-4xl">✅</p>
        <p className="text-lg font-semibold text-success">Registration Successful!</p>
        <p className="text-sm text-base-content/60">
          Redirecting you to login page...
        </p>
        <span className="loading loading-dots loading-sm text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Error message */}
      {error && (
        <div className="alert alert-error py-2 text-sm">
          <span>{error}</span>
        </div>
      )}

      {/* Name */}
      <div className="form-control">
        <label className="label pb-1">
          <span className="label-text font-medium">Name</span>
        </label>
        <input
          type="text"
          placeholder="Your name"
          className={`input input-bordered w-full ${errors.name ? "input-error" : ""}`}
          {...register("name", nameValidation)}
        />
        {errors.name && (
          <label className="label pt-1">
            <span className="label-text-alt text-error">{errors.name.message}</span>
          </label>
        )}
      </div>

      {/* Email */}
      <div className="form-control">
        <label className="label pb-1">
          <span className="label-text font-medium">Email</span>
        </label>
        <input
          type="email"
          placeholder="you@example.com"
          className={`input input-bordered w-full ${errors.email ? "input-error" : ""}`}
          {...register("email", emailValidation)}
        />
        {errors.email && (
          <label className="label pt-1">
            <span className="label-text-alt text-error">{errors.email.message}</span>
          </label>
        )}
      </div>

      {/* Password */}
      <div className="form-control">
        <label className="label pb-1">
          <span className="label-text font-medium">Password</span>
        </label>
        <input
          type="password"
          placeholder="••••••••"
          className={`input input-bordered w-full ${errors.password ? "input-error" : ""}`}
          {...register("password", passwordValidation)}
        />
        {errors.password && (
          <label className="label pt-1">
            <span className="label-text-alt text-error">{errors.password.message}</span>
          </label>
        )}
      </div>

      {/* Role */}
      <div className="form-control">
        <label className="label pb-1">
          <span className="label-text font-medium">Role</span>
        </label>
        <select className="select select-bordered w-full" {...register("role")}>
          <option value="viewer">Viewer</option>
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary w-full mt-2"
      >
        {loading ? (
          <span className="loading loading-spinner loading-sm" />
        ) : (
          "Create Account"
        )}
      </button>
    </form>
  );
};
