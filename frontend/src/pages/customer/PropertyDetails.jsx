import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProperties } from '../../context/PropertyContext';

const PropertyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { properties, loading } = useProperties();
    // Assuming ID is string now from API mapping
    const property = properties.find(p => p.id === id);

    const [selectedRoom, setSelectedRoom] = useState(null);
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [error, setError] = useState('');

    const handleRoomSelect = (room) => {
        setSelectedRoom(room);
        setError('');
    };

    const handleCloseBooking = () => {
        setSelectedRoom(null);
        setError('');
        setCheckIn('');
        setCheckOut('');
    };

    const handleBook = async (e) => {
        e.preventDefault();
        setError('');

        if (!checkIn || !checkOut) {
            setError('Please select both check-in and check-out dates.');
            return;
        }

        try {
            // Import dynamically or at top (we'll assume dynamic or add top import in next step if needed)
            const { createBooking } = await import('../../api/bookingApi');

            await createBooking({
                propertyId: property.id,
                roomId: selectedRoom._id, // Use room._id from backend
                checkIn,
                checkOut
            });

            navigate('/customer/trips');
        } catch (err) {
            setError(err.response?.data?.error || 'Booking failed. Please try again.');
        }
    };

    if (loading) return <div className="text-center py-12">Loading...</div>;

    if (!property) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-800">Property not found or unavailable</h2>
                <Link to="/customer" className="text-indigo-600 hover:text-indigo-800 mt-4 inline-block">
                    &larr; Back to listings
                </Link>
            </div>
        );
    }

    const minPrice = property.rooms && property.rooms.length > 0
        ? Math.min(...property.rooms.map(r => r.price))
        : (property.price || 0);

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
                    {minPrice > 0 && (
                        <div className="flex flex-col items-end">
                            <span className="text-3xl font-bold text-gray-900">
                                ${minPrice}
                            </span>
                            <span className="text-gray-500">per night / from</span>
                        </div>
                    )}
                </div>

                <div className="prose prose-indigo max-w-none mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">About this place</h3>
                    <p className="text-gray-600 leading-relaxed">
                        {property.description}
                    </p>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Available Rooms</h3>

                    {!property.rooms || property.rooms.length === 0 ? (
                        <p className="text-gray-500">No rooms information available.</p>
                    ) : (
                        <div className="grid gap-6">
                            {property.rooms.map((room, index) => (
                                <div key={index} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                                    <div className="flex flex-col md:flex-row justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="text-lg font-bold text-gray-900">{room.type}</h4>
                                                <span className="text-indigo-600 font-bold text-lg">${room.price}<span className="text-sm text-gray-500 font-normal">/night</span></span>
                                            </div>
                                            <p className="text-gray-600 mb-3">{room.description}</p>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                                {room.count} rooms total
                                            </div>
                                        </div>
                                        <div className="self-start md:self-center">
                                            <button
                                                onClick={() => handleRoomSelect(room)}
                                                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-sm whitespace-nowrap"
                                            >
                                                Book Room
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Booking Modal */}
                {selectedRoom && (
                    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                            {/* Overlay */}
                            <div
                                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                                aria-hidden="true"
                                onClick={handleCloseBooking}
                            ></div>

                            {/* Modal Panel */}
                            <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                                Book {selectedRoom?.type}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                ${selectedRoom?.price} per night
                                            </p>

                                            <form onSubmit={handleBook} className="mt-6 space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                                                        <input
                                                            type="date"
                                                            className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                                            value={checkIn}
                                                            onChange={(e) => setCheckIn(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                                                        <input
                                                            type="date"
                                                            className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                                            value={checkOut}
                                                            onChange={(e) => setCheckOut(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                {error && (
                                                    <div className="p-3 rounded-md bg-red-50 text-sm text-red-600">
                                                        {error}
                                                    </div>
                                                )}

                                                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                                    <button
                                                        type="submit"
                                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                                                    >
                                                        Confirm Booking
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={handleCloseBooking}
                                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default PropertyDetails;
