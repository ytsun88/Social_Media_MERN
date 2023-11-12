import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

const LoginComponent = (props) => {
  let { currentUser, setCurrentUser } = props;
  const navigate = useNavigate();
  let [message, setMessage] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };
  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleLogin = () => {
    AuthService.login(email, password)
      .then((response) => {
        if (response.data.token) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        setCurrentUser(AuthService.getCurrentUser());
        navigate("/cover");
      })
      .catch((err) => {
        console.log(err.response);
        setMessage(err.response.data);
      });
  };
  const GoogleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => {
      try {
        axios
          .get(
            `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${codeResponse.access_token}`,
            {
              headers: {
                Authorization: `Bearer ${codeResponse.access_token}`,
                Accept: "application/json",
              },
            }
          )
          .then((res) => {
            const username = res.data.name;
            const googleID = res.data.id;
            const email = res.data.email;
            AuthService.googleLogin(username, email, googleID)
              .then((response) => {
                if (response.data.token) {
                  localStorage.setItem("user", JSON.stringify(response.data));
                }
                setCurrentUser(AuthService.getCurrentUser());
                navigate("/cover");
              })
              .catch((err) => {
                console.log(err.response);
                setMessage(err.response.data);
              });
          })
          .catch((err) => console.log(err));
      } catch (error) {}
    },
    onError: (error) => console.log("Login Failed:", error),
  });
  return (
    <div style={{ padding: "3rem" }} className="col-md-12">
      <div>
        {message && (
          <div className="alert alert-danger" role="alert">
            {message}
          </div>
        )}
        <div className="form-group">
          <label htmlFor="username">Email</label>
          <input
            onChange={handleChangeEmail}
            type="text"
            className="form-control"
            name="email"
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            onChange={handleChangePassword}
            type="password"
            className="form-control"
            name="password"
          />
        </div>
        <br />
        <div className="form-group">
          <button onClick={handleLogin} className="btn btn-primary btn-block">
            <span>Login</span>
          </button>
          <button
            className="btn btn-primary btn-block"
            style={{ marginLeft: "20px" }}
            onClick={() => GoogleLogin()}
          >
            Sign in with Google{" "}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
