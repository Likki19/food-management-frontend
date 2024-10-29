// components/Header.js
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/header.css'
const Header = ({ userType }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActiveLink = (path) => {
    return location.pathname === path ? 'active' : 'inactive';
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <nav className="header-nav">
          <div className="nav-links">
            <Link to="/dashboard" className={isActiveLink('/dashboard')}>
              Dashboard
            </Link>
            <Link to="/available-food" className={isActiveLink('/available-food')}>
              Available Food
            </Link>
            <Link to="/donate" className={isActiveLink('donate')}>
              Donate Food
            </Link>
            <Link to="/ngo-directory" className={isActiveLink('/ngo-directory')}>
              NGO Directory
            </Link>
            {userType === 'donor' && (
              <Link to="/donate" className={isActiveLink('/donate')}>
                Donate
              </Link>
            )}
            <Link to="/contact" className={isActiveLink('/contact')}>
              Contact
            </Link>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
