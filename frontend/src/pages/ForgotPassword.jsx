import { useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

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
    <div>
      <h2>Forgot Password</h2>
      <form onSubmit={submit}>
        <input
          type="email"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send reset link</button>
      </form>
    </div>
  );
}

export default ForgotPassword;