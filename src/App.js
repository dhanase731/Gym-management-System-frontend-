import './App.css';
import { Outlet } from 'react-router-dom';
import DynamicSidebar from './components/DynamicSidebar';

function App() {
  return (
    <div className="app-layout">
      <DynamicSidebar />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
