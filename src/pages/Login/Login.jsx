import { useState } from "react";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import googleIcon from "../../assets/google-icon.png";
import { Flip, ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useDispatch } from "react-redux";
import { userLoginInfo } from "../../slices/userSlice";

function Registration() {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});

  const handleLoginWithGoogle = function () {
    signInWithPopup(auth, provider)
      .then(() => {
        setTimeout(navigate("/"), 1000);
      })
      .catch((error) => {
        console.log(error.code);
      });
  };

  function validate(email, password) {
    const errors = {};
    const emailRegEx = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    const passwordRegEx = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

    email
      ? emailRegEx.test(email)
        ? null
        : (errors.email = "⛔ Invalid email address")
      : (errors.email = "❌ Email is required");
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
    setErrors(validate(email, password));
    !Object.keys(validate(email, password)).length &&
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          dispatch(userLoginInfo(userCredential.user));
          localStorage.setItem(
            "userLoginInfo",
            JSON.stringify(userCredential.user),
          );
          setTimeout(navigate("/"), 1000);
        })
        .catch((error) => {
          error.code.includes("auth/invalid-login-credentials") &&
            toast.error("Invalid email and password combination");
        });
  };

  return (
    <div className="font-open-sans">
      <div className="flex">
        <ToastContainer
          transition={Flip}
          theme="colored"
          hideProgressBar
          autoClose={1000}
          position="top-center"
        />
        <div className="w-full xl:w-1/2">
          <div className="flex min-h-screen flex-col items-center justify-center bg-login-page bg-cover bg-center bg-no-repeat p-5 xl:items-end xl:bg-none">
            <div className="rounded-lg bg-white p-5 xl:mr-[140px] xl:p-0">
              <h1 className="mb-[28px] text-[34px] font-bold leading-tight text-primary-color-500">
                Login to your account!
              </h1>
              <div
                className="mb-8 flex max-w-[220px] cursor-pointer select-none items-center gap-x-2.5 rounded-[8.34px] border border-primary-color-500/30 py-5 pl-7 text-[13.4px] font-semibold text-primary-color-500 duration-200 hover:shadow-lg md:mb-[62px]"
                onClick={handleLoginWithGoogle}
              >
                <img src={googleIcon} alt="Google icon" />
                <p>Login with Google</p>
              </div>
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
                <button className="mt-2 rounded-[8.6px] bg-primary-accent py-5 text-[20.64px] font-semibold text-white duration-200 hover:bg-blue-800">
                  Login to Continue
                </button>
              </form>
              <div className="mx-auto mt-[20px] max-w-[370px] text-center font-open-sans xl:mx-0">
                <p className="text-[13.338px] text-primary-color-500">
                  Don&apos;t have an account ?{" "}
                  <Link
                    to="/registration"
                    className="font-bold text-secondary-accent hover:text-orange-800"
                  >
                    Sign Up
                  </Link>
                </p>
                <p className="text-[13.338px] text-primary-color-500">
                  <Link
                    to="/forgotpassword"
                    className="font-bold text-secondary-accent hover:text-orange-800"
                  >
                    Forgot Password
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden w-1/2 bg-login-page bg-cover bg-center bg-no-repeat xl:block"></div>
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
          className={`peer w-full border-b px-2 py-4 text-[20.641px] font-semibold text-primary-color-500 autofill:shadow-[inset_0_0_0_1000px_white] focus:outline-none ${
            errors ? "border-red-500" : "border-primary-color-500/30"
          }`}
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
        />
        <button
          onClick={() => onShowPassword((current) => !current)}
          type="button"
          className={`absolute right-1 top-1/2 -translate-y-1/2 text-primary-color-500/40  ${
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
          <p className="absolute left-[2.5%] top-[110%] text-xs font-bold leading-none text-red-500">
            {errors}
          </p>
        )}
        <label
          htmlFor={id}
          className={`pointer-events-none absolute -translate-y-1/2 cursor-text bg-white text-center text-[13.76px] font-semibold text-primary-color-500/70 duration-150 peer-focus:left-2 peer-focus:top-0 peer-focus:scale-100 ${
            input ? "left-2 top-0 scale-100" : "left-[29px] top-1/2 scale-125"
          }`}
        >
          {children}
        </label>
      </div>
    </>
  );
}

export default Registration;
