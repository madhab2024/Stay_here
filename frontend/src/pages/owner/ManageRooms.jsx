import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProperties } from '../../context/PropertyContext'; // For public props access maybe, but simpler to use API direct
import { fetchRooms, addRoom, updateRoom } from '../../api/roomApi';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCallback } from 'react';

const ManageRooms = () => {
    const { id } = useParams();
    // We can fetch property name lazily or from context, but safe bet is just reusing context for Name display
    // or passing it via state. For now, we will rely on context for property META, but API for ROOMS.
    const { properties } = useProperties();
    const property = properties.find(p => p.id === id || p._id === id); // Handle both ID formats

    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [roomData, setRoomData] = useState({ type: '', count: '', price: '' });
    const [editingRoomId, setEditingRoomId] = useState(null);
    const [error, setError] = useState(null);

    const loadRooms = useCallback(async () => {
        try {
            const res = await fetchRooms(id);
            setRooms(res.data || []);
        } catch (err) {
            console.error("Failed to load rooms", err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            loadRooms();
        }
    }, [id, loadRooms]);



    const handleSaveRoom = async (values, { setSubmitting }) => {
        setError(null);
        // setSubmitting is passed by Formik

        try {
            if (editingRoomId) {
                await updateRoom(editingRoomId, {
                    type: values.type,
                    count: parseInt(values.count),
                    price: Number(values.price)
                });
            } else {
                await addRoom(id, {
                    type: values.type,
                    count: parseInt(values.count),
                    price: Number(values.price)
                });
            }

            // Refresh
            await loadRooms();

            // Reset
            setRoomData({ type: '', count: '', price: '' });
            setEditingRoomId(null);
            setIsFormOpen(false);

        } catch (err) {
            setError(err.response?.data?.error || "Failed to save room");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditClick = (room) => {
        setRoomData({ type: room.type, count: room.count, price: room.basePrice || room.price });
        setEditingRoomId(room._id || room.id);
        setIsFormOpen(true);
    };

    if (loading) return <div className="p-8">Loading rooms...</div>;

    return (
        <div className="bg-white rounded-lg shadow min-h-[500px]">
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link to="/owner/properties" className="text-gray-400 hover:text-gray-600">
                            ← Back
                        </Link>
                        <h1 className="text-xl font-bold text-gray-800">Manage Rooms</h1>
                    </div>
                    <p className="text-gray-500">{property?.name || 'Property'}</p>
                </div>
                {!isFormOpen && (
                    <button
                        onClick={() => {
                            setRoomData({ type: '', count: '', price: '' });
                            setEditingRoomId(null);
                            setIsFormOpen(true);
                        }}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                        Add Room Type
                    </button>
                )}
            </div>

            <div className="p-6">
                {isFormOpen && (
                    <div className="mb-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
                        <h3 className="text-md font-semibold text-gray-800 mb-4">
                            {editingRoomId ? 'Edit Room' : 'Add New Room'}
                        </h3>
                        {error && <div className="mb-4 text-red-600 text-sm bg-red-50 p-2 rounded">{error}</div>}

                        <Formik
                            initialValues={{
                                type: roomData.type || '',
                                count: roomData.count || '',
                                price: roomData.price || ''
                            }}
                            enableReinitialize
                            validationSchema={Yup.object().shape({
                                type: Yup.string().required('Room Type is required'),
                                count: Yup.number().required('Count is required').min(1, 'Must be at least 1').integer('Must be an integer'),
                                price: Yup.number().required('Price is required').min(10, 'Price too low')
                            })}
                            onSubmit={handleSaveRoom}
                        >
                            {({ isSubmitting, errors, touched, getFieldProps }) => (
                                <Form className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="type">Room Type</Label>
                                            <Input
                                                id="type"
                                                placeholder="e.g. Deluxe Suite"
                                                {...getFieldProps('type')}
                                                className={errors.type && touched.type ? "border-red-500" : ""}
                                            />
                                            <ErrorMessage name="type" component="div" className="text-red-500 text-xs" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="count">Number of Rooms</Label>
                                            <Input
                                                id="count"
                                                type="number"
                                                placeholder="5"
                                                {...getFieldProps('count')}
                                                className={errors.count && touched.count ? "border-red-500" : ""}
                                            />
                                            <ErrorMessage name="count" component="div" className="text-red-500 text-xs" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="price">Price per Night (₹)</Label>
                                            <Input
                                                id="price"
                                                type="number"
                                                placeholder="150"
                                                {...getFieldProps('price')}
                                                className={errors.price && touched.price ? "border-red-500" : ""}
                                            />
                                            <ErrorMessage name="price" component="div" className="text-red-500 text-xs" />
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2 mt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setIsFormOpen(false)}
                                            disabled={isSubmitting}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                        >
                                            {editingRoomId ? 'Update Room' : 'Save Room'}
                                        </Button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                )}

                {rooms.length === 0 ? (
                    !isFormOpen && (
                        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                            No rooms added yet. Click "Add Room Type" to verify your inventory.
                        </div>
                    )
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {rooms.map((room) => (
                            <div key={room._id || room.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center bg-white hover:shadow-sm transition">
                                <div>
                                    <h4 className="font-semibold text-gray-900">{room.type}</h4>
                                    <p className="text-sm text-gray-500">
                                        Inventory: <span className="font-medium text-gray-900">{room.count}</span> units
                                    </p>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <span className="block text-lg font-bold text-indigo-600">₹{room.basePrice || room.price}</span>
                                        <span className="text-xs text-gray-400">per night</span>
                                    </div>
                                    <button
                                        onClick={() => handleEditClick(room)}
                                        className="text-gray-400 hover:text-indigo-600 p-1"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageRooms;
