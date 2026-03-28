import { useEffect, useState } from 'react';
import { getHostStatus } from '../api/authApi';
import { Badge } from './ui/badge';
import { Loader2, Clock, CheckCircle2, XCircle } from 'lucide-react';

const HostStatusBadge = () => {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await getHostStatus();
                if (response.success && response.data.hasApplication) {
                    setStatus(response.data.status);
                }
            } catch (error) {
                console.error('Failed to fetch host status:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();
    }, []);

    if (loading) {
        return (
            <Badge variant="secondary" className="gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                Loading...
            </Badge>
        );
    }

    if (!status) {
        return null;
    }

    const statusConfig = {
        pending: {
            icon: Clock,
            label: 'Host Application Pending',
            variant: 'secondary',
            className: 'bg-yellow-100 text-yellow-800 border-yellow-300'
        },
        approved: {
            icon: CheckCircle2,
            label: 'Verified Host',
            variant: 'default',
            className: 'bg-green-100 text-green-800 border-green-300'
        },
        rejected: {
            icon: XCircle,
            label: 'Application Rejected',
            variant: 'destructive',
            className: 'bg-red-100 text-red-800 border-red-300'
        }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
        <Badge variant={config.variant} className={`gap-1.5 ${config.className}`}>
            <Icon className="h-3.5 w-3.5" />
            {config.label}
        </Badge>
    );
};

export default HostStatusBadge;
