import axios from "axios";
const API_URL = "http://localhost:8080/api/friend";

class FriendService {
  getUserByID(_id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.get(API_URL + "/findByID/" + _id, {
      headers: { Authorization: token },
    });
  }
  getUserByName(name) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.get(API_URL + "/findByName/" + name, {
      headers: { Authorization: token },
    });
  }
  getUserByKey(key) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.get(API_URL + "/findByKey/" + key, {
      headers: { Authorization: token },
    });
  }
  addFriendByID(_friend_id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.post(
      API_URL + "/addFriend/" + _friend_id,
      {},
      {
        headers: { Authorization: token },
      }
    );
  }
  deleteFriendByID(_friend_id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.post(
      API_URL + "/deleteFriend/" + _friend_id,
      {},
      {
        headers: { Authorization: token },
      }
    );
  }
  getAllFriends() {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.get(API_URL + "/myFriends", {
      headers: { Authorization: token },
    });
  }
  sendInvitation(friendID) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.post(
      API_URL + "/sendInvitation/" + friendID,
      {},
      {
        headers: { Authorization: token },
      }
    );
  }
  cancelInvitation(friendID) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.post(
      API_URL + "/cancelInvitation/" + friendID,
      {},
      {
        headers: { Authorization: token },
      }
    );
  }
  deleteInvitation(friendID) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.post(
      API_URL + "/deleteInvitation/" + friendID,
      {},
      {
        headers: { Authorization: token },
      }
    );
  }
  checkCurrentUser() {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.get(API_URL + "/checkCurrentUser", {
      headers: { Authorization: token },
    });
  }
}

export default new FriendService();
