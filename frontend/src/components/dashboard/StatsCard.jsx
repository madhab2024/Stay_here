import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color = "blue", className }) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={cn(
                "bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden",
                className
            )}
        >
            <div className="flex justify-between items-start z-10 relative">
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
                </div>
                <div className={cn(
                    "p-3 rounded-xl",
                    color === "blue" && "bg-blue-50 text-blue-600",
                    color === "indigo" && "bg-indigo-50 text-indigo-600",
                    color === "emerald" && "bg-emerald-50 text-emerald-600",
                    color === "purple" && "bg-purple-50 text-purple-600",
                    color === "rose" && "bg-rose-50 text-rose-600",
                    color === "amber" && "bg-amber-50 text-amber-600",
                )}>
                    <Icon size={24} />
                </div>
            </div>

            {trend && (
                <div className="mt-4 flex items-center">
                    <span className={cn(
                        "flex items-center text-xs font-semibold px-2 py-0.5 rounded-full mr-2",
                        trend === 'up' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    )}>
                        {trend === 'up' ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                        {trendValue}
                    </span>
                    <span className="text-xs text-gray-400">vs last month</span>
                </div>
            )}

            {/* Decorative background circle */}
            <div className={cn(
                "absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-10",
                color === "blue" && "bg-blue-400",
                color === "indigo" && "bg-indigo-400",
                color === "emerald" && "bg-emerald-400",
                color === "purple" && "bg-purple-400",
                color === "rose" && "bg-rose-400",
                color === "amber" && "bg-amber-400",
            )} />
        </motion.div>
    );
};

export default StatsCard;
