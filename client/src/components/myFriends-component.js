import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FriendService from "../services/friend.service";

const MyFriendsComponent = (props) => {
  let { currentUser, setCurrentUser } = props;
  const navigate = useNavigate();
  let [friends, setFriends] = useState(null);
  useEffect(() => {
    FriendService.getAllFriends()
      .then((response) => {
        setFriends(response.data);
      })
      .catch((err) => {
        console.log(err);
        window.alert(err.response.data);
      });
  }, []);
  const handleBack = () => {
    navigate("/login");
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
    navigate("/friendPage", {
      state: {
        friendID: e.target.id,
        friendName: e.target.innerText,
      },
    });
  };
  const handletoAddFriend = () => {
    navigate("/addFriend");
  };
  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <div className="alert alert-danger" role="alert">
            You must login first before checking your posts.
          </div>
          <button onClick={handleBack} className="btn btn-primary btn-block">
            Take me back to login page.
          </button>
        </div>
      )}
      {currentUser && friends && friends.length == 0 && (
        <div>
          <h3>No friend yet.</h3>
          <button
            onClick={handletoAddFriend}
            className="btn btn-primary btn-block"
          >
            Find your friends!
          </button>
        </div>
      )}
      {currentUser && friends && friends.length != 0 && (
        <div>
          <h2>My friends: </h2>
          <h4>Total: {friends.length}</h4>
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {friends.map((friend) => (
              <div key={friend._id} className="col">
                <div key={friend._id} className="card">
                  <div className="card-header">
                    <button
                      className="btn btn-outline-dark border-0"
                      id={friend._id}
                      onClick={handleToFriendPage}
                    >
                      {friend.username}
                    </button>
                  </div>
                  <div className="card-body">
                    <p className="card-text">
                      {friend.birthday.substring(0, 10)}
                    </p>
                    <p className="card-text">{friend.email}</p>
                    <p className="card-text">
                      Friends: {friend.friends.length}
                    </p>
                    <div>
                      <button
                        onClick={handleDelete}
                        className="btn btn-outline-danger"
                        id={friend._id}
                        style={{ margin: "0.5rem" }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyFriendsComponent;
