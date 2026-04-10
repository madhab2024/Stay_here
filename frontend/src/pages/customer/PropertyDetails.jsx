import { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProperties } from '../../context/PropertyContext';
import { Star, Heart, Share, ArrowLeft, MapPin, Check, ChevronRight, Users, BedDouble, Send } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../auth/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';

const PropertyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { properties, loading } = useProperties();
    // Assuming ID is string now from API mapping
    const property = properties.find(p => p.id === id);

    const relatedProperties = useMemo(() => {
        if (!properties || properties.length === 0 || !property) return [];
        // Grab other properties
        const others = properties.filter(p => p.id !== property.id && p.status === 'approved');
        // Return 4 random ones
        return [...others].sort(() => 0.5 - Math.random()).slice(0, 4);
    }, [properties, property]);

    const roomsRef = useRef(null);
    const { user } = useAuth();
    const [liveProperty, setLiveProperty] = useState(null);
    const [propertyLoading, setPropertyLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    
    // Review form state
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'auto' });
        if (id) {
            fetchProperty();
            fetchReviews();
        }
    }, [id]);

    useEffect(() => {
        if (liveProperty) {
            const savedProps = JSON.parse(localStorage.getItem('saved_properties') || '[]');
            setIsSaved(savedProps.some(p => p.id === liveProperty._id || p.id === liveProperty.id));
        }
    }, [liveProperty]);

    const fetchProperty = async () => {
        setPropertyLoading(true);
        try {
            const res = await api.get(`/properties/${id}`);
            if (res.data.success) {
                setLiveProperty({
                    ...res.data.data,
                    id: res.data.data._id
                });
            }
        } catch (error) {
            console.error("Error fetching property:", error);
        } finally {
            setPropertyLoading(false);
        }
    };

    const fetchReviews = async () => {
        if (!id) return;
        setReviewsLoading(true);
        try {
            const res = await api.get(`/reviews/property/${id}`);
            if (res.data.success) {
                setReviews(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setReviewsLoading(false);
        }
    };

    const handleRatingSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }
        if (!comment.trim()) return;

        setSubmitting(true);
        try {
            const res = await api.post('/reviews', {
                propertyId: id,
                rating,
                comment
            });
            if (res.data.success) {
                setComment('');
                setRating(5);
                fetchReviews();
                fetchProperty(); // Refresh property to get new avg rating
                alert("Review submitted successfully!");
            }
        } catch (error) {
            alert(error.response?.data?.message || error.response?.data?.error || "Failed to submit review. Make sure you have booked this property.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleSave = () => {
        const savedProps = JSON.parse(localStorage.getItem('saved_properties') || '[]');
        let newSavedProps;
        const currentProp = liveProperty || property;
        if (!currentProp) return;

        if (isSaved) {
            newSavedProps = savedProps.filter(p => p.id !== currentProp.id);
        } else {
            newSavedProps = [...savedProps, currentProp];
        }
        localStorage.setItem('saved_properties', JSON.stringify(newSavedProps));
        setIsSaved(!isSaved);
    };

    const handleShare = async () => {
        const currentProp = liveProperty || property;
        if (!currentProp) return;
        const shareData = {
            title: currentProp.name,
            text: `Check out ${currentProp.name} on Stay Here!`,
            url: window.location.href,
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
            }
        } catch (err) {
            console.log("Share cancelled or failed");
        }
    };

    const handleCheckAvailability = () => {
        if (roomsRef.current) {
            const yOffset = -120; // Compensate for sticky header offsets
            const y = roomsRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    const handleRoomSelect = (room) => {
        const currentProp = liveProperty || property;
        navigate('/customer/book', { state: { property: currentProp, room } });
    };

    if (loading || propertyLoading) return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-3/4 md:w-1/2 mb-4"></div>
            <div className="flex gap-4 mb-6">
                <div className="h-5 bg-gray-200 rounded w-24"></div>
                <div className="h-5 bg-gray-200 rounded w-32"></div>
                <div className="h-5 bg-gray-200 rounded w-40"></div>
            </div>
            <div className="w-full max-w-6xl mx-auto h-[220px] sm:h-[280px] md:h-[340px] bg-gray-200 rounded-[24px] mb-12"></div>
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12">
                <div>
                    <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-10"></div>
                    <div className="space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                </div>
                <div>
                    <div className="h-[400px] bg-gray-200 rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
                        <div className="space-y-4">
                            <div className="h-12 bg-gray-300 rounded w-full"></div>
                            <div className="h-12 bg-gray-300 rounded w-full"></div>
                            <div className="h-14 bg-gray-300 rounded-xl w-full mt-4"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (!liveProperty && !property && !loading && !propertyLoading) {
        return (
            <div className="text-center py-24">
                <h2 className="text-2xl font-bold text-gray-800">Property not found or unavailable</h2>
                <button onClick={() => navigate(-1)} className="text-[#FF405A] hover:text-red-700 mt-4 inline-block font-bold">
                    &larr; Go Back
                </button>
            </div>
        );
    }

    const currentProp = liveProperty || property;
    
    if (!currentProp) return null;

    const minPrice = currentProp.rooms && currentProp.rooms.length > 0
        ? Math.min(...currentProp.rooms.map(r => r.basePrice || r.price || 0))
        : (currentProp.price || 0);

    return (
        <div className="bg-white pb-24 relative">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

                {/* Header Section (Title & Meta) */}
                <div className="mb-6">
                    <h1 className="text-[28px] md:text-3xl font-semibold text-gray-900 mb-2 tracking-tight">
                        {currentProp.name}
                    </h1>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-gray-800">
                            {(currentProp.rating > 0) && (
                                <>
                                    <span className="flex items-center gap-1">
                                        <Star size={15} className="fill-gray-900 text-gray-900" />
                                        {currentProp.rating.toFixed(1)}
                                    </span>
                                    <span className="text-gray-400">·</span>
                                    <span className="underline cursor-pointer hover:text-gray-600">
                                        {currentProp.reviewCount} reviews
                                    </span>
                                    <span className="text-gray-400 px-1">·</span>
                                </>
                            )}

                            {currentProp.propertyType && (
                                <>
                                    <span className="text-gray-600 capitalize">
                                        {currentProp.propertyType}
                                    </span>
                                    <span className="text-gray-400 px-1">·</span>
                                </>
                            )}

                            <span className="underline font-semibold cursor-pointer hover:text-gray-600">
                                {currentProp.location}
                            </span>
                        </div>

                        <div className="flex items-center gap-4 text-sm font-medium text-gray-700">
                            <button onClick={handleShare} className="flex items-center gap-2 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors">
                                <Share size={16} /> Share
                            </button>
                            <button onClick={handleSave} className="flex items-center gap-2 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors">
                                <Heart size={16} className={`transition-colors ${isSaved ? "fill-[#FF405A] text-[#FF405A]" : ""}`} /> {isSaved ? "Saved" : "Save"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Hero Image */}
                <div className="relative w-full max-w-6xl mx-auto h-[220px] sm:h-[280px] md:h-[340px] rounded-[24px] overflow-hidden mb-12 shadow-sm group border border-gray-100">
                    <img
                        src={currentProp.coverImage || currentProp.image || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb"}
                        alt={currentProp.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                </div>

                {/* Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12">

                    {/* Left Column (Details, Amenities, Rooms) */}
                    <div>
                        {/* Host snippet / Meta */}
                        <div className="flex items-center justify-between pb-6 border-b border-gray-200">
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                                    Hosted by Official Verified Partner
                                </h2>
                                <p className="text-gray-500 font-normal">
                                    {currentProp.amenities?.length || 5} guests · {currentProp.rooms?.length || 1} bedroom · {currentProp.rooms?.reduce((a, b) => a + b.count, 0) || 1} bed · 1 bath
                                </p>
                            </div>
                            <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center shrink-0 border border-gray-300 shadow-sm overflow-hidden">
                                <span className="text-gray-500 font-bold text-xl">S</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="py-8 border-b border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">About this space</h3>
                            <div className="text-gray-700 font-normal leading-relaxed text-[16px]">
                                {currentProp.description?.split('\n').map((line, idx) => (
                                    <p key={idx} className="mb-4">{line}</p>
                                ))}
                            </div>
                            <button className="flex items-center underline font-semibold mt-2 text-gray-900 hover:text-gray-600">
                                Show more <ChevronRight size={16} />
                            </button>
                        </div>

                        {/* Amenities */}
                        {currentProp.amenities && currentProp.amenities.length > 0 && (
                            <div className="py-8 border-b border-gray-200">
                                <h3 className="text-xl font-semibold text-gray-900 mb-6">What this place offers</h3>
                                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                                    {currentProp.amenities.slice(0, 8).map((amenity, idx) => (
                                        <div key={idx} className="flex items-center text-gray-700">
                                            <Check size={20} className="mr-4 text-gray-500 shrink-0" />
                                            <span className="font-normal">{amenity}</span>
                                        </div>
                                    ))}
                                </div>
                                {currentProp.amenities.length > 8 && (
                                    <button className="mt-8 px-6 py-3 border border-gray-900 rounded-lg font-semibold text-gray-900 hover:bg-gray-50 transition-colors">
                                        Show all {currentProp.amenities.length} amenities
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Available Rooms */}
                        <div className="py-8" ref={roomsRef}>
                            <h3 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">Select your room</h3>

                            {!currentProp.rooms || currentProp.rooms.length === 0 ? (
                                <div className="text-gray-500 bg-gray-50 p-8 rounded-2xl border border-gray-200 text-center">
                                    <h4 className="font-semibold text-lg mb-2 text-gray-800">No rooms listed right now</h4>
                                    <p>Please contact the host for availability and rates.</p>
                                </div>
                            ) : (
                                <div className="grid gap-6">
                                    {currentProp.rooms.map((room, index) => (
                                        <div key={index} className="border border-gray-200 rounded-3xl p-6 md:p-8 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:border-gray-300 transition-all duration-300 bg-white flex flex-col xl:flex-row justify-between gap-8 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-pink-50 to-rose-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                                            
                                            <div className="flex-1 relative z-10">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="text-2xl font-bold tracking-tight text-gray-900">{room.type}</h4>
                                                    <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase border border-green-100 flex-shrink-0">
                                                        {room.count} Left
                                                    </div>
                                                </div>
                                                
                                                <p className="text-gray-500 mb-5 text-[15px] max-w-xl">{room.description || "A beautifully appointed space designed for maximum comfort and relaxation during your stay."}</p>
                                                
                                                {/* Capacity Details */}
                                                <div className="flex flex-wrap items-center gap-3 mt-3 mb-6 text-sm font-medium text-gray-700">
                                                    <div className="flex items-center gap-2 bg-gray-50/80 px-4 py-2.5 rounded-xl border border-gray-100">
                                                        <Users size={18} className="text-gray-400" />
                                                        <span>Up to {room.capacity?.total || 2} guests</span>
                                                        {room.capacity?.children > 0 && <span className="text-gray-400 text-xs ml-0.5">({room.capacity.children} ch)</span>}
                                                    </div>
                                                    <div className="flex items-center gap-2 bg-gray-50/80 px-4 py-2.5 rounded-xl border border-gray-100">
                                                        <BedDouble size={18} className="text-gray-400" />
                                                        <span>{room.type?.includes("Suite") ? "1 King Bed" : "1 Queen Bed"}</span>
                                                    </div>
                                                </div>

                                                {/* Room Amenities */}
                                                {room.amenities && room.amenities.length > 0 && (
                                                    <div className="flex flex-wrap gap-2.5 mb-2 mt-4">
                                                        {room.amenities.map((amenity, idx) => (
                                                            <span key={idx} className="flex items-center gap-2 text-[13px] font-semibold text-gray-600 bg-white border border-gray-200 px-3.5 py-1.5 rounded-lg shadow-sm">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>{amenity}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Pricing and Action */}
                                            <div className="shrink-0 flex flex-col xl:items-end xl:justify-center border-t xl:border-t-0 xl:border-l border-gray-100 pt-6 xl:pt-0 xl:pl-8 relative z-10 w-full xl:w-[220px]">
                                                <div className="flex flex-row xl:flex-col justify-between items-center xl:items-end w-full mb-4 xl:mb-6">
                                                    <div className="flex flex-col xl:items-end">
                                                        <div className="text-gray-400 text-sm font-semibold mb-1 line-through xl:text-right">₹{Math.floor((room.basePrice || room.price || 0) * 1.2)}</div>
                                                        <div className="flex items-baseline gap-1">
                                                            <span className="text-4xl font-black text-[#FF405A] tracking-tighter">₹{room.basePrice || room.price}</span>
                                                        </div>
                                                        <div className="text-gray-500 text-[11px] font-bold mt-1 uppercase tracking-widest text-right">+ Taxes</div>
                                                    </div>
                                                </div>
                                                
                                                <button
                                                    onClick={() => handleRoomSelect(room)}
                                                    className="w-full px-6 py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-[#FF405A] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 transform active:scale-[0.98]"
                                                >
                                                    Select & Book
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column (Sticky Sidebar Task: Booking Widget, Reviews, Map) */}
                    <div className="hidden lg:block">
                        <div className="sticky top-28 flex flex-col gap-6 overflow-y-auto max-h-[calc(100vh-120px)] pr-2 custom-scrollbar">
                            
                            {/* Booking Widget */}
                            <div className="bg-white border border-gray-200 shadow-xl rounded-2xl p-6">
                                {minPrice > 0 ? (
                                    <>
                                        <div className="flex items-baseline mb-6 gap-1">
                                            <span className="text-2xl font-semibold text-gray-900">₹{minPrice}</span>
                                            <span className="text-gray-500 font-normal text-sm">night</span>
                                        </div>
                                        <button onClick={handleCheckAvailability} className="w-full py-3.5 bg-[#FF405A] hover:bg-[#e0354d] text-white font-semibold rounded-lg shadow-md transition-all text-[15px] mb-4">
                                            Check Availability
                                        </button>
                                        <p className="text-center text-gray-500 text-sm font-normal">You won't be charged yet</p>
                                    </>
                                ) : (
                                    <>
                                        <div className="mb-6 flex flex-col gap-1">
                                            <span className="text-2xl font-semibold text-gray-900">Reach out</span>
                                            <span className="text-sm font-normal text-gray-500">for pricing and dates</span>
                                        </div>
                                        <button className="w-full py-3.5 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg shadow-md transition-all text-[15px]">
                                            Contact Host
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Reviews Section in Sidebar */}
                            <div className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6">
                                <div className="flex items-center gap-2 mb-6">
                                    <Star size={20} className="fill-gray-900 text-gray-900" />
                                    <h3 className="text-xl font-bold tracking-tight text-gray-900">
                                        {currentProp.rating > 0 ? currentProp.rating.toFixed(1) : "New"} · {currentProp.reviewCount} reviews
                                    </h3>
                                </div>

                                {/* Review Form (Simplified for Sidebar) */}
                                {user && (
                                    <div className="mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <h4 className="font-bold text-sm mb-3">Write a review</h4>
                                        <form onSubmit={handleRatingSubmit} className="space-y-3">
                                            <div className="flex items-center gap-1.5 mb-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setRating(star)}
                                                        className="focus:outline-none transition-transform hover:scale-110"
                                                    >
                                                        <Star
                                                            size={18}
                                                            className={`${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                            <textarea
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                placeholder="Tell us about your stay..."
                                                className="w-full p-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF405A]/20 focus:border-[#FF405A] transition-all min-h-[80px]"
                                                required
                                            />
                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                className="w-full flex items-center justify-center gap-2 bg-[#FF405A] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-600 transition-colors disabled:opacity-50"
                                            >
                                                <Send size={14} />
                                                {submitting ? 'Post...' : 'Post'}
                                            </button>
                                        </form>
                                    </div>
                                )}

                                {/* Reviews List (Single Column for Sidebar) */}
                                <div className="space-y-6">
                                    {reviewsLoading ? (
                                        [...Array(2)].map((_, idx) => (
                                            <div key={idx} className="animate-pulse space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                                                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                                                </div>
                                                <div className="h-3 bg-gray-100 rounded w-full"></div>
                                            </div>
                                        ))
                                    ) : reviews.length === 0 ? (
                                        <p className="text-gray-500 text-sm italic">No reviews yet.</p>
                                    ) : (
                                        reviews.map((review) => (
                                            <div key={review._id} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Avatar className="h-9 w-9 border border-gray-100">
                                                        <AvatarImage src={review.userId?.avatar} />
                                                        <AvatarFallback className="bg-[#FF405A] text-white text-xs font-bold">
                                                            {review.userId?.name?.charAt(0) || 'U'}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-bold text-sm text-gray-900">{review.userId?.name || 'Guest'}</p>
                                                        <p className="text-[11px] text-gray-500">{new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 mb-2">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={10} className={i < review.rating ? 'fill-gray-900 text-gray-900' : 'text-gray-300'} />
                                                    ))}
                                                </div>
                                                <p className="text-[13px] text-gray-700 leading-relaxed italic line-clamp-3 hover:line-clamp-none cursor-pointer transition-all">"{review.comment}"</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Location Map Widget in Sidebar */}
                            <div className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6">
                                <h4 className="font-bold text-gray-900 mb-4 tracking-tight">Neighborhood</h4>
                                <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                                    <iframe 
                                        src={`https://maps.google.com/maps?q=${encodeURIComponent(currentProp.name + ' ' + currentProp.location)}&ll=${currentProp.latitude || ''},${currentProp.longitude || ''}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                                        className="absolute top-0 left-0 w-full h-full border-0"
                                        allowFullScreen="" 
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    ></iframe>
                                </div>
                                <p className="text-[12px] font-medium text-gray-600 mt-4 flex items-start gap-2 leading-relaxed">
                                    <MapPin size={14} className="shrink-0 text-[#FF405A] mt-0.5" />
                                    <span>{currentProp.location || "Exact location provided after booking"}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Related Properties Section */}
                {relatedProperties && relatedProperties.length > 0 && (
                    <div className="mt-20 pt-16 border-t border-gray-200">
                        <h3 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">Similar properties you might like</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProperties.map((relatedProp) => (
                                <Link 
                                    to={`/customer/property/${relatedProp.id}`} 
                                    key={relatedProp.id}
                                    className="group block cursor-pointer"
                                    onClick={() => window.scrollTo(0, 0)}
                                >
                                    <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-3">
                                        <img 
                                            src={relatedProp.coverImage || relatedProp.image || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb"} 
                                            alt={relatedProp.name} 
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute top-3 right-3">
                                            <button className="p-1.5 bg-white/70 backdrop-blur-md rounded-full hover:bg-white text-gray-600 hover:text-[#FF405A] transition-colors">
                                                <Heart size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 text-[15px] truncate max-w-[200px]">{relatedProp.name}</h4>
                                            <p className="text-gray-500 text-sm truncate max-w-[200px]">{relatedProp.location}</p>
                                        </div>
                                        <div className="flex items-center gap-1 text-sm font-semibold">
                                            <Star size={14} className="fill-gray-900 text-gray-900" />
                                            {relatedProp.rating > 0 ? relatedProp.rating.toFixed(1) : "New"}
                                        </div>
                                    </div>
                                    <div className="mt-1">
                                        <p className="text-sm">
                                            <span className="font-semibold text-gray-900">
                                                ₹{
                                                    relatedProp.rooms && relatedProp.rooms.length > 0
                                                        ? Math.min(...relatedProp.rooms.map(r => r.basePrice || r.price || 0))
                                                        : (relatedProp.price || 150)
                                                }
                                            </span>
                                            <span className="text-gray-500 font-normal"> / night</span>
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PropertyDetails;
