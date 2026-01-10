import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Services = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to booking page
    navigate("/booking", { replace: true });
  }, [navigate]);

  return null;
};

export default Services;

