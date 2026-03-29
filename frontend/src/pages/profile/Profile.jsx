import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Saved from '../customer/Saved';
import Trips from '../customer/Trips';
import { useAuth } from '../../auth/useAuth';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from '../../services/api';
import { User, Mail, Phone, MapPin, Shield, Users, Trash2, Heart, Briefcase, Tag, CreditCard, Lock, ChevronRight } from 'lucide-react';

const Profile = () => {
    const { user, updateUser, role } = useAuth();
    const navigate = useNavigate();
    const { tab } = useParams();
    const activeTab = tab || 'user';
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [savedGuests, setSavedGuests] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem('saved_guests_info');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) setSavedGuests(parsed);
            } catch(e) {}
        }
    }, []);

    const handleDeleteSavedGuest = (index) => {
        const updated = savedGuests.filter((_, i) => i !== index);
        setSavedGuests(updated);
        localStorage.setItem('saved_guests_info', JSON.stringify(updated));
    };

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
            const response = await api.put('/auth/profile', {
                name: values.name,
                phone: values.phone,
                address: values.address
            });

            const data = response.data;

            updateUser(data.user);
            setSuccessMessage('Profile updated successfully!');

            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Profile update error:', error);
            setErrorMessage(error.response?.data?.message || error.message || 'Failed to update profile');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-8 max-w-[1400px] mx-auto w-full px-4 lg:px-8 pt-4 md:pt-6">
            {/* Minimalist Profile Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
                <div className="flex flex-col sm:flex-row items-center text-center sm:text-left sm:space-x-6 space-y-4 sm:space-y-0">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-3xl font-black text-gray-800 border-4 border-white shadow-sm ring-1 ring-gray-100 shrink-0">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-1 truncate">{user?.name || 'User'}</h1>
                        <p className="text-gray-500 flex items-center justify-center sm:justify-start font-medium text-sm md:text-base">
                            <Mail className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
                            <span className="truncate">{user?.email}</span>
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-3 bg-gray-50 px-5 py-2.5 rounded-xl border border-gray-100 shadow-sm shrink-0">
                    <Shield className="w-5 h-5 text-teal-600" />
                    <span className="font-bold text-gray-800 uppercase tracking-widest text-xs">{role}</span>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 relative">
                {/* Sidebar Navigation (Desktop only) */}
                <div className="hidden lg:block lg:w-72 shrink-0">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-3 relative lg:sticky lg:top-28 space-y-1">
                        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-3 pt-2">Account Management</h3>
                        
                        <button 
                            onClick={() => navigate('/customer/profile')}
                            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all ${activeTab === 'user' ? 'bg-[#FF405A] text-white shadow-md' : 'text-gray-700 hover:bg-gray-50 font-medium'}`}
                        >
                            <div className="flex items-center gap-3 font-semibold"><User size={20}/> Profile Info</div>
                            {activeTab === 'user' && <ChevronRight size={18}/>}
                        </button>
                        
                        <button 
                            onClick={() => navigate('/customer/profile/saved')}
                            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all ${activeTab === 'saved' ? 'bg-[#FF405A] text-white shadow-md' : 'text-gray-700 hover:bg-gray-50 font-medium'}`}
                        >
                            <div className="flex items-center gap-3 font-semibold"><Heart size={20}/> Saved Properties</div>
                            {activeTab === 'saved' && <ChevronRight size={18}/>}
                        </button>

                        <button 
                            onClick={() => navigate('/customer/profile/bookings')}
                            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all ${activeTab === 'bookings' ? 'bg-[#FF405A] text-white shadow-md' : 'text-gray-700 hover:bg-gray-50 font-medium'}`}
                        >
                            <div className="flex items-center gap-3 font-semibold"><Briefcase size={20}/> My Bookings</div>
                            {activeTab === 'bookings' && <ChevronRight size={18}/>}
                        </button>

                        <button 
                            onClick={() => navigate('/customer')}
                            className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all text-gray-700 hover:bg-gray-50 font-medium"
                        >
                            <div className="flex items-center gap-3 font-semibold"><Tag size={20}/> Special Deals</div>
                        </button>

                        <button 
                            onClick={() => navigate('/customer/profile/payments')}
                            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all ${activeTab === 'payments' ? 'bg-[#FF405A] text-white shadow-md' : 'text-gray-700 hover:bg-gray-50 font-medium'}`}
                        >
                            <div className="flex items-center gap-3 font-semibold"><CreditCard size={20}/> Payments</div>
                            {activeTab === 'payments' && <ChevronRight size={18}/>}
                        </button>

                        <button 
                            onClick={() => navigate('/customer/profile/security')}
                            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all ${activeTab === 'security' ? 'bg-[#FF405A] text-white shadow-md' : 'text-gray-700 hover:bg-gray-50 font-medium'}`}
                        >
                            <div className="flex items-center gap-3 font-semibold"><Lock size={20}/> Security</div>
                            {activeTab === 'security' && <ChevronRight size={18}/>}
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 min-w-0 pb-28 lg:pb-20">
                    {activeTab === 'user' && (
                        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
                            {/* Profile Form */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                <div className="bg-gray-50 px-5 md:px-8 py-4 md:py-6 border-b border-gray-200">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center">
                        <User className="mr-3 h-5 w-5 md:h-6 md:w-6 text-[#FF405A]" />
                        Personal Information
                    </h2>
                    <p className="text-sm md:text-base text-gray-600 mt-1 ml-8 md:ml-9">Manage your personal details and contact information</p>
                </div>

                <div className="p-5 md:p-8">
                    {successMessage && (
                        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start animate-in slide-in-from-top duration-300">
                            <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>{successMessage}</span>
                        </div>
                    )}

                    {errorMessage && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
                            <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span>{errorMessage}</span>
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
                                    {/* Full Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center">
                                            <User className="mr-2 h-4 w-4 text-indigo-600" />
                                            Full Name
                                        </Label>
                                        <Input
                                            id="name"
                                            {...getFieldProps('name')}
                                            className={`transition-all duration-200 ${errors.name && touched.name
                                                    ? "border-red-500 focus:ring-red-500"
                                                    : "focus:ring-indigo-500 focus:border-indigo-500"
                                                }`}
                                        />
                                        <ErrorMessage name="name" component="div" className="text-red-500 text-xs font-medium" />
                                    </div>

                                    {/* Email Address */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center">
                                            <Mail className="mr-2 h-4 w-4 text-indigo-600" />
                                            Email Address
                                        </Label>
                                        <Input
                                            id="email"
                                            {...getFieldProps('email')}
                                            disabled
                                            className="bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200"
                                        />
                                        <p className="text-xs text-gray-500 flex items-center">
                                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                            </svg>
                                            Email cannot be changed. Contact support if needed.
                                        </p>
                                    </div>

                                    {/* Phone Number */}
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 flex items-center">
                                            <Phone className="mr-2 h-4 w-4 text-indigo-600" />
                                            Phone Number
                                        </Label>
                                        <Input
                                            id="phone"
                                            placeholder="+1 (555) 000-0000"
                                            {...getFieldProps('phone')}
                                            className={`transition-all duration-200 ${errors.phone && touched.phone
                                                    ? "border-red-500 focus:ring-red-500"
                                                    : "focus:ring-indigo-500 focus:border-indigo-500"
                                                }`}
                                        />
                                        <ErrorMessage name="phone" component="div" className="text-red-500 text-xs font-medium" />
                                    </div>

                                    {/* Address */}
                                    <div className="space-y-2">
                                        <Label htmlFor="address" className="text-sm font-semibold text-gray-700 flex items-center">
                                            <MapPin className="mr-2 h-4 w-4 text-indigo-600" />
                                            Address
                                        </Label>
                                        <Input
                                            id="address"
                                            placeholder="e.g. 123 Main St, City, State"
                                            {...getFieldProps('address')}
                                            className={`transition-all duration-200 ${errors.address && touched.address
                                                    ? "border-red-500 focus:ring-red-500"
                                                    : "focus:ring-indigo-500 focus:border-indigo-500"
                                                }`}
                                        />
                                        <ErrorMessage name="address" component="div" className="text-red-500 text-xs font-medium" />
                                    </div>
                                </div>

                                {/* Form Actions */}
                                <div className="flex justify-end gap-4 pt-6 mt-4 border-t border-gray-100">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full sm:w-auto bg-[#FF405A] hover:bg-[#e0354d] text-white font-bold py-6 px-10 shadow-md rounded-xl"
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
                                            'Save Changes'
                                        )}
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>

            {/* Saved Guests Section */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 mt-6">
                <div className="bg-gray-50 px-5 md:px-8 py-4 md:py-6 border-b border-gray-200 rounded-t-xl">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center">
                        <Users className="mr-3 h-5 w-5 md:h-6 md:w-6 text-[#FF405A]" />
                        Saved Guests
                    </h2>
                    <p className="text-sm md:text-base text-gray-600 mt-1 ml-8 md:ml-9">Manage guests you've saved for faster booking checkouts</p>
                </div>
                <div className="p-5 md:p-8">
                    {savedGuests.length === 0 ? (
                        <div className="text-center py-6 bg-gray-50 border border-gray-200 border-dashed rounded-xl">
                            <p className="text-gray-500 font-medium">No saved guests yet.</p>
                            <p className="text-sm text-gray-400 mt-1">Book a stay and check "Save for next time" to add guests here.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {savedGuests.map((guest, idx) => (
                                <div key={idx} className="border border-gray-200 rounded-xl p-5 flex justify-between items-start bg-white shadow-sm hover:shadow-md transition-all">
                                    <div className="min-w-0 pr-2">
                                        <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2 mb-2 truncate">{guest.name || 'Unnamed Guest'}</h3>
                                        <p className="text-sm text-gray-600 flex items-center"><Mail className="w-3.5 h-3.5 mr-2 text-gray-400 shrink-0"/> <span className="truncate">{guest.email || 'No email'}</span></p>
                                        <p className="text-sm text-gray-600 flex items-center mt-2"><Phone className="w-3.5 h-3.5 mr-2 text-gray-400"/> {guest.phone || 'No phone'}</p>
                                    </div>
                                    <button 
                                        onClick={() => handleDeleteSavedGuest(idx)}
                                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors ml-2"
                                        title="Remove Guest"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
                        </div>
                    )}

                    {activeTab === 'saved' && (
                        <div className="animate-in fade-in zoom-in-95 duration-200">
                            <Saved />
                        </div>
                    )}

                    {activeTab === 'bookings' && (
                        <div className="animate-in fade-in zoom-in-95 duration-200">
                            <Trips />
                        </div>
                    )}

                    {activeTab === 'payments' && (
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-10 text-center animate-in fade-in zoom-in-95 duration-200">
                            <div className="w-20 h-20 bg-gradient-to-br from-rose-50 to-orange-50 text-[#FF405A] rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                                <CreditCard size={36} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Methods</h2>
                            <p className="text-gray-500 max-w-sm mx-auto">Securely add or remove payment methods for faster, seamless checkout experiences.</p>
                            <button className="mt-8 font-bold text-white bg-[#FF405A] hover:bg-[#e0354d] shadow-md px-8 py-3 rounded-xl transition-all">Add New Card</button>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 animate-in fade-in zoom-in-95 duration-200">
                            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                                <Lock className="text-indigo-600" size={28} /> Security Settings
                            </h2>
                            <div className="space-y-6">
                                <div className="border border-gray-100 rounded-xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50 hover:bg-white transition-colors shadow-sm">
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg">Change Password</h3>
                                        <p className="text-sm text-gray-500 mt-1">Update your password regularly to keep your account highly secure</p>
                                    </div>
                                    <button className="px-6 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition shadow-md shrink-0">Update</button>
                                </div>
                                <div className="border border-gray-100 rounded-xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50 hover:bg-white transition-colors shadow-sm">
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg">Two-Factor Authentication</h3>
                                        <p className="text-sm text-gray-500 mt-1">Add an extra layer of unbreakable security to your Stay Here account</p>
                                    </div>
                                    <button className="px-6 py-2.5 border-2 border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:border-gray-900 hover:text-gray-900 transition shrink-0">Enable 2FA</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
