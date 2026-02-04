import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import { useLoader } from '../../hooks/useLoader';
import { useTypingEffect } from '../../hooks/useTypingEffect';
import { Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login, user, role } = useAuth();
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoader();
  const typingRef = useTypingEffect([
    'Away from Home, Yet Feels Like Home',
    'Find Your Perfect Stay',
    'Experience Comfort & Luxury',
    'Explore New Destinations',
  ], 0.06);

  useEffect(() => {
    if (user && role) {
      showLoader();
      // Add delay to allow navigation to complete
      setTimeout(() => {
        hideLoader();
      }, 1500);

      setTimeout(() => {
        if (role === 'admin') navigate('/admin/dashboard', { replace: true });
        else if (role === 'owner') navigate('/owner/dashboard', { replace: true });
        else navigate('/customer', { replace: true });
      }, 500);
    }
  }, [user, role, navigate, showLoader, hideLoader]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    showLoader();

    // Simulate API call delay
    setTimeout(() => {
      if (password !== confirmPassword) {
        alert('Passwords do not match!');
        hideLoader();
        return;
      }

      // Task 2: Mock role assignment logic
      let assignedRole = 'customer';
      if (email.toLowerCase().includes('admin')) assignedRole = 'admin';
      else if (email.toLowerCase().includes('owner')) assignedRole = 'owner';

      const userData = { email, name: name };
      const token = 'mock-jwt-token-12345';

      // Task 1: Update AuthContext
      login(userData, token, assignedRole);

      // Task 3: Post-registration redirect
      // Don't call hideLoader here, let it hide after navigation completes
      if (assignedRole === 'admin') navigate('/admin/dashboard', { replace: true });
      else if (assignedRole === 'owner') navigate('/owner/dashboard', { replace: true });
      else navigate('/customer', { replace: true });
    }, 1000);
  };

  const handleNavigateToSignIn = () => {
    showLoader();
    setTimeout(() => {
      navigate('/login');
      hideLoader();
    }, 500);
  };

  return (
    <div className="flex h-screen w-screen bg-gray-100 overflow-hidden">
      {/* Left Section - Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-600 to-teal-800 flex-col justify-between p-8 overflow-hidden relative">
        {/* Logo */}
        <div className="flex items-center space-x-2 z-10">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-teal-700 font-bold text-lg">H</span>
          </div>
          <span className="text-white text-2xl font-semibold">Home Away</span>
        </div>

        {/* Hero Image & Text */}
        <div className="flex flex-col items-center justify-center flex-1 gap-6 z-10 overflow-hidden">
          <div className="w-full h-48 overflow-hidden rounded-2xl shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
              alt="Hero"
              className="w-full h-full object-cover transition-transform duration-300 ease-out hover:scale-110 cursor-pointer"
              style={{ transformOrigin: 'center' }}
            />
          </div>
        </div>

        {/* Bottom Text & Arrow */}
        <div className="flex items-end justify-between z-10">
          <div>
            <h2 
              ref={typingRef}
              className="text-3xl font-bold text-white min-h-20 flex items-center relative"
            >
            </h2>
          </div>
          <button className="flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition cursor-pointer">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Right Section - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-start h-screen overflow-hidden bg-white">
        <div className="flex-1 overflow-y-auto pt-6 px-8 lg:px-12 no-scrollbar">
          {/* User Profile Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full border-4 border-gray-300 flex items-center justify-center bg-gray-100">
              <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-5">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">SignUp</h1>
            <p className="text-sm text-gray-500">as</p>
          </div>

          {/* Role Selection Tabs */}
          <div className="flex gap-3 mb-5 justify-center">
            <button className="py-2 px-6 bg-teal-600 text-white text-sm font-semibold rounded-lg transition hover:bg-teal-700">
              User
            </button>
            <button className="py-2 px-6 border-2 border-teal-600 text-teal-600 text-sm font-semibold rounded-lg hover:bg-teal-50 transition">
              Business
            </button>
          </div>

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-2.5">
            {/* Name Row */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <input
                  type="text"
                  id="name"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition bg-gray-50"
                  placeholder="First name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition bg-gray-50"
                  placeholder="Last name"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition bg-gray-50"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition bg-gray-50"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition bg-gray-50"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start space-x-2 pt-1">
              <input type="checkbox" id="terms" className="w-4 h-4 text-teal-600 rounded mt-0.5" required />
              <label htmlFor="terms" className="text-gray-700 text-xs leading-tight">
                I agree to the the
                <a href="#" className="text-teal-600 hover:text-teal-700 font-medium ml-1">
                  Term & Condition
                </a>
              </label>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full bg-teal-600 text-white font-bold py-2.5 px-3 rounded-lg hover:bg-teal-700 transition duration-300 text-sm mt-3"
            >
              SIGN UP
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-3">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-gray-400 text-xs">or</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Sign In Link */}
          <p className="text-center text-gray-600 text-xs mb-3">
            Already have an account?{' '}
            <button 
              onClick={handleNavigateToSignIn}
              className="text-teal-600 font-semibold hover:text-teal-700 bg-none border-none cursor-pointer"
            >
              Login
            </button>
          </p>

          {/* Social Sign Up */}
          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 border-2 border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 transition font-medium text-xs">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 border-2 border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 transition font-medium text-xs">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.08 2.29.74 3.08.8 1.18-.24 2.17-.93 3.53-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.48-2.54 3.09l-.42.02zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              Apple
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
