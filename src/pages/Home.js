import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import '../Styles/Dashboard.css';
import { api } from '../utils/api';

const Home = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [gyms, setGyms] = useState([]);

  const heroSlides = [
    {
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      headline: 'Transform Your Fitness Journey',
      subheading: 'Join thousands of members achieving their fitness goals with our state-of-the-art facilities and expert trainers'
    },
    {
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      headline: 'Premium Gym Experience',
      subheading: 'World-class equipment, personalized training, and a supportive community await you'
    },
    {
      image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      headline: 'Your Health, Our Priority',
      subheading: 'Comprehensive fitness solutions tailored to your needs and goals'
    }
  ];

  useEffect(() => {
    loadGyms();
    // Auto-slide every 5 seconds
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadGyms = async () => {
    try {
      const data = await api.getGyms();
      setGyms(data);
    } catch (error) {
      console.error('Error loading gyms:', error);
    }
  };

  const categories = [
    {
      id: 1,
      title: 'Membership Plans',
      description: 'Choose the perfect plan for your fitness journey',
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      link: '/members',
      color: '#FF6B6B'
    },
    {
      id: 2,
      title: 'Personal Training',
      description: 'One-on-one sessions with certified trainers',
      image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      link: '/trainers',
      color: '#4ECDC4'
    },
    {
      id: 3,
      title: 'Group Classes',
      description: 'Join energizing group fitness sessions',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      link: '/attendance',
      color: '#45B7D1'
    },
    {
      id: 4,
      title: 'Gym Facilities',
      description: 'Explore our premium gym locations',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      link: '/gymForm',
      color: '#96CEB4'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Hero Section */}
      <section style={{ position: 'relative', height: '600px', overflow: 'hidden' }}>
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: index === currentSlide ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              color: 'white',
              textAlign: 'center',
              padding: '20px'
            }}
          >
            <h1 style={{ 
              fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
              fontWeight: '700', 
              marginBottom: '20px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}>
              {slide.headline}
            </h1>
            <p style={{ 
              fontSize: 'clamp(1rem, 2vw, 1.5rem)', 
              marginBottom: '30px',
              maxWidth: '800px',
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
            }}>
              {slide.subheading}
            </p>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                onClick={() => navigate('/members')}
                style={{
                  padding: '16px 40px',
                  fontSize: '18px',
                  fontWeight: '600',
                  background: 'linear-gradient(135deg, #FF6B6B, #4ECDC4)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 12px 25px rgba(0,0,0,0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 20px rgba(0,0,0,0.3)';
                }}
              >
                Join Now
              </button>
              <button
                onClick={() => {
                  const plansSection = document.getElementById('plans-section');
                  if (plansSection) {
                    plansSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                style={{
                  padding: '16px 40px',
                  fontSize: '18px',
                  fontWeight: '600',
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: '2px solid white',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                  e.target.style.transform = 'translateY(-3px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Explore Plans
              </button>
        </div>
      </div>
        ))}
        
        {/* Slide Indicators */}
        <div style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '10px',
          zIndex: 10
        }}>
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              style={{
                width: index === currentSlide ? '30px' : '12px',
                height: '12px',
                borderRadius: '6px',
                border: 'none',
                background: index === currentSlide ? 'white' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
      </section>

      {/* About Brand Section */}
      <section style={{ 
        padding: '80px 20px',
        background: 'white',
        textAlign: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h2 style={{ 
          fontSize: 'clamp(2rem, 4vw, 3rem)', 
          fontWeight: '700', 
          marginBottom: '20px',
          color: '#333'
        }}>
          About Our Brand
        </h2>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          fontSize: 'clamp(1rem, 2vw, 1.25rem)',
          lineHeight: '1.8',
          color: '#666'
        }}>
          <p style={{ marginBottom: '20px' }}>
            We are a trusted, family-run fitness organization dedicated to helping you achieve your health and wellness goals. 
            With years of experience and a commitment to quality, we provide state-of-the-art facilities, expert trainers, 
            and a supportive community that makes your fitness journey enjoyable and effective.
          </p>
          <p>
            Our mission is to empower individuals through fitness, offering personalized training programs, 
            premium equipment, and a welcoming environment where everyone can thrive and reach their full potential.
          </p>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '60px',
          marginTop: '50px',
          flexWrap: 'wrap'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', fontWeight: '700', color: '#FF6B6B', marginBottom: '10px' }}>
              {gyms.length > 0 ? gyms.length : '10+'}
        </div>
            <div style={{ color: '#666', fontSize: '1.1rem' }}>Gym Locations</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', fontWeight: '700', color: '#4ECDC4', marginBottom: '10px' }}>
              1000+
            </div>
            <div style={{ color: '#666', fontSize: '1.1rem' }}>Happy Members</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', fontWeight: '700', color: '#45B7D1', marginBottom: '10px' }}>
              50+
            </div>
            <div style={{ color: '#666', fontSize: '1.1rem' }}>Expert Trainers</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', fontWeight: '700', color: '#96CEB4', marginBottom: '10px' }}>
              15+
            </div>
            <div style={{ color: '#666', fontSize: '1.1rem' }}>Years Experience</div>
          </div>
        </div>
      </section>

      {/* Membership Plans Section */}
      <section id="plans-section" style={{ 
        padding: '80px 20px',
        background: 'white',
        minHeight: '500px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ 
            fontSize: 'clamp(2rem, 4vw, 3rem)', 
            fontWeight: '700', 
            marginBottom: '20px',
            color: '#333'
          }}>
            Membership Plans
          </h2>
          <p style={{ 
            fontSize: 'clamp(1rem, 2vw, 1.25rem)', 
            marginBottom: '60px',
            color: '#666',
            maxWidth: '600px',
            margin: '0 auto 60px auto'
          }}>
            Choose the perfect plan that fits your fitness goals and lifestyle
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {/* Basic Plan */}
            <div style={{
              background: 'linear-gradient(135deg, #f3e5f5 0%, #ffffff 100%)',
              padding: '40px 30px',
              borderRadius: '16px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
              border: '2px solid #e1bee7',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.1)';
            }}
            onClick={() => navigate('/members')}
            >
              <h3 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '10px', color: '#7b1fa2' }}>Basic Plan</h3>
              <div style={{ fontSize: '3rem', fontWeight: '700', color: '#7b1fa2', marginBottom: '10px' }}>₹1,500</div>
              <div style={{ color: '#666', marginBottom: '30px' }}>per month</div>
              <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', marginBottom: '30px' }}>
                <li style={{ padding: '10px 0', borderBottom: '1px solid #e0e0e0' }}>✓ Access to gym equipment</li>
                <li style={{ padding: '10px 0', borderBottom: '1px solid #e0e0e0' }}>✓ Locker facilities</li>
                <li style={{ padding: '10px 0', borderBottom: '1px solid #e0e0e0' }}>✓ Basic amenities</li>
              </ul>
              <button style={{
                width: '100%',
                padding: '14px',
                background: '#7b1fa2',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                Explore Plan
              </button>
            </div>

            {/* Standard Plan */}
            <div style={{
              background: 'linear-gradient(135deg, #fff3e0 0%, #ffffff 100%)',
              padding: '40px 30px',
              borderRadius: '16px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
              border: '2px solid #ffcc80',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              transform: 'scale(1.05)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.08) translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1.05) translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.1)';
            }}
            onClick={() => navigate('/members')}
            >
              <div style={{ position: 'absolute', top: '20px', right: '20px', background: '#f57c00', color: 'white', padding: '5px 15px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                POPULAR
              </div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '10px', color: '#f57c00' }}>Standard Plan</h3>
              <div style={{ fontSize: '3rem', fontWeight: '700', color: '#f57c00', marginBottom: '10px' }}>₹2,000</div>
              <div style={{ color: '#666', marginBottom: '30px' }}>per month</div>
              <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', marginBottom: '30px' }}>
                <li style={{ padding: '10px 0', borderBottom: '1px solid #e0e0e0' }}>✓ Everything in Basic</li>
                <li style={{ padding: '10px 0', borderBottom: '1px solid #e0e0e0' }}>✓ Group classes</li>
                <li style={{ padding: '10px 0', borderBottom: '1px solid #e0e0e0' }}>✓ Nutrition consultation</li>
                <li style={{ padding: '10px 0', borderBottom: '1px solid #e0e0e0' }}>✓ Priority booking</li>
              </ul>
              <button style={{
                width: '100%',
                padding: '14px',
                background: '#f57c00',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                Explore Plan
              </button>
            </div>

            {/* Premium Plan */}
            <div style={{
              background: 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
              padding: '40px 30px',
              borderRadius: '16px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
              border: '2px solid #90caf9',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.1)';
            }}
            onClick={() => navigate('/members')}
            >
              <h3 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '10px', color: '#1976d2' }}>Premium Plan</h3>
              <div style={{ fontSize: '3rem', fontWeight: '700', color: '#1976d2', marginBottom: '10px' }}>₹2,500</div>
              <div style={{ color: '#666', marginBottom: '30px' }}>per month</div>
              <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', marginBottom: '30px' }}>
                <li style={{ padding: '10px 0', borderBottom: '1px solid #e0e0e0' }}>✓ Everything in Standard</li>
                <li style={{ padding: '10px 0', borderBottom: '1px solid #e0e0e0' }}>✓ Personal trainer</li>
                <li style={{ padding: '10px 0', borderBottom: '1px solid #e0e0e0' }}>✓ All access facilities</li>
                <li style={{ padding: '10px 0', borderBottom: '1px solid #e0e0e0' }}>✓ 24/7 gym access</li>
                <li style={{ padding: '10px 0', borderBottom: '1px solid #e0e0e0' }}>✓ Custom meal plans</li>
              </ul>
              <button style={{
                width: '100%',
                padding: '14px',
                background: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                Explore Plan
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories / Collections Section */}
      <section style={{ 
        padding: '80px 20px',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        minHeight: '600px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ 
            fontSize: 'clamp(2rem, 4vw, 3rem)', 
            fontWeight: '700', 
            marginBottom: '60px',
            textAlign: 'center',
            color: '#333'
          }}>
            Explore Our Services
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '30px',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => navigate(category.link)}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{
                  height: '250px',
                  backgroundImage: `url(${category.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `linear-gradient(to bottom, transparent, ${category.color}dd)`
                  }} />
                </div>
                <div style={{ padding: '30px' }}>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    marginBottom: '10px',
                    color: '#333'
                  }}>
                    {category.title}
                  </h3>
                  <p style={{
                    color: '#666',
                    lineHeight: '1.6',
                    marginBottom: '20px'
                  }}>
                    {category.description}
                  </p>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    color: category.color,
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    Explore <span style={{ marginLeft: '8px', fontSize: '1.2rem' }}>→</span>
        </div>
      </div>
    </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '80px 20px',
        background: 'linear-gradient(135deg, #FF6B6B, #4ECDC4)',
        textAlign: 'center',
        color: 'white'
      }}>
        <h2 style={{ 
          fontSize: 'clamp(2rem, 4vw, 3rem)', 
          fontWeight: '700', 
          marginBottom: '20px'
        }}>
          Ready to Start Your Fitness Journey?
        </h2>
        <p style={{ 
          fontSize: 'clamp(1rem, 2vw, 1.25rem)', 
          marginBottom: '40px',
          maxWidth: '600px',
          margin: '0 auto 40px auto',
          opacity: 0.95
        }}>
          Join thousands of members who have transformed their lives with us. 
          Get started today with our flexible membership plans.
        </p>
        <button
          onClick={() => navigate('/members')}
          style={{
            padding: '18px 50px',
            fontSize: '18px',
            fontWeight: '600',
            background: 'white',
            color: '#FF6B6B',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-3px) scale(1.05)';
            e.target.style.boxShadow = '0 12px 25px rgba(0,0,0,0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0) scale(1)';
            e.target.style.boxShadow = '0 8px 20px rgba(0,0,0,0.3)';
          }}
        >
          Get Started Now
        </button>
      </section>
    </div>
  );
};

export default Home;
