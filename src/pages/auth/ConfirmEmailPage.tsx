import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import Toast from "../../components/Toast.js";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function ConfirmEmailPage() {
  const { token } = useParams<{ token: string }>();
  const [message, setMessage] = useState("");
  const [toastType, setToastType] = useState<"success"|"error">("success");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_BASE}/auth/confirm-email/${token}`, {
      method: "GET",
      credentials: "include",
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setMessage(data.message);
          setToastType("success");
        } else {
          setMessage(data.message || data.error || "Confirmation failed");
          setToastType("error");
        }
      })
      .catch(() => {
        setMessage("Server error, please try again later");
        setToastType("error");
      })
      .finally(() => setShowToast(true));
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center p-8 max-w-md mx-auto gap-4">
      <h2 className="text-2xl dark:text-white">Email Confirmation</h2>
      {showToast && (
        <Toast
          message={message}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
      {toastType === "success" && (
        <Link to="/auth/login" className="text-accent-green underline">
          Proceed to Login
        </Link>
      )}
    </div>
  );
}
