import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Users, UserPlus, FileText, CheckCircle2, ChevronDown, Coffee, Trash2 } from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('users'); // 'users', 'staff' or 'meals'
    const [usersList, setUsersList] = useState([]);
    const [staffList, setStaffList] = useState([]);
    const [mealsList, setMealsList] = useState([]);
    const [expandedUser, setExpandedUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Add Staff Form State
    const [staffForm, setStaffForm] = useState({ fullName: '', role: 'Doctor', credentials: '', bio: '', specialties: '', photo: '', certificateUrl: '' });
    const [addingStaff, setAddingStaff] = useState(false);

    // Add Meal Form State
    const [mealForm, setMealForm] = useState({ name: '', description: '', image: '', calories: '', protein: '', carbs: '', fat: '', price: '', tags: '' });
    const [addingMeal, setAddingMeal] = useState(false);
    const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);

    const PREDEFINED_TAGS = [
        'Vegan', 'Keto', 'Gluten-Free', 'Dairy-Free', 'Low-Carb', 'Paleo', 
        'High Protein', 'Pescatarian', 'High Fiber', 'Mediterranean', 
        'Weight Loss', 'Muscle Gain', 'Healthy Living', 'Performance'
    ];

    const toggleTag = (tag) => {
        let currentTags = mealForm.tags ? mealForm.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
        if (currentTags.includes(tag)) {
            currentTags = currentTags.filter(t => t !== tag);
        } else {
            currentTags.push(tag);
        }
        setMealForm({ ...mealForm, tags: currentTags.join(', ') });
    };

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [resUsers, resStaff, resMeals] = await Promise.all([
                    axios.get('http://localhost:5000/api/admin/users', { headers: { 'x-auth-token': token } }),
                    axios.get('http://localhost:5000/api/staff'),
                    axios.get('http://localhost:5000/api/meals')
                ]);
                setUsersList(resUsers.data);
                setStaffList(resStaff.data);
                setMealsList(resMeals.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (user && user.role === 'admin') fetchAdminData();
    }, [user]);

    const handleAddStaff = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const dataToSubmit = {
                ...staffForm,
                specialties: staffForm.specialties.split(',').map(s => s.trim())
            };
            await axios.post('http://localhost:5000/api/staff', dataToSubmit, { headers: { 'x-auth-token': token } });
            alert('Staff member added successfully!');
            
            // Refetch staff
            const resStaff = await axios.get('http://localhost:5000/api/staff');
            setStaffList(resStaff.data);
            
            setStaffForm({ fullName: '', role: 'Doctor', credentials: '', bio: '', specialties: '', photo: '', certificateUrl: '' });
            setAddingStaff(false);
            setActiveTab('staff');
        } catch (err) {
            console.error(err);
            alert('Failed to add staff.');
        }
    };

    const handleAddMeal = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const dataToSubmit = {
                ...mealForm,
                calories: Number(mealForm.calories),
                protein: Number(mealForm.protein),
                carbs: Number(mealForm.carbs),
                fat: Number(mealForm.fat),
                price: Number(mealForm.price),
                tags: mealForm.tags.split(',').map(tag => tag.trim()).filter(Boolean)
            };
            await axios.post('http://localhost:5000/api/meals', dataToSubmit, { headers: { 'x-auth-token': token } });
            alert('Meal added successfully!');
            
            const resMeals = await axios.get('http://localhost:5000/api/meals');
            setMealsList(resMeals.data);
            
            setMealForm({ name: '', description: '', image: '', calories: '', protein: '', carbs: '', fat: '', price: '', tags: '' });
            setAddingMeal(false);
            setActiveTab('meals');
        } catch (err) {
            console.error(err);
            alert('Failed to add meal.');
        }
    };

    const handleDeleteMeal = async (id) => {
        if (!window.confirm('Are you sure you want to delete this specific meal?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/meals/${id}`, { headers: { 'x-auth-token': token } });
            setMealsList(mealsList.filter(m => m._id !== id));
        } catch (err) {
            console.error(err);
            alert('Failed to delete meal.');
        }
    };

    if (loading) return <div className="container" style={{ paddingTop: '160px' }}>Loading admin data...</div>;

    return (
        <div style={{ padding: '160px 0', minHeight: '100vh', background: 'var(--bg-cream)' }}>
            <div className="container">
                <div style={{ marginBottom: '4rem' }}>
                    <div style={{ display: 'inline-block', padding: '0.4rem 1.2rem', background: 'white', borderRadius: '50px', border: '1px solid var(--border)', marginBottom: '1.5rem', fontWeight: '600', color: 'var(--accent)', fontSize: '0.9rem' }}>
                        ADMIN PORTAL
                    </div>
                    <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Dashboard <span className="text-accent">Overview.</span></h1>
                    <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>Manage users, view dietary preferences, and control staff members.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem' }}>
                    
                    {/* Add Staff Section */}
                    {activeTab === 'staff' && (
                        <div className="card" style={{ border: 'none' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                <UserPlus className="text-accent" /> Staff Management
                            </h3>
                            <button onClick={() => setAddingStaff(!addingStaff)} className="btn-primary">
                                {addingStaff ? 'Close Form' : 'Add New Staff'}
                            </button>
                        </div>

                        {addingStaff && (
                            <form onSubmit={handleAddStaff} style={{ background: 'var(--bg-cream)', padding: '2rem', borderRadius: '24px', display: 'grid', gap: '1.5rem', gridTemplateColumns: '1fr 1fr' }}>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--primary)' }}>Full Name</label>
                                    <input type="text" value={staffForm.fullName} onChange={(e) => setStaffForm({ ...staffForm, fullName: e.target.value })} required style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: '1px solid var(--border)' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--primary)' }}>Role</label>
                                    <select value={staffForm.role} onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })} style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: '1px solid var(--border)' }}>
                                        <option value="Doctor">Doctor</option>
                                        <option value="Chef">Chef</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--primary)' }}>Credentials (e.g. PhD, Michelin Chef)</label>
                                    <input type="text" value={staffForm.credentials} onChange={(e) => setStaffForm({ ...staffForm, credentials: e.target.value })} required style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: '1px solid var(--border)' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--primary)' }}>Specialties (comma separated)</label>
                                    <input type="text" value={staffForm.specialties} onChange={(e) => setStaffForm({ ...staffForm, specialties: e.target.value })} required style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: '1px solid var(--border)' }} />
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--primary)' }}>Biography</label>
                                    <textarea value={staffForm.bio} onChange={(e) => setStaffForm({ ...staffForm, bio: e.target.value })} required rows="3" style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: '1px solid var(--border)', resize: 'none' }}></textarea>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--primary)' }}>Profile Photo (Upload or URL)</label>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <input type="file" accept="image/*" onChange={async (e) => {
                                            if (e.target.files[0]) {
                                                const formData = new FormData();
                                                formData.append('image', e.target.files[0]);
                                                try {
                                                    const res = await axios.post('http://localhost:5000/api/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                                                    setStaffForm({ ...staffForm, photo: res.data.url });
                                                } catch (err) {
                                                    alert('Upload failed');
                                                }
                                            }
                                        }} style={{ width: '100%', padding: '0.8rem', borderRadius: '15px', border: '1px solid var(--border)', background: 'white' }} />
                                        <input type="text" value={staffForm.photo} onChange={(e) => setStaffForm({ ...staffForm, photo: e.target.value })} placeholder="Or paste https://..." style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: '1px solid var(--border)' }} />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--primary)' }}>Certificate PDF URL</label>
                                    <input type="text" value={staffForm.certificateUrl} onChange={(e) => setStaffForm({ ...staffForm, certificateUrl: e.target.value })} placeholder="https://..." style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: '1px solid var(--border)' }} />
                                </div>
                                <div style={{ gridColumn: 'span 2', textAlign: 'right' }}>
                                    <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 3rem', marginLeft: 'auto' }}>
                                        Save Staff Member <CheckCircle2 size={18} />
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                    )}

                    {/* Add Meal Section */}
                    {activeTab === 'meals' && (
                        <div className="card" style={{ border: 'none' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                    <Coffee className="text-accent" /> Meal Menu Management
                                </h3>
                                <button onClick={() => setAddingMeal(!addingMeal)} className="btn-primary">
                                    {addingMeal ? 'Close Form' : 'Add New Meal'}
                                </button>
                            </div>

                            {addingMeal && (
                                <form onSubmit={handleAddMeal} style={{ background: 'var(--bg-cream)', padding: '2rem', borderRadius: '24px', display: 'grid', gap: '1.5rem', gridTemplateColumns: '1fr 1fr' }}>
                                    <div>
                                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--primary)' }}>Meal Name</label>
                                        <input type="text" value={mealForm.name} onChange={(e) => setMealForm({ ...mealForm, name: e.target.value })} required style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: '1px solid var(--border)' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--primary)' }}>Price ($)</label>
                                        <input type="number" step="0.01" value={mealForm.price} onChange={(e) => setMealForm({ ...mealForm, price: e.target.value })} required style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: '1px solid var(--border)' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--primary)' }}>Calories</label>
                                        <input type="number" value={mealForm.calories} onChange={(e) => setMealForm({ ...mealForm, calories: e.target.value })} required style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: '1px solid var(--border)' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--primary)' }}>Protein (g)</label>
                                        <input type="number" value={mealForm.protein} onChange={(e) => setMealForm({ ...mealForm, protein: e.target.value })} required style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: '1px solid var(--border)' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--primary)' }}>Carbs (g)</label>
                                        <input type="number" value={mealForm.carbs} onChange={(e) => setMealForm({ ...mealForm, carbs: e.target.value })} required style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: '1px solid var(--border)' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--primary)' }}>Fat (g)</label>
                                        <input type="number" value={mealForm.fat} onChange={(e) => setMealForm({ ...mealForm, fat: e.target.value })} required style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: '1px solid var(--border)' }} />
                                    </div>
                                    <div style={{ gridColumn: 'span 2', position: 'relative' }}>
                                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--primary)' }}>Dietary Tags</label>
                                        <div 
                                            onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
                                            style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: '1px solid var(--border)', background: 'white', cursor: 'pointer', minHeight: '56px', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}
                                        >
                                            {mealForm.tags ? mealForm.tags.split(',').map(tag => tag.trim()).filter(Boolean).map(tag => (
                                                <span key={tag} onClick={(e) => { e.stopPropagation(); toggleTag(tag); }} style={{ background: 'var(--accent)', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '50px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                    {tag} <span style={{ cursor: 'pointer', fontWeight: 'bold' }}>&times;</span>
                                                </span>
                                            )) : <span style={{ color: 'var(--text-light)' }}>Select tags...</span>}
                                        </div>
                                        
                                        {isTagDropdownOpen && (
                                            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid var(--border)', borderRadius: '15px', padding: '1.5rem', zIndex: 10, marginTop: '0.5rem', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                                                    {PREDEFINED_TAGS.map(tag => {
                                                        const isSelected = mealForm.tags.includes(tag);
                                                        return (
                                                            <div 
                                                                key={tag} 
                                                                onClick={(e) => { e.stopPropagation(); toggleTag(tag); }}
                                                                style={{ 
                                                                    padding: '0.5rem 1rem', borderRadius: '50px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', transition: 'all 0.2s',
                                                                    background: isSelected ? 'rgba(0, 230, 118, 0.1)' : 'var(--bg-cream)',
                                                                    color: isSelected ? 'var(--accent)' : 'var(--text)',
                                                                    border: isSelected ? '2px solid var(--accent)' : '2px solid transparent'
                                                                }}
                                                            >
                                                                {tag}
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                                <button type="button" onClick={() => setIsTagDropdownOpen(false)} style={{ marginTop: '1.5rem', width: '100%', padding: '0.8rem', background: 'var(--bg-cream)', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', color: 'var(--text)' }}>
                                                    Done
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--primary)' }}>Description</label>
                                        <textarea value={mealForm.description} onChange={(e) => setMealForm({ ...mealForm, description: e.target.value })} required rows="3" style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: '1px solid var(--border)', resize: 'none' }}></textarea>
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--primary)' }}>Image Source (Upload or URL)</label>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <input type="file" accept="image/*" onChange={async (e) => {
                                                if (e.target.files[0]) {
                                                    const formData = new FormData();
                                                    formData.append('image', e.target.files[0]);
                                                    try {
                                                        const res = await axios.post('http://localhost:5000/api/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                                                        setMealForm({ ...mealForm, image: res.data.url });
                                                    } catch (err) {
                                                        alert('Upload failed');
                                                    }
                                                }
                                            }} style={{ flex: 1, padding: '0.8rem', borderRadius: '15px', border: '1px solid var(--border)', background: 'white' }} />
                                            <span style={{ fontWeight: 'bold', color: 'var(--text-light)' }}>OR</span>
                                            <input type="url" value={mealForm.image} onChange={(e) => setMealForm({ ...mealForm, image: e.target.value })} placeholder="Paste URL here..." required style={{ flex: 2, padding: '1rem', borderRadius: '15px', border: '1px solid var(--border)' }} />
                                        </div>
                                    </div>
                                    <div style={{ gridColumn: 'span 2', textAlign: 'right' }}>
                                        <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 3rem', marginLeft: 'auto' }}>
                                            Save Meal <CheckCircle2 size={18} />
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}

                    {/* Directory Tabs */}
                    <div className="card" style={{ border: 'none', background: 'transparent', padding: '0', marginBottom: '-1rem' }}>
                        <div className="admin-tabs" style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={() => setActiveTab('users')} style={{ flex: 1, padding: '1.5rem', background: activeTab === 'users' ? 'white' : 'var(--bg-cream)', border: '1px solid var(--border)', borderBottom: activeTab === 'users' ? '3px solid var(--accent)' : '1px solid var(--border)', borderRadius: '20px 20px 0 0', fontWeight: 'bold', fontSize: '1.1rem', color: activeTab === 'users' ? 'var(--primary)' : 'var(--text-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', transition: 'all 0.3s' }}>
                                <Users size={20} /> Registered Users
                            </button>
                            <button onClick={() => setActiveTab('staff')} style={{ flex: 1, padding: '1.5rem', background: activeTab === 'staff' ? 'white' : 'var(--bg-cream)', border: '1px solid var(--border)', borderBottom: activeTab === 'staff' ? '3px solid var(--accent)' : '1px solid var(--border)', borderRadius: '20px 20px 0 0', fontWeight: 'bold', fontSize: '1.1rem', color: activeTab === 'staff' ? 'var(--primary)' : 'var(--text-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', transition: 'all 0.3s' }}>
                                <FileText size={20} /> Staff Directory
                            </button>
                            <button onClick={() => setActiveTab('meals')} style={{ flex: 1, padding: '1.5rem', background: activeTab === 'meals' ? 'white' : 'var(--bg-cream)', border: '1px solid var(--border)', borderBottom: activeTab === 'meals' ? '3px solid var(--accent)' : '1px solid var(--border)', borderRadius: '20px 20px 0 0', fontWeight: 'bold', fontSize: '1.1rem', color: activeTab === 'meals' ? 'var(--primary)' : 'var(--text-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', transition: 'all 0.3s' }}>
                                <Coffee size={20} /> Meal Menu
                            </button>
                        </div>
                    </div>

                    {/* Records Section */}
                    <div className="card" style={{ border: 'none', borderTopLeftRadius: '0', borderTopRightRadius: '0' }}>
                        
                        {activeTab === 'users' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {usersList.map((usr, i) => (
                                    <div key={usr._id} style={{ border: '1px solid var(--border)', borderRadius: '20px', overflow: 'hidden' }}>
                                        
                                        {/* User Row (Header) */}
                                        <div onClick={() => setExpandedUser(expandedUser === usr._id ? null : usr._id)} className="admin-list-row" style={{ padding: '1.5rem', background: expandedUser === usr._id ? 'var(--bg-cream)' : 'white', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.3s ease' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                                                <div style={{ background: 'var(--primary)', color: 'white', fontWeight: 'bold', padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.85rem' }}>
                                                    #{i + 1}
                                                </div>
                                                <div>
                                                    <h4 style={{ fontSize: '1.1rem', margin: 0 }}>{usr.name}</h4>
                                                    <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', margin: 0 }}>{usr.email}</p>
                                                </div>
                                            </div>
                                            <div className="text-end" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 'bold', textTransform: 'uppercase' }}>Subscription</div>
                                                    <div style={{ color: usr.subscription?.active ? 'var(--accent)' : 'var(--text)' }}>
                                                        {usr.subscription?.active ? usr.subscription.plan.toUpperCase() : 'NONE'}
                                                    </div>
                                                </div>
                                                <ChevronDown size={20} style={{ transform: expandedUser === usr._id ? 'rotate(180deg)' : 'rotate(0)' }} className="text-accent" />
                                            </div>
                                        </div>
                                        
                                        {/* User Details (Expanded) */}
                                        {expandedUser === usr._id && (
                                            <div style={{ padding: '2rem', borderTop: '1px solid var(--border)', background: 'white' }}>
                                                <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--primary)' }}><FileText size={18} style={{ display: 'inline', marginRight: '8px' }}/> Dietary Preferences & Details</h4>
                                                {usr.dietaryPreferences ? (
                                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                                                        <div style={{ background: 'var(--bg-cream)', padding: '1rem', borderRadius: '15px' }}>
                                                            <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>Height</strong>
                                                            <span>{usr.dietaryPreferences.height || '--'}</span>
                                                        </div>
                                                        <div style={{ background: 'var(--bg-cream)', padding: '1rem', borderRadius: '15px' }}>
                                                            <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>Weight</strong>
                                                            <span>{usr.dietaryPreferences.weight || '--'}</span>
                                                        </div>
                                                        <div style={{ background: 'var(--bg-cream)', padding: '1rem', borderRadius: '15px' }}>
                                                            <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>Allergies</strong>
                                                            <span style={{ color: 'red', fontWeight: 'bold' }}>{usr.dietaryPreferences.allergies?.join(', ') || 'None'}</span>
                                                        </div>
                                                        <div style={{ background: 'var(--bg-cream)', padding: '1rem', borderRadius: '15px' }}>
                                                            <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>Goals</strong>
                                                            <span>{usr.dietaryPreferences.goals?.join(', ') || '--'}</span>
                                                        </div>
                                                        <div style={{ background: 'var(--bg-cream)', padding: '1rem', borderRadius: '15px' }}>
                                                            <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>Restrictions</strong>
                                                            <span>{usr.dietaryPreferences.restrictions?.join(', ') || '--'}</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p style={{ color: 'var(--text-light)' }}>User has not filled out personal details yet.</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'staff' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {staffList.length === 0 && <p>No staff created in the database yet.</p>}
                                {staffList.map((st) => (
                                    <div key={st._id} className="admin-list-row" style={{ display: 'flex', gap: '2rem', padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '20px', alignItems: 'center' }}>
                                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: `url(${st.photo}) center/cover`, border: '2px solid var(--accent)' }}>
                                            {!st.photo && <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary)', color: 'white', borderRadius: '50%', fontWeight: 'bold' }}>{st.fullName.charAt(0)}</div>}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{st.fullName} <span style={{ fontSize: '0.8rem', background: 'var(--bg-cream)', padding: '0.2rem 0.6rem', borderRadius: '50px', marginLeft: '0.5rem', color: 'var(--accent)', border: '1px solid var(--accent)' }}>{st.role.toUpperCase()}</span></h4>
                                            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.4rem' }}>{st.credentials}</p>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text)' }}><strong>Specialties:</strong> {st.specialties.join(', ')}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'meals' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {mealsList.length === 0 && <p>No meals created in the database yet.</p>}
                                {mealsList.map((ml) => (
                                    <div key={ml._id} className="admin-list-row" style={{ display: 'flex', gap: '2rem', padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '20px', alignItems: 'center' }}>
                                        <div style={{ width: '80px', height: '80px', borderRadius: '15px', background: `url(${ml.image}) center/cover`, border: '2px solid var(--border)' }}>
                                            {!ml.image && <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary)', color: 'white', borderRadius: '15px', fontWeight: 'bold' }}><Coffee /></div>}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{ml.name} <span style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--accent)', marginLeft: '0.8rem' }}>${ml.price}</span></h4>
                                            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.4rem' }}>{ml.description}</p>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text)', display: 'flex', gap: '0.5rem' }}>
                                                {ml.tags.map(tag => <span key={tag} style={{ background: 'var(--bg-cream)', padding: '0.2rem 0.6rem', borderRadius: '50px', border: '1px solid var(--border)' }}>{tag}</span>)}
                                            </p>
                                        </div>
                                        <div className="text-end" style={{ textAlign: 'right', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                                            <div>
                                                <div><strong>{ml.calories}</strong> kcal</div>
                                                <div>P: {ml.protein}g C: {ml.carbs}g F: {ml.fat}g</div>
                                            </div>
                                            <button onClick={() => handleDeleteMeal(ml._id)} style={{ background: '#ffebee', color: '#c62828', border: 'none', padding: '0.5rem', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                                <Trash2 size={14} /> Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
