import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';

const Register = () => {
    const { user, role } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user && role) {
            if (role === 'admin') navigate('/admin/dashboard', { replace: true });
            else if (role === 'owner') navigate('/owner/dashboard', { replace: true });
            else navigate('/customer', { replace: true });
        }
    }, [user, role, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-4">Register</h1>
            <p className="mb-4">Create a new account</p>
            <p className="text-sm text-gray-500">(Registration logic coming soon)</p>
            <button onClick={() => navigate('/login')} className="mt-4 text-indigo-600 hover:underline">
                Back to Login
            </button>
        </div>
    );
};

export default Register;
