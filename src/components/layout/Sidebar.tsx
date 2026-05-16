import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Library, Heart, Activity, LogIn } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/stores/useAuthStore';

export function Sidebar() {
  const user = useAuthStore((state) => state.user);

  return (
    <aside className="w-64 h-full bg-[#0a0a0a] border-r border-white/5 flex flex-col pt-6 pb-24 z-30 shrink-0">
      {/* Brand */}
      <div className="px-6 mb-8 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-[#111] border border-white/10 flex items-center justify-center mb-3 shadow-glow-sm overflow-hidden p-1">
          <img src="/panda_favicon.png" alt="Pandoos" className="w-full h-full object-cover rounded-full" />
        </div>
        <h1 className="text-2xl font-display font-bold text-white tracking-tight">Pandoos</h1>
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

      {/* Bottom Area: Login or Premium Badge */}
      <div className="px-4 mt-auto flex flex-col gap-3">
        {!user && (
          <NavLink
            to="/login"
            className="flex items-center justify-center gap-2 w-full py-3 bg-white text-black rounded-xl font-bold hover:scale-105 transition-transform"
          >
            <LogIn size={18} />
            Log In
          </NavLink>
        )}
        
        {user && (
          <div className="bg-gradient-to-r from-brand-primary/10 to-transparent p-4 rounded-xl border border-brand-primary/20">
            <h4 className="text-xs font-bold text-brand-primary uppercase tracking-wider mb-1">Premium Active</h4>
            <p className="text-[10px] text-white/50">High-Fidelity Audio + Sync</p>
          </div>
        )}
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
