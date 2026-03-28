import { useState, useEffect } from 'react';
import { fetchHostApplications, approveHostApplication, rejectHostApplication } from '../../api/adminApi';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { Clock, CheckCircle2, XCircle, Eye, Loader2, User, MapPin, CreditCard, FileText, ArrowLeft } from 'lucide-react';

const HostApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [selectedApp, setSelectedApp] = useState(null);
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [viewingApp, setViewingApp] = useState(null);

    useEffect(() => {
        loadApplications();
    }, [filter]);

    const loadApplications = async () => {
        try {
            setLoading(true);
            setError(null);
            const statusParam = filter === 'all' ? null : filter;
            const response = await fetchHostApplications(statusParam);
            console.log('Host applications response:', response);
            setApplications(response.data.data);
        } catch (error) {
            console.error('Failed to load applications:', error);
            setError(error.response?.data?.message || error.message || 'Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        if (!confirm('Are you sure you want to approve this application?')) return;

        try {
            setProcessing(true);
            await approveHostApplication(id);
            alert('Application approved successfully!');
            loadApplications();
        } catch (error) {
            console.error('Failed to approve application:', error);
            alert('Failed to approve application');
        } finally {
            setProcessing(false);
        }
    };

    const handleRejectClick = (app) => {
        setSelectedApp(app);
        setShowRejectDialog(true);
    };

    const handleRejectSubmit = async () => {
        if (!rejectionReason.trim()) {
            alert('Please provide a reason for rejection');
            return;
        }

        try {
            setProcessing(true);
            await rejectHostApplication(selectedApp._id, rejectionReason);
            alert('Application rejected');
            setShowRejectDialog(false);
            setRejectionReason('');
            setSelectedApp(null);
            loadApplications();
        } catch (error) {
            console.error('Failed to reject application:', error);
            alert('Failed to reject application');
        } finally {
            setProcessing(false);
        }
    };

    const getStatusBadge = (status) => {
        const config = {
            pending: { label: 'Pending', icon: Clock, className: 'bg-yellow-100 text-yellow-800' },
            approved: { label: 'Approved', icon: CheckCircle2, className: 'bg-green-100 text-green-800' },
            rejected: { label: 'Rejected', icon: XCircle, className: 'bg-red-100 text-red-800' }
        };

        const { label, icon: Icon, className } = config[status];
        return (
            <Badge className={`gap-1 ${className}`}>
                <Icon className="h-3 w-3" />
                {label}
            </Badge>
        );
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="space-y-6">
            {!viewingApp ? (
                <>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Host Applications</h1>
                        <p className="text-gray-600 mt-2">Review and manage host applications</p>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-2 border-b">
                        {['all', 'pending', 'approved', 'rejected'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab)}
                                className={`px-4 py-2 font-medium capitalize transition-colors ${filter === tab
                                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Applications Table */}
                    <Card className="overflow-hidden">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                            </div>
                        ) : error ? (
                            <div className="text-center py-12">
                                <p className="text-red-600 mb-2">Error: {error}</p>
                                <Button onClick={loadApplications} variant="outline">
                                    Retry
                                </Button>
                            </div>
                        ) : applications.length === 0 ? (
                            <div className="text-center py-12">
                                <Clock className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                                <p className="text-gray-600 font-medium mb-1">
                                    {filter === 'all' ? 'No applications found' : `No ${filter} applications`}
                                </p>
                                <p className="text-gray-500 text-sm">
                                    Applications will appear here when users submit them
                                </p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Applicant</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead>Submitted</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {applications.map((app) => (
                                        <TableRow key={app._id}>
                                            <TableCell className="font-medium">
                                                {app.fullName}
                                            </TableCell>
                                            <TableCell>{app.email}</TableCell>
                                            <TableCell>{app.phone}</TableCell>
                                            <TableCell>{formatDate(app.createdAt)}</TableCell>
                                            <TableCell>{getStatusBadge(app.status)}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setViewingApp(app)}
                                                        className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                                                    >
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        View Details
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </Card>
                </>
            ) : (
                <div className="space-y-6">
                    {/* Detail View Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                onClick={() => setViewingApp(null)}
                                className="gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to List
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Application Details</h1>
                                <p className="text-gray-500">Submitted on {formatDate(viewingApp.createdAt)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {getStatusBadge(viewingApp.status)}
                            {viewingApp.status === 'pending' && (
                                <>
                                    <Button
                                        variant="destructive"
                                        onClick={() => handleRejectClick(viewingApp)}
                                        disabled={processing}
                                    >
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Reject
                                    </Button>
                                    <Button
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        onClick={() => handleApprove(viewingApp._id)}
                                        disabled={processing}
                                    >
                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                        Approve
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Detail Content */}
                    <div className="bg-white rounded-lg shadow-sm border p-6 space-y-8">
                        {/* Personal Information */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center border-b pb-2">
                                <User className="w-5 h-5 mr-2 text-indigo-600" />
                                Personal Information
                            </h3>
                            <div className="grid md:grid-cols-4 gap-6">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Full Name</p>
                                    <p className="mt-1 text-gray-900">{viewingApp.fullName}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                                    <p className="mt-1 text-gray-900">{formatDate(viewingApp.dateOfBirth)}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Email</p>
                                    <p className="mt-1 text-gray-900">{viewingApp.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Phone</p>
                                    <p className="mt-1 text-gray-900">{viewingApp.phone}</p>
                                </div>
                            </div>
                        </div>

                        {/* Address Information */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center border-b pb-2">
                                <MapPin className="w-5 h-5 mr-2 text-indigo-600" />
                                Address Details
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="col-span-2 md:col-span-1">
                                    <p className="text-sm font-medium text-gray-500">Address</p>
                                    <p className="mt-1 text-gray-900">{viewingApp.address}</p>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">City</p>
                                        <p className="mt-1 text-gray-900">{viewingApp.city}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">State</p>
                                        <p className="mt-1 text-gray-900">{viewingApp.state}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">PIN Code</p>
                                        <p className="mt-1 text-gray-900">{viewingApp.pinCode}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Information */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center border-b pb-2">
                                <CreditCard className="w-5 h-5 mr-2 text-indigo-600" />
                                Payment & Tax Details
                            </h3>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Account Holder</p>
                                    <p className="mt-1 text-gray-900">{viewingApp.accountHolderName}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Account Number</p>
                                    <p className="mt-1 text-gray-900">{viewingApp.accountNumber}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Bank Name</p>
                                    <p className="mt-1 text-gray-900">{viewingApp.bankName}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">IFSC Code</p>
                                    <p className="mt-1 text-gray-900">{viewingApp.ifscCode}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">PAN Number</p>
                                    <p className="mt-1 text-gray-900">{viewingApp.panNumber}</p>
                                </div>
                                {viewingApp.upiId && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">UPI ID</p>
                                        <p className="mt-1 text-gray-900">{viewingApp.upiId}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Documents */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center border-b pb-2">
                                <FileText className="w-5 h-5 mr-2 text-indigo-600" />
                                Uploaded Documents
                            </h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[{ label: 'Profile Photo', src: viewingApp.profilePhoto },
                                { label: 'ID Front', src: viewingApp.idFrontImage },
                                { label: 'ID Back', src: viewingApp.idBackImage },
                                { label: 'Selfie with ID', src: viewingApp.selfieWithId }].map((doc, index) => (
                                    doc.src && (
                                        <div key={index} className="space-y-2">
                                            <p className="text-sm font-medium text-gray-700">{doc.label}</p>
                                            <div className="border rounded-lg overflow-hidden bg-gray-50 h-48 flex items-center justify-center group relative">
                                                <img
                                                    src={doc.src}
                                                    alt={doc.label}
                                                    className="max-h-full max-w-full object-contain"
                                                />
                                                <a
                                                    href={doc.src}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white font-medium"
                                                >
                                                    View Full Size
                                                </a>
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Rejection Dialog */}
            <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Application</DialogTitle>
                        <DialogDescription>
                            Please provide a reason for rejecting this application.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Textarea
                            placeholder="Enter rejection reason..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            rows={4}
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowRejectDialog(false);
                                setRejectionReason('');
                            }}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleRejectSubmit}
                            disabled={processing || !rejectionReason.trim()}
                        >
                            {processing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Reject Application
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default HostApplications;
