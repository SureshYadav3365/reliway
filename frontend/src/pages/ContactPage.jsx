import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock, FaPaperPlane } from 'react-icons/fa';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      toast.error('Please fill in required fields');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      toast.success('Your message has been received! Our support team will call you within 2 business hours.');
      setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
      setSubmitting(false);
    }, 600);
  };

  return (
    <div className="section" style={{ paddingTop: '3rem' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="section-tag">24/7 Assistance</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', margin: '0.5rem 0' }}>
            We're Here to Help
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
            Have a question about an order, tracking, returns or product specifications? Contact our customer support specialists.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 360px) 1fr',
          gap: '2.5rem',
          alignItems: 'start'
        }} className="contact-grid">
          {/* Support Channels Info */}
          <div style={{
            backgroundColor: '#0f172a',
            color: '#ffffff',
            borderRadius: '20px',
            padding: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem'
          }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              Contact Channels
            </h3>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <FaPhoneAlt style={{ color: '#60a5fa', fontSize: '1.25rem', marginTop: '4px' }} />
              <div>
                <h5 style={{ margin: '0 0 0.2rem 0', color: '#ffffff', fontSize: '0.95rem' }}>Customer Helpline</h5>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.88rem' }}>+91 99999 99999</p>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.78rem' }}>Mon-Sat: 9:00 AM - 8:00 PM</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <FaEnvelope style={{ color: '#34d399', fontSize: '1.25rem', marginTop: '4px' }} />
              <div>
                <h5 style={{ margin: '0 0 0.2rem 0', color: '#ffffff', fontSize: '0.95rem' }}>Email Support</h5>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.88rem' }}>support@shopease.com</p>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.78rem' }}>Response within 4 hours</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <FaMapMarkerAlt style={{ color: '#fbbf24', fontSize: '1.25rem', marginTop: '4px' }} />
              <div>
                <h5 style={{ margin: '0 0 0.2rem 0', color: '#ffffff', fontSize: '0.95rem' }}>Corporate Office</h5>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.88rem' }}>
                  Suite 404, Tech Park, Outer Ring Road, Bengaluru, Karnataka, 560103
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <FaClock style={{ color: '#c084fc', fontSize: '1.25rem', marginTop: '4px' }} />
              <div>
                <h5 style={{ margin: '0 0 0.2rem 0', color: '#ffffff', fontSize: '0.95rem' }}>Dispatch Schedule</h5>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.88rem' }}>Same-day dispatch for orders before 2:00 PM</p>
              </div>
            </div>
          </div>

          {/* Contact Message Form */}
          <div className="card" style={{ padding: '2.5rem' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1.5rem', color: '#0f172a' }}>
              Send Us a Message
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-responsive">
                <div className="form-group">
                  <label className="form-label">Your Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address (Optional)</label>
                <input
                  type="email"
                  className="form-control"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Order Tracking Enquiry"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Message *</label>
                <textarea
                  rows={4}
                  className="form-control"
                  placeholder="How can we help you today?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: '0.5rem', gap: '0.5rem' }}
              >
                <FaPaperPlane /> {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
          .form-responsive { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default ContactPage;
