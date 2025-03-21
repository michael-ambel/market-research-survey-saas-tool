"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Failed to sign up");
      }

      router.push("/");
    } catch (error) {
      console.error(error);
      setError("Failed to sign up. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-dark-background">
      <div className="bg-white dark:bg-dark-card p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 border border-gray-300 rounded dark:bg-dark-card dark:border-gray-600 dark:text-dark-text"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 border border-gray-300 rounded dark:bg-dark-card dark:border-gray-600 dark:text-dark-text"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        {error && (
          <p className="mt-4 text-sm text-red-600 text-center">{error}</p>
        )}
        <p className="mt-4 text-center">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/auth/signin")}
            className="text-blue-500 hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}
