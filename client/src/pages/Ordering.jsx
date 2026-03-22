import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Minus, ShoppingBag, Filter, Info } from 'lucide-react';

const Ordering = () => {
    const [meals, setMeals] = useState([]);
    const [cart, setCart] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const fetchMeals = async () => {
            const res = await axios.get('http://localhost:5000/api/meals');
            setMeals(res.data);
        };
        fetchMeals();
    }, []);

    const placeholderMeals = [
        { _id: '1', name: 'Mediterranean Salmon', description: 'Wild-caught salmon with lemon-herb quinoa and roasted baby asparagus.', price: 15, calories: 450, tags: ['High Protein', 'Gluten-Free'], image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=600' },
        { _id: '2', name: 'Zesty Buddha Bowl', description: 'Heirloom roasted sweet potato, maple chickpeas, and avocado-tahini crema.', price: 12, calories: 420, tags: ['Vegan', 'Plant-based'], image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600' },
        { _id: '3', name: 'Keto Power Plate', description: 'Grass-fed ribeye with creamed kale and walnut-pesto cauliflower rice.', price: 18, calories: 650, tags: ['Keto', 'Low-Carb'], image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600' },
        { _id: '4', name: 'Miso Glazed Tofu', description: 'Organic firm tofu with charred bok choy and ginger-infused forbidden rice.', price: 13, calories: 380, tags: ['Vegan', 'Heart Healthy'], image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=600' }
    ];

    const displayMeals = meals.length > 0 ? meals : placeholderMeals;

    const addToCart = (meal) => {
        const exists = cart.find(item => item._id === meal._id);
        if (exists) {
            setCart(cart.map(item => item._id === meal._id ? { ...item, quantity: item.quantity + 1 } : item));
        } else {
            setCart([...cart, { ...meal, quantity: 1 }]);
        }
    };

    const removeFromCart = (id) => {
        const item = cart.find(i => i._id === id);
        if (item.quantity > 1) {
            setCart(cart.map(i => i._id === id ? { ...i, quantity: i.quantity - 1 } : i));
        } else {
            setCart(cart.filter(i => i._id !== id));
        }
    };

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <div style={{ padding: '160px 0', minHeight: '100vh', background: 'var(--bg-cream)' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '5rem' }}>
                    <div>
                        <div style={{ display: 'inline-block', padding: '0.4rem 1.2rem', background: 'white', borderRadius: '50px', border: '1px solid var(--border)', marginBottom: '1.5rem', fontWeight: '600', color: 'var(--accent)', fontSize: '0.9rem' }}>
                            SEASONAL MENU
                        </div>
                        <h2 style={{ fontSize: '3.5rem' }}>Curate Your <span className="text-accent">Weekly Flow.</span></h2>
                        <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>Freshly prepared, balanced, and ready for your busy schedule.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button style={{
                            background: 'white', border: '1px solid var(--border)', padding: '0.8rem 1.5rem',
                            borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '0.8rem', fontWeight: '600'
                        }}>
                            <Filter size={18} /> Filter
                        </button>
                        {cart.length > 0 && (
                            <div className="glass" style={{ padding: '0.8rem 2rem', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '1.5rem', boxShadow: 'var(--shadow-md)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                    <ShoppingBag size={20} className="text-accent" />
                                    <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>${total}</span>
                                </div>
                                <button className="btn-primary" style={{ padding: '0.6rem 1.8rem', fontSize: '0.9rem' }}>Next Step</button>
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
                    {displayMeals.map(meal => (
                        <div key={meal._id} className="card" style={{ padding: '0', overflow: 'hidden', border: 'none', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ position: 'relative', height: '240px' }}>
                                <img src={meal.image} alt={meal.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{
                                    position: 'absolute', top: '20px', right: '20px',
                                    background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)',
                                    padding: '0.4rem 1rem', borderRadius: '50px', fontWeight: '800', fontSize: '0.85rem'
                                }}>
                                    {meal.calories} kcal
                                </div>
                            </div>
                            <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                                    <h3 style={{ fontSize: '1.4rem' }}>{meal.name}</h3>
                                    <span style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--accent)' }}>${meal.price}</span>
                                </div>
                                <p style={{ fontSize: '0.95rem', color: 'var(--text-light)', lineHeight: '1.6', marginBottom: '1.5rem', flex: 1 }}>{meal.description}</p>

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
                                    {meal.tags.map((t, idx) => (
                                        <span key={idx} style={{
                                            fontSize: '0.75rem', fontWeight: '700',
                                            background: 'var(--bg-cream)', color: 'var(--primary)',
                                            padding: '0.3rem 0.8rem', borderRadius: '50px', border: '1px solid var(--border)'
                                        }}>{t}</span>
                                    ))}
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <button style={{
                                        width: '45px', height: '45px', borderRadius: '15px', background: 'var(--bg-cream)',
                                        display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid var(--border)'
                                    }}>
                                        <Info size={18} className="text-light" />
                                    </button>

                                    {cart.find(i => i._id === meal._id) ? (
                                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 1.2rem', background: 'var(--bg-cream)', borderRadius: '18px', border: '2px solid var(--accent)' }}>
                                            <button onClick={() => removeFromCart(meal._id)} style={{ color: 'var(--accent)' }}><Minus size={18} strokeWidth={3} /></button>
                                            <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>{cart.find(i => i._id === meal._id).quantity}</span>
                                            <button onClick={() => addToCart(meal)} style={{ color: 'var(--accent)' }}><Plus size={18} strokeWidth={3} /></button>
                                        </div>
                                    ) : (
                                        <button onClick={() => addToCart(meal)} className="btn-primary" style={{ flex: 1, borderRadius: '18px' }}>Add to Plan</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Ordering;
