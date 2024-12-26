import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_url  from "./../../config/constants.js";
import Logo from "../../assests/images/new-logo.png";

function Login() {
  //const BASE_url = "http://localhost:5000";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const navigate = useNavigate();

  const LoginAPI = async (e) => {
    e.preventDefault();

    try {
      const url = `${BASE_url}/api/auth/login`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const requestBody = {
        email: email,
        password: password,
      };

      const response = await axios.post(url, requestBody, { headers });
      console.log("Response of Login", response);

      const { role, token } = response.data;

      sessionStorage.setItem("Token", token);
      sessionStorage.setItem("Role", role);

      navigate("/dashboard");
    } catch (error) {
      console.log("Error in login API ", error);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const url = `${BASE_url}/api/user/registeruser`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const requestBody = {
        username: username,
        email: email,
        password: password,
      };

      const response = await axios.post(url, requestBody, { headers });
      console.log("Response of Register", response);

      if (response.data.data.role === "Independetuser") {
      //  alert("Registration successful! Please login to continue.");
        // Automatically switch to the login form
        setIsLogin(true);
        // Clear the input fields
        setEmail("");
        setPassword("");
        setUsername("");
      }
    } catch (error) {
      console.log("Error in registration API ", error);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);

    // Reset form fields when switching forms
    setEmail("");
    setPassword("");
    setUsername("");
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: "90vh" }}
    >
      <div
        className="w-50 p-4 rounded shadow"
        style={{ backgroundColor: "white", maxWidth: "400px" }}
      >
        <div className="text-center mb-4">
          <div
            style={{ fontSize: "40px", fontWeight: "bold", color: "#6a1b9a" }}
          >
            <img src={Logo} alt="Kavagie-logo" style={{ height: "50px" }} />
          </div>
          <h2>{isLogin ? "Login" : "Register"}</h2>
        </div>

        {/* Buttons to toggle between forms */}
        <div className="d-flex justify-content-between mb-4">
          <Button variant={isLogin ? "primary" : "light"} onClick={toggleForm}>
            Login
          </Button>
          <Button variant={!isLogin ? "primary" : "light"} onClick={toggleForm}>
            Register
          </Button>
        </div>

        <Form onSubmit={isLogin ? LoginAPI : handleRegister}>
          {!isLogin && (
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>
          )}

          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formPassword" className="mt-3">
            <Form.Label>Password</Form.Label>
            <div className="input-group">
              <Form.Control
                type={passwordVisible ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="input-group-append">
                <span
                  className="input-group-text"
                  style={{ cursor: "pointer" }}
                  onClick={togglePasswordVisibility}
                >
                  {passwordVisible ? "👁️" : "👁️‍🗨️"}
                </span>
              </div>
            </div>
          </Form.Group>

          <Button
            variant="primary"
            className="mt-4 w-100"
            type="submit"
            style={{ background: "linear-gradient(135deg, #6a1b9a, #d64dff)" }}
          >
            {isLogin ? "Login" : "Register"}
          </Button>
        </Form>

        <div className="text-center mt-3">
          <a href="#" style={{ color: "#6a1b9a" }} onClick={toggleForm}>
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Login"}
          </a>
        </div>
      </div>
    </Container>
  );
}

export default Login;
