import React from 'react';

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  return (
    <header className="header">
      <div className="header-title">CloudSync Directory</div>
      <div className="header-actions">
        <button onClick={onLogout} className="logout-button">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
