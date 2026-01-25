const Users = () => {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">User Management</h1>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors">
                    Add User
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm whitespace-nowrap">
                    <thead className="uppercase tracking-wider border-b-2 border-gray-200 bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-4">Name</th>
                            <th scope="col" className="px-6 py-4">Email</th>
                            <th scope="col" className="px-6 py-4">Role</th>
                            <th scope="col" className="px-6 py-4">Status</th>
                            <th scope="col" className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-6 py-4">Jane Doe</td>
                            <td className="px-6 py-4">jane@example.com</td>
                            <td className="px-6 py-4"><span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs">Customer</span></td>
                            <td className="px-6 py-4"><span className="text-green-600 font-medium">Active</span></td>
                            <td className="px-6 py-4 text-right">
                                <span className="text-indigo-600 cursor-pointer hover:underline">Edit</span>
                            </td>
                        </tr>
                        <tr className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-6 py-4">John Smith</td>
                            <td className="px-6 py-4">john@example.com</td>
                            <td className="px-6 py-4"><span className="px-2 py-1 rounded-full bg-purple-100 text-purple-800 text-xs">Owner</span></td>
                            <td className="px-6 py-4"><span className="text-green-600 font-medium">Active</span></td>
                            <td className="px-6 py-4 text-right">
                                <span className="text-indigo-600 cursor-pointer hover:underline">Edit</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Users;

