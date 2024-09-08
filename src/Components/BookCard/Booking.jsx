import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
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
  const [additionService, setAdditionalService] = useState("");
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

  const handleBack = () => {
    if (step === 3) {
      setStep(1);
    } else if (step > 1) {
      setStep(step - 1);
    }
  };
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    number: "",
    address: "",
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
    return Object.keys(errors).length === 0; // If no errors, return true
  };

  const handleNext = () => {
    if (step === 4) {
      // Validate fields in step 4 before proceeding
      if (validateStep4Fields()) {
        setStep(step + 1);
      }
    } else if (step === 3) {
      // For step 3, validate time before proceeding
      if (formData.time) {
        setStep(step + 1);
      } else {
        setFormErrors({ ...formErrors, time: "Time is required" });
      }
    } else {
      setStep(step + 1);
    }
  };

  const handleServiceSelect = (service) => {
    setAdditionalService(service);
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      // Send the booking data to the backend
      await axios.post("http://localhost:3001/book", {
        name: formData.name, // Captured from step 4
        email: formData.email, // Captured from step 4
        number: formData.number, // Captured from step 4
        address: formData.address, // Captured from step 4
        message: formData.message, // Optional, captured from step 4
        service: service.name ? service.name : "", // Service selected earlier
        additionService: additionService ? additionService : "", // Additional service if selected
        price: service.Price ? service.Price : null, // Optional: you may want to include the price
        date: selectedDate, // The selected date from step 3
        time: formData.time, // The selected time from step 3
      });

      // If successful, display success message and reset
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        onRequestClose(); // Close the modal or form
        setStep(1); // Reset to the first step
      }, 3000);
    } catch (error) {
      console.error("Booking error:", error);
      setLoading(false);
      setError(
        "There was a problem submitting your booking. Please try again."
      );
    }
  };
  const handleDateChange = (date) => {
    setSelectedDate(date);

    setFormData({ ...formData, date: date.toISOString() });

    // Format the date before sending it to the backend
    const formattedDate = moment(date).format("YYYY-MM-DD");
    axios
      .get(
        `http://localhost:3001/bookings/unavailable-times?date=${formattedDate}`
      )
      .then((response) => {
        const bookedTimes = response.data;
        console.log("received unavailable times from backend:", bookedTimes);

        const allTimes = [
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

        // Exclude booked and blocked times from available times
        const availableTimes = allTimes.filter(
          (time) => !bookedTimes.includes(time)
        );
        setAvailableTimes(availableTimes);
      })
      .catch((error) => {
        console.error("Error fetching unavailable times:", error);
      });
  };
  useEffect(() => {
    handleDateChange(selectedDate);
  }, []);
  return (
    <div className="modal-container">
      <div className="modal-backdrop"></div>
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="Booking Modal"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <span className="close" onClick={onRequestClose}>
          &times;
        </span>
        {step === 1 && (
          <div className="step">
            <h2>Your Appointment</h2>
            <p>{service.name}</p>
            <p>{service.Duration}</p>
            <p>{service.Price}</p>
            <button className="btn-service" onClick={() => setStep(2)}>
              + Add Extra Service
            </button>
            <button className="btn-service" onClick={() => setStep(3)}>
              Select Date and Time
            </button>
          </div>
        )}
        {step === 2 && (
          <div className="step">
            <h2>Select another service</h2>
            <div>
              {people.map((service, index) => (
                <div key={index} className="addition-service">
                  <input
                    type="radio"
                    id={`service-${index}`}
                    name="additionalService"
                    value={service.name}
                    onChange={() => handleServiceSelect(service)}
                  />
                  <label htmlFor={`service-${index}`}>
                    {service.name} - {service.Price}
                  </label>
                </div>
              ))}
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
        {step === 3 && (
          <div className="step step-3">
            <h2 className="step-title">Select Your Date and Time</h2>

            <label className="step-label">Select Date:</label>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              minDate={new Date()}
              className="date-picker-input"
              required
            />

            <label className="step-label">Select Time:</label>
            <select
              value={formData.time}
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
              className="time-select"
              required
            >
              <option value="" disabled>
                Select Time
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
              {/* Show error if validation fails */}
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
                required
              />
              {formErrors.address && (
                <p className="error">{formErrors.address}</p>
              )}{" "}
              {/* Show error if validation fails */}
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
                {additionService && (
                  <p>Additional Service: {additionService}</p>
                )}
                <p>
                  Date:
                  {formData.date
                    ? new Date(formData.date).toLocaleDateString()
                    : "Date not set"}
                </p>
                <p>Time: {formData.time}</p>
                <p>Name: {formData.name}</p>
                <p>Email: {formData.email}</p>
                <p>Number: {formData.number}</p>
                <p>Address: {formData.address}</p>
                <p>Message: {formData.message}</p>
                {loading && <p>Loading...</p>}
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
      </Modal>
    </div>
  );
};

export default Booking;
