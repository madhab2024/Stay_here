import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import api from '../../services/api';
import DatePicker from '../../components/DatePicker';
import {
    User, Calendar, Phone, Mail, Camera, CreditCard,
    Building2, MapPin, FileText, CheckCircle, Upload,
    ArrowRight, ArrowLeft, Shield, Home, Loader2
} from 'lucide-react';

// Validation schemas for each step
const Step1Schema = Yup.object().shape({
    fullName: Yup.string().required('Full legal name is required').min(3, 'Name too short'),
    dateOfBirth: Yup.date()
        .required('Date of birth is required')
        .max(new Date(), 'Invalid date')
        .test('age', 'You must be at least 18 years old', function (value) {
            if (!value) return false;
            const today = new Date();
            const birthDate = new Date(value);
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            const dayDiff = today.getDate() - birthDate.getDate();
            const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
            return actualAge >= 18;
        }),
    phone: Yup.string().required('Phone number is required').matches(/^[0-9]{10}$/, 'Must be 10 digits'),
    email: Yup.string().email('Invalid email').required('Email is required'),
});

const Step2Schema = Yup.object().shape({
    idType: Yup.string().required('ID type is required'),
    idNumber: Yup.string().required('ID number is required').min(6, 'Invalid ID number'),
});

const Step3Schema = Yup.object().shape({
    accountHolderName: Yup.string().required('Account holder name is required'),
    accountNumber: Yup.string().required('Account number is required').matches(/^[0-9]{9,18}$/, 'Invalid account number'),
    ifscCode: Yup.string().required('IFSC code is required').matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code'),
    bankName: Yup.string().required('Bank name is required'),
    panNumber: Yup.string().required('PAN is required').matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format'),
});

const Step4Schema = Yup.object().shape({
    address: Yup.string().required('Address is required').min(10, 'Please provide complete address'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    pinCode: Yup.string().required('PIN code is required').matches(/^[0-9]{6}$/, 'Must be 6 digits'),
});

const Step5Schema = Yup.object().shape({
    acceptTerms: Yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
    acceptPolicies: Yup.boolean().oneOf([true], 'You must accept the hosting policies'),
});

const BecomeHost = () => {
    const { user, upgradeToOwner } = useAuth();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [appStatus, setAppStatus] = useState(null);
    const [isLoadingStatus, setIsLoadingStatus] = useState(true);
    const [formData, setFormData] = useState({
        // Step 1: Basic Identity
        fullName: user?.name || '',
        dateOfBirth: '',
        phone: user?.phone || '',
        email: user?.email || '',
        profilePhoto: null,

        // Step 2: Government ID
        idType: '',
        idNumber: '',
        idFrontImage: null,
        idBackImage: null,
        selfieWithId: null,

        // Step 3: Payment & Tax
        accountHolderName: '',
        accountNumber: '',
        ifscCode: '',
        bankName: '',
        upiId: '',
        panNumber: '',

        // Step 4: Address
        address: '',
        city: '',
        state: '',
        pinCode: '',

        // Step 5: Legal Agreement
        acceptTerms: false,
        acceptPolicies: false,
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        // If already an owner, redirect to dashboard
        if (user?.roles?.includes('owner')) {
            navigate('/owner/dashboard');
            return;
        }

        const checkStatus = async () => {
            try {
                const response = await api.get('/auth/host-status');
                if (response.data.success && response.data.data.hasApplication) {
                    setAppStatus(response.data.data.status);
                }
            } catch (err) {
                console.error('Error checking host status:', err);
            } finally {
                setIsLoadingStatus(false);
            }
        };

        checkStatus();
    }, []);

    const totalSteps = 5;

    const getStepSchema = (step) => {
        switch (step) {
            case 1: return Step1Schema;
            case 2: return Step2Schema;
            case 3: return Step3Schema;
            case 4: return Step4Schema;
            case 5: return Step5Schema;
            default: return Yup.object();
        }
    };

    const handleFileChange = (e, fieldName) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, [fieldName]: file }));

            // Create preview URL if it's the profile photo
            if (fieldName === 'profilePhoto') {
                const objectUrl = URL.createObjectURL(file);
                setPreviewUrl(objectUrl);
            }
        }
    };



    const handleNext = async (values) => {
        setFormData(prev => ({ ...prev, ...values }));
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleFinalSubmit = async (values) => {
        setIsSubmitting(true);
        setError('');

        const finalData = { ...formData, ...values };

        try {
            // Create FormData for file uploads
            const submitData = new FormData();

            // Append all text fields
            Object.keys(finalData).forEach(key => {
                if (finalData[key] && typeof finalData[key] !== 'object') {
                    submitData.append(key, finalData[key]);
                }
            });

            // Append files
            if (finalData.profilePhoto) submitData.append('profilePhoto', finalData.profilePhoto);
            if (finalData.idFrontImage) submitData.append('idFrontImage', finalData.idFrontImage);
            if (finalData.idBackImage) submitData.append('idBackImage', finalData.idBackImage);
            if (finalData.selfieWithId) submitData.append('selfieWithId', finalData.selfieWithId);

            // Submit to backend
            const response = await api.post('/auth/become-host', submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Don't upgrade user role - wait for admin approval
            // Show success message and redirect to home
            alert(response.data.message || 'Application submitted successfully! Please wait for admin approval.');

            // Redirect to home page
            navigate('/customer/home');
        } catch (err) {
            console.error('Host registration error:', err);
            setError(err.response?.data?.message || 'Failed to complete host registration');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStepContent = (values, errors, touched, setFieldValue) => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
                                <User className="h-8 w-8 text-indigo-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Basic Identity Information</h2>
                            <p className="text-gray-600 mt-2">Let's start with your basic details</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="fullName" className="flex items-center font-semibold">
                                    <User className="mr-2 h-4 w-4 text-indigo-600" />
                                    Full Legal Name *
                                </Label>
                                <Input
                                    id="fullName"
                                    name="fullName"
                                    placeholder="As per government ID"
                                    value={values.fullName}
                                    onChange={(e) => setFieldValue('fullName', e.target.value)}
                                    className={errors.fullName && touched.fullName ? "border-red-500" : ""}
                                />
                                <ErrorMessage name="fullName" component="div" className="text-red-500 text-xs" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dateOfBirth" className="flex items-center font-semibold">
                                    <Calendar className="mr-2 h-4 w-4 text-indigo-600" />
                                    Date of Birth *
                                </Label>
                                <DatePicker
                                    value={values.dateOfBirth}
                                    onChange={(date) => setFieldValue('dateOfBirth', date)}
                                    error={errors.dateOfBirth && touched.dateOfBirth}
                                />
                                <ErrorMessage name="dateOfBirth" component="div" className="text-red-500 text-xs" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone" className="flex items-center font-semibold">
                                    <Phone className="mr-2 h-4 w-4 text-indigo-600" />
                                    Phone Number *
                                </Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    placeholder="10 digit mobile number"
                                    value={values.phone}
                                    onChange={(e) => setFieldValue('phone', e.target.value)}
                                    className={errors.phone && touched.phone ? "border-red-500" : ""}
                                />
                                <ErrorMessage name="phone" component="div" className="text-red-500 text-xs" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="flex items-center font-semibold">
                                    <Mail className="mr-2 h-4 w-4 text-indigo-600" />
                                    Email Address *
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={values.email}
                                    disabled
                                    className="bg-gray-50 cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Label htmlFor="profilePhoto" className="flex items-center font-semibold">
                                <Camera className="mr-2 h-4 w-4 text-indigo-600" />
                                Profile Photo
                            </Label>

                            <div className="flex flex-col md:flex-row items-center gap-6">
                                {/* Preview Circle */}
                                <div className="relative group">
                                    <div className={`w-32 h-32 rounded-full flex items-center justify-center overflow-hidden border-4 ${previewUrl ? 'border-indigo-100 shadow-md' : 'border-gray-100 bg-gray-50'}`}>
                                        {previewUrl ? (
                                            <img
                                                src={previewUrl}
                                                alt="Profile Preview"
                                                className="w-full h-full object-cover animate-in fade-in zoom-in duration-300"
                                            />
                                        ) : (
                                            <User className="w-12 h-12 text-gray-300" />
                                        )}
                                    </div>
                                </div>

                                <div className="flex-1 w-full">
                                    <div className="flex items-center gap-4">
                                        <Input
                                            id="profilePhoto"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, 'profilePhoto')}
                                            className="flex-1"
                                        />
                                        {previewUrl && (
                                            <span className="text-sm text-green-600 flex items-center font-medium whitespace-nowrap">
                                                <CheckCircle className="h-4 w-4 mr-1" />
                                                Looking good!
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Upload a clear photo where your face is visible. Max size 5MB.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
                                <Shield className="h-8 w-8 text-indigo-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Government ID Verification</h2>
                            <p className="text-gray-600 mt-2">This helps prevent fake listings and builds trust</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="idType" className="flex items-center font-semibold">
                                    <FileText className="mr-2 h-4 w-4 text-indigo-600" />
                                    ID Type *
                                </Label>
                                <select
                                    id="idType"
                                    name="idType"
                                    value={values.idType}
                                    onChange={(e) => setFieldValue('idType', e.target.value)}
                                    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ${errors.idType && touched.idType ? "border-red-500" : ""}`}
                                >
                                    <option value="">Select ID Type</option>
                                    <option value="aadhaar">Aadhaar Card</option>
                                    <option value="pan">PAN Card</option>
                                    <option value="passport">Passport</option>
                                    <option value="driving_license">Driving License</option>
                                </select>
                                <ErrorMessage name="idType" component="div" className="text-red-500 text-xs" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="idNumber" className="flex items-center font-semibold">
                                    <FileText className="mr-2 h-4 w-4 text-indigo-600" />
                                    ID Number *
                                </Label>
                                <Input
                                    id="idNumber"
                                    name="idNumber"
                                    placeholder="Enter ID number"
                                    value={values.idNumber}
                                    onChange={(e) => setFieldValue('idNumber', e.target.value)}
                                    className={errors.idNumber && touched.idNumber ? "border-red-500" : ""}
                                />
                                <ErrorMessage name="idNumber" component="div" className="text-red-500 text-xs" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="flex items-center font-semibold">
                                    <Upload className="mr-2 h-4 w-4 text-indigo-600" />
                                    Upload ID (Front) *
                                </Label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, 'idFrontImage')}
                                />
                                {formData.idFrontImage && (
                                    <span className="text-sm text-green-600 flex items-center">
                                        <CheckCircle className="h-4 w-4 mr-1" />
                                        {formData.idFrontImage.name}
                                    </span>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="flex items-center font-semibold">
                                    <Upload className="mr-2 h-4 w-4 text-indigo-600" />
                                    Upload ID (Back) *
                                </Label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, 'idBackImage')}
                                />
                                {formData.idBackImage && (
                                    <span className="text-sm text-green-600 flex items-center">
                                        <CheckCircle className="h-4 w-4 mr-1" />
                                        {formData.idBackImage.name}
                                    </span>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="flex items-center font-semibold">
                                    <Camera className="mr-2 h-4 w-4 text-indigo-600" />
                                    Selfie with ID (Optional)
                                </Label>
                                <p className="text-xs text-gray-500">Recommended for stronger verification</p>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, 'selfieWithId')}
                                />
                                {formData.selfieWithId && (
                                    <span className="text-sm text-green-600 flex items-center">
                                        <CheckCircle className="h-4 w-4 mr-1" />
                                        {formData.selfieWithId.name}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
                                <CreditCard className="h-8 w-8 text-indigo-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Payment & Tax Information</h2>
                            <p className="text-gray-600 mt-2">Required to send you payouts</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="accountHolderName" className="font-semibold">
                                    Account Holder Name *
                                </Label>
                                <Input
                                    id="accountHolderName"
                                    name="accountHolderName"
                                    placeholder="As per bank account"
                                    value={values.accountHolderName}
                                    onChange={(e) => setFieldValue('accountHolderName', e.target.value)}
                                    className={errors.accountHolderName && touched.accountHolderName ? "border-red-500" : ""}
                                />
                                <ErrorMessage name="accountHolderName" component="div" className="text-red-500 text-xs" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="accountNumber" className="font-semibold">
                                    Account Number *
                                </Label>
                                <Input
                                    id="accountNumber"
                                    name="accountNumber"
                                    placeholder="Bank account number"
                                    value={values.accountNumber}
                                    onChange={(e) => setFieldValue('accountNumber', e.target.value)}
                                    className={errors.accountNumber && touched.accountNumber ? "border-red-500" : ""}
                                />
                                <ErrorMessage name="accountNumber" component="div" className="text-red-500 text-xs" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ifscCode" className="font-semibold">
                                    IFSC Code *
                                </Label>
                                <Input
                                    id="ifscCode"
                                    name="ifscCode"
                                    placeholder="e.g., SBIN0001234"
                                    value={values.ifscCode}
                                    onChange={(e) => setFieldValue('ifscCode', e.target.value.toUpperCase())}
                                    className={errors.ifscCode && touched.ifscCode ? "border-red-500" : ""}
                                />
                                <ErrorMessage name="ifscCode" component="div" className="text-red-500 text-xs" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bankName" className="font-semibold">
                                    Bank Name *
                                </Label>
                                <Input
                                    id="bankName"
                                    name="bankName"
                                    placeholder="e.g., State Bank of India"
                                    value={values.bankName}
                                    onChange={(e) => setFieldValue('bankName', e.target.value)}
                                    className={errors.bankName && touched.bankName ? "border-red-500" : ""}
                                />
                                <ErrorMessage name="bankName" component="div" className="text-red-500 text-xs" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="upiId" className="font-semibold">
                                    UPI ID (Optional)
                                </Label>
                                <Input
                                    id="upiId"
                                    name="upiId"
                                    placeholder="yourname@upi"
                                    value={values.upiId}
                                    onChange={(e) => setFieldValue('upiId', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="panNumber" className="font-semibold">
                                    PAN Number *
                                </Label>
                                <Input
                                    id="panNumber"
                                    name="panNumber"
                                    placeholder="e.g., ABCDE1234F"
                                    value={values.panNumber}
                                    onChange={(e) => setFieldValue('panNumber', e.target.value.toUpperCase())}
                                    className={errors.panNumber && touched.panNumber ? "border-red-500" : ""}
                                />
                                <ErrorMessage name="panNumber" component="div" className="text-red-500 text-xs" />
                            </div>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
                                <Home className="h-8 w-8 text-indigo-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Your Address</h2>
                            <p className="text-gray-600 mt-2">Permanent address details</p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="address" className="flex items-center font-semibold">
                                    <MapPin className="mr-2 h-4 w-4 text-indigo-600" />
                                    Permanent Address *
                                </Label>
                                <Textarea
                                    id="address"
                                    name="address"
                                    placeholder="House/Flat No., Street, Locality"
                                    rows={3}
                                    value={values.address}
                                    onChange={(e) => setFieldValue('address', e.target.value)}
                                    className={errors.address && touched.address ? "border-red-500" : ""}
                                />
                                <ErrorMessage name="address" component="div" className="text-red-500 text-xs" />
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="city" className="font-semibold">
                                        City *
                                    </Label>
                                    <Input
                                        id="city"
                                        name="city"
                                        placeholder="City"
                                        value={values.city}
                                        onChange={(e) => setFieldValue('city', e.target.value)}
                                        className={errors.city && touched.city ? "border-red-500" : ""}
                                    />
                                    <ErrorMessage name="city" component="div" className="text-red-500 text-xs" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="state" className="font-semibold">
                                        State *
                                    </Label>
                                    <Input
                                        id="state"
                                        name="state"
                                        placeholder="State"
                                        value={values.state}
                                        onChange={(e) => setFieldValue('state', e.target.value)}
                                        className={errors.state && touched.state ? "border-red-500" : ""}
                                    />
                                    <ErrorMessage name="state" component="div" className="text-red-500 text-xs" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="pinCode" className="font-semibold">
                                        PIN Code *
                                    </Label>
                                    <Input
                                        id="pinCode"
                                        name="pinCode"
                                        placeholder="6 digits"
                                        value={values.pinCode}
                                        onChange={(e) => setFieldValue('pinCode', e.target.value)}
                                        className={errors.pinCode && touched.pinCode ? "border-red-500" : ""}
                                    />
                                    <ErrorMessage name="pinCode" component="div" className="text-red-500 text-xs" />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Legal Agreement</h2>
                            <p className="text-gray-600 mt-2">Review and accept our policies</p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                            <div className="flex items-start space-x-3">
                                <input
                                    type="checkbox"
                                    id="acceptTerms"
                                    name="acceptTerms"
                                    checked={values.acceptTerms}
                                    onChange={(e) => setFieldValue('acceptTerms', e.target.checked)}
                                    className="mt-1 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <div className="flex-1">
                                    <Label htmlFor="acceptTerms" className="font-semibold cursor-pointer">
                                        I accept the Terms & Conditions *
                                    </Label>
                                    <p className="text-sm text-gray-600 mt-1">
                                        By checking this box, you agree to our{' '}
                                        <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a>
                                    </p>
                                    <ErrorMessage name="acceptTerms" component="div" className="text-red-500 text-xs mt-1" />
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <input
                                    type="checkbox"
                                    id="acceptPolicies"
                                    name="acceptPolicies"
                                    checked={values.acceptPolicies}
                                    onChange={(e) => setFieldValue('acceptPolicies', e.target.checked)}
                                    className="mt-1 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <div className="flex-1">
                                    <Label htmlFor="acceptPolicies" className="font-semibold cursor-pointer">
                                        I accept the Hosting Policies *
                                    </Label>
                                    <p className="text-sm text-gray-600 mt-1">
                                        You agree to follow our{' '}
                                        <a href="#" className="text-indigo-600 hover:underline">Hosting Guidelines</a>
                                        {' '}and maintain quality standards
                                    </p>
                                    <ErrorMessage name="acceptPolicies" component="div" className="text-red-500 text-xs mt-1" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                            <h3 className="font-semibold text-indigo-900 mb-2">What happens next?</h3>
                            <ul className="space-y-2 text-sm text-indigo-800">
                                <li className="flex items-start">
                                    <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                                    Your application will be reviewed within 24-48 hours
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                                    We'll verify your documents and identity
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                                    Once approved, you can start listing your properties
                                </li>
                            </ul>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    const getStepInitialValues = () => {
        switch (currentStep) {
            case 1:
                return {
                    fullName: formData.fullName,
                    dateOfBirth: formData.dateOfBirth,
                    phone: formData.phone,
                    email: formData.email,
                };
            case 2:
                return {
                    idType: formData.idType,
                    idNumber: formData.idNumber,
                };
            case 3:
                return {
                    accountHolderName: formData.accountHolderName,
                    accountNumber: formData.accountNumber,
                    ifscCode: formData.ifscCode,
                    bankName: formData.bankName,
                    upiId: formData.upiId,
                    panNumber: formData.panNumber,
                };
            case 4:
                return {
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    pinCode: formData.pinCode,
                };
            case 5:
                return {
                    acceptTerms: formData.acceptTerms,
                    acceptPolicies: formData.acceptPolicies,
                };
            default:
                return {};
        }
    };

    if (isLoadingStatus) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Checking application status...</p>
                </div>
            </div>
        );
    }

    if (appStatus === 'pending') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 flex items-center justify-center">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 rounded-full mb-6">
                        <Loader2 className="h-10 w-10 text-amber-600 animate-spin" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Pending</h2>
                    <p className="text-gray-600 mb-8">
                        Your application to become a host is currently under review by our admin team.
                        This usually takes 24-48 hours. We'll notify you once a decision is made.
                    </p>
                    <Button
                        onClick={() => navigate('/customer/home')}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                        Return to Home
                    </Button>
                </div>
            </div>
        );
    }

    if (appStatus === 'approved') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 flex items-center justify-center">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">You're Already a Host!</h2>
                    <p className="text-gray-600 mb-8">
                        Your application has been approved. You can now access the host dashboard and start listing your properties.
                    </p>
                    <Button
                        onClick={() => navigate('/owner/dashboard')}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                        Go to Host Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Become a Host</h1>
                    <p className="text-gray-600">Complete your profile to start hosting</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        {[1, 2, 3, 4, 5].map((step) => (
                            <div key={step} className="flex items-center flex-1">
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${currentStep >= step
                                    ? 'bg-indigo-600 border-indigo-600 text-white'
                                    : 'bg-white border-gray-300 text-gray-400'
                                    }`}>
                                    {currentStep > step ? <CheckCircle className="h-6 w-6" /> : step}
                                </div>
                                {step < 5 && (
                                    <div className={`flex-1 h-1 mx-2 ${currentStep > step ? 'bg-indigo-600' : 'bg-gray-300'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 mt-2">
                        <span>Identity</span>
                        <span>ID Proof</span>
                        <span>Payment</span>
                        <span>Address</span>
                        <span>Agreement</span>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <Formik
                        initialValues={getStepInitialValues()}
                        validationSchema={getStepSchema(currentStep)}
                        onSubmit={currentStep === totalSteps ? handleFinalSubmit : handleNext}
                        enableReinitialize
                    >
                        {({ values, errors, touched, setFieldValue }) => (
                            <Form>
                                {renderStepContent(values, errors, touched, setFieldValue)}

                                {/* Navigation Buttons */}
                                <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleBack}
                                        disabled={currentStep === 1}
                                        className="px-6"
                                    >
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back
                                    </Button>

                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Submitting...
                                            </>
                                        ) : currentStep === totalSteps ? (
                                            'Submit Application'
                                        ) : (
                                            <>
                                                Next
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default BecomeHost;
