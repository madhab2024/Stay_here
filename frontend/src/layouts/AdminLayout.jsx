import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { Menu, X, LogOut, LayoutDashboard, Users, Building2, Settings, UserCheck, User } from "lucide-react";
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
            {/* Top Header - Increased height and padding */}
            <header className="sticky top-0 z-40 bg-gradient-to-r from-teal-600 to-teal-800 text-white shadow-lg h-24 flex items-center px-8">
                <div className="flex justify-between items-center w-full">
                    <div className="flex items-center space-x-6">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-3 hover:bg-teal-700 rounded-xl transition-colors"
                        >
                            {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md">
                                <span className="text-teal-600 font-bold text-xl">S</span>
                            </div>
                            <span className="font-bold text-2xl tracking-wide">Stay Here Admin</span>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 text-white transition-colors px-6 py-3 rounded-xl font-semibold text-lg border border-white/20"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar - Fixed - Increased width to w-72 */}
                <aside
                    className={`fixed left-0 top-24 h-[calc(100vh-6rem)] ${isSidebarOpen ? 'w-72' : 'w-0'} bg-gray-900 text-gray-100 flex-shrink-0 transition-all duration-300 overflow-y-auto z-40 shadow-xl`}
                >
                    <nav className="p-6 space-y-3 h-full">
                        <NavLink
                            to="/admin/dashboard"
                            className={({ isActive }) =>
                                `flex items-center space-x-4 px-5 py-4 rounded-xl transition-all duration-200 text-lg font-medium ${isActive
                                    ? "bg-teal-600 text-white shadow-lg shadow-teal-900/20"
                                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                }`
                            }
                        >
                            <LayoutDashboard size={24} />
                            <span>Dashboard</span>
                        </NavLink>
                        <NavLink
                            to="/admin/users"
                            className={({ isActive }) =>
                                `flex items-center space-x-4 px-5 py-4 rounded-xl transition-all duration-200 text-lg font-medium ${isActive
                                    ? "bg-teal-600 text-white shadow-lg shadow-teal-900/20"
                                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                }`
                            }
                        >
                            <Users size={24} />
                            <span>Users</span>
                        </NavLink>
                        <NavLink
                            to="/admin/properties"
                            className={({ isActive }) =>
                                `flex items-center space-x-4 px-5 py-4 rounded-xl transition-all duration-200 text-lg font-medium ${isActive
                                    ? "bg-teal-600 text-white shadow-lg shadow-teal-900/20"
                                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                }`
                            }
                        >
                            <Building2 size={24} />
                            <span>Properties</span>
                        </NavLink>
                        <NavLink
                            to="/admin/host-applications"
                            className={({ isActive }) =>
                                `flex items-center space-x-4 px-5 py-4 rounded-xl transition-all duration-200 text-lg font-medium ${isActive
                                    ? "bg-teal-600 text-white shadow-lg shadow-teal-900/20"
                                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                }`
                            }
                        >
                            <UserCheck size={24} />
                            <span>Host Applications</span>
                        </NavLink>
                        <NavLink
                            to="/admin/settings"
                            className={({ isActive }) =>
                                `flex items-center space-x-4 px-5 py-4 rounded-xl transition-all duration-200 text-lg font-medium ${isActive
                                    ? "bg-teal-600 text-white shadow-lg shadow-teal-900/20"
                                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                }`
                            }
                        >
                            <Settings size={24} />
                            <span>Settings</span>
                        </NavLink>
                        <NavLink
                            to="/admin/profile"
                            className={({ isActive }) =>
                                `flex items-center space-x-4 px-5 py-4 rounded-xl transition-all duration-200 text-lg font-medium ${isActive
                                    ? "bg-teal-600 text-white shadow-lg shadow-teal-900/20"
                                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                }`
                            }
                        >
                            <User size={24} />
                            <span>Profile</span>
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
