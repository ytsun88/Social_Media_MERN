import React, { useState, useEffect } from "react";
import NavComponent from "./components/nav-component";
import HomeComponent from "./components/home-component";
import RegisterComponent from "./components/register-component";
import LoginComponent from "./components/login-component";
import CoverPageComponent from "./components/coverPage-component";
import ProfileComponent from "./components/profile-component";
import PostComponent from "./components/post-component";
import MyPostsComponent from "./components/myPosts-component";
import EditMyPostComponent from "./components/editMyPost-component";
import AddFriendComponent from "./components/addFriend-component";
import MyFriendsComponent from "./components/myFriends-component";
import FriendPageComponent from "./components/friendPage-component";
import { Routes, Route } from "react-router-dom";
import AuthService from "./services/auth.service";
import FriendService from "./services/friend.service";

function App() {
  let [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());
  return (
    <div>
      <NavComponent currentUser={currentUser} setCurrentUser={setCurrentUser} />
      <Routes>
        <Route
          element={
            <HomeComponent
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          }
          path="/"
          exact
        />
        <Route element={<RegisterComponent />} path="/register" exact />
        <Route
          element={
            <LoginComponent
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          }
          path="/login"
          exact
        />
        <Route
          element={
            <CoverPageComponent
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          }
          path="/cover"
          exact
        />
        <Route
          element={
            <ProfileComponent
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          }
          path="/profile"
          exact
        />
        <Route
          element={
            <PostComponent
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          }
          path="/post"
          exact
        />
        <Route
          element={
            <MyPostsComponent
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          }
          path="/myPosts"
          exact
        />
        <Route
          element={
            <EditMyPostComponent
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          }
          path="/myPosts/edit"
          exact
        />
        <Route
          element={
            <AddFriendComponent
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          }
          path="/addFriend"
          exact
        />
        <Route
          element={
            <MyFriendsComponent
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          }
          path="/myFriends"
          exact
        />
        <Route
          element={
            <FriendPageComponent
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          }
          path="/friendPage"
          exact
        />
      </Routes>
    </div>
  );
}

export default App;
