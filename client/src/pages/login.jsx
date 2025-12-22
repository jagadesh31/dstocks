import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { FaGoogle } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdOutlineEmail } from "react-icons/md";
import { FaApple } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from "./../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const icons = {
  google: <FaGoogle />,
  facebook: <FaFacebookF />,
  x: <FaXTwitter />,
  email: <MdOutlineEmail />,
  apple: <FaApple />
};

const Login = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [currentDialog, setCurrentDialog] = useState("DefaultDialog");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const sendLink = (purpose) => {
    axios
      .get(
        `${import.meta.env.VITE_SERVER_BASE_URL}/auth/createLink?email=${email}&purpose=${purpose}`
      )
      .then((res) => {
        if (res.data.message === "Send Successfully") {
          toast.success(res.data.message);
          setCurrentDialog("LinkSent");
        } else {
          toast.warn(res.data.message);
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const dialog = {
    DefaultDialog: <DefaultDialog setCurrentDialog={setCurrentDialog} />,
    Signin: <Signin setCurrentDialog={setCurrentDialog} />,
    SignupWithEmail: (
      <SignupWithEmail
        setCurrentDialog={setCurrentDialog}
        setEmail={setEmail}
        email={email}
        sendLink={sendLink}
        password={password}
        setPassword={setPassword}
        username={username}
        setUsername={setUsername}
        setIsOpen={setIsOpen}
        setAuth={setAuth}
      />
    ),
    SigninWithEmail: (
      <SigninWithEmail
        setCurrentDialog={setCurrentDialog}
        setEmail={setEmail}
        email={email}
        sendLink={sendLink}
        password={password}
        setPassword={setPassword}
        setAuth={setAuth}
      />
    ),
    LinkSent: <LinkSent email={email} />
  };

  useEffect(() => {
    if (auth?.user) {
      return navigate("/");
    }
  }, [auth?.user, navigate]);

  return (
    <>
      <ToastContainer />
      <Header setIsOpen={setIsOpen} isOpen={isOpen} />
      <div className={`bg-[#F7F4ED] min-h-screen flex justify-center items-center pt-20 pb-20 px-4 ${isOpen ? "opacity-50" : ""}`}>
        <div className="max-w-5xl w-full mx-auto">
          <div className="flex flex-col gap-6 md:gap-8">
            <div className="text-black">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Place to Trade
              </h1>
              <p className="text-lg md:text-2xl text-gray-700">
                A place to and show your skills
              </p>
            </div>
            <button
              onClick={() => setIsOpen(true)}
              className="w-fit bg-black text-white cursor-pointer text-base md:text-lg px-6 md:px-8 py-3 rounded-lg font-semibold hover:bg-gray-900 transition"
            >
              Start Trading
            </button>
          </div>
        </div>
      </div>

      {isOpen &&
        createPortal(
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <dialog
              open
              className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto relative"
            >
              <button
                onClick={() => {
                  setCurrentDialog("DefaultDialog");
                  setIsOpen(false);
                  setEmail("");
                  setPassword("");
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-black text-2xl font-bold transition"
              >
                ×
              </button>
              <div className="p-6 md:p-8">
                {dialog[currentDialog]}
              </div>
            </dialog>
          </div>,
          document.body
        )}
      <Footer isOpen={isOpen} />
    </>
  );
};

const Header = ({ setIsOpen, isOpen }) => {
  return (
    <header className={`fixed top-0 left-0 right-0 z-40 bg-bg-[#F7F4ED] border-b border-black${isOpen ? "opacity-50" : ""}`}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-black">DStocks</h1>
        <nav className="hidden md:flex items-center gap-8 text-black">
          <a href="#" className="hover:text-gray-600 transition">
            Our Story
          </a>
          {/* <a href="#" className="hover:text-gray-600 transition">
            Membership
          </a> */}
          <a href="#" className="hover:text-gray-600 transition">
            Invest
          </a>
          <button
            onClick={() => setIsOpen(true)}
            className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-900 transition cursor-pointer"
          >
            Get Started
          </button>
        </nav>
        <button
          onClick={() => setIsOpen(true)}
          className="md:hidden bg-black text-white px-4 py-2 rounded-lg font-medium"
        >
          Sign in
        </button>
      </div>
    </header>
  );
};

const Footer = ({ isOpen }) => {
  return (
    <footer className={`fixed bottom-0 left-0 right-0 bg-black text-white border-t border-gray-800 ${isOpen ? "opacity-50" : ""}`}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-start gap-8">
        <a href="#" className="hover:text-gray-300 transition">
          About
        </a>
        <a href="#" className="hover:text-gray-300 transition">
          Help
        </a>
        <a href="#" className="hover:text-gray-300 transition">
          Terms
        </a>
        <a href="#" className="hover:text-gray-300 transition">
          Privacy
        </a>
      </div>
    </footer>
  );
};

function DefaultDialog({ setCurrentDialog }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-black mb-2">
          Join DStocks
        </h2>
        <p className="text-gray-600">
          Create an account to start trading
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-black rounded-lg hover:bg-gray-50 transition">
          <span className="text-xl">{icons.google}</span>
          <span className="font-medium">Sign up with Google</span>
        </button>

        <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-black rounded-lg hover:bg-gray-50 transition">
          <span className="text-xl">{icons.facebook}</span>
          <span className="font-medium">Sign up with Facebook</span>
        </button>

        <button
          onClick={() => setCurrentDialog("SignupWithEmail")}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-black rounded-lg hover:bg-gray-50 transition"
        >
          <span className="text-xl">{icons.email}</span>
          <span className="font-medium">Sign up with Email</span>
        </button>
      </div>

      <div className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <button
          onClick={() => setCurrentDialog("Signin")}
          className="text-blue-600 font-semibold hover:underline"
        >
          Sign in
        </button>
      </div>

      <p className="text-xs text-gray-500 text-center">
        Click "Sign up" to agree to DStocks's Terms of Service and acknowledge
        that DStocks's Privacy Policy applies to you.
      </p>
    </div>
  );
}

function SignupWithEmail({
  setCurrentDialog,
  setEmail,
  email,
  password,
  setPassword,
  username,
  setUsername,
  setAuth,
  setIsOpen
}) {
  const navigate = useNavigate();

  function signupHandler() {
    axios
      .post(
        `${import.meta.env.SERVER_BASE_URL}/auth/register`,
        {
          email,
          password,
          username
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
      )
      .then((res) => {
        setAuth({ accessToken: res.data.accessToken, user: res.data.user });
        toast.success("Account created successfully!");
        navigate("/", { replace: true });
      })
      .catch((err) => {
        toast.error(
          err.response?.data?.message || "Signup failed"
        );
      });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <span className="text-4xl">{icons.email}</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-black">
          Sign up with email
        </h2>
        <p className="text-gray-600 text-sm mt-2">
          Enter your details to create an account
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-black mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-black mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-black mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      <button
        onClick={() => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (emailRegex.test(email) && password && username) {
            signupHandler();
          } else {
            toast.warn("Please fill all fields with valid information");
          }
        }}
        className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition"
      >
        Create Account
      </button>

      <button
        onClick={() => {
          setCurrentDialog("DefaultDialog");
          setIsOpen(false);
          setEmail("");
          setPassword("");
          setUsername("");
        }}
        className="text-center text-sm text-gray-600 hover:text-black transition"
      >
        Back to Sign up options
      </button>

      <div className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <button
          onClick={() => setCurrentDialog("Signin")}
          className="text-blue-600 font-semibold hover:underline"
        >
          Sign in
        </button>
      </div>

      <p className="text-xs text-gray-500 text-center">
        This site is protected by reCAPTCHA Enterprise and the Google Privacy
        Policy and Terms of Service apply.
      </p>
    </div>
  );
}

function SigninWithEmail({
  setCurrentDialog,
  setEmail,
  email,
  password,
  setPassword,
  setAuth,
  setIsOpen
}) {
  const navigate = useNavigate();

  function signinHandler() {
    axios
      .post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/auth/login`,
        {
          email,
          password
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
      )
      .then((res) => {
        setAuth({ accessToken: res.data.accessToken, user: res.data.user });
        toast.success("Signed in successfully!");
        navigate("/", { replace: true });
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Sign in failed");
      });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <span className="text-4xl">{icons.email}</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-black">
          Sign in with email
        </h2>
        <p className="text-gray-600 text-sm mt-2">
          Enter your credentials to access your account
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="signin-email" className="block text-sm font-medium text-black mb-1">
            Email
          </label>
          <input
            type="email"
            id="signin-email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <label htmlFor="signin-password" className="block text-sm font-medium text-black mb-1">
            Password
          </label>
          <input
            type="password"
            id="signin-password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      <button
        onClick={() => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (emailRegex.test(email) && password) {
            signinHandler();
          } else {
            toast.warn("Please enter valid email and password");
          }
        }}
        className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition"
      >
        Continue
      </button>

      <button
        onClick={() => {
          setCurrentDialog("DefaultDialog");
          setIsOpen(false);
          setEmail("");
          setPassword("");
        }}
        className="text-center text-sm text-gray-600 hover:text-black transition"
      >
        Back to Sign up options
      </button>

      <p className="text-xs text-gray-500 text-center">
        This site is protected by reCAPTCHA Enterprise and the Google Privacy
        Policy and Terms of Service apply.
      </p>
    </div>
  );
}

function Signin({ setCurrentDialog }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-black">
          Welcome back
        </h2>
        <p className="text-gray-600 text-sm mt-2">
          Sign in to your account
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-black rounded-lg hover:bg-gray-50 transition">
          <span className="text-xl">{icons.google}</span>
          <span className="font-medium">Sign in with Google</span>
        </button>

        <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-black rounded-lg hover:bg-gray-50 transition">
          <span className="text-xl">{icons.facebook}</span>
          <span className="font-medium">Sign in with Facebook</span>
        </button>

        <button
          onClick={() => setCurrentDialog("SigninWithEmail")}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-black rounded-lg hover:bg-gray-50 transition"
        >
          <span className="text-xl">{icons.email}</span>
          <span className="font-medium">Sign in with Email</span>
        </button>
      </div>

      <div className="flex flex-col gap-2 text-center text-sm">
        <div className="text-gray-600">
          No account?{" "}
          <button
            onClick={() => setCurrentDialog("DefaultDialog")}
            className="text-blue-600 font-semibold hover:underline"
          >
            Create one
          </button>
        </div>
        <div className="text-gray-600">
          Forgot email or trouble signing in?{" "}
          <a href="#" className="text-blue-600 font-semibold hover:underline">
            Get help
          </a>
        </div>
      </div>

      <p className="text-xs text-gray-500 text-center">
        Click "Sign in" to agree to DStocks's Terms of Service and acknowledge
        that DStocks's Privacy Policy applies to you.
      </p>
    </div>
  );
}

function LinkSent({ email }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <span className="text-4xl">{icons.email}</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-black">
          Check your email
        </h2>
        <p className="text-gray-600 text-sm mt-3">
          We've sent a verification link to <strong>{email}</strong>
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Click the link to complete your account setup
        </p>
      </div>
    </div>
  );
}

export default Login;
