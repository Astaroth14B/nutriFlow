import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Star, Info, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const fallbackMeals = [
    {
        _id: '609d220a2e3b2a2b9c3f4a11',
        name: 'Grilled Salmon with Quinoa',
        description: 'Wild-caught salmon rich in Omega-3s served over a bed of fluffy quinoa and steamed asparagus.',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=800',
        calories: 450,
        protein: 42,
        carbs: 35,
        fat: 18,
        price: 24.99,
        tags: ['High Protein', 'Gluten-Free', 'Pescatarian']
    },
    {
        _id: '609d220a2e3b2a2b9c3f4a12',
        name: 'Vegan Buddha Bowl',
        description: 'A deeply nourishing bowl of sweet potatoes, chickpeas, kale, avocado, and a tahini drizzle.',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
        calories: 380,
        protein: 15,
        carbs: 55,
        fat: 14,
        price: 18.99,
        tags: ['Vegan', 'High Fiber']
    },
    {
        _id: '609d220a2e3b2a2b9c3f4a13',
        name: 'Keto Grass-Fed Steak',
        description: 'Premium grass-fed sirloin steak paired with garlic butter broccoli and cauliflower mash.',
        image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=800',
        calories: 520,
        protein: 55,
        carbs: 12,
        fat: 32,
        price: 29.99,
        tags: ['Keto', 'High Protein']
    },
    {
        _id: '609d220a2e3b2a2b9c3f4a14',
        name: 'Mediterranean Chicken Salad',
        description: 'Grilled lemon-herb chicken breast over mixed greens, kalamata olives, feta cheese, and cucumber.',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
        calories: 410,
        protein: 38,
        carbs: 22,
        fat: 20,
        price: 21.99,
        tags: ['Low Carb', 'Mediterranean']
    }
];

const Meals = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ordering, setOrdering] = useState(null); // stores ID of meal being ordered successfully

    useEffect(() => {
        const fetchMeals = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/meals');
                if (res.data && res.data.length > 0) {
                    setMeals(res.data);
                } else {
                    setMeals(fallbackMeals);
                }
            } catch (err) {
                console.error('Failed to fetch meals, using fallback data.', err);
                setMeals(fallbackMeals);
            } finally {
                setLoading(false);
            }
        };
        fetchMeals();
    }, []);

    const handleOrder = async (meal) => {
        if (!user) {
            alert('Please log in to order meals.');
            navigate('/login');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const orderData = {
                meals: [{ meal: meal._id, quantity: 1 }],
                totalAmount: meal.price,
                address: 'Default Profile Address' // Could be expanded later
            };

            await axios.post('http://localhost:5000/api/orders', orderData, {
                headers: { 'x-auth-token': token }
            });

            setOrdering(meal._id);
            setTimeout(() => {
                setOrdering(null);
                navigate('/dashboard');
            }, 1500);

        } catch (err) {
            console.error('Order failed:', err);
            alert('Failed to place order. Please try again.');
        }
    };

    if (loading) return <div className="container" style={{ paddingTop: '160px' }}>Loading menu...</div>;

    return (
        <div style={{ padding: '160px 0', minHeight: '100vh', background: 'var(--bg-cream)' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '5rem', maxWidth: '800px', margin: '0 auto 5rem' }}>
                    <div style={{ display: 'inline-block', padding: '0.4rem 1.2rem', background: 'white', borderRadius: '50px', border: '1px solid var(--border)', marginBottom: '1.5rem', fontWeight: '600', color: 'var(--accent)', fontSize: '0.9rem' }}>
                        PRE-PREPARED MEALS
                    </div>
                    <h2 style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>Nutrition, <span className="text-accent">Delivered.</span></h2>
                    <p style={{ color: 'var(--text-light)', fontSize: '1.2rem' }}>Chef-crafted meals designed by our clinical team to fuel your body. Explore our scientifically balanced menu below.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
                    {meals.map((meal) => (
                        <div key={meal._id} className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%', border: 'none' }}>
                            <div style={{ position: 'relative', height: '240px' }}>
                                <img src={meal.image} alt={meal.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', padding: '0.4rem 1rem', borderRadius: '50px', fontWeight: '800', color: 'var(--primary)', boxShadow: 'var(--shadow-sm)' }}>
                                    ${meal.price.toFixed(2)}
                                </div>
                            </div>

                            <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                                    {meal.tags && meal.tags.map((tag, idx) => (
                                        <span key={idx} style={{ background: 'var(--bg-cream)', color: 'var(--accent)', padding: '0.3rem 0.8rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: '800', border: '1px solid var(--border)' }}>
                                            {tag.toUpperCase()}
                                        </span>
                                    ))}
                                </div>

                                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.8rem', color: 'var(--primary)', lineHeight: '1.3' }}>{meal.name}</h3>
                                <p style={{ color: 'var(--text-light)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem', flex: 1 }}>{meal.description}</p>

                                <div style={{ background: 'var(--bg-cream)', padding: '1.2rem', borderRadius: '15px', marginBottom: '2rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.8rem' }}>
                                        <span style={{ fontWeight: '800', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Info size={16} className="text-accent" /> Nutrition Facts</span>
                                        <span style={{ fontWeight: '800', color: 'var(--accent)' }}>{meal.calories} kcal</span>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
                                        <div>
                                            <div style={{ color: 'var(--text-light)', fontSize: '0.8rem', fontWeight: '600' }}>PROTEIN</div>
                                            <div style={{ fontWeight: '800', color: 'var(--primary)' }}>{meal.protein}g</div>
                                        </div>
                                        <div style={{ borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}>
                                            <div style={{ color: 'var(--text-light)', fontSize: '0.8rem', fontWeight: '600' }}>CARBS</div>
                                            <div style={{ fontWeight: '800', color: 'var(--primary)' }}>{meal.carbs}g</div>
                                        </div>
                                        <div>
                                            <div style={{ color: 'var(--text-light)', fontSize: '0.8rem', fontWeight: '600' }}>FAT</div>
                                            <div style={{ fontWeight: '800', color: 'var(--primary)' }}>{meal.fat}g</div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleOrder(meal)}
                                    disabled={ordering === meal._id}
                                    className="btn-primary"
                                    style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.8rem', padding: '1.2rem' }}
                                >
                                    {ordering === meal._id ? (
                                        <><CheckCircle2 size={20} /> Order Placed!</>
                                    ) : (
                                        <><ShoppingBag size={20} /> Order Now</>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Meals;
