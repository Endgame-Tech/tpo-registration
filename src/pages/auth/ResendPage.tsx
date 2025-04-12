import { useState } from "react";
import { supabase } from "../../supabase";


const ResendVerification = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleResendEmail = async () => {
    setMessage('');
    setError('');
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    try {
      const { error } = await supabase.auth.resend({
        email,
        type: "signup", 
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage('Verification email resent successfully. Please check your inbox.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    }
  };

  return (

<form
onSubmit={handleResendEmail}
className="flex flex-col justify-between px-4 py-8 max-w-[450px] w-full gap-4"
>
<p className="text-gray-dark dark:text-gray-100 text-2xl">
Resend Verification Email
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

<button className="bg-accent-green text-white rounded-lg p-2">Resend Email</button>
{message && <p style={{ color: 'green' }}>{message}</p>}
{error && <p style={{ color: 'red' }}>{error}</p>}
</form>
  );
};

export default ResendVerification;
