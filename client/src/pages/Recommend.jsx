import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

const Recommend = () => {
    const [step, setStep] = useState(1);
    const [prefs, setPrefs] = useState({ goals: [], restrictions: [], preferences: [], height: '', weight: '', allergies: '' });
    const navigate = useNavigate();

    const handleToggle = (category, value) => {
        const current = prefs[category];
        if (current.includes(value)) {
            setPrefs({ ...prefs, [category]: current.filter(v => v !== value) });
        } else {
            setPrefs({ ...prefs, [category]: [...current, value] });
        }
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/recs/preferences', prefs, {
                headers: { 'x-auth-token': token }
            });
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
        }
    };

    const steps = [
        { title: 'Your Goals', options: ['Weight Loss', 'Muscle Gain', 'Healthy Living', 'Performance'] },
        { title: 'Restrictions', options: ['Vegan', 'Keto', 'Gluten-Free', 'Dairy-Free', 'Low-Carb', 'Paleo'] },
        { title: 'Preferences', options: ['High Protein', 'Fast Prep', 'Spicy', 'Kid-Friendly'] },
        { title: 'Personal Details', options: [] },
    ];

    return (
        <div style={{ padding: '160px 0', minHeight: '100vh', background: 'var(--bg-cream)' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <div style={{ display: 'inline-block', padding: '0.4rem 1.2rem', background: 'white', borderRadius: '50px', border: '1px solid var(--border)', marginBottom: '1.5rem', fontWeight: '600', color: 'var(--accent)', fontSize: '0.9rem' }}>
                        PHASE {step} <span style={{ color: 'var(--text-light)', margin: '0 0.5rem' }}>•</span> PERSONALIZATION
                    </div>
                    <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Let's build your <span className="text-accent">ideal plan.</span></h1>
                    <p style={{ color: 'var(--text-light)' }}>Our staff uses this data to curate your personalized menu.</p>
                </div>

                <div className="card" style={{ border: 'none', background: 'white' }}>
                    {/* Progress Bar */}
                    <div style={{ marginBottom: '4rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            {steps.map((s, idx) => (
                                <span key={idx} style={{
                                    fontSize: '0.85rem', fontWeight: '600',
                                    color: step >= idx + 1 ? 'var(--accent)' : 'var(--text-light)',
                                    opacity: step >= idx + 1 ? 1 : 0.6
                                }}>
                                    {s.title}
                                </span>
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} style={{
                                    height: '6px', flex: 1,
                                    background: step >= i ? 'var(--accent)' : 'var(--border)',
                                    borderRadius: '10px', transition: 'all 0.5s ease'
                                }}></div>
                            ))}
                        </div>
                    </div>

                    {/* Options Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.2rem', marginBottom: '4rem' }}>
                        {step === 1 && steps[0].options.map(item => (
                            <button
                                key={item}
                                onClick={() => handleToggle('goals', item)}
                                style={{
                                    padding: '2rem 1.5rem', borderRadius: '24px', textAlign: 'center',
                                    border: '2px solid',
                                    borderColor: prefs.goals.includes(item) ? 'var(--accent)' : 'transparent',
                                    background: prefs.goals.includes(item) ? 'var(--bg-cream)' : 'var(--bg)',
                                    boxShadow: 'var(--shadow-sm)', transition: 'all 0.3s ease'
                                }}
                            >
                                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: prefs.goals.includes(item) ? 'var(--accent)' : 'var(--primary)' }}>{item}</div>
                                {prefs.goals.includes(item) && <CheckCircle2 size={16} style={{ marginTop: '0.5rem' }} className="text-accent" />}
                            </button>
                        ))}
                        {step === 2 && steps[1].options.map(item => (
                            <button
                                key={item}
                                onClick={() => handleToggle('restrictions', item)}
                                style={{
                                    padding: '2rem 1.5rem', borderRadius: '24px', textAlign: 'center',
                                    border: '2px solid',
                                    borderColor: prefs.restrictions.includes(item) ? 'var(--accent)' : 'transparent',
                                    background: prefs.restrictions.includes(item) ? 'var(--bg-cream)' : 'var(--bg)',
                                    boxShadow: 'var(--shadow-sm)', transition: 'all 0.3s ease'
                                }}
                            >
                                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: prefs.restrictions.includes(item) ? 'var(--accent)' : 'var(--primary)' }}>{item}</div>
                                {prefs.restrictions.includes(item) && <CheckCircle2 size={16} style={{ marginTop: '0.5rem' }} className="text-accent" />}
                            </button>
                        ))}
                        {step === 3 && steps[2].options.map(item => (
                            <button
                                key={item}
                                onClick={() => handleToggle('preferences', item)}
                                style={{
                                    padding: '2rem 1.5rem', borderRadius: '24px', textAlign: 'center',
                                    border: '2px solid',
                                    borderColor: prefs.preferences.includes(item) ? 'var(--accent)' : 'transparent',
                                    background: prefs.preferences.includes(item) ? 'var(--bg-cream)' : 'var(--bg)',
                                    boxShadow: 'var(--shadow-sm)', transition: 'all 0.3s ease'
                                }}
                            >
                                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: prefs.preferences.includes(item) ? 'var(--accent)' : 'var(--primary)' }}>{item}</div>
                                {prefs.preferences.includes(item) && <CheckCircle2 size={16} style={{ marginTop: '0.5rem' }} className="text-accent" />}
                            </button>
                        ))}
                        {step === 4 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
                                <div style={{ background: 'var(--bg-cream)', padding: '2rem', borderRadius: '24px', boxShadow: 'var(--shadow-sm)' }}>
                                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Additional Info</h3>
                                    
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--primary)' }}>Height</label>
                                        <input type="text" value={prefs.height} onChange={(e) => setPrefs({ ...prefs, height: e.target.value })} placeholder="e.g. 5' 9&quot; or 175cm" style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: '1px solid var(--border)', fontSize: '1rem' }} />
                                    </div>
                                    
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--primary)' }}>Weight</label>
                                        <input type="text" value={prefs.weight} onChange={(e) => setPrefs({ ...prefs, weight: e.target.value })} placeholder="e.g. 165 lbs or 75kg" style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: '1px solid var(--border)', fontSize: '1rem' }} />
                                    </div>
                                    
                                    <div>
                                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--primary)' }}>Allergies</label>
                                        <input type="text" value={prefs.allergies} onChange={(e) => setPrefs({ ...prefs, allergies: e.target.value })} placeholder="e.g. Peanuts, Shellfish (comma separated)" style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: '1px solid var(--border)', fontSize: '1rem' }} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {step > 1 ? (
                            <button onClick={() => setStep(step - 1)} style={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-light)' }}>
                                <ArrowLeft size={18} /> Previous
                            </button>
                        ) : <div />}

                        {step < 4 ? (
                            <button onClick={() => setStep(step + 1)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                Next Step <ArrowRight size={18} />
                            </button>
                        ) : (
                            <button onClick={() => {
                                const formattedPrefs = { ...prefs, allergies: prefs.allergies ? prefs.allergies.split(',').map(s => s.trim()) : [] };
                                // Temporarily hack handleSubmit logic
                                const handleSubmitLocal = async () => {
                                    try {
                                        const token = localStorage.getItem('token');
                                        await axios.post('http://localhost:5000/api/recs/preferences', formattedPrefs, {
                                            headers: { 'x-auth-token': token }
                                        });
                                        window.location.href = '/dashboard';
                                    } catch (err) {
                                        console.error(err);
                                    }
                                };
                                handleSubmitLocal();
                            }} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                Complete Setup <CheckCircle2 size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Recommend;
