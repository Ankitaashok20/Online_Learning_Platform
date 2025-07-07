import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "./UserContext";
import Navbar from "./Navbar";

const ADMIN_CREDENTIALS = [
  { email: "admin1@gmail.com", password: "admin123" },
  { email: "admin2@example.com", password: "admin456" }, // Add more as needed
];

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loginType, setLoginType] = useState("student"); // 'student' or 'admin'

  const navigate = useNavigate();
  const { setUser } = useUserContext();

  const handleLoginTypeChange = (type) => {
    setLoginType(type);
    setError("");
    setEmail("");
    setPassword("");
  };

  const login = async (e) => {
    e.preventDefault();
    if (loginType === "admin") {
      // Check against hardcoded admin credentials
      const found = ADMIN_CREDENTIALS.find(
        (admin) => admin.email === email && admin.password === password
      );
      if (found) {
        localStorage.setItem("token", "admin-token");
        localStorage.setItem("email", email);
        localStorage.setItem("name", "Admin");
        localStorage.setItem("id", "admin");
        setUser({ name: "Admin", email, id: "admin" });
        navigate("/dashboard");
      } else {
        setError("Invalid admin email or password.");
      }
      return;
    }
    // Student login (original logic)
    try {
      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", email);
        const userDetailsResponse = await fetch(
          `http://localhost:8080/api/users/details?email=${email}`
        );
        if (userDetailsResponse.ok) {
          const ud = await userDetailsResponse.json();
          localStorage.setItem("name", ud["username"]);
          localStorage.setItem("id", ud["id"]);
          setUser({ name: ud["name"], email: email, id: ud["id"] });
          navigate("/courses");
        } else {
          setError("An error occurred while fetching user details.");
        }
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="auth">
        <div className="container">
          <h3>Welcome!</h3>
          <br />
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <button
              className={`btn btn-md mybtn ${loginType === "student" ? "btn-primary" : "btn-light"}`}
              onClick={() => handleLoginTypeChange("student")}
              style={{ marginRight: 10 }}
            >
              Student Login
            </button>
            <button
              className={`btn btn-md mybtn ${loginType === "admin" ? "btn-primary" : "btn-light"}`}
              onClick={() => handleLoginTypeChange("admin")}
            >
              Admin Login
            </button>
          </div>
          <h2>{loginType === "admin" ? "Admin Login" : "Student Login"}</h2>
          <br />
          <form autoComplete="off" className="form-group" onSubmit={login}>
            <label htmlFor="email">Email Id :</label>
            <input
              type="email"
              className="form-control"
              style={{ width: "100%", marginRight: "50px" }}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <br />
            <label htmlFor="password">Password : </label>
            <input
              type="password"
              className="form-control"
              style={{ width: "100%" }}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <br />
            <div className="btn1">
              <button type="submit" className="btn btn-success btn-md mybtn">
                LOGIN
              </button>
            </div>
          </form>
          {error && <span className="error-msg">{error}</span>}
          <br />
          {loginType === "student" && (
            <span>
              Don't have an account? Register
              <Link to="/register"> Here</Link>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
export default Login;
