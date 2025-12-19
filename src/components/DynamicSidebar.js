import { NavLink, useLocation } from 'react-router-dom';
import './DynamicSidebar.css';

const DynamicSidebar = () => {
  const location = useLocation();
  
  const getThemeClass = () => {
    switch(location.pathname) {
      case '/': return 'sidebar-dashboard';
      case '/members': return 'sidebar-members';
      case '/trainers': return 'sidebar-trainers';
      case '/attendance': return 'sidebar-attendance';
      case '/gymForm': return 'sidebar-gym';
      case '/billing': return 'sidebar-billing';
      case '/settings': return 'sidebar-settings';
      default: return 'sidebar-dashboard';
    }
  };

  return (
    <div className={`sidebar ${getThemeClass()}`}>
      <div className="logo">
        <img src="https://img.freepik.com/premium-vector/gym-center-logo-logo-design-gym-center_1152818-25.jpg" alt="logo" style={{ width: '32px', height: '32px', borderRadius: '4px' }} />
        <span>Gym Management System</span>
      </div>
      
      <nav className="nav-menu">
        <NavLink to="/" className="nav-item">
          Dashboard
        </NavLink>
        <NavLink to="/members" className="nav-item">
          Members
        </NavLink>
        <NavLink to="/trainers" className="nav-item">
          Trainers
        </NavLink>
        <NavLink to="/attendance" className="nav-item">
          Attendance
        </NavLink>
        <NavLink to="/gymForm" className="nav-item">
          Gyms
        </NavLink>
        <NavLink to="/billing" className="nav-item">
          Billing
        </NavLink>
        <NavLink to="/settings" className="nav-item">
          Settings
        </NavLink>
      </nav>
      
      <div className="sidebar-footer">
        <NavLink to="/login" className="nav-item logout">
          Logout
        </NavLink>
      </div>
    </div>
  );
};

export default DynamicSidebar;