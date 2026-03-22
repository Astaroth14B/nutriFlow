import React, { useState } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '../context/AuthContext';
import { Check, Zap } from 'lucide-react';

const stripePromise = loadStripe('pk_test_... (placeholder)');

const Plans = () => {
    const { user } = useAuth();

    const [showModal, setShowModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [paymentDetails, setPaymentDetails] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubscribe = (planId) => {
        if (!user) return alert('Please login first');
        setSelectedPlan(planId);
        setShowModal(true);
        setPaymentMethod('');
        setPaymentDetails('');
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        
        let requiredLength = (paymentMethod === 'E-Sewa') ? 10 : 16;
        if (paymentDetails.replace(/\D/g,'').length !== requiredLength) {
            return alert(`Invalid detail length. ${paymentMethod} requires ${requiredLength} digits to process.`);
        }

        setIsProcessing(true);
        setTimeout(async () => {
            try {
                const token = localStorage.getItem('token');
                await axios.post('http://localhost:5000/api/subs/mock-subscribe', 
                    { plan: selectedPlan, method: paymentMethod, details: paymentDetails },
                    { headers: { 'x-auth-token': token } }
                );
                
                // Force push to dashboard to see active plan
                window.location.href = '/dashboard';
            } catch (err) {
                console.error(err);
                alert('Payment processing failed');
            } finally {
                setIsProcessing(false);
            }
        }, 1500); // Simulate network delay
    };

    const plans = [
        {
            id: 'monthly',
            name: 'Essential Flow',
            price: '$100',
            period: '/month',
            desc: 'Perfect for building a baseline of healthy habits.',
            features: ['4 Premium Meals/Week', 'Community Support', 'Macro Breakdown', 'Eco-Delivery']
        },
        {
            id: 'yearly',
            name: 'Elite Lifestyle',
            price: '$900',
            period: '/year',
            desc: 'The ultimate commitment to your long-term wellness.',
            features: ['4 Premium Meals/Week', '1-on-1 Dietitian Support', 'Bio-marker Analysis', 'VIP Priority Delivery', '2 Months Free'],
            popular: true
        }
    ];

    return (
        <div style={{ padding: '160px 0', minHeight: '100vh', background: 'var(--bg-cream)' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '6rem', maxWidth: '700px', margin: '0 auto 6rem' }}>
                    <div style={{ display: 'inline-block', padding: '0.4rem 1.2rem', background: 'white', borderRadius: '50px', border: '1px solid var(--border)', marginBottom: '1.5rem', fontWeight: '600', color: 'var(--accent)', fontSize: '0.9rem' }}>
                        PRICING & PLANS
                    </div>
                    <h2 style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>Invest in your <span className="text-accent">future self.</span></h2>
                    <p style={{ color: 'var(--text-light)', fontSize: '1.2rem' }}>Every dollar invested in your nutrition is a dollar saved in future healthcare. Choose the plan that fits your growth.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', maxWidth: '1100px', margin: '0 auto' }}>
                    {plans.map((plan) => (
                        <div key={plan.id} className="card" style={{
                            padding: '4rem 3rem',
                            borderRadius: '40px',
                            position: 'relative',
                            border: plan.popular ? '2px solid var(--accent)' : '1px solid var(--border)',
                            background: 'white',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            {plan.popular && (
                                <div style={{
                                    position: 'absolute', top: '24px', left: '24px',
                                    background: 'var(--accent)', color: 'white',
                                    padding: '0.4rem 1.2rem', borderRadius: '50px',
                                    fontSize: '0.85rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.4rem'
                                }}>
                                    <Zap size={14} fill="white" /> RECOMMENDED
                                </div>
                            )}

                            <div style={{ marginTop: plan.popular ? '2rem' : '0' }}>
                                <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{plan.name}</h3>
                                <p style={{ color: 'var(--text-light)', fontSize: '1rem', marginBottom: '2rem' }}>{plan.desc}</p>
                            </div>

                            <div style={{ marginBottom: '2.5rem' }}>
                                <span style={{ fontSize: '3.8rem', fontWeight: '800', color: 'var(--primary)' }}>{plan.price}</span>
                                <span style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>{plan.period}</span>
                            </div>

                            <div style={{ width: '100%', height: '1px', background: 'var(--border)', marginBottom: '2.5rem' }}></div>

                            <ul style={{ marginBottom: '3.5rem', flex: 1 }}>
                                {plan.features.map((f, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem', fontSize: '1.05rem' }}>
                                        <div style={{
                                            width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(139, 168, 136, 0.1)',
                                            display: 'flex', justifyContent: 'center', alignItems: 'center'
                                        }}>
                                            <Check size={14} color="var(--accent)" strokeWidth={3} />
                                        </div>
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleSubscribe(plan.id)}
                                className={plan.popular ? "btn-primary" : "btn-outline"}
                                style={{
                                    width: '100%', padding: '1.2rem', borderRadius: '20px',
                                    fontSize: '1.1rem', fontWeight: '700'
                                }}
                            >
                                Get Started
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Dummy Payment Modal overlay */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
                    <div className="card" style={{ width: '100%', maxWidth: '500px', background: 'white', border: 'none', position: 'relative' }}>
                        <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-light)' }}>&times;</button>
                        
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <Zap size={40} color="var(--accent)" style={{ marginBottom: '1rem' }} />
                            <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Secure Checkout</h3>
                            <p style={{ color: 'var(--text-light)' }}>Select a dummy payment method to complete simulation.</p>
                        </div>

                        {!paymentMethod ? (
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {['Credit Card', 'Mastercard', 'PayPal', 'E-Sewa'].map(method => (
                                    <button 
                                        key={method}
                                        onClick={() => setPaymentMethod(method)}
                                        style={{ padding: '1.2rem', borderRadius: '15px', border: '2px solid var(--border)', background: 'var(--bg-cream)', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s', color: 'var(--text)' }}
                                    >
                                        {method} <span style={{ color: 'var(--accent)' }}>&rarr;</span>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <form onSubmit={handlePaymentSubmit}>
                                <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--bg-cream)', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 'bold' }}>{paymentMethod}</span>
                                    <button type="button" onClick={() => setPaymentMethod('')} style={{ background: 'transparent', border: 'none', color: 'var(--text-light)', cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline' }}>Change</button>
                                </div>
                                <div style={{ marginBottom: '2rem' }}>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>{paymentMethod === 'E-Sewa' ? 'Enter 10-digit Mobile Number' : 'Enter 16-digit Card Number'}</label>
                                    <input 
                                        type="text" 
                                        value={paymentDetails}
                                        onChange={e => setPaymentDetails(e.target.value)}
                                        placeholder={paymentMethod === 'E-Sewa' ? '98XXXXXXXX' : 'XXXX XXXX XXXX XXXX'}
                                        required
                                        autoFocus
                                        style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: '2px solid var(--border)', fontSize: '1.2rem', letterSpacing: '2px' }}
                                    />
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>* {paymentMethod === 'E-Sewa' ? 'Must be exactly 10 digits' : 'Must be exactly 16 digits'} to simulate success.</p>
                                </div>
                                <button type="submit" className="btn-primary" disabled={isProcessing} style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                                    {isProcessing ? 'Processing Transaction...' : 'Confirm Payment'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Plans;
