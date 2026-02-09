import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, User, Menu, X, Briefcase, Heart, MapPin, Home } from "lucide-react";

const CustomerLayout = () => {
    const { user, role, upgradeToOwner, logout } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Check if user has owner capability (already upgraded before)
    const hasOwnerCapability = user?.roles?.includes('owner');

    const handleBecomeHost = () => {
        if (!hasOwnerCapability) {
            upgradeToOwner();
        }
        navigate('/owner/dashboard');
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = [
        { name: "Explore", path: "/customer/" },
        { name: "My Trips", path: "/customer/trips" },
        { name: "Saved", path: "/customer/saved" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">

                        {/* Logo */}
                        <div
                            className="flex-shrink-0 flex items-center cursor-pointer"
                            onClick={() => navigate('/customer')}
                        >
                            <span className="text-2xl font-bold tracking-tight text-indigo-600">
                                StayHere.
                            </span>
                        </div>

                        {/* Desktop Nav Links */}
                        <div className="hidden md:flex items-center space-x-6">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.name}
                                    to={link.path}
                                    end={link.path === '/customer/'}
                                    className={({ isActive }) =>
                                        `text-sm font-medium transition-colors hover:text-indigo-600 ${isActive ? "text-indigo-600" : "text-gray-600"
                                        }`
                                    }
                                >
                                    {link.name}
                                </NavLink>
                            ))}
                        </div>

                        {/* Right Side */}
                        <div className="flex items-center gap-3">
                            {/* Switch to Hosting Button (Desktop) - Always visible */}
                            <button
                                onClick={handleBecomeHost}
                                className="hidden md:inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <Briefcase size={16} className="mr-2" />
                                {hasOwnerCapability ? 'Switch to Hosting' : 'Become a Host'}
                            </button>

                            {/* Avatar Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="focus:outline-none rounded-full ring-offset-2 focus:ring-2 focus:ring-indigo-500">
                                        <Avatar className="h-10 w-10 border-2 border-gray-200 hover:border-indigo-400 transition-all cursor-pointer shadow-sm hover:shadow-md">
                                            <AvatarImage src={user?.avatar} alt={user?.name} />
                                            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold text-sm">
                                                {user?.name ? user.name.charAt(0).toUpperCase() : <User size={18} />}
                                            </AvatarFallback>
                                        </Avatar>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-64 p-2 rounded-xl shadow-2xl border border-gray-100 bg-white"
                                    align="end"
                                    sideOffset={8}
                                >
                                    {/* User Info Header */}
                                    <div className="px-3 py-3 mb-1 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                                                <AvatarImage src={user?.avatar} alt={user?.name} />
                                                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold">
                                                    {user?.name ? user.name.charAt(0).toUpperCase() : <User size={20} />}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || "Guest"}</p>
                                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Menu Items */}
                                    <DropdownMenuItem
                                        onClick={() => navigate('/profile')}
                                        className="cursor-pointer rounded-lg px-3 py-2.5 my-0.5 hover:bg-gray-50 focus:bg-gray-50"
                                    >
                                        <User size={18} className="mr-3 text-gray-400" />
                                        <span className="font-medium text-gray-700">Profile</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => navigate('/customer/trips')}
                                        className="cursor-pointer rounded-lg px-3 py-2.5 my-0.5 hover:bg-gray-50 focus:bg-gray-50"
                                    >
                                        <MapPin size={18} className="mr-3 text-gray-400" />
                                        <span className="font-medium text-gray-700">My Trips</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => navigate('/customer/saved')}
                                        className="cursor-pointer rounded-lg px-3 py-2.5 my-0.5 hover:bg-gray-50 focus:bg-gray-50"
                                    >
                                        <Heart size={18} className="mr-3 text-gray-400" />
                                        <span className="font-medium text-gray-700">Saved</span>
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator className="my-2 bg-gray-100" />

                                    {/* Switch to Hosting - Always visible in dropdown */}
                                    <DropdownMenuItem
                                        onClick={handleBecomeHost}
                                        className="cursor-pointer rounded-lg px-3 py-2.5 my-0.5 hover:bg-indigo-50 focus:bg-indigo-50"
                                    >
                                        <Home size={18} className="mr-3 text-indigo-500" />
                                        <span className="font-medium text-indigo-600">
                                            {hasOwnerCapability ? 'Switch to Hosting' : 'Become a Host'}
                                        </span>
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator className="my-2 bg-gray-100" />

                                    <DropdownMenuItem
                                        onClick={handleLogout}
                                        className="cursor-pointer rounded-lg px-3 py-2.5 my-0.5 text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-600"
                                    >
                                        <LogOut size={18} className="mr-3" />
                                        <span className="font-medium">Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden py-4 border-t border-gray-100 space-y-2">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.name}
                                    to={link.path}
                                    end={link.path === '/customer/'}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `block px-4 py-2 rounded-lg text-sm font-medium ${isActive
                                            ? "bg-indigo-50 text-indigo-600"
                                            : "text-gray-600 hover:bg-gray-50"
                                        }`
                                    }
                                >
                                    {link.name}
                                </NavLink>
                            ))}
                            <button
                                onClick={() => {
                                    handleBecomeHost();
                                    setIsMobileMenuOpen(false);
                                }}
                                className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                            >
                                {hasOwnerCapability ? 'Switch to Hosting' : 'Become a Host'}
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto w-full py-6 px-4 sm:px-6 lg:px-8">
                <Outlet />
            </main>
        </div>
    );
};

export default CustomerLayout;
