import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User as UserIcon, Mail, Lock, ArrowRight } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData.name, formData.email, formData.password);
            navigate('/recommend');
        } catch (err) {
            const errorMsg = err.response && err.response.data && (err.response.data.msg || (err.response.data.errors && err.response.data.errors[0].msg));
            alert(errorMsg || err.response?.data || 'Registration failed: ' + err.message);
        }
    };

    return (
        <div style={{ padding: '160px 0', minHeight: '100vh', background: 'var(--bg-cream)', display: 'flex', alignItems: 'center' }}>
            <div className="container" style={{ maxWidth: '500px' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Get Started</h2>
                    <p style={{ color: 'var(--text-light)' }}>Your journey to optimized health begins here.</p>
                </div>

                <div className="card" style={{ padding: '3.5rem', border: 'none' }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem', fontWeight: '700', fontSize: '0.9rem', color: 'var(--primary)', opacity: 0.8 }}>
                                <UserIcon size={16} /> FULL NAME
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                style={{ width: '100%', padding: '1rem 1.2rem', borderRadius: '15px', border: '1px solid var(--border)', background: 'var(--bg)', fontSize: '1rem' }}
                                placeholder="Jane Doe"
                                required
                            />
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem', fontWeight: '700', fontSize: '0.9rem', color: 'var(--primary)', opacity: 0.8 }}>
                                <Mail size={16} /> EMAIL ADDRESS
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                style={{ width: '100%', padding: '1rem 1.2rem', borderRadius: '15px', border: '1px solid var(--border)', background: 'var(--bg)', fontSize: '1rem' }}
                                placeholder="jane@example.com"
                                required
                            />
                        </div>
                        <div style={{ marginBottom: '2.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem', fontWeight: '700', fontSize: '0.9rem', color: 'var(--primary)', opacity: 0.8 }}>
                                <Lock size={16} /> PASSWORD
                            </label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                style={{ width: '100%', padding: '1rem 1.2rem', borderRadius: '15px', border: '1px solid var(--border)', background: 'var(--bg)', fontSize: '1rem' }}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1.2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.8rem' }}>
                            Create Account <ArrowRight size={18} />
                        </button>
                    </form>

                    <div style={{ marginTop: '2.5rem', textAlign: 'center', paddingTop: '2.5rem', borderTop: '1px solid var(--border)' }}>
                        <p style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>
                            Already have an account? <Link to="/login" style={{ color: 'var(--accent)', fontWeight: '800' }}>Sign In</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
