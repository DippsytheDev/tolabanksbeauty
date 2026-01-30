import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Booking.css";
import BookingModal from "../Components/BookCard/Booking";
import ContactCard from "../Components/ContactCard/ContactCard";
import { people } from "../data";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import moment from "moment-timezone";

const Booking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1); // 1: Service, 2: Package, 3: Date/Time, 4: Details, 5: Confirm
  const [selectedServiceCategory, setSelectedServiceCategory] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    address: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    number: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const hasHandledInitialNavigation = useRef(false);
  const isNavigatingFromHistory = useRef(false);

  // Group services by category
  const bridalServices = people.filter(
    (service) =>
      (service.name.toLowerCase().includes("bridal session") ||
        service.name.toLowerCase().includes("civil wedding")) &&
      !service.name.toLowerCase().includes("home service") &&
      !service.name.toLowerCase().includes("in-studio")
  );

  const nonBridalServices = people.filter((service) =>
    service.name.toLowerCase().includes("non-bridal")
  );

  // For training - we'll use a placeholder since it's not in the data yet
  const trainingServices = [];

  // For DIY - we'll use a placeholder since it's not in the data yet
  const diyServices = [];

  // Get minimum prices from actual services
  const getMinPrice = (services) => {
    if (services.length === 0) return "Contact Us";
    const prices = services
      .map((s) => s.Price)
      .map((p) => p.replace(/[^0-9]/g, ""))
      .filter((p) => p)
      .map(Number);
    if (prices.length === 0) return "Contact Us";
    return `FROM $${Math.min(...prices)}`;
  };

  // Create service cards with the right data
  const serviceCards = [
    {
      id: "bridal",
      title: "BRIDAL SESSION",
      price: getMinPrice(bridalServices),
      description:
        "Your special day deserves flawless, long-lasting make-up that photographs beautifully and stays on till it's ready to come off.",
      image: "/Images/img45.jpg",
      services: bridalServices,
    },
    {
      id: "non-bridal",
      title: "NON-BRIDAL SESSION",
      price: getMinPrice(nonBridalServices),
      description:
        "Look stunning for any occasion with professional makeup artistry tailored to your style and the event.",
      image: "/Images/img41.jpg",
      services: nonBridalServices,
    },
    {
      id: "training",
      title: "BRIDAL PARTY",
      price: "From $230",
      description:
        "This service is ideal for bridesmaids,mother of the bride/groom.",
      image: "/Images/img43.jpg",
      services: trainingServices,
    },

    {
      id: "diy",
      title: "DIY",
      price: "$280",
      description:
        "Get expert guidance to do your own makeup with confidence. Perfect for beauty enthusiasts and makeup lovers.",
      image: nonBridalServices[0]?.img || "/Images/img10.jpg",
      services: diyServices,
    },
  ];

  const handleServiceClick = (serviceCard) => {
    // Set selected service category
    setSelectedServiceCategory(serviceCard);

    // For Training and DIY services, skip package selection and go directly to date/time
    if (serviceCard.id === "training" || serviceCard.id === "diy") {
      const placeholderPackage = {
        id: serviceCard.id,
        name: serviceCard.title,
        Price: serviceCard.price,
        Duration: "Contact Us",
        description: serviceCard.description,
      };
      setSelectedPackage(placeholderPackage);
      setCurrentStep(3); // Go directly to date/time step
      setBookingOpen(true);
      return;
    }

    // If there are no services, show a message
    if (serviceCard.services.length === 0) {
      alert("Please contact us directly for this service.");
      return;
    }

    // If there's only one service, skip package selection and go to date/time
    if (serviceCard.services.length === 1) {
      setSelectedPackage(serviceCard.services[0]);
      setCurrentStep(3); // Go directly to date/time step
      setBookingOpen(true);
    } else {
      // Move to package selection step
      setCurrentStep(2);
    }
  };

  const handlePackageSelect = (packageService) => {
    setSelectedPackage(packageService);
    setCurrentStep(3); // Move to date/time step
    setBookingOpen(true);
  };

  const handleBackToServices = () => {
    setCurrentStep(1);
    setSelectedServiceCategory(null);
    setSelectedPackage(null);
  };

  const handleBackToPackages = () => {
    // For Training and DIY, go back to services instead of packages
    if (
      selectedServiceCategory &&
      (selectedServiceCategory.id === "training" ||
        selectedServiceCategory.id === "diy")
    ) {
      setCurrentStep(1);
      setSelectedServiceCategory(null);
      setSelectedPackage(null);
      setBookingOpen(false);
    } else {
      setCurrentStep(2);
      setSelectedPackage(null);
      setBookingOpen(false);
    }
  };

  const closeBooking = () => {
    setBookingOpen(false);
    // If closing from date/time step, go back appropriately
    if (currentStep === 3) {
      // For Training and DIY, go back to services
      if (
        selectedServiceCategory &&
        (selectedServiceCategory.id === "training" ||
          selectedServiceCategory.id === "diy")
      ) {
        setCurrentStep(1);
      } else {
        setCurrentStep(2);
      }
    }
  };

  const handleModalClose = () => {
    setBookingOpen(false);
    // Reset appropriately if we were in the modal steps
    if (currentStep >= 3 && selectedServiceCategory) {
      // For Training and DIY, go back to services
      if (
        selectedServiceCategory.id === "training" ||
        selectedServiceCategory.id === "diy"
      ) {
        setCurrentStep(1);
      } else if (selectedServiceCategory.services.length > 1) {
        setCurrentStep(2);
      } else {
        setCurrentStep(1);
      }
    }
  };

  // Date filter function
  const filterBookingDates = (date) => {
    const isOctober2025 = moment(date).isBetween(
      moment("2025-10-01", "YYYY-MM-DD"),
      moment("2025-10-31", "YYYY-MM-DD"),
      null,
      "[]"
    );

    if (isOctober2025) {
      return false;
    }

    const isNovemberToDecember2025 = moment(date).isBetween(
      moment("2025-11-01", "YYYY-MM-DD"),
      moment("2025-12-31", "YYYY-MM-DD"),
      null,
      "[]"
    );

    if (isNovemberToDecember2025) {
      return false;
    }

    const janFirst2026 = moment("2026-01-01", "YYYY-MM-DD");
    const septFirst2025 = moment("2025-09-01", "YYYY-MM-DD");

    if (moment(date).isSameOrAfter(janFirst2026)) {
      return true;
    }
    if (moment(date).isSameOrAfter(septFirst2025)) {
      return true;
    }
    const day = moment(date).day();
    return day === 0 || day === 6;
  };

  // Handle date change
  const handleDateChange = async (date) => {
    setSelectedDate(date);
    setSelectedTime("");
    const formattedDate = moment(date)
      .tz("America/Edmonton")
      .set({ hour: 12, minute: 0 })
      .format("YYYY-MM-DD");

    let allTimes = [];
    const dayOfWeek = moment(date).day();
    const isNextYear = moment(date).year() >= 2024;

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

  // Scroll to top on mount/navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  // Scroll to top whenever the booking step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [currentStep]);

  // Handle initial service selection from navigation - MUST run first
  useEffect(() => {
    if (location.state?.serviceId && !hasHandledInitialNavigation.current) {
      hasHandledInitialNavigation.current = true;
      const { serviceId, initialStep } = location.state;
      const serviceCard = serviceCards.find((card) => card.id === serviceId);

      if (serviceCard) {
        setSelectedServiceCategory(serviceCard);

        if (initialStep === 2) {
          // Go to package selection
          setCurrentStep(2);
        } else if (initialStep === 3) {
          // For training/diy services, create a placeholder package
          if (serviceId === "training" || serviceId === "diy") {
            const placeholderPackage = {
              id: serviceId,
              name: serviceCard.title,
              Price: serviceCard.price,
              Duration: "Contact Us",
              description: serviceCard.description,
            };
            setSelectedPackage(placeholderPackage);
            setCurrentStep(3);
            setBookingOpen(true);
          } else {
            // For other services with packages
            if (serviceCard.services.length > 0) {
              setSelectedPackage(serviceCard.services[0]);
              setCurrentStep(3);
              setBookingOpen(true);
            }
          }
        }
      }
    }

    // Reset the ref when component unmounts or location changes without state
    if (!location.state?.serviceId) {
      hasHandledInitialNavigation.current = false;
    }
  }, [location.state]);

  // Handle browser back/forward button - update step from location state
  useEffect(() => {
    // Skip if we're handling initial service selection from navigation
    if (location.state?.serviceId) {
      return;
    }

    // When location state changes (including browser back/forward), update currentStep
    // Only update if step is different to avoid unnecessary re-renders
    if (location.state?.step && location.state.step !== currentStep) {
      const newStep = location.state.step;
      // Validate step exists in our booking flow
      if (newStep >= 1 && newStep <= 5) {
        isNavigatingFromHistory.current = true;
        setCurrentStep(newStep);
        // Reset flag after state update completes
        setTimeout(() => {
          isNavigatingFromHistory.current = false;
        }, 0);
      }
    } else if (
      !location.state?.step &&
      !location.state?.serviceId &&
      currentStep > 1 &&
      location.pathname === "/booking"
    ) {
      // If no step in state but we're past step 1 and on booking page, go to step 1
      isNavigatingFromHistory.current = true;
      setCurrentStep(1);
      setTimeout(() => {
        isNavigatingFromHistory.current = false;
      }, 0);
    }
  }, [location]); // Depend on entire location object to catch state changes

  // Push current step to history when step changes (so back button works)
  useEffect(() => {
    // Skip if we're navigating from history or handling initial service selection
    if (isNavigatingFromHistory.current || location.state?.serviceId) {
      return;
    }

    // Push to history when user navigates to a new step
    if (currentStep >= 1) {
      navigate(location.pathname, {
        state: { step: currentStep },
        replace: currentStep === 1, // Replace only on step 1 to avoid cluttering history
      });
    }
  }, [currentStep, navigate, location.pathname]);

  // Fetch unavailable times on mount and date change
  useEffect(() => {
    if (currentStep === 3 && selectedPackage) {
      handleDateChange(selectedDate);
    }
  }, [currentStep, selectedPackage, selectedDate]);

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleProceedToDetails = () => {
    if (selectedTime) {
      setCurrentStep(4);
      setBookingOpen(false);
    }
  };

  const handleBackToDateTime = () => {
    setCurrentStep(3);
  };

  const validateDetailsForm = () => {
    let errors = {};
    if (!formData.name.trim()) errors.name = "Full name is required";
    if (!formData.email.trim()) errors.email = "Email address is required";
    if (!formData.number.trim()) errors.number = "Phone number is required";

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleReviewBooking = () => {
    if (validateDetailsForm()) {
      setCurrentStep(5);
    }
  };

  const handleBackToDetails = () => {
    setCurrentStep(4);
  };

  const handleConfirmBooking = async () => {
    setLoading(true);
    setError(null);
    try {
      const dateOnly = moment(selectedDate).format("YYYY-MM-DD");
      await axios.post("https://end8.vercel.app/book", {
        name: formData.name,
        email: formData.email,
        number: formData.number,
        address: formData.address || "",
        message: formData.message || "",
        service: selectedPackage.name ? selectedPackage.name : "",
        price: selectedPackage.Price ? selectedPackage.Price : null,
        date: dateOnly,
        time: selectedTime,
      });
      setLoading(false);
      setSuccess(true);
    } catch (error) {
      setLoading(false);
      setError(
        "There was a problem submitting your booking. Please try again."
      );
    }
  };

  const handleReturnHome = () => {
    navigate("/");
  };

  const handleBookAnother = () => {
    // Reset the booking state and start over
    setCurrentStep(1);
    setSelectedServiceCategory(null);
    setSelectedPackage(null);
    setSelectedDate(new Date());
    setSelectedTime("");
    setFormData({
      name: "",
      email: "",
      number: "",
      address: "",
      message: "",
    });
    setSuccess(false);
    setError(null);
    setLoading(false);
  };

  return (
    <div className="booking-page">
      {/* Progress Steps - Only top section with cream background */}
      <div className="booking-progress">
        <div className="progress-steps">
          <div className={`progress-step ${currentStep >= 1 ? "active" : ""}`}>
            <div className={`step-circle ${currentStep >= 1 ? "active" : ""}`}>
              1
            </div>
            <span className="step-label">SERVICE</span>
          </div>
          <div
            className={`progress-line ${currentStep >= 2 ? "active" : ""}`}
          ></div>
          <div className={`progress-step ${currentStep >= 2 ? "active" : ""}`}>
            <div className={`step-circle ${currentStep >= 2 ? "active" : ""}`}>
              2
            </div>
            <span className="step-label">PACKAGE</span>
          </div>
          <div
            className={`progress-line ${currentStep >= 3 ? "active" : ""}`}
          ></div>
          <div className={`progress-step ${currentStep >= 3 ? "active" : ""}`}>
            <div className={`step-circle ${currentStep >= 3 ? "active" : ""}`}>
              3
            </div>
            <span className="step-label">DATE &amp; TIME</span>
          </div>
          <div
            className={`progress-line ${currentStep >= 4 ? "active" : ""}`}
          ></div>
          <div className={`progress-step ${currentStep >= 4 ? "active" : ""}`}>
            <div className={`step-circle ${currentStep >= 4 ? "active" : ""}`}>
              4
            </div>
            <span className="step-label">DETAILS</span>
          </div>
          <div
            className={`progress-line ${currentStep >= 5 ? "active" : ""}`}
          ></div>
          <div className={`progress-step ${currentStep >= 5 ? "active" : ""}`}>
            <div className={`step-circle ${currentStep >= 5 ? "active" : ""}`}>
              5
            </div>
            <span className="step-label">CONFIRM</span>
          </div>
        </div>
      </div>

      {/* Content Area - White background */}
      <div className="booking-content">
        {currentStep === 1 && (
          <>
            <div className="booking-header">
              <h1 className="booking-title">Choose your Service</h1>
              <p className="booking-subtitle">
                Choose the type of service you're interested in
              </p>
            </div>

            <div className="service-cards-grid">
              {serviceCards.map((serviceCard) => (
                <div
                  key={serviceCard.id}
                  className="service-card"
                  onClick={() => handleServiceClick(serviceCard)}
                >
                  <div className="service-card-image">
                    <img src={serviceCard.image} alt={serviceCard.title} />
                  </div>
                  <div className="service-card-content">
                    <div className="service-card-header">
                      <h3 className="service-card-title">
                        {serviceCard.title}
                      </h3>
                      <p className="service-card-price">{serviceCard.price}</p>
                    </div>
                    <p className="service-card-description">
                      {serviceCard.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {currentStep === 2 && selectedServiceCategory && (
          <>
            <div className="booking-header">
              <h1 className="booking-title">Select Package</h1>
              <p className="booking-subtitle">
                Choose your preferred package for{" "}
                {selectedServiceCategory.title}
              </p>
              <button className="back-button" onClick={handleBackToServices}>
                ← Back to Services
              </button>
            </div>

            <div className="package-selection">
              {selectedServiceCategory.services.map((service) => {
                // Extract package name
                let packageName = service.name;
                if (service.name.includes("(")) {
                  packageName =
                    service.name.match(/\(([^)]+)\)/)?.[1] || service.name;
                } else {
                  packageName = service.name
                    .replace(selectedServiceCategory.title, "")
                    .trim();
                }

                return (
                  <div
                    key={service.id}
                    className="package-card"
                    onClick={() => handlePackageSelect(service)}
                  >
                    <div className="package-card-content">
                      <div className="package-card-header">
                        <h3 className="package-card-title">
                          {packageName || service.name}
                        </h3>
                        <p className="package-card-price">{service.Price}</p>
                      </div>
                      {service.description && (
                        <p className="package-card-description">
                          {service.description}
                        </p>
                      )}
                      {service.Duration && (
                        <p className="package-card-duration">
                          {service.Duration.toUpperCase()}
                        </p>
                      )}
                      {service.Location && (
                        <p className="package-card-location">
                          {service.Location}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {currentStep === 3 && selectedPackage && (
          <div className="date-time-selection">
            <div className="back-to-package">
              <button className="back-link" onClick={handleBackToPackages}>
                {selectedServiceCategory &&
                (selectedServiceCategory.id === "training" ||
                  selectedServiceCategory.id === "diy")
                  ? "← Back to Services"
                  : "← Back to Package"}
              </button>
            </div>
            <div className="package-name-display">{selectedPackage.name}</div>
            <h2 className="date-time-title">Select Date & Time</h2>
            <p className="date-time-subtitle">
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
                      const isSelected = selectedTime === time;
                      const time12h = moment(time, "HH:mm").format("h:mmA");
                      return (
                        <button
                          key={time}
                          type="button"
                          className={`time-slot-btn ${
                            isSelected ? "selected" : ""
                          }`}
                          onClick={() => handleTimeSelect(time)}
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

            <div className="proceed-button-container">
              <button
                className="btn-proceed"
                onClick={handleProceedToDetails}
                disabled={!selectedTime}
              >
                PROCEED
              </button>
            </div>
          </div>
        )}

        {currentStep === 4 && selectedPackage && (
          <div className="details-selection">
            <div className="back-to-date-time">
              <button className="back-link" onClick={handleBackToDateTime}>
                ← Back to Date and Time
              </button>
            </div>
            <div className="package-name-display">{selectedPackage.name}</div>
            <h2 className="details-title">Your Details</h2>
            <p className="details-subtitle">
              Please provide your correct information
            </p>

            <div className="details-form">
              <div className="form-field">
                <label className="form-label">
                  FULL NAME<span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="your full name"
                  className="form-input"
                  required
                />
                {formErrors.name && (
                  <p className="form-error">{formErrors.name}</p>
                )}
              </div>

              <div className="form-field">
                <label className="form-label">
                  EMAIL ADDRESS<span className="required">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="your email address"
                  className="form-input"
                  required
                />
                {formErrors.email && (
                  <p className="form-error">{formErrors.email}</p>
                )}
              </div>

              <div className="form-field">
                <label className="form-label">
                  PHONE NUMBER<span className="required">*</span>
                </label>
                <input
                  type="tel"
                  name="number"
                  value={formData.number}
                  onChange={(e) =>
                    setFormData({ ...formData, number: e.target.value })
                  }
                  placeholder="your phone number"
                  className="form-input"
                  required
                />
                {formErrors.number && (
                  <p className="form-error">{formErrors.number}</p>
                )}
              </div>

              <div className="form-field">
                <label className="form-label">
                  ADDITIONAL NOTES <span className="optional">(OPTIONAL)</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="any additional information"
                  className="form-textarea"
                  rows={4}
                />
              </div>

              <div className="review-button-container">
                <button className="btn-review" onClick={handleReviewBooking}>
                  REVIEW BOOKING
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 5 && selectedPackage && !success && (
          <div className="confirm-selection">
            <div className="back-to-details">
              <button className="back-link" onClick={handleBackToDetails}>
                ← Back to Details
              </button>
            </div>
            <div className="package-name-display">
              {(() => {
                let serviceType = "";
                let packageName = "";

                if (selectedPackage.name.includes("BRIDAL SESSION")) {
                  serviceType = "BRIDAL";
                  if (selectedPackage.name.includes("(")) {
                    packageName =
                      selectedPackage.name.match(/\(([^)]+)\)/)?.[1] || "";
                  }
                } else if (selectedPackage.name.includes("NON-BRIDAL")) {
                  serviceType = "NON-BRIDAL";
                  if (selectedPackage.name.includes("(")) {
                    packageName =
                      selectedPackage.name.match(/\(([^)]+)\)/)?.[1] || "";
                  } else if (selectedPackage.name.includes("Home Service")) {
                    packageName = "HOME SERVICE";
                  } else if (selectedPackage.name.includes("In-Studio")) {
                    packageName = "IN-STUDIO";
                  }
                } else if (selectedPackage.name.includes("CIVIL")) {
                  return selectedPackage.name;
                } else if (selectedPackage.name.includes("TRAIN")) {
                  return selectedPackage.name;
                }

                return packageName
                  ? `${serviceType} - ${packageName.toUpperCase()}`
                  : selectedPackage.name;
              })()}
            </div>
            <h2 className="confirm-title">Confirm your Booking</h2>
            <p className="confirm-subtitle">
              Please review your booking details before confirming
            </p>

            <div className="confirm-card">
              <div className="confirm-details">
                <div className="confirm-section">
                  <h3 className="confirm-section-title">Service Details</h3>
                  <div className="confirm-row">
                    <span className="confirm-label">Service:</span>
                    <span className="confirm-value">
                      {selectedPackage.name.includes("BRIDAL")
                        ? "Bridal"
                        : selectedPackage.name.includes("NON-BRIDAL")
                        ? "Non-Bridal"
                        : selectedPackage.name.includes("CIVIL")
                        ? "Civil Wedding"
                        : selectedPackage.name.includes("TRAIN")
                        ? "Bridal Train Makeup"
                        : "Service"}
                    </span>
                  </div>
                  <div className="confirm-row">
                    <span className="confirm-label">Package:</span>
                    <span className="confirm-value">
                      {(() => {
                        if (selectedPackage.name.includes("(")) {
                          const packageName =
                            selectedPackage.name.match(/\(([^)]+)\)/)?.[1];
                          return packageName || "N/A";
                        } else if (
                          selectedPackage.name.includes("BRIDAL SESSION")
                        ) {
                          const packageName = selectedPackage.name
                            .replace("BRIDAL SESSION", "")
                            .trim();
                          return packageName || "Standard";
                        } else if (
                          selectedPackage.name.includes("NON-BRIDAL SESSION")
                        ) {
                          if (selectedPackage.name.includes("Home Service")) {
                            return "Home Service";
                          } else if (
                            selectedPackage.name.includes("In-Studio")
                          ) {
                            return "In-Studio";
                          }
                          return "Standard";
                        } else if (
                          selectedPackage.name.includes("CIVIL") ||
                          selectedPackage.name.includes("TRAIN")
                        ) {
                          return "N/A";
                        }
                        return "Standard";
                      })()}
                    </span>
                  </div>
                  {selectedPackage.Duration && (
                    <div className="confirm-row">
                      <span className="confirm-label">Duration:</span>
                      <span className="confirm-value">
                        {selectedPackage.Duration}
                      </span>
                    </div>
                  )}
                </div>

                <div className="confirm-section">
                  <h3 className="confirm-section-title">Appointment</h3>
                  <div className="confirm-row">
                    <span className="confirm-label">Date:</span>
                    <span className="confirm-value">
                      {moment(selectedDate).format("Do MMMM, YYYY")}
                    </span>
                  </div>
                  <div className="confirm-row">
                    <span className="confirm-label">Time:</span>
                    <span className="confirm-value">
                      {moment(selectedTime, "HH:mm").format("h:mm A")}
                    </span>
                  </div>
                </div>

                <div className="confirm-section">
                  <h3 className="confirm-section-title">Contact Information</h3>
                  <div className="confirm-row">
                    <span className="confirm-label">Name:</span>
                    <span className="confirm-value">{formData.name}</span>
                  </div>
                  <div className="confirm-row">
                    <span className="confirm-label">Email:</span>
                    <span className="confirm-value">{formData.email}</span>
                  </div>
                  <div className="confirm-row">
                    <span className="confirm-label">Phone Number:</span>
                    <span className="confirm-value">{formData.number}</span>
                  </div>
                  <div className="confirm-row">
                    <span className="confirm-label">
                      Additional Information:
                    </span>
                    <span className="confirm-value">
                      {formData.message || "None"}
                    </span>
                  </div>
                </div>

                <div className="confirm-total-section">
                  <div className="confirm-total-content">
                    <div className="confirm-total-left">
                      <span className="confirm-total-label">Total:</span>
                      <span className="confirm-total-note">
                        Payment will be collected at the appointment
                      </span>
                    </div>
                    <div className="confirm-total-right">
                      <span className="confirm-total-price">
                        {selectedPackage.Price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {error && <p className="confirm-error">{error}</p>}

              <div className="confirm-button-container">
                <button
                  className="btn-confirm-booking"
                  onClick={handleConfirmBooking}
                  disabled={loading}
                >
                  {loading ? "PROCESSING..." : "CONFIRM BOOKING"}
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 5 && selectedPackage && success && (
          <div className="booking-confirmed-selection">
            <div className="package-name-display">
              {(() => {
                let serviceType = "";
                let packageName = "";

                if (selectedPackage.name.includes("BRIDAL SESSION")) {
                  serviceType = "BRIDAL";
                  if (selectedPackage.name.includes("(")) {
                    packageName =
                      selectedPackage.name.match(/\(([^)]+)\)/)?.[1] || "";
                  }
                } else if (selectedPackage.name.includes("NON-BRIDAL")) {
                  serviceType = "NON-BRIDAL";
                  if (selectedPackage.name.includes("(")) {
                    packageName =
                      selectedPackage.name.match(/\(([^)]+)\)/)?.[1] || "";
                  } else if (selectedPackage.name.includes("Home Service")) {
                    packageName = "HOME SERVICE";
                  } else if (selectedPackage.name.includes("In-Studio")) {
                    packageName = "IN-STUDIO";
                  }
                } else if (selectedPackage.name.includes("CIVIL")) {
                  return selectedPackage.name;
                } else if (selectedPackage.name.includes("TRAIN")) {
                  return selectedPackage.name;
                }

                return packageName
                  ? `${serviceType} - ${packageName.toUpperCase()}`
                  : selectedPackage.name;
              })()}
            </div>
            <h2 className="booking-confirmed-title">Booking Confirmed!</h2>
            <p className="booking-confirmed-message">
              Thank you for booking with makeupbybims. We have sent a
              confirmation email to{" "}
              <span className="booking-confirmed-email">{formData.email}</span>
            </p>

            <div className="booking-confirmed-card">
              <div className="booking-summary-section">
                <h3 className="booking-summary-title">Booking Summary</h3>
                <div className="booking-summary-row">
                  <span className="booking-summary-label">Service:</span>
                  <span className="booking-summary-value">
                    {(() => {
                      const serviceName = selectedPackage.name.includes(
                        "BRIDAL"
                      )
                        ? "Bridal"
                        : selectedPackage.name.includes("NON-BRIDAL")
                        ? "Non-Bridal"
                        : selectedPackage.name.includes("CIVIL")
                        ? "Civil Wedding"
                        : selectedPackage.name.includes("TRAIN")
                        ? "Bridal Train Makeup"
                        : "Service";

                      let packagePart = "";
                      if (selectedPackage.name.includes("(")) {
                        packagePart =
                          selectedPackage.name.match(/\(([^)]+)\)/)?.[1] || "";
                      } else if (
                        selectedPackage.name.includes("BRIDAL SESSION")
                      ) {
                        packagePart = selectedPackage.name
                          .replace("BRIDAL SESSION", "")
                          .trim();
                      } else if (
                        selectedPackage.name.includes("NON-BRIDAL SESSION")
                      ) {
                        if (selectedPackage.name.includes("Home Service")) {
                          packagePart = "Home Service";
                        } else if (selectedPackage.name.includes("In-Studio")) {
                          packagePart = "In-Studio";
                        }
                      }

                      return packagePart
                        ? `${serviceName} - ${packagePart}`
                        : serviceName;
                    })()}
                  </span>
                </div>
                <div className="booking-summary-row">
                  <span className="booking-summary-label">Date:</span>
                  <span className="booking-summary-value">
                    {moment(selectedDate).format("dddd, MMMM Do YYYY")}
                  </span>
                </div>
                <div className="booking-summary-row">
                  <span className="booking-summary-label">Time:</span>
                  <span className="booking-summary-value">
                    {moment(selectedTime, "HH:mm").format("h:mm A")}
                  </span>
                </div>
                <div className="booking-summary-row">
                  <span className="booking-summary-label">Amount:</span>
                  <span className="booking-summary-amount">
                    {selectedPackage.Price}
                  </span>
                </div>
              </div>

              <div className="booking-confirmed-buttons">
                <button className="btn-return-home" onClick={handleReturnHome}>
                  RETURN HOME
                </button>
                <button
                  className="btn-book-another"
                  onClick={handleBookAnother}
                >
                  BOOK ANOTHER SESSION
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer - Show on steps 1-5 */}
      {currentStep >= 1 && currentStep <= 5 && <ContactCard />}
    </div>
  );
};

export default Booking;
