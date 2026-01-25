import { useProperties } from '../../context/PropertyContext';

const AdminProperties = () => {
    const { properties, updatePropertyStatus } = useProperties();
    console.log('AdminProperties: Rendering with properties', properties);

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-100">
                <h1 className="text-2xl font-bold text-gray-800">Property Moderation</h1>
                <p className="text-sm text-gray-500 mt-1">Review and approve/reject property submissions.</p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {properties.map((property) => (
                            <tr key={property.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{property.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{property.location}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-900">${property.price}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                        ${property.status === 'Available' ? 'bg-green-100 text-green-800' :
                                            property.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'}`}>
                                        {property.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    {property.status !== 'Available' && property.status !== 'Rejected' && (
                                        <>
                                            <button
                                                onClick={() => updatePropertyStatus(property.id, 'Available')}
                                                className="text-green-600 hover:text-green-900 font-semibold"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => updatePropertyStatus(property.id, 'Rejected')}
                                                className="text-red-600 hover:text-red-900 font-semibold ml-4"
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminProperties;
