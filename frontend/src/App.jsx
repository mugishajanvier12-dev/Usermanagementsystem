// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Components
// import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import EditUser from './pages/editUser';
import UserDetail from './pages/UserDetail';
import NotFound from './pages/NotFound';

function App() {
  const isAuthenticated = localStorage.getItem('musha_front_token');
  
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* <Navbar /> */}
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
            <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
            <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" replace />} />
            <Route path="/user-detail/:id" element={isAuthenticated ? <UserDetail /> : <Navigate to="/login" replace />} />
            <Route path="/edit-user/:id" element={isAuthenticated ? <EditUser /> : <Navigate to="/login" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;