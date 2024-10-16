// src/components/Navbar.js
import React from 'react';
import './NavBar.css'
function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">Tel Hai College</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link active" href="/">Dashboard</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/">Website</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/">Useful Guides</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/">Library</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/">Contact us</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/">Language</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;