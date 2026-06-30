import React from 'react';
import Logo from '../design-system/Logo.jsx';
import Icons from '../design-system/Icons.jsx';

export const AuthLeftPane = ({ subtitle }) => {
  return (
    <div 
      className="col-12 col-md-5 col-lg-6 d-flex flex-column justify-content-between p-4 p-md-5 text-white position-relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
        minHeight: '100%',
        zIndex: 1
      }}
    >
      {/* Animated Glowing blobs */}
      <div 
        className="position-absolute rounded-circle"
        style={{
          width: '450px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(43, 174, 155, 0.15) 0%, rgba(14, 165, 233, 0) 70%)',
          top: '-150px',
          left: '-150px',
          animation: 'pulseBlob 8s infinite alternate',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />
      <div 
        className="position-absolute rounded-circle"
        style={{
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(167, 139, 250, 0.12) 0%, rgba(124, 58, 237, 0) 70%)',
          bottom: '-150px',
          right: '-150px',
          animation: 'pulseBlob2 10s infinite alternate',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Header */}
      <div className="z-1 animate-fadeIn">
        <Logo size={36} variant="light" className="mb-4" />
      </div>

      {/* Middle Content: Mock Interface Illustration */}
      <div className="my-auto z-1 d-flex flex-column gap-5 py-4 w-100 max-w-lg">
        <div className="animate-slideUp">
          <h1 className="font-heading fw-bold display-6 mb-3 leading-tight" style={{ letterSpacing: '-1px' }}>
            The Operating System for Enterprise Collaboration.
          </h1>
          <p className="font-body text-slate-300 fs-6 leading-relaxed">
            {subtitle || "A unified workspace connecting task boards, departments, leave management, and real-time business insights."}
          </p>
        </div>

        {/* Premium Floating Mockups Container */}
        <div className="position-relative d-none d-lg-block w-100" style={{ height: '220px' }}>
          {/* Mockup Card 1: Project Progress */}
          <div 
            className="position-absolute p-3 rounded-4 glassmorphism border border-white border-opacity-10 shadow-lg animate-float"
            style={{
              width: '260px',
              top: '10px',
              left: '0px',
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(10px)',
              animationDelay: '0s'
            }}
          >
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="fs-9 fw-semibold text-slate-300 text-uppercase">Project Progress</span>
              <span className="badge bg-ws-primary-light text-ws-primary fs-9 fw-bold">65%</span>
            </div>
            <p className="fs-8 fw-bold mb-1.5 text-white">Aurora Design System</p>
            <div className="progress bg-white bg-opacity-10" style={{ height: '6px', borderRadius: '3px' }}>
              <div className="progress-bar bg-ws-primary" style={{ width: '65%', borderRadius: '3px' }}></div>
            </div>
            <div className="d-flex justify-content-between align-items-center mt-3 fs-9 text-slate-400">
              <span>Due: July 2026</span>
              <div className="avatar-group-mock d-flex align-items-center">
                <span className="mock-avatar bg-primary" style={{ zIndex: 3 }}>S</span>
                <span className="mock-avatar bg-success" style={{ marginLeft: '-6px', zIndex: 2 }}>D</span>
                <span className="mock-avatar bg-warning" style={{ marginLeft: '-6px', zIndex: 1 }}>M</span>
              </div>
            </div>
          </div>

          {/* Mockup Card 2: Upcoming Deadlines & Tasks */}
          <div 
            className="position-absolute p-3 rounded-4 glassmorphism border border-white border-opacity-10 shadow-lg animate-float"
            style={{
              width: '240px',
              top: '90px',
              right: '20px',
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(10px)',
              animationDelay: '1.5s'
            }}
          >
            <div className="d-flex align-items-center gap-2 mb-2">
              <Icons.Tasks size={14} className="text-ws-accent" />
              <span className="fs-9 fw-semibold text-slate-300 text-uppercase">Upcoming task</span>
            </div>
            <p className="fs-8 fw-bold text-white mb-1.5">Deploy API Gateway</p>
            <span className="badge bg-danger bg-opacity-25 text-danger border-0 fs-9 py-0.5 px-2">High Priority</span>
          </div>

          {/* Mockup Card 3: Quick Stats */}
          <div 
            className="position-absolute p-2.5 px-3.5 rounded-pill glassmorphism border border-white border-opacity-15 shadow-lg d-flex align-items-center gap-2 animate-float"
            style={{
              top: '-20px',
              right: '60px',
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(10px)',
              animationDelay: '0.7s'
            }}
          >
            <div className="bg-ws-success rounded-circle" style={{ width: '8px', height: '8px' }}></div>
            <span className="fs-8 text-white fw-semibold">Workspace Load: Normal</span>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="row g-3 mt-1.5 fs-8 text-slate-200">
          <div className="col-6 d-flex align-items-center gap-2.5">
            <div className="bg-white bg-opacity-10 p-2 rounded-3 text-ws-primary d-flex align-items-center justify-content-center">
              <Icons.User size={16} />
            </div>
            <div>
              <p className="mb-0 fw-semibold text-white">Employee Hub</p>
              <span className="fs-9 text-slate-400">Directory & Roles</span>
            </div>
          </div>
          <div className="col-6 d-flex align-items-center gap-2.5">
            <div className="bg-white bg-opacity-10 p-2 rounded-3 text-ws-secondary d-flex align-items-center justify-content-center">
              <Icons.Projects size={16} />
            </div>
            <div>
              <p className="mb-0 fw-semibold text-white">Project Tracking</p>
              <span className="fs-9 text-slate-400">Board & Timelines</span>
            </div>
          </div>
          <div className="col-6 d-flex align-items-center gap-2.5">
            <div className="bg-white bg-opacity-10 p-2 rounded-3 text-ws-accent-dark d-flex align-items-center justify-content-center">
              <Icons.Reports size={16} />
            </div>
            <div>
              <p className="mb-0 fw-semibold text-white">Real-time Analytics</p>
              <span className="fs-9 text-slate-400">Graphical Insights</span>
            </div>
          </div>
          <div className="col-6 d-flex align-items-center gap-2.5">
            <div className="bg-white bg-opacity-10 p-2 rounded-3 text-ws-success d-flex align-items-center justify-content-center">
              <Icons.Teams size={16} />
            </div>
            <div>
              <p className="mb-0 fw-semibold text-white">Team Collaboration</p>
              <span className="fs-9 text-slate-400">Secure Directives</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="z-1 mt-4">
        <span className="fs-9 text-slate-400">© {new Date().getFullYear()} WorkSphere Inc. All rights reserved.</span>
      </div>
    </div>
  );
};

export default AuthLeftPane;
