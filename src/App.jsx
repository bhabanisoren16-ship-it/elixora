import React, { useState } from 'react';
import Background from './components/Background';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import EventDetails from './components/EventDetails';
import LineupSection from './components/LineupSection';
import RegistrationPayment from './components/RegistrationPayment';
import SeniorSection from './components/SeniorSection';
import HolographicTicketModal from './components/HolographicTicketModal';
import { soundController } from './utils/audio';
import { Sparkles, Shield } from 'lucide-react';

export default function App() {
  const [passData, setPassData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePassGenerated = (generatedPass) => {
    setPassData(generatedPass);
    setIsModalOpen(true);
  };

  const handleScrollToRegister = () => {
    const el = document.getElementById('register');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-obsidian-950 text-slate-100 selection:bg-cyber-violet selection:text-white">
      
      {/* 1. Fullscreen Poster Background with 2D Lightning & No 3D Effect */}
      <Background />

      {/* 2. Top Navigation Bar */}
      <Navbar
        onOpenPass={() => setIsModalOpen(true)}
        hasGeneratedPass={!!passData}
      />

      {/* 3. Main Content Flow */}
      <main className="relative z-10 flex flex-col">
        {/* Hero Section */}
        <HeroSection onGrabPassClick={handleScrollToRegister} />

        {/* Event Details & Navigation Grid */}
        <EventDetails />

        {/* Festival Highlights & Lineup */}
        <LineupSection />

        {/* Registration & Dynamic UPI Payment */}
        <RegistrationPayment
          onPassGenerated={handlePassGenerated}
        />

        {/* Senior VIP Portal & Gated Access */}
        <SeniorSection
          onPassGenerated={handlePassGenerated}
        />
      </main>

      {/* 4. Interactive 3D Holographic Pass Modal */}
      {isModalOpen && passData && (
        <HolographicTicketModal
          passData={passData}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* 5. Footer */}
      <footer className="relative z-10 border-t border-white/10 glass-panel bg-obsidian-950/90 py-12 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyber-violet to-cyber-cyan p-[2px]">
              <div className="w-full h-full bg-obsidian-900 rounded-[10px] flex items-center justify-center font-outfit font-bold text-white text-sm">
                E
              </div>
            </div>
            <div>
              <span className="font-outfit font-extrabold text-lg text-white">ELIXORA 2.0</span>
              <p className="text-xs text-slate-400">The Official College Freshers' Experience</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-mono">
            <a href="#hero" className="hover:text-cyber-cyan transition-colors">BACK TO TOP</a>
            <a href="#details" className="hover:text-cyber-cyan transition-colors">EVENT BLUEPRINT</a>
            <a href="#venue" className="hover:text-cyber-cyan transition-colors">VENUE DIRECTIONS</a>
            <a href="#register" className="hover:text-cyber-cyan transition-colors">GET PASS</a>
            <a href="#seniors" className="hover:text-amber-400 text-amber-300 font-semibold transition-colors">SENIOR PORTAL</a>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <span>Organized by Student Council</span>
            <span>•</span>
            <span className="text-cyber-gold font-bold">#Elixora2.0</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/5 text-center text-xs text-slate-400 font-mono flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 ELIXORA 2.0 Cultural Directorate. All rights reserved.</p>
          <p className="text-slate-400 flex items-center justify-center gap-1">
            Engineered with 3D WebGL, Three.js & Tailwind CSS
          </p>
        </div>
      </footer>

    </div>
  );
}
