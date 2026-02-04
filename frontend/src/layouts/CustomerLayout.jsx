import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, User, Menu, X } from "lucide-react";

const CustomerLayout = () => {
    const { user, role, upgradeToOwner, logout } = useAuth();
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

    const navLinks = [
        { name: "Explore", path: "/customer/" },
        { name: "My Trips", path: "/customer/trips" },
        { name: "Saved", path: "/customer/saved" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">

                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/customer')}>
                            <span className="text-2xl font-extrabold tracking-tight text-indigo-600">
                                StayHere.
                            </span>
                        </div>

                        {/* Centered Nav Links (Desktop) */}
                        <div className="hidden md:flex items-center justify-center space-x-8">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.name}
                                    to={link.path}
                                    end={link.path === '/customer/'} // Strict matching for home
                                    className={({ isActive }) =>
                                        `text-sm font-medium transition-colors hover:text-indigo-600 ${isActive ? "text-indigo-600" : "text-gray-600"
                                        }`
                                    }
                                >
                                    {link.name}
                                </NavLink>
                            ))}
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex items-center gap-4">
                            {role === 'customer' && (
                                <button
                                    onClick={handleBecomeHost}
                                    className="hidden md:block text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    Switch to Hosting
                                </button>
                            )}

                            {/* User Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                        <Avatar className="h-10 w-10 border border-gray-200">
                                            <AvatarImage src={user?.avatar} alt={user?.name} />
                                            <AvatarFallback><User className="h-5 w-5 text-gray-400" /></AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
                                            <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                                        Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => navigate('/customer/trips')}>
                                        My Trips
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => navigate('/customer/saved')}>
                                        Saved
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="md:hidden text-gray-600 hover:text-indigo-600"
                            >
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    {isMenuOpen && (
                        <div className="md:hidden mt-4 pb-4 border-t border-gray-100 pt-4 space-y-3">
                            <NavLink
                                to="/customer"
                                className={({ isActive }) => `block px-4 py-2 rounded-lg transition-colors ${isActive ? 'bg-indigo-100 text-indigo-600 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                Home
                            </NavLink>
                            <NavLink
                                to="/customer/saved"
                                className={({ isActive }) => `block px-4 py-2 rounded-lg transition-colors ${isActive ? 'bg-indigo-100 text-indigo-600 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                Saved
                            </NavLink>
                            <NavLink
                                to="/customer/trips"
                                className={({ isActive }) => `block px-4 py-2 rounded-lg transition-colors ${isActive ? 'bg-indigo-100 text-indigo-600 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                Trips
                            </NavLink>
                            {role === 'customer' && (
                                <button
                                    onClick={handleBecomeHost}
                                    className="w-full px-4 py-2 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition font-semibold"
                                >
                                    Become a Host
                                </button>
                            )}
                            <button
                                onClick={handleLogout}
                                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
                            >
                                Logout
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
