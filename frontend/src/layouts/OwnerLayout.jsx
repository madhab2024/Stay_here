import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

const OwnerLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r flex flex-col">
                <div className="p-6 font-bold text-xl text-indigo-600">
                    StayHere Owner
                </div>

                <nav className="flex-1 flex flex-col space-y-2 px-4">
                    <NavLink
                        to="/owner/dashboard"
                        className={({ isActive }) =>
                            `px-3 py-2 rounded-md ${isActive
                                ? "bg-indigo-100 text-indigo-600"
                                : "text-gray-600 hover:bg-gray-100"
                            }`
                        }
                    >
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/owner/properties"
                        className={({ isActive }) =>
                            `px-3 py-2 rounded-md ${isActive
                                ? "bg-indigo-100 text-indigo-600"
                                : "text-gray-600 hover:bg-gray-100"
                            }`
                        }
                    >
                        Properties
                    </NavLink>
                </nav>

                <div className="p-4 border-t">
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </aside>

            {/* Content */}
            <main className="flex-1 p-6">
                <Outlet />
            </main>
        </div>
    );
};

export default OwnerLayout;
