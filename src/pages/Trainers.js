import { useState, useEffect } from 'react';
import '../App.css';
import '../Styles/Trainers.css';
import { api } from '../utils/api';

const Trainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('All Specializations');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: 'Weight Training',
    experience: '',
    image: '',
    bio: '',
    certifications: [],
    rating: 0,
    status: 'Active'
  });

  const specializations = [
    'All Specializations',
    'Weight Training',
    'Cardio & Fitness',
    'Yoga & Flexibility',
    'CrossFit',
    'Pilates',
    'Boxing',
    'Swimming'
  ];

  useEffect(() => {
    loadTrainers();
  }, [specializationFilter, searchTerm]);

  const loadTrainers = async () => {
    try {
      setLoading(true);
      const data = await api.getTrainers(
        specializationFilter === 'All Specializations' ? '' : specializationFilter,
        searchTerm
      );
      setTrainers(data);
    } catch (error) {
      console.error('Error loading trainers:', error);
      alert('Failed to load trainers');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTrainer = () => {
    setSelectedTrainer(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      specialization: 'Weight Training',
      experience: '',
      image: '',
      bio: '',
      certifications: [],
      rating: 0,
      status: 'Active'
    });
    setShowModal(true);
  };

  const handleViewTrainer = async (id) => {
    try {
      const trainer = await api.getTrainer(id);
      setSelectedTrainer(trainer);
      setShowViewModal(true);
    } catch (error) {
      console.error('Error loading trainer:', error);
      alert('Failed to load trainer details');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedTrainer) {
        await api.updateTrainer(selectedTrainer._id, formData);
        alert('Trainer updated successfully');
      } else {
        await api.createTrainer(formData);
        alert('Trainer added successfully');
      }
      setShowModal(false);
      loadTrainers();
    } catch (error) {
      console.error('Error saving trainer:', error);
      alert('Failed to save trainer');
    }
  };

  const handleDeleteTrainer = async (id) => {
    if (window.confirm('Are you sure you want to delete this trainer?')) {
      try {
        await api.deleteTrainer(id);
        loadTrainers();
        alert('Trainer deleted successfully');
      } catch (error) {
        console.error('Error deleting trainer:', error);
        alert('Failed to delete trainer');
      }
    }
  };

  const stats = {
    total: trainers.length,
    active: trainers.filter(t => t.status === 'Active').length,
    avgRating: trainers.length > 0 
      ? (trainers.reduce((sum, t) => sum + (t.rating || 0), 0) / trainers.length).toFixed(1)
      : 0,
    totalSessions: trainers.reduce((sum, t) => sum + (t.members || 0), 0)
  };

  if (loading && trainers.length === 0) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div className="trainers-background">
      <div className="dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Trainers Management</h1>
          <div className="user-profile">
            <button 
              onClick={handleAddTrainer}
              style={{ padding: '8px 16px', border: 'none', borderRadius: '6px', background: '#FF6B35', color: 'white', cursor: 'pointer' }}
            >
              + Add Trainer
            </button>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card" style={{ borderLeftColor: '#FF6B35', background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.15), rgba(255, 255, 255, 0.95))', boxShadow: '0 8px 32px rgba(255, 107, 53, 0.2)' }}>
            <div className="stat-title">Total Trainers</div>
            <div className="stat-value" style={{ color: '#FF6B35' }}>{stats.total}</div>
            <div className="stat-change" style={{ color: '#FF8C00' }}>Active trainers</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#FF8C00', background: 'linear-gradient(135deg, rgba(255, 140, 0, 0.15), rgba(255, 255, 255, 0.95))', boxShadow: '0 8px 32px rgba(255, 140, 0, 0.2)' }}>
            <div className="stat-title">Active Trainers</div>
            <div className="stat-value" style={{ color: '#FF8C00' }}>{stats.active}</div>
            <div className="stat-change" style={{ color: '#FFA500' }}>{stats.total > 0 ? ((stats.active / stats.total) * 100).toFixed(1) : 0}% active rate</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#FFA500', background: 'linear-gradient(135deg, rgba(255, 165, 0, 0.15), rgba(255, 255, 255, 0.95))', boxShadow: '0 8px 32px rgba(255, 165, 0, 0.2)' }}>
            <div className="stat-title">Average Rating</div>
            <div className="stat-value" style={{ color: '#FFA500' }}>{stats.avgRating}</div>
            <div className="stat-change" style={{ color: '#FFB347' }}>Out of 5.0</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#FFB347', background: 'linear-gradient(135deg, rgba(255, 179, 71, 0.15), rgba(255, 255, 255, 0.95))', boxShadow: '0 8px 32px rgba(255, 179, 71, 0.2)' }}>
            <div className="stat-title">Total Members</div>
            <div className="stat-value" style={{ color: '#FFB347' }}>{stats.totalSessions}</div>
            <div className="stat-change" style={{ color: '#FF6B35' }}>Across all trainers</div>
          </div>
        </div>

        <div className="chart-card" style={{ background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.03), rgba(255, 255, 255, 0.97))', border: '1px solid rgba(78, 205, 196, 0.15)', boxShadow: '0 10px 30px rgba(78, 205, 196, 0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 className="card-title" style={{ color: '#4ECDC4', fontSize: '20px', fontWeight: '600' }}>Trainer Directory</h3>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input 
                placeholder="Search trainers..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', width: '200px' }}
              />
              <select 
                value={specializationFilter}
                onChange={(e) => setSpecializationFilter(e.target.value)}
                style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px' }}
              >
                {specializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#666', fontWeight: '500' }}>Trainer</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#666', fontWeight: '500' }}>Specialization</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#666', fontWeight: '500' }}>Experience</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#666', fontWeight: '500' }}>Members</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#666', fontWeight: '500' }}>Rating</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#666', fontWeight: '500' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#666', fontWeight: '500' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {trainers.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                      No trainers found
                    </td>
                  </tr>
                ) : (
                  (trainers || []).map((trainer) => (
                    <tr key={trainer._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {trainer.image ? (
                            <img 
                              src={trainer.image} 
                              alt={trainer.name}
                              style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                          ) : (
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#FF6B35', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                              {trainer.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <div style={{ fontWeight: '500', color: '#333' }}>{trainer.name}</div>
                            <div style={{ fontSize: '12px', color: '#666' }}>ID: TR{trainer._id.toString().slice(-6)}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px', color: '#666' }}>{trainer.specialization}</td>
                      <td style={{ padding: '12px', color: '#666' }}>{trainer.experience}</td>
                      <td style={{ padding: '12px', color: '#666' }}>{trainer.members || 0}</td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ color: '#FFD700' }}>★</span>
                          <span style={{ fontWeight: '500' }}>{trainer.rating || 0}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ 
                          padding: '4px 8px', 
                          borderRadius: '12px', 
                          fontSize: '12px', 
                          fontWeight: '500',
                          background: trainer.status === 'Active' ? '#E8F5E8' : trainer.status === 'On Leave' ? '#FFF3CD' : '#FFEBEE',
                          color: trainer.status === 'Active' ? '#4CAF50' : trainer.status === 'On Leave' ? '#F57C00' : '#DC3545'
                        }}>
                          {trainer.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            onClick={() => handleViewTrainer(trainer._id)}
                            style={{ padding: '4px 8px', border: 'none', borderRadius: '4px', background: '#4ECDC4', color: 'white', cursor: 'pointer', fontSize: '12px' }}
                          >
                            View
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedTrainer(trainer);
                              setFormData({
                                name: trainer.name,
                                email: trainer.email,
                                phone: trainer.phone,
                                specialization: trainer.specialization,
                                experience: trainer.experience,
                                image: trainer.image || '',
                                bio: trainer.bio || '',
                                certifications: trainer.certifications || [],
                                rating: trainer.rating || 0,
                                status: trainer.status
                              });
                              setShowModal(true);
                            }}
                            style={{ padding: '4px 8px', border: 'none', borderRadius: '4px', background: '#45B7D1', color: 'white', cursor: 'pointer', fontSize: '12px' }}
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteTrainer(trainer._id)}
                            style={{ padding: '4px 8px', border: 'none', borderRadius: '4px', background: '#dc3545', color: 'white', cursor: 'pointer', fontSize: '12px' }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Trainer Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h2 style={{ marginBottom: '20px' }}>{selectedTrainer ? 'Edit Trainer' : 'Add New Trainer'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Phone</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Specialization</label>
                  <select
                    required
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                  >
                    {specializations.filter(s => s !== 'All Specializations').map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Experience</label>
                <input
                  type="text"
                  required
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder="e.g., 5 years"
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows="3"
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Rating</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                >
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedTrainer(null);
                  }}
                  style={{ padding: '10px 20px', border: '1px solid #ddd', borderRadius: '6px', background: 'white', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '10px 20px', border: 'none', borderRadius: '6px', background: '#FF6B35', color: 'white', cursor: 'pointer' }}
                >
                  {selectedTrainer ? 'Update' : 'Add'} Trainer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Trainer Details Modal */}
      {showViewModal && selectedTrainer && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              {selectedTrainer.image ? (
                <img 
                  src={selectedTrainer.image} 
                  alt={selectedTrainer.name}
                  style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', marginBottom: '20px' }}
                />
              ) : (
                <div style={{ width: '150px', height: '150px', borderRadius: '50%', background: '#FF6B35', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '48px', fontWeight: 'bold', margin: '0 auto 20px auto' }}>
                  {selectedTrainer.name.charAt(0)}
                </div>
              )}
              <h2 style={{ marginBottom: '10px' }}>{selectedTrainer.name}</h2>
              <p style={{ color: '#666', marginBottom: '20px' }}>{selectedTrainer.specialization}</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#FF6B35' }}>★ {selectedTrainer.rating || 0}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Rating</div>
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#FF6B35' }}>{selectedTrainer.members || 0}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Members</div>
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#FF6B35' }}>{selectedTrainer.experience}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Experience</div>
                </div>
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '10px' }}>Contact Information</h3>
              <p><strong>Email:</strong> {selectedTrainer.email}</p>
              <p><strong>Phone:</strong> {selectedTrainer.phone}</p>
            </div>

            {selectedTrainer.bio && (
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ marginBottom: '10px' }}>Bio</h3>
                <p style={{ color: '#666', lineHeight: '1.6' }}>{selectedTrainer.bio}</p>
              </div>
            )}

            {selectedTrainer.certifications && selectedTrainer.certifications.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ marginBottom: '10px' }}>Certifications</h3>
                <ul>
                  {(selectedTrainer.certifications || []).map((cert, index) => (
                    <li key={index} style={{ marginBottom: '5px' }}>{cert}</li>
                  ))}
                </ul>
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <span style={{ 
                padding: '6px 12px', 
                borderRadius: '12px', 
                fontSize: '14px', 
                fontWeight: '500',
                background: selectedTrainer.status === 'Active' ? '#E8F5E8' : selectedTrainer.status === 'On Leave' ? '#FFF3CD' : '#FFEBEE',
                color: selectedTrainer.status === 'Active' ? '#4CAF50' : selectedTrainer.status === 'On Leave' ? '#F57C00' : '#DC3545'
              }}>
                Status: {selectedTrainer.status}
              </span>
            </div>

            <button
              onClick={() => setShowViewModal(false)}
              style={{ width: '100%', padding: '12px', border: 'none', borderRadius: '6px', background: '#FF6B35', color: 'white', cursor: 'pointer' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trainers;
