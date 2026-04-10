import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ChevronRight, ChevronLeft, Calendar, Users, User, Star } from 'lucide-react';
import { useProperties } from '../../context/PropertyContext';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const navigate = useNavigate();
  const { properties, loading } = useProperties();
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(1);
  const [activePopup, setActivePopup] = useState(null); // 'location', 'checkIn', 'checkOut', or 'guests'

  const uniqueLocations = useMemo(() => {
    if (!properties || properties.length === 0) return [];
    return Array.from(new Set(properties.map(p => p.city || p.location).filter(Boolean)));
  }, [properties]);
  
  const datePickerRef = useRef(null);
  const scrollContainerRef = useRef(null); // For scrolling dates

  const scrollDates = (direction) => {
    if (scrollContainerRef.current) {
        const scrollAmount = direction === 'left' ? -250 : 250;
        scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Close popups when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setActivePopup(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const generateDates = () => {
    const dates = [];
    const today = new Date();
    today.setHours(0,0,0,0);
    for (let i = 0; i < 60; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        dates.push(d);
    }
    return dates;
  };

  const datesList = generateDates();

  const handleSelectDate = (date) => {
    if (activePopup === 'checkIn') {
        setCheckIn(date);
        // Automatically switch to checkout if valid
        if (!checkOut || date > checkOut) setCheckOut(null);
        setActivePopup('checkOut');
    } else if (activePopup === 'checkOut') {
        if (checkIn && date < checkIn) {
            setCheckIn(date);
        } else {
            setCheckOut(date);
        }
        setActivePopup('guests'); // Switch to guests
    }
  };

  const guestOptions = [
    { value: 1, label: 'Solo', icon: <User size={28} className="text-gray-500 mb-2"/> },
    { value: 2, label: 'Couple', icon: <div className="flex mb-2"><User size={28} className="text-[#FF405A] -mr-1 z-10"/><User size={28} className="text-gray-500"/></div> },
    { value: 3, label: 'Small Family', icon: <div className="flex items-end mb-2"><User size={28} className="text-gray-500"/><User size={28} className="text-[#FF405A] -mr-1 z-10"/><User size={22} className="text-teal-600"/></div> },
    { value: 4, label: 'Family', icon: <div className="flex items-end mb-2"><User size={28} className="text-gray-500"/><User size={28} className="text-[#FF405A] -ml-2 z-10"/><User size={22} className="text-teal-600"/><User size={22} className="text-indigo-500 -ml-1"/></div> },
    { value: 5, label: 'Group (5 max)', icon: <div className="flex items-end mb-2"><Users size={32} className="text-[#FF405A]"/><Users size={32} className="text-gray-500 -ml-2 z-10"/></div> },
  ];

  const destinationsPool = useMemo(() => [
    { id: 1, name: 'Mumbai', image: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=600&auto=format&fit=crop' },
    { id: 2, name: 'Jaipur', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=600&auto=format&fit=crop' },
    { id: 3, name: 'Agra', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=600&auto=format&fit=crop' },
    { id: 4, name: 'Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&auto=format&fit=crop' },
    { id: 5, name: 'Varanasi', image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&auto=format&fit=crop' },
    { id: 6, name: 'Udaipur', image: 'https://images.unsplash.com/photo-1590483736622-39da3a5ae893?w=600&auto=format&fit=crop' },
    { id: 7, name: 'Manali', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&auto=format&fit=crop' },
    { id: 8, name: 'Munnar', image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600&auto=format&fit=crop' },
    { id: 9, name: 'Rishikesh', image: 'https://images.unsplash.com/photo-1598977123418-45455531714f?w=600&auto=format&fit=crop' },
    { id: 10, name: 'Kolkata', image: 'https://images.unsplash.com/photo-1558431382-27e39cbef4bc?w=600&auto=format&fit=crop' }
  ], []);

  const destinations = useMemo(() => {
    return [...destinationsPool].sort(() => 0.5 - Math.random()).slice(0, 6);
  }, [destinationsPool]);

  const handleDestinationClick = (destName) => {
    navigate('/customer/properties', { state: { location: destName } });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/customer/properties', {
      state: { location, checkIn: checkIn?.toISOString(), checkOut: checkOut?.toISOString(), guests }
    });
  };

  const randomProperties = useMemo(() => {
    // Only approved properties
    const validProps = properties.filter(p => p.status === 'approved' || p.status === 'Available');
    // Shuffle
    const shuffled = [...validProps].sort(() => 0.5 - Math.random());
    // Get up to 8 max
    return shuffled.slice(0, 8);
  }, [properties]);

  const heroImages = useMemo(() => {
    const defaultImage = "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80";
    if (!properties || properties.length === 0) return [defaultImage];
    
    const listingImages = properties
      .filter(p => p.status === 'approved' && (p.coverImage || p.image))
      .map(p => p.coverImage || p.image);
      
    return listingImages.length > 0 ? listingImages.slice(0, 10) : [defaultImage];
  }, [properties]);

  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [heroImages]);

  return (
    <div className="min-h-screen bg-white">
      {/* Full-width Hero Section - Dynamic Carousel */}
      <section className="relative h-[85vh] w-full mb-20 overflow-visible flex flex-col justify-center">
        {/* Background Animation Container */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <AnimatePresence>
            <motion.div
              key={currentHeroIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: "linear" }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroImages[currentHeroIndex]})` }}
            />
          </AnimatePresence>
          {/* Constant Overlay */}
          <div className="absolute inset-0 bg-black/45 z-10" />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 w-full flex flex-col items-center px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-8xl font-black text-white text-center mb-6 tracking-tight drop-shadow-2xl">
              Stay <span className="text-[#FF405A]">Everywhere</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 text-center mb-12 drop-shadow-lg font-medium max-w-2xl mx-auto leading-relaxed">
              Explore thousands of unique homes and hotels at the best rates in India.
            </p>
          </motion.div>

          {/* Pill Search Form inside the hero */}
          <div className="w-full max-w-5xl mt-8 px-4 relative z-50" ref={datePickerRef}>
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row bg-white rounded-3xl md:rounded-full md:items-center p-2 shadow-2xl min-h-[5rem] md:h-20 gap-1 md:gap-0 relative z-50">
              
                  {/* Location */}
                  <div className="relative w-full md:w-auto flex-[1.5] flex flex-col justify-center px-6 py-3 md:py-0 md:h-full border-b md:border-b-0 border-gray-200 rounded-2xl md:rounded-full bg-orange-50 hover:bg-orange-100/50 transition-colors">
                    <label className="text-[11px] font-bold tracking-wider text-orange-600 mb-1 uppercase">Location</label>
                    <input
                      type="text"
                      placeholder="Where are you going?"
                      value={location}
                      onFocus={() => setActivePopup('location')}
                      onChange={(e) => { setLocation(e.target.value); setActivePopup('location'); }}
                      className="w-full outline-none text-gray-900 font-bold text-base md:text-lg placeholder-orange-300 bg-transparent capitalize tracking-tight"
                    />

                    {/* Autocomplete Dropdown */}
                    {activePopup === 'location' && (
                        <div className="absolute top-full left-0 mt-3 w-full md:w-[320px] bg-white rounded-3xl shadow-[0_12px_40px_rgb(0,0,0,0.12)] border border-gray-100 z-50 p-4 max-h-[340px] overflow-y-auto">
                            <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-3 pl-2">Popular Destinations</h3>
                            {uniqueLocations.filter(loc => loc.toLowerCase().includes(location.toLowerCase())).slice(0, 6).map((loc, idx) => (
                                <div 
                                    key={idx}
                                    className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-2xl cursor-pointer transition-colors"
                                    onClick={() => { setLocation(loc); setActivePopup(null); }}
                                >
                                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                                        <MapPin size={18} className="text-gray-500" />
                                    </div>
                                    <span className="font-bold text-gray-800 text-base">{loc}</span>
                                </div>
                            ))}
                            {uniqueLocations.filter(loc => loc.toLowerCase().includes(location.toLowerCase())).length === 0 && (
                                <div className="p-4 text-center text-gray-500 font-medium">No destinations found.</div>
                            )}
                        </div>
                    )}
                  </div>

              {/* Check-in */}
              <div 
                className={`w-full md:w-auto flex-1 flex flex-col justify-center px-6 py-3 md:py-0 border-b md:border-b-0 md:border-r border-gray-200 cursor-pointer rounded-xl md:rounded-2xl transition-colors ${activePopup === 'checkIn' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                onClick={() => setActivePopup(activePopup === 'checkIn' ? null : 'checkIn')}
              >
                <label className="text-xs font-bold tracking-wider text-gray-900 mb-1 cursor-pointer">CHECK IN</label>
                <div className={`text-sm ${checkIn ? 'text-gray-900' : 'text-gray-400'}`}>
                  {checkIn ? formatDate(checkIn) : 'Add dates'}
                </div>
              </div>

              {/* Check-out */}
              <div 
                className={`w-full md:w-auto flex-1 flex flex-col justify-center px-6 py-3 md:py-0 border-b md:border-b-0 md:border-r border-gray-200 cursor-pointer rounded-xl md:rounded-2xl transition-colors ${activePopup === 'checkOut' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                onClick={() => setActivePopup(activePopup === 'checkOut' ? null : 'checkOut')}
              >
                <label className="text-xs font-bold tracking-wider text-gray-900 mb-1 cursor-pointer">CHECK OUT</label>
                <div className={`text-sm ${checkOut ? 'text-gray-900' : 'text-gray-400'}`}>
                  {checkOut ? formatDate(checkOut) : 'Add dates'}
                </div>
              </div>

              {/* Guests */}
              <div className="w-full md:w-auto flex-[1.2] flex items-center justify-between px-4 md:px-6 md:pl-6 md:pr-2 py-2 md:py-0">
                <div 
                    className={`flex flex-col w-full pr-4 py-2 cursor-pointer rounded-xl md:rounded-2xl transition-colors ${activePopup === 'guests' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                    onClick={() => setActivePopup(activePopup === 'guests' ? null : 'guests')}
                >
                  <label className="text-xs font-bold tracking-wider text-gray-900 mb-1 cursor-pointer px-2">GUESTS</label>
                  <div className={`text-sm px-2 ${guests ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                    {guests ? `${guests} ${guests === 1 ? 'Guest' : 'Guests'}` : 'Add guests'}
                  </div>
                </div>
                
                {/* Search Button */}
                <button
                  type="submit"
                  className="w-14 items-center justify-center h-14 bg-[#FF405A] hover:bg-red-500 text-white rounded-2xl md:rounded-full flex transition shadow-md flex-shrink-0 ml-2"
                >
                  <Search size={22} className="stroke-[2.5]" />
                </button>
              </div>
              
            </form>

            {/* BookMyShow Style Date Picker Popover */}
            {(activePopup === 'checkIn' || activePopup === 'checkOut') && (
                <div className="absolute top-[102%] md:top-24 left-1/2 transform -translate-x-1/2 bg-white rounded-2xl shadow-2xl p-6 w-[95%] md:w-[700px] z-[60] border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Calendar className="text-[#FF405A]" size={20} />
                        Select {activePopup === 'checkIn' ? 'Check-in' : 'Check-out'} Date
                    </h3>
                    <div className="relative flex items-center group">
                        {/* Left Scroll Button */}
                        <button 
                            type="button" 
                            onClick={(e) => { e.preventDefault(); scrollDates('left'); }} 
                            className="absolute left-0 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-700 hover:text-[#FF405A] -ml-5 transition-colors"
                        >
                           <ChevronLeft size={24} className="mr-1" />
                        </button>

                        {/* Scroll Container */}
                        <div ref={scrollContainerRef} className="flex overflow-x-auto gap-3 pb-4 scrollbar-hide snap-x scroll-smooth w-full px-2">
                            {datesList.map((date, idx) => {
                                const isSelected = (activePopup === 'checkIn' && checkIn?.getTime() === date.getTime()) ||
                                                   (activePopup === 'checkOut' && checkOut?.getTime() === date.getTime());
                                
                                // Disable invalid checkout dates
                                const isDisabled = activePopup === 'checkOut' && checkIn && date < checkIn;

                                return (
                                    <button
                                        key={idx}
                                        type="button"
                                        disabled={isDisabled}
                                        onClick={(e) => { e.preventDefault(); handleSelectDate(date); }}
                                        className={`snap-start flex flex-col items-center justify-center p-3 rounded-xl min-w-[75px] border transition-all flex-shrink-0 cursor-pointer ${
                                            isDisabled ? 'opacity-30 cursor-not-allowed border-gray-100' :
                                            isSelected ? 'bg-[#FF405A] text-white border-[#FF405A] shadow-md scale-105' : 
                                            'bg-white text-gray-800 border-gray-200 hover:border-[#FF405A]'
                                        }`}
                                    >
                                        <span className={`text-xs font-semibold ${isSelected ? 'text-white/90' : 'text-gray-500'}`}>
                                            {date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                                        </span>
                                        <span className="text-2xl font-bold my-1 pointer-events-none">
                                            {date.getDate()}
                                        </span>
                                        <span className={`text-xs ${isSelected ? 'text-white/90' : 'text-gray-500'}`}>
                                            {date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Right Scroll Button */}
                        <button 
                            type="button" 
                            onClick={(e) => { e.preventDefault(); scrollDates('right'); }} 
                            className="absolute right-0 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-700 hover:text-[#FF405A] -mr-5 transition-colors"
                        >
                           <ChevronRight size={24} className="ml-1" />
                        </button>
                    </div>
                </div>
            )}

            {/* Guests Popover */}
            {activePopup === 'guests' && (
                <div className="absolute top-[102%] md:top-24 right-4 md:right-10 bg-white rounded-2xl shadow-2xl p-6 w-[95%] md:w-[600px] z-[60] border border-gray-100 mx-auto left-0 md:left-auto flex flex-col md:block">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Users className="text-[#FF405A]" size={20} />
                        Who's traveling? (Max 5)
                    </h3>
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                        {guestOptions.map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={(e) => { 
                                    e.preventDefault(); 
                                    setGuests(opt.value);
                                    setActivePopup(null); // Close after selection
                                }}
                                className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                                    guests === opt.value ? 'bg-red-50 border-[#FF405A] shadow-md scale-105 ring-2 ring-[#FF405A]/20' : 
                                    'bg-white text-gray-800 border-gray-200 hover:border-[#FF405A] hover:bg-gray-50 hover:shadow-sm'
                                }`}
                            >
                                {opt.icon}
                                <span className={`text-sm font-bold mt-2 text-center ${guests === opt.value ? 'text-[#FF405A]' : 'text-gray-700'}`}>
                                    {opt.label}
                                </span>
                                <span className={`text-xs font-semibold ${guests === opt.value ? 'text-[#FF405A]/80' : 'text-gray-400'}`}>
                                    {opt.value} {opt.value === 1 ? 'Guest' : 'Guests'}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="max-w-7xl mx-auto px-6 mb-20 mt-24">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 border-l-[6px] border-[#FF405A] pl-4">Trending Destinations</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination) => (
            <div
              key={destination.id}
              onClick={() => handleDestinationClick(destination.name)}
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
        <h2 className="text-3xl font-bold text-gray-800 mb-8 border-l-[6px] border-[#FF405A] pl-4">Discover Random Stays</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            [...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-[340px]">
                <div className="w-full h-48 bg-gray-200"></div>
                <div className="p-5 flex flex-col gap-3 flex-1">
                  <div className="flex justify-between w-full">
                    <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-5 bg-gray-200 rounded w-1/5"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/4 mt-1"></div>
                  
                  <div className="mt-auto flex justify-between items-end pt-4 border-t border-gray-50">
                    <div className="h-5 bg-gray-200 rounded w-1/3 mb-1"></div>
                    <div className="h-10 bg-gray-200 rounded-lg w-1/4"></div>
                  </div>
                </div>
              </div>
            ))
          ) : randomProperties.map((property) => (
            <div
              key={property.id}
              onClick={() => navigate(`/customer/property/${property.id}`)}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 flex flex-col"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                  src={property.coverImage || property.image || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb"}
                  alt={property.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Save Icon Overlay */}
                <div className="absolute top-3 right-3 bg-white/50 backdrop-blur-sm p-2 rounded-full shadow-sm hover:scale-110 transition cursor-pointer">
                    <Star size={18} className="text-gray-800" />
                </div>
                
                {/* Add a "Type" Badge */}
                {property.propertyType && (
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white border border-white/20 text-xs font-bold rounded-full shadow-md capitalize tracking-wider">
                      {property.propertyType}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-1">
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-[#FF405A] transition-colors pr-2">
                        {property.name}
                      </h3>
                      
                      {/* Real Rating from Dataset */}
                      {(property.rating > 0) && (
                        <div className="flex items-center gap-1 font-semibold text-gray-800 shrink-0">
                            <Star size={14} className="fill-[#FF405A] text-[#FF405A]" />
                            <span>{property.rating.toFixed(1)}</span>
                        </div>
                      )}
                  </div>
                  
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1 line-clamp-1">
                    <MapPin size={15} className="text-gray-400 shrink-0" />
                    {property.location}
                  </p>
                  
                  {/* Reviews & Amenities preview */}
                  {property.reviewCount > 0 && (
                     <p className="text-xs text-gray-400 mt-2 font-medium">({property.reviewCount} verified reviews)</p>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-between items-center mt-auto">
                    <div>
                        <span className="text-sm text-gray-500">Starting from</span>
                        <div className="text-lg font-bold text-gray-900 uppercase">
                          Contact Host
                        </div>
                    </div>
                  <button className="px-4 py-2 bg-gray-900 hover:bg-[#FF405A] text-white font-semibold rounded-lg transition-colors text-sm shadow-md">
                    View
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