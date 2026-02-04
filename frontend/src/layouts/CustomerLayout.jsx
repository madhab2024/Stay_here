import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { Menu, X, LogOut, Home, Heart, MapPin } from "lucide-react";
import { useState } from "react";

const CustomerLayout = () => {
    const { role, upgradeToOwner, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleBecomeHost = () => {
        upgradeToOwner();
        navigate('/owner/dashboard');
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-white">
            <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-teal-600 to-teal-800 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-lg">S</span>
                            </div>
                            <span className="font-bold text-xl text-gray-800">Stay Here</span>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <NavLink 
                                to="/customer" 
                                className={({ isActive }) => `flex items-center space-x-1 font-medium transition-colors ${isActive ? 'text-teal-600' : 'text-gray-600 hover:text-teal-600'}`}
                            >
                                <Home size={20} />
                                <span>Home</span>
                            </NavLink>
                            <NavLink 
                                to="/customer/saved" 
                                className={({ isActive }) => `flex items-center space-x-1 font-medium transition-colors ${isActive ? 'text-teal-600' : 'text-gray-600 hover:text-teal-600'}`}
                            >
                                <Heart size={20} />
                                <span>Saved</span>
                            </NavLink>
                            <NavLink 
                                to="/customer/trips" 
                                className={({ isActive }) => `flex items-center space-x-1 font-medium transition-colors ${isActive ? 'text-teal-600' : 'text-gray-600 hover:text-teal-600'}`}
                            >
                                <MapPin size={20} />
                                <span>Trips</span>
                            </NavLink>
                        </div>

                        {/* Right Section */}
                        <div className="hidden md:flex items-center space-x-4">
                            {role === 'customer' && (
                                <button
                                    onClick={handleBecomeHost}
                                    className="px-4 py-2 border-2 border-teal-600 text-teal-600 rounded-full hover:bg-teal-50 transition font-semibold text-sm"
                                >
                                    Become a Host
                                </button>
                            )}
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition font-semibold flex items-center space-x-2 text-sm"
                            >
                                <LogOut size={18} />
                                <span>Logout</span>
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden text-gray-600 hover:text-teal-600"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    {/* Mobile Navigation */}
                    {isMenuOpen && (
                        <div className="md:hidden mt-4 pb-4 border-t border-gray-100 pt-4 space-y-3">
                            <NavLink 
                                to="/customer" 
                                className={({ isActive }) => `block px-4 py-2 rounded-lg transition-colors ${isActive ? 'bg-teal-100 text-teal-600 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                Home
                            </NavLink>
                            <NavLink 
                                to="/customer/saved" 
                                className={({ isActive }) => `block px-4 py-2 rounded-lg transition-colors ${isActive ? 'bg-teal-100 text-teal-600 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                Saved
                            </NavLink>
                            <NavLink 
                                to="/customer/trips" 
                                className={({ isActive }) => `block px-4 py-2 rounded-lg transition-colors ${isActive ? 'bg-teal-100 text-teal-600 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                Trips
                            </NavLink>
                            {role === 'customer' && (
                                <button
                                    onClick={handleBecomeHost}
                                    className="w-full px-4 py-2 border-2 border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 transition font-semibold"
                                >
                                    Become a Host
                                </button>
                            )}
                            <button
                                onClick={handleLogout}
                                className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-semibold"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <Outlet />
            </main>
        </div>
    );
};

export default CustomerLayout;
