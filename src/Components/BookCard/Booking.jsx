import axios from "axios";
import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./BookCard.css";
import "react-datepicker/dist/react-datepicker.css";
import { people } from "../../data";
import "react-calendar/dist/Calendar.css";
import DatePicker from "react-datepicker";
import moment from "moment-timezone";

Modal.setAppElement("#root");

const Booking = ({ isOpen, onRequestClose, service }) => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
    time: "",
    number: "",
    address: "",
  });
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [weekendMessage, setWeekendMessage] = useState("");

  // Date boundaries
  const septFirst2025 = moment("2025-09-01", "YYYY-MM-DD");
  const janFirst2026 = moment("2026-01-01", "YYYY-MM-DD");

  // Date filter for DatePicker
  const filterBookingDates = (date) => {
    // Block all dates in October 2025
    const isOctober2025 = moment(date).isBetween(
      moment("2025-10-01", "YYYY-MM-DD"),
      moment("2025-10-31", "YYYY-MM-DD"),
      null,
      "[]"
    );

    if (isOctober2025) {
      return false; // Block all dates in October 2025
    }

    // Block November 1st, 2025
    const isNovemberFirst2025 = moment(date).isSame("2025-11-01", "day");

    if (isNovemberFirst2025) {
      return false; // Block this specific date
    }

    if (moment(date).isSameOrAfter(janFirst2026)) {
      return true; // All days open from 2026
    }
    if (moment(date).isSameOrAfter(septFirst2025)) {
      return true; // All days open from Sept 1, 2025
    }
    // Before Sept 1, 2025: only weekends
    const day = moment(date).day();
    return day === 0 || day === 6;
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    number: "",
    address: "",
    message: "",
  });

  // Function to validate fields
  const validateStep4Fields = () => {
    let errors = {};
    if (!formData.name) errors.name = "Name is required";
    if (!formData.email) errors.email = "Email is required";
    if (!formData.number) errors.number = "Phone number is required";
    if (!formData.address) errors.address = "Address is required";
    if (!formData.time) errors.time = "time is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (step === 3) {
      // For step 3, validate time before proceeding
      if (formData.time) {
        setStep(step + 1);
      } else {
        setFormErrors({ ...formErrors, time: "Time is required" });
      }
    } else if (step === 4) {
      if (validateStep4Fields()) {
        setStep(step + 1);
      }
    } else {
      setStep(step + 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const dateOnly = moment(selectedDate).format("YYYY-MM-DD");
      await axios.post("https://end8.vercel.app/book", {
        name: formData.name,
        email: formData.email,
        number: formData.number,
        address: formData.address,
        message: formData.message,
        service: service.name ? service.name : "",
        price: service.Price ? service.Price : null,
        date: dateOnly,
        time: formData.time,
      });
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        onRequestClose();
        setStep(1);
      }, 3000);
    } catch (error) {
      setLoading(false);
      setError(
        "There was a problem submitting your booking. Please try again."
      );
    }
  };

  const handleDateChange = async (date) => {
    setSelectedDate(date);
    setWeekendMessage("");
    const formattedDate = moment(date)
      .tz("America/Edmonton")
      .set({ hour: 12, minute: 0 })
      .format("YYYY-MM-DD");
    setFormData((prev) => ({
      ...prev,
      date: moment(date).format("YYYY-MM-DD"),
    }));

    // Block all times for dates between June 3 and June 15
    const blockStartDate = moment("2025-06-03", "YYYY-MM-DD");
    const blockEndDate = moment("2025-06-15", "YYYY-MM-DD");
    if (moment(date).isBetween(blockStartDate, blockEndDate, null, "[]")) {
      setAvailableTimes([]);
      return;
    }

    // Time slot logic
    let allTimes = [
      "06:30",
      "07:00",
      "07:30",
      "08:00",
      "08:30",
      "09:00",
      "09:30",
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "12:00",
      "12:30",
      "13:00",
      "13:30",
      "14:00",
      "14:30",
      "15:00",
      "15:30",
      "16:00",
      "16:30",
      "17:00",
      "17:30",
      "18:00",
      "18:30",
      "19:00",
    ];
    if (
      moment(date).isSameOrAfter(septFirst2025) &&
      moment(date).isBefore(janFirst2026)
    ) {
      const dayOfWeek = moment(date).day();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        // Weekend: all times available
        allTimes = [
          "06:30",
          "07:00",
          "07:30",
          "08:00",
          "08:30",
          "09:00",
          "09:30",
          "10:00",
          "10:30",
          "11:00",
          "11:30",
          "12:00",
          "12:30",
          "13:00",
          "13:30",
          "14:00",
          "14:30",
          "15:00",
          "15:30",
          "16:00",
          "16:30",
          "17:00",
          "17:30",
          "18:00",
          "18:30",
          "19:00",
        ];
      } else {
        // Weekday: only 16:00–19:00
        allTimes = [
          "16:00",
          "16:30",
          "17:00",
          "17:30",
          "18:00",
          "18:30",
          "19:00",
        ];
      }
    }
    // Before September 1, 2025: only weekends allowed
    if (moment(date).isBefore(septFirst2025)) {
      const dayOfWeek = moment(date).day();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        setAvailableTimes([]);
        return;
      }
    }
    try {
      const response = await axios.get(
        `https://end8.vercel.app/bookings/unavailable-times?date=${formattedDate}`
      );
      const bookedTimes = response.data;
      const available = allTimes.filter((time) => !bookedTimes.includes(time));
      setAvailableTimes(available);
    } catch (error) {
      setAvailableTimes([]);
    }
  };

  useEffect(() => {
    if (isOpen && selectedDate) {
      handleDateChange(selectedDate);
    }
  }, [isOpen, selectedDate]);
  const handleRequestClose = () => {
    setShowConfirmation(true);
  };
  return (
    <div className="modal-container">
      <div className="modal-backdrop"></div>
      <Modal
        isOpen={isOpen}
        onRequestClose={handleRequestClose}
        contentLabel="Booking Modal"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <span className="close" onClick={handleRequestClose}>
          &times;
        </span>
        {step === 1 && (
          <div className="step">
            <h2>Your Appointment</h2>
            <p>{service.name}</p>
            <p>{service.Location && <p>{service.Location}</p>}</p>
            <p>{service.Duration}</p>
            <p>{service.Price}</p>
            <button className="btn-service" onClick={() => setStep(3)}>
              Select Date and Time
            </button>
          </div>
        )}
        {step === 3 && (
          <div className="step step-3">
            <h2 className="step-title">Select Your Date and Time</h2>
            <label className="step-label">Select Date:</label>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              minDate={new Date()}
              filterDate={filterBookingDates}
              className="date-picker-input"
              required
              placeholderText="Select a date"
            />
            {weekendMessage && (
              <p
                className="error"
                style={{
                  color: "#ff6b6b",
                  marginTop: "10px",
                  fontSize: "14px",
                }}
              >
                {weekendMessage}
              </p>
            )}
            <label className="step-label">Select Time:</label>
            <select
              value={formData.time}
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
              className="time-select"
              required
              disabled={availableTimes.length === 0}
            >
              <option value="" disabled>
                {availableTimes.length > 0
                  ? "Select Time"
                  : "No available times"}
              </option>
              {availableTimes.length > 0 ? (
                availableTimes.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No available times
                </option>
              )}
            </select>
            {formErrors.time && <p className="error">{formErrors.time}</p>}
            <div className="btns">
              <button className="btn-back" onClick={handleBack}>
                Back
              </button>
              <button className="btn-next" onClick={handleNext}>
                Next
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              {formErrors.name && <p className="error">{formErrors.name}</p>}
              {/* Show error if validation fails */}
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
              {formErrors.email && <p className="error">{formErrors.email}</p>}
              {/* Show error if validation fails */}
            </div>
            <div className="form-group">
              <label>Number:</label>
              <input
                type="tel"
                name="number"
                value={formData.number}
                onChange={(e) =>
                  setFormData({ ...formData, number: e.target.value })
                }
                required
              />
              {formErrors.number && (
                <p className="error">{formErrors.number}</p>
              )}
              {/* Show error if validation fails.. */}
            </div>
            <div className="form-group">
              <label>Address:</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Additional Message:</label>
              <input
                type="text"
                name="message"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
              />
            </div>
            <div className="btns">
              <button className="btn-back" onClick={handleBack}>
                Back
              </button>
              <button className="btn-next" onClick={handleNext}>
                Next
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="step">
            <h2>Confirm Your Booking</h2>
            {success ? (
              <p>Booking was Successful</p>
            ) : (
              <>
                <p>
                  Service: {service.name},{service.Price}
                </p>
                <p>{formData.date ? formData.date : "Date not set"}</p>
                <p>Time: {formData.time}</p>
                <p>Name: {formData.name}</p>
                <p>Email: {formData.email}</p>
                <p>Number: {formData.number}</p>
                <p>Address: {formData.address}</p>
                <p>Message: {formData.message}</p>
                {loading && <p>Loading.</p>}
                {error && <p>{error}</p>}
                <div className="btns">
                  <button className="btn-back" onClick={handleBack}>
                    Back
                  </button>
                  <button
                    className="btn-confirm"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    Confirm
                  </button>
                </div>
              </>
            )}
          </div>
        )}
        {showConfirmation && (
          <div className="modal-backdrop">
            <Modal
              isOpen={showConfirmation}
              onRequestClose={() => setShowConfirmation(false)}
              className="confirm-modal"
              overlayClassName="modal-overlay"
            >
              <h2>Leave without booking?</h2>
              <p>If you leave now,your booking won't be saved.</p>
              <div className="btns">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="btn1"
                >
                  Continue Booking
                </button>
                <button onClick={onRequestClose} className="btn2">
                  Leave Booking
                </button>
              </div>
            </Modal>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Booking;
