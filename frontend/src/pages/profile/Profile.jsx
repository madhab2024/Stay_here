import { useState } from 'react';
import { useAuth } from '../../auth/useAuth';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Profile = () => {
    const { user, updateUser, token } = useAuth();
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const ProfileSchema = Yup.object().shape({
        name: Yup.string().required('Name is required').min(2, 'Name too short'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        phone: Yup.string()
            .matches(/^[0-9+\-\s()]*$/, "Invalid phone number format")
            .min(10, 'Must be at least 10 digits'),
        address: Yup.string()
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await fetch('http://localhost:5000/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: values.name,
                    phone: values.phone,
                    address: values.address
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || 'Failed to update profile');
            }

            updateUser(data.user);
            setSuccessMessage('Profile updated successfully!');
        } catch (error) {
            console.error('Profile update error:', error);
            setErrorMessage(error.message || 'Failed to update profile');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Personal Information</h1>
                <p className="text-gray-500 mt-1">Manage your personal details and contact info.</p>
            </div>

            {successMessage && (
                <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-100 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {successMessage}
                </div>
            )}

            {errorMessage && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errorMessage}
                </div>
            )}

            <Formik
                initialValues={{
                    name: user?.name || '',
                    email: user?.email || '',
                    phone: user?.phone || '',
                    address: user?.address || ''
                }}
                enableReinitialize
                validationSchema={ProfileSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, errors, touched, getFieldProps }) => (
                    <Form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    {...getFieldProps('name')}
                                    className={errors.name && touched.name ? "border-red-500" : ""}
                                />
                                <ErrorMessage name="name" component="div" className="text-red-500 text-xs" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    {...getFieldProps('email')}
                                    disabled
                                    className="bg-gray-50 text-gray-500 cursor-not-allowed"
                                />
                                <p className="text-xs text-muted-foreground">Email cannot be changed. Contact support.</p>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    placeholder="+1 (555) 000-0000"
                                    {...getFieldProps('phone')}
                                    className={errors.phone && touched.phone ? "border-red-500" : ""}
                                />
                                <ErrorMessage name="phone" component="div" className="text-red-500 text-xs" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    placeholder="e.g. 123 Main St"
                                    {...getFieldProps('address')}
                                    className={errors.address && touched.address ? "border-red-500" : ""}
                                />
                                <ErrorMessage name="address" component="div" className="text-red-500 text-xs" />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Profile;
