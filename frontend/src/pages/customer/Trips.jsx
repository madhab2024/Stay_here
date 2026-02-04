import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { fetchMyBookings } from '../../api/bookingApi';

const Trips = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const result = await fetchMyBookings();
        // If the response structure is { data: [...] } or just array, adjust accordingly.
        // Based on controller, it returns: { success: true, data: [...] }
        // So propertyApi.js returning response.data -> { success: true, data: [...] }
        setBookings(result.data || []);
      } catch (err) {
        console.error("Failed to fetch trips", err);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading your trips...</div>;

  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No trips booked... yet!</h2>
        <p className="text-gray-500 mb-6">Time to dust off your bags and start planning your next adventure.</p>
        <Link
          to="/customer"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
        >
          Start Exploring
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Trips</h1>
          <p className="mt-1 text-gray-500">Upcoming and past reservations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col">
            <div className="relative h-48">
              <img
                src={booking.image}
                alt={booking.propertyName}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
                <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-bold text-indigo-700 rounded uppercase tracking-wide">
                  Booked
                </span>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-lg font-bold text-gray-900 mb-1">{booking.propertyName}</h3>
              <p className="text-sm text-gray-500 flex items-center mb-4">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {booking.location}
              </p>

              <div className="mt-auto pt-4 border-t border-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Check-in</span>
                  <span className="text-sm font-semibold text-gray-900">{booking.dates.checkIn}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Check-out</span>
                  <span className="text-sm font-semibold text-gray-900">{booking.dates.checkOut}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Trips;
