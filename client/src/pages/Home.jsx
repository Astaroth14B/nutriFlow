import React from 'react';
import { Link } from 'react-router-dom';
import mealsImg from '../assets/meals.png';
import { Leaf, Apple, ShieldCheck, Truck } from 'lucide-react';

const Home = () => {
    return (
        <div className="home-page">
            {/* Hero Section */}
            {/* Hero Section */}
            <section className="hero" style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                background: 'var(--bg-cream)',
                paddingTop: '120px',
                paddingBottom: '80px'
            }}>
                <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'center' }}>
                    <div className="fade-in-up">
                        <span className="text-accent" style={{ fontWeight: '700', letterSpacing: '0.1rem', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '1rem', display: 'block' }}>
                            Modern Nutrition for Modern Living
                        </span>
                        <h1 style={{ fontSize: '4.8rem', color: 'var(--primary)', lineHeight: '1.05', marginBottom: '1.5rem' }}>
                            Your Health, <br /> <span className="text-accent">Simplified.</span>
                        </h1>
                        <p style={{ fontSize: '1.3rem', color: 'var(--text-light)', marginBottom: '3rem', maxWidth: '550px' }}>
                            Chef-crafted meals designed by clinical doctors and culinary experts to fuel your body and nourish your mind. Freshly prepared, scientifically balanced, and delivered to your door.
                        </p>
                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                            <Link to="/recommend" className="btn-primary">Start Your Consultation</Link>
                            <Link to="/plans" className="btn-outline">Explore Plans</Link>
                        </div>
                    </div>
                    <div className="fade-in-up" style={{ position: 'relative' }}>
                        <div style={{
                            position: 'absolute', top: '-10%', left: '-10%', width: '120%', height: '120%',
                            background: 'var(--accent)', opacity: 0.05, borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
                            zIndex: 0
                        }}></div>
                        <img src={mealsImg} alt="Fresh Meals" style={{
                            width: '100%', borderRadius: '40px', boxShadow: 'var(--shadow-lg)',
                            position: 'relative', zIndex: 1, transform: 'rotate(2deg)'
                        }} />
                    </div>
                </div>
            </section>

            {/* Value Proposition */}
            <section className="section-padding" style={{ background: 'white' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
                        <h2 style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Designed for Your Success</h2>
                        <p style={{ maxWidth: '700px', margin: '0 auto', color: 'var(--text-light)', fontSize: '1.1rem' }}>
                            We combine culinary expertise with nutritional science to provide a meal subscription that actually works for your lifestyle.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem' }}>
                        {[
                            { title: 'Clinical Precision', desc: 'Every meal is reviewed by top doctors and chefs for optimal macro and micro-nutrient balance.', icon: <Apple className="text-accent" size={32} /> },
                            { title: 'Chef-Crafted', desc: 'Zero preservatives, zero artificial additives. Just real food prepared by industry-leading chefs.', icon: <Leaf className="text-accent" size={32} /> },
                            { title: 'Always Fresh', desc: 'Never frozen. Our meals are delivered chilled to maintain nutrient density and flavor profile.', icon: <ShieldCheck className="text-accent" size={32} /> },
                            { title: 'Flexible Delivery', desc: 'Manage your schedule with ease. Skip, pauze, or cancel your subscription at any time.', icon: <Truck className="text-accent" size={32} /> }
                        ].map((item, idx) => (
                            <div key={idx} className="card" style={{ textAlign: 'center' }}>
                                <div style={{
                                    width: '70px', height: '70px', borderRadius: '20px',
                                    background: 'var(--bg-cream)', display: 'flex',
                                    justifyContent: 'center', alignItems: 'center',
                                    margin: '0 auto 2rem'
                                }}>
                                    {item.icon}
                                </div>
                                <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>{item.title}</h3>
                                <p style={{ color: 'var(--text-light)' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section style={{ padding: '6rem 0', background: 'var(--accent)', color: 'white', textAlign: 'center' }}>
                <div className="container">
                    <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', color: 'white' }}>Ready to Flow?</h2>
                    <p style={{ fontSize: '1.2rem', marginBottom: '3rem', opacity: 0.9 }}>Join 10,000+ members achieving their health goals with NutriFlow.</p>
                    <Link to="/register" style={{ background: 'white', color: 'var(--accent)', padding: '1.2rem 3rem', borderRadius: '50px', fontWeight: '700', fontSize: '1.1rem' }}>
                        Get Started Today
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
