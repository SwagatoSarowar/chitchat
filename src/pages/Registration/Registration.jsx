import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, Zoom, toast } from "react-toastify";

function Registration() {
  const auth = getAuth();
  const db = getDatabase();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  function validate(email, name, password) {
    const errors = {};
    const emailRegEx = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    const passwordRegEx = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

    email
      ? emailRegEx.test(email)
        ? null
        : (errors.email = "⛔ Invalid email address")
      : (errors.email = "❌ Email is required");
    name ? null : (errors.name = "❌ Name is required");
    password
      ? passwordRegEx.test(password)
        ? null
        : (errors.password =
            "⛔ Password requirement (minimum length 8, atleast 1 uppercase,1 lowercase and 1 number)")
      : (errors.password = "❌ Password is required");

    return errors;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors(validate(email, name, password));
    !Object.keys(validate(email, name, password)).length &&
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          set(ref(db, "users/" + userCredential.user.uid), {
            username: name,
            email: email,
            profileImg: "https://placehold.co/400x400?text=profileImg",
          });
        })
        .then(() => {
          updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: "https://placehold.co/400x400?text=profileImg",
          });
        })
        .then(() => {
          sendEmailVerification(auth.currentUser).then(() => {
            setEmail("");
            setName("");
            setPassword("");
            setTimeout(() => navigate("/login"), 3500);
            toast.success("Successfully registered. Please verify your email");
          });
        })
        .catch((error) => {
          error.code.includes("auth/email-already-in-use") &&
            setErrors({ ...errors, email: "⛔ Email already in use" });
        });
  };

  return (
    <div className="font-nunito">
      <div className="flex">
        <ToastContainer
          position="top-center"
          transition={Zoom}
          autoClose={2500}
        />
        <div className="w-full xl:w-1/2">
          <div className="flex min-h-screen flex-col items-center justify-center bg-registration-page bg-cover bg-center bg-no-repeat p-5 xl:items-end xl:bg-none">
            <div className="rounded-lg bg-white p-5 xl:mr-[70px] xl:p-0">
              <h1 className="mb-[13px] text-[34px] font-bold leading-tight text-primary-color-400">
                Get started with easily register
              </h1>
              <p className="mb-8 text-[20.6px] opacity-60 md:mb-[62px]">
                Free register and you can enjoy it
              </p>
              <form
                noValidate
                onSubmit={handleSubmit}
                className="mx-auto flex max-w-[370px] flex-col gap-y-8 md:gap-y-[57px] xl:mx-0"
              >
                <RegistrationInput
                  type="email"
                  id="emial"
                  input={email}
                  onSetInput={setEmail}
                  errors={errors.email}
                >
                  Email Adress
                </RegistrationInput>
                <RegistrationInput
                  id="name"
                  input={name}
                  onSetInput={setName}
                  errors={errors.name}
                >
                  Full Name
                </RegistrationInput>
                <RegistrationInput
                  type="password"
                  id="password"
                  input={password}
                  onSetInput={setPassword}
                  errors={errors.password}
                  showPassword={showPassword}
                  onShowPassword={setShowPassword}
                >
                  Password
                </RegistrationInput>
                <button className="mt-2 rounded-[86px] bg-primary-accent py-5 text-[20.64px] font-semibold text-white duration-200 hover:bg-blue-800">
                  Sign up
                </button>
              </form>
              <div className="mx-auto mt-[20px] max-w-[370px] text-center font-open-sans xl:mx-0">
                <p className="text-[13.338px] text-primary-color-400">
                  Already have an account ?{" "}
                  <Link
                    to="/login"
                    className="font-bold text-secondary-accent hover:text-orange-800"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden w-1/2 bg-registration-page bg-cover bg-center bg-no-repeat xl:block"></div>
      </div>
    </div>
  );
}

function RegistrationInput({
  type = "text",
  id,
  children,
  input,
  onSetInput,
  errors,
  showPassword,
  onShowPassword,
}) {
  return (
    <>
      <div className="relative">
        <input
          id={id}
          value={input}
          onChange={(e) => onSetInput(e.target.value)}
          className={`peer w-full rounded-[8.6px] border-2 px-[27px] py-4 text-[20.641px] font-semibold text-primary-color-400 autofill:shadow-[inset_0_0_0_1000px_white] focus:outline-none md:py-[27px] ${
            errors ? "border-red-500" : "border-primary-color-400/30"
          }`}
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
        />
        <button
          onClick={() => onShowPassword((current) => !current)}
          type="button"
          className={`absolute right-1 top-1/2 -translate-y-1/2 text-primary-color-400/40  ${
            type === "password" ? null : "hidden"
          }`}
        >
          {!showPassword ? (
            <AiFillEyeInvisible size={24} />
          ) : (
            <AiFillEye size={24} />
          )}
        </button>
        {errors && (
          <p className="absolute left-[2.5%] top-[105%] text-sm font-bold leading-none text-red-500">
            {errors}
          </p>
        )}
        <label
          htmlFor={id}
          className={`pointer-events-none absolute left-[29px] w-[155px] -translate-y-1/2 cursor-text bg-white text-center text-[13.76px] font-semibold text-primary-color-400/70 duration-150 peer-focus:top-0 peer-focus:scale-100 ${
            input ? "top-0 scale-100" : "top-1/2 scale-125"
          }`}
        >
          {children}
        </label>
      </div>
    </>
  );
}

export default Registration;
