// pages/RegisterPage.tsx
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RegisterForm } from "../components/auth/RegisterForm";
import { useAuthStore } from "../store/authStore";

export const RegisterPage = () => {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200 px-4 py-8 animate-fade-in">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body gap-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold">📝 KeepNote-Lite</h1>
            <p className="text-base-content/50 text-sm mt-1">Create a new account</p>
          </div>

          <div className="divider my-0" />

          <RegisterForm />

          <p className="text-center text-sm text-base-content/60">
            Already have an account?{" "}
            <Link to="/login" className="link link-primary font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
