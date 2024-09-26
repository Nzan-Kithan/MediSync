import React, { useState, useEffect } from 'react';import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaFileInvoiceDollar, FaHistory, FaQrcode, FaUserMd, FaHospital, FaQuoteLeft, 
FaQuoteRight, FaArrowRight, FaChevronLeft, FaChevronRight, FaArrowLeft } from 'react-icons/fa';
import './Home.css';

const Home = () => {
    const testimonials = [
        {
            content: "MediSync has made managing my healthcare so much easier. I love being able to see all my appointments and records in one place!",
            author: "Sarah J."
        },
        {
            content: "As a doctor, MediSync has streamlined my practice. It's improved communication with patients and other healthcare providers.",
            author: "Dr. Michael T."
        },
        {
            content: "The QR code feature is a game-changer! It's so convenient to share my medical information securely with new healthcare providers.",
            author: "Emily R."
        },
        {
            content: "MediSync has helped me keep track of my family's health records effortlessly. It's a must-have for busy parents!",
            author: "David L."
        },
        {
            content: "The multi-hospital management feature is fantastic. It's made coordinating my care across different specialists so much easier.",
            author: "Lisa M."
        }
    ];

    const [currentIndices, setCurrentIndices] = useState([0, 1, 2]);
    const [isAnimating, setIsAnimating] = useState(false);
    const [screenSize, setScreenSize] = useState(getScreenSize());
    const [opacity, setOpacity] = useState(1);

    function getScreenSize() {
        const width = window.innerWidth;
        if (width <= 830) return 'mobile';
        if (width <= 1290) return 'tablet';
        return 'desktop';
    }

    useEffect(() => {
        const handleResize = () => {
            setScreenSize(getScreenSize());
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const getVisibleTestimonials = () => {
        switch (screenSize) {
            case 'mobile':
                return [currentIndices[0]];
            case 'tablet':
                return [currentIndices[0], currentIndices[1]];
            default:
                return currentIndices;
        }
    };

    const changeTestimonials = (direction) => {
        if (!isAnimating) {
            setIsAnimating(true);
            setOpacity(0);
            
            setTimeout(() => {
                setCurrentIndices(prevIndices => {
                    const change = direction === 'next' ? 1 : -1;
                    const increment = screenSize === 'mobile' ? 1 : screenSize === 'tablet' ? 2 : 3;
                    return prevIndices.map(index => 
                        (index + change * increment + testimonials.length) % testimonials.length
                    );
                });
                
                setTimeout(() => {
                    setOpacity(1);
                    setIsAnimating(false);
                }, 50);
            }, 750);
        }
    };

    const nextTestimonial = () => changeTestimonials('next');
    const prevTestimonial = () => changeTestimonials('prev');

    return (
        <div className="home">
            <div className="banner">
                <div className="banner-content">
                    <h1>Welcome to MediSync</h1>
                    <p>Revolutionizing Healthcare Management</p>
                </div>
            </div>

            <div className="section section-light">
                <div className="about-medisync">
                    <h2>About MediSync</h2>
                    <p>MediSync is a cutting-edge healthcare management platform designed to streamline the healthcare experience for patients, providers, and hospitals. Our innovative solution connects all aspects of healthcare, making it easier than ever to manage your health and wellness journey.</p>
                </div>
            </div>

            <div className="section section-colored">
                <div className="features">
                    <h2>Our Features</h2>
                    <div className="feature-grid">
                        <div className="feature-item">
                            <FaCalendarAlt className="feature-icon" />
                            <h3>Appointment Scheduling</h3>
                            <p>Easily book and manage your medical appointments</p>
                        </div>
                        <div className="feature-item">
                            <FaFileInvoiceDollar className="feature-icon" />
                            <h3>Bill Checking</h3>
                            <p>View and pay your medical bills securely</p>
                        </div>
                        <div className="feature-item">
                            <FaHistory className="feature-icon" />
                            <h3>Medical History</h3>
                            <p>Access your complete medical history anytime</p>
                        </div>
                        <div className="feature-item">
                            <FaQrcode className="feature-icon" />
                            <h3>QR Code Sharing</h3>
                            <p>Share your medical info securely with QR codes</p>
                        </div>
                        <div className="feature-item">
                            <FaUserMd className="feature-icon" />
                            <h3>Doctor Availability</h3>
                            <p>Check real-time availability of doctors</p>
                        </div>
                        <div className="feature-item">
                            <FaHospital className="feature-icon" />
                            <h3>Multi-Hospital Management</h3>
                            <p>Manage your care across multiple hospitals</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="section section-light">
                <div className="how-it-works">
                    <h2>How It Works</h2>
                    <div className="steps">
                        <div className="step">
                            <div className="step-number">1</div>
                            <h3>Sign Up</h3>
                            <p>Create your MediSync account in minutes</p>
                        </div>
                        <div className="step">
                            <div className="step-number">2</div>
                            <h3>Connect</h3>
                            <p>Link your healthcare providers to your account</p>
                        </div>
                        <div className="step">
                            <div className="step-number">3</div>
                            <h3>Manage</h3>
                            <p>Easily manage your healthcare from one place</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="section testimonials">
                <h2>What Our Users Say</h2>
                <div className="testimonial-slider">
                    <div className="testimonial-container">
                        {getVisibleTestimonials().map((index, i) => (
                            <div key={i} className="testimonial" style={{ opacity }}>
                                <div className="testimonial-content">
                                    <FaQuoteLeft className="quote-icon quote-left" />
                                    <p>{testimonials[index].content}</p>
                                    <FaQuoteRight className="quote-icon quote-right" />
                                </div>
                                <h4 className="testimonial-author">- {testimonials[index].author}</h4>
                            </div>
                        ))}
                    </div>
                    <button className="slider-arrow left-arrow" onClick={prevTestimonial}>
                        <FaArrowLeft />
                    </button>
                    <button className="slider-arrow right-arrow" onClick={nextTestimonial}>
                        <FaArrowRight />
                    </button>
                </div>
            </div>

            <div className="section">
                <div className="cta-section">
                    <h2>Ready to Take Control of Your Healthcare?</h2>
                    <p>Join MediSync today and experience healthcare management like never before.</p>
                    <Link to="/register-patient">
                        <button className="cta-button">Get Started <FaArrowRight /></button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
