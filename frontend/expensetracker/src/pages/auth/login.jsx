import React, { useState, useContext } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../components/inputs/input.jsx';
import { validateEmail } from '../../utils/helper.js';
import axiosInstance from '../../utils/axiosInstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';
import { UserContext } from '../../context/userContext.jsx';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineArrowRight, HiOutlineUserCircle } from 'react-icons/hi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleGuestLogin = async () => {
    setError('');
    setGuestLoading(true);
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.GUEST_LOGIN);
      const { token, user } = response.data;
      if (token) {
        localStorage.setItem('token', token);
        updateUser(user);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not start the demo session. Please try again.');
    } finally {
      setGuestLoading(false);
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email");
      return;
    }
    if (!password) {
      setError("Please enter your password");
      return;
    }
    setError('');
    setLoading(true);

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password
      })
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
  }

  return (
    <AuthLayout>
      <div className='animate-fade-in'>
        <h1 className='text-3xl font-bold text-text-primary mb-2'>
          Welcome Back
        </h1>
        <p className='text-text-secondary mb-8'>
          Sign in to continue managing your finances
        </p>

        <form onSubmit={handleLogin} className='space-y-5'>
          <div>
            <label className='text-sm font-medium text-text-secondary mb-2 block'>
              Email Address
            </label>
            <div className='relative'>
              <HiOutlineMail className='absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary text-lg' />
              <input
                type='email'
                value={email}
                onChange={({ target }) => setEmail(target.value)}
                placeholder='john@example.com'
                className='input-box !pl-12 !mb-0'
              />
            </div>
          </div>

          <div>
            <label className='text-sm font-medium text-text-secondary mb-2 block'>
              Password
            </label>
            <div className='relative'>
              <HiOutlineLockClosed className='absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary text-lg' />
              <input
                type='password'
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                placeholder='Enter your password'
                className='input-box !pl-12 !mb-0'
              />
            </div>
          </div>

          {error && (
            <div className='p-3 rounded-lg bg-danger/10 border border-danger/20'>
              <p className='text-danger text-sm'>{error}</p>
            </div>
          )}

          <button
            type='submit'
            className='btn-primary flex items-center justify-center gap-2'
            disabled={loading || guestLoading}
          >
            {loading ? 'Signing in...' : (
              <>
                Sign In
                <HiOutlineArrowRight />
              </>
            )}
          </button>

          <div className='relative my-2'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-border'></div>
            </div>
            <div className='relative flex justify-center text-xs'>
              <span className='px-3 bg-surface text-text-tertiary uppercase tracking-wider'>
                Just reviewing?
              </span>
            </div>
          </div>

          <button
            type='button'
            onClick={handleGuestLogin}
            disabled={loading || guestLoading}
            className='btn-secondary flex items-center justify-center gap-2'
          >
            {guestLoading ? 'Loading demo...' : (
              <>
                <HiOutlineUserCircle className='text-lg' />
                Continue as Guest
              </>
            )}
          </button>
          <p className='text-xs text-text-tertiary text-center -mt-2'>
            Explore the app with a pre-populated demo account — no signup required.
          </p>

          <p className='text-center text-text-secondary mt-6'>
            Don't have an account?{' '}
            <Link
              className='font-semibold text-primary hover:text-primary-dark transition-colors'
              to='/signup'
            >
              Create Account
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default Login;