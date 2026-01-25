import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

const AdminLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Top Header */}
            <header className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-lg">
                <span className="font-bold text-lg tracking-wide">StayHere Admin</span>
                <button
                    onClick={handleLogout}
                    className="text-xs bg-red-600 hover:bg-red-700 transition-colors px-3 py-1 rounded"
                >
                    Logout
                </button>
            </header>

            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className="w-64 bg-slate-800 text-slate-300 flex-shrink-0">
                    <nav className="p-4 space-y-2">
                        <NavLink
                            to="/admin/dashboard"
                            className={({ isActive }) =>
                                `block px-4 py-2 rounded transition-colors ${isActive
                                    ? "bg-slate-700 text-white"
                                    : "hover:bg-slate-700 hover:text-white"
                                }`
                            }
                        >
                            Dashboard
                        </NavLink>
                        <NavLink
                            to="/admin/users"
                            className={({ isActive }) =>
                                `block px-4 py-2 rounded transition-colors ${isActive
                                    ? "bg-slate-700 text-white"
                                    : "hover:bg-slate-700 hover:text-white"
                                }`
                            }
                        >
                            Users
                        </NavLink>
                        <NavLink
                            to="/admin/properties"
                            className={({ isActive }) =>
                                `block px-4 py-2 rounded transition-colors ${isActive
                                    ? "bg-slate-700 text-white"
                                    : "hover:bg-slate-700 hover:text-white"
                                }`
                            }
                        >
                            Properties
                        </NavLink>
                        <NavLink
                            to="/admin/settings"
                            className={({ isActive }) =>
                                `block px-4 py-2 rounded transition-colors ${isActive
                                    ? "bg-slate-700 text-white"
                                    : "hover:bg-slate-700 hover:text-white"
                                }`
                            }
                        >
                            Settings
                        </NavLink>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
