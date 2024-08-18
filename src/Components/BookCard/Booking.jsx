import axios from "axios";
import React, { useRef, useState } from "react";
import DatePicker from "react-datepicker";
import Modal from "react-modal";
import "./BookCard.css";
import "react-datepicker/dist/react-datepicker.css";
import { people } from "../../data";

Modal.setAppElement("#root");

const Booking = ({ isOpen, onRequestClose, service }) => {
  const [move, setMove] = useState(1);
  const [additionService, setAdditionalService] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAdditionalService, setShowAdditionalService] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const datePickerRef = useRef(null);
  const formRef = useRef(null);
  const [success, setSuccess] = useState(false);

  const handleDatePicker = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setFocus();
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  };

  const filterDates = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };
  const filterTimes = (time) => {
    const hour = time.getHours();
    return hour >= 8 && hour <= 18;
  };

  const handleNext = (e, requiresValidation) => {
    e.preventDefault();
    if (requiresValidation) {
      const form = formRef.current;
      if (form.checkValidity()) {
        setMove(move + 1);
      } else {
        form.reportValidity();
      }
    } else {
      setMove(move + 1);
    }
  };

  const handleBack = () => {
    if (move > 1) {
      setMove(move - 1);
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.post("http://localhost:3001/book", {
        name,
        email,
        number,
        address,
        message,
        service: service.name ? service.Price : "",
        additionService: additionService ? additionService.name : "",
        additionService: additionService ? additionService.price : null,
        date: selectedDate,
      });
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        onRequestClose();
        setMove(1);
      }, 3000);
    } catch (error) {
      console.error("Booking error:", error);
      setLoading(false);
      setError("Failed to confirm booking, Please try again.");
    }
  };

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

        {move === 1 && (
          <div className="step">
            <h2>Your Appointment</h2>
            <p>{service.name}</p>
            <p>{service.Price}</p>
            <button
              className="btn-service"
              onClick={() => setShowAdditionalService(true)}
            >
              Add Service
            </button>
            {showAdditionalService && (
              <label>
                Do you want to add another appointment?
                <div>
                  {people.map((make, index) => (
                    <div key={index} className="addition-service">
                      <input
                        type="radio"
                        id={`make-${index}`}
                        name="additionalService"
                        value={make.name}
                        onChange={() => setAdditionalService(make)}
                      />
                      <label htmlFor={`make-${index}`}>
                        {make.name} - {make.Price}
                      </label>
                    </div>
                  ))}
                </div>
              </label>
            )}

            <div className="btns">
              <button className="btn-select" onClick={handleNext}>
                Select Date and Time
              </button>
            </div>
          </div>
        )}
        {move === 2 && (
          <div className="step">
            <h2>Select a Date and Time</h2>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              showTimeSelect
              dateFormat="Pp"
              className="date-picker"
              ref={datePickerRef}
              filterDate={filterDates}
              filterTime={filterTimes}
            />
            <div className="btns">
              <button className="btn-back" onClick={handleBack}>
                Back
              </button>
              <button className="btn-new" onClick={handleDatePicker}>
                Choose New Date and Time
              </button>
              <button className="btn-next" onClick={handleNext}>
                Next
              </button>
            </div>
          </div>
        )}
        {move === 3 && (
          <form ref={formRef} className="step">
            <div className="step">
              <h2>Your Details</h2>
              <label>
                Name:
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  required
                />
              </label>
              <label>
                Number:
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your Number"
                  required
                />
              </label>
              <label>
                Address:
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Your Address"
                  required
                />
              </label>
              <label>
                Address:
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Your Address"
                  required
                />
              </label>
              <label>
                Message:
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Additional Message"
                />
              </label>
              <div className="btns">
                <button className="btn-back" onClick={handleBack}>
                  Back
                </button>
                <button
                  className="btn-next"
                  onClick={(e) => handleNext(e, true)}
                >
                  Next
                </button>
              </div>
            </div>
          </form>
        )}

        {move === 4 && (
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
                <p>Date: {selectedDate.toLocaleDateString()}</p>
                <p>Time: {selectedDate.toLocaleTimeString()}</p>
                <p>Name: {name}</p>
                <p>Email: {email}</p>
                <p>Address: {address}</p>
                <p>Message: {message}</p>
                {loading && <p>Loading...</p>}
                {error && <p>{error}</p>}
                <div className="btns">
                  <button className="btn-back" onClick={handleBack}>
                    Back
                  </button>
                  <button onClick={handleConfirm} disabled={loading}>
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
