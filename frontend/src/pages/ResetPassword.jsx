import { useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { useParams, useNavigate } from "react-router-dom";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");

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
    <div>
      <h2>Reset Password</h2>

      <form onSubmit={submit}>
        <input
          type="password"
          placeholder="New Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Reset</button>
      </form>
    </div>
  );
}

export default ResetPassword;