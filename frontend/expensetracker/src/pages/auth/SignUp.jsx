import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../../components/layouts/AuthLayout";
import ProfilePhotoSelector from "../../components/inputs/ProfilePhotoSelector";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
import uploadImage from "../../utils/uploadImage";
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiOutlineArrowRight } from 'react-icons/hi';

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!fullName) {
      setError("Please enter your name");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setError("");
    setLoading(true);

    try {
      let profileImageUrl = "";
      
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }
      
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl
      });
      
      const { token, user } = response.data;

      if (token) {
        localStorage.setItem('token', token);
        updateUser(user);
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Create Account
        </h1>
        <p className="text-text-secondary mb-8">
          Start your journey to financial freedom
        </p>

        <form onSubmit={handleSignUp} className="space-y-5">
          {/* Profile Photo */}
          <div className="flex justify-center mb-6">
            <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
          </div>

          {/* Full Name */}
          <div>
            <label className="text-sm font-medium text-text-secondary mb-2 block">
              Full Name
            </label>
            <div className="relative">
              <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary text-lg" />
              <input
                type="text"
                value={fullName}
                onChange={({ target }) => setFullName(target.value)}
                placeholder="John Doe"
                className="input-box !pl-12 !mb-0"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-text-secondary mb-2 block">
              Email Address
            </label>
            <div className="relative">
              <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary text-lg" />
              <input
                type="email"
                value={email}
                onChange={({ target }) => setEmail(target.value)}
                placeholder="john@example.com"
                className="input-box !pl-12 !mb-0"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-text-secondary mb-2 block">
              Password
            </label>
            <div className="relative">
              <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary text-lg" />
              <input
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                placeholder="Min. 6 characters"
                className="input-box !pl-12 !mb-0"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-danger/10 border border-danger/20">
              <p className="text-danger text-sm">{error}</p>
            </div>
          )}

          <button 
            type="submit" 
            className="btn-primary flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : (
              <>
                Create Account
                <HiOutlineArrowRight />
              </>
            )}
          </button>

          <p className="text-center text-text-secondary mt-6">
            Already have an account?{" "}
            <Link 
              className="font-semibold text-primary hover:text-primary-dark transition-colors" 
              to="/login"
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
