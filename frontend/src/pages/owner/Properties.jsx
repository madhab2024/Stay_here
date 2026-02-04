import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchOwnerProperties } from '../../api/propertyApi'; // Import direct API call
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const PropertySchema = Yup.object().shape({
    name: Yup.string().required('Property Name is required').min(5, 'Too short'),
    location: Yup.string().required('Location is required'),
    description: Yup.string().required('Description is required').min(20, 'Please provide more details'),
});

const Properties = () => {
    // Local state for properties instead of context (which is for public view)
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState(null);

    // Fetch Owner Properties on Mount (Extracted for reuse)
    const loadProps = async () => {
        try {
            const res = await fetchOwnerProperties();
            setProperties(res.data || []);
        } catch (err) {
            console.error("Error fetching properties", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProps();
    }, []);

    const handleSubmit = async (values, { setSubmitting }) => {
        setError(null);

        try {
            await import('../../api/propertyApi').then(module =>
                module.createProperty({
                    ...values,
                    // Default values for required/optional fields backend expects if UI doesn't have them
                    amenities: [],
                    rules: [],
                    policies: { checkInTime: '14:00', checkOutTime: '11:00' }
                })
            );

            // On success
            await loadProps();
            setIsModalOpen(false);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to create property");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-6">Loading properties...</div>;

    return (
        <div className="bg-white rounded-lg shadow min-h-[500px]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800">Your Properties</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your listings and availability.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                    Add Property
                </button>
            </div>

            <div className="p-6">
                {properties.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                        <p className="text-gray-500">No properties found. Add your first one!</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[300px]">Name</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {properties.map((property) => (
                                    <TableRow key={property._id || property.id}>
                                        <TableCell className="font-medium">{property.name}</TableCell>
                                        <TableCell className="text-muted-foreground">{property.location}</TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                property.status === 'approved' ? 'success' :
                                                    property.status === 'rejected' ? 'destructive' : 'warning'
                                            }>
                                                {property.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Link
                                                to={`/owner/properties/${property._id || property.id}/rooms`}
                                            >
                                                <Button variant="link" size="sm" className="h-8 px-2">
                                                    Manage Rooms
                                                </Button>
                                            </Link>
                                            <span className="text-gray-300">|</span>
                                            <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-500">
                                                Edit
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>

            {/* Add Property Modal with shadcn/ui */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Add New Property</DialogTitle>
                    </DialogHeader>

                    {error && <div className="mb-4 text-red-600 text-sm bg-red-50 p-2 rounded">{error}</div>}

                    <Formik
                        initialValues={{ name: '', location: '', description: '' }}
                        validationSchema={PropertySchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting, errors, touched, getFieldProps }) => (
                            <Form className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Property Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g. Oceanview Loft"
                                        {...getFieldProps('name')}
                                        className={errors.name && touched.name ? "border-red-500" : ""}
                                    />
                                    <ErrorMessage name="name" component="div" className="text-red-500 text-xs" />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                        id="location"
                                        placeholder="e.g. San Francisco, CA"
                                        {...getFieldProps('location')}
                                        className={errors.location && touched.location ? "border-red-500" : ""}
                                    />
                                    <ErrorMessage name="location" component="div" className="text-red-500 text-xs" />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Brief description..."
                                        rows={3}
                                        {...getFieldProps('description')}
                                        className={errors.description && touched.description ? "border-red-500" : ""}
                                    />
                                    <ErrorMessage name="description" component="div" className="text-red-500 text-xs" />
                                </div>

                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? 'Saving...' : 'Save Property'}
                                    </Button>
                                </DialogFooter>
                            </Form>
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Properties;
