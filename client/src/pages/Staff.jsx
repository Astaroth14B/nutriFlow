import React, { useState } from 'react';
import axios from 'axios';
import { Award, Mail, MessageSquare, Briefcase, FileText, X, Send } from 'lucide-react';

const fallbackStaff = [
    {
        _id: '1',
        fullName: 'Dr. Sarah Mitchell',
        role: 'Doctor',
        credentials: 'PhD, RD, LDN',
        bio: 'Expert in clinical nutrition and metabolic health. Dr. Mitchell has helped thousands optimize their hormone balance through strategic nutrition.',
        specialties: ['Metabolism', 'Hormonal Health', 'Longevity'],
        photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=600',
        certificateUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    },
    {
        _id: '2',
        fullName: 'Chef Gordon Ramesh',
        role: 'Chef',
        credentials: 'Michelin Star Chef',
        bio: 'World-renowned chef bringing clinical nutrition to life with exquisite culinary expertise. Eating healthy has never tasted this good.',
        specialties: ['Fine Dining', 'Vegan Gastronomy', 'Flavor Balancing'],
        photo: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=600',
        certificateUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    },
    {
        _id: '3',
        fullName: 'Dr. Marcus Chen',
        role: 'Doctor',
        credentials: 'MS, RDN, CSCS',
        bio: 'Marcus combines strength coaching with sports dietetics. His approach focuses on sustainable physical transformation and high-performance energy.',
        specialties: ['Sports Nutrition', 'Fat Loss', 'Muscle Hypertrophy'],
        photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=600',
        certificateUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    },
    {
        _id: '4',
        fullName: 'Chef Elena Rodriguez',
        role: 'Chef',
        credentials: 'Le Cordon Bleu, Culinary Nutrition',
        bio: 'Specializing in gut-friendly cuisine and anti-inflammatory cooking. Elena believes healing starts in the kitchen.',
        specialties: ['Gut Health', 'Autoimmune Diets', 'Mediterranean Cuisine'],
        photo: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=600',
        certificateUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    }
];

const Staff = () => {
    const [staffData, setStaffData] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [modalMode, setModalMode] = useState(null); // 'profile', 'chat', 'email'
    const [chatMsg, setChatMsg] = useState('');
    const [chatLog, setChatLog] = useState([]);

    React.useEffect(() => {
        const fetchStaff = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/staff');
                if (res.data && res.data.length > 0) {
                    setStaffData(res.data);
                } else {
                    setStaffData(fallbackStaff);
                }
            } catch (err) {
                console.error(err);
                setStaffData(fallbackStaff);
            }
        };
        fetchStaff();
    }, []);
    
    // Use fallback images for broken Unsplash pictures
    const handleImageError = (e) => {
        e.target.src = 'https://ui-avatars.com/api/?name=Staff+Member&background=00E676&color=fff&size=600';
    };

    const openModal = (staff, mode) => {
        setSelectedStaff(staff);
        setModalMode(mode);
        if (mode === 'chat') {
            setChatLog([{ sender: 'staff', text: `Hi! I'm ${staff.fullName}. How can I assist you today?` }]);
        }
    };

    const sendChat = () => {
        if (!chatMsg.trim()) return;
        setChatLog([...chatLog, { sender: 'user', text: chatMsg }]);
        setChatMsg('');
        setTimeout(() => {
            setChatLog((prev) => [...prev, { sender: 'staff', text: 'Thank you for your message. I will review this and get back to you shortly!' }]);
        }, 1000);
    };

    return (
        <div style={{ padding: '160px 0', minHeight: '100vh', background: 'var(--bg-cream)' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '6rem', maxWidth: '850px', margin: '0 auto 6rem' }}>
                    <div style={{ display: 'inline-block', padding: '0.4rem 1.2rem', background: 'white', borderRadius: '50px', border: '1px solid var(--border)', marginBottom: '1.5rem', fontWeight: '600', color: 'var(--accent)', fontSize: '0.9rem' }}>
                        OUR EXPERT STAFF
                    </div>
                    <h2 style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>Doctors & <span className="text-accent">Chefs.</span></h2>
                    <p style={{ color: 'var(--text-light)', fontSize: '1.2rem' }}>Work directly with world-class clinical doctors and culinary experts who translate complex science into actionable, delicious plans tailored for you.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '3rem' }}>
                    {staffData.map((d) => (
                        <div key={d._id} className="card" style={{ padding: '0', overflow: 'hidden', border: 'none', cursor: 'pointer' }} onClick={() => openModal(d, 'profile')}>
                            <div style={{ position: 'relative', height: '350px' }}>
                                <img src={d.photo} alt={d.fullName} onError={handleImageError} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', bottom: '20px', left: '20px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', padding: '0.6rem 1.2rem', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {d.role === 'Doctor' ? <Award size={18} className="text-accent" /> : <Briefcase size={18} className="text-accent" />}
                                    <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>{d.role.toUpperCase()}</span>
                                </div>
                            </div>
                            <div style={{ padding: '2.5rem' }}>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <h3 style={{ fontSize: '1.8rem', marginBottom: '0.3rem' }}>{d.fullName}</h3>
                                    <span style={{ color: 'var(--accent)', fontWeight: '700', fontSize: '0.95rem' }}>{d.credentials}</span>
                                </div>
                                <p style={{ color: 'var(--text-light)', lineHeight: '1.6', marginBottom: '2rem', height: '80px', overflow: 'hidden' }}>{d.bio}</p>

                                <div style={{ display: 'flex', gap: '1rem' }} onClick={(e) => e.stopPropagation()}>
                                    <button onClick={() => openModal(d, 'chat')} className="btn-primary" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.6rem' }}>
                                        <MessageSquare size={18} /> Chat
                                    </button>
                                    <button onClick={() => openModal(d, 'email')} style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'var(--bg-cream)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--accent)' }}>
                                        <Mail size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal Overlay */}
            {selectedStaff && modalMode && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
                    <div className="card" style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
                        <button onClick={() => setModalMode(null)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'var(--bg-cream)', borderRadius: '50%', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <X size={24} color="var(--primary)" />
                        </button>

                        {modalMode === 'profile' && (
                            <div>
                                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
                                    <img src={selectedStaff.photo} alt={selectedStaff.fullName} onError={handleImageError} style={{ width: '150px', height: '150px', borderRadius: '20px', objectFit: 'cover' }} />
                                    <div>
                                        <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{selectedStaff.fullName}</h2>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--accent)', fontWeight: 'bold' }}>
                                            <span>{selectedStaff.role}</span> &bull; <span>{selectedStaff.credentials}</span>
                                        </div>
                                    </div>
                                </div>
                                <h3 style={{ fontSize: '1.4rem', borderBottom: '2px solid var(--bg-cream)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>About</h3>
                                <p style={{ color: 'var(--text-light)', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '2rem' }}>{selectedStaff.bio}</p>
                                
                                <h3 style={{ fontSize: '1.4rem', borderBottom: '2px solid var(--bg-cream)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Certifications</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--bg-cream)', borderRadius: '15px' }}>
                                    <FileText size={32} color="var(--accent)" />
                                    <div>
                                        <h4 style={{ margin: 0 }}>Official Certificate</h4>
                                        <a href={selectedStaff.certificateUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', fontSize: '0.9rem', fontWeight: 'bold' }}>View PDF Document</a>
                                    </div>
                                </div>
                            </div>
                        )}

                        {modalMode === 'chat' && (
                            <div style={{ display: 'flex', flexDirection: 'column', height: '70vh' }}>
                                <h2 style={{ fontSize: '2rem', marginBottom: '1rem', borderBottom: '1px solid var(--bg-cream)', paddingBottom: '1rem' }}>Chat with {selectedStaff.fullName}</h2>
                                <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-cream)', padding: '1.5rem', borderRadius: '15px', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
                                    {chatLog.map((msg, idx) => (
                                        <div key={idx} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', background: msg.sender === 'user' ? 'var(--accent)' : 'white', color: msg.sender === 'user' ? 'white' : 'var(--text)', padding: '1rem 1.5rem', borderRadius: '20px', borderBottomRightRadius: msg.sender === 'user' ? '0' : '20px', borderBottomLeftRadius: msg.sender === 'staff' ? '0' : '20px', maxWidth: '80%', boxShadow: 'var(--shadow-sm)' }}>
                                            {msg.text}
                                        </div>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <input type="text" value={chatMsg} onChange={(e) => setChatMsg(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendChat()} placeholder="Type your message..." style={{ flex: 1, padding: '1rem', borderRadius: '15px', border: '1px solid var(--border)', fontSize: '1rem' }} />
                                    <button onClick={sendChat} className="btn-primary" style={{ padding: '0 1.5rem' }}>
                                        <Send size={20} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {modalMode === 'email' && (
                            <div>
                                <h2 style={{ fontSize: '2rem', marginBottom: '1rem', borderBottom: '1px solid var(--bg-cream)', paddingBottom: '1rem' }}>Email {selectedStaff.fullName}</h2>
                                <form onSubmit={(e) => { e.preventDefault(); alert('Email sent successfully!'); setModalMode(null); }}>
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--primary)' }}>Subject</label>
                                        <input type="text" style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: '1px solid var(--border)', fontSize: '1rem' }} required placeholder="e.g. Dietary Consultation Request" />
                                    </div>
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--primary)' }}>Message</label>
                                        <textarea rows="6" style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: '1px solid var(--border)', fontSize: '1rem', resize: 'none' }} required placeholder="Type your inquiry here..."></textarea>
                                    </div>
                                    <button type="submit" className="btn-primary" style={{ width: '100%' }}>Send Email</button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Staff;
