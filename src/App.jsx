import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/about";
import Contact from "./pages/contact";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Role from "./pages/role";
import Dashboard from "./pages/dashboard";
import Profile from "./pages/Profile";
import React from "react";
import Verify_Email from "./pages/Verify_Email";

function App() {
  return (
    <Router>
      <div className="min-h-screen w-[100%] overflow-hidden flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/role" element={<Role />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/api/auth/verify-email/:token"
            element={<Verify_Email />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
