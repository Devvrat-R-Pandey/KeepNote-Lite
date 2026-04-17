// pages/LoginPage.tsx
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginForm } from "../components/auth/LoginForm";
import { useAuthStore } from "../store/authStore";

export const LoginPage = () => {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  // Already logged in → go to home (redirect is also triggered in LoginForm after toast)
  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200 px-4 py-8 animate-fade-in">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body gap-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold">📝 KeepNote Lite</h1>
            <p className="text-base-content/50 text-sm mt-1">Sign in to your account</p>
          </div>

          <div className="divider my-0" />

          <LoginForm />

          <p className="text-center text-sm text-base-content/60">
            Don't have an account?{" "}
            <Link to="/register" className="link link-primary font-medium">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};