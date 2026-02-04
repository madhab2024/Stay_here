import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { Menu, X, LogOut, LayoutDashboard, Building2 } from "lucide-react";
import { useState } from "react";

const OwnerLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Sidebar - Fixed */}
            <aside className={`fixed left-0 top-0 h-screen ${isSidebarOpen ? 'w-64' : 'w-0'} bg-gray-800 text-gray-100 flex flex-col transition-all duration-300 overflow-hidden shadow-lg z-40`}>
                <div className="p-6 font-bold text-xl flex items-center space-x-2 border-b border-gray-700">
                    <div className="w-8 h-8 bg-gradient-to-br from-teal-600 to-teal-800 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-lg">S</span>
                    </div>
                    <span>Stay Here Owner</span>
                </div>

                <nav className="flex-1 flex flex-col space-y-2 px-4 py-6">
                    <NavLink
                        to="/owner/dashboard"
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
                        to="/owner/properties"
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
                        to="/profile"
                        className={({ isActive }) =>
                            `px-3 py-2 rounded-md ${isActive
                                ? "bg-indigo-100 text-indigo-600"
                                : "text-gray-600 hover:bg-gray-100"
                            }`
                        }
                    >
                        Profile
                    </NavLink>
                </nav>

                <div className="p-4 border-t border-gray-700">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors font-semibold"
                    >
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area - Adjust for fixed sidebar */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
                <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="text-gray-600 hover:text-teal-600 transition"
                    >
                        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </header>

                {/* Content */}
                <main className="flex-1 p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default OwnerLayout;
