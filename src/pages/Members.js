import { useState, useEffect } from 'react';
import '../App.css';
import '../Styles/Members.css';
import { api } from '../utils/api';
import { checkBackendConnection } from '../utils/checkBackend';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [gyms, setGyms] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    plan: 'Basic',
    status: 'Active',
    gymId: '',
    joinDate: new Date().toISOString().split('T')[0]
  });
  const [showInlineForm, setShowInlineForm] = useState(false);
  const [inlineFormData, setInlineFormData] = useState({
    name: '',
    email: '',
    phone: '',
    plan: 'Basic',
    status: 'Active',
    gymId: '',
    joinDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    // Check backend connection on mount
    checkBackendConnection().then(status => {
      if (!status.connected) {
        alert('⚠️ Backend Server Not Running!\n\n' + status.message + '\n\nPlease start the backend server first.');
      }
    });
    
    loadMembers();
    loadGyms();
  }, []);

  const loadMembers = async () => {
    try {
      const data = await api.getMembers();
      setMembers(data);
    } catch (error) {
      console.error('Error loading members:', error);
      alert('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  const loadGyms = async () => {
    try {
      const data = await api.getGyms();
      setGyms(data);
    } catch (error) {
      console.error('Error loading gyms:', error);
    }
  };

  const handleAddMember = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      plan: 'Basic',
      status: 'Active',
      gymId: '',
      joinDate: new Date().toISOString().split('T')[0]
    });
    setShowModal(true);
  };

  const handleAddMemberInline = () => {
    setShowInlineForm(true);
    setInlineFormData({
      name: '',
      email: '',
      phone: '',
      plan: 'Basic',
      status: 'Active',
      gymId: '',
      joinDate: new Date().toISOString().split('T')[0]
    });
  };

  const handleSubmitInline = async (e) => {
    e.preventDefault();
    try {
      const newMember = await api.createMember(inlineFormData);
      alert('Member added successfully');
      
      // Auto-create billing for new member
      if (newMember && newMember._id) {
        const selectedGym = gyms.find(g => g._id === inlineFormData.gymId);
        const planPrices = { Basic: 1500, Standard: 2000, Premium: 2500 };
        const dueDate = new Date();
        dueDate.setMonth(dueDate.getMonth() + 1);
        
        try {
          await api.createBill({
            memberId: newMember._id,
            memberName: newMember.name,
            gymId: inlineFormData.gymId || '',
            gymName: selectedGym?.gymName || '',
            plan: inlineFormData.plan,
            amount: planPrices[inlineFormData.plan] || 1500,
            dueDate: dueDate.toISOString().split('T')[0],
            paymentMethod: ''
          });
        } catch (billingError) {
          console.error('Error creating bill:', billingError);
        }
      }
      
      setShowInlineForm(false);
      loadMembers();
    } catch (error) {
      console.error('Error saving member:', error);
      const errorMessage = error.message || 'Unknown error';
      
      // Show user-friendly error message
      if (errorMessage.includes('Cannot connect to server')) {
        alert('❌ Connection Error!\n\n' + errorMessage + '\n\nPlease start the backend server first.');
      } else {
        alert('Failed to save member: ' + errorMessage);
      }
    }
  };

  const handleEditMember = (member) => {
    setEditingMember(member);
    const joinDate = member.joinDate ? new Date(member.joinDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      plan: member.plan,
      status: member.status,
      gymId: member.gymId?._id || member.gymId || '',
      joinDate: joinDate
    });
    setShowModal(true);
  };

  const handleDeleteMember = async (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await api.deleteMember(id);
        loadMembers();
        alert('Member deleted successfully');
      } catch (error) {
        console.error('Error deleting member:', error);
        alert('Failed to delete member');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMember) {
        await api.updateMember(editingMember._id, formData);
        alert('Member updated successfully');
      } else {
        const newMember = await api.createMember(formData);
        alert('Member added successfully');
        
        // Auto-create billing for new member
        if (newMember && newMember._id) {
          const selectedGym = gyms.find(g => g._id === formData.gymId);
          const planPrices = { Basic: 1500, Standard: 2000, Premium: 2500 };
          const dueDate = new Date();
          dueDate.setMonth(dueDate.getMonth() + 1);
          
          try {
            await api.createBill({
              memberId: newMember._id,
              memberName: newMember.name,
              gymId: formData.gymId || '',
              gymName: selectedGym?.gymName || '',
              plan: formData.plan,
              amount: planPrices[formData.plan] || 1500,
              dueDate: dueDate.toISOString().split('T')[0],
              paymentMethod: ''
            });
            
            // Send bill via email
            if (newMember.email) {
              try {
                // This will be handled by the backend when bill is created
                console.log('Bill created for member:', newMember.name);
              } catch (emailError) {
                console.error('Error sending email:', emailError);
              }
            }
          } catch (billingError) {
            console.error('Error creating bill:', billingError);
            // Don't fail the member creation if billing fails
          }
        }
      }
      setShowModal(false);
      loadMembers();
    } catch (error) {
      console.error('Error saving member:', error);
      const errorMessage = error.message || 'Unknown error';
      
      // Show user-friendly error message
      if (errorMessage.includes('Cannot connect to server')) {
        alert('❌ Connection Error!\n\n' + errorMessage + '\n\nPlease start the backend server first.');
      } else {
        alert('Failed to save member: ' + errorMessage);
      }
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'All Status' || member.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: members.length,
    active: members.filter(m => m.status === 'Active').length,
    newThisMonth: members.filter(m => {
      const joinDate = new Date(m.joinDate);
      const now = new Date();
      return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear();
    }).length,
    premium: members.filter(m => m.plan === 'Premium').length
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div className="members-background">
      <div className="dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Members Management</h1>
          <div className="user-profile">
            <button 
              onClick={handleAddMember}
              style={{ padding: '8px 16px', border: 'none', borderRadius: '6px', background: '#1976d2', color: 'white', cursor: 'pointer' }}
            >
              + Add Member
            </button>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card" style={{ borderLeftColor: '#4ECDC4', background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.15), rgba(255, 255, 255, 0.95))', boxShadow: '0 8px 32px rgba(78, 205, 196, 0.2)' }}>
            <div className="stat-title">Total Members</div>
            <div className="stat-value" style={{ color: '#4ECDC4' }}>{stats.total}</div>
            <div className="stat-change" style={{ color: '#20B2AA' }}>+{stats.newThisMonth} this month</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#20B2AA', background: 'linear-gradient(135deg, rgba(32, 178, 170, 0.15), rgba(255, 255, 255, 0.95))', boxShadow: '0 8px 32px rgba(32, 178, 170, 0.2)' }}>
            <div className="stat-title">Active Members</div>
            <div className="stat-value" style={{ color: '#20B2AA' }}>{stats.active}</div>
            <div className="stat-change" style={{ color: '#48D1CC' }}>{stats.total > 0 ? ((stats.active / stats.total) * 100).toFixed(1) : 0}% active rate</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#48D1CC', background: 'linear-gradient(135deg, rgba(72, 209, 204, 0.15), rgba(255, 255, 255, 0.95))', boxShadow: '0 8px 32px rgba(72, 209, 204, 0.2)' }}>
            <div className="stat-title">New This Month</div>
            <div className="stat-value" style={{ color: '#48D1CC' }}>{stats.newThisMonth}</div>
            <div className="stat-change" style={{ color: '#40E0D0' }}>New members</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#40E0D0', background: 'linear-gradient(135deg, rgba(64, 224, 208, 0.15), rgba(255, 255, 255, 0.95))', boxShadow: '0 8px 32px rgba(64, 224, 208, 0.2)' }}>
            <div className="stat-title">Premium Members</div>
            <div className="stat-value" style={{ color: '#40E0D0' }}>{stats.premium}</div>
            <div className="stat-change" style={{ color: '#4ECDC4' }}>{stats.total > 0 ? ((stats.premium / stats.total) * 100).toFixed(1) : 0}% of total</div>
          </div>
        </div>

        <div className="chart-card" style={{ background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.03), rgba(255, 255, 255, 0.97))', border: '1px solid rgba(255, 107, 107, 0.15)', boxShadow: '0 10px 30px rgba(255, 107, 107, 0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 className="card-title" style={{ color: '#FF6B6B', fontSize: '20px', fontWeight: '600' }}>Member Directory</h3>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input 
                placeholder="Search members..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', width: '200px' }}
              />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px' }}
              >
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
              {!showInlineForm && (
                <button
                  onClick={handleAddMemberInline}
                  style={{ 
                    padding: '8px 16px', 
                    border: 'none', 
                    borderRadius: '6px', 
                    background: '#4ECDC4', 
                    color: 'white', 
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    whiteSpace: 'nowrap'
                  }}
                >
                  + Add in Table
                </button>
              )}
            </div>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#666', fontWeight: '500' }}>Member</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#666', fontWeight: '500' }}>Contact</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#666', fontWeight: '500' }}>Plan</th>                  <th style={{ padding: '12px', textAlign: 'left', color: '#666', fontWeight: '500' }}>Status</th>                  <th style={{ padding: '12px', textAlign: 'left', color: '#666', fontWeight: '500' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#666', fontWeight: '500' }}>Join Date</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#666', fontWeight: '500' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Inline Add Member Form Row */}
                {showInlineForm && (
                  <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #4ECDC4' }}>
                    <td colSpan="6" style={{ padding: '15px' }}>
                      <form onSubmit={handleSubmitInline} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1.2fr 1.5fr', gap: '10px', alignItems: 'center' }}>
                        <div>
                          <input
                            type="text"
                            required
                            placeholder="Name *"
                            value={inlineFormData.name}
                            onChange={(e) => setInlineFormData({ ...inlineFormData, name: e.target.value })}
                            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                          />
                          <input
                            type="email"
                            required
                            placeholder="Email *"
                            value={inlineFormData.email}
                            onChange={(e) => setInlineFormData({ ...inlineFormData, email: e.target.value })}
                            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', marginTop: '5px' }}
                          />
                        </div>
                        <div>
                          <input
                            type="tel"
                            required
                            placeholder="Phone *"
                            value={inlineFormData.phone}
                            onChange={(e) => setInlineFormData({ ...inlineFormData, phone: e.target.value })}
                            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                          />
                          <select
                            value={inlineFormData.gymId}
                            onChange={(e) => setInlineFormData({ ...inlineFormData, gymId: e.target.value })}
                            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', marginTop: '5px' }}
                          >
                            <option value="">Select Gym</option>
                            {gyms.map(gym => (
                              <option key={gym._id} value={gym._id}>{gym.gymName}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <select
                            required
                            value={inlineFormData.plan}
                            onChange={(e) => setInlineFormData({ ...inlineFormData, plan: e.target.value })}
                            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                          >
                            <option value="Basic">Basic</option>
                            <option value="Standard">Standard</option>
                            <option value="Premium">Premium</option>
                          </select>
                        </div>
                        <div>
                          <select
                            required
                            value={inlineFormData.status}
                            onChange={(e) => setInlineFormData({ ...inlineFormData, status: e.target.value })}
                            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        </div>
                        <div>
                          <input
                            type="date"
                            required
                            value={inlineFormData.joinDate}
                            onChange={(e) => setInlineFormData({ ...inlineFormData, joinDate: e.target.value })}
                            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                          />
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            type="submit"
                            style={{ 
                              padding: '8px 16px', 
                              border: 'none', 
                              borderRadius: '4px', 
                              background: '#4ECDC4', 
                              color: 'white', 
                              cursor: 'pointer', 
                              fontSize: '14px',
                              fontWeight: '500'
                            }}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowInlineForm(false)}
                            style={{ 
                              padding: '8px 16px', 
                              border: '1px solid #ddd', 
                              borderRadius: '4px', 
                              background: 'white', 
                              color: '#666', 
                              cursor: 'pointer', 
                              fontSize: '14px'
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </td>
                  </tr>
                )}
                
                {filteredMembers.length === 0 && !showInlineForm ? (
                  <tr>
                    <td colSpan="7" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                      No members found
                    </td>
                  </tr>
                ) : (
                  (filteredMembers || []).map((member) => (
                    <tr key={member._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div className="activity-icon" style={{ width: '40px', height: '40px', fontSize: '16px' }}>👤</div>
                          <div>
                            <div style={{ fontWeight: '500', color: '#333' }}>{member.name}</div>
                            <div style={{ fontSize: '12px', color: '#666' }}>{member.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px', color: '#666' }}>{member.phone}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ 
                          padding: '4px 8px', 
                          borderRadius: '12px', 
                          fontSize: '12px', 
                          fontWeight: '500',
                          background: member.plan === 'Premium' ? '#e3f2fd' : member.plan === 'Standard' ? '#fff3e0' : '#f3e5f5',
                          color: member.plan === 'Premium' ? '#1976d2' : member.plan === 'Standard' ? '#f57c00' : '#7b1fa2'
                        }}>
                          {member.plan}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ 
                          padding: '4px 8px', 
                          borderRadius: '12px', 
                          fontSize: '12px', 
                          fontWeight: '500',
                          background: member.status === 'Active' ? '#e8f5e8' : '#ffebee',
                          color: member.status === 'Active' ? '#28a745' : '#dc3545'
                        }}>
                          {member.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px', color: '#666' }}>
                        {new Date(member.joinDate).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            onClick={() => handleEditMember(member)}
                            style={{ padding: '4px 8px', border: 'none', borderRadius: '4px', background: '#e3f2fd', color: '#1976d2', cursor: 'pointer', fontSize: '12px' }}
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteMember(member._id)}
                            style={{ padding: '4px 8px', border: 'none', borderRadius: '4px', background: '#ffebee', color: '#dc3545', cursor: 'pointer', fontSize: '12px' }}
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

      {/* Add/Edit Member Modal */}
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
            maxWidth: '500px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h2 style={{ marginBottom: '20px' }}>{editingMember ? 'Edit Member' : 'Add New Member'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Phone</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Plan</label>
                <select
                  value={formData.plan}
                  onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                >
                  <option value="Basic">Basic</option>
                  <option value="Standard">Standard</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Join Date</label>
                <input
                  type="date"
                  required
                  value={formData.joinDate}
                  onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Gym</label>
                <select
                  value={formData.gymId}
                  onChange={(e) => setFormData({ ...formData, gymId: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                >
                  <option value="">Select Gym</option>
                  {gyms.map(gym => (
                    <option key={gym._id} value={gym._id}>{gym.gymName}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ padding: '10px 20px', border: '1px solid #ddd', borderRadius: '6px', background: 'white', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '10px 20px', border: 'none', borderRadius: '6px', background: '#1976d2', color: 'white', cursor: 'pointer' }}
                >
                  {editingMember ? 'Update' : 'Add'} Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
