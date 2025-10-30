import React, { useState } from 'react';
import { apiRequest } from '../utils/api';

const ContactPage = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleContactFormChange = (e) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  const sendMessage = async () => {
    const { name, email, subject, message } = contactForm;
    if (!name || !email || !subject || !message) {
      alert('Please fill in all fields');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return;
    }
    try {
      await apiRequest('/contacts', { method: 'POST', body: { name, email, subject, message }, auth: false });
      alert('Thank you for your message! We will get back to you soon.');
      setContactForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      alert('Failed to send message');
    }
  };

  return (
    <div className="container">
      <div className="section-title">
        <h1>📞 Contact Us</h1>
        <p className="subtitle">Get in touch with our construction experts</p>
      </div>

      <div className="planning-content">
        <div className="card">
          <h2><span>📧</span>Send Message</h2>

          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="name" value={contactForm.name} onChange={handleContactFormChange} placeholder="Enter your name" />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" value={contactForm.email} onChange={handleContactFormChange} placeholder="Enter your email" />
          </div>
          <div className="form-group">
            <label>Subject</label>
            <input type="text" name="subject" value={contactForm.subject} onChange={handleContactFormChange} placeholder="Enter subject" />
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea name="message" value={contactForm.message} onChange={handleContactFormChange} placeholder="Enter your message" style={{height: '120px', resize: 'vertical'}} />
          </div>

          <button className="btn" onClick={sendMessage}>📤 Send Message</button>
        </div>

        <div className="card">
          <h2><span>📍</span>Contact Information</h2>

          <div style={{marginBottom: '20px'}}>
            <h4 style={{color: '#667eea', marginBottom: '10px'}}>📧 Email</h4>
            <p style={{color: '#666'}}>2312121@nec.edu.in</p>
            <p style={{color: '#666'}}>karthikeyanbharathi005@gmail.com</p>
          </div>

          <div style={{marginBottom: '20px'}}>
            <h4 style={{color: '#667eea', marginBottom: '10px'}}>📞 Phone</h4>
            <p style={{color: '#666'}}>9486049112</p>
            <p style={{color: '#666'}}>9123530692</p>
          </div>

          <div style={{marginBottom: '20px'}}>
            <h4 style={{color: '#667eea', marginBottom: '10px'}}>📍 Address</h4>
            <p style={{color: '#666'}}>10/b11 kella shanmugapuram<br/>
            Arumuganeri, thoothukudi dist,tamil nadu<br/>
            india</p>
          </div>

          <div style={{marginBottom: '20px'}}>
            <h4 style={{color: '#667eea', marginBottom: '10px'}}>🕒 Business Hours</h4>
            <p style={{color: '#666'}}>Monday - Friday: 8:00 AM - 6:00 PM</p>
            <p style={{color: '#666'}}>Saturday: 9:00 AM - 4:00 PM</p>
          </div>

          <div style={{marginTop: '30px'}}>
            <h4 style={{color: '#667eea', marginBottom: '15px'}}>🗺️ Find Us</h4>
            <div style={{
              width: '100%',
              height: '300px',
              borderRadius: '14px',
              overflow: 'hidden',
              border: '2px solid #e2e8f0'
            }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d63129.81846216085!2d78.06498774585909!3d8.536835675480448!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1zMTAvYjExIEtlZWxhIHNoYW5tdWdhIHB1cmFtIOCuleCvgOCutOCumuCuo-CvjeCuruCvgeCuleCuquCvgeCusOCuruCvjQ!5e0!3m2!1sen!2sin!4v1759681050064!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{border: 0}}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Location Map"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
