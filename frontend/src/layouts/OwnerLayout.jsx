import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { Menu, ChevronLeft, LogOut, LayoutDashboard, Building2, ArrowLeftRight, User } from "lucide-react";
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
            <aside className={`fixed left-0 top-0 h-screen ${isSidebarOpen ? 'w-64' : 'w-0'} bg-white text-gray-800 border-r border-gray-200 flex flex-col transition-all duration-300 shadow-xl z-50 overflow-hidden`}>
                <div className="p-6 font-bold text-xl flex items-center space-x-3 border-b border-gray-100 h-16">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                        <span className="text-white font-bold text-lg">SH</span>
                    </div>
                    <span className="text-gray-900 tracking-tight">StayHere</span>
                </div>

                <nav className="flex-1 flex flex-col space-y-1 px-4 py-6">
                    <NavLink
                        to="/owner/dashboard"
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${isActive
                                ? "bg-indigo-50 text-indigo-600 shadow-sm"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`
                        }
                    >
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink
                        to="/owner/properties"
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${isActive
                                ? "bg-indigo-50 text-indigo-600 shadow-sm"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`
                        }
                    >
                        <Building2 size={20} />
                        <span>Properties</span>
                    </NavLink>
                </nav>

                <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                    <NavLink
                        to="/customer"
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-white hover:text-indigo-600 hover:shadow-sm transition-all duration-200 text-sm font-medium mb-2"
                    >
                        <ArrowLeftRight size={20} />
                        <span>Switch to Traveling</span>
                    </NavLink>

                    <NavLink
                        to="/owner/profile"
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium mb-2 ${isActive
                                ? "bg-indigo-50 text-indigo-600"
                                : "text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm"
                            }`
                        }
                    >
                        <User size={20} />
                        <span>Profile</span>
                    </NavLink>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className={`flex-1 flex flex-col transition-all duration-300 min-h-screen ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
                {/* Header */}
                <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 h-16 flex justify-between items-center">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    >
                        {isSidebarOpen ? <ChevronLeft size={24} /> : <Menu size={24} />}
                    </button>

                    {/* Header Right Side */}
                </header>

                {/* Content */}
                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default OwnerLayout;
