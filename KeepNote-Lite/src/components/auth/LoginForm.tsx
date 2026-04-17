// components/auth/LoginForm.tsx
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../../store/authStore";
import { useUiStore } from "../../store/uiStore";
import { useNavigate } from "react-router-dom";
import { emailValidation, passwordValidation } from "../../utils/validation";

interface LoginFormInputs {
  email: string;
  password: string;
}

export const LoginForm = () => {
  const login = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);
  const showToast = useUiStore((s) => s.showToast);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const onSubmit = useCallback(
    async (data: LoginFormInputs) => {
      clearError();
      await login(data.email, data.password);
      // Check if login succeeded (user will be set in store)
      const user = useAuthStore.getState().user;
      if (user) {
        showToast(`Welcome back, ${user.name ?? user.email}! 👋`, "success");
        navigate("/", { replace: true });
      }
    },
    [login, clearError, showToast, navigate]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Error alert */}
      {error && (
        <div className="alert alert-error py-2 text-sm">
          <span>{error}</span>
        </div>
      )}

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

      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary w-full mt-2"
      >
        {loading ? <span className="loading loading-spinner loading-sm" /> : "Login"}
      </button>
    </form>
  );
};
