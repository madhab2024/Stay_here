import { useState, useEffect } from 'react';
import { fetchAdminStats, fetchAllUsers } from '../../api/adminApi';
import StatsCard from '../../components/dashboard/StatsCard';
import { Users, Building, AlertCircle, CheckCircle, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ users: 0, properties: 0, activeBookings: 0 });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data for now as backend endpoint might need to be created
        // In real scenario: const loadData = async () => { ... }
        setTimeout(() => {
            setStats({
                users: 1250,
                properties: 340,
                revenue: 45000
            });
            setUsers([
                { id: 1, name: "John Doe", email: "john@example.com", role: "customer", status: "active" },
                { id: 2, name: "Jane Smith", email: "jane@properties.com", role: "owner", status: "active" },
                { id: 3, name: "Mike Ross", email: "mike@law.com", role: "customer", status: "inactive" },
            ]);
            setLoading(false);
        }, 800);
    }, []);

    const dashboardStats = [
        {
            title: "Total Users",
            value: stats.users.toLocaleString(),
            icon: Users,
            color: "blue",
            trend: "up",
            trendValue: "8%"
        },
        {
            title: "Total Properties",
            value: stats.properties,
            icon: Building,
            color: "rose",
            trend: "up",
            trendValue: "14%"
        },
        {
            title: "System Health",
            value: "98%",
            icon: Activity,
            color: "emerald",
            trend: "neutral",
            trendValue: "Stable"
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
    );

    return (
        <motion.div
            className="space-y-10 p-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header Section */}
            <motion.div variants={itemVariants} className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Admin Overview 🛡️</h1>
                    <p className="text-lg text-gray-500 mt-2">Manage users, listings, and system settings.</p>
                </div>
                <div className="text-base text-gray-500 bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-100 font-medium">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {dashboardStats.map((stat, index) => (
                    <StatsCard key={index} {...stat} className="border-t-4 border-t-transparent hover:border-t-red-500 transition-all duration-300" />
                ))}
            </motion.div>

            {/* Recent Activity / Users Table */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-10 py-8 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-gray-900">Recent Users</h3>
                    <button className="text-red-600 hover:text-red-700 text-base font-semibold transition-colors">View All Users</button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-10 py-6 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-10 py-6 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-10 py-6 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-10 py-6 text-right text-sm font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50/80 transition-colors">
                                    <td className="px-10 py-6 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div className="ml-5">
                                                <div className="text-base font-bold text-gray-900">{user.name}</div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 whitespace-nowrap">
                                        <span className="px-4 py-1.5 inline-flex text-sm leading-5 font-bold rounded-full bg-gray-100 text-gray-800 uppercase tracking-wide">
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6 whitespace-nowrap">
                                        <span className={`px-4 py-1.5 inline-flex text-sm leading-5 font-bold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6 whitespace-nowrap text-right text-base font-medium">
                                        <a href="#" className="text-indigo-600 hover:text-indigo-900">Edit</a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AdminDashboard;
