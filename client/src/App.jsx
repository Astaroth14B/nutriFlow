import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Plans from './pages/Plans';
import Recommend from './pages/Recommend';
import Dashboard from './pages/Dashboard';
import Staff from './pages/Staff';
import Ordering from './pages/Ordering';
import Meals from './pages/Meals';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/recommend" element={<Recommend />} />
                    <Route path="/plans" element={<Plans />} />
                    <Route path="/staff" element={<Staff />} />
                    <Route path="/meals" element={<Meals />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/ordering" element={<Ordering />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
