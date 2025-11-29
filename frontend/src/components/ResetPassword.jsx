import { useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { useParams, useNavigate } from "react-router-dom";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/auth/reset-password/${token}`, { password });
      alert("Password updated!");
      navigate("/login");
    } catch (err) {
      alert("Failed to update password.");
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card auth-card p-5 shadow-lg" style={{ maxWidth: "500px", width: "100%" }}>
        <h2 className="form-title">Reset Password</h2>
        
        <form onSubmit={submit}>
            <div className="password-wrapper mb-3">
                <input
                    type={showPassword ? "text" : "password"}
                    className="form-control mb-0"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    <i className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"}`}></i>
                </button>
            </div>

          <button type="submit" className="btn btn-custom w-100 mt-2">Reset</button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;