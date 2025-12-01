import React from 'react';
import './TypicalDashboard.css';

interface TypicalDashboardProps {
  onNavigate: (page: string) => void;
  onLogout?: () => void;
}

const TypicalDashboard: React.FC<TypicalDashboardProps> = ({ onNavigate, onLogout }) => {
  return (
    <div className="typical-dashboard-container">
      <h1 className="typical-dashboard-title">Welcome to Divergent Flow</h1>
      <p className="typical-dashboard-desc">
        This is your productivity hub. Use the menu below to get started.
      </p>
      <div className="typical-dashboard-menu">
        <button className="typical-dashboard-btn" onClick={() => onNavigate('capture')}>Capture</button>
        <button className="typical-dashboard-btn" onClick={() => onNavigate('settings')}>Settings</button>
        {onLogout && (
          <button className="typical-dashboard-btn" onClick={onLogout}>Logout</button>
        )}
      </div>
    </div>
  );
};

export default TypicalDashboard;
