import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            alert('Login failed. Check credentials.');
        }
    };

    return (
        <div style={{ padding: '160px 0', minHeight: '100vh', background: 'var(--bg-cream)', display: 'flex', alignItems: 'center' }}>
            <div className="container" style={{ maxWidth: '500px' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Welcome Back</h2>
                    <p style={{ color: 'var(--text-light)' }}>Sign in to manage your personalized nutrition.</p>
                </div>

                <div className="card" style={{ padding: '3.5rem', border: 'none' }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem', fontWeight: '700', fontSize: '0.9rem', color: 'var(--primary)', opacity: 0.8 }}>
                                <Mail size={16} /> EMAIL ADDRESS
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ width: '100%', padding: '1rem 1.2rem', borderRadius: '15px', border: '1px solid var(--border)', background: 'var(--bg)', fontSize: '1rem' }}
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                        <div style={{ marginBottom: '2.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem', fontWeight: '700', fontSize: '0.9rem', color: 'var(--primary)', opacity: 0.8 }}>
                                <Lock size={16} /> PASSWORD
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ width: '100%', padding: '1rem 1.2rem', borderRadius: '15px', border: '1px solid var(--border)', background: 'var(--bg)', fontSize: '1rem' }}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1.2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.8rem' }}>
                            Sign In <ArrowRight size={18} />
                        </button>
                    </form>

                    <div style={{ marginTop: '2.5rem', textAlign: 'center', paddingTop: '2.5rem', borderTop: '1px solid var(--border)' }}>
                        <p style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>
                            Don't have an account? <Link to="/register" style={{ color: 'var(--accent)', fontWeight: '800' }}>Create one for free</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
