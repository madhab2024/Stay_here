import { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createBooking } from '../../api/bookingApi';
import { ChevronLeft, Check, ShieldCheck, MapPin, Users, Calendar, Info, Minus, Plus } from 'lucide-react';

const Booking = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { property, room } = location.state || {};

    const [checkIn, setCheckIn] = useState(null);
    const [checkOut, setCheckOut] = useState(null);
    const [guests, setGuests] = useState(1);
    const [guestDetails, setGuestDetails] = useState([{ name: '', email: '', phone: '' }]);
    const [savedGuestsList, setSavedGuestsList] = useState([]);
    const [saveGuests, setSaveGuests] = useState(true);
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [activePopup, setActivePopup] = useState(null);
    const scrollContainerRef = useRef(null);
    const datePickerRef = useRef(null);

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

    // Load Saved Guests
    useEffect(() => {
        const saved = localStorage.getItem('saved_guests_info');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setSavedGuestsList(parsed);
                    setGuestDetails(parsed);
                    setGuests(parsed.length);
                }
            } catch(e) {}
        }
    }, [room]);

    const handleAutofillGuest = (formIndex, evtValue) => {
        if (evtValue === "") return;
        const selectedGuest = savedGuestsList[parseInt(evtValue)];
        if (!selectedGuest) return;
        
        setGuestDetails(prev => {
            const updated = [...prev];
            updated[formIndex] = { ...updated[formIndex], name: selectedGuest.name || '', email: selectedGuest.email || '', phone: selectedGuest.phone || '' };
            return updated;
        });
    };

    const handleGuestChange = (newCount) => {
        if (newCount < 1 || newCount > (room?.capacity?.total || 4)) return;
        setGuests(newCount);
        setGuestDetails(prev => {
            const updated = [...prev];
            if (newCount > prev.length) {
                for (let i = prev.length; i < newCount; i++) {
                    updated.push({ name: '', email: '', phone: '' });
                }
            } else if (newCount < prev.length) {
                updated.splice(newCount);
            }
            return updated;
        });
    };

    const handleGuestDetailChange = (index, field, value) => {
        setGuestDetails(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const formatDate = (date) => {
        if (!date) return '';
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const datesList = useMemo(() => {
        const dates = [];
        const today = new Date();
        today.setHours(0,0,0,0);
        for (let i = 0; i < 60; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            dates.push(d);
        }
        return dates;
    }, []);

    const scrollDates = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = direction === 'left' ? -250 : 250;
            scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const handleSelectDate = (date) => {
        if (activePopup === 'checkIn') {
            setCheckIn(date);
            if (!checkOut || date >= checkOut) setCheckOut(null);
            setActivePopup('checkOut');
        } else if (activePopup === 'checkOut') {
            if (checkIn && date <= checkIn) {
                setCheckIn(date);
                setCheckOut(null);
                setActivePopup('checkOut');
            } else {
                setCheckOut(date);
                setActivePopup(null);
            }
        }
    };

    useEffect(() => {
        if (!property || !room) {
            navigate('/customer'); // Redirect if accessed directly without state
        }
        window.scrollTo(0, 0);
    }, [property, room, navigate]);

    if (!property || !room) return null;

    // Calculate Nights
    const calculateNights = () => {
        if (!checkIn || !checkOut) return 0;
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const nights = calculateNights();
    const basePrice = room.basePrice || room.price || 0;
    const roomTotal = basePrice * (nights || 1); // default to 1 night for display if 0
    const taxes = Math.floor(roomTotal * 0.18); // 18% GST typical
    const grandTotal = roomTotal + taxes;

    const handleConfirmBooking = async (e) => {
        e.preventDefault();
        setError('');

        if (nights === 0) {
            setError("Please select valid check-in and check-out dates.");
            return;
        }

        const incomplete = guestDetails.some(g => !g.name || !g.email || !g.phone);
        if (incomplete) {
            setError("Please fill in details for all guests.");
            return;
        }

        if (saveGuests) {
            localStorage.setItem('saved_guests_info', JSON.stringify(guestDetails));
        } else {
            localStorage.removeItem('saved_guests_info');
        }

        setLoading(true);

        try {
            await createBooking({
                propertyId: property.id,
                roomId: room._id || room.id,
                checkIn: checkIn ? new Date(checkIn.getTime() - (checkIn.getTimezoneOffset() * 60000)).toISOString().split('T')[0] : null,
                checkOut: checkOut ? new Date(checkOut.getTime() - (checkOut.getTimezoneOffset() * 60000)).toISOString().split('T')[0] : null,
                guests,
                guestDetails
            });

            navigate('/customer/profile/bookings', { state: { bookingSuccess: true } });
        } catch (err) {
            setError(err.response?.data?.error || 'Booking failed. Please check your details and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-24">
            {/* Simple Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ChevronLeft size={24} className="text-gray-700" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-900 tracking-tight">Confirm your booking</h1>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 pt-8">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    
                    {/* Left Column: Forms */}
                    <div className="flex-1 space-y-8">
                        
                        {/* Dates & Guests */}
                        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your trip details</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative" ref={datePickerRef}>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 uppercase tracking-widest text-[11px]">Check-in Date</label>
                                    <div 
                                        className={`relative border rounded-xl p-3 cursor-pointer transition-colors ${activePopup === 'checkIn' ? 'border-[#FF405A] ring-2 ring-[#FF405A]/20 bg-rose-50' : 'border-gray-200 bg-gray-50 hover:border-gray-300'}`}
                                        onClick={() => setActivePopup(activePopup === 'checkIn' ? null : 'checkIn')}
                                    >
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <div className="pl-8 text-gray-900 font-medium">
                                            {checkIn ? formatDate(checkIn) : <span className="text-gray-400">Add dates</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 uppercase tracking-widest text-[11px]">Check-out Date</label>
                                    <div 
                                        className={`relative border rounded-xl p-3 cursor-pointer transition-colors ${activePopup === 'checkOut' ? 'border-[#FF405A] ring-2 ring-[#FF405A]/20 bg-rose-50' : 'border-gray-200 bg-gray-50 hover:border-gray-300'}`}
                                        onClick={() => setActivePopup(activePopup === 'checkOut' ? null : 'checkOut')}
                                    >
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <div className="pl-8 text-gray-900 font-medium">
                                            {checkOut ? formatDate(checkOut) : <span className="text-gray-400">Add dates</span>}
                                        </div>
                                    </div>
                                </div>

                                {/* Shared Popup Date Picker */}
                                {(activePopup === 'checkIn' || activePopup === 'checkOut') && (
                                    <div className="absolute top-[80px] left-0 md:left-auto md:w-[600px] w-full bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] p-5 z-50 border border-gray-100 mt-2">
                                        <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <Calendar className="text-[#FF405A]" size={18} />
                                            Select {activePopup === 'checkIn' ? 'Check-in' : 'Check-out'} Date
                                        </h3>
                                        <div className="relative flex items-center group">
                                            <button 
                                                type="button" 
                                                onClick={(e) => { e.preventDefault(); scrollDates('left'); }} 
                                                className="absolute left-0 z-10 w-8 h-8 bg-white rounded-full shadow-md border border-gray-100 flex items-center justify-center text-gray-700 hover:text-[#FF405A] -ml-4 transition-colors"
                                            >
                                            <ChevronLeft size={20} className="mr-0.5" />
                                            </button>

                                            <div ref={scrollContainerRef} className="flex overflow-x-auto gap-2 pb-4 pt-1 scrollbar-hide snap-x scroll-smooth w-full px-2">
                                                {datesList.map((date, idx) => {
                                                    const isSelected = (activePopup === 'checkIn' && checkIn?.getTime() === date.getTime()) ||
                                                                    (activePopup === 'checkOut' && checkOut?.getTime() === date.getTime());
                                                    
                                                    const isDisabled = activePopup === 'checkOut' && checkIn && date <= checkIn;

                                                    return (
                                                        <button
                                                            key={idx}
                                                            type="button"
                                                            disabled={isDisabled}
                                                            onClick={(e) => { e.preventDefault(); handleSelectDate(date); }}
                                                            className={`snap-start flex flex-col items-center justify-center p-3 rounded-xl min-w-[70px] border transition-all flex-shrink-0 cursor-pointer ${
                                                                isDisabled ? 'opacity-30 cursor-not-allowed border-gray-100 bg-gray-50 text-gray-400' :
                                                                isSelected ? 'bg-[#FF405A] text-white border-[#FF405A] shadow-md scale-105' : 
                                                                'bg-white text-gray-800 border-gray-200 hover:border-[#FF405A]'
                                                            }`}
                                                        >
                                                            <span className={`text-[11px] font-bold uppercase tracking-wider ${isSelected ? 'text-white/90' : 'text-gray-400'}`}>
                                                                {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                                            </span>
                                                            <span className="text-xl font-bold mt-1 mb-0.5">
                                                                {date.getDate()}
                                                            </span>
                                                            <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-white/90' : 'text-gray-500'}`}>
                                                                {date.toLocaleDateString('en-US', { month: 'short' })}
                                                            </span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Number of Guests */}
                            <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-sm">Guests</h3>
                                    <p className="text-xs text-gray-500 mt-1">Maximum {room.capacity?.total || 4} allowed</p>
                                </div>
                                <div className="flex items-center gap-4 mt-4 md:mt-0">
                                    <button 
                                        type="button" 
                                        onClick={() => handleGuestChange(guests - 1)}
                                        disabled={guests <= 1}
                                        className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:border-gray-800 disabled:opacity-30 disabled:hover:border-gray-300 transition-colors bg-white shadow-sm"
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <span className="w-4 text-center font-bold text-gray-900 text-lg">{guests}</span>
                                    <button 
                                        type="button" 
                                        onClick={() => handleGuestChange(guests + 1)}
                                        disabled={guests >= (room.capacity?.total || 4)}
                                        className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:border-gray-800 disabled:opacity-30 disabled:hover:border-gray-300 transition-colors bg-white shadow-sm"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* Guest Details */}
                        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
                            <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Guest Information</h2>
                                    <p className="text-gray-500 text-sm">We'll use this to coordinate your stay.</p>
                                </div>
                                <label className="hidden md:flex items-center gap-2 cursor-pointer pt-1 group">
                                    <input 
                                        type="checkbox" 
                                        checked={saveGuests} 
                                        onChange={(e) => setSaveGuests(e.target.checked)} 
                                        className="w-5 h-5 rounded border-gray-300 text-[#FF405A] focus:ring-[#FF405A] cursor-pointer"
                                    />
                                    <span className="text-sm font-semibold text-gray-600 group-hover:text-gray-900 transition-colors">Save for next time</span>
                                </label>
                            </div>

                            <div className="md:hidden mb-6 mt-[-10px]">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input 
                                        type="checkbox" 
                                        checked={saveGuests} 
                                        onChange={(e) => setSaveGuests(e.target.checked)} 
                                        className="w-5 h-5 rounded border-gray-300 text-[#FF405A] focus:ring-[#FF405A] cursor-pointer"
                                    />
                                    <span className="text-sm font-semibold text-gray-600 group-hover:text-gray-900 transition-colors">Save for next time</span>
                                </label>
                            </div>

                            <div className="space-y-10">
                                {guestDetails.map((guest, idx) => (
                                    <div key={idx} className="relative">
                                        <div className="flex justify-between items-center mb-5 mt-[-10px] md:mt-0">
                                            {guestDetails.length > 1 ? (
                                                <h3 className="text-sm font-bold text-white bg-gray-900 inline-block px-3 py-1 rounded-md uppercase tracking-wider">Guest {idx + 1}</h3>
                                            ) : (
                                                <div className="hidden md:block h-6"></div>
                                            )}
                                            {savedGuestsList.length > 0 && (
                                                <select 
                                                    className="text-xs font-bold text-[#FF405A] bg-rose-50 border border-rose-100 rounded-lg px-3 py-1.5 outline-none cursor-pointer hover:bg-rose-100 transition-colors"
                                                    onChange={(e) => handleAutofillGuest(idx, e.target.value)}
                                                    value=""
                                                >
                                                    <option value="" disabled>Autofill from saved</option>
                                                    {savedGuestsList.map((sg, sgIdx) => (
                                                        <option key={sgIdx} value={sgIdx}>{sg.name || `Saved Guest ${sgIdx + 1}`}</option>
                                                    ))}
                                                </select>
                                            )}
                                        </div>
                                        <div className="space-y-5">
                                            <div>
                                                <label className="text-sm font-bold text-gray-700 mb-1 block">Full Name</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="E.g. John Doe"
                                                    value={guest.name}
                                                    onChange={(e) => handleGuestDetailChange(idx, 'name', e.target.value)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF405A] focus:border-transparent outline-none transition-all placeholder-gray-400"
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div>
                                                    <label className="text-sm font-bold text-gray-700 mb-1 block">Email Address</label>
                                                    <input 
                                                        type="email" 
                                                        placeholder="john@example.com"
                                                        value={guest.email}
                                                        onChange={(e) => handleGuestDetailChange(idx, 'email', e.target.value)}
                                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF405A] focus:border-transparent outline-none transition-all placeholder-gray-400"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-sm font-bold text-gray-700 mb-1 block">Phone Number</label>
                                                    <input 
                                                        type="tel" 
                                                        placeholder="+91 98765 43210"
                                                        value={guest.phone}
                                                        onChange={(e) => handleGuestDetailChange(idx, 'phone', e.target.value)}
                                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF405A] focus:border-transparent outline-none transition-all placeholder-gray-400"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Rules and Policies */}
                        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Ground rules</h2>
                            <p className="text-gray-600 mb-4 text-sm leading-relaxed">We ask every guest to remember a few simple things about what makes a great guest.</p>
                            <ul className="space-y-3 text-sm text-gray-700 font-medium">
                                <li className="flex items-center gap-3"><Check size={18} className="text-green-600" /> Follow the house rules</li>
                                <li className="flex items-center gap-3"><Check size={18} className="text-green-600" /> Treat your Host's home like your own</li>
                            </ul>
                        </section>

                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:w-[420px] shrink-0">
                        <div className="sticky top-28 space-y-6">
                            
                            {/* Summary Card */}
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                                {/* Hotel Mini Detail */}
                                <div className="p-5 border-b border-gray-100 flex gap-4">
                                    <img 
                                        src={property.coverImage || property.image || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb"} 
                                        alt={property.name}
                                        className="w-28 h-24 object-cover rounded-xl"
                                    />
                                    <div className="flex flex-col justify-center">
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Hotel</span>
                                        <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug mb-1">{property.name}</h3>
                                        <p className="text-xs text-gray-500 flex items-center gap-1 line-clamp-1"><MapPin size={12}/> {property.location}</p>
                                    </div>
                                </div>

                                {/* Room Detail */}
                                <div className="px-6 py-5 bg-gray-50/50 border-b border-gray-100">
                                    <h4 className="font-bold text-gray-900 mb-1">{room.type}</h4>
                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                        <Users size={14} className="text-gray-400"/> Up to {room.capacity?.total || 2} guests
                                    </p>
                                </div>

                                {/* Price Breakdown */}
                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 tracking-tight">Price details</h3>
                                    
                                    <div className="space-y-3 mb-4 border-b border-gray-100 pb-4">
                                        <div className="flex justify-between text-gray-600 text-[15px]">
                                            <span>₹{basePrice.toLocaleString()} x {nights || 1} {nights <= 1 ? 'night' : 'nights'}</span>
                                            <span className="font-medium text-gray-900">₹{roomTotal.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600 text-[15px]">
                                            <span className="flex items-center gap-1">Taxes & fees <Info size={14} className="text-gray-400" /></span>
                                            <span className="font-medium text-gray-900">₹{taxes.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center bg-green-50/80 p-4 rounded-xl border border-green-100 mb-6">
                                        <span className="font-bold text-gray-900 text-lg">Total Payable</span>
                                        <span className="font-black text-2xl text-green-700 tracking-tight">₹{grandTotal.toLocaleString()}</span>
                                    </div>

                                    {error && (
                                        <div className="mb-4 p-3 rounded-lg bg-red-50 text-sm font-medium text-red-700 flex items-start gap-2 border border-red-100">
                                            <span className="mt-0.5">⚠️</span> {error}
                                        </div>
                                    )}

                                    <button 
                                        onClick={handleConfirmBooking}
                                        disabled={loading}
                                        className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-md transform active:scale-[0.98] ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#FF405A] hover:bg-[#e0354d] hover:shadow-lg'}`}
                                    >
                                        {loading ? 'Processing...' : 'Request to book'}
                                    </button>
                                </div>
                            </div>
                            
                            {/* Assurances */}
                            <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-2xl bg-white shadow-sm">
                                <ShieldCheck size={28} className="text-teal-600 shrink-0" />
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">Secure Booking</h4>
                                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">Your data is fully protected and Stay Here guarantees maximum security during your transactions.</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Booking;
