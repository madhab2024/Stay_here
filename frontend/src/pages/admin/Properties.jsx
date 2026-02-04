import { useState, useEffect } from 'react';
import { fetchAllPropertiesAdmin, approveProperty, rejectProperty } from '../../api/propertyApi';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const AdminProperties = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadProperties = async () => {
        try {
            const res = await fetchAllPropertiesAdmin();
            setProperties(res.data || []);
        } catch (error) {
            console.error("Failed to load admin properties", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProperties();
    }, []);

    const handleApprove = async (id) => {
        try {
            await approveProperty(id);
            await loadProperties(); // Refresh list to see updated status
        } catch (error) {
            console.error("Failed to approve property", error);
            alert("Failed to approve property");
        }
    };

    const handleReject = async (id) => {
        if (!window.confirm("Are you sure you want to reject this property?")) return;
        try {
            await rejectProperty(id);
            await loadProperties();
        } catch (error) {
            console.error("Failed to reject property", error);
            alert("Failed to reject property");
        }
    };

    if (loading) return <div className="p-8">Loading moderation queue...</div>;

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-100">
                <h1 className="text-2xl font-bold text-gray-800">Property Moderation</h1>
                <p className="text-sm text-gray-500 mt-1">Review and approve/reject property submissions.</p>
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Property</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {properties.map((property) => (
                            <TableRow key={property._id || property.id}>
                                <TableCell className="font-medium text-gray-900">{property.name}</TableCell>
                                <TableCell className="text-gray-500">{property.location}</TableCell>
                                <TableCell>
                                    <Badge variant={
                                        property.status === 'approved' ? 'success' :
                                            property.status === 'rejected' ? 'destructive' : 'warning'
                                    }>
                                        {property.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    {property.status === 'pending' && (
                                        <>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleApprove(property._id || property.id)}
                                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleReject(property._id || property.id)}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                Reject
                                            </Button>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default AdminProperties;
