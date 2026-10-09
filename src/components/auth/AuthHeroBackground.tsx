'use client'

import React from 'react'
import { cn } from '@/lib/cn'
import { colors } from '@/lib/design-tokens'

interface AuthHeroBackgroundProps {
  className?: string
  children?: React.ReactNode
}

export function AuthHeroBackground({ className, children }: AuthHeroBackgroundProps) {
  return (
    <div className={cn(
      "relative overflow-hidden",
      "bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#252d48]",
      "min-h-screen",
      className
    )}>
      {/* Main Aurora Gradient Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-60"
          style={{
            background: `
              radial-gradient(circle at 20% 20%, ${colors.auroraTeal}40 0%, transparent 50%),
              radial-gradient(circle at 80% 30%, ${colors.auroraPurple}35 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, ${colors.auroraGreen}30 0%, transparent 50%),
              linear-gradient(135deg, ${colors.auroraTeal}15 0%, ${colors.auroraPurple}20 50%, ${colors.auroraGreen}15 100%)
            `
          }}
        />
      </div>

      {/* Animated Geometric Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Orbs */}
        <div 
          className="absolute w-96 h-96 rounded-full opacity-20 animate-float-slow"
          style={{
            background: `radial-gradient(circle, ${colors.auroraTeal}60 0%, transparent 70%)`,
            top: '10%',
            left: '15%',
            filter: 'blur(40px)',
            animation: 'float-orb-1 20s ease-in-out infinite'
          }}
        />
        
        <div 
          className="absolute w-64 h-64 rounded-full opacity-25 animate-float-medium"
          style={{
            background: `radial-gradient(circle, ${colors.auroraPurple}50 0%, transparent 70%)`,
            top: '60%',
            right: '20%',
            filter: 'blur(30px)',
            animation: 'float-orb-2 15s ease-in-out infinite reverse'
          }}
        />

        <div 
          className="absolute w-48 h-48 rounded-full opacity-30"
          style={{
            background: `radial-gradient(circle, ${colors.auroraGreen}40 0%, transparent 70%)`,
            bottom: '20%',
            left: '10%',
            filter: 'blur(25px)',
            animation: 'float-orb-3 18s ease-in-out infinite'
          }}
        />

        {/* Geometric Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg 
            width="100%" 
            height="100%" 
            xmlns="http://www.w3.org/2000/svg"
            className="animate-grid-drift"
          >
            <defs>
              <pattern 
                id="grid" 
                width="60" 
                height="60" 
                patternUnits="userSpaceOnUse"
              >
                <circle 
                  cx="30" 
                  cy="30" 
                  r="1" 
                  fill={colors.auroraTeal}
                  fillOpacity="0.3"
                />
                <path 
                  d="M 0 30 L 60 30 M 30 0 L 30 60" 
                  stroke={colors.auroraTeal}
                  strokeWidth="0.5"
                  strokeOpacity="0.2"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Animated Lines */}
        <div className="absolute inset-0 opacity-20">
          <div 
            className="absolute h-px bg-gradient-to-r from-transparent via-current to-transparent"
            style={{
              width: '200%',
              top: '25%',
              left: '-50%',
              color: colors.auroraTeal,
              animation: 'drift-right 25s linear infinite'
            }}
          />
          <div 
            className="absolute h-px bg-gradient-to-r from-transparent via-current to-transparent"
            style={{
              width: '150%',
              top: '65%',
              right: '-25%',
              color: colors.auroraPurple,
              animation: 'drift-left 30s linear infinite'
            }}
          />
          <div 
            className="absolute w-px bg-gradient-to-b from-transparent via-current to-transparent"
            style={{
              height: '150%',
              left: '75%',
              top: '-25%',
              color: colors.auroraGreen,
              animation: 'drift-down 20s linear infinite'
            }}
          />
        </div>

        {/* Particle Effect */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full opacity-40"
              style={{
                background: [colors.auroraTeal, colors.auroraPurple, colors.auroraGreen][i % 3],
                left: `${10 + (i * 6)}%`,
                top: `${20 + (i * 4)}%`,
                animation: `particle-float-${(i % 3) + 1} ${12 + (i % 3)}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* CSS Animations in style tag */}
      <style jsx>{`
        @keyframes float-orb-1 {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) scale(1); 
          }
          25% { 
            transform: translateY(-20px) translateX(10px) scale(1.05); 
          }
          50% { 
            transform: translateY(-40px) translateX(-10px) scale(1.1); 
          }
          75% { 
            transform: translateY(-20px) translateX(15px) scale(1.05); 
          }
        }

        @keyframes float-orb-2 {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) scale(1); 
          }
          33% { 
            transform: translateY(15px) translateX(-20px) scale(0.95); 
          }
          66% { 
            transform: translateY(-25px) translateX(10px) scale(1.08); 
          }
        }

        @keyframes float-orb-3 {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) scale(1); 
          }
          50% { 
            transform: translateY(-30px) translateX(20px) scale(1.15); 
          }
        }

        @keyframes grid-drift {
          0% { transform: translateX(0px) translateY(0px); }
          100% { transform: translateX(-60px) translateY(-60px); }
        }

        @keyframes drift-right {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(50%); }
        }

        @keyframes drift-left {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-50%); }
        }

        @keyframes drift-down {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(50%); }
        }

        @keyframes particle-float-1 {
          0%, 100% { 
            transform: translateY(0px) translateX(0px); 
            opacity: 0.4; 
          }
          50% { 
            transform: translateY(-20px) translateX(10px); 
            opacity: 0.8; 
          }
        }

        @keyframes particle-float-2 {
          0%, 100% { 
            transform: translateY(0px) translateX(0px); 
            opacity: 0.3; 
          }
          50% { 
            transform: translateY(15px) translateX(-15px); 
            opacity: 0.7; 
          }
        }

        @keyframes particle-float-3 {
          0%, 100% { 
            transform: translateY(0px) translateX(0px); 
            opacity: 0.5; 
          }
          50% { 
            transform: translateY(-10px) translateX(20px); 
            opacity: 0.9; 
          }
        }

        .animate-grid-drift {
          animation: grid-drift 40s linear infinite;
        }
      `}</style>
    </div>
  )
}

export default AuthHeroBackground
