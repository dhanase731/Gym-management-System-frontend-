import '../App.css';

const About = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80") center/cover fixed'
    }}>
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">About FitSync</h1>
        <div className="user-profile">
          <div className="activity-icon">ℹ️</div>
          <span>System Information</span>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="chart-card">
          <h3 className="card-title">System Overview</h3>
          <div style={{ padding: '20px 0' }}>
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: '#333', marginBottom: '8px' }}>FitSync Gym Management System</h4>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                A comprehensive gym management solution designed to streamline operations, 
                track member attendance, manage trainers, and monitor business performance.
              </p>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: '#333', marginBottom: '8px' }}>Key Features</h4>
              <ul style={{ color: '#666', lineHeight: '1.8', paddingLeft: '20px' }}>
                <li>Member registration and management</li>
                <li>Trainer scheduling and assignments</li>
                <li>Real-time attendance tracking</li>
                <li>Billing and payment processing</li>
                <li>Performance analytics and reporting</li>
                <li>Equipment and facility management</li>
              </ul>
            </div>

            <div>
              <h4 style={{ color: '#333', marginBottom: '8px' }}>Technology Stack</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚛️</div>
                  <div style={{ fontWeight: '500', color: '#333' }}>React 19.2.1</div>
                </div>
                <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>🛣️</div>
                  <div style={{ fontWeight: '500', color: '#333' }}>React Router</div>
                </div>
                <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎨</div>
                  <div style={{ fontWeight: '500', color: '#333' }}>Modern CSS</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="chart-card">
          <h3 className="card-title">System Statistics</h3>
          <div style={{ padding: '20px 0' }}>
            <div className="activity-item">
              <div className="activity-icon">👥</div>
              <div className="activity-content">
                <div className="activity-title">Total Registered Members</div>
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#333' }}>1,247</div>
              </div>
            </div>
            
            <div className="activity-item">
              <div className="activity-icon">💪</div>
              <div className="activity-content">
                <div className="activity-title">Active Trainers</div>
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#333' }}>23</div>
              </div>
            </div>
            
            <div className="activity-item">
              <div className="activity-icon">🏢</div>
              <div className="activity-content">
                <div className="activity-title">Gym Locations</div>
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#333' }}>5</div>
              </div>
            </div>
            
            <div className="activity-item">
              <div className="activity-icon">📈</div>
              <div className="activity-content">
                <div className="activity-title">System Uptime</div>
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#28a745' }}>99.9%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="chart-card">
        <h3 className="card-title">Contact & Support</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', padding: '20px 0' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>📧</div>
            <h4 style={{ color: '#333', marginBottom: '8px' }}>Email Support</h4>
            <p style={{ color: '#666' }}>support@fitsync.com</p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>📞</div>
            <h4 style={{ color: '#333', marginBottom: '8px' }}>Phone Support</h4>
            <p style={{ color: '#666' }}>+91 98765 43210</p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🌐</div>
            <h4 style={{ color: '#333', marginBottom: '8px' }}>Website</h4>
            <p style={{ color: '#666' }}>www.fitsync.com</p>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default About;
