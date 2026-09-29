import React from 'react';
import StarRating from '../common/StarRating';
import { FaQuoteLeft, FaCheckCircle } from 'react-icons/fa';

const sampleTestimonials = [
  {
    name: 'Aarav Sharma',
    city: 'Bengaluru',
    rating: 5,
    title: 'Flawless delivery and genuine product!',
    comment: 'Ordered the Sony noise-cancelling headphones and they arrived in less than 48 hours. Packaging was pristine and sound quality is unmatched. ShopEase is my new go-to store.'
  },
  {
    name: 'Priya Patel',
    city: 'Mumbai',
    rating: 5,
    title: 'Incredible customer care & returns',
    comment: 'The Nike running shoes fit like a glove! Checkout with the WELCOME10 coupon took less than 2 minutes and saved me ₹1,000. Highly satisfied with the smooth experience.'
  },
  {
    name: 'Rohit Verma',
    city: 'Delhi',
    rating: 5,
    title: 'Top tier artisanal products',
    comment: 'Purchased the Coorg Arabica whole beans and the french linen duvet set. Both exceeded all expectations in build quality. 10/10 recommend to all.'
  }
];

const ReviewsSection = () => {
  return (
    <section className="section" style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem auto' }}>
          <span className="section-tag">Happy Customers</span>
          <h2 className="section-title">Loved by Thousands Across India</h2>
          <p className="section-subtitle">Real experiences shared by our community of verified buyers.</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem'
        }}>
          {sampleTestimonials.map((t, i) => (
            <div
              key={i}
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
              }}
            >
              <FaQuoteLeft style={{ color: '#93c5fd', fontSize: '1.75rem', marginBottom: '1rem', opacity: 0.6 }} />

              <div style={{ marginBottom: '0.75rem' }}>
                <StarRating rating={t.rating} showCount={false} />
              </div>

              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                "{t.title}"
              </h4>

              <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.5rem', flexGrow: 1 }}>
                {t.comment}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.9rem'
                }}>
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h5 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    {t.name} <FaCheckCircle style={{ color: '#10b981', fontSize: '0.8rem' }} title="Verified Buyer" />
                  </h5>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{t.city} • Verified Purchase</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
