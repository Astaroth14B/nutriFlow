import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Calendar, Package, CreditCard, ArrowRight, Settings } from 'lucide-react';

import AdminDashboard from './AdminDashboard';

const Dashboard = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [ppUrl, setPpUrl] = useState('');
    const [isEditingPp, setIsEditingPp] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/orders', {
                    headers: { 'x-auth-token': token }
                });
                setOrders(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (user && user.role !== 'admin') fetchOrders();
    }, [user]);

    const handlePpSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:5000/api/auth/profile-picture', { url: ppUrl }, {
                headers: { 'x-auth-token': token }
            });
            window.location.reload(); // Reload to fetch fresh user data including PP
        } catch (err) {
            console.error('Failed to update Profile Picture', err);
            alert('Failed to update profile picture.');
        }
    };

    if (!user) return <div style={{ paddingTop: '160px' }} className="container">Please login to view dashboard</div>;
    
    if (user.role === 'admin') return <AdminDashboard />;

    return (
        <div style={{ padding: '160px 0', minHeight: '100vh', background: 'var(--bg-cream)' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
                    <div>
                        <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>Welcome back, <span className="text-accent">{user.name.split(' ')[0]}</span>.</h1>
                        <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>Your personalized nutrition journey is on track.</p>
                    </div>
                    <button style={{
                        background: 'white', border: '1px solid var(--border)',
                        padding: '0.8rem 1.5rem', borderRadius: '15px',
                        display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: '600'
                    }}>
                        <Settings size={18} /> Account Settings
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2.5rem' }}>
                    {/* Sidebar / Profile Card */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className="card" style={{ padding: '2.5rem', border: 'none' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div 
                                    onClick={() => setIsEditingPp(!isEditingPp)}
                                    style={{
                                    width: '80px', height: '80px', borderRadius: '50%', background: user.profilePicture ? `url(${user.profilePicture}) center/cover` : 'var(--accent)',
                                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: '800', border: '3px solid white', boxShadow: '0 8px 16px rgba(0,0,0,0.1)', cursor: 'pointer', position: 'relative'
                                }}>
                                    {!user.profilePicture && user.name.charAt(0)}
                                    <div style={{ position: 'absolute', bottom: -5, right: -5, background: 'var(--primary)', padding: '0.4rem', borderRadius: '50%', display: 'flex' }}>
                                        <Settings size={12} color="white" />
                                    </div>
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>{user.name}</h3>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 'bold' }}>{user.role.toUpperCase()} PROFILE</p>
                                </div>
                            </div>

                            {isEditingPp && (
                                <form onSubmit={handlePpSubmit} style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <input type="file" accept="image/*" onChange={async (e) => {
                                            if (e.target.files[0]) {
                                                const formData = new FormData();
                                                formData.append('image', e.target.files[0]);
                                                try {
                                                    const res = await axios.post('http://localhost:5000/api/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                                                    setPpUrl(res.data.url);
                                                } catch (err) {
                                                    alert('Upload failed');
                                                }
                                            }
                                        }} style={{ flex: 1, padding: '0.6rem 1rem', borderRadius: '50px', border: '1px solid var(--border)', fontSize: '0.85rem', background: 'white' }} />
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <input type="url" placeholder="Or paste image URL..." value={ppUrl} onChange={e => setPpUrl(e.target.value)} required style={{ flex: 1, padding: '0.6rem 1rem', borderRadius: '50px', border: '1px solid var(--border)', fontSize: '0.85rem' }} />
                                        <button type="submit" className="btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>Save</button>
                                    </div>
                                </form>
                            )}

                            <div style={{ marginBottom: '3rem' }}>
                                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.1rem', marginBottom: '1.2rem' }}>Active Subscription</h4>
                                {user.subscription?.active ? (
                                    <div style={{ background: 'linear-gradient(135deg, var(--accent) 0%, #009955 100%)', padding: '1.8rem', borderRadius: '20px', color: 'white', boxShadow: '0 10px 30px rgba(0, 230, 118, 0.3)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem', borderRadius: '12px' }}>
                                                    <CreditCard size={24} color="white" />
                                                </div>
                                                <span style={{ fontWeight: '800', fontSize: '1.4rem', letterSpacing: '1px' }}>{user.subscription.plan.toUpperCase()}</span>
                                            </div>
                                            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.3rem 0.8rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 'bold' }}>ACTIVE</div>
                                        </div>
                                        <div style={{ fontSize: '0.9rem', opacity: 0.9, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '1rem' }}>
                                            <span>Expires On</span>
                                            <span style={{ fontWeight: 'bold' }}>{new Date(user.subscription.expiresAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ background: 'var(--bg-cream)', padding: '2rem', borderRadius: '20px', border: '1px dashed var(--border)', textAlign: 'center' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'white', color: 'var(--text-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}><Package size={20} /></div>
                                        <p style={{ color: 'var(--text-light)', marginBottom: '1rem', fontSize: '0.95rem' }}>No active subscription plan found.</p>
                                        <button onClick={() => window.location.href='/plans'} className="btn-primary" style={{ width: '100%' }}>View Meal Plans</button>
                                    </div>
                                )}
                            </div>

                            <div>
                                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.1rem', marginBottom: '1.2rem' }}>Your Goals</h4>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {user.dietaryPreferences?.goals?.map((g, i) => (
                                        <span key={i} style={{
                                            background: 'white', border: '1px solid var(--accent)',
                                            color: 'var(--accent)', padding: '0.4rem 1rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: '700'
                                        }}>{g}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content / History */}
                    <div className="card" style={{ padding: '3rem', border: 'none' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                            <h3 style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                <Package size={24} className="text-accent" /> Order History
                            </h3>
                            <button style={{ color: 'var(--accent)', fontWeight: '700', fontSize: '0.9rem' }}>Show All</button>
                        </div>

                        {loading ? (
                            <div style={{ padding: '4rem', textAlign: 'center' }}>Loading your history...</div>
                        ) : orders.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                {orders.map(order => (
                                <div key={order._id} style={{ border: '1px solid var(--border)', borderRadius: '24px', overflow: 'hidden', transition: 'all 0.3s ease' }} className="hover:border-accent">
                                    <div onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)} style={{
                                        padding: '1.8rem', background: expandedOrder === order._id ? 'var(--bg-cream)' : 'white', cursor: 'pointer',
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                    }}>
                                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                            <div style={{ width: '50px', height: '50px', borderRadius: '15px', background: expandedOrder === order._id ? 'white' : 'var(--bg-cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
                                                <Package size={20} className="text-accent" />
                                            </div>
                                            <div>
                                                <p style={{ fontWeight: '700', fontSize: '1.1rem' }}>Order #{order._id.slice(-6).toUpperCase()}</p>
                                                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontWeight: '800', fontSize: '1.2rem', marginBottom: '0.3rem' }}>${order.totalAmount}</div>
                                            <span style={{
                                                padding: '0.3rem 1rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: '800',
                                                background: order.status === 'delivered' ? 'rgba(139, 168, 136, 0.1)' : 'rgba(255, 193, 7, 0.1)',
                                                color: order.status === 'delivered' ? 'var(--accent)' : '#b7791f'
                                            }}>
                                                {order.status.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {expandedOrder === order._id && (
                                        <div style={{ padding: '2rem', borderTop: '1px solid var(--border)', background: 'white' }}>
                                            <h4 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>Order Contents</h4>
                                            {order.meals && order.meals.length > 0 ? (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                    {order.meals.map((item, idx) => (
                                                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-cream)', padding: '1rem', borderRadius: '15px' }}>
                                                            {item.meal?.image && <img src={item.meal.image} alt="Meal" style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover' }} />}
                                                            <div style={{ flex: 1 }}>
                                                                <h5 style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>{item.meal?.name || 'Chef-Prepared Meal'}</h5>
                                                                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Qty: {item.quantity}</p>
                                                            </div>
                                                            <div style={{ fontWeight: 'bold', color: 'var(--accent)' }}>
                                                                ${item.meal?.price ? (item.meal.price * item.quantity).toFixed(2) : order.totalAmount}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '1.1rem' }}>
                                                        <span>Total Paid:</span>
                                                        <span>${order.totalAmount}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p style={{ color: 'var(--text-light)' }}>No specific meal details available for this legacy order.</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'var(--bg-cream)', borderRadius: '32px' }}>
                                <Package size={48} style={{ color: 'var(--border)', marginBottom: '1.5rem' }} />
                                <h4 style={{ marginBottom: '1rem' }}>No orders found</h4>
                                <p style={{ color: 'var(--text-light)', marginBottom: '2.5rem' }}>Start your journey by selecting your first personalized meal plan.</p>
                                <button onClick={() => window.location.href='/meals'} className="btn-primary">Browse The Menu</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
