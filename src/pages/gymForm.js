import { useState, useEffect } from 'react';
import '../App.css';
import '../Styles/AddGymForm.css';
import { api } from '../utils/api';

const AddMemberToGymForm = ({ gyms, onMemberAdded }) => {
  const [showForm, setShowForm] = useState(false);
  const [memberForm, setMemberForm] = useState({
    name: '',
    email: '',
    phone: '',
    plan: 'Basic',
    gymId: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!memberForm.gymId) {
      alert('Please select a gym');
      return;
    }
    try {
      await api.createMember({
        ...memberForm,
        status: 'Active',
        joinDate: new Date().toISOString().split('T')[0]
      });
      alert('Member added successfully!');
      setMemberForm({ name: '', email: '', phone: '', plan: 'Basic', gymId: '' });
      setShowForm(false);
      onMemberAdded();
    } catch (error) {
      console.error('Error adding member:', error);
      alert('Failed to add member');
    }
  };

  return (
    <div>
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          style={{
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            background: '#4ECDC4',
            color: 'white',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600'
          }}
        >
          + Add Member to Gym
        </button>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Member Name</label>
              <input
                type="text"
                required
                value={memberForm.name}
                onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Contact</label>
              <input
                type="tel"
                required
                value={memberForm.phone}
                onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
              />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Email</label>
            <input
              type="email"
              required
              value={memberForm.email}
              onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Plan</label>
              <select
                value={memberForm.plan}
                onChange={(e) => setMemberForm({ ...memberForm, plan: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
              >
                <option value="Basic">Basic</option>
                <option value="Standard">Standard</option>
                <option value="Premium">Premium</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Gym</label>
              <select
                required
                value={memberForm.gymId}
                onChange={(e) => setMemberForm({ ...memberForm, gymId: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
              >
                <option value="">Select Gym</option>
                {gyms.map(gym => (
                  <option key={gym._id} value={gym._id}>{gym.gymName}</option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setMemberForm({ name: '', email: '', phone: '', plan: 'Basic', gymId: '' });
              }}
              style={{ padding: '10px 20px', border: '1px solid #ddd', borderRadius: '6px', background: 'white', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ padding: '10px 20px', border: 'none', borderRadius: '6px', background: '#4ECDC4', color: 'white', cursor: 'pointer' }}
            >
              Add Member
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

const GymForm = () => {
  const [formData, setFormData] = useState({
    gymName: '',
    phone: '',
    address: '',
    year: '',
    fee: ''
  });
  const [errors, setErrors] = useState({});
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('Admin');

  useEffect(() => {
    loadGyms();
    // Get user name from localStorage
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserName(userData.name || 'Admin');
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  const loadGyms = async () => {
    try {
      const data = await api.getGyms();
      setGyms(data);
    } catch (error) {
      console.error('Error loading gyms:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.gymName || formData.gymName.length < 2) {
      newErrors.gymName = 'Gym name is required (min 2 characters)';
    }
    if (!formData.phone || !/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = 'Enter valid 10-digit phone number';
    }
    if (!formData.address || formData.address.length < 10) {
      newErrors.address = 'Address is required (min 10 characters)';
    }
    if (!formData.year || formData.year < 1900 || formData.year > 2025) {
      newErrors.year = 'Year must be between 1900-2025';
    }
    if (!formData.fee || formData.fee < 500) {
      newErrors.fee = 'Minimum fee should be ₹500';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        await api.createGym({
          ...formData,
          createdBy: userName
        });
        alert('Gym added successfully!');
        setFormData({ gymName: '', phone: '', address: '', year: '', fee: '' });
        loadGyms(); // Reload gyms list
      } catch (error) {
        console.error('Error adding gym:', error);
        alert('Failed to add gym. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  const resetForm = () => {
    setFormData({ gymName: '', phone: '', address: '', year: '', fee: '' });
    setErrors({});
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.6), rgba(102, 187, 106, 0.4)), url("https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80") center/cover fixed'
    }}>
      <div className="dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Gym Management</h1>
          <div className="user-profile">
            <div className="activity-icon">🏢</div>
            <span>Add New Gym</span>
          </div>
        </div>

        <div className="chart-card">
          <h3 className="card-title">Gym Registration Form</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Gym Name</label>
                <input
                  name="gymName"
                  value={formData.gymName}
                  onChange={handleChange}
                  placeholder="Enter gym name"
                  style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' }}
                />
                {errors.gymName && <p style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>{errors.gymName}</p>}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="1234567890"
                  style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' }}
                />
                {errors.phone && <p style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>{errors.phone}</p>}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                placeholder="Enter complete address"
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', resize: 'vertical' }}
              />
              {errors.address && <p style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>{errors.address}</p>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Established Year</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="2020"
                  style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' }}
                />
                {errors.year && <p style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>{errors.year}</p>}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Monthly Fee (₹)</label>
                <input
                  type="number"
                  name="fee"
                  value={formData.fee}
                  onChange={handleChange}
                  placeholder="2500"
                  style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' }}
                />
                {errors.fee && <p style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>{errors.fee}</p>}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                type="button" 
                onClick={resetForm}
                disabled={loading}
                style={{ padding: '12px 24px', border: '1px solid #ddd', borderRadius: '8px', background: 'white', color: '#666', cursor: loading ? 'not-allowed' : 'pointer' }}
              >
                Reset Form
              </button>
              <button 
                type="submit"
                disabled={loading}
                style={{ padding: '12px 24px', border: 'none', borderRadius: '8px', background: loading ? '#ccc' : '#1976d2', color: 'white', cursor: loading ? 'not-allowed' : 'pointer' }}
              >
                {loading ? 'Adding...' : 'Add Gym'}
              </button>
            </div>
          </form>
        </div>

        {/* Add Member to Gym Section */}
        <div className="chart-card" style={{ marginTop: '20px' }}>
          <h3 className="card-title">Add Member to Gym</h3>
          <AddMemberToGymForm gyms={gyms} onMemberAdded={() => {}} />
        </div>

        {/* Display all gyms */}
        <div className="chart-card" style={{ marginTop: '20px' }}>
          <h3 className="card-title">All Gyms ({gyms.length})</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
            {gyms.length === 0 ? (
              <p style={{ color: '#666', textAlign: 'center', gridColumn: '1 / -1' }}>No gyms added yet</p>
            ) : (
              gyms.map(gym => (
                <div key={gym._id} style={{
                  padding: '20px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  background: 'white'
                }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>{gym.gymName}</h4>
                  <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>📞 {gym.phone}</p>
                  <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>📍 {gym.address}</p>
                  <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>📅 Established: {gym.year}</p>
                  <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>💰 Fee: ₹{gym.fee}/month</p>
                  <p style={{ margin: '5px 0', color: '#999', fontSize: '12px' }}>Added by: {gym.createdBy}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GymForm;
