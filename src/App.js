import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Students from './pages/Students';
import Courses from './pages/Courses';
import Grades from './pages/Grades';
import Attendance from './pages/Attendance';

// Navigation bar component
const Navbar = () => {
  return (
    <nav style={styles.nav}>
      <span style={styles.brand}>SMS</span>
      <div style={styles.links}>
        <a href="/students" style={styles.link}>Students</a>
        <a href="/courses" style={styles.link}>Courses</a>
        <a href="/grades" style={styles.link}>Grades</a>
        <a href="/attendance" style={styles.link}>Attendance</a>
      </div>
    </nav>
  );
};

// Protected route
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? (
    <>
      <Navbar />
      {children}
    </>
  ) : (
    <Navigate to="/" />
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/students" element={<PrivateRoute><Students /></PrivateRoute>} />
        <Route path="/courses" element={<PrivateRoute><Courses /></PrivateRoute>} />
        <Route path="/grades" element={<PrivateRoute><Grades /></PrivateRoute>} />
        <Route path="/attendance" element={<PrivateRoute><Attendance /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a73e8',
    padding: '0 20px',
    height: '60px',
  },
  brand: {
    color: 'white',
    fontSize: '22px',
    fontWeight: 'bold',
  },
  links: {
    display: 'flex',
    gap: '20px',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '500',
  },
};

export default App;