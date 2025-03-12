  import React from "react";
  import { BrowserRouter, Routes, Route } from "react-router-dom";
  import Login from "../pages/Login";
  import Signup from "../pages/Singup";

import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import { UserProvider } from "../context/UserContext";

  function App() {
    return (
      <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path = "/dashboard" element = {<Dashboard/>} />
          <Route path = "/profile" element = {<Profile />} />
        </Routes>
      </BrowserRouter>
      </UserProvider>
      //  <Dashboard />
    );
  }

  export default App;
