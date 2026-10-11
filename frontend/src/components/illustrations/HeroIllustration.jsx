import React from 'react';
import heroRobotHomeImg from '../../assets/illustrations/hero-robot-home.jpg';

export default function HeroIllustration() {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      maxWidth: '560px',
      margin: '0 auto'
    }}>
      {/* Decorative background glow */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '80%',
        height: '80%',
        background: 'radial-gradient(circle, rgba(220, 236, 181, 0.5) 0%, rgba(250, 248, 240, 0) 70%)',
        zIndex: 0,
        borderRadius: '50%'
      }} />

      {/* Main Illustration Container */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)',
        border: '4px solid #FFFFFF',
        backgroundColor: '#FFFFFF',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease'
      }}>
        <img
          src={heroRobotHomeImg}
          alt="UrjaBot the friendly electricity robot mascot waving hello in front of a sunny Indian solar home"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            objectFit: 'cover'
          }}
        />

        {/* Floating UrjaBot Speech Bubble Badge */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '10px 16px',
          borderRadius: 'var(--radius-full)',
          boxShadow: '0 6px 20px rgba(40, 89, 67, 0.15)',
          border: '1.5px solid var(--soft-lime)',
          backdropFilter: 'blur(4px)',
          animation: 'floatSlow 4.5s ease-in-out infinite'
        }}>
          <span style={{ fontSize: '18px', animation: 'robotWiggle 3s ease-in-out infinite' }}>👋</span>
          <div>
            <div style={{
              fontSize: '13px',
              fontWeight: 800,
              color: 'var(--primary-forest)',
              lineHeight: 1.2
            }}>
              "Meet UrjaBot!"
            </div>
            <div style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--text-muted)'
            }}>
              Your friendly electricity assistant
            </div>
          </div>
        </div>

        {/* Floating Solar & Green Energy Badge in upper corner */}
        <div style={{
          position: 'absolute',
          top: '18px',
          right: '18px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '8px 14px',
          borderRadius: 'var(--radius-full)',
          boxShadow: '0 4px 16px rgba(40, 89, 67, 0.12)',
          border: '1px solid var(--border-light)',
          backdropFilter: 'blur(4px)',
          animation: 'floatSlow 4s ease-in-out infinite 1s'
        }}>
          <div style={{
            width: '22px',
            height: '22px',
            borderRadius: '50%',
            backgroundColor: '#F59E0B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'rotateSun 20s linear infinite'
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#FFFFFF">
              <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0-5c.55 0 1 .45 1 1v2c0 .55-.45 1-1 1s-1-.45-1-1V3c0-.55.45-1 1-1zm0 18c.55 0 1 .45 1 1v2c0 .55-.45 1-1 1s-1-.45-1-1v-2c0-.55.45-1 1-1zm10-9c0 .55-.45 1-1 1h-2c-.55 0-1-.45-1-1s.45-1 1-1h2c.55 0 1 .45 1 1zM5 12c0 .55-.45 1-1 1H2c-.55 0-1-.45-1-1s.45-1 1-1h2c.55 0 1 .45 1 1z" />
            </svg>
          </div>
          <span style={{
            fontSize: '13px',
            fontWeight: 800,
            color: 'var(--primary-forest)'
          }}>
            Rooftop Solar Ready
          </span>
        </div>
      </div>
    </div>
  );
}
