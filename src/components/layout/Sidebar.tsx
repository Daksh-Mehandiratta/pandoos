import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Library, Heart, Activity } from 'lucide-react';
import { cn } from '@/utils/cn';

export function Sidebar() {
  return (
    <aside className="w-64 h-full bg-[#0a0a0a] border-r border-white/5 flex flex-col pt-6 pb-24 z-30 shrink-0">
      {/* Brand */}
      <div className="px-6 mb-8 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-[#111] border border-white/10 flex items-center justify-center mb-3 shadow-glow-sm">
          <img src="/panda-icon.svg" alt="Pandoos" className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-display font-bold text-white tracking-tight">Pandoos</h1>
      </div>

      {/* Gamification Widget */}
      <div className="px-4 mb-8">
        <div className="bg-[#151515] rounded-xl p-3 border border-white/5 shadow-inner">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-white/10 text-white">Lv.1</span>
              <span className="text-sm font-semibold text-white/90">Panda Cub</span>
            </div>
            <span className="text-[10px] text-white/50 font-mono">0 XP</span>
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-brand-primary w-0 rounded-full" />
          </div>
          <p className="text-[10px] text-white/40 mt-1.5 text-center">100 XP to next level</p>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto scroll-container px-3 flex flex-col gap-6">
        
        <div>
          <h3 className="text-xs font-bold text-white/40 tracking-wider uppercase mb-3 px-3">Discover</h3>
          <div className="flex flex-col gap-1">
            <NavItem to="/" icon={<Home size={20} />} label="Home" />
            <NavItem to="/search" icon={<Compass size={20} />} label="Explore" />
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold text-white/40 tracking-wider uppercase mb-3 px-3">Your Space</h3>
          <div className="flex flex-col gap-1">
            <NavItem to="/library" icon={<Library size={20} />} label="Library" />
            <NavItem to="/liked" icon={<Heart size={20} />} label="Liked Songs" />
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold text-white/40 tracking-wider uppercase mb-3 px-3">Activity</h3>
          <div className="flex flex-col gap-1">
            <NavItem to="/stats" icon={<Activity size={20} />} label="Your Stats" />
          </div>
        </div>

      </nav>

      {/* Premium Badge */}
      <div className="px-4 mt-auto">
        <div className="bg-gradient-to-r from-brand-primary/10 to-transparent p-4 rounded-xl border border-brand-primary/20">
          <h4 className="text-xs font-bold text-brand-primary uppercase tracking-wider mb-1">Premium Active</h4>
          <p className="text-[10px] text-white/50">High-Fidelity Audio + Sync</p>
        </div>
      </div>
    </aside>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200",
        isActive 
          ? "bg-white/10 text-white shadow-sm" 
          : "text-white/60 hover:text-white hover:bg-white/5"
      )}
    >
      {icon}
      {label}
    </NavLink>
  );
}
