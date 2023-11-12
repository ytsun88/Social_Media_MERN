import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PostService from "../services/post.service";

const CoverPageComponent = (props) => {
  let { currentUser, setCurrentUser } = props;
  let [allPosts, setAllPosts] = useState(null);
  let [likeList, setLikeList] = useState(null);
  let [commentList, setCommentList] = useState(null);
  let [selectedPostID, setSelectedPostID] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (currentUser) {
      PostService.getAllFriendsPosts()
        .then((response) => {
          setAllPosts(
            response.data.sort(function (a, b) {
              return new Date(b.date) - new Date(a.date);
            })
          );
        })
        .catch((err) => {
          console.log(err.response.data);
          navigate("/");
        });
    }
  }, []);
  const handleLike = (e) => {
    let currentLike = Number(
      e.target.parentElement.parentElement.querySelector(
        ".card-text .likeCount"
      ).innerText
    );
    let newLike;

    if (e.target.classList.contains("btn-outline-primary")) {
      newLike = currentLike + 1;
      e.target.parentElement.parentElement.querySelector(
        ".card-text .likeCount"
      ).innerText = newLike;
    } else if (e.target.classList.contains("btn-primary")) {
      newLike = currentLike - 1;
      e.target.parentElement.parentElement.querySelector(
        ".card-text .likeCount"
      ).innerText = newLike;
    }
    e.target.classList.toggle("btn-outline-primary");
    e.target.classList.toggle("btn-primary");
    PostService.likeAPost(e.target.id)
      .then(() => {})
      .catch((err) => {
        console.log(err);
        window.alert("Error!");
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
  const handleWhoLike = (e) => {
    setSelectedPostID(e.target.id);
    PostService.getLikeList(e.target.id)
      .then((response) => {
        setLikeList(response.data);
      })
      .catch((err) => {
        console.log(err);
        window.alert(err.response.data);
      });
  };
  const handleWhoComment = (e) => {
    setSelectedPostID(e.target.id);
    PostService.getCommentList(e.target.id)
      .then((response) => {
        setCommentList(response.data);
      })
      .catch((err) => {
        console.log(err);
        window.alert(err.response.data);
      });
  };
  const handletoPost = () => {
    navigate("/post");
  };
  const handleComment = (e) => {
    let input = e.target.parentElement.querySelector("input").value;
    if (input.length != 0) {
      PostService.commentAPost(e.target.id, input)
        .then(() => {
          navigate(0);
        })
        .catch((err) => {
          console.log(err);
          window.alert("Error!");
        });
    }
  };
  return (
    <div style={{ padding: "3rem" }}>
      {currentUser && allPosts && allPosts.length == 0 && (
        <div>
          <h2>No post is found</h2>
          <button onClick={handletoPost} className="btn btn-primary btn-block">
            Post something...
          </button>
        </div>
      )}
      {currentUser && allPosts && allPosts.length != 0 && (
        <div>
          <h2>News Feed</h2>
          <br />
          {allPosts.map((post) => (
            <div key={post._id} className="card" style={{ margin: "1rem" }}>
              <div className="card-header">
                <button
                  className="border-0 "
                  id={post.poster._id}
                  onClick={handleToFriendPage}
                  style={{ fontSize: "1.3rem", fontWeight: "bolder" }}
                >
                  {post.poster.username}
                </button>{" "}
                <div className="vr"></div>{" "}
                <span className="card-title">
                  {new Date(post.date).toLocaleString()}
                </span>
                <h4 className="card-title" style={{ marginTop: "2rem" }}>
                  {post.title}
                </h4>
              </div>
              <div className="card-body" style={{ padding: "1.5rem" }}>
                <h3 className="card-text">{post.content}</h3>
              </div>
              <div className="card-footer text-body-secondary">
                <ul className="list-group list-group-flush">
                  {post.comment.length <= 2 && (
                    <div>
                      {post.comment.map((comment) => (
                        <li key={comment.commentID} className="list-group-item">
                          <div className="position-absolute top-0 end-0">
                            {new Date(comment.date).toLocaleString()}
                          </div>
                          <p>{comment.commenterName}:</p>
                          <h4>{comment.content}</h4>
                        </li>
                      ))}
                    </div>
                  )}
                  {post.comment.length > 2 && (
                    <div>
                      <li className="list-group-item">
                        <Link
                          className="link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
                          data-bs-toggle="modal"
                          data-bs-target="#commentModal"
                          id={post._id}
                          onClick={handleWhoComment}
                        >
                          Load More...
                        </Link>
                      </li>
                      <li
                        key={post.comment[post.comment.length - 2].commentID}
                        className="list-group-item"
                      >
                        <div className="position-absolute top-0 end-0">
                          {new Date(
                            post.comment[post.comment.length - 2].date
                          ).toLocaleString()}
                        </div>
                        <p>
                          {post.comment[post.comment.length - 2].commenterName}:
                        </p>
                        <h4>{post.comment[post.comment.length - 2].content}</h4>
                      </li>
                      <li
                        key={post.comment[post.comment.length - 1].commentID}
                        className="list-group-item"
                      >
                        <div className="position-absolute top-0 end-0">
                          {new Date(
                            post.comment[post.comment.length - 1].date
                          ).toLocaleString()}
                        </div>
                        <p>
                          {post.comment[post.comment.length - 1].commenterName}:
                        </p>
                        <h4>{post.comment[post.comment.length - 1].content}</h4>
                      </li>
                    </div>
                  )}
                </ul>
                <div className="search input-group mb-3">
                  <input type="text" className="form-control" />
                  <button
                    id={post._id}
                    onClick={handleComment}
                    className="btn btn-primary"
                  >
                    Comment
                  </button>
                </div>
                <div className="card-text" style={{ fontSize: "1.25rem" }}>
                  Likes:{" "}
                  <Link
                    className="likeCount link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
                    data-bs-toggle="modal"
                    data-bs-target="#likeModal"
                    id={post._id}
                    onClick={handleWhoLike}
                  >
                    {post.like.length}
                  </Link>{" "}
                  <div className="vr"></div> Comments:{" "}
                  <Link
                    className="commentCount link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
                    data-bs-toggle="modal"
                    data-bs-target="#commentModal"
                    id={post._id}
                    onClick={handleWhoComment}
                  >
                    {post.comment.length}
                  </Link>
                </div>

                <div
                  className="modal fade"
                  id="likeModal"
                  tabIndex="-1"
                  aria-labelledby="likeModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h1 className="modal-title fs-5" id="likeModalLabel">
                          People who like the post:
                        </h1>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      {likeList && likeList.length != 0 && (
                        <div className="modal-body">
                          <div>
                            {likeList.map((liker) => (
                              <div key={liker._id}>{liker.username}</div>
                            ))}
                          </div>
                        </div>
                      )}
                      {likeList && likeList.length == 0 && (
                        <div className="modal-body">
                          No one liked this post yet.
                        </div>
                      )}
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-bs-dismiss="modal"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="modal fade"
                  id="commentModal"
                  tabIndex="-1"
                  aria-labelledby="commetModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h1 className="modal-title fs-5" id="commentModalLabel">
                          Comments:
                        </h1>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      {commentList && commentList.length != 0 && (
                        <div className="modal-body">
                          <div>
                            <ul className="list-group list-group-flush">
                              {commentList.map((comment) => (
                                <li
                                  key={comment.commentID}
                                  className="list-group-item"
                                >
                                  <div className="position-absolute top-0 end-0">
                                    {new Date(comment.date).toLocaleString()}
                                  </div>
                                  <p>{comment.commenterName}:</p>
                                  <h4>{comment.content}</h4>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                      {commentList && commentList.length == 0 && (
                        <div className="modal-body">No comment yet.</div>
                      )}

                      <div className="modal-footer">
                        <div className="search input-group mb-3">
                          <input type="text" className="form-control" />
                          <button
                            onClick={handleComment}
                            className="btn btn-primary"
                            id={selectedPostID}
                          >
                            Comment
                          </button>
                        </div>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-bs-dismiss="modal"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {!post.like.includes(currentUser.user._id) && (
                  <div className="position-absolute top-0 end-0">
                    <button
                      onClick={handleLike}
                      className="btn btn-outline-primary"
                      id={post._id}
                      style={{ margin: "0.5rem" }}
                    >
                      Like
                    </button>
                  </div>
                )}
                {post.like.includes(currentUser.user._id) && (
                  <div className="position-absolute top-0 end-0">
                    <button
                      onClick={handleLike}
                      className="btn btn-primary"
                      id={post._id}
                      style={{ margin: "0.5rem" }}
                    >
                      Like
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoverPageComponent;
