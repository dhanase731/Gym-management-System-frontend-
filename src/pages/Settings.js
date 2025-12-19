import { useState, useEffect } from 'react';
import '../App.css';
import '../Styles/Settings.css';
import { api } from '../utils/api';

const Settings = () => {
  const [settings, setSettings] = useState({
    gymName: 'FitSync Gym Center',
    contactEmail: 'admin@fitsync.com',
    phoneNumber: '+91 98765 43210',
    address: '123 Fitness Street, Gym City, State - 560001',
    membershipPlans: [
      { name: 'Basic Plan', description: 'Access to gym equipment', price: 1500 },
      { name: 'Standard Plan', description: 'Gym + Group classes', price: 2000 },
      { name: 'Premium Plan', description: 'All access + Personal trainer', price: 2500 }
    ],
    notifications: {
      email: true,
      sms: false,
      paymentReminders: true
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await api.getSettings();
      if (data) {
        setSettings({
          ...{
            gymName: 'FitSync Gym Center',
            contactEmail: 'admin@fitsync.com',
            phoneNumber: '+91 98765 43210',
            address: '123 Fitness Street, Gym City, State - 560001',
            membershipPlans: [
              { name: 'Basic Plan', description: 'Access to gym equipment', price: 1500 },
              { name: 'Standard Plan', description: 'Gym + Group classes', price: 2000 },
              { name: 'Premium Plan', description: 'All access + Personal trainer', price: 2500 }
            ],
            notifications: {
              email: true,
              sms: false,
              paymentReminders: true
            }
          },
          ...data
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateSettings(settings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleGeneralChange = (field, value) => {
    setSettings({ ...settings, [field]: value });
  };

  const handlePlanChange = (index, field, value) => {
    const newPlans = [...settings.membershipPlans];
    newPlans[index] = { ...newPlans[index], [field]: value };
    setSettings({ ...settings, membershipPlans: newPlans });
  };

  const handleNotificationChange = (field, value) => {
    setSettings({
      ...settings,
      notifications: { ...settings.notifications, [field]: value }
    });
  };

  const addNewPlan = () => {
    setSettings({
      ...settings,
      membershipPlans: [
        ...settings.membershipPlans,
        { name: 'New Plan', description: 'Plan description', price: 0 }
      ]
    });
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div className="settings-background">
      <div className="dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">System Settings</h1>
          <div className="user-profile">
            <button 
              onClick={handleSave}
              disabled={saving}
              style={{ padding: '8px 16px', border: 'none', borderRadius: '6px', background: saving ? '#ccc' : '#34495E', color: 'white', cursor: saving ? 'not-allowed' : 'pointer' }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="chart-card">
            <h3 className="card-title">General Settings</h3>
            <div style={{ padding: '20px 0', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Gym Name</label>
                <input 
                  value={settings.gymName}
                  onChange={(e) => handleGeneralChange('gymName', e.target.value)}
                  style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Contact Email</label>
                <input 
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => handleGeneralChange('contactEmail', e.target.value)}
                  style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Phone Number</label>
                <input 
                  value={settings.phoneNumber}
                  onChange={(e) => handleGeneralChange('phoneNumber', e.target.value)}
                  style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Address</label>
                <textarea 
                  value={settings.address}
                  onChange={(e) => handleGeneralChange('address', e.target.value)}
                  rows="3"
                  style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', resize: 'vertical' }}
                />
              </div>
            </div>
          </div>

          <div className="chart-card">
            <h3 className="card-title">Membership Plans</h3>
            <div style={{ padding: '20px 0' }}>
              {(settings.membershipPlans || []).map((plan, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#F8F9FA', borderRadius: '8px', marginBottom: '12px' }}>
                  <div style={{ flex: 1, marginRight: '12px' }}>
                    <input
                      value={plan.name}
                      onChange={(e) => handlePlanChange(index, 'name', e.target.value)}
                      style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '8px', fontWeight: '500' }}
                      placeholder="Plan Name"
                    />
                    <input
                      value={plan.description}
                      onChange={(e) => handlePlanChange(index, 'description', e.target.value)}
                      style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', color: '#666' }}
                      placeholder="Plan Description"
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input
                      type="number"
                      value={plan.price}
                      onChange={(e) => handlePlanChange(index, 'price', parseFloat(e.target.value) || 0)}
                      style={{ width: '120px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontWeight: '500', color: '#2ECC71' }}
                      placeholder="Price"
                    />
                    <span style={{ fontSize: '12px', color: '#666' }}>₹/month</span>
                  </div>
                </div>
              ))}
              
              <button 
                onClick={addNewPlan}
                style={{ width: '100%', padding: '12px', border: '2px dashed #ddd', borderRadius: '8px', background: 'white', color: '#666', cursor: 'pointer' }}
              >
                + Add New Plan
              </button>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="chart-card">
            <h3 className="card-title">Notification Settings</h3>
            <div style={{ padding: '20px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '500', color: '#333' }}>Email Notifications</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Receive updates via email</div>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
                  <input 
                    type="checkbox" 
                    checked={(settings.notifications || {}).email || false}
                    onChange={(e) => handleNotificationChange('email', e.target.checked)}
                    style={{ opacity: 0, width: 0, height: 0 }} 
                  />
                  <span style={{ 
                    position: 'absolute', 
                    cursor: 'pointer', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    bottom: 0, 
                    background: (settings.notifications || {}).email ? '#2ECC71' : '#BDC3C7', 
                    borderRadius: '24px', 
                    transition: '0.4s'
                  }}>
                    <span style={{
                      position: 'absolute',
                      content: '""',
                      height: '18px',
                      width: '18px',
                      left: (settings.notifications || {}).email ? '26px' : '3px',
                      bottom: '3px',
                      backgroundColor: 'white',
                      transition: '0.4s',
                      borderRadius: '50%'
                    }}></span>
                  </span>
                </label>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '500', color: '#333' }}>SMS Notifications</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Receive updates via SMS</div>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
                  <input 
                    type="checkbox" 
                    checked={(settings.notifications || {}).sms || false}
                    onChange={(e) => handleNotificationChange('sms', e.target.checked)}
                    style={{ opacity: 0, width: 0, height: 0 }} 
                  />
                  <span style={{ 
                    position: 'absolute', 
                    cursor: 'pointer', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    bottom: 0, 
                    background: (settings.notifications || {}).sms ? '#2ECC71' : '#BDC3C7', 
                    borderRadius: '24px', 
                    transition: '0.4s'
                  }}>
                    <span style={{
                      position: 'absolute',
                      content: '""',
                      height: '18px',
                      width: '18px',
                      left: (settings.notifications || {}).sms ? '26px' : '3px',
                      bottom: '3px',
                      backgroundColor: 'white',
                      transition: '0.4s',
                      borderRadius: '50%'
                    }}></span>
                  </span>
                </label>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '500', color: '#333' }}>Payment Reminders</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Auto-send payment reminders</div>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
                  <input 
                    type="checkbox" 
                    checked={(settings.notifications || {}).paymentReminders || false}
                    onChange={(e) => handleNotificationChange('paymentReminders', e.target.checked)}
                    style={{ opacity: 0, width: 0, height: 0 }} 
                  />
                  <span style={{ 
                    position: 'absolute', 
                    cursor: 'pointer', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    bottom: 0, 
                    background: (settings.notifications || {}).paymentReminders ? '#2ECC71' : '#BDC3C7', 
                    borderRadius: '24px', 
                    transition: '0.4s'
                  }}>
                    <span style={{
                      position: 'absolute',
                      content: '""',
                      height: '18px',
                      width: '18px',
                      left: (settings.notifications || {}).paymentReminders ? '26px' : '3px',
                      bottom: '3px',
                      backgroundColor: 'white',
                      transition: '0.4s',
                      borderRadius: '50%'
                    }}></span>
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="chart-card">
            <h3 className="card-title">System Information</h3>
            <div style={{ padding: '20px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                <span style={{ color: '#666' }}>Version</span>
                <span style={{ fontWeight: '500' }}>v2.1.0</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                <span style={{ color: '#666' }}>Last Updated</span>
                <span style={{ fontWeight: '500' }}>{new Date().toLocaleDateString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                <span style={{ color: '#666' }}>Database</span>
                <span style={{ fontWeight: '500' }}>MongoDB</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                <span style={{ color: '#666' }}>Backend</span>
                <span style={{ color: '#2ECC71', fontWeight: '500' }}>Connected</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
                <span style={{ color: '#666' }}>License</span>
                <span style={{ fontWeight: '500' }}>Premium</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
