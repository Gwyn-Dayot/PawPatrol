import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom"; 
import React from 'react';
import heroImage from '../assets/hero-pets.png';

const MOCK_PETS = [
  { id: 1, name: "Buddy", species: "dog", breed: "Golden Retriever", isUrgent: false },
  { id: 2, name: "Whiskers", species: "cat", breed: "Siamese", isUrgent: true },
  { id: 3, name: "Max", species: "dog", breed: "German Shepherd", isUrgent: true },
  { id: 4, name: "Luna", species: "cat", breed: "Persian", isUrgent: false },
  { id: 5, name: "Rocky", species: "dog", breed: "Bulldog", isUrgent: false },
  { id: 6, name: "Daisy", species: "dog", breed: "Beagle", isUrgent: false },
  { id: 7, name: "Simba", species: "cat", breed: "Maine Coon", isUrgent: true },
  { id: 8, name: "Bella", species: "dog", breed: "Poodle", isUrgent: false },
];

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // State for Filters
  const [activeTab, setActiveTab] = useState("All");
  const [searchSpecies, setSearchSpecies] = useState("");
  const [searchBreed, setSearchBreed] = useState("");
  const [filteredPets, setFilteredPets] = useState(MOCK_PETS);
  
  // State for Favorites
  const [favorites, setFavorites] = useState([]);

  // NEW: State for the Login Modal
  const [showModal, setShowModal] = useState(false);

  // ---------------------------------------------------------
  // 1. FILTERING LOGIC (useEffect)
  // ---------------------------------------------------------
  useEffect(() => {
    let result = MOCK_PETS;

    if (activeTab === "Dogs") result = result.filter(pet => pet.species === "dog");
    else if (activeTab === "Cats") result = result.filter(pet => pet.species === "cat");
    else if (activeTab === "Urgent") result = result.filter(pet => pet.isUrgent === true);

    if (searchSpecies) result = result.filter(pet => pet.species === searchSpecies);

    if (searchBreed) {
      result = result.filter(pet => 
        pet.breed.toLowerCase().includes(searchBreed.toLowerCase())
      );
    }

    setFilteredPets(result);
  }, [activeTab, searchSpecies, searchBreed]);

  // ---------------------------------------------------------
  // 2. HANDLERS
  // ---------------------------------------------------------

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    if(tabName === "Dogs") setSearchSpecies("dog");
    if(tabName === "Cats") setSearchSpecies("cat");
    if(tabName === "All") setSearchSpecies("");
  };

  const handleAdoptClick = () => {
    if (!user) {
      // Instead of alert, we show the modal
      setShowModal(true);
      return;
    }
    navigate("/apply");
  };

  const handleFavoriteClick = (id) => {
    if (!user) {
      // Instead of alert, we show the modal
      setShowModal(true);
      return;
    }
    
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  // Helper to close modal and go to login
  const handleLoginRedirect = () => {
    setShowModal(false);
    navigate("/login");
  };

  // ---------------------------------------------------------

  return (
    <div style={{ backgroundColor: "#EFF6FF", minHeight: "100vh", position: "relative" }}>
      
      {/* HERO SECTION */}
      <div className="container py-5">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h1 className="display-4 fw-bold text-dark mb-3">PAWDOPTION</h1> 
            <p className="lead text-muted mb-4">
              Find your new best friend today. We connect loving families with pets in need.
            </p>
            <button 
                onClick={handleAdoptClick} 
                className="btn btn-primary btn-lg px-5 rounded-pill shadow-sm"
            >
              Adopt Now
            </button>
          </div>
          <div className="col-md-6 text-center mb-4 mb-md-0">
             <img src={heroImage} alt="Happy pet ready for adoption" className="rounded-4 img-fluid" />
          </div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="container mb-5">
        <div className="bg-white rounded-pill shadow-lg d-flex flex-column flex-md-row align-items-center p-2 mx-auto" style={{ maxWidth: "850px" }}>
            <div className="d-flex align-items-center px-4 py-2 border-end border-light-subtle flex-shrink-0">
                <i className="bi bi-funnel-fill text-primary me-2 fs-5"></i>
                <select 
                    className="form-select border-0 shadow-none fw-semibold text-dark p-0" 
                    style={{ width: "auto", cursor: "pointer", outline: "none" }} 
                    value={searchSpecies}
                    onChange={(e) => setSearchSpecies(e.target.value)}
                >
                    <option value="">Species</option>
                    <option value="dog">Dog</option>
                    <option value="cat">Cat</option>
                </select>
            </div>
            <div className="flex-grow-1 w-100 px-4 py-2">
                 <div className="d-flex align-items-center w-100">
                    <i className="bi bi-search text-muted me-3 fs-5"></i>
                    <input 
                        type="text" 
                        className="border-0 shadow-none p-0 fs-6" 
                        placeholder="Search by breed (e.g. Golden Retriever)" 
                        value={searchBreed}
                        onChange={(e) => setSearchBreed(e.target.value)}
                        style={{ height: "100%", outline: "none" }}
                    />
                </div>
            </div>
            <div className="p-1 w-100 w-md-auto">
                <button className="btn btn-primary rounded-pill px-5 py-2 fw-bold w-100 shadow-sm">Search</button>
            </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="container text-center mb-5">
        <h2 className="text-primary mb-2">Our Pets</h2>
        <p className="text-muted mb-5">Browse our furry friends waiting for a home.</p>

        <div className="d-flex justify-content-center gap-4 gap-md-5 border-bottom mb-5 overflow-auto">
            {["All", "Dogs", "Cats", "Urgent"].map((tab) => (
                <div 
                    key={tab} 
                    onClick={() => handleTabClick(tab)}
                    className={`pb-3 px-3 fw-bold text-nowrap ${
                        activeTab === tab 
                        ? "border-bottom border-primary border-3 text-primary" 
                        : "text-muted border-bottom border-transparent"
                    }`}
                    style={{ cursor: "pointer", transition: "all 0.2s" }}
                >
                    {tab}
                </div>
            ))}
        </div>

        {/* PET GRID */}
        {filteredPets.length > 0 ? (
            <div className="row g-4">
                {filteredPets.map((pet) => (
                    <div key={pet.id} className="col-12 col-sm-6 col-lg-3">
                        <div className="card border-0 shadow-sm h-100 p-3 hover-scale" style={{ backgroundColor: "#F8FAFC", transition: "transform 0.2s" }}>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="d-flex align-items-center gap-2">
                                    <span className="fw-bold text-dark">{pet.name}</span>
                                    {pet.isUrgent && <span className="badge bg-danger">Urgent</span>}
                                </div>
                                <button 
                                    onClick={() => handleFavoriteClick(pet.id)}
                                    className="btn btn-link p-0 border-0 text-decoration-none"
                                >
                                    <i className={`bi fs-5 ${favorites.includes(pet.id) ? "bi-heart-fill text-danger" : "bi-heart text-muted"}`}></i>
                                </button>
                            </div>
                            <div className="bg-white rounded-3 mb-3 d-flex align-items-center justify-content-center position-relative" style={{ height: "180px", overflow: "hidden" }}>
                                <i className="bi bi-image text-secondary fs-1"></i>
                                <span className="position-absolute bottom-0 start-0 w-100 bg-dark bg-opacity-50 text-white py-1 small">{pet.breed}</span>
                            </div>
                            <div className="d-flex justify-content-end mt-auto">
                                <button onClick={handleAdoptClick} className="btn btn-white border shadow-sm btn-sm px-4 fw-bold text-primary">
                                    Adopt
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="py-5">
                <i className="bi bi-emoji-frown display-1 text-muted"></i>
                <h3 className="mt-3 text-muted">No pets found</h3>
                <button onClick={() => { setActiveTab("All"); setSearchSpecies(""); setSearchBreed(""); }} className="btn btn-outline-primary">
                    Clear Filters
                </button>
            </div>
        )}

      </div>

      {/* ========================================================= */}
      {/* LOGIN REQUIRED MODAL                                      */}
      {/* ========================================================= */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content rounded-4 border-0 shadow">
                    
                    <div className="modal-header border-0 pb-0">
                        <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                    </div>

                    <div className="modal-body text-center py-4">
                        <div className="mb-3">
                             <i className="bi bi-shield-lock text-primary" style={{ fontSize: "3rem" }}></i>
                        </div>
                        <h4 className="fw-bold mb-3">Login Required</h4>
                        <p className="text-muted mb-0">
                            Please log in or create an account to adopt pets and save your favorites.
                        </p>
                    </div>

                    <div className="modal-footer border-0 justify-content-center pb-4">
                        <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowModal(false)}>
                            Cancel
                        </button>
                        <button type="button" className="btn btn-primary rounded-pill px-5 fw-bold" onClick={handleLoginRedirect}>
                            Go to Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default Home;