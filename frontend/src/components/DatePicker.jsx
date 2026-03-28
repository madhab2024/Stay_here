import { useState, useEffect, useRef } from 'react';
import { Calendar, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

const DatePicker = ({ value, onChange, error }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState(1);
    const [selectedMonth, setSelectedMonth] = useState(1);
    const [selectedYear, setSelectedYear] = useState(2000);
    const [validationError, setValidationError] = useState('');

    const dayRef = useRef(null);
    const monthRef = useRef(null);
    const yearRef = useRef(null);

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Generate years (18 years ago to 100 years ago)
    const currentYear = new Date().getFullYear();
    const maxYear = currentYear - 18; // Must be at least 18 years old
    const minYear = currentYear - 100; // Max 100 years old
    const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i);

    // Calculate days in month (handle leap years for February)
    const getDaysInMonth = (month, year) => {
        if (month === 2) {
            // Check for leap year
            const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
            return isLeapYear ? 29 : 28;
        }
        // Months with 30 days: April, June, September, November
        if ([4, 6, 9, 11].includes(month)) {
            return 30;
        }
        return 31;
    };

    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Initialize from existing value
    useEffect(() => {
        if (value) {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
                setSelectedDay(date.getDate());
                setSelectedMonth(date.getMonth() + 1);
                setSelectedYear(date.getFullYear());
            }
        }
    }, [value]);

    // Adjust day if it exceeds days in selected month
    useEffect(() => {
        const maxDays = getDaysInMonth(selectedMonth, selectedYear);
        if (selectedDay > maxDays) {
            setSelectedDay(maxDays);
        }
    }, [selectedMonth, selectedYear]);

    const handleConfirm = () => {
        // Validate age (must be at least 18)
        const selectedDate = new Date(selectedYear, selectedMonth - 1, selectedDay);
        const today = new Date();
        const age = today.getFullYear() - selectedDate.getFullYear();
        const monthDiff = today.getMonth() - selectedDate.getMonth();
        const dayDiff = today.getDate() - selectedDate.getDate();

        const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

        if (actualAge < 18) {
            setValidationError('You must be at least 18 years old to become a host');
            return;
        }

        // Format date as YYYY-MM-DD
        const formattedDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
        onChange(formattedDate);
        setValidationError('');
        setIsOpen(false);
    };

    const handleCancel = () => {
        setValidationError('');
        setIsOpen(false);
    };

    const scrollToCenter = (ref, index) => {
        if (ref.current) {
            const itemHeight = 48; // Height of each item
            const containerHeight = ref.current.clientHeight;
            const scrollPosition = (index * itemHeight) - (containerHeight / 2) + (itemHeight / 2);
            ref.current.scrollTo({ top: scrollPosition, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                scrollToCenter(dayRef, selectedDay - 1);
                scrollToCenter(monthRef, selectedMonth - 1);
                scrollToCenter(yearRef, years.indexOf(selectedYear));
            }, 100);
        }
    }, [isOpen]);

    const formatDisplayDate = () => {
        if (!value) return 'Select date of birth';
        const date = new Date(value);
        if (isNaN(date.getTime())) return 'Select date of birth';
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <div className="relative">
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className={`flex h-10 w-full items-center justify-between rounded-md border ${error ? 'border-red-500' : 'border-input'
                    } bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
            >
                <span className={value ? 'text-foreground' : 'text-muted-foreground'}>
                    {formatDisplayDate()}
                </span>
                <Calendar className="h-4 w-4 opacity-50" />
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-white flex items-center">
                                <Calendar className="mr-2 h-5 w-5" />
                                Select Date of Birth
                            </h3>
                            <button
                                onClick={handleCancel}
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Date Picker */}
                        <div className="p-6">
                            <div className="flex gap-2 mb-4">
                                {/* Day Picker */}
                                <div className="flex-1">
                                    <label className="text-xs font-semibold text-gray-600 mb-2 block text-center">
                                        Day
                                    </label>
                                    <div
                                        ref={dayRef}
                                        className="h-48 overflow-y-auto scroll-smooth border border-gray-200 rounded-lg bg-gray-50"
                                        style={{ scrollbarWidth: 'thin' }}
                                    >
                                        <div className="py-20">
                                            {days.map((day) => (
                                                <div
                                                    key={day}
                                                    onClick={() => setSelectedDay(day)}
                                                    className={`h-12 flex items-center justify-center cursor-pointer transition-all ${selectedDay === day
                                                            ? 'bg-indigo-600 text-white font-bold scale-110 shadow-md'
                                                            : 'hover:bg-gray-100 text-gray-700'
                                                        }`}
                                                >
                                                    {day}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Month Picker */}
                                <div className="flex-[2]">
                                    <label className="text-xs font-semibold text-gray-600 mb-2 block text-center">
                                        Month
                                    </label>
                                    <div
                                        ref={monthRef}
                                        className="h-48 overflow-y-auto scroll-smooth border border-gray-200 rounded-lg bg-gray-50"
                                        style={{ scrollbarWidth: 'thin' }}
                                    >
                                        <div className="py-20">
                                            {months.map((month, index) => (
                                                <div
                                                    key={month}
                                                    onClick={() => setSelectedMonth(index + 1)}
                                                    className={`h-12 flex items-center justify-center cursor-pointer transition-all px-2 ${selectedMonth === index + 1
                                                            ? 'bg-indigo-600 text-white font-bold scale-110 shadow-md'
                                                            : 'hover:bg-gray-100 text-gray-700'
                                                        }`}
                                                >
                                                    {month}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Year Picker */}
                                <div className="flex-1">
                                    <label className="text-xs font-semibold text-gray-600 mb-2 block text-center">
                                        Year
                                    </label>
                                    <div
                                        ref={yearRef}
                                        className="h-48 overflow-y-auto scroll-smooth border border-gray-200 rounded-lg bg-gray-50"
                                        style={{ scrollbarWidth: 'thin' }}
                                    >
                                        <div className="py-20">
                                            {years.map((year) => (
                                                <div
                                                    key={year}
                                                    onClick={() => setSelectedYear(year)}
                                                    className={`h-12 flex items-center justify-center cursor-pointer transition-all ${selectedYear === year
                                                            ? 'bg-indigo-600 text-white font-bold scale-110 shadow-md'
                                                            : 'hover:bg-gray-100 text-gray-700'
                                                        }`}
                                                >
                                                    {year}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Selected Date Display */}
                            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4 text-center">
                                <p className="text-sm text-gray-600 mb-1">Selected Date</p>
                                <p className="text-lg font-bold text-indigo-900">
                                    {months[selectedMonth - 1]} {selectedDay}, {selectedYear}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Age: {currentYear - selectedYear} years
                                </p>
                            </div>

                            {/* Validation Error */}
                            {validationError && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm">
                                    {validationError}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancel}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleConfirm}
                                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                                >
                                    Confirm
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DatePicker;
