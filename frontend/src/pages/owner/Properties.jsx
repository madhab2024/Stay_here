import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchOwnerProperties } from '../../api/propertyApi';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Building2, MapPin, FileText } from 'lucide-react';

const PropertySchema = Yup.object().shape({
    name: Yup.string().required('Property Name is required').min(5, 'Too short'),
    location: Yup.string().required('Location is required'),
    description: Yup.string().required('Description is required').min(20, 'Please provide more details'),
});

const Properties = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [error, setError] = useState(null);

    // Fetch Owner Properties on Mount
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

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        setError(null);

        try {
            await import('../../api/propertyApi').then(module =>
                module.createProperty({
                    ...values,
                    amenities: [],
                    rules: [],
                    policies: { checkInTime: '14:00', checkOutTime: '11:00' }
                })
            );

            // On success
            await loadProps();
            setShowAddForm(false);
            resetForm();
        } catch (err) {
            setError(err.response?.data?.error || "Failed to create property");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-6">Loading properties...</div>;

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-8 text-white">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Your Properties</h1>
                        <p className="text-indigo-100">Manage your listings and availability</p>
                    </div>
                    <Button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className={`${showAddForm
                            ? 'bg-white text-indigo-600 hover:bg-gray-100'
                            : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                            } transition-all duration-300 shadow-lg`}
                        size="lg"
                    >
                        {showAddForm ? (
                            <>
                                <X className="mr-2 h-5 w-5" />
                                Cancel
                            </>
                        ) : (
                            <>
                                <Plus className="mr-2 h-5 w-5" />
                                Add Property
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Add Property Form - Inline */}
            {showAddForm && (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 animate-in slide-in-from-top duration-300">
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-8 py-6 border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                            <Building2 className="mr-3 h-6 w-6 text-indigo-600" />
                            Add New Property
                        </h2>
                        <p className="text-gray-600 mt-1 ml-9">Fill in the details below to list your property</p>
                    </div>

                    <div className="p-8">
                        {error && (
                            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
                                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        <Formik
                            initialValues={{ name: '', location: '', description: '' }}
                            validationSchema={PropertySchema}
                            onSubmit={handleSubmit}
                        >
                            {({ isSubmitting, errors, touched, getFieldProps }) => (
                                <Form className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {/* Property Name */}
                                        <div className="space-y-2">
                                            <Label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center">
                                                <Building2 className="mr-2 h-4 w-4 text-indigo-600" />
                                                Property Name
                                            </Label>
                                            <Input
                                                id="name"
                                                placeholder="e.g. Oceanview Loft"
                                                {...getFieldProps('name')}
                                                className={`transition-all duration-200 ${errors.name && touched.name
                                                        ? "border-red-500 focus:ring-red-500"
                                                        : "focus:ring-indigo-500 focus:border-indigo-500"
                                                    }`}
                                            />
                                            <ErrorMessage
                                                name="name"
                                                component="div"
                                                className="text-red-500 text-xs font-medium flex items-center mt-1"
                                            />
                                        </div>

                                        {/* Location */}
                                        <div className="space-y-2">
                                            <Label htmlFor="location" className="text-sm font-semibold text-gray-700 flex items-center">
                                                <MapPin className="mr-2 h-4 w-4 text-indigo-600" />
                                                Location
                                            </Label>
                                            <Input
                                                id="location"
                                                placeholder="e.g. San Francisco, CA"
                                                {...getFieldProps('location')}
                                                className={`transition-all duration-200 ${errors.location && touched.location
                                                        ? "border-red-500 focus:ring-red-500"
                                                        : "focus:ring-indigo-500 focus:border-indigo-500"
                                                    }`}
                                            />
                                            <ErrorMessage
                                                name="location"
                                                component="div"
                                                className="text-red-500 text-xs font-medium flex items-center mt-1"
                                            />
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-2">
                                        <Label htmlFor="description" className="text-sm font-semibold text-gray-700 flex items-center">
                                            <FileText className="mr-2 h-4 w-4 text-indigo-600" />
                                            Description
                                        </Label>
                                        <Textarea
                                            id="description"
                                            placeholder="Provide a detailed description of your property, including unique features, nearby attractions, and what makes it special..."
                                            rows={5}
                                            {...getFieldProps('description')}
                                            className={`transition-all duration-200 resize-none ${errors.description && touched.description
                                                    ? "border-red-500 focus:ring-red-500"
                                                    : "focus:ring-indigo-500 focus:border-indigo-500"
                                                }`}
                                        />
                                        <ErrorMessage
                                            name="description"
                                            component="div"
                                            className="text-red-500 text-xs font-medium flex items-center mt-1"
                                        />
                                    </div>

                                    {/* Form Actions */}
                                    <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setShowAddForm(false)}
                                            className="px-6"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 shadow-lg"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Saving...
                                                </>
                                            ) : (
                                                'Save Property'
                                            )}
                                        </Button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            )}

            {/* Properties List */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                {properties.length === 0 ? (
                    <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-indigo-50">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
                            <Building2 className="h-8 w-8 text-indigo-600" />
                        </div>
                        <p className="text-gray-600 text-lg font-medium">No properties found</p>
                        <p className="text-gray-500 text-sm mt-1">Add your first property to get started!</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead className="w-[300px] font-semibold text-gray-700">Name</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Location</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Status</TableHead>
                                    <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {properties.map((property) => (
                                    <TableRow key={property._id || property.id} className="hover:bg-gray-50 transition-colors">
                                        <TableCell className="font-medium text-gray-900">{property.name}</TableCell>
                                        <TableCell className="text-gray-600">{property.location}</TableCell>
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
                                                <Button variant="link" size="sm" className="h-8 px-2 text-indigo-600 hover:text-indigo-700">
                                                    Manage Rooms
                                                </Button>
                                            </Link>
                                            <span className="text-gray-300">|</span>
                                            <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-600 hover:text-gray-900">
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
        </div>
    );
};

export default Properties;
