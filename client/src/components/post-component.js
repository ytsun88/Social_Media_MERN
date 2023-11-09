import React, { useState } from "react";
import PostService from "../services/post.service";
import { useNavigate } from "react-router-dom";

const PostComponent = (props) => {
  const navigate = useNavigate();
  let { currentUser, setCurrentUser } = props;
  let [message, setMessage] = useState("");
  let [title, setTitle] = useState("");
  let [content, setContent] = useState("");
  const handleChangeTitle = (e) => {
    setTitle(e.target.value);
  };
  const handleChangeContent = (e) => {
    setContent(e.target.value);
  };
  const handlePost = () => {
    PostService.posting(title, content)
      .then(() => {
        window.alert("Posting Succeeds.");
        navigate("/cover");
      })
      .catch((err) => {
        setMessage(err.response.data);
        console.log(err);
      });
  };
  const handleBack = () => {
    navigate("/login");
  };
  const handleCancel = () => {
    navigate(-1);
  };
  return (
    <div style={{ padding: "3rem" }} className="col-md-12">
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
        <div>
          {message && (
            <div className="alert alert-danger" role="alert">
              {message}
            </div>
          )}
          <div>
            <label htmlFor="title">Title</label>
            <input
              onChange={handleChangeTitle}
              type="text"
              className="form-control"
              name="title"
            />
          </div>
          <br />
          <label htmlFor="content">What's on your mind?</label>
          <textarea
            className="form-control"
            id="content"
            aria-describedby="emailHelp"
            name="content"
            onChange={handleChangeContent}
          />
          <br />
          <button
            onClick={handlePost}
            className="btn btn-primary"
            style={{ margin: "0.5rem" }}
          >
            <span>Post</span>
          </button>
          <button
            onClick={handleCancel}
            className="btn btn-primary"
            style={{ margin: "0.5rem" }}
          >
            <span>Cancel</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default PostComponent;
