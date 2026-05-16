import React from 'react';
import { motion } from 'framer-motion';
import { usePandaState } from '../hooks/usePandaState';
import { cn } from '@/utils/cn';

interface PandaMascotProps {
  className?: string;
  size?: number;
  emotion?: string;
}

/**
 * Premium Panda Mascot
 * An inline SVG animated via Framer Motion variants.
 * Reacts dynamically to the audio state via usePandaState hook.
 */
export function PandaMascot({ className, size = 120, emotion = 'neutral' }: PandaMascotProps) {
  const state = usePandaState(); // 'idle', 'listening', 'nodding', 'loading'

  const getMouthPath = () => {
    if (emotion === 'heartbroken' || emotion === 'sad') return "M80 145 Q100 130 120 145"; // Frown
    if (emotion === 'angry' || emotion === 'workout') return "M85 145 Q100 135 115 145"; // Angry mouth
    if (emotion === 'energy' || emotion === 'happy' || emotion === 'party' || emotion === 'romantic') return "M80 135 Q100 165 120 135"; // Big smile
    if (emotion === 'chill' || emotion === 'latenight') return "M85 140 Q100 145 115 140"; // Smirk
    if (emotion === 'sleepy') return "M90 140 Q100 145 110 140"; // Relaxed tiny mouth
    if (state === 'listening' || state === 'nodding') return "M100 135 Q85 155 75 140 M100 135 Q115 155 125 140";
    return "M100 135 Q90 150 80 145 M100 135 Q110 150 120 145";
  };

  const showGlasses = () => {
    // Never show glasses for these highly expressive emotions where eyes matter
    if (['sad', 'heartbroken', 'romantic', 'sleepy', 'angry', 'workout'].includes(emotion)) {
      return false;
    }
    // Always show glasses for cool/chill moods
    if (['chill', 'latenight', 'focus'].includes(emotion)) {
      return true;
    }
    // For happy, energy, or neutral, put glasses on only when vibing to music
    return state === 'nodding';
  };

  return (
    <div 
      className={cn("relative flex items-center justify-center pointer-events-none drop-shadow-2xl", className)}
      style={{ width: size, height: size }}
    >
      <motion.svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        // Base bounce for the whole body when nodding
        animate={state === 'nodding' ? { y: [0, -4, 0] } : { y: 0 }}
        transition={state === 'nodding' ? { repeat: Infinity, duration: 0.5, ease: "easeInOut" } : { duration: 0.5 }}
      >
        {/* ---- Head Base ---- */}
        {/* Ears */}
        <motion.circle 
          cx="45" cy="55" r="22" 
          fill="#111" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"
          animate={state === 'nodding' ? { y: [0, 2, 0] } : { y: 0 }}
          transition={{ repeat: Infinity, duration: 0.5 }}
        />
        <motion.circle 
          cx="155" cy="55" r="22" 
          fill="#111" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"
          animate={state === 'nodding' ? { y: [0, 2, 0] } : { y: 0 }}
          transition={{ repeat: Infinity, duration: 0.5 }}
        />

        {/* Face Structure */}
        <path d="M100 25 C145 25 180 55 180 100 C180 145 145 175 100 175 C55 175 20 145 20 100 C20 55 55 25 100 25 Z" fill="#F8F9FA" stroke="#E2E8F0" strokeWidth="2" />
        
        {/* Subtle blush */}
        <ellipse cx="50" cy="120" rx="12" ry="8" fill="#FFB7B2" opacity="0.4" />
        <ellipse cx="150" cy="120" rx="12" ry="8" fill="#FFB7B2" opacity="0.4" />

        {/* ---- Eyes / Glasses ---- */}
        {/* Left Eye Patch */}
        <path d="M45 80 C55 65 85 75 80 105 C75 135 40 120 45 80 Z" fill="#111" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        {/* Right Eye Patch */}
        <path d="M155 80 C145 65 115 75 120 105 C125 135 160 120 155 80 Z" fill="#111" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

        {/* The Pupils (Hide if sleepy) */}
        {emotion !== 'sleepy' && emotion !== 'romantic' && (
          <motion.g
            animate={
              state === 'loading' ? { scale: [1, 1.2, 1], opacity: [1, 0.5, 1] } :
              (emotion === 'chill' || emotion === 'latenight') ? { scaleY: 0.5 } : // Half closed eyes
              (emotion === 'angry' || emotion === 'workout') ? { scaleY: 0.8, scaleX: 1.1 } : // Intense
              state === 'idle' ? { scaleY: [1, 0.1, 1] } : // Blinking
              { scaleY: 1 }
            }
            transition={
              state === 'loading' ? { repeat: Infinity, duration: 1 } :
              state === 'idle' ? { repeat: Infinity, repeatDelay: 4, duration: 0.2 } :
              {}
            }
          >
            {/* Left Pupil */}
            <circle cx="65" cy="95" r="6" fill="#FFF" />
            <circle cx="68" cy="92" r="2" fill="#FFF" opacity="0.8" />
            {/* Right Pupil */}
            <circle cx="135" cy="95" r="6" fill="#FFF" />
            <circle cx="132" cy="92" r="2" fill="#FFF" opacity="0.8" />
          </motion.g>
        )}

        {/* Romantic Heart Eyes */}
        {emotion === 'romantic' && (
          <motion.g fill="#ef4444" animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}>
            <path d="M65 105 Q 50 85 65 75 Q 80 85 65 105" />
            <path d="M135 105 Q 120 85 135 75 Q 150 85 135 105" />
          </motion.g>
        )}

        {/* Sleepy Eyes (Closed) */}
        {emotion === 'sleepy' && (
          <g stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6">
            <path d="M55 95 Q 65 105 75 95" />
            <path d="M125 95 Q 135 105 145 95" />
          </g>
        )}

        {/* Angry Eyebrows */}
        {(emotion === 'angry' || emotion === 'workout') && (
          <motion.g stroke="#111" strokeWidth="5" strokeLinecap="round">
            <path d="M40 70 L75 85" />
            <path d="M160 70 L125 85" />
          </motion.g>
        )}

        {/* Sad Tear Drop */}
        {(emotion === 'heartbroken' || emotion === 'sad') && (
          <motion.path
            d="M 65 105 Q 60 115 65 120 Q 70 115 65 105"
            fill="#3b82f6"
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: [0, 10, 20], opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeIn" }}
          />
        )}

        {/* Sleepy Zzz */}
        {emotion === 'sleepy' && (
          <motion.text 
            x="145" y="30" fill="#fff" fontSize="24" fontFamily="monospace" fontWeight="bold" opacity="0.7"
            animate={{ y: [0, -15, -30], opacity: [0, 0.7, 0], x: [0, 5, -5] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeOut" }}
          >
            Z
          </motion.text>
        )}

        {/* Sunglasses */}
        <motion.g
          initial={{ y: -50, opacity: 0 }}
          animate={
            showGlasses() ? { y: 0, opacity: 1 } :
            { y: -20, opacity: 0 }
          }
          transition={{ type: 'spring', damping: 15 }}
        >
          <path d="M30 85 L170 85 L160 115 C155 125 140 125 135 115 L100 95 L65 115 C60 125 45 125 40 115 Z" fill="#0f172a" />
          <path d="M35 85 L85 85 L75 110 C70 115 50 115 45 110 Z" fill="url(#glass-gradient)" opacity="0.5" />
          <path d="M115 85 L165 85 L155 110 C150 115 130 115 125 110 Z" fill="url(#glass-gradient)" opacity="0.5" />
          {/* Bridge */}
          <path d="M85 85 L115 85" stroke="#0f172a" strokeWidth="4" />
        </motion.g>

        {/* ---- Nose & Mouth ---- */}
        <path d="M90 125 Q100 120 110 125 Q105 135 100 135 Q95 135 90 125 Z" fill="#222" />
        <motion.path 
          d={getMouthPath()} 
          stroke="#222" strokeWidth="3" strokeLinecap="round" fill={(emotion === 'energy' || emotion === 'happy' || emotion === 'party' || emotion === 'romantic') ? '#ff7b72' : 'none'}
          animate={{ d: getMouthPath() }}
          transition={{ duration: 0.3 }}
        />

        {/* Gradients */}
        <defs>
          <linearGradient id="glass-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
      </motion.svg>
    </div>
  );
}

