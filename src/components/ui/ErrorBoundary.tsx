import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Pandoos caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-[9999] bg-[#0a0f0d] flex flex-col items-center justify-center p-6 overflow-hidden">
          
          {/* Bamboo background elements */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-[10%] w-8 h-full bg-gradient-to-b from-green-900 via-green-800 to-green-900" style={{ boxShadow: 'inset 4px 0 10px rgba(0,0,0,0.5)' }} />
            <div className="absolute top-0 left-[25%] w-12 h-full bg-gradient-to-b from-green-900 via-green-800 to-green-900" style={{ boxShadow: 'inset -4px 0 12px rgba(0,0,0,0.5)' }} />
            <div className="absolute top-0 right-[15%] w-10 h-full bg-gradient-to-b from-green-900 via-green-800 to-green-900" style={{ boxShadow: 'inset 5px 0 15px rgba(0,0,0,0.5)' }} />
            <div className="absolute top-0 right-[35%] w-6 h-full bg-gradient-to-b from-green-900 via-green-800 to-green-900" style={{ boxShadow: 'inset -3px 0 8px rgba(0,0,0,0.5)' }} />
            {/* Horizontal bamboo lines (nodes) */}
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={`node-l1-${i}`} className="absolute left-[10%] w-8 h-1 bg-green-950" style={{ top: `${(i + 1) * 15}%` }} />
            ))}
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={`node-l2-${i}`} className="absolute left-[25%] w-12 h-1.5 bg-green-950" style={{ top: `${(i + 1) * 20}%` }} />
            ))}
          </div>

          <div className="relative z-10 max-w-md w-full flex flex-col items-center text-center">
            
            {/* Sad Panda Animation */}
            <div className="relative w-48 h-48 mb-8 flex justify-center items-center">
              {/* Glow */}
              <div className="absolute inset-0 bg-emerald-500/20 blur-[50px] rounded-full" />
              
              <div className="text-8xl relative z-10 animate-[bounce_3s_infinite_ease-in-out]">
                🐼
                {/* Sweat drop or tear */}
                <span className="absolute top-2 right-2 text-3xl opacity-80 animate-[ping_2s_infinite]">💧</span>
              </div>
              
              {/* Snapped Bamboo stick */}
              <div className="absolute -bottom-4 right-0 text-5xl transform rotate-[30deg]">
                🎋
              </div>
            </div>

            <h1 className="text-3xl font-display font-black text-white mb-3 tracking-tight drop-shadow-lg">
              Oops! The bamboo snapped.
            </h1>
            
            <p className="text-emerald-100/70 text-sm leading-relaxed mb-8 max-w-[280px] mx-auto">
              Don't worry, even the most zen pandas trip sometimes. We've dropped a few leaves, but we can easily replant them.
            </p>

            {/* Error Details (Only visible in development usually, but good for debugging) */}
            {import.meta.env.DEV && this.state.error && (
              <div className="w-full bg-black/40 border border-emerald-900/50 rounded-xl p-4 mb-8 text-left overflow-auto max-h-32 backdrop-blur-md">
                <p className="text-red-400 font-mono text-[10px] whitespace-pre-wrap">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-br from-emerald-500 to-green-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:shadow-[0_0_60px_rgba(16,185,129,0.5)] hover:-translate-y-1 active:translate-y-0 transition-all duration-300"
            >
              <span>Return to Sanctuary</span>
              <span className="text-xl group-hover:rotate-12 transition-transform">🍃</span>
              
              {/* Button inner glow */}
              <div className="absolute inset-0 rounded-2xl border border-white/20 pointer-events-none" />
            </button>

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
