import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const auth = getAuth();

  const handleSubmit = function (e) {
    e.preventDefault();
    const emailRegEx = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    email
      ? emailRegEx.test(email)
        ? setError("")
        : setError("⛔ Invalid email address")
      : setError("❌ Email is required");

    email &&
      emailRegEx.test(email) &&
      sendPasswordResetEmail(auth, email)
        .then(() => {
          toast.success("Reset password email sent");
          setEmail("");
        })
        .catch((error) => console.log(error.code));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary-accent/20">
      <ToastContainer position="top-center" autoClose={2000} />
      <form
        className="flex w-full flex-col rounded-md bg-white p-8 shadow-2xl sm:w-auto sm:px-20 sm:pb-20 sm:pt-12 md:px-40 md:pb-40 md:pt-32"
        onSubmit={handleSubmit}
        noValidate
      >
        <p className="mb-2 ml-2 h-8 text-lg font-semibold text-red-500">
          {error}
        </p>
        <input
          className="rounded-[8.6px] border-2 px-[27px] py-[20px] text-[20.641px] font-semibold text-primary-color-400 autofill:shadow-[inset_0_0_0_1000px_white] focus:outline-none "
          type="email"
          value={email}
          placeholder="Enter Your Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="mt-6 flex flex-col gap-3 text-lg font-semibold sm:flex-row">
          <button
            className="rounded-lg bg-primary-accent p-4 text-white duration-200 hover:bg-blue-800"
            type="submit"
          >
            Reset password
          </button>
          <button
            className="rounded-lg bg-red-500 p-4 text-white duration-200 hover:bg-red-800"
            type="button"
            onClick={() => navigate("/login")}
          >
            Back to Login Page
          </button>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;
