import axios from "axios";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import Modal from "react-modal";
import "./BookCard.css";
import "react-datepicker/dist/react-datepicker.css";

Modal.setAppElement("#root");

const Booking = ({ isOpen, onRequestClose, service }) => {
  const [move, setMove] = useState(1);
  const [additionService, setAdditionalService] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleNext = () => {
    if (move < 3) {
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
      await axios.post("", {
        service: service.name,
        additionService,
        date: selectedDate,
      });
      setLoading(false);
      onRequestClose();
      setMove(1);
    } catch (error) {
      setLoading(false);
      setError("Failed to confirm booking,Please try again.");
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
            <label>
              Do you want to add another appointment ?
              <input
                type="text"
                value={additionService}
                onChange={(e) => setAdditionalService(e.target.value)}
                placeholder="Add service"
              />
            </label>
            <div className="buttons">
              <button className="button-next" onClick={handleNext}>
                Next
              </button>
            </div>
          </div>
        )}
        {move === 2 && (
          <div className="step">
            <h2>Select a Date and Time</h2>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              showTimeSelect
              dateFormat="Pp"
              className="date-picker"
            />
            <div className="buttons">
              <button className="button-back" onClick={handleBack}>
                Back
              </button>
              <button className="button-next" onClick={handleNext}>
                Next
              </button>
            </div>
          </div>
        )}
        {move === 3 && (
          <div className="step">
            <h2>Confirm Your Booking</h2>
            <p>Service:{service.name}</p>
            {additionService && <p>Additional Service:{additionService}</p>}
            <p>
              Date:
              {selectedDate.toLocaleDateString()}
            </p>
            <p>Time:{selectedDate.toLocaleTimeString()}</p>
            {loading && <p> Loading...</p>}
            {error && <p>{error}</p>}
            <div className="buttons">
              <button className="button-back" onClick={handleBack}>
                Back
              </button>
              <button onClick={handleConfirm} disabled={loading}>
                Confirm
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Booking;
