import axios from "axios";

const API_URL = "http://localhost:8080/api/user";

class AuthService {
  login(email, password) {
    return axios.post(API_URL + "/login", {
      email,
      password,
    });
  }
  logout() {
    localStorage.removeItem("user");
  }
  register(username, birthday, email, password) {
    return axios.post(API_URL + "/register", {
      username,
      birthday,
      email,
      password,
    });
  }
  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
  googleLogin(username, email, googleID) {
    return axios.post(API_URL + "/googleLogin", {
      username,
      email,
      googleID,
    });
  }
}

export default new AuthService();
