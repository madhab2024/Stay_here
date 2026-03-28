import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import { useLoader } from '../../hooks/useLoader';
import { registerUser } from '../../api/authApi';
import { Eye, EyeOff, Home } from 'lucide-react';
import PageTransition from '../../components/common/PageTransition';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const { login, user, role } = useAuth();
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoader();

  // Redirect if already logged in
  useEffect(() => {
    if (user && role) {
      if (role === 'admin') navigate('/admin/dashboard', { replace: true });
      else if (role === 'owner') navigate('/owner/dashboard', { replace: true });
      else navigate('/customer', { replace: true });
    }
  }, [user, role, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!agreeTerms) {
      setError('Please agree to the Terms & Conditions');
      return;
    }

    // Basic phone validation (allowing 10 to 15 digits to support country codes like +91)
    if (formData.phone && !/^\d{10,15}$/.test(formData.phone.replace(/\D/g, ''))) {
      setError('Please enter a valid 10 to 15-digit mobile number');
      return;
    }

    showLoader();

    try {
      // Call backend API
      const data = await registerUser({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone
      });

      const registeredUser = data.user;
      const assignedRole = registeredUser.roles?.[0] || 'customer';
      const token = data.token;

      // Update auth context
      login(registeredUser, token, assignedRole);

      // Redirect based on role
      if (assignedRole === 'admin') navigate('/admin/dashboard', { replace: true });
      else if (assignedRole === 'owner') navigate('/owner/dashboard', { replace: true });
      else navigate('/customer', { replace: true });
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err.response?.data?.message || err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      hideLoader();
    }
  };

  return (
    <PageTransition initialX={35} exitX={35} className="flex h-screen w-screen bg-gray-50 overflow-hidden font-sans">
      {/* Left Section - Hero Image / Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-teal-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-800/90 to-teal-900/95 z-10" />
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
          alt="Luxury Hotel"
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
              Experience logic <br />
              <span className="text-teal-200">redefined.</span>
            </h2>
            <p className="text-lg text-teal-100/80 font-light leading-relaxed">
              Join thousands of travelers who have found their perfect home away from home.
              Sign up today and start your journey.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-sm text-teal-200/60">
            <span>© 2026 Stay Here Inc.</span>
          </div>
        </div>
      </div>

      {/* Right Section - Sign Up Form */}
      <div className="w-full lg:w-1/2 h-full overflow-y-auto flex flex-col justify-center items-center p-6 lg:p-12 relative">
        <div className="w-full max-w-md lg:max-w-xl space-y-6 bg-white p-8 lg:p-10 rounded-3xl shadow-2xl border border-gray-100">

          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create an account</h1>
            <p className="text-gray-500">Enter your details significantly to get started</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg text-sm flex items-center shadow-sm">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {error}
            </div>
          )}

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200 placeholder-gray-400 font-medium"
                placeholder="John Doe"
                required
              />
            </div>


            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200 placeholder-gray-400 font-medium"
                placeholder="john@example.com"
                required
              />
            </div>

            {/* Mobile Field */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Mobile Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200 placeholder-gray-400 font-medium"
                placeholder="9876543210"
                required
              />
            </div>



            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Password</label>
              <div className="relative group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200 placeholder-gray-400 font-medium pr-10"
                  placeholder="••••••••"
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

            {/* Terms & Conditions */}
            <div className="flex items-center space-x-3 pt-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500 transition cursor-pointer"
              />
              <label htmlFor="terms" className="text-gray-600 text-sm">
                I agree to the
                <a href="#" className="text-teal-600 hover:text-teal-700 font-semibold ml-1 transition-colors border-b border-teal-600/20 hover:border-teal-600">
                  Terms & Conditions
                </a>
              </label>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-600 to-teal-500 text-white font-bold py-3.5 px-4 rounded-xl hover:from-teal-700 hover:to-teal-600 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-teal-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 mt-4"
            >
              Start Journey
            </button>
          </form>



          {/* Sign In Link */}
          <p className="text-center text-gray-600 text-sm">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-teal-600 font-bold hover:text-teal-700 bg-transparent border-none cursor-pointer hover:underline transition-all"
            >
              Log in here
            </button>
          </p>
        </div>
      </div>
    </PageTransition>
  );
};

export default Register;
