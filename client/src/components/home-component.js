import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const HomeComponent = (props) => {
  let { currentUser, setCurrentUser } = props;
  const navigate = useNavigate();
  useEffect(() => {
    if (currentUser) {
      navigate("/cover");
    }
  }, []);
  const handleToLogin = () => {
    navigate("/login");
  };
  const handleToRegister = () => {
    navigate("/register");
  };
  return (
    <div style={{ padding: "3rem" }}>
      <div>
        <div>
          <h1>It's time to explore the amazing Facetbook!!</h1>
        </div>
        <button onClick={handleToLogin} className="btn btn-primary btn-block">
          Login
        </button>
        <span> or </span>
        <button
          onClick={handleToRegister}
          className="btn btn-primary btn-block"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default HomeComponent;
