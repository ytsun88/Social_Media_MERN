import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FriendService from "../services/friend.service";

const AddFriendComponent = (props) => {
  let { currentUser, setCurrentUser } = props;
  let [input, setInput] = useState("");
  let [foundusers, setFoundusers] = useState(null);
  const navigate = useNavigate();
  const handleTakeToLogin = () => {
    navigate("/login");
  };
  const handleChangeInput = (e) => {
    setInput(e.target.value.toLowerCase());
  };
  const handleSearch = () => {
    FriendService.getUserByKey(input)
      .then((response) => {
        setFoundusers(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleSendInvitation = (e) => {
    if (e.target.innerText == "Add") {
      FriendService.sendInvitation(e.target.id)
        .then(() => {
          e.target.classList.toggle("btn-primary");
          e.target.classList.toggle("btn-outline-secondary");
          e.target.innerText = "Invitation Sent";
        })
        .catch((err) => {
          console.log(err);
          window.alert(err.response.data);
        });
    } else if (e.target.innerText == "Invitation Sent") {
      FriendService.cancelInvitation(e.target.id)
        .then(() => {
          e.target.classList.toggle("btn-primary");
          e.target.classList.toggle("btn-outline-secondary");
          e.target.innerText = "Add";
        })
        .catch((err) => {
          console.log(err);
          window.alert(err.response.data);
        });
    } else if (e.target.innerText == "Delete") {
      FriendService.deleteFriendByID(e.target.id)
        .then(() => {
          for (let i = 0; i < currentUser.user.friends.length; i++) {
            if (currentUser.user.friends[i] == e.target.id) {
              currentUser.user.friends.splice(i, 1);
            }
          }
          setCurrentUser(currentUser);
          localStorage.setItem("user", JSON.stringify(currentUser));
          navigate(0);
        })
        .catch((err) => {
          console.log(err);
          window.alert(err.response.data);
        });
    }
  };
  const handleAdd = (e) => {
    FriendService.addFriendByID(e.target.id)
      .then(() => {
        currentUser.user.friends.push(e.target.id);
        setCurrentUser(currentUser);
        localStorage.setItem("user", JSON.stringify(currentUser));
        window.alert("Succeed.");
        navigate(0);
      })
      .catch((err) => {
        console.log(err);
        window.alert(err.response.data);
      });
  };
  const handleDelete = (e) => {
    FriendService.deleteFriendByID(e.target.id)
      .then(() => {
        for (let i = 0; i < currentUser.user.friends.length; i++) {
          if (currentUser.user.friends[i] == e.target.id) {
            currentUser.user.friends.splice(i, 1);
          }
        }
        setCurrentUser(currentUser);
        localStorage.setItem("user", JSON.stringify(currentUser));
        window.alert("Succeed.");
        navigate(0);
      })
      .catch((err) => {
        console.log(err);
        window.alert(err.response.data);
      });
  };
  const handleToFriendPage = (e) => {
    if (e.target.id == currentUser.user._id) {
      navigate("/myPosts");
    } else {
      navigate("/friendPage", {
        state: {
          friendID: e.target.id,
          friendName: e.target.innerText,
        },
      });
    }
  };
  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>You must login first before searching for courses.</p>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleTakeToLogin}
          >
            Take me to login page.
          </button>
        </div>
      )}
      {currentUser && (
        <div>
          <h5>Find your friends:</h5>
          <div className="search input-group mb-3">
            <input
              onChange={handleChangeInput}
              type="text"
              className="form-control"
            />
            <button onClick={handleSearch} className="btn btn-primary">
              Search
            </button>
          </div>
        </div>
      )}
      {currentUser && foundusers && foundusers.length != 0 && (
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {foundusers.map((user) => (
            <div className="col" key={user._id}>
              <div key={user._id} className="card" style={{ width: "18rem" }}>
                <div className="card-header">
                  <button
                    className="btn btn-outline-dark border-0"
                    id={user._id}
                    onClick={handleToFriendPage}
                  >
                    {user.username}
                  </button>
                </div>
                <div className="card-body">
                  <p className="card-text">{user.birthday.substring(0, 10)}</p>
                  <p className="card-text">{user.email}</p>
                  <p className="card-text">Friends: {user.friends.length}</p>
                  {user._id != currentUser.user._id &&
                    !user.friends.includes(currentUser.user._id) &&
                    !currentUser.user.friends.includes(user._id) &&
                    !user.requests.some(
                      (e) => e._id == currentUser.user._id
                    ) && (
                      <div>
                        <button
                          onClick={handleSendInvitation}
                          className="btn btn-primary"
                          id={user._id}
                          style={{ margin: "0.5rem" }}
                        >
                          Add
                        </button>
                      </div>
                    )}
                  {user._id != currentUser.user._id &&
                    !user.friends.includes(currentUser.user._id) &&
                    !currentUser.user.friends.includes(user._id) &&
                    user.requests.some(
                      (e) => e._id == currentUser.user._id
                    ) && (
                      <div>
                        <button
                          onClick={handleSendInvitation}
                          className="btn btn-outline-secondary"
                          id={user._id}
                          style={{ margin: "0.5rem" }}
                        >
                          Invitation Sent
                        </button>
                      </div>
                    )}
                  {user._id != currentUser.user._id &&
                    user.friends.includes(currentUser.user._id) &&
                    currentUser.user.friends.includes(user._id) && (
                      <div>
                        <button
                          onClick={handleSendInvitation}
                          className="btn btn-danger"
                          id={user._id}
                          style={{ margin: "0.5rem" }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  {user._id == currentUser.user._id && (
                    <div>
                      <button
                        className="btn btn-primary disabled"
                        id={user._id}
                        style={{ margin: "0.5rem" }}
                      >
                        Yourself
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {currentUser && foundusers && foundusers.length == 0 && (
        <div>
          <h3>No user found</h3>
        </div>
      )}
    </div>
  );
};

export default AddFriendComponent;
