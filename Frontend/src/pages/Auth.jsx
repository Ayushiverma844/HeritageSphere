// both login and signup page

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import authService from "../services/authService";
import { useAuth } from "../context/AuthContext";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  KeyRound,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import img from "../assests/auth_bg.jpg";

const RESEND_COOLDOWN = 30; // seconds

const Auth = () => {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // ---------------- Signup OTP state ----------------
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpResending, setOtpResending] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);

  // ---------------- Forgot password state ----------------
  const [showForgotModal, setShowForgotModal] = useState(false);
  // step: 1 = enter email, 2 = enter otp, 3 = set new password
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotResending, setForgotResending] = useState(false);
  const [forgotCooldown, setForgotCooldown] = useState(0);

  const cooldownRef = useRef(null);
  const forgotCooldownRef = useRef(null);

  // input handler
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ---------------- Cooldown timers ----------------
  useEffect(() => {
    if (otpCooldown <= 0) return;
    cooldownRef.current = setInterval(() => {
      setOtpCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(cooldownRef.current);
  }, [otpCooldown]);

  useEffect(() => {
    if (forgotCooldown <= 0) return;
    forgotCooldownRef.current = setInterval(() => {
      setForgotCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(forgotCooldownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(forgotCooldownRef.current);
  }, [forgotCooldown]);

  // ---------------- login / signup submit handler ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      if (!formData.email.trim()) {
        alert("Email is required");
        return;
      }
      if (!formData.password.trim()) {
        alert("Password is required");
        return;
      }
    } else {
      if (!formData.name.trim()) {
        alert("Name is required");
        return;
      }
      if (!formData.email.trim()) {
        alert("Email is required");
        return;
      }
      if (!formData.password.trim()) {
        alert("Password is required");
        return;
      }
      if (formData.password.length < 6) {
        alert("Password should be at least 6 characters");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match");
        return;
      }
    }

    try {
      setLoading(true);

      if (isLogin) {
        const data = await authService.login({
          email: formData.email,
          password: formData.password,
        });

        login({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          user: data.user,
        });

        navigate("/", { replace: true });
      } else {
        await authService.sendOTP(formData.email, "VERIFY_EMAIL");

        setOtpCooldown(RESEND_COOLDOWN);
        setShowOTPModal(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Signup OTP verification ----------------
  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      return alert("Enter 6 digit OTP");
    }

    try {
      setOtpLoading(true);

      // Step 1: verify the OTP sent to the user's email
      await authService.verifyOTP(formData.email, otp, "VERIFY_EMAIL");

      // Step 2: create the account now that the email is verified
      const data = await authService.signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        otp,
      });

      login({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
      });

      setShowOTPModal(false);
      setOtp("");
      navigate("/", { replace: true });
    } catch (err) {
      alert(err.response?.data?.message || "OTP verification failed");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (otpCooldown > 0) return;

    try {
      setOtpResending(true);
      await authService.sendOTP(formData.email, "VERIFY_EMAIL");
      setOtpCooldown(RESEND_COOLDOWN);
      alert("OTP sent again.");
    } catch (err) {
      alert(err.response?.data?.message || "Unable to resend OTP");
    } finally {
      setOtpResending(false);
    }
  };

  const closeOTPModal = () => {
    setShowOTPModal(false);
    setOtp("");
    setOtpCooldown(0);
  };

  // ---------------- Forgot password flow ----------------
  const openForgotModal = () => {
    setForgotStep(1);
    setForgotEmail(formData.email || "");
    setForgotOtp("");
    setNewPassword("");
    setConfirmNewPassword("");
    setShowForgotModal(true);
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
    setForgotStep(1);
    setForgotEmail("");
    setForgotOtp("");
    setNewPassword("");
    setConfirmNewPassword("");
    setForgotCooldown(0);
  };

  // Step 1: send OTP to email
  const handleForgotEmailSubmit = async (e) => {
    e.preventDefault();

    if (!forgotEmail.trim()) {
      return alert("Email is required");
    }

    try {
      setForgotLoading(true);
      await authService.forgotPassword(forgotEmail);
      setForgotCooldown(RESEND_COOLDOWN);
      setForgotStep(2);
    } catch (err) {
      alert(err.response?.data?.message || "Unable to send OTP");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResendForgotOTP = async () => {
    if (forgotCooldown > 0) return;

    try {
      setForgotResending(true);
      await authService.forgotPassword(forgotEmail);
      setForgotCooldown(RESEND_COOLDOWN);
      alert("OTP sent again.");
    } catch (err) {
      alert(err.response?.data?.message || "Unable to resend OTP");
    } finally {
      setForgotResending(false);
    }
  };

  // Step 2: verify OTP
  const handleForgotOtpSubmit = async () => {
    if (forgotOtp.length !== 6) {
      return alert("Enter 6 digit OTP");
    }

    try {
      setForgotLoading(true);
      await authService.verifyForgotPasswordOTP(forgotEmail, forgotOtp);
      setForgotStep(3);
    } catch (err) {
      alert(err.response?.data?.message || "OTP verification failed");
    } finally {
      setForgotLoading(false);
    }
  };

  // Step 3: reset password
  const handleResetPasswordSubmit = async () => {
    if (!newPassword.trim() || !confirmNewPassword.trim()) {
      return alert("Please fill in both password fields");
    }
    if (newPassword.length < 6) {
      return alert("Password should be at least 6 characters");
    }
    if (newPassword !== confirmNewPassword) {
      return alert("Passwords do not match");
    }

    try {
      setForgotLoading(true);
      await authService.resetPassword(
        forgotEmail,
        newPassword,
        confirmNewPassword
      );
      alert("Password reset successfully. Please login with your new password.");
      closeForgotModal();
      setIsLogin(true);
      setFormData((prev) => ({ ...prev, email: forgotEmail, password: "" }));
    } catch (err) {
      alert(err.response?.data?.message || "Unable to reset password");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white flex">
      {/* Left Image */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden">
        <img src={img} alt="" className="h-full w-full object-cover" />

        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute bottom-16 left-12 max-w-lg">
          <span className="px-4 py-2 rounded-full border border-heritage-gold/30 text-heritage-gold text-sm">
            India's Heritage Platform
          </span>

          <h1 className="mt-6 text-5xl font-bold leading-tight">
            Discover the stories
            <br />
            <span className="text-heritage-gold">of a civilization</span>
          </h1>

          <p className="mt-4 text-gray-300">
            Join thousands of explorers who uncover India's timeless heritage.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 flex justify-center items-center p-6">
        <div className="w-full max-w-xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-heritage-gold transition"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>

          {/* Logo */}
          <div className="flex items-center gap-3 mt-8">
            <div className="h-12 w-12 rounded-full flex items-center justify-center">
              <img src="Logo.png" alt="" className="object-cover" />
            </div>

            <h2 className="text-3xl font-bold">
              Heritage
              <span className="text-heritage-gold">Sphere</span>
            </h2>
          </div>

          {/* Heading */}
          <div className="mt-10">
            <h1 className="text-5xl font-bold">
              {isLogin ? "Welcome back" : "Create an account"}
            </h1>

            <p className="text-gray-400 mt-3 text-lg">
              {isLogin
                ? "Sign in to continue your heritage journey"
                : "Join the HeritageSphere community today"}
            </p>
          </div>

          {/* Toggle */}
          <div className="mt-10 relative bg-white/5 border border-white/10 rounded-2xl p-1 flex overflow-hidden">
            {/* Sliding Gold Background */}
            <div
              className={`
                absolute top-1 bottom-1 w-[calc(50%-4px)]
                rounded-xl bg-heritage-gold
                transition-all duration-500 ease-in-out
                ${isLogin ? "left-1" : "left-[calc(50%+2px)]"}
              `}
            />

            {/* Login Button */}
            <button
              onClick={() => {
                setIsLogin(true);
                setFormData({
                  name: "",
                  email: "",
                  password: "",
                  confirmPassword: "",
                });
              }}
              className={`
                relative z-10 w-1/2 py-3 text-lg font-medium
                transition-all duration-300
                ${isLogin ? "text-black" : "text-gray-400"}
              `}
            >
              Login
            </button>

            {/* Signup Button */}
            <button
              onClick={() => {
                setIsLogin(false);
                setFormData({
                  name: "",
                  email: "",
                  password: "",
                  confirmPassword: "",
                });
              }}
              className={`
                relative z-10 w-1/2 py-3 text-lg font-medium
                transition-all duration-300
                ${!isLogin ? "text-black" : "text-gray-400"}
              `}
            >
              Sign Up
            </button>
          </div>

          {/* Animated Form */}
          <form
            onSubmit={handleSubmit}
            key={isLogin ? "login" : "signup"}
            className="mt-8 animate-[fadeIn_.5s_ease] transition-all duration-500"
          >
            {!isLogin && (
              <div className="mb-5">
                <label className="text-gray-400 block mb-2">Full Name</label>

                <div
                  className="
                    flex items-center gap-3
                    bg-white/5
                    border border-white/10
                    rounded-2xl
                    px-4 py-4
                    transition-all duration-300
                    hover:border-heritage-gold/40
                    focus-within:border-heritage-gold
                    focus-within:shadow-[0_0_20px_rgba(212,175,55,0.15)]
                  "
                >
                  <User size={20} />
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    type="text"
                    placeholder="Your full name"
                    className="bg-transparent outline-none w-full"
                  />
                </div>
              </div>
            )}

            <div className="mb-5">
              <label className="text-gray-400 block mb-2">Email Address</label>

              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-4">
                <Mail size={20} />
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="you@example.com"
                  className="bg-transparent outline-none w-full"
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="text-gray-400 block mb-2">Password</label>

              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-4">
                <Lock size={20} />

                <input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  className="bg-transparent outline-none w-full"
                />

                {showPassword ? (
                  <EyeOff
                    size={18}
                    onClick={() => setShowPassword(false)}
                    className="cursor-pointer"
                  />
                ) : (
                  <Eye
                    size={18}
                    onClick={() => setShowPassword(true)}
                    className="cursor-pointer"
                  />
                )}
              </div>
              {isLogin && (
                <div className="text-right mb-5 mt-2">
                  <button
                    type="button"
                    onClick={openForgotModal}
                    className="text-heritage-gold hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
            </div>

            {!isLogin && (
              <div className="mb-5">
                <label className="text-gray-400 block mb-2">
                  Confirm Password
                </label>

                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-4">
                  <Lock size={20} />

                  <input
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    className="bg-transparent outline-none w-full"
                  />

                  {showPassword ? (
                    <EyeOff
                      size={18}
                      onClick={() => setShowPassword(false)}
                      className="cursor-pointer"
                    />
                  ) : (
                    <Eye
                      size={18}
                      onClick={() => setShowPassword(true)}
                      className="cursor-pointer"
                    />
                  )}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`
                w-full
                py-4
                rounded-2xl
                font-semibold
                text-lg
                transition-all
                duration-300
                ${
                  loading
                    ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                    : "bg-heritage-gold text-black hover:bg-heritage-light-gold hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                }
              `}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Please Wait...
                </span>
              ) : isLogin ? (
                "Login"
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* ===================== Signup OTP Modal ===================== */}
      {showOTPModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-5">
          <div
            className="
              w-full
              max-w-md
              rounded-3xl
              bg-[#111827]
              border
              border-heritage-gold/30
              p-8
              shadow-[0_0_40px_rgba(212,175,55,0.25)]
              animate-[fadeIn_.3s_ease]
              relative
            "
          >
            <button
              onClick={closeOTPModal}
              className="absolute top-5 right-5 text-gray-500 hover:text-white transition"
            >
              <X size={20} />
            </button>

            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 rounded-full bg-heritage-gold/15 flex items-center justify-center">
                <ShieldCheck size={30} className="text-heritage-gold" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-center">Verify Email</h2>

            <p className="text-gray-400 text-center mt-3">
              We've sent a 6 digit code to
            </p>

            <p className="text-center text-heritage-gold mt-2 font-semibold break-all">
              {formData.email}
            </p>

            <div className="mt-8">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="------"
                autoFocus
                className="
                  w-full
                  text-center
                  tracking-[12px]
                  text-2xl
                  font-semibold
                  bg-white/5
                  border
                  border-white/10
                  rounded-2xl
                  py-4
                  outline-none
                  transition
                  focus:border-heritage-gold
                  focus:shadow-[0_0_20px_rgba(212,175,55,0.15)]
                "
              />
            </div>

            <button
              onClick={handleVerifyOTP}
              disabled={otpLoading || otp.length !== 6}
              className={`
                mt-8
                w-full
                py-4
                rounded-2xl
                font-semibold
                transition
                ${
                  otpLoading || otp.length !== 6
                    ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                    : "bg-heritage-gold text-black hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                }
              `}
            >
              {otpLoading ? (
                <span className="flex justify-center items-center gap-2">
                  <Loader2 className="animate-spin" size={18} />
                  Verifying...
                </span>
              ) : (
                "Verify & Create Account"
              )}
            </button>

            <div className="text-center mt-5">
              {otpCooldown > 0 ? (
                <p className="text-gray-500 text-sm">
                  Resend code in{" "}
                  <span className="text-heritage-gold font-medium">
                    {otpCooldown}s
                  </span>
                </p>
              ) : (
                <button
                  onClick={handleResendOTP}
                  disabled={otpResending}
                  className="text-heritage-gold hover:underline cursor-pointer text-sm disabled:opacity-50"
                >
                  {otpResending ? "Sending..." : "Resend OTP"}
                </button>
              )}
            </div>

            <button
              onClick={closeOTPModal}
              className="w-full mt-4 text-gray-400 hover:text-white text-sm transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ===================== Forgot Password Modal ===================== */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-5">
          <div
            className="
              w-full
              max-w-md
              rounded-3xl
              bg-[#111827]
              border
              border-heritage-gold/30
              p-8
              shadow-[0_0_40px_rgba(212,175,55,0.25)]
              animate-[fadeIn_.3s_ease]
              relative
            "
          >
            <button
              onClick={closeForgotModal}
              className="absolute top-5 right-5 text-gray-500 hover:text-white transition"
            >
              <X size={20} />
            </button>

            {/* Step indicator */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    step === forgotStep
                      ? "w-8 bg-heritage-gold"
                      : step < forgotStep
                      ? "w-4 bg-heritage-gold/50"
                      : "w-4 bg-white/10"
                  }`}
                />
              ))}
            </div>

            {/* Step 1: Enter email */}
            {forgotStep === 1 && (
              <>
                <div className="flex justify-center mb-5">
                  <div className="w-16 h-16 rounded-full bg-heritage-gold/15 flex items-center justify-center">
                    <KeyRound size={30} className="text-heritage-gold" />
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-center">
                  Forgot Password?
                </h2>

                <p className="text-gray-400 text-center mt-3">
                  Enter your email and we'll send you a code to reset your
                  password.
                </p>

                <form onSubmit={handleForgotEmailSubmit}>
                  <div className="mt-8 flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-4 focus-within:border-heritage-gold transition">
                    <Mail size={20} />
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoFocus
                      className="bg-transparent outline-none w-full"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className={`
                      mt-8
                      w-full
                      py-4
                      rounded-2xl
                      font-semibold
                      transition
                      ${
                        forgotLoading
                          ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                          : "bg-heritage-gold text-black hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                      }
                    `}
                  >
                    {forgotLoading ? (
                      <span className="flex justify-center items-center gap-2">
                        <Loader2 className="animate-spin" size={18} />
                        Sending...
                      </span>
                    ) : (
                      "Send OTP"
                    )}
                  </button>
                </form>
              </>
            )}

            {/* Step 2: Enter OTP */}
            {forgotStep === 2 && (
              <>
                <div className="flex justify-center mb-5">
                  <div className="w-16 h-16 rounded-full bg-heritage-gold/15 flex items-center justify-center">
                    <ShieldCheck size={30} className="text-heritage-gold" />
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-center">Enter OTP</h2>

                <p className="text-gray-400 text-center mt-3">
                  We've sent a 6 digit code to
                </p>
                <p className="text-center text-heritage-gold mt-2 font-semibold break-all">
                  {forgotEmail}
                </p>

                <div className="mt-8">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={forgotOtp}
                    onChange={(e) =>
                      setForgotOtp(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="------"
                    autoFocus
                    className="
                      w-full
                      text-center
                      tracking-[12px]
                      text-2xl
                      font-semibold
                      bg-white/5
                      border
                      border-white/10
                      rounded-2xl
                      py-4
                      outline-none
                      transition
                      focus:border-heritage-gold
                      focus:shadow-[0_0_20px_rgba(212,175,55,0.15)]
                    "
                  />
                </div>

                <button
                  onClick={handleForgotOtpSubmit}
                  disabled={forgotLoading || forgotOtp.length !== 6}
                  className={`
                    mt-8
                    w-full
                    py-4
                    rounded-2xl
                    font-semibold
                    transition
                    ${
                      forgotLoading || forgotOtp.length !== 6
                        ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                        : "bg-heritage-gold text-black hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                    }
                  `}
                >
                  {forgotLoading ? (
                    <span className="flex justify-center items-center gap-2">
                      <Loader2 className="animate-spin" size={18} />
                      Verifying...
                    </span>
                  ) : (
                    "Verify OTP"
                  )}
                </button>

                <div className="text-center mt-5">
                  {forgotCooldown > 0 ? (
                    <p className="text-gray-500 text-sm">
                      Resend code in{" "}
                      <span className="text-heritage-gold font-medium">
                        {forgotCooldown}s
                      </span>
                    </p>
                  ) : (
                    <button
                      onClick={handleResendForgotOTP}
                      disabled={forgotResending}
                      className="text-heritage-gold hover:underline cursor-pointer text-sm disabled:opacity-50"
                    >
                      {forgotResending ? "Sending..." : "Resend OTP"}
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setForgotStep(1)}
                  className="w-full mt-4 text-gray-400 hover:text-white text-sm transition"
                >
                  Change Email
                </button>
              </>
            )}

            {/* Step 3: Reset password */}
            {forgotStep === 3 && (
              <>
                <div className="flex justify-center mb-5">
                  <div className="w-16 h-16 rounded-full bg-heritage-gold/15 flex items-center justify-center">
                    <Lock size={28} className="text-heritage-gold" />
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-center">
                  Reset Password
                </h2>

                <p className="text-gray-400 text-center mt-3">
                  Create a new password for your account.
                </p>

                <div className="mt-8 flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-4 focus-within:border-heritage-gold transition">
                  <Lock size={20} />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                    autoFocus
                    className="bg-transparent outline-none w-full"
                  />
                  {showNewPassword ? (
                    <EyeOff
                      size={18}
                      onClick={() => setShowNewPassword(false)}
                      className="cursor-pointer"
                    />
                  ) : (
                    <Eye
                      size={18}
                      onClick={() => setShowNewPassword(true)}
                      className="cursor-pointer"
                    />
                  )}
                </div>

                <div className="mt-5 flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-4 focus-within:border-heritage-gold transition">
                  <Lock size={20} />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="bg-transparent outline-none w-full"
                  />
                </div>

                <button
                  onClick={handleResetPasswordSubmit}
                  disabled={forgotLoading}
                  className={`
                    mt-8
                    w-full
                    py-4
                    rounded-2xl
                    font-semibold
                    transition
                    ${
                      forgotLoading
                        ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                        : "bg-heritage-gold text-black hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                    }
                  `}
                >
                  {forgotLoading ? (
                    <span className="flex justify-center items-center gap-2">
                      <Loader2 className="animate-spin" size={18} />
                      Resetting...
                    </span>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;