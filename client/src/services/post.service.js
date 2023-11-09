import axios from "axios";
const API_URL = "http://localhost:8080/api/post";

class PostService {
  posting(title, content) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.post(
      API_URL,
      {
        title: title,
        content: content,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  getMyPosts(userID) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.get(API_URL + "/myPosts/" + userID, {
      headers: { Authorization: token },
    });
  }

  getFriendPosts(friendID) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.get(API_URL + "/friendsPosts/" + friendID, {
      headers: { Authorization: token },
    });
  }

  deleteMyPost(postID) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.delete(API_URL + "/myPosts/delete/" + postID, {
      headers: { Authorization: token },
    });
  }

  getPostByPostID(postID) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.get(API_URL + "/" + postID, {
      headers: { Authorization: token },
    });
  }

  editMyPost(postID, title, content) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.put(
      API_URL + "/myPosts/edit/" + postID,
      { title, content },
      {
        headers: { Authorization: token },
      }
    );
  }
  getAllFriendsPosts() {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.get(API_URL + "/friendsPosts", {
      headers: { Authorization: token },
    });
  }

  likeAPost(postID) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.post(
      API_URL + "/likePost/" + postID,
      {},
      {
        headers: { Authorization: token },
      }
    );
  }

  commentAPost(postID, content) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.post(
      API_URL + "/commentPost/" + postID,
      { content },
      {
        headers: { Authorization: token },
      }
    );
  }

  getLikeList(postID) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.get(API_URL + "/like/" + postID, {
      headers: { Authorization: token },
    });
  }
  getCommentList(postID) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.get(API_URL + "/comment/" + postID, {
      headers: { Authorization: token },
    });
  }
}

export default new PostService();
