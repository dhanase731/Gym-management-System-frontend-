import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./../Styles/login.css";
import { api } from "../utils/api";

const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!name || !email || !password || !confirmPassword) {
            setError("All fields are required");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        setError(""); // Clear previous errors
        
        try {
            const response = await api.register(name, email, password);
            
            // Check if response has success message
            if (response && response.message && (response.message.includes('successfully') || response.message.includes('registered'))) {
                // Store user data
                if (response.token) {
                    localStorage.setItem('token', response.token);
                }
                if (response.user) {
                    localStorage.setItem('user', JSON.stringify(response.user));
                }
                alert('Account created successfully! Please login.');
                navigate('/login');
            } else if (response && response.message) {
                // Show specific error message from server
                setError(response.message);
            } else {
                setError('Registration failed. Please try again.');
            }
        } catch (err) {
            // Handle network errors or other exceptions
            let errorMessage = '';
            
            if (err.message) {
                errorMessage = err.message;
            } else if (err.toString().includes('Failed to fetch') || err.toString().includes('NetworkError') || err.toString().includes('Network request failed')) {
                errorMessage = 'Cannot connect to server. Quick fixes:\n\n1. Open terminal in: Stock_market/stock_market/server\n2. Run: npm start\n3. Wait for "Server is running on port 5000"\n4. Try again\n\nOr check: http://localhost:5000/api/health';
            } else {
                errorMessage = 'Registration failed. Please check your connection and try again.';
            }
            
            setError(errorMessage);
            console.error('Registration error:', err);
            
            // Show helpful message in console
            if (err.toString().includes('Failed to fetch')) {
                console.error('\n🔧 TROUBLESHOOTING:');
                console.error('1. Make sure backend is running: cd server && npm start');
                console.error('2. Check: http://localhost:5000/api/health');
                console.error('3. Check browser Network tab (F12) for details');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80") center/cover fixed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(15px)',
                padding: '40px',
                borderRadius: '16px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                width: '100%',
                maxWidth: '400px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <img src="https://img.freepik.com/premium-vector/gym-center-logo-logo-design-gym-center_1152818-25.jpg" alt="logo" style={{ width: '64px', height: '64px', borderRadius: '8px', marginBottom: '16px' }} />
                    <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#404040', marginBottom: '8px' }}>Gym Management System</h1>
                    <p style={{ color: '#666', fontSize: '14px' }}>Create your account</p>
                </div>
                
                {error && (
                    <div style={{
                        padding: '12px',
                        background: '#ffebee',
                        color: '#c62828',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        fontSize: '14px'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#404040', fontSize: '14px' }}>Full Name</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                            placeholder="Enter your full name"
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '2px solid #E0E0E0',
                                borderRadius: '8px',
                                fontSize: '14px',
                                transition: 'border-color 0.2s',
                                outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#808080'}
                            onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#404040', fontSize: '14px' }}>Email Address</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="Enter your email"
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '2px solid #E0E0E0',
                                borderRadius: '8px',
                                fontSize: '14px',
                                transition: 'border-color 0.2s',
                                outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#808080'}
                            onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
                        />
                    </div>
                    
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#404040', fontSize: '14px' }}>Password</label>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            placeholder="Enter your password"
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '2px solid #E0E0E0',
                                borderRadius: '8px',
                                fontSize: '14px',
                                transition: 'border-color 0.2s',
                                outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#808080'}
                            onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#404040', fontSize: '14px' }}>Confirm Password</label>
                        <input
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            type="password"
                            placeholder="Confirm your password"
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '2px solid #E0E0E0',
                                borderRadius: '8px',
                                fontSize: '14px',
                                transition: 'border-color 0.2s',
                                outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#808080'}
                            onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
                        />
                    </div>
                    
                    <button 
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '14px',
                            background: loading ? '#ccc' : 'linear-gradient(135deg, #606060, #404040)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: '0 4px 15px rgba(64, 64, 64, 0.3)'
                        }}
                        onMouseOver={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
                        onMouseOut={(e) => !loading && (e.target.style.transform = 'translateY(0px)')}
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>
                
                <div style={{ textAlign: 'center', marginTop: '24px' }}>
                    <p style={{ color: '#666', fontSize: '14px' }}>
                        Already have an account? <Link to="/login" style={{ color: '#808080', cursor: 'pointer', fontWeight: '500', textDecoration: 'none' }}>Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;

