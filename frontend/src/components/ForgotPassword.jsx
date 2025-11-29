import { useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/auth/forgot-password`, { email });
      alert("If the account exists, a reset link was sent!");
    } catch (err) {
      alert("Error sending reset email");
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card auth-card p-5 shadow-lg" style={{ maxWidth: "500px", width: "100%" }}>
        <h2 className="form-title">Forgot Password</h2>
        <p className="text-muted text-center mb-4">Enter your email and we'll send you a link to reset your password.</p>
        
        <form onSubmit={submit}>
          <input
            type="email"
            className="form-control"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-custom w-100 mt-3">Send reset link</button>
        </form>
        <div className="text-center mt-3">
             <Link to="/login" className="auth-link">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;