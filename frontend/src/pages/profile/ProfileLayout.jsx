import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';

const ProfileLayout = () => {
    const { user, role, logout } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navItemClass = (path) => `
        flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
        ${isActive(path)
            ? 'bg-indigo-50 text-indigo-700'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
    `;

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden min-h-[600px] flex flex-col md:flex-row">
                    {/* Sidebar */}
                    <aside className="w-full md:w-64 border-r border-gray-100 bg-white">
                        <div className="p-6 border-b border-gray-100 flex flex-col items-center">
                            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-2xl font-bold text-indigo-600 mb-3">
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <h2 className="text-lg font-bold text-gray-900">{user?.name}</h2>
                            <p className="text-sm text-gray-500">{user?.email}</p>
                            <span className="mt-2 text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-600 rounded-full uppercase tracking-wider">
                                {role}
                            </span>
                        </div>

                        <nav className="p-4 space-y-1">
                            <Link to="/profile" className={navItemClass('/profile')}>
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Personal Info
                            </Link>

                            {role === 'customer' && (
                                <Link to="/customer/trips" className={navItemClass('/customer/trips')}>
                                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    My Trips
                                </Link>
                            )}

                            {role === 'owner' && (
                                <>
                                    <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        Hosting
                                    </div>
                                    <Link to="/owner/dashboard" className={navItemClass('/owner/dashboard')}>
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                        Dashboard
                                    </Link>
                                    <Link to="/owner/properties" className={navItemClass('/owner/properties')}>
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                        Properties
                                    </Link>
                                </>
                            )}

                            <div className="pt-4 border-t border-gray-100 mt-4">
                                <button
                                    onClick={logout}
                                    className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                >
                                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Sign Out
                                </button>
                            </div>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 p-8 overflow-y-auto">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ProfileLayout;
