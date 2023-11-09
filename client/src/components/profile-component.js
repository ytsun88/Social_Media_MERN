import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";

const ProfileComponent = (props) => {
  let { currentUser, setCurrentUser } = props;
  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/login");
  };
  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <div className="alert alert-danger" role="alert">
            You must login first before checking your profile.
          </div>
          <button onClick={handleBack} className="btn btn-primary btn-block">
            Take me back to login page.
          </button>
        </div>
      )}
      {currentUser && (
        <div className="card">
          <div className="card-header">
            <h2>{currentUser.user.username}'s Profile</h2>
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <h4>
                Birthday: <br />
                {currentUser.user.birthday.substring(0, 10)}
              </h4>
            </li>
            <li className="list-group-item">
              <h4>
                Email: <br />
                {currentUser.user.email}
              </h4>
            </li>
            <li className="list-group-item">
              <h4>
                Established: <br />
                {new Date(currentUser.user.date).toLocaleString()}
              </h4>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileComponent;
