import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProperties } from '../../context/PropertyContext';

const PropertyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { properties } = useProperties();
    const property = properties.find(p => p.id === parseInt(id));

    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [error, setError] = useState('');

    const handleBook = (e) => {
        e.preventDefault();
        setError('');

        if (!checkIn || !checkOut) {
            setError('Please select both check-in and check-out dates.');
            return;
        }

        if (new Date(checkOut) <= new Date(checkIn)) {
            setError('Check-out date must be after check-in date.');
            return;
        }

        const newBooking = {
            id: Date.now(),
            propertyId: property.id,
            propertyName: property.name,
            location: property.location,
            price: property.price,
            image: property.image,
            dates: {
                checkIn,
                checkOut
            },
            bookedAt: new Date().toISOString()
        };

        const existingBookings = JSON.parse(localStorage.getItem('customer_bookings') || '[]');
        localStorage.setItem('customer_bookings', JSON.stringify([...existingBookings, newBooking]));

        navigate('/customer/trips');
    };

    if (!property || property.status !== 'Available') {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-800">Property not found or unavailable</h2>
                <Link to="/customer" className="text-indigo-600 hover:text-indigo-800 mt-4 inline-block">
                    &larr; Back to listings
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="relative h-96">
                <img
                    src={property.image}
                    alt={property.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-sm font-semibold text-green-700 rounded-full shadow-sm">
                        {property.status}
                    </span>
                </div>
                <Link
                    to="/customer"
                    className="absolute top-4 left-4 p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-700 hover:text-indigo-600 transition-colors shadow-sm"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </Link>
            </div>

            <div className="p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{property.name}</h1>
                        <p className="flex items-center text-gray-500 mt-2">
                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {property.location}
                        </p>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-3xl font-bold text-gray-900">${property.price}</span>
                        <span className="text-gray-500">per night</span>
                    </div>
                </div>

                <div className="prose prose-indigo max-w-none">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">About this place</h3>
                    <p className="text-gray-600 leading-relaxed">
                        {property.description}
                    </p>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100">
                    {!isBookingOpen ? (
                        <div className="flex justify-end">
                            <button
                                onClick={() => setIsBookingOpen(true)}
                                className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
                            >
                                Book Now
                            </button>
                        </div>
                    ) : (
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Complete your booking</h3>
                            <form onSubmit={handleBook} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                                        <input
                                            type="date"
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            value={checkIn}
                                            onChange={(e) => setCheckIn(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                                        <input
                                            type="date"
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            value={checkOut}
                                            onChange={(e) => setCheckOut(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="text-red-600 text-sm">{error}</div>
                                )}

                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsBookingOpen(false)}
                                        className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-indigo-600 text-white px-8 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
                                    >
                                        Confirm Booking
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PropertyDetails;
