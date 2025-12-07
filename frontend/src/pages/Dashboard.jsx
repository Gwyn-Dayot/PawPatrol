import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { API_URL } from "../config";

function UserDashboard() {
  const { user } = useContext(AuthContext);
  
  const [activeTab, setActiveTab] = useState("applications"); 
  const [appointments, setAppointments] = useState([]);

  const [stats, setStats] = useState({
    applications: 0,
    approved: 0,
    likedPets: 0,
    adopted: 0
  });

  const [applications, setApplications] = useState([]);

  useEffect(() => {
    if (!user?._id) return;

    const fetchDashboard = async () => {
      try {
        const resApps = await axios.get(`${API_URL}/applications/user/${user._id}`);
        const apps = resApps.data;
        setApplications(apps);
        try {
            const resAppts = await axios.get(`${API_URL}/appointments/user/${user._id}`);
            setAppointments(resAppts.data);
        } catch (apptErr) {
            console.warn("Could not fetch appointments", apptErr);
        }

        setStats({
          applications: apps.length,
          approved: apps.filter(a => a.status === "approved").length,
          likedPets: user?.likedPets?.length || 0,
          adopted: apps.filter(a => a.status === "adopted").length,
        });

      } catch (err) {
        console.error(err);
      }
    };

    fetchDashboard();
  }, [user]);

  return (
    <div className="container mt-5">

      <div className="bg-white shadow-sm p-4 rounded-4 mb-4">
        <h3>Welcome back, {user?.fullname}!</h3>
      </div>

      <div className="row text-center mb-5">
        <div className="col-md-3 mb-3">
          <div className="bg-white p-4 rounded-4 shadow-sm">
            <p className="text-muted">Applications</p>
            <h3>{stats.applications}</h3>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="bg-white p-4 rounded-4 shadow-sm">
            <p className="text-muted">Approved</p>
            <h3>{stats.approved}</h3>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="bg-white p-4 rounded-4 shadow-sm">
            <p className="text-muted">Liked Pets</p>
            <h3>{stats.likedPets}</h3>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="bg-white p-4 rounded-4 shadow-sm">
            <p className="text-muted">Adopted</p>
            <h3>{stats.adopted}</h3>
          </div>
        </div>
      </div>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === "applications" ? "active" : ""}`}
            onClick={() => setActiveTab("applications")}
          >
            My Applications
          </button>
        </li>

        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === "appointments" ? "active" : ""}`}
            onClick={() => setActiveTab("appointments")}
          >
            My Appointments
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === "liked" ? "active" : ""}`}
            onClick={() => setActiveTab("liked")}
          >
            Liked Pets
          </button>
        </li>
      </ul>

      <div className="mt-3">
        
        {activeTab === "applications" && (
            <>
                {applications.length === 0 ? (
                <p className="text-muted text-center">No applications found.</p>
                ) : (
                applications.map((app) => (
                    <div key={app._id} className="bg-white p-4 shadow-sm rounded-4 mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                        <h4>{app.pet?.name || "Unknown Pet"}</h4>
                        <p className="text-muted">{app.pet?.breed || "Unknown Breed"}</p>

                        <span
                            className={`badge px-3 py-2 ${
                            app.status === "pending"
                                ? "bg-warning"
                                : app.status === "approved"
                                ? "bg-success"
                                : "bg-secondary"
                            }`}
                        >
                            {app.status}
                        </span>
                        <span className="ms-2 text-muted">
                            Applied: {new Date(app.createdAt).toLocaleDateString()}
                        </span>
                        </div>
                        <button className="btn btn-danger px-4 py-2">Delete</button>
                    </div>
                    </div>
                ))
                )}
            </>
        )}

        {activeTab === "appointments" && (
            <>
                {appointments.length === 0 ? (
                    <div className="text-center py-4 text-muted">
                        <p>No appointments scheduled yet.</p>
                    </div>
                ) : (
                    appointments.map((appt) => (
                        <div key={appt._id} className="bg-white p-4 shadow-sm rounded-4 mb-3 border-start border-4 border-info">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h5>📅 Appointment Details</h5>
                                    <p className="mb-1"><strong>Date:</strong> {new Date(appt.date).toLocaleDateString()}</p>
                                    <p className="mb-1"><strong>Time:</strong> {appt.time}</p>
                                    <p className="text-muted small">Reason: {appt.reason || "General Visit"}</p>
                                    
                                    <span className={`badge mt-2 ${
                                        appt.status === "confirmed" ? "bg-success" : "bg-warning text-dark"
                                    }`}>
                                        {appt.status || "Pending"}
                                    </span>
                                </div>
                                <button className="btn btn-outline-danger">Cancel</button>
                            </div>
                        </div>
                    ))
                )}
            </>
        )}

        {activeTab === "liked" && (
            <div className="text-center py-5 text-muted">
                <p>Liked pets list will go here.</p>
            </div>
        )}

      </div>

    </div>
  );
}

export default UserDashboard;