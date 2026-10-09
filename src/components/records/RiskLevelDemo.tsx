'use client';

import React, { useState } from 'react';
import { RiskLevel, RiskLevelProps, calculateRiskLevel, getRiskConfig } from './RiskLevel';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/cn';

// ---------------------------------------------------------------------------
// Demo Component
// ---------------------------------------------------------------------------

/**
 * RiskLevelDemo - Comprehensive demonstration of the RiskLevel component
 * 
 * Shows all variants, sizes, and interactive features of the RiskLevel component
 * including animated entrances, hover effects, tooltips, and accessibility features.
 */
export const RiskLevelDemo: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<RiskLevelProps['level']>(3);
  const [showAnimated, setShowAnimated] = useState(false);

  const triggerAnimation = () => {
    setShowAnimated(false);
    setTimeout(() => setShowAnimated(true), 100);
  };

  const config = getRiskConfig(selectedLevel);

  return (
    <div className="space-y-8 p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-white">Risk Level Visualization</h1>
        <p className="text-[#a0a9c9]">
          Sophisticated 5-star risk assessment with glassmorphism effects and accessibility support
        </p>
      </div>

      {/* Interactive Demo Section */}
      <Card className="glass-card">
        <div className="p-6 space-y-6">
          <h2 className="text-xl font-semibold text-white mb-4">Interactive Demo</h2>
          
          {/* Risk Level Selector */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-white">
              Select Risk Level:
            </label>
            <div className="flex flex-wrap gap-2">
              {([1, 2, 3, 4, 5] as const).map((level) => {
                const levelConfig = getRiskConfig(level);
                return (
                  <Button
                    key={level}
                    variant={selectedLevel === level ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setSelectedLevel(level)}
                    className="text-xs"
                  >
                    Level {level} - {levelConfig.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Selected Risk Level Display */}
          <div className="flex flex-col items-center space-y-4 py-8 bg-gradient-to-br from-[rgba(20,184,166,0.05)] to-[rgba(124,58,237,0.05)] rounded-lg border border-[rgba(255,255,255,0.1)]">
            <RiskLevel
              level={selectedLevel}
              size="lg"
              animated={showAnimated}
              interactive={true}
              showTooltip={true}
              onClick={() => console.log(`Risk Level ${selectedLevel} clicked`)}
            />
            
            <div className="text-center space-y-2">
              <Badge 
                variant="glass" 
                className={cn('text-sm', config.color)}
              >
                Risk Score: {selectedLevel * 20}%
              </Badge>
              <p className="text-sm text-[#a0a9c9] max-w-md">
                {config.description}
              </p>
            </div>

            <Button
              variant="tertiary"
              size="sm"
              onClick={triggerAnimation}
              className="mt-4"
            >
              Replay Animation
            </Button>
          </div>
        </div>
      </Card>

      {/* Size Variants */}
      <Card className="glass-card">
        <div className="p-6 space-y-6">
          <h2 className="text-xl font-semibold text-white">Size Variants</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(['sm', 'md', 'lg'] as const).map((size) => (
              <div key={size} className="text-center space-y-4">
                <h3 className="text-sm font-medium text-[#a0a9c9] uppercase tracking-wider">
                  {size.toUpperCase()}
                </h3>
                <div className="flex flex-col items-center space-y-3">
                  <RiskLevel
                    level={3}
                    size={size}
                    interactive={true}
                    showTooltip={true}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* All Risk Levels */}
      <Card className="glass-card">
        <div className="p-6 space-y-6">
          <h2 className="text-xl font-semibold text-white">All Risk Levels</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {([1, 2, 3, 4, 5] as const).map((level) => {
              const levelConfig = getRiskConfig(level);
              return (
                <div key={level} className="text-center space-y-4 p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)]">
                  <RiskLevel
                    level={level}
                    size="md"
                    animated={true}
                    interactive={true}
                    showTooltip={true}
                  />
                  
                  <div className="space-y-2">
                    <Badge 
                      variant={level <= 2 ? 'success' : level === 3 ? 'warning' : 'danger'}
                      size="sm"
                    >
                      Level {level}
                    </Badge>
                    <p className="text-xs text-[#a0a9c9] leading-relaxed">
                      {levelConfig.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Score-based Risk Calculation */}
      <Card className="glass-card">
        <div className="p-6 space-y-6">
          <h2 className="text-xl font-semibold text-white">Score-based Risk Calculation</h2>
          <p className="text-sm text-[#a0a9c9]">
            Demonstrates automatic risk level calculation from numeric scores (0-100)
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[15, 35, 55, 75, 95].map((score) => {
              const calculatedLevel = calculateRiskLevel(score);
              const config = getRiskConfig(calculatedLevel);
              
              return (
                <div key={score} className="text-center space-y-3 p-3 rounded-lg bg-[rgba(255,255,255,0.02)]">
                  <div className="text-lg font-bold text-white">{score}%</div>
                  
                  <RiskLevel
                    level={calculatedLevel}
                    size="sm"
                    interactive={true}
                    showTooltip={true}
                    tooltipContent={`Score: ${score}% - ${config.description}`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Accessibility Features */}
      <Card className="glass-card">
        <div className="p-6 space-y-6">
          <h2 className="text-xl font-semibold text-white">Accessibility Features</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-white mb-3">Keyboard Navigation</h3>
                <RiskLevel
                  level={4}
                  size="md"
                  interactive={true}
                  showTooltip={true}
                />
                <p className="text-xs text-[#a0a9c9] mt-2">
                  Focus with Tab, activate with Enter/Space
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-white mb-3">Screen Reader Support</h3>
                <RiskLevel
                  level={2}
                  size="md"
                  interactive={true}
                  showTooltip={true}
                />
                <p className="text-xs text-[#a0a9c9] mt-2">
                  ARIA labels and descriptions included
                </p>
              </div>
            </div>
            
            <div className="p-4 bg-[rgba(20,184,166,0.1)] rounded-lg border border-[rgba(20,184,166,0.2)]">
              <p className="text-sm text-[#a0a9c9]">
                <strong className="text-white">WCAG Compliance:</strong> All color combinations meet AA standards, 
                animations respect prefers-reduced-motion, focus indicators are clearly visible, 
                and semantic markup provides screen reader context.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RiskLevelDemo;