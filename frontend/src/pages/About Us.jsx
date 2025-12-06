import React from 'react';
import logo from '../assets/Paws of Hope Logo.png';
import { 
  HeartFill, 
  BandaidFill, 
  HouseHeartFill, 
  MegaphoneFill 
} from 'react-bootstrap-icons';

const AboutUs = () => {
  return (
    <div style={{ backgroundColor: '#f0f8ff', minHeight: '100vh' }} className="font-sans">
      
      {/* --- HERO SECTION --- */}
      <div className="py-5">
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-3 text-dark">
            About <span className="text-primary">Paws of Hope</span>
          </h1>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <p className="lead text-secondary">
                Every animal deserves a second chance. We are more than just a shelter; 
                we are a temporary home filled with love, joy, and hope.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN MISSION SECTION --- */}
      <div className="container py-4">
        <div className="row align-items-center g-5">
          

          <div className="col-md-6 text-center">
            <div className="p-4 bg-white rounded-4 shadow-sm d-inline-block border">
              <img 
                src={logo} 
                alt="Paws of Hope Logo" 
                className="img-fluid" 
                style={{ maxHeight: '300px' }}
              />
            </div>
          </div>


          <div className="col-md-6">
            <h2 className="fw-bold mb-4 text-dark">
              Rescue. Rehabilitate. <span className="text-primary">Rehome.</span>
            </h2>
            <p className="text-muted mb-3">
              <strong>Paws of Hope</strong> is an animal shelter dedicated to the rescue, 
              rehabilitation, and rehoming of abandoned, stray, and neglected animals.
            </p>
            <p className="text-muted mb-4">
              We provide a safe environment where animals receive nutritious food, 
              essential medical attention, and a warm shelter while waiting for responsible 
              adoption. We also actively promote community awareness and advocate for animal welfare.
            </p>
          </div>
        </div>
      </div>

      {/* --- PILLARS OF CARE (Grid) --- */}
      <div className="py-5 mb-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold text-dark">Our Pillars of Care</h2>
            <p className="text-muted">How we make a difference every day</p>
          </div>

          <div className="row g-4">
            {/* Card 1 */}
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm rounded-4 text-center p-4 bg-white">
                <div className="mb-3 text-primary">
                  <HeartFill size={40} />
                </div>
                <h5 className="card-title fw-bold">Safe Shelter</h5>
                <p className="card-text text-muted small">
                  Providing a secure sanctuary for strays to sleep without fear.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm rounded-4 text-center p-4 bg-white">
                <div className="mb-3 text-primary">
                  <BandaidFill size={40} />
                </div>
                <h5 className="card-title fw-bold">Medical Care</h5>
                <p className="card-text text-muted small">
                  Vaccinations, treatments, and rehabilitation for every rescue.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm rounded-4 text-center p-4 bg-white">
                <div className="mb-3 text-primary">
                  <HouseHeartFill size={40} />
                </div>
                <h5 className="card-title fw-bold">Rehoming</h5>
                <p className="card-text text-muted small">
                  Connecting loving families with pets in need of a forever home.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm rounded-4 text-center p-4 bg-white">
                <div className="mb-3 text-primary">
                  <MegaphoneFill size={40} />
                </div>
                <h5 className="card-title fw-bold">Advocacy</h5>
                <p className="card-text text-muted small">
                  Educating the community on responsible pet ownership.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AboutUs;