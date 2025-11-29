import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

import authImage from "../assets/PAWdoption.png";

function Register() {
  const { registerUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if(!agreeTerms) {
        alert("Please agree to the Terms & Conditions");
        return;
    }

    try {
      await registerUser(fullname, email, password);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card auth-card w-100" style={{ maxWidth: "900px" }}>
        <div className="row g-0">
          
          <div className="col-md-6 illustration-side d-none d-md-flex">
             
             <img 
              src={authImage} 
              alt="Register Illustration" 
              className="illustration-img"
            />
          </div>

          <div className="col-md-6 auth-form-container">
            <h2 className="form-title">Register</h2>

            <form onSubmit={handleRegister}>
              <input
                type="text"
                className="form-control"
                placeholder="Full Name"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                required
              />

              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              
              <div className="password-wrapper mb-3">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control mb-0"
                  placeholder="Password"
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

              <div className="form-check mb-4">
                <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="termsCheck"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                />
                <label className="form-check-label small" htmlFor="termsCheck">
                    I agree to all <a href="#" className="auth-link">Terms & Conditions</a>
                </label>
              </div>

              <button type="submit" className="btn btn-custom w-100 mb-3">
                Create Account
              </button>
            </form>

            <div className="text-center">
              <span className="text-muted small">Already have an account? </span>
              <Link to="/login" className="auth-link">Sign in</Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Register;