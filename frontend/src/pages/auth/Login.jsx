import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, user, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Task 4: Redirect if already logged in
  useEffect(() => {
    if (user && role) {
      if (role === 'admin') navigate('/admin/dashboard', { replace: true });
      else if (role === 'owner') navigate('/owner/dashboard', { replace: true });
      else navigate('/customer', { replace: true });
    }
  }, [user, role, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Task 2: Mock role assignment logic
    let assignedRole = 'customer';
    if (email.toLowerCase().includes('admin')) assignedRole = 'admin';
    else if (email.toLowerCase().includes('owner')) assignedRole = 'owner';

    const userData = { email, name: email.split('@')[0] };
    const token = 'mock-jwt-token-12345';

    // Task 1: Update AuthContext
    login(userData, token, assignedRole);

    // Task 3: Post-login redirect
    // Check if there's a previous location we were redirected from
    const from = location.state?.from?.pathname;

    if (from) {
      navigate(from, { replace: true });
    } else {
      if (assignedRole === 'admin') navigate('/admin/dashboard', { replace: true });
      else if (assignedRole === 'owner') navigate('/owner/dashboard', { replace: true });
      else navigate('/customer', { replace: true });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:bg-indigo-700 transition duration-300"
          >
            Sign In
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>Testing accounts:</p>
          <p>admin@test.com - Admin</p>
          <p>owner@test.com - Owner</p>
          <p>user@test.com - Customer</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
