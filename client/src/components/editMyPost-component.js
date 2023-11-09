import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PostService from "../services/post.service";

const EditMyPostComponent = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  let postID = "";
  let orignalTitle = "";
  let originalContent = "";
  if (location.state) {
    postID = location.state.postID;
    orignalTitle = location.state.title;
    originalContent = location.state.content;
  }
  let { currentUser, setCurrentUser } = props;
  let [message, setMessage] = useState("");
  let [title, setTitle] = useState(orignalTitle);
  let [content, setContent] = useState(originalContent);
  useEffect(() => {
    if (!postID) {
      navigate("/");
    }
  }, []);
  const handleChangeTitle = (e) => {
    setTitle(e.target.value);
  };
  const handleChangeContent = (e) => {
    setContent(e.target.value);
  };
  const handleEdit = () => {
    PostService.editMyPost(postID, title, content)
      .then(() => {
        window.alert("Editing Succeeds.");
        navigate("/myPosts");
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
            You must login first before editing your post.
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
              defaultValue={orignalTitle}
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
            defaultValue={originalContent}
          />
          <br />
          <button
            onClick={handleEdit}
            className="btn btn-primary"
            style={{ margin: "0.5rem" }}
          >
            <span>Edit</span>
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

export default EditMyPostComponent;
