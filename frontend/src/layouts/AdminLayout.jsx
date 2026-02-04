import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { Menu, X, LogOut, LayoutDashboard, Users, Building2, Settings } from "lucide-react";
import { useState } from "react";

const AdminLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Top Header */}
            <header className="sticky top-0 z-40 bg-gradient-to-r from-teal-600 to-teal-800 text-white p-4 shadow-lg">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-teal-700 rounded-lg transition"
                        >
                            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                <span className="text-teal-600 font-bold text-lg">S</span>
                            </div>
                            <span className="font-bold text-lg tracking-wide">Stay Here Admin</span>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 bg-white text-teal-600 hover:bg-gray-100 transition-colors px-4 py-2 rounded-lg font-semibold"
                    >
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar - Fixed */}
                <aside 
                    className={`fixed left-0 top-16 h-screen ${isSidebarOpen ? 'w-64' : 'w-0'} bg-gray-800 text-gray-100 flex-shrink-0 transition-all duration-300 overflow-hidden z-40`}
                >
                    <nav className="p-4 space-y-2 h-full">
                        <NavLink
                            to="/admin/dashboard"
                            className={({ isActive }) =>
                                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? "bg-teal-600 text-white font-semibold"
                                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                                }`
                            }
                        >
                            <LayoutDashboard size={20} />
                            <span>Dashboard</span>
                        </NavLink>
                        <NavLink
                            to="/admin/users"
                            className={({ isActive }) =>
                                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? "bg-teal-600 text-white font-semibold"
                                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                                }`
                            }
                        >
                            <Users size={20} />
                            <span>Users</span>
                        </NavLink>
                        <NavLink
                            to="/admin/properties"
                            className={({ isActive }) =>
                                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? "bg-teal-600 text-white font-semibold"
                                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                                }`
                            }
                        >
                            <Building2 size={20} />
                            <span>Properties</span>
                        </NavLink>
                        <NavLink
                            to="/admin/settings"
                            className={({ isActive }) =>
                                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? "bg-teal-600 text-white font-semibold"
                                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                                }`
                            }
                        >
                            <Settings size={20} />
                            <span>Settings</span>
                        </NavLink>
                        <NavLink
                            to="/profile"
                            className={({ isActive }) =>
                                `block px-4 py-2 rounded transition-colors ${isActive
                                    ? "bg-slate-700 text-white"
                                    : "hover:bg-slate-700 hover:text-white"
                                }`
                            }
                        >
                            Profile
                        </NavLink>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className={`flex-1 p-8 overflow-y-auto bg-gray-50 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
