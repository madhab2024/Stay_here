import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, ChevronRight } from 'lucide-react';
import { useProperties } from '../../context/PropertyContext';

const Home = () => {
  const navigate = useNavigate();
  const { properties } = useProperties();
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('');

  const destinations = [
    {
      id: 1,
      name: 'Spain',
      image: 'https://images.unsplash.com/photo-1479191043051-398e867b8235?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60',
    },
    {
      id: 2,
      name: 'London',
      image: 'https://images.unsplash.com/photo-1494783367193-149034c05e41?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60',
    },
    {
      id: 3,
      name: 'Lisbon',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60',
    },
    {
      id: 4,
      name: 'Croatia',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60',
    },
    {
      id: 5,
      name: 'Bratislava',
      image: 'https://images.unsplash.com/photo-1469022563149-aa64dbd37dae?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60',
    },
    {
      id: 6,
      name: 'Copenhagen',
      image: 'https://images.unsplash.com/photo-1512453475885-6d71bcdd2006?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60',
    },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/customer/properties', { 
      state: { location, checkIn, checkOut, guests } 
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Search */}
      <section className="relative h-96 bg-gradient-to-br from-teal-600 to-teal-800 rounded-3xl mx-6 mt-8 mb-16 overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.3,
          }}
        />
        
        <div className="relative h-full flex flex-col items-center justify-center px-6 py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            Book your stay with Stay Here
          </h1>
          <p className="text-xl text-white text-center mb-12">
            1,480,086 rooms around the world are waiting for you!
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="w-full max-w-6xl bg-white rounded-2xl p-6 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
              {/* Location */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">Location</label>
                <div className="flex items-center space-x-2 border-b-2 border-gray-300 pb-2">
                  <MapPin size={20} className="text-teal-600" />
                  <input
                    type="text"
                    placeholder="Where are you going?"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full outline-none text-gray-700 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Check-in */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">Check-in</label>
                <div className="flex items-center space-x-2 border-b-2 border-gray-300 pb-2">
                  <Calendar size={20} className="text-teal-600" />
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full outline-none text-gray-700"
                  />
                </div>
              </div>

              {/* Check-out */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">Check-out</label>
                <div className="flex items-center space-x-2 border-b-2 border-gray-300 pb-2">
                  <Calendar size={20} className="text-teal-600" />
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full outline-none text-gray-700"
                  />
                </div>
              </div>

              {/* Guests */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">Guests</label>
                <div className="flex items-center space-x-2 border-b-2 border-gray-300 pb-2">
                  <Users size={20} className="text-teal-600" />
                  <input
                    type="number"
                    placeholder="Number of guests"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full outline-none text-gray-700 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white rounded-full flex items-center justify-center transition font-semibold"
                >
                  <Search size={24} />
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Popular destinations</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination) => (
            <div
              key={destination.id}
              className="group relative h-64 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition cursor-pointer"
            >
              <img
                src={destination.image}
                alt={destination.name}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end">
                <div className="w-full p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{destination.name}</h3>
                  <button className="flex items-center space-x-2 text-teal-300 hover:text-teal-200 transition">
                    <span className="font-semibold">Explore</span>
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              {/* Name Badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm px-4 py-2 rounded-lg group-hover:opacity-0 transition duration-300">
                <h3 className="text-lg font-bold text-gray-800">{destination.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Available Properties Section */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Available Stays</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties
            .filter(property => property.status === 'Available')
            .map((property) => (
              <div
                key={property.id}
                onClick={() => navigate(`/customer/property/${property.id}`)}
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  <img
                    src={property.image}
                    alt={property.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 bg-teal-600 text-white text-xs font-bold rounded-full">
                      ${property.price}/night
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-teal-600 transition-colors">
                      {property.name}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin size={16} className="text-teal-600" />
                      {property.location}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <button className="w-full py-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold rounded-lg transition">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-r from-teal-50 to-cyan-50 py-16 px-6 mb-20 rounded-3xl mx-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">Why choose Stay Here?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <Search className="text-teal-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Easy Search</h3>
              <p className="text-gray-600">Find your perfect stay with our intuitive search filters and recommendations.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <MapPin className="text-teal-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Best Locations</h3>
              <p className="text-gray-600">Discover properties in the most popular destinations worldwide.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <Users className="text-teal-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Great Community</h3>
              <p className="text-gray-600">Join millions of travelers and find trusted hosts worldwide.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
