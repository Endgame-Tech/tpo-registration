import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import Toast from "../../components/Toast";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const FRONTEND_BASE = import.meta.env.VITE_FRONTEND_URL || "http://localhost:5173";

export default function MyUnit() {
  const { profile, isLoading } = useUser();
  const [unitMembers, setUnitMembers] = useState<any[]>([]);
  const [pendingInvites, setPendingInvites] = useState<any[]>([]);
  const [sending, setSending] = useState(false);
  const [resendingId, setResendingId] = useState<string | null>(null);

  const [emailInput, setEmailInput] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const referralLink = `${FRONTEND_BASE.replace(/\/$/, "")}/auth/sign-up?ref=${profile?.member_id}`;

  useEffect(() => {
    if (!profile?.member_id) return;
    loadMyUnit();
  }, [profile]);

  const loadMyUnit = async () => {
    try {
      const res = await fetch(`${API_BASE}/referrals/my-unit`, {
        credentials: "include",
      });
      const body = await res.json();

      if (!res.ok) throw new Error(body.message || "Failed to load unit members");

      setUnitMembers(body.members || []);
      setPendingInvites(body.pending || []);
    } catch (err) {
      console.error("loadMyUnit error:", err);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setToast({ message: "Link copied!", type: "success" });
    } catch (err) {
      console.error("Clipboard error:", err);
      setToast({ message: "Failed to copy link", type: "error" });
    }
  };

  const sendInvites = async () => {
    if (!emailInput || !profile?.member_id) return;

    const emails = emailInput
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email.includes("@"));

    if (emails.length === 0) {
      setToast({ message: "Please enter valid emails", type: "error" });
      return;
    }

    if (emails.length > 10) {
      setToast({ message: "You can invite a maximum of 10 emails at once", type: "error" });
      return;
    }

    try {
      setSending(true);
      const res = await fetch(`${API_BASE}/referrals/send-invite`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails }),
      });

      const body = await res.json();
      if (!res.ok) throw new Error(body.message || "Failed to send invites");

      setEmailInput("");
      setToast({ message: "Invitations sent successfully!", type: "success" });
      loadMyUnit();
    } catch (err: any) {
      console.error("sendInvites error:", err);
      setToast({ message: err.message || "Failed to send invites", type: "error" });
    } finally {
      setSending(false);
    }
  };

  const resendInvite = async (inviteId: string) => {
    try {
      setResendingId(inviteId);
      const res = await fetch(`${API_BASE}/referrals/resend/${inviteId}`, {
        method: "POST",
        credentials: "include",
      });

      const body = await res.json();
      if (!res.ok) throw new Error(body.message || "Failed to resend invite");

      setToast({ message: "Invitation resent!", type: "success" });
      loadMyUnit();
    } catch (err: any) {
      console.error("resendInvite error:", err);
      setToast({ message: err.message || "Failed to resend invite", type: "error" });
    } finally {
      setResendingId(null);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <section className="w-full bg-white dark:bg-background-dark rounded-xl shadow-md p-4 sm:p-6 mb-10 text-gray-800 dark:text-white flex flex-col gap-6 sm:gap-8">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <h2 className="text-2xl sm:text-2xl font-bold">Your Unit</h2>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <div className="text-4xl sm:text-6xl text-green-400">{unitMembers.length}</div>
        <div className="text-base sm:text-lg font-medium">Total Members</div>
      </div>

      <hr className="dark:border-white/10 border-gray-300" />

      <h2 className="text-xl sm:text-2xl font-bold">Build your Unit</h2>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex flex-col bg-background-dark/10 p-4 sm:p-6 rounded-2xl dark:bg-background-light/15 gap-6 lg:w-1/2">
          <div className="space-y-2">
            <p className="text-lg font-medium">Copy and share your link</p>
            <div className="flex items-center bg-white dark:bg-background-dark rounded-full overflow-hidden border border-green-500 px-4 py-2">
              <input
                type="text"
                readOnly
                value={referralLink}
                className="flex-1 text-sm px-4 py-2 bg-transparent text-green-400"
              />
              <button
                onClick={handleCopy}
                className="bg-green-500 rounded-3xl text-white px-4 py-2 text-sm hover:bg-green-600"
              >
                Copy
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-lg font-medium">Invite by email</p>
            <input
              type="text"
              placeholder="Separate multiple emails with commas"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full px-4 py-2 rounded-full text-sm bg-white text-gray-800 border border-gray-300 dark:bg-white/70 dark:text-gray-800 placeholder:text-gray-500 dark:border-white/20"
            />
            <button
              onClick={sendInvites}
              className={`bg-green-500 rounded-full px-6 py-2 text-sm font-medium self-start hover:bg-green-600 ${sending ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={sending}
            >
              {sending ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Sending...
                </span>
              ) : (
                "Send Invite"
              )}
            </button>

          </div>
        </div>

        <div className="lg:w-1/3 text-sm flex flex-col gap-2 sm:gap-4">
          <p className="text-lg sm:text-2xl font-semibold">How you build your Unit</p>
          <p>1. Share your link or send a direct invite.</p>
          <p>2. They sign up and automatically join your unit.</p>
          <p>3. Building your unit boosts your credibility.</p>
        </div>
      </div>

      {pendingInvites.length > 0 && (
        <>
          <hr className="dark:border-white/10 border-gray-300 my-6" />
          <div className="p-4 sm:p-6 px-4 sm:px-8 bg-background-light/10 rounded-3xl">
            <h3 className="text-lg sm:text-xl font-bold mb-6">Pending Unit</h3>
            <ul className="divide-y divide-gray-300 dark:divide-white/10">
              {pendingInvites.map((invite) => (
                <li key={invite._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm">{invite.email}</span>
                    <span className="text-xs opacity-60">
                      Invited on {new Date(invite.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <button
                    onClick={() => resendInvite(invite._id)}
                    className={`bg-green-500 text-white px-4 py-1 rounded-full text-sm hover:bg-green-600 ${resendingId === invite._id ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={resendingId === invite._id}
                  >
                    {resendingId === invite._id ? (
                      <svg className="animate-spin h-4 w-4 mx-auto" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      "Resend Invite"
                    )}
                  </button>

                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {unitMembers.length > 0 && (
        <>
          <hr className="dark:border-white/10 border-gray-300 my-6" />
          <div className="p-4 sm:p-6 px-4 sm:px-8 bg-background-light/10 rounded-3xl">
            <h3 className="text-lg sm:text-xl font-bold mb-6">My Unit Members</h3>
            <ul className="divide-y divide-gray-300 dark:divide-white/10">
              {unitMembers.map((member, index) => (
                <li key={index} className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <span className="capitalize">
                    {member.personalInfo?.first_name || "(Still Onboarding)"} {member.personalInfo?.last_name || ""}
                  </span>
                  <span className="text-xs">{member.email}</span>
                  <span className="text-xs opacity-60">
                    Joined {new Date(member.createdAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </section>
  );
}
