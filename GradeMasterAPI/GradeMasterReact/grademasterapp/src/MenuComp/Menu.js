import React from 'react';
import './Menu.css';

function Menu() {
  return (
    <div className="Menu">
      <header className="Menu-header">
        <h1>Menu</h1>
        <nav>
          <ul className="menu-list">
            <li>
              <div className="menu-item">
                <span role="img" aria-label="student" className="menu-icon">
                  🎓
                </span>
                <span className="menu-text">Student</span>
              </div>
            </li>
            <li>
              <div className="menu-item">
                <span role="img" aria-label="exams" className="menu-icon">
                  📋
                </span>
                <span className="menu-text">Exams</span>
              </div>
            </li>
            <li>
              <div className="menu-item">
                <span role="img" aria-label="attendance" className="menu-icon">
                  📅
                </span>
                <span className="menu-text">Attendance</span>
              </div>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
}

export default Menu;
