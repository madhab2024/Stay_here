import { useState, useEffect } from 'react';
import { fetchOwnerBookings } from '../../api/bookingApi';
import { fetchOwnerProperties } from '../../api/propertyApi';
import StatsCard from '../../components/dashboard/StatsCard';
import { DollarSign, CalendarCheck, Building, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const OwnerDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const [bookingsRes, propertiesRes] = await Promise.all([
                    fetchOwnerBookings(),
                    fetchOwnerProperties()
                ]);
                setBookings(bookingsRes.data || []);
                setProperties(propertiesRes.data || []);
            } catch (err) {
                console.error("Failed to load dashboard data", err);
            } finally {
                setLoading(false);
            }
        };
        loadDashboardData();
    }, []);

    // Calculate Stats
    const totalRevenue = bookings.reduce((acc, curr) => acc + (curr.price || 0), 0);
    const activeBookings = bookings.filter(b => b.status === 'confirmed').length;
    const totalProperties = properties.length;

    const stats = [
        {
            title: "Total Revenue",
            value: `₹${totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            color: "emerald",
            trend: "up",
            trendValue: "12%" // Mock trend for now
        },
        {
            title: "Active Bookings",
            value: activeBookings,
            icon: CalendarCheck,
            color: "blue",
            trend: "up",
            trendValue: "5%"
        },
        {
            title: "Total Properties",
            value: totalProperties,
            icon: Building,
            color: "purple",
            trend: "neutral",
            trendValue: "0%"
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    if (loading) return (
        <div className="flex h-96 items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <motion.div
            className="space-y-6 p-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header Section */}
            <motion.div variants={itemVariants} className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome back, Owner! 👋</h1>
                    <p className="text-sm text-gray-500 mt-1">Here's what's happening with your properties today.</p>
                </div>
                <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 font-medium">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <StatsCard key={index} {...stat} className="border-t-4 border-t-transparent hover:border-t-indigo-500 transition-all duration-300" />
                ))}
            </motion.div>

            {/* Recent Bookings Section */}
            <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900">Recent Reservations</h3>
                    <button className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold transition-colors">View All</button>
                </div>

                {bookings.length === 0 ? (
                    <div className="p-10 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CalendarCheck className="text-gray-400" size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No bookings yet</h3>
                        <p className="text-sm text-gray-500 mt-1">When you get your first reservation, it will show up here.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Property</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Guest</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Dates</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {bookings.slice(0, 5).map((booking) => (
                                    <tr key={booking.id} className="hover:bg-gray-50/80 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold text-lg">
                                                    {booking.propertyName.charAt(0)}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-bold text-gray-900">{booking.propertyName}</div>
                                                    <div className="text-xs text-gray-500">{booking.roomType}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 font-medium">Guest User</div>
                                            <div className="text-xs text-gray-500">ID: {booking.userId?.substring(0, 8)}...</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 font-medium">
                                                {new Date(booking.dates.checkIn).toLocaleDateString()}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                to {new Date(booking.dates.checkOut).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full 
                                                ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                    booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                        'bg-red-100 text-red-700'}`}>
                                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">
                                            ₹{booking.price}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

export default OwnerDashboard;
