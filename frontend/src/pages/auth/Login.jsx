import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import { useLoader } from '../../hooks/useLoader';
import { useTypingEffect } from '../../hooks/useTypingEffect';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, user, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showLoader, hideLoader } = useLoader();
  const typingRef = useTypingEffect([
    'Away from Home, Yet Feels Like Home',
    'Find Your Perfect Stay',
    'Experience Comfort & Luxury',
    'Explore New Destinations',
  ], 0.06);

  const [error, setError] = useState('');

  // Task 4: Redirect if already logged in (preserved)

  useEffect(() => {
    if (user && role) {
      if (role === 'admin') navigate('/admin/dashboard', { replace: true });
      else if (role === 'owner') navigate('/owner/dashboard', { replace: true });
      else navigate('/customer', { replace: true });
    }
  }, [user, role, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    showLoader();
    setError('');

    try {
      const { loginUser } = await import('../../api/authApi');
      const data = await loginUser(email, password);

      const loggedInUser = data.user;
      const assignedRole = loggedInUser.roles && loggedInUser.roles.length > 0 ? loggedInUser.roles[0] : 'customer';
      const token = data.token;

      login(loggedInUser, token, assignedRole);

      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else {
        if (assignedRole === 'admin') navigate('/admin/dashboard', { replace: true });
        else if (assignedRole === 'owner') navigate('/owner/dashboard', { replace: true });
        else navigate('/customer', { replace: true });
      }
    } catch (err) {
      console.error("Login failed", err);
      setError(err.response?.data?.error || 'Invalid credentials');
    } finally {
      hideLoader();
    }
  };

  const handleNavigateToSignUp = () => {
    showLoader();
    setTimeout(() => {
      navigate('/register');
      hideLoader();
    }, 500);
  };

  return (
    <div className="flex h-screen w-screen bg-white overflow-hidden">
      {/* Left Section - Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-600 to-teal-800 flex-col justify-between p-8 overflow-hidden">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-teal-700 font-bold text-lg">H</span>
          </div>
          <span className="text-white text-xl font-semibold">Stay Here</span>
        </div>

        {/* Hero Image & Text */}
        <div className="flex flex-col items-center justify-center flex-1 gap-4 overflow-hidden">
          <div className="w-full h-40 overflow-hidden rounded-lg shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
              alt="Hero"
              className="w-full h-full object-cover transition-transform duration-300 ease-out hover:scale-110 cursor-pointer"
              style={{ transformOrigin: 'center' }}
            />
          </div>
          <div className="text-center">
            <h2
              ref={typingRef}
              className="text-3xl font-bold text-white min-h-20 flex items-center justify-center relative"
            >
            </h2>
          </div>
        </div>

        {/* Navigation Arrow */}
        <div className="flex items-center justify-center w-10 h-10 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition cursor-pointer">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 lg:px-12 py-8 overflow-hidden">
        <div className="max-h-screen overflow-y-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex lg:hidden items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <span className="text-teal-600 text-xl font-semibold">Stay Here</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Welcome Back!</h1>
            <p className="text-sm text-gray-500">Sign in to your account</p>
          </div>

          {/* Role Selection Tabs */}
          <div className="flex gap-3 mb-6">
            <button className="flex-1 py-2 px-3 bg-teal-600 text-white text-sm font-semibold rounded-lg transition hover:bg-teal-700">
              User
            </button>
            <button className="flex-1 py-2 px-3 border-2 border-teal-600 text-teal-600 text-sm font-semibold rounded-lg hover:bg-teal-50 transition">
              Business
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-gray-700 text-xs font-semibold mb-1" htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition bg-gray-50"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-gray-700 text-xs font-semibold mb-1" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition bg-gray-50"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center space-x-1">
                <input type="checkbox" className="w-3 h-3 text-teal-600 rounded" />
                <span className="text-gray-700">Remember me</span>
              </label>
              <a href="#" className="text-teal-600 hover:text-teal-700 font-medium">
                Forgot?
              </a>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full bg-teal-600 text-white font-bold py-2 px-3 rounded-lg hover:bg-teal-700 transition duration-300 text-sm mt-4"
            >
              SIGN IN
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-gray-400 text-xs">or</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Social Sign In */}
          <div className="flex gap-3 mb-4">
            <button className="flex-1 flex items-center justify-center gap-1 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700 text-xs">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
            <button className="flex-1 flex items-center justify-center gap-1 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700 text-xs">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.08 2.29.74 3.08.8 1.18-.24 2.17-.93 3.53-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.48-2.54 3.09l-.42.02zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              Apple
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-gray-600 text-xs mb-3">
            Don't have an account?{' '}
            <button
              onClick={handleNavigateToSignUp}
              className="text-teal-600 font-semibold hover:text-teal-700 bg-none border-none cursor-pointer"
            >
              Sign up
            </button>
          </p>

          {/* Testing Accounts Info */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-gray-700">
            <p className="font-semibold text-blue-900 mb-1">Test Accounts:</p>
            <p className="text-xs">• admin@test.com</p>
            <p className="text-xs">• owner@test.com</p>
            <p className="text-xs">• user@test.com</p>
          </div>
        </div>
      </div>
    </div>
  );

}
export default Login;
