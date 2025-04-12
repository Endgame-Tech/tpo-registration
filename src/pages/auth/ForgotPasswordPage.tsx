import React, { useState } from "react";
import { supabase } from "../../supabase";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/change-password`,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Check your email for the password reset link!");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-between px-4 py-8 max-w-[450px] w-full gap-4"
    >
      <p className="text-gray-dark dark:text-gray-100 text-2xl">
        Forgot Password
      </p>
      <div>
        <label className="block text-dark dark:text-gray-100 mb-2 text-sm">
          Email
        </label>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-[#00123A10] dark:bg-gray-800 text-gray-700 dark:text-gray-200"
          required
        />
      </div>

      <button
        className="bg-accent-green text-white rounded-lg p-2"
        disabled={loading}
      >
        {" "}
        {loading ? "Sending..." : "Send Reset Link"}
      </button>
      {message && <p style={{ color: "green" }}>{message}</p>}
    </form>
  );
};

export default ForgotPassword;
