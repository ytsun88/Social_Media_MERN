import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import FriendService from "../services/friend.service";

const NavComponents = (props) => {
  let { currentUser, setCurrentUser } = props;
  let [invitations, setInvitations] = useState(0);
  let [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  const fetchNotificationCount = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user")); // get JWT token from localStorage
      if (!user || !user.token) {
        // do nothing if there is no JWT token
        return;
      }
      setCurrentUser(user);
      const response = await FriendService.checkCurrentUser();

      const data = response.data;

      if (data && data.requests !== undefined) {
        setInvitations(data.requests ? data.requests.length : 0);
        setRequests(data.requests ? data.requests : []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNotificationCount();
    const intervalId = setInterval(() => {
      fetchNotificationCount();
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    window.alert("You have been logged out.");
    setCurrentUser(null);
    navigate("/");
  };
  const handleAgree = (e) => {
    let currentInvitation = Number(
      e.target.parentElement.parentElement.parentElement.parentElement.querySelector(
        ".badge"
      ).innerText
    );
    let newInvitation = currentInvitation - 1;
    e.target.parentElement.parentElement.parentElement.parentElement.querySelector(
      ".badge"
    ).innerText = newInvitation;
    setInvitations(newInvitation);
    FriendService.deleteInvitation(e.target.id)
      .then()
      .catch((err) => {
        console.log(err);
        window.alert(err.response.data);
      });
    FriendService.addFriendByID(e.target.id)
      .then(() => {
        currentUser.user.friends.push(e.target.id);
        for (let i = 0; i < currentUser.user.requests.length; i++) {
          if (currentUser.user.requests[i].sentByID == e.target.id) {
            currentUser.user.requests.splice(i, 1);
          }
        }
        setCurrentUser(currentUser);
        localStorage.setItem("user", JSON.stringify(currentUser));
        // window.alert("Accept the invitation.");
        // navigate(0);
      })
      .catch((err) => {
        console.log(err);
        window.alert(err.response.data);
      });
    e.target.parentElement.classList.toggle("d-none");
  };
  const handleDisagree = (e) => {
    let currentInvitation = Number(
      e.target.parentElement.parentElement.parentElement.parentElement.querySelector(
        ".badge"
      ).innerText
    );
    let newInvitation = currentInvitation - 1;
    e.target.parentElement.parentElement.parentElement.parentElement.querySelector(
      ".badge"
    ).innerText = newInvitation;
    setInvitations(newInvitation);
    FriendService.deleteInvitation(e.target.id)
      .then(() => {
        for (let i = 0; i < currentUser.user.requests.length; i++) {
          if (currentUser.user.requests[i].sentByID == e.target.id) {
            currentUser.user.requests.splice(i, 1);
          }
        }
        setCurrentUser(currentUser);
        localStorage.setItem("user", JSON.stringify(currentUser));
        // window.alert("Reject the invitation.");
        // navigate(0);
      })
      .catch((err) => {
        console.log(err);
        window.alert(err.response.data);
      });
    e.target.parentElement.classList.toggle("d-none");
  };
  return (
    <nav
      className="navbar sticky-top bg-body-tertiary navbar-expand-lg navbar-light bg-light btn-group"
      style={{ padding: "1rem" }}
    >
      <div className="container-fluid">
        {!currentUser && (
          <Link className="navbar-brand" to="/">
            Facetbook
          </Link>
        )}
        {currentUser && (
          <Link className="navbar-brand" to="/cover">
            Facetbook
          </Link>
        )}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            {!currentUser && (
              <li className="nav-item">
                <Link className="nav-link btn btn-light" to="/register">
                  Register
                </Link>
              </li>
            )}
            {!currentUser && (
              <li className="nav-item">
                <Link className="nav-link btn btn-light" to="/login">
                  Login
                </Link>
              </li>
            )}
            {currentUser && currentUser.user && (
              <li className="nav-item">
                <Link className="nav-link btn btn-light" to="/addFriend">
                  Find Friends
                </Link>
              </li>
            )}
            {currentUser && currentUser.user && (
              <li className="nav-item">
                <Link className="nav-link btn btn-light" to="/post">
                  Post
                </Link>
              </li>
            )}
          </ul>
          {currentUser && currentUser.user && (
            <div
              className="collapse navbar-collapse justify-content-end"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav ">
                <li className="nav-item dropdown ">
                  <Link
                    className="nav-link dropdown-toggle btn btn-light"
                    to="#"
                    id="navbarDropdownMenuLink"
                    data-toggle="dropdown"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    Invitations{" "}
                    {invitations != 0 && (
                      <span className="badge text-bg-danger">
                        {invitations}
                      </span>
                    )}
                  </Link>
                  <div
                    className="dropdown-menu dropdown-menu-end"
                    aria-labelledby="navbarDropdownMenuLink"
                    style={{ padding: "1rem" }}
                  >
                    {requests.length == 0 && <p>No invitation</p>}
                    {requests.length > 0 && (
                      <div>
                        {requests.map((request) => (
                          <div
                            className="dropdown-item"
                            style={{ padding: "1rem" }}
                            key={request.sentByID}
                          >
                            <h5>{request.sentByName}</h5>
                            <button
                              className="btn btn-success"
                              style={{ fontSize: "0.5rem" }}
                              id={request.sentByID}
                              onClick={handleAgree}
                            >
                              Agree
                            </button>{" "}
                            <button
                              className="btn btn-danger"
                              style={{ fontSize: "0.5rem" }}
                              id={request.sentByID}
                              onClick={handleDisagree}
                            >
                              Disagree
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </li>
                <li className="nav-item dropdown ">
                  <Link
                    className="nav-link dropdown-toggle btn btn-light"
                    to="#"
                    id="navbarDropdownMenuLink"
                    data-toggle="dropdown"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    {currentUser.user.username}
                  </Link>
                  <div
                    className="dropdown-menu dropdown-menu-end"
                    aria-labelledby="navbarDropdownMenuLink"
                  >
                    <Link className="dropdown-item" to="/profile">
                      My profile
                    </Link>
                    <Link className="dropdown-item" to="/myFriends">
                      My friends
                    </Link>
                    <Link className="dropdown-item" to="/myPosts">
                      My Posts
                    </Link>
                    <Link
                      onClick={handleLogout}
                      className="dropdown-item"
                      to="/"
                    >
                      Logout
                    </Link>
                  </div>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavComponents;
