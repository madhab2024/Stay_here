import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, Filter, Heart, ArrowUpDown, SlidersHorizontal, ChevronRight, Check, Calendar, ChevronLeft, Users } from 'lucide-react';
import { useProperties } from '../../context/PropertyContext';
import { useAuth } from '../../auth/useAuth';
import api from '../../services/api';

const Explore = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { properties, loading } = useProperties();
    const { user } = useAuth();
    
    // Initial Search State from Home
    const pState = location.state || {};
    const [searchLoc, setSearchLoc] = useState(pState.location || '');
    const [appliedSearchLoc, setAppliedSearchLoc] = useState(pState.location || '');
    
    // Booking params
    const [checkIn, setCheckIn] = useState(pState.checkIn ? new Date(pState.checkIn) : null);
    const [checkOut, setCheckOut] = useState(pState.checkOut ? new Date(pState.checkOut) : null);
    const [guests, setGuests] = useState(pState.guests || 1);

    const uniqueLocations = useMemo(() => {
        if (!properties || properties.length === 0) return [];
        return Array.from(new Set(properties.map(p => p.city || p.location).filter(Boolean)));
    }, [properties]);

    // Pill Search Popup State
    const [activePopup, setActivePopup] = useState(null);
    const datePickerRef = useRef(null);
    const scrollContainerRef = useRef(null);

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
        return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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
    const datesList = useMemo(() => generateDates(), []);

    const handleSelectDate = (date) => {
        if (activePopup === 'checkIn') {
            setCheckIn(date);
            if (!checkOut || date > new Date(checkOut)) setCheckOut(null);
            setActivePopup('checkOut');
        } else if (activePopup === 'checkOut') {
            if (checkIn && date < new Date(checkIn)) {
                setCheckIn(date);
            } else {
                setCheckOut(date);
            }
            setActivePopup(null);
        }
    };

    // Filters
    const [priceRange, setPriceRange] = useState([0, 50000]); // [min, max]
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [minRating, setMinRating] = useState(0);

    // Sorting
    const [sortBy, setSortBy] = useState('recommended'); // recommended, priceAsc, priceDesc, rating

    // UI State for mobile filter sidebar
    const [showFilters, setShowFilters] = useState(false);
    const [savedStays, setSavedStays] = useState([]);
    const [visibleCount, setVisibleCount] = useState(12); // Pagination state

    // Fetch user's saved stays to toggle heart icon correctly
    useEffect(() => {
        if (user) {
            api.get('/customer/saved-properties')
                .then(res => setSavedStays(res.data.data.map(p => p._id)))
                .catch(err => console.log(err));
        }
    }, [user]);

    const propertyTypes = ['Apartment', 'Villa', 'House', 'Hotel', 'Cabin', 'Resort', 'Bungalow'];
    const commonAmenities = ['WiFi', 'Pool', 'Kitchen', 'Air conditioning', 'Gym', 'Free parking', 'Pet friendly'];

    // Handle Checkboxes
    const toggleType = (type) => {
        setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
    };

    const toggleAmenity = (amenity) => {
        setSelectedAmenities(prev => prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]);
    };

    const toggleSave = async (e, propertyId) => {
        e.stopPropagation();
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            if (savedStays.includes(propertyId)) {
                await api.delete(`/customer/saved-properties/${propertyId}`);
                setSavedStays(prev => prev.filter(id => id !== propertyId));
            } else {
                await api.post(`/customer/saved-properties/${propertyId}`);
                setSavedStays(prev => [...prev, propertyId]);
            }
        } catch (error) {
            console.error("Failed to toggle save", error);
        }
    };

    // Calculate derived min price for a property
    const getPropertyPrice = (p) => {
        if (p.rooms && p.rooms.length > 0) {
            return Math.min(...p.rooms.map(r => r.basePrice || r.price || 999999));
        }
        return p.price || 0;
    };

    // Filtering & Sorting Logic
    const filteredProperties = useMemo(() => {
        let results = properties.filter(p => p.status === 'approved' || p.status === 'Available');

        // Location Filter (fuzzy search)
        if (appliedSearchLoc) {
            const locQuery = appliedSearchLoc.toLowerCase();
            results = results.filter(p => 
                p.location?.toLowerCase().includes(locQuery) || 
                p.city?.toLowerCase().includes(locQuery) ||
                p.name?.toLowerCase().includes(locQuery)
            );
        }

        // Price Filter
        results = results.filter(p => {
            const price = getPropertyPrice(p);
            return price >= priceRange[0] && price <= priceRange[1];
        });

        // Type Filter
        if (selectedTypes.length > 0) {
            results = results.filter(p => p.propertyType && selectedTypes.includes(p.propertyType));
        }

        // Amenities Filter
        if (selectedAmenities.length > 0) {
            results = results.filter(p => {
                const pAmens = (p.amenities || []).map(a => a.toLowerCase());
                return selectedAmenities.every(req => pAmens.includes(req.toLowerCase()));
            });
        }

        // Rating Filter
        if (minRating > 0) {
            results = results.filter(p => (p.rating || 0) >= minRating);
        }

        // Sort
        switch (sortBy) {
            case 'priceAsc':
                results.sort((a, b) => getPropertyPrice(a) - getPropertyPrice(b));
                break;
            case 'priceDesc':
                results.sort((a, b) => getPropertyPrice(b) - getPropertyPrice(a));
                break;
            case 'rating':
                results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case 'recommended':
            default:
                // Default sort (perhaps closest match or newest)
                break;
        }

        return results;
    }, [properties, appliedSearchLoc, priceRange, selectedTypes, selectedAmenities, minRating, sortBy]);

    // Reset pagination when filters change
    useEffect(() => {
        setVisibleCount(12);
    }, [filteredProperties]);

    const visibleProperties = filteredProperties.slice(0, visibleCount);

    return (
        <div className="w-full pb-24 md:pb-12 h-full">
            {/* Top Search Banner - Pill Style from Home.jsx */}
            <div className="w-full relative z-[150] mb-8" ref={datePickerRef}>
                <div className="flex flex-col md:flex-row bg-white rounded-3xl md:rounded-full md:items-center p-2 shadow-sm border border-gray-200 min-h-[5rem] md:h-20 gap-1 md:gap-0 relative">
                  
                  {/* Location */}
                  <div className="relative w-full md:w-auto flex-[1.5] flex flex-col justify-center px-6 py-3 md:py-0 md:h-full border-b md:border-b-0 border-gray-200 rounded-2xl md:rounded-full bg-orange-50 hover:bg-orange-100/50 transition-colors">
                    <label className="text-[11px] font-bold tracking-wider text-orange-600 mb-1 uppercase">Location</label>
                    <input
                      type="text"
                      placeholder="Where are you going?"
                      value={searchLoc}
                      onFocus={() => setActivePopup('location')}
                      onChange={(e) => {
                          setSearchLoc(e.target.value);
                          setActivePopup('location');
                      }}
                      onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                              e.preventDefault();
                              setAppliedSearchLoc(searchLoc);
                              setActivePopup(null);
                          }
                      }}
                      className="w-full outline-none text-gray-900 font-bold text-base md:text-lg placeholder-orange-300 bg-transparent capitalize tracking-tight"
                    />

                    {/* Autocomplete Dropdown */}
                    {activePopup === 'location' && (
                        <div className="absolute top-full left-0 mt-3 w-full md:w-[320px] bg-white rounded-3xl shadow-[0_12px_40px_rgb(0,0,0,0.12)] border border-gray-100 z-50 p-4 max-h-[340px] overflow-y-auto">
                            <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-3 pl-2">Popular Destinations</h3>
                            {uniqueLocations.filter(loc => loc.toLowerCase().includes(searchLoc.toLowerCase())).slice(0, 6).map((loc, idx) => (
                                <div 
                                    key={idx}
                                    className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-2xl cursor-pointer transition-colors"
                                    onClick={() => { 
                                        setSearchLoc(loc);
                                        setAppliedSearchLoc(loc); 
                                        setActivePopup(null); 
                                    }}
                                >
                                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                                        <MapPin size={18} className="text-gray-500" />
                                    </div>
                                    <span className="font-bold text-gray-800 text-base">{loc}</span>
                                </div>
                            ))}
                            {uniqueLocations.filter(loc => loc.toLowerCase().includes(searchLoc.toLowerCase())).length === 0 && (
                                <div className="p-4 text-center text-gray-500 font-medium">No destinations found.</div>
                            )}
                        </div>
                    )}
                  </div>

                  {/* Check-in */}
                  <div 
                    className={`w-full md:w-auto flex-1 flex flex-col justify-center px-6 py-3 md:py-0 border-b md:border-b-0 md:border-r border-gray-200 cursor-pointer rounded-xl md:rounded-2xl transition-colors ${activePopup === 'checkIn' ? 'bg-gray-100 shadow-inner' : 'hover:bg-gray-50'}`}
                    onClick={() => setActivePopup(activePopup === 'checkIn' ? null : 'checkIn')}
                  >
                    <label className="text-xs font-bold tracking-wider text-gray-900 mb-1 cursor-pointer">CHECK IN</label>
                    <div className={`text-sm ${checkIn ? 'text-[#FF405A] font-bold' : 'text-gray-400 font-medium'}`}>
                      {checkIn ? formatDate(checkIn) : 'Add dates'}
                    </div>
                  </div>

                  {/* Check-out */}
                  <div 
                    className={`w-full md:w-auto flex-1 flex flex-col justify-center px-6 py-3 md:py-0 border-b md:border-b-0 md:border-r border-gray-200 cursor-pointer rounded-xl md:rounded-2xl transition-colors ${activePopup === 'checkOut' ? 'bg-gray-100 shadow-inner' : 'hover:bg-gray-50'}`}
                    onClick={() => setActivePopup(activePopup === 'checkOut' ? null : 'checkOut')}
                  >
                    <label className="text-xs font-bold tracking-wider text-gray-900 mb-1 cursor-pointer">CHECK OUT</label>
                    <div className={`text-sm ${checkOut ? 'text-[#FF405A] font-bold' : 'text-gray-400 font-medium'}`}>
                      {checkOut ? formatDate(checkOut) : 'Add dates'}
                    </div>
                  </div>

                  {/* Guests block with inline counter */}
                  <div className="w-full md:w-auto flex-[1.5] flex flex-col md:flex-row items-start md:items-center justify-between px-4 md:px-6 md:pl-6 md:pr-2 py-3 md:py-0">
                    <div className="flex flex-col mb-3 md:mb-0 w-full">
                      <label className="text-xs font-bold tracking-wider text-gray-900 mb-1">GUESTS</label>
                      <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setGuests(Math.max(1, guests - 1))} 
                            className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 hover:border-gray-300 transition-colors shadow-sm text-gray-700 font-bold"
                        >
                            -
                        </button>
                        <span className="text-sm font-bold text-gray-900 min-w-[20px] text-center">{guests}</span>
                        <button 
                            onClick={() => setGuests(guests + 1)} 
                            className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 hover:border-gray-300 transition-colors shadow-sm text-gray-700 font-bold"
                        >
                            +
                        </button>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 mt-2 md:mt-0 ml-auto w-full md:w-auto justify-end">
                      {/* Mobile Filters Toggle Button */}
                      <button 
                          onClick={() => setShowFilters(!showFilters)}
                          className="lg:hidden w-12 h-12 flex items-center justify-center bg-gray-900 text-white rounded-2xl flex-shrink-0 shadow-md active:scale-95 transition-all"
                      >
                           <SlidersHorizontal size={18} />
                      </button>

                      {/* Explicit Search Apply Button */}
                      <button
                        onClick={(e) => { 
                            e.preventDefault(); 
                            setAppliedSearchLoc(searchLoc); 
                            setActivePopup(null); 
                        }}
                        className="w-12 h-12 md:w-14 items-center justify-center md:h-14 bg-[#FF405A] hover:bg-red-500 text-white rounded-2xl md:rounded-full flex transition shadow-md flex-shrink-0"
                      >
                        <Search size={20} className="stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Horizontal Scroll Date Picker Popover */}
                {(activePopup === 'checkIn' || activePopup === 'checkOut') && (
                    <div className="absolute top-[102%] md:top-24 left-1/2 transform -translate-x-1/2 bg-white rounded-2xl shadow-xl border border-gray-200 p-6 w-[95%] md:w-[700px] z-[200]">
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
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start relative">
                
                {/* Flipkart Style Sidebar Filter */}
                <div className={`
                    fixed lg:sticky top-0 lg:top-28 left-0 h-screen lg:h-[calc(100vh-140px)] w-full lg:w-72 bg-white z-[200] lg:z-10
                    shadow-2xl lg:shadow-sm border-r lg:border border-gray-200 p-6 lg:rounded-2xl transition-transform duration-300
                    ${showFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    overflow-y-auto scrollbar-hide
                `}>
                    <div className="flex justify-between items-center mb-6 lg:mb-4 pb-4 border-b border-gray-100">
                        <h2 className="text-xl font-bold font-heading flex items-center gap-2 text-gray-900">
                            <Filter size={20} className="text-[#FF405A]" /> Filters
                        </h2>
                        <button className="lg:hidden text-gray-500 hover:bg-gray-100 p-2 rounded-lg" onClick={() => setShowFilters(false)}>
                            <ChevronRight />
                        </button>
                        <button 
                            className="hidden lg:block text-xs font-bold text-[#FF405A] hover:underline uppercase tracking-wider"
                            onClick={() => {
                                setPriceRange([0, 50000]);
                                setSelectedTypes([]);
                                setSelectedAmenities([]);
                                setMinRating(0);
                            }}
                        >
                            Reset
                        </button>
                    </div>

                    {/* Price Range */}
                    <div className="mb-8">
                        <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Price Range (₹)</h3>
                        <div className="flex items-center gap-3">
                            <input 
                                type="number" 
                                value={priceRange[0]} 
                                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 font-medium" 
                                min="0"
                            />
                            <span className="text-gray-400">-</span>
                            <input 
                                type="number" 
                                value={priceRange[1]} 
                                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 font-medium" 
                            />
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max="50000" 
                            step="500"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                            className="w-full mt-4 accent-[#FF405A]"
                        />
                    </div>

                    {/* Property Type */}
                    <div className="mb-8">
                        <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Property Type</h3>
                        <div className="space-y-3">
                            {propertyTypes.map(type => (
                                <label key={type} onClick={(e) => { e.preventDefault(); toggleType(type); }} className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedTypes.includes(type) ? 'bg-[#FF405A] border-[#FF405A]' : 'border-gray-300 group-hover:border-gray-400 bg-white'}`}>
                                        {selectedTypes.includes(type) && <Check size={14} className="text-white stroke-[3]"/>}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">{type}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Amenities */}
                    <div className="mb-8">
                        <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Popular Amenities</h3>
                        <div className="space-y-3">
                            {commonAmenities.map(amenity => (
                                <label key={amenity} onClick={(e) => { e.preventDefault(); toggleAmenity(amenity); }} className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedAmenities.includes(amenity) ? 'bg-[#FF405A] border-[#FF405A]' : 'border-gray-300 group-hover:border-gray-400 bg-white'}`}>
                                        {selectedAmenities.includes(amenity) && <Check size={14} className="text-white stroke-[3]"/>}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">{amenity}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Rating */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Guest Rating</h3>
                        <div className="flex gap-2">
                            {[3, 4, 4.5].map(rating => (
                                <button
                                    key={rating}
                                    onClick={() => setMinRating(rating === minRating ? 0 : rating)}
                                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all border ${minRating === rating ? 'bg-gray-900 text-white border-gray-900 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
                                >
                                    {rating}+ <Star size={14} className={minRating === rating ? 'fill-white' : 'fill-gray-400 text-gray-400'}/>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Sticky CTA */}
                    <div className="lg:hidden sticky bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-100 mt-8 -mx-6 -mb-6">
                         <button 
                            className="w-full bg-[#FF405A] text-white font-bold py-3 rounded-xl shadow-md"
                            onClick={() => setShowFilters(false)}
                         >
                            Show {filteredProperties.length} Results
                         </button>
                    </div>
                </div>

                {/* Results Main Area */}
                <div className="flex-1 w-full min-w-0">
                    
                    {/* Header line */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 gap-4">
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                            {filteredProperties.length} {filteredProperties.length === 1 ? 'stay' : 'stays'} available
                            {searchLoc && <span className="font-normal text-gray-500 inline-block ml-1">in a nearby search</span>}
                        </h1>
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest shrink-0 hidden sm:block">Sort By</span>
                            <div className="relative group">
                                <select 
                                    value={sortBy} 
                                    onChange={e => setSortBy(e.target.value)}
                                    className="appearance-none bg-white border-2 border-gray-200 text-gray-800 text-sm font-bold rounded-xl focus:border-[#FF405A] focus:ring-4 focus:ring-[#FF405A]/10 block w-full sm:w-56 p-2.5 pl-4 pr-10 outline-none cursor-pointer transition-all hover:border-gray-300 shadow-sm"
                                >
                                    <option value="recommended">Recommended Picks</option>
                                    <option value="priceAsc">Price: Low to High</option>
                                    <option value="priceDesc">Price: High to Low</option>
                                    <option value="rating">Top Rated Stays</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 group-hover:text-gray-800 transition-colors">
                                    <ArrowUpDown size={16} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {[...Array(9)].map((_, i) => (
                                <div key={i} className="animate-pulse bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-[340px]">
                                    <div className="w-full h-48 bg-gray-200"></div>
                                    <div className="p-5 flex flex-col gap-3 flex-1">
                                        <div className="flex justify-between w-full">
                                            <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                                            <div className="h-5 bg-gray-200 rounded w-1/5"></div>
                                        </div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                        
                                        <div className="mt-auto flex justify-between items-end pt-4 border-t border-gray-50">
                                            <div className="h-5 bg-gray-200 rounded w-1/3 mb-1"></div>
                                            <div className="h-10 bg-gray-200 rounded-lg w-1/4"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredProperties.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-16 text-center">
                            <img src="https://illustrations.popsy.co/amber/falling.svg" className="h-48 mx-auto mb-6 opacity-60" alt="No results" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">No exact matches found</h2>
                            <p className="text-gray-500 text-lg">Try adjusting your filters or searching a different area.</p>
                            <button 
                                onClick={() => {
                                    setSearchLoc('');
                                    setAppliedSearchLoc('');
                                    setPriceRange([0, 50000]);
                                    setSelectedAmenities([]);
                                    setMinRating(0);
                                }}
                                className="mt-8 px-6 py-3 bg-gray-900 text-white font-bold rounded-xl shadow-md hover:bg-black transition-colors"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {visibleProperties.map(property => {
                                    const price = getPropertyPrice(property);
                                    const isSaved = savedStays.includes(property._id || property.id);

                                    return (
                                    <div
                                        key={property.id || property._id}
                                        onClick={() => navigate(`/customer/property/${property.id || property._id}`)}
                                        className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 flex flex-col"
                                    >
                                        {/* Image Container */}
                                        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                                            <img
                                                src={property.coverImage || property.image || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb"}
                                                alt={property.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                            
                                            {/* Save Favicon */}
                                            <div 
                                                className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow hover:scale-110 transition cursor-pointer z-10"
                                                onClick={(e) => toggleSave(e, property.id || property._id)}
                                            >
                                                <Heart size={18} className={`transition-colors ${isSaved ? "fill-[#FF405A] text-[#FF405A]" : "text-gray-600"} stroke-[2.5]`} />
                                            </div>

                                            {property.rating > 4.8 && (
                                                <div className="absolute top-4 left-0 bg-[#FF405A] text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-r-md shadow-md">
                                                    Guest Favorite
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="p-4 flex flex-col flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="font-bold text-lg text-gray-900 tracking-tight truncate pr-4">{property.name}</h3>
                                                <div className="flex items-center space-x-1 shrink-0 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                                                    <Star className="text-gray-900 fill-gray-900" size={12} />
                                                    <span className="font-bold text-[13px] text-gray-900">{property.rating?.toFixed(1) || "New"}</span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-500 mb-1 flex items-center gap-1 font-medium truncate">
                                                <MapPin size={12}/> {property.location?.split(',')[0] || property.city || 'Location'}
                                            </p>
                                            <p className="text-xs text-gray-400 mb-4 capitalize">{property.propertyType || "Stay Here Property"}</p>
                                            
                                            <div className="mt-auto flex items-end justify-between pt-4 border-t border-gray-50">
                                                <div>
                                                    <span className="text-xl font-bold text-gray-900">₹{price}</span>
                                                    <span className="text-sm font-medium text-gray-500 ml-1">/ night</span>
                                                </div>
                                                {(property.rooms?.length > 1) && (
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF405A] bg-red-50 px-2 py-1 rounded-full border border-red-100">
                                                        {property.rooms.length} configs
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )})}
                            </div>
                            
                            {/* Load More Option */}
                            {visibleCount < filteredProperties.length && (
                                <div className="mt-12 text-center pb-8 border-t border-gray-200 pt-8 mt-8">
                                    <p className="text-gray-500 font-medium mb-4">
                                        Showing {visibleCount} of {filteredProperties.length} matching stays
                                    </p>
                                    <button 
                                        onClick={() => setVisibleCount(prev => prev + 12)}
                                        className="bg-gray-900 hover:bg-black text-white px-8 py-3.5 rounded-xl font-bold shadow-md transition-all active:scale-95"
                                    >
                                        Explore More Properties
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Explore;
