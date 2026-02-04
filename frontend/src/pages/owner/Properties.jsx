import { useState } from 'react';
import { useProperties } from '../../context/PropertyContext';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';

const Properties = () => {
    const { properties, addProperty } = useProperties();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [isDetailView, setIsDetailView] = useState(false);
    const [formData, setFormData] = useState({ name: '', location: '', price: '' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.location || !formData.price) return;

        const newProperty = {
            id: Date.now(),
            name: formData.name,
            location: formData.location,
            price: Number(formData.price),
            status: 'Available',
            image: `https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`,
            description: "A wonderful new property added by the owner. It features modern amenities and a great location."
        };

        addProperty(newProperty);
        setFormData({ name: '', location: '', price: '' });
        setIsModalOpen(false);
    };

    const handleViewProperty = (property) => {
        setSelectedProperty(property);
        setIsDetailView(true);
    };

    const handleCloseDetail = () => {
        setIsDetailView(false);
        setSelectedProperty(null);
    };

    return (
        <>
            {isDetailView && selectedProperty ? (
                // Detail View
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="relative h-96 overflow-hidden bg-gray-200">
                        <img
                            src={selectedProperty.image}
                            alt={selectedProperty.name}
                            className="w-full h-full object-cover"
                        />
                        <button
                            onClick={handleCloseDetail}
                            className="absolute top-4 left-4 bg-white hover:bg-gray-100 text-gray-800 p-2 rounded-lg transition"
                        >
                            ← Back
                        </button>
                    </div>

                    <div className="p-8">
                        <div className="max-w-2xl">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedProperty.name}</h1>
                                    <p className="text-lg text-gray-600 flex items-center space-x-2">
                                        <span>📍</span>
                                        <span>{selectedProperty.location}</span>
                                    </p>
                                </div>
                                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                    selectedProperty.status === 'Available'
                                        ? 'bg-teal-100 text-teal-800'
                                        : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {selectedProperty.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-y border-gray-200">
                                <div>
                                    <p className="text-gray-600 text-sm font-semibold mb-2">Price per Night</p>
                                    <p className="text-4xl font-bold text-teal-600">${selectedProperty.price}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600 text-sm font-semibold mb-2">Property ID</p>
                                    <p className="text-lg text-gray-900 font-mono">#{selectedProperty.id}</p>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
                                <p className="text-gray-600 leading-relaxed">{selectedProperty.description}</p>
                            </div>

                            <div className="mt-8 flex space-x-4">
                                <button className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition">
                                    Edit Property
                                </button>
                                <button className="px-6 py-3 border-2 border-red-200 text-red-600 hover:bg-red-50 rounded-lg font-semibold transition">
                                    Delete Property
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // List View
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="p-8 border-b border-gray-200 flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Your Properties</h1>
                            <p className="text-gray-600 mt-1">Manage your listings and availability.</p>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                        >
                            <Plus size={20} />
                            <span>Add Property</span>
                        </button>
                    </div>

                    <div className="p-8">
                        {properties.length === 0 ? (
                            <div className="text-center py-20 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border-2 border-dashed border-teal-200">
                                <h3 className="text-lg font-bold text-gray-900">No properties yet</h3>
                                <p className="text-gray-600 mt-1">Get started by adding your first property.</p>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="mt-4 inline-flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                                >
                                    <Plus size={18} />
                                    <span>Add Property</span>
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {properties.map((property) => (
                                    <div key={property.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition">
                                        <div className="relative h-48 overflow-hidden bg-gray-200">
                                            <img
                                                src={property.image}
                                                alt={property.name}
                                                className="w-full h-full object-cover hover:scale-110 transition duration-300"
                                            />
                                            <div className="absolute top-3 right-3">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                                                    property.status === 'Available'
                                                        ? 'bg-teal-100 text-teal-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {property.status}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-4">
                                            <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{property.name}</h3>
                                            <p className="text-sm text-gray-600 mt-1 flex items-center space-x-1">
                                                <span>📍</span>
                                                <span className="line-clamp-1">{property.location}</span>
                                            </p>

                                            <div className="mt-4 pt-4 border-t border-gray-100">
                                                <p className="text-2xl font-bold text-teal-600">${property.price}<span className="text-xs text-gray-600 font-normal">/night</span></p>
                                            </div>

                                            <div className="mt-4 flex space-x-2">
                                                <button
                                                    onClick={() => handleViewProperty(property)}
                                                    className="flex-1 flex items-center justify-center space-x-1 bg-teal-50 hover:bg-teal-100 text-teal-600 py-2 rounded-lg font-semibold transition"
                                                >
                                                    <Eye size={16} />
                                                    <span>View</span>
                                                </button>
                                                <button className="flex-1 flex items-center justify-center space-x-1 bg-gray-50 hover:bg-gray-100 text-gray-600 py-2 rounded-lg font-semibold transition">
                                                    <Edit2 size={16} />
                                                    <span>Edit</span>
                                                </button>
                                                <button className="flex-1 flex items-center justify-center space-x-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg font-semibold transition">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Add Property Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="px-8 py-6 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">Add New Property</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 text-2xl"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">Property Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g. Oceanview Loft"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g. San Francisco, CA"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">Price per Night ($)</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                    placeholder="150"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition"
                                />
                            </div>

                            <div className="pt-4 flex space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition font-semibold"
                                >
                                    Save Property
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default Properties;
