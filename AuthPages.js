import React, { useState } from "react";
import axios from "axios";
import "./AuthPages.css";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/auth";

const AuthPages = () => {
  const navigate = useNavigate(); // ✅ Moved to top
  const [isFlipped, setIsFlipped] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Register state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regType, setRegType] = useState("renter");
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setLoginError("");
    setRegError("");
    setRegSuccess("");
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await axios.post(`${API_URL}/login`, {
        email: loginEmail,
        password: loginPassword,
      });

      localStorage.setItem("token", res.data.token);
      alert(`Welcome back, ${res.data.user.name}!`);
      navigate("/dashboard");
 // ✅ Navigation now works

    } catch (err) {
      setLoginError(err.response?.data?.message || "Login failed");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegError("");
    setRegSuccess("");

    if (regPassword.length < 6) {
      setRegError("Password must be at least 6 characters");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/register`, {
        name: regName,
        email: regEmail,
        password: regPassword,
        type: regType,
      });

      setRegSuccess("Registration successful! You can now log in.");
      setRegName("");
      setRegEmail("");
      setRegPassword("");
      setRegType("renter");

      setTimeout(() => setIsFlipped(false), 1500);
    } catch (err) {
      setRegError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      {/* Left image */}
      <div className="auth-left" />

      {/* Right form */}
      <div className="auth-right">
        <div className={`flip-card ${isFlipped ? "flipped" : ""}`}>
          {/* Login */}
          <div className="flip-card-inner login-box login">
            <h2>
              Welcome to <span className="highlight">RentEasy 🏠</span>
            </h2>
            <form className="login-form" onSubmit={handleLoginSubmit}>
              <input
                type="email"
                placeholder="Enter your email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Enter your password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
              {loginError && <p className="error-msg">{loginError}</p>}
              <button type="submit">Login</button>
              <p className="register-link">
                Don't have an account?{" "}
                <span onClick={handleFlip}>Sign up</span>
              </p>
            </form>
          </div>

          {/* Register */}
          <div className="flip-card-inner login-box register">
            <h2>
              Join <span className="highlight">RentEasy 🏠</span>
            </h2>
            <form className="login-form" onSubmit={handleRegisterSubmit}>
              <input
                type="text"
                placeholder="Enter your name"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Enter your email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Create a password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
              />
              <select
                value={regType}
                onChange={(e) => setRegType(e.target.value)}
                required
              >
                <option value="renter">Renter</option>
                <option value="owner">Owner</option>
              </select>

              {regError && <p className="error-msg">{regError}</p>}
              {regSuccess && <p className="success-msg">{regSuccess}</p>}

              <button type="submit">Register</button>
              <p className="register-link">
                Already have an account?{" "}
                <span onClick={handleFlip}>Login</span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPages;
