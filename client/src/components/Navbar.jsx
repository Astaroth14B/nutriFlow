import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, User as UserIcon, LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Personalize', path: '/recommend' },
        { name: 'Plans', path: '/plans' },
        { name: 'Meals', path: '/meals' },
        { name: 'Staff', path: '/staff' },
    ];

    return (
        <nav className={`navbar ${scrolled ? 'glass active' : ''}`} style={{
            position: 'fixed',
            top: 0,
            width: '100%',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: scrolled ? '0.8rem 5%' : '1.5rem 5%',
            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            background: scrolled ? 'rgba(253, 253, 253, 0.8)' : 'transparent',
            borderBottom: scrolled ? '1px solid var(--border)' : 'none'
        }}>
            <Link to="/" className="logo" style={{
                fontSize: '1.8rem',
                fontWeight: '800',
                color: 'var(--primary)',
                fontFamily: 'var(--font-main)'
            }}>
                Nutri<span style={{ color: 'var(--accent)' }}>Flow</span>
            </Link>

            <div className="desktop-nav" style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
                <ul style={{ display: 'flex', gap: '2.5rem' }}>
                    {navLinks.map((link) => (
                        <li key={link.path}>
                            <Link to={link.path} style={{
                                fontWeight: '500',
                                color: location.pathname === link.path ? 'var(--accent)' : 'var(--text)',
                                fontSize: '0.95rem'
                            }}>
                                {link.name}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', borderLeft: '1px solid var(--border)', paddingLeft: '1.5rem' }}>
                    {user ? (
                        <>
                            <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{
                                    width: '35px', height: '35px', borderRadius: '50%', background: 'var(--bg-cream)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)'
                                }}>
                                    <UserIcon size={18} color="var(--accent)" />
                                </div>
                            </Link>
                            <button onClick={logout} style={{ background: 'none', color: 'var(--text-light)' }} title="Sign Out">
                                <LogOut size={20} />
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="btn-primary" style={{ padding: '0.6rem 1.8rem', fontSize: '0.9rem' }}>
                            Join Now
                        </Link>
                    )}
                </div>
            </div>

            {/* Mobile Menu Icon */}
            <div className="mobile-toggle" style={{ display: 'none' }} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </div>

            {/* Mobile Nav Dropdown */}
            {isMenuOpen && (
                <div className="nav-mobile-menu">
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {navLinks.map((link) => (
                            <li key={link.path}>
                                <Link to={link.path} onClick={() => setIsMenuOpen(false)} style={{
                                    fontWeight: '500',
                                    color: location.pathname === link.path ? 'var(--accent)' : 'var(--text)',
                                    display: 'block'
                                }}>
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div style={{ width: '100%', height: '1px', background: 'var(--border)', margin: '0.5rem 0' }}></div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {user ? (
                            <>
                                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontWeight: 'bold' }}>
                                    <div style={{
                                        width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-cream)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)'
                                    }}>
                                        <UserIcon size={20} color="var(--accent)" />
                                    </div>
                                    My Dashboard
                                </Link>
                                <button onClick={() => { logout(); setIsMenuOpen(false); }} className="btn-outline" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
                                    <LogOut size={18} /> Sign Out
                                </button>
                            </>
                        ) : (
                            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="btn-primary" style={{ textAlign: 'center', width: '100%' }}>
                                Join Now
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
