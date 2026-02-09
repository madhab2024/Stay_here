import { motion } from 'framer-motion';

const PageTransition = ({ children, className, initialX = 20, exitX = -20 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: initialX, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: exitX, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }} // Smooth custom bezier
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;
