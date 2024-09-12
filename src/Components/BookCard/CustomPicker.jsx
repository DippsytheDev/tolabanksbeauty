import React, { useState } from "react";
import DatePicker from "react-datepicker";

const CustomDatePicker = ({
  selectedDate,
  onDateChange,
  bookedTimes,
  closeDatePicker,
}) => {
  const generateAllowedTimes = (bookedTimes) => {
    const times = [];
    let startTime = new Date();
    startTime.setHours(6, 30, 0, 0); // Start at midnight for a full day view
    const endTime = new Date(startTime);
    endTime.setHours(16, 30, 0, 0);

    while (startTime < endTime) {
      const isBooked = bookedTimes.some((bookedTime) => {
        const endBookingTime = new Date(bookedTime);
        endBookingTime.setMinutes(endBookingTime.getMinutes() + 120); // 2 hours
        return startTime >= bookedTime && startTime < endBookingTime;
      });

      if (!isBooked) {
        times.push(new Date(startTime)); // Push the time slot if it is not booked
      }

      // Move to the next time slot by 30 minutes
      startTime.setMinutes(startTime.getMinutes() + 30); // Example: moving in 30-minute intervals
    }

    return times;
  };

  const [tempDate, setTempDate] = useState(selectedDate);

  const handleConfirm = () => {
    onDateChange(tempDate);
    closeDatePicker(); // Close the pop-up when confirmed
  };

  return (
    <div className="custom-date-picker">
      <DatePicker
        selected={tempDate}
        onChange={(date) => setTempDate(date)}
        showTimeSelect
        timeIntervals={30} // Ensure 30-minute intervals are set
        includeTimes={generateAllowedTimes(bookedTimes)} // Pass dynamically generated allowed times
        dateFormat="Pp"
        inline
      />
      <div className="confirm-button-container">
        <button onClick={handleConfirm} className="btn-confirm">
          Confirm
        </button>
      </div>
    </div>
  );
};

export default CustomDatePicker;
