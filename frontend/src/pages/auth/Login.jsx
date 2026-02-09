import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import { useLoader } from '../../hooks/useLoader';
import { loginUser } from '../../api/authApi';
import { Eye, EyeOff, Home } from 'lucide-react';
import PageTransition from '../../components/common/PageTransition';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const { login, user, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showLoader, hideLoader } = useLoader();

  // Redirect if already logged in
  useEffect(() => {
    if (user && role) {
      if (role === 'admin') navigate('/admin/dashboard', { replace: true });
      else if (role === 'owner') navigate('/owner/dashboard', { replace: true });
      else navigate('/customer', { replace: true });
    }
  }, [user, role, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    showLoader();

    try {
      // Call backend API
      const data = await loginUser(email, password);

      const loggedInUser = data.user;
      const assignedRole = loggedInUser.roles?.[0] || 'customer';
      const token = data.token;

      // Update auth context
      login(loggedInUser, token, assignedRole);

      // Check for redirect destination
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else {
        if (assignedRole === 'admin') navigate('/admin/dashboard', { replace: true });
        else if (assignedRole === 'owner') navigate('/owner/dashboard', { replace: true });
        else navigate('/customer', { replace: true });
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.response?.data?.message || err.response?.data?.error || 'Invalid credentials');
    } finally {
      hideLoader();
    }
  };

  return (
    <PageTransition initialX={-35} exitX={-35} className="flex h-screen w-screen bg-gray-50 overflow-hidden font-sans">
      {/* Left Section - Hero Image / Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-teal-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-800/90 to-teal-900/95 z-10" />
        <img
          src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
          alt="Luxury Interior"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40 animate-slow-zoom"
        />

        <div className="relative z-20 flex flex-col justify-between h-full p-12 text-white">
          <Link to="/" className="flex items-center space-x-3 group cursor-pointer">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all">
              <Home className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-medium tracking-wide group-hover:text-white/90 transition-colors">Stay Here</span>
          </Link>

          <div className="space-y-6 max-w-lg">
            <h2 className="text-5xl font-bold leading-tight tracking-tight">
              Away from Home, <br />
              <span className="text-teal-200">Yet Feels Like Home.</span>
            </h2>
            <p className="text-lg text-teal-100/80 font-light leading-relaxed">
              Sign in to manage your bookings, discover new destinations, and continue your journey with us.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-sm text-teal-200/60">
            <span>© 2026 Stay Here Inc.</span>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 lg:p-12 relative">
        <div className="w-full max-w-md lg:max-w-xl space-y-6 bg-white p-8 lg:p-10 rounded-3xl shadow-2xl border border-gray-100">

          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome Back!</h1>
            <p className="text-gray-500">Please enter your details to sign in</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg text-sm flex items-center shadow-sm">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Email Address</label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200 placeholder-gray-400 font-medium"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Password</label>
              </div>
              <div className="relative group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200 placeholder-gray-400 font-medium pr-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-teal-600 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500 transition cursor-pointer"
                />
                <span className="text-gray-600 group-hover:text-gray-800 transition-colors">Remember me</span>
              </label>
              <a href="#" className="text-teal-600 hover:text-teal-700 font-semibold transition-colors border-b border-transparent hover:border-teal-600/20">
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-600 to-teal-500 text-white font-bold py-3.5 px-4 rounded-xl hover:from-teal-700 hover:to-teal-600 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-teal-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 mt-4"
            >
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="relative py-0">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-400">or sign in with</span>
            </div>
          </div>

          {/* Social Login Dummy Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-1">
            <button className="flex items-center justify-center py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group">
              <svg className="h-5 w-5 text-gray-600 group-hover:text-gray-800" viewBox="0 0 24 24" fill="currentColor"><path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" /></svg>
            </button>
            <button className="flex items-center justify-center py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group">
              <svg className="h-5 w-5 text-gray-600 group-hover:text-gray-800" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z" /></svg>
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-gray-600 text-sm">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-teal-600 font-bold hover:text-teal-700 bg-transparent border-none cursor-pointer hover:underline transition-all"
            >
              Sign up here
            </button>
          </p>
        </div>
      </div>
    </PageTransition>
  );
};

export default Login;
