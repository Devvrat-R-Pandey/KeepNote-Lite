// services/authService.ts
import { api } from "../api/axiosInstance";

export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  role: "admin" | "editor" | "viewer";
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: "admin" | "editor" | "viewer";
}

// LOGIN

export const loginUser = async (
  email: string,
  password: string,
): Promise<User | null> => {
  try {
    // MockAPI doesn't support query param filtering — fetch all and filter client-side
    const res = await api.get<User[]>("/users");

    const user = res.data.find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim()
    );

    if (!user) return null;        // No user with that email
    if (user.password !== password) return null; // Wrong password

    return user;
  } catch (error) {
    console.error("Login error:", error);
    throw new Error("Something went wrong during login");
  }
};


// REGISTER

export const registerUser = async (data: RegisterData): Promise<User> => {
  try {
    // 1️⃣ Check if user already exists (fetch all, filter client-side)
    const res = await api.get<User[]>("/users");
    const existing = res.data.find(
      (u) => u.email.toLowerCase() === data.email.toLowerCase().trim()
    );

    if (existing) {
      throw new Error("User already exists");
    }

    // 2️⃣ Assign default role
    const newUser: RegisterData = {
      ...data,
      role: data.role || "viewer",
    };

    // 3️⃣ Create user
    const created = await api.post<User>("/users", newUser);
    return created.data;
  } catch (error: unknown) {
    console.error("Register error:", error);

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Registration failed");
  }
};
