import React, { useState, useContext, memo } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const InputField = ({ label, type = "text", name, value, onChange, placeholder, required = false }) => (
  <div className="mb-3">
    <label className="form-label fw-medium">{label} {required && <span className="text-danger">*</span>}</label>
    <input type={type} name={name} value={value ?? ''} onChange={onChange} placeholder={placeholder} className="form-control" />
  </div>
);

const SelectField = ({ label, name, value, onChange, options, required = false }) => (
  <div className="mb-3">
    <label className="form-label fw-medium">{label} {required && <span className="text-danger">*</span>}</label>
    <select name={name} value={value || ''} onChange={onChange} className="form-select bg-white">
      <option value="">Please Select</option>
      {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

const RadioGroup = ({ label, name, value, onChange, options }) => (
  <div className="mb-3">
    <label className="form-label fw-medium d-block mb-2">{label}</label>
    <div>
      {options.map(opt => (
        <div key={opt.value} className="form-check form-check-inline">
          <input className="form-check-input" type="radio" name={name} id={`${name}-${opt.value}`} value={opt.value} checked={value === opt.value} onChange={onChange} />
          <label className="form-check-label" htmlFor={`${name}-${opt.value}`}>{opt.label}</label>
        </div>
      ))}
    </div>
  </div>
);

const SectionTitle = ({ children }) => <h2 className="h3 mb-4 text-dark fw-bold">{children}</h2>;

const Step1Start = memo(({ user, agreedToTerms, onChange, onNext }) => (
  <div className="text-center mx-auto" style={{ maxWidth: '600px' }}>
    <h2 className="mb-4">Welcome, {user?.fullname || 'Guest'}!</h2>
    <div className="card border-primary-subtle bg-primary-subtle mb-4 text-start">
      <div className="card-body d-flex align-items-center gap-4">
        <div className="bg-primary bg-opacity-25 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold fs-3 flex-shrink-0" style={{ width: '70px', height: '70px' }}>
          {user?.firstName?.[0] || 'U'}{user?.lastName?.[0] || ''}
        </div>
        <div>
            <div className="fw-semibold">Email: <span className="fw-normal">{user?.email || 'N/A'}</span></div>
            <div className="fw-semibold">Name: <span className="fw-normal">{user?.fullname || 'N/A'}</span></div>
        </div>
      </div>
    </div>
    <div className="form-check text-start mb-4">
      <input className="form-check-input" type="checkbox" name="agreedToTerms" id="termsCheck" checked={agreedToTerms} onChange={onChange} style={{ transform: 'scale(1.2)', marginRight: '10px' }} />
      <label className="form-check-label text-muted" htmlFor="termsCheck">
        I have read and agree to the <a href="#" className="text-decoration-underline">Terms</a> and <a href="#" className="text-decoration-underline">Privacy Policy</a>.
      </label>
    </div>
    <button onClick={onNext} disabled={!agreedToTerms} className="btn btn-primary btn-lg rounded-pill px-5 shadow-sm">Start Application</button>
  </div>
));

const Step2Address = memo(({ formData, handleChange }) => (
  <div className="container p-0" style={{maxWidth:'700px'}}>
    <SectionTitle>Address & Contact</SectionTitle>
    <InputField label="Address Line 1" name="addressLine1" value={formData.addressLine1} onChange={handleChange} placeholder="Street address" required />
    <InputField label="Address Line 2" name="addressLine2" value={formData.addressLine2} onChange={handleChange} placeholder="Apartment (optional)" />
    <InputField label="Town/City" name="town" value={formData.town} onChange={handleChange} required />
    <InputField label="Postcode" name="postcode" value={formData.postcode} onChange={handleChange} required />
    <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required />
  </div>
));

const Step3Home = memo(({ formData, handleChange }) => (
  <div className="container p-0" style={{maxWidth:'700px'}}>
    <SectionTitle>About Your Home</SectionTitle>
    <RadioGroup label="Garden/Outside space?" name="hasGarden" value={formData.hasGarden} onChange={handleChange} options={[{ label: "Yes", value: "yes" }, { label: "No", value: "no" }]} />
    <SelectField label="Living Situation" name="livingSituation" value={formData.livingSituation} onChange={handleChange} options={["Homeowner", "Renting (Landlord allows)", "Renting (Need permission)", "Living with parents"]} />
    <SelectField label="Household Setting" name="householdSetting" value={formData.householdSetting} onChange={handleChange} options={["Quiet", "Moderate", "Busy", "Noisy"]} />
    <SelectField label="Activity Level" name="activityLevel" value={formData.activityLevel} onChange={handleChange} options={["Sedentary", "Moderately Active", "Very Active", "Athletic"]} />
  </div>
));

const Step4Images = memo(({ formData, handleFileChange, triggerFileInput }) => (
  <div className="container p-0" style={{maxWidth:'700px'}}>
    <SectionTitle>Upload Images of Home</SectionTitle>
    <div className="row g-4">
      {['main','img2','img3','img4'].map((key,i)=>(
        <div className="col-md-6" key={key}>
          <div onClick={()=>triggerFileInput(key)} className="ratio ratio-16x9 rounded border-2 d-flex align-items-center justify-content-center cursor-pointer overflow-hidden bg-light">
            {formData.images[key]?.preview ? (
              <img src={formData.images[key].preview} alt={`Upload ${i+1}`} className="w-100 h-100 object-fit-cover"/>
            ) : <span className="text-muted">Click to upload</span>}
          </div>
          <input type="file" accept="image/*" id={`fileInput-${key}`} style={{display:'none'}} onChange={(e)=>handleFileChange(e,key)} />
        </div>
      ))}
    </div>
  </div>
));

const Step5Success = memo(() => (
  <div className="text-center mx-auto py-5" style={{maxWidth:'500px'}}>
    <div className="rounded-circle bg-success bg-opacity-25 d-flex align-items-center justify-content-center mx-auto mb-4 text-success" style={{width:'100px',height:'100px'}}>
      <CheckCircle size={48}/>
    </div>
    <h2 className="display-6 fw-bold mb-3">Submission Successful!</h2>
    <p className="lead text-muted mb-5">Paws of Hope will review your application soon.</p>
  </div>
));


export default function AdoptionApplication() {
  const { user } = useContext(AuthContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState('');
  
  // Removed Household and Animal fields from state
  const [formData, setFormData] = useState({
    agreedToTerms: false,
    addressLine1:'', addressLine2:'', town:'', postcode:'', phone:'',
    hasGarden:'', livingSituation:'', householdSetting:'', activityLevel:'',
    images:{ main:null, img2:null, img3:null, img4:null }
  });

  const handleNext = () => { setError(''); if(currentStep < 5) setCurrentStep(prev => prev+1); window.scrollTo({top:0,behavior:'smooth'}); };
  const handleBack = () => { setError(''); if(currentStep > 1) setCurrentStep(prev => prev-1); window.scrollTo({top:0,behavior:'smooth'}); };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type==='checkbox' ? checked : value }));
  };

  const handleFileChange = (e,key) => {
    const file = e.target.files[0];
    if(file) setFormData(prev => ({ ...prev, images: { ...prev.images, [key]: { file, preview: URL.createObjectURL(file) } } }));
  };
  const triggerFileInput = key => document.getElementById(`fileInput-${key}`).click();

  const submitApplication = async () => {
    setError('');
    const userId = user?._id || user?.id;
    const token = user?.token || localStorage.getItem('token');

    if (!user || !userId) return setError(`User ID missing.`);
    if (!token) return setError('Please log in again.');

    try{
      const data = new FormData();
      data.append('userId', userId);
      
      Object.keys(formData.images).forEach(key => {
        if(formData.images[key]?.file) data.append(key, formData.images[key].file);
      });
      
      Object.keys(formData).forEach(key => {
        if(key !== 'images') data.append(key, formData[key]);
      });
      
      await axios.post(`${API_BASE_URL}/api/applications`, data, { 
        headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` } 
      });
      
      setCurrentStep(5); // Move to Success Step (now Step 5)
    } catch(err){
      setError(`Failed to submit: ${err.response?.data?.message || err.message}`);
    }
  };

  const renderStep = () => {
    switch(currentStep){
      case 1: return <Step1Start user={user} agreedToTerms={formData.agreedToTerms} onChange={handleChange} onNext={handleNext}/>;
      case 2: return <Step2Address formData={formData} handleChange={handleChange}/>;
      case 3: return <Step3Home formData={formData} handleChange={handleChange}/>;
      case 4: return <Step4Images formData={formData} handleFileChange={handleFileChange} triggerFileInput={triggerFileInput}/>;
      case 5: return <Step5Success/>;
      default: return null;
    }
  };

  return (
    <div className="d-flex flex-column align-items-center min-vh-100 bg-light py-5 px-3 font-sans">
      <div className="container bg-white p-4 p-md-5 rounded shadow-sm border" style={{maxWidth:'900px'}}>
        {renderStep()}
      </div>

      {currentStep > 1 && currentStep < 5 && (
        <div className="container mt-4" style={{maxWidth:'900px'}}>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="d-flex justify-content-between">
            <button onClick={handleBack} className="btn btn-outline-secondary d-flex align-items-center gap-2">
              <ChevronLeft size={20}/> Back
            </button>
            <button onClick={currentStep === 4 ? submitApplication : handleNext} className="btn btn-primary d-flex align-items-center gap-2 px-4">
              {currentStep === 4 ? "Submit" : "Continue"} <ChevronRight size={20}/>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}