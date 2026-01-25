import { useState } from 'react';
import { useProperties } from '../../context/PropertyContext';

const Properties = () => {
    const { properties, addProperty } = useProperties();
    const [isModalOpen, setIsModalOpen] = useState(false);
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
            image: `https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`, // Random nice house placeholder
            description: "A wonderful new property added by the owner. It features modern amenities and a great location."
        };

        addProperty(newProperty);
        setFormData({ name: '', location: '', price: '' });
        setIsModalOpen(false);
    };

    return (
        <div className="bg-white rounded-lg shadow min-h-[500px]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800">Your Properties</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your listings and availability.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                    Add Property
                </button>
            </div>

            <div className="p-6">
                {properties.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">No properties yet</h3>
                        <p className="text-gray-500 mt-1">Get started by adding your first property.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-100 text-sm font-medium text-gray-500 uppercase tracking-wider">
                                    <th className="pb-3 pl-2">Name</th>
                                    <th className="pb-3">Location</th>
                                    <th className="pb-3">Price / Night</th>
                                    <th className="pb-3">Status</th>
                                    <th className="pb-3 text-right pr-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {properties.map((property) => (
                                    <tr key={property.id} className="hover:bg-gray-50 transition">
                                        <td className="py-4 pl-2 font-medium text-gray-900">{property.name}</td>
                                        <td className="py-4 text-gray-500">{property.location}</td>
                                        <td className="py-4 text-gray-900">${property.price}</td>
                                        <td className="py-4">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${property.status === 'Active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                    }`}
                                            >
                                                {property.status}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right pr-2 text-sm text-indigo-600 cursor-pointer hover:underline">
                                            Edit
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add Property Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-800">Add New Property</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Property Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g. Oceanview Loft"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g. San Francisco, CA"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price per Night ($)</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                    placeholder="150"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="pt-4 flex space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                                >
                                    Save Property
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Properties;
