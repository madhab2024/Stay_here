import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { useState, useEffect } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, User, Menu, X, Briefcase, Heart, MapPin, Home, Compass, Tag, CreditCard, Lock, Search, ChevronDown, Phone, Globe } from "lucide-react";
import HostStatusBadge from "../components/HostStatusBadge";

const CustomerLayout = () => {
    const { user, role, upgradeToOwner, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    
    const isHome = location.pathname === '/customer' || location.pathname === '/customer/';

    let activeTab = 'deals';
    if (location.pathname.includes('/customer/profile/saved')) activeTab = 'saved';
    else if (location.pathname.includes('/customer/profile/bookings')) activeTab = 'bookings';
    else if (location.pathname.includes('/customer/profile/payments')) activeTab = 'payments';
    else if (location.pathname.includes('/customer/profile/security')) activeTab = 'security';
    else if (location.pathname.includes('/customer/profile')) activeTab = 'user';
    else if (isHome) activeTab = 'deals';

    // Check if user has owner capability (already upgraded before)
    const hasOwnerCapability = user?.roles?.includes('owner');

    const handleBecomeHost = () => {
        if (!hasOwnerCapability) {
            // Navigate to become host form for new hosts
            navigate('/customer/become-host');
        } else {
            // Existing hosts can switch directly
            navigate('/owner/dashboard');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = [
        { name: "HOME", path: "/customer/" },
        { name: "ALL LISTINGS", path: "/customer/profile/bookings" }, // Map trips to all listings for now or change route
        { name: "FEATURED", path: "/customer/profile/saved" },     // Map saved to featured
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col relative">
            {/* Navbar - Desktop Only */}
            {/* Navbar - Desktop Only - OYO Style mega nav */}
            <nav className="hidden md:block fixed top-0 w-full z-[200] transition-all duration-300 bg-white border-b border-gray-200 shadow-sm text-gray-900 pb-0">
                {/* Top Strip */}
                <div className="w-full border-b border-gray-100 bg-white">
                  <div className="max-w-[1400px] mx-auto px-4 flex h-[64px] items-center justify-between">
                    
                    {/* Left Logo & Back Button */}
                    <div className="flex-shrink-0 flex items-center gap-3">
                        {!isHome && (
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-700 hover:text-black border border-gray-200 shadow-sm"
                                title="Go Back"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                        )}
                        <div
                            className="flex items-center cursor-pointer"
                            onClick={() => navigate('/customer')}
                        >
                            <span className="text-3xl font-black tracking-tighter text-[#FF405A] uppercase flex items-center">
                                STAY HERE
                            </span>
                        </div>
                    </div>

                    {/* Right Side - Info Blocks partitioned by borders */}
                    <div className="flex items-center h-full">
                        
                        {/* Block 1: Premium Member */}
                        <div className="hidden lg:flex flex-col justify-center px-4 border-r border-gray-200 h-full hover:bg-gray-50 cursor-pointer transition-colors">
                            <span className="text-[13px] font-bold text-gray-900 flex items-center gap-1.5 leading-tight">
                                <Heart size={14} className="text-[#FF405A] stroke-[2.5]" /> Become a Member
                            </span>
                            <span className="text-[11px] text-gray-500 leading-tight tracking-tight mt-0.5">Additional 10% off on stays</span>
                        </div>

                        {/* Block 2: Business */}
                        <div className="hidden xl:flex flex-col justify-center px-4 border-r border-gray-200 h-full hover:bg-gray-50 cursor-pointer transition-colors">
                            <span className="text-[13px] font-bold text-gray-900 flex items-center gap-1.5 leading-tight">
                                <Briefcase size={14} className="text-gray-600 stroke-[2.5]" /> StayHere for Business
                            </span>
                            <span className="text-[11px] text-gray-500 leading-tight tracking-tight mt-0.5">Trusted by 5000 Corporates</span>
                        </div>

                        {/* Block 3: List property */}
                        <div 
                            onClick={handleBecomeHost}
                            className="hidden lg:flex flex-col justify-center px-4 border-r border-gray-200 h-full hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                            <span className="text-[13px] font-bold text-gray-900 flex items-center gap-1.5 leading-tight">
                                <Home size={14} className="text-gray-600 stroke-[2.5]" /> List your property
                            </span>
                            <span className="text-[11px] text-gray-500 leading-tight tracking-tight mt-0.5">Start earning in 30 mins</span>
                        </div>

                        {/* Block 4: Phone Support */}
                        <div className="hidden md:flex flex-col justify-center px-4 border-r border-gray-200 h-full hover:bg-gray-50 cursor-pointer transition-colors">
                            <span className="text-[13px] font-bold text-gray-900 flex items-center gap-1.5 leading-tight">
                                <Phone size={14} className="text-gray-600 stroke-[2.5]" /> 0124-6201611
                            </span>
                            <span className="text-[11px] text-gray-500 leading-tight tracking-tight mt-0.5">Call us to Book now</span>
                        </div>

                        {/* Block 5: Language */}
                        <div className="hidden md:flex items-center justify-center px-4 border-r border-gray-200 h-full hover:bg-gray-50 cursor-pointer transition-colors">
                            <div className="flex items-center gap-1.5">
                                <Globe size={18} className="text-gray-700 stroke-[1.5]" />
                                <span className="text-[14px] font-bold text-gray-900">English</span>
                                <ChevronDown size={14} className="text-gray-700" />
                            </div>
                        </div>

                        {/* Block 6: Profile & Auth Dropdown */}
                        <div className="flex items-center justify-center px-4 h-full">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none group">
                                        <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border border-gray-300">
                                            {user?.avatar ? (
                                                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <User size={18} className="text-gray-600" />
                                            )}
                                        </div>
                                        <span className="text-[14px] font-bold text-gray-900 group-hover:text-[#FF405A] transition-colors">
                                            {user ? user.name.split(' ')[0] : 'Login / Signup'}
                                        </span>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-64 p-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 bg-white data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-top-2 duration-200 ease-out"
                                    align="end"
                                    sideOffset={12}
                                >
                                    {/* User Info Header */}
                                    <div className="px-2 py-3 mb-2 border-b border-gray-100 bg-white">
                                        <div className="flex items-center gap-4 mb-2">
                                            <Avatar className="h-12 w-12 border border-gray-100 shadow-sm">
                                                <AvatarImage src={user?.avatar} alt={user?.name} className="object-cover" />
                                                <AvatarFallback className="bg-[#FF405A] text-white font-bold text-base">
                                                    {user?.name ? user.name.charAt(0).toUpperCase() : <User size={20} />}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[15px] font-bold text-gray-900 tracking-tight truncate">{user?.name || "Guest"}</p>
                                                <p className="text-[13px] text-gray-500 truncate">{user?.email}</p>
                                            </div>
                                        </div>
                                        <div className="mt-1 flex pl-[63px]">
                                            <HostStatusBadge />
                                        </div>
                                    </div>

                                    {/* Menu Items */}
                                    <DropdownMenuItem
                                        onClick={() => navigate('/customer/profile')}
                                        className="cursor-pointer rounded-xl px-3 py-3 my-1 hover:bg-gray-50 focus:bg-gray-50 outline-none transition-colors group"
                                    >
                                        <User size={18} className="mr-3 text-gray-400 group-hover:text-gray-700 stroke-2 transition-colors" />
                                        <span className="font-semibold text-gray-700">Account settings</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => navigate('/customer/profile/bookings')}
                                        className="cursor-pointer rounded-xl px-3 py-3 my-1 hover:bg-gray-50 focus:bg-gray-50 outline-none transition-colors group"
                                    >
                                        <Briefcase size={18} className="mr-3 text-gray-400 group-hover:text-gray-700 stroke-2 transition-colors" />
                                        <span className="font-semibold text-gray-700">My Trips</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => navigate('/customer/profile/saved')}
                                        className="cursor-pointer rounded-xl px-3 py-3 my-1 hover:bg-gray-50 focus:bg-gray-50 outline-none transition-colors group"
                                    >
                                        <Heart size={18} className="mr-3 text-gray-400 group-hover:text-[#FF405A] stroke-2 transition-colors" />
                                        <span className="font-semibold text-gray-700">Saved Properties</span>
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator className="my-2 bg-gray-100" />

                                    <DropdownMenuItem
                                        onClick={handleLogout}
                                        className="cursor-pointer rounded-xl px-3 py-3 my-1 hover:bg-red-50 focus:bg-red-50 outline-none transition-colors text-red-600 group"
                                    >
                                        <LogOut size={18} className="mr-3 text-red-500 group-hover:text-red-600 stroke-2 transition-colors" />
                                        <span className="font-bold">Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Strip (Cities) */}
                <div className="w-full bg-gray-100/60 border-b border-gray-200 hidden md:block">
                  <div className="max-w-[1400px] mx-auto px-4 flex items-center justify-between h-[42px] text-[13px] text-gray-600 font-medium">
                     {/* List of cities */}
                     <div className="flex items-center w-full justify-between">
                        {['Bangalore', 'Chennai', 'Delhi', 'Gurgaon', 'Hyderabad', 'Kolkata', 'Mumbai', 'Noida', 'Pune'].map(city => (
                            <span key={city} className="hover:text-gray-900 cursor-pointer flex items-center gap-1 transition-colors">
                                {city} <ChevronDown size={12} className="text-gray-400 mt-0.5"/>
                            </span>
                        ))}
                        <span className="font-bold text-gray-900 cursor-pointer hover:underline">All Cities</span>
                     </div>
                  </div>
                </div>
            </nav>

            {/* Mobile Top Navbar (Solid White, standard pattern) */}
            <nav className="md:hidden fixed top-0 w-full z-[200] bg-white border-b border-gray-200 shadow-[0_2px_10px_rgb(0,0,0,0.05)] text-gray-900">
                <div className="flex items-center justify-between px-4 h-[60px]">
                    <span className="text-2xl font-black tracking-tighter text-[#FF405A] uppercase">STAY HERE</span>
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600">
                        {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
                {isMobileMenuOpen && (
                    <div className="py-4 border-t border-gray-100 space-y-2 px-4">
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
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main className={`flex-1 w-full flex flex-col pt-[60px] md:pt-[106px] ${
                isHome ? '' : 'max-w-7xl mx-auto pb-6 mt-[20px] md:mt-[30px] px-4 sm:px-6 lg:px-8'
            }`}>
                <Outlet />
            </main>

            {/* Mobile Bottom Navigation (Global) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-[100] px-4 py-2 sm:px-6 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.08)] pb-safe">
                <button onClick={() => navigate('/customer')} className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl text-gray-400 hover:text-gray-900 transition-all bg-transparent ${activeTab === 'deals' ? 'text-[#FF405A] scale-110' : ''}`}>
                    <Search size={22} className={activeTab === 'deals' ? 'drop-shadow-sm stroke-[2.5]' : 'stroke-2'} />
                </button>
                <button onClick={() => navigate('/customer/profile/saved')} className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${activeTab === 'saved' ? 'text-[#FF405A] scale-110' : 'text-gray-400 hover:text-gray-900 bg-transparent'}`}>
                    <Heart size={22} className={activeTab === 'saved' ? 'drop-shadow-sm fill-[#FF405A]' : 'stroke-2'} />
                </button>
                <button onClick={() => navigate('/customer/profile/bookings')} className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${activeTab === 'bookings' ? 'text-[#FF405A] scale-110' : 'text-gray-400 hover:text-gray-900 bg-transparent'}`}>
                    <Briefcase size={22} className={activeTab === 'bookings' ? 'drop-shadow-sm stroke-[2.5]' : 'stroke-2'} />
                </button>
                <button onClick={() => navigate('/customer/profile')} className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${activeTab === 'user' ? 'text-[#FF405A] scale-110' : 'text-gray-400 hover:text-gray-900 bg-transparent'}`}>
                    <User size={22} className={activeTab === 'user' ? 'drop-shadow-sm stroke-[2.5]' : 'stroke-2'} />
                </button>
                <button onClick={() => navigate('/customer/profile/payments')} className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${activeTab === 'payments' ? 'text-[#FF405A] scale-110' : 'text-gray-400 hover:text-gray-900 bg-transparent'}`}>
                    <CreditCard size={22} className={activeTab === 'payments' ? 'drop-shadow-sm stroke-[2.5]' : 'stroke-2'} />
                </button>
                <button onClick={() => navigate('/customer/profile/security')} className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${activeTab === 'security' ? 'text-[#FF405A] scale-110' : 'text-gray-400 hover:text-gray-900 bg-transparent'}`}>
                    <Lock size={22} className={activeTab === 'security' ? 'drop-shadow-sm stroke-[2.5]' : 'stroke-2'} />
                </button>
            </div>
        </div>
    );
};

export default CustomerLayout;
