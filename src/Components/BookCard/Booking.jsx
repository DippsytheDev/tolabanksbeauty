import axios from "axios";
import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./BookCard.css";
import "react-datepicker/dist/react-datepicker.css";
import { people } from "../../data";
import "react-calendar/dist/Calendar.css";
import Calendar from "react-calendar";
import moment from "moment-timezone";

Modal.setAppElement("#root");

const Booking = ({
  isOpen,
  onRequestClose,
  service,
  onStepChange,
  initialStep = 1,
  selectedDate: propSelectedDate,
  selectedTime: propSelectedTime,
  formData: propFormData,
}) => {
  const [step, setStep] = useState(initialStep);

  // Update step when initialStep prop changes
  useEffect(() => {
    if (isOpen && initialStep) {
      setStep(initialStep);
    }
  }, [isOpen, initialStep]);

  // Notify parent of step changes
  useEffect(() => {
    if (onStepChange && isOpen) {
      onStepChange(step);
    }
  }, [step, onStepChange, isOpen]);
  const [selectedDate, setSelectedDate] = useState(
    propSelectedDate || new Date()
  );
  const [formData, setFormData] = useState({
    name: propFormData?.name || "",
    email: propFormData?.email || "",
    date: propSelectedDate ? moment(propSelectedDate).format("YYYY-MM-DD") : "",
    time: propSelectedTime || "",
    number: propFormData?.number || "",
    address: propFormData?.address || "",
    message: propFormData?.message || "",
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
    // Block specific dates in 2026
    const blockedDates2026 = [
      "2026-02-21", // February 21st
      "2026-05-16", // May 16th
      "2026-06-11", // June 11th
      "2026-06-14", // June 14th
      "2026-06-20", // June 20th
      "2026-08-01", // August 1st
      "2026-08-29", // August 29th
      "2026-09-10", // September 10th
      "2026-09-12", // September 12th
    ];

    const dateString = moment(date).format("YYYY-MM-DD");
    if (blockedDates2026.includes(dateString)) {
      return false; // Block these specific dates
    }

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

    // Block all dates from November 2025 to December 2025
    const isNovemberToDecember2025 = moment(date).isBetween(
      moment("2025-11-01", "YYYY-MM-DD"),
      moment("2025-12-31", "YYYY-MM-DD"),
      null,
      "[]"
    );

    if (isNovemberToDecember2025) {
      return false; // Block all dates in November and December 2025
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
      const prevStep = step - 1;
      setStep(prevStep);
      if (onStepChange) onStepChange(prevStep);
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
        const nextStep = step + 1;
        setStep(nextStep);
        if (onStepChange) onStepChange(nextStep);
      } else {
        setFormErrors({ ...formErrors, time: "Time is required" });
      }
    } else if (step === 4) {
      if (validateStep4Fields()) {
        const nextStep = step + 1;
        setStep(nextStep);
        if (onStepChange) onStepChange(nextStep);
      }
    } else {
      const nextStep = step + 1;
      setStep(nextStep);
      if (onStepChange) onStepChange(nextStep);
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
      // Notify parent that we've reached the final step
      if (onStepChange) onStepChange(5);
      setTimeout(() => {
        onRequestClose();
        setStep(initialStep || 1);
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

    let allTimes = [];
    const dayOfWeek = moment(date).day();
    const isNextYear = moment(date).year() >= 2024;

    if (isNextYear) {
      if (dayOfWeek >= 1 && dayOfWeek <= 4) {
        // Monday to Thursday: 6pm to 7pm
        allTimes = ["18:00", "18:30", "19:00"];
      } else if (dayOfWeek === 5) {
        // Friday: 5pm to 7pm
        allTimes = ["17:00", "17:30", "18:00", "18:30", "19:00"];
      } else if (dayOfWeek === 6) {
        // Saturday: full day times
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
      } else if (dayOfWeek === 0) {
        // Sunday: only times from 2pm onwards
        allTimes = [
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
      }
    }

    try {
      const response = await axios.get(
        `https://end8.vercel.app/bookings/unavailable-times?date=${formattedDate}`
      );
      const bookedTimes = response.data;

      // Block the booked time, the next 2 hours, and the 1.5 hours before the booking
      const extendedBlockedTimes = new Set();
      bookedTimes.forEach((time) => {
        const bookingMoment = moment(time, "HH:mm");

        // Block the booked time itself
        extendedBlockedTimes.add(bookingMoment.format("HH:mm"));

        // Block 2 hours after the booked time (4 slots of 30 minutes each)
        const afterMoment = moment(time, "HH:mm");
        for (let i = 1; i <= 4; i++) {
          afterMoment.add(30, "minutes");
          extendedBlockedTimes.add(afterMoment.format("HH:mm"));
        }

        // Block 1.5 hours before the booked time (3 slots of 30 minutes each)
        const beforeMoment = moment(time, "HH:mm");
        for (let i = 1; i <= 3; i++) {
          beforeMoment.subtract(30, "minutes");
          extendedBlockedTimes.add(beforeMoment.format("HH:mm"));
        }
      });

      const available = allTimes.filter(
        (time) => !extendedBlockedTimes.has(time)
      );
      setAvailableTimes(available);
    } catch (error) {
      setAvailableTimes([]);
    }
  };

  // Update selectedDate and formData when props change
  useEffect(() => {
    if (propSelectedDate) {
      setSelectedDate(propSelectedDate);
      setFormData((prev) => ({
        ...prev,
        date: moment(propSelectedDate).format("YYYY-MM-DD"),
      }));
    }
    if (propSelectedTime) {
      setFormData((prev) => ({
        ...prev,
        time: propSelectedTime,
      }));
    }
  }, [propSelectedDate, propSelectedTime]);

  useEffect(() => {
    if (isOpen && initialStep >= 4) {
      // Only fetch times if we're starting from step 4 (details)
      // For step 3, times are already fetched in the parent component
      const fetchUnavailableTimes = async () => {
        const formattedDate = moment(selectedDate)
          .tz("America/Edmonton")
          .set({ hour: 12, minute: 0 })
          .format("YYYY-MM-DD");

        let allTimes = [];
        const dayOfWeek = moment(selectedDate).day();
        const isNextYear = moment(selectedDate).year() >= 2024;

        if (isNextYear) {
          if (dayOfWeek >= 1 && dayOfWeek <= 4) {
            allTimes = ["18:00", "18:30", "19:00"];
          } else if (dayOfWeek === 5) {
            allTimes = ["17:00", "17:30", "18:00", "18:30", "19:00"];
          } else if (dayOfWeek === 6) {
            // Saturday: full day times
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
          } else if (dayOfWeek === 0) {
            // Sunday: only times from 2pm onwards
            allTimes = [
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
          }
        }

        try {
          const response = await axios.get(
            `https://end8.vercel.app/bookings/unavailable-times?date=${formattedDate}`
          );
          const bookedTimes = response.data;

          const extendedBlockedTimes = new Set();
          bookedTimes.forEach((time) => {
            const bookingMoment = moment(time, "HH:mm");

            // Block the booked time itself
            extendedBlockedTimes.add(bookingMoment.format("HH:mm"));

            // Block 2 hours after the booked time (4 slots of 30 minutes each)
            const afterMoment = moment(time, "HH:mm");
            for (let i = 1; i <= 4; i++) {
              afterMoment.add(30, "minutes");
              extendedBlockedTimes.add(afterMoment.format("HH:mm"));
            }

            // Block 1.5 hours before the booked time (3 slots of 30 minutes each)
            const beforeMoment = moment(time, "HH:mm");
            for (let i = 1; i <= 3; i++) {
              beforeMoment.subtract(30, "minutes");
              extendedBlockedTimes.add(beforeMoment.format("HH:mm"));
            }
          });

          const available = allTimes.filter(
            (time) => !extendedBlockedTimes.has(time)
          );
          setAvailableTimes(available);
        } catch (error) {
          setAvailableTimes([]);
        }
      };

      fetchUnavailableTimes();
    }
  }, [isOpen, selectedDate, initialStep]);

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
            <p>{service?.name}</p>
            <p>{service?.Location && <p>{service.Location}</p>}</p>
            <p>{service?.Duration}</p>
            <p>{service?.Price}</p>
            <button className="btn-service" onClick={() => setStep(3)}>
              Select Date and Time
            </button>
          </div>
        )}
        {step === 3 && service && (
          <div className="step step-3-new">
            <div className="back-to-package">
              <button className="back-link" onClick={handleBack}>
                ← Back to Package
              </button>
            </div>
            <div className="package-name-display">{service.name}</div>
            <h2 className="step-title-new">Select Date & Time</h2>
            <p className="step-subtitle">
              Choose your preferred appointment date and time
            </p>

            <div className="date-time-container">
              {/* Date Picker Card */}
              <div className="date-picker-card">
                <h3 className="card-title">Select Date</h3>
                <Calendar
                  onChange={handleDateChange}
                  value={selectedDate}
                  minDate={new Date()}
                  tileDisabled={({ date }) => !filterBookingDates(date)}
                  className="custom-calendar"
                />
              </div>

              {/* Time Picker Card */}
              <div className="time-picker-card">
                <h3 className="card-title">Select Time</h3>
                <div className="time-slots-grid">
                  {availableTimes.length > 0 ? (
                    availableTimes.map((time) => {
                      const isSelected = formData.time === time;
                      const time12h = moment(time, "HH:mm").format("h:mmA");
                      return (
                        <button
                          key={time}
                          type="button"
                          className={`time-slot-btn ${
                            isSelected ? "selected" : ""
                          }`}
                          onClick={() =>
                            setFormData({ ...formData, time: time })
                          }
                        >
                          {time12h}
                        </button>
                      );
                    })
                  ) : (
                    <p className="no-times-message">
                      No available times for this date
                    </p>
                  )}
                </div>
              </div>
            </div>

            {formErrors.time && <p className="error">{formErrors.time}</p>}

            <div className="proceed-button-container">
              <button className="btn-proceed" onClick={handleNext}>
                PROCEED
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
