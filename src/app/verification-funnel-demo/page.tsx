'use client'

import React, { useState } from 'react'
import { VerificationFunnel, type FunnelStage } from '@/components/analytics/VerificationFunnel'

export default function VerificationFunnelDemo() {
  const [hoveredStage, setHoveredStage] = useState<string | null>(null)
  const [showPercentages, setShowPercentages] = useState(true)
  const [animated, setAnimated] = useState(true)

  // Sample data scenarios
  const scenarios = {
    normal: [
      { id: 'submitted', label: 'Records Submitted', count: 5847, description: 'Total records submitted for verification' },
      { id: 'verified', label: 'Records Verified', count: 4923, description: 'Successfully verified records' },
      { id: 'matched', label: 'Matched', count: 3456, description: 'Records with confidence matches' },
      { id: 'flagged', label: 'Flagged', count: 1467, description: 'Records with issues detected' },
      { id: 'resolved', label: 'Resolved', count: 892, description: 'Issues successfully resolved' }
    ] as FunnelStage[],
    highConversion: [
      { id: 'submitted', label: 'Submitted', count: 2000, description: 'Initial submissions' },
      { id: 'verified', label: 'Verified', count: 1950, description: 'Verified records' },
      { id: 'matched', label: 'Matched', count: 1900, description: 'Matched records' },
      { id: 'flagged', label: 'Flagged', count: 150, description: 'Flagged records' },
      { id: 'resolved', label: 'Resolved', count: 140, description: 'Resolved records' }
    ] as FunnelStage[],
    lowConversion: [
      { id: 'submitted', label: 'Submitted', count: 10000, description: 'Initial submissions' },
      { id: 'verified', label: 'Verified', count: 5000, description: 'Verified records' },
      { id: 'matched', label: 'Matched', count: 2000, description: 'Matched records' },
      { id: 'flagged', label: 'Flagged', count: 500, description: 'Flagged records' },
      { id: 'resolved', label: 'Resolved', count: 100, description: 'Resolved records' }
    ] as FunnelStage[]
  }

  const [selectedScenario, setSelectedScenario] = useState<keyof typeof scenarios>('normal')
  const currentStages = scenarios[selectedScenario]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">Verification Funnel Demo</h1>
          <p className="text-lg text-[#a0a9c9]">Advanced funnel visualization with glassmorphism design and Aurora colors</p>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Scenario Selector */}
          <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)]">
            <label className="block text-sm font-semibold text-white mb-2">Data Scenario</label>
            <select
              value={selectedScenario}
              onChange={(e) => setSelectedScenario(e.target.value as keyof typeof scenarios)}
              className="w-full px-3 py-2 rounded-lg bg-[#1a1f3a] border border-[#3a4254] text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6]"
            >
              <option value="normal">Normal Funnel</option>
              <option value="highConversion">High Conversion (93%)</option>
              <option value="lowConversion">Low Conversion (19%)</option>
            </select>
          </div>

          {/* Toggle Percentages */}
          <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)]">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={showPercentages}
                onChange={(e) => setShowPercentages(e.target.checked)}
                className="w-4 h-4 rounded accent-[#14b8a6]"
              />
              <span className="text-sm font-semibold text-white">Show Percentages</span>
            </label>
          </div>

          {/* Toggle Animations */}
          <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)]">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={animated}
                onChange={(e) => setAnimated(e.target.checked)}
                className="w-4 h-4 rounded accent-[#14b8a6]"
              />
              <span className="text-sm font-semibold text-white">Enable Animations</span>
            </label>
          </div>
        </div>

        {/* Main Chart */}
        <VerificationFunnel
          stages={currentStages}
          showPercentages={showPercentages}
          animated={animated}
          onStageHover={setHoveredStage}
        />

        {/* Hover Info */}
        {hoveredStage && (
          <div className="mt-6 p-4 rounded-lg bg-[rgba(20,184,166,0.1)] border border-[rgba(20,184,166,0.3)]">
            <p className="text-sm text-[#a0a9c9]">
              Hovering over: <span className="text-[#14b8a6] font-semibold">{hoveredStage}</span>
            </p>
          </div>
        )}

        {/* Documentation */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Features */}
          <div className="p-6 rounded-xl bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)]">
            <h2 className="text-lg font-bold text-white mb-4">Features</h2>
            <ul className="space-y-2 text-sm text-[#a0a9c9]">
              <li className="flex items-center gap-2">
                <span className="text-[#10b981]">✓</span>
                Horizontal funnel bars with decreasing width
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#10b981]">✓</span>
                Color-coded stages (green to red gradient)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#10b981]">✓</span>
                Smooth animations as stages appear
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#10b981]">✓</span>
                Hover tooltips with detailed metrics
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#10b981]">✓</span>
                Real-time drop-off indicators
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#10b981]">✓</span>
                Summary statistics (conversion, drop-off)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#10b981]">✓</span>
                Glassmorphism with Aurora colors
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#10b981]">✓</span>
                Full accessibility (WCAG AA)
              </li>
            </ul>
          </div>

          {/* Usage */}
          <div className="p-6 rounded-xl bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)]">
            <h2 className="text-lg font-bold text-white mb-4">Usage</h2>
            <pre className="text-xs text-[#a0a9c9] bg-[#1a1f3a] p-3 rounded overflow-auto">
{`<VerificationFunnel
  stages={stages}
  showPercentages={true}
  animated={true}
  onStageHover={handleHover}
/>`}
            </pre>
            <p className="text-xs text-[#6b7280] mt-3">
              Import from: <code className="text-[#14b8a6]">@/components/analytics</code>
            </p>
          </div>
        </div>

        {/* Technical Details */}
        <div className="mt-6 p-6 rounded-xl bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)]">
          <h2 className="text-lg font-bold text-white mb-4">Technical Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-[#a0a9c9]">
            <div>
              <h3 className="font-semibold text-white mb-2">Color Scheme</h3>
              <ul className="space-y-1">
                <li>• <span className="text-[#10b981]">Green</span>: Records Submitted (baseline)</li>
                <li>• <span className="text-[#14b8a6]">Teal</span>: Records Verified (good)</li>
                <li>• <span className="text-[#3b82f6]">Blue</span>: Matched (neutral)</li>
                <li>• <span className="text-[#f59e0b]">Amber</span>: Flagged (warning)</li>
                <li>• <span className="text-[#ef4444]">Red</span>: Resolved (complete)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Calculations</h3>
              <ul className="space-y-1">
                <li>• Percentage: (count / max_count) × 100</li>
                <li>• Drop-off: ((prev_count - count) / prev_count) × 100</li>
                <li>• Conversion: (final_count / initial_count) × 100</li>
                <li>• Total Loss: initial_count - final_count</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Current Data Summary */}
        <div className="mt-6 p-6 rounded-xl bg-[rgba(20,184,166,0.1)] border border-[rgba(20,184,166,0.2)]">
          <h2 className="text-lg font-bold text-white mb-4">Current Data Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-[#a0a9c9] mb-1">Initial Count</div>
              <div className="text-2xl font-bold text-[#10b981]">{currentStages[0]?.count.toLocaleString() || 0}</div>
            </div>
            <div>
              <div className="text-xs text-[#a0a9c9] mb-1">Final Count</div>
              <div className="text-2xl font-bold text-[#ef4444]">{currentStages[currentStages.length - 1]?.count.toLocaleString() || 0}</div>
            </div>
            <div>
              <div className="text-xs text-[#a0a9c9] mb-1">Conversion Rate</div>
              <div className="text-2xl font-bold text-[#14b8a6]">
                {currentStages.length > 0
                  ? ((currentStages[currentStages.length - 1].count / currentStages[0].count) * 100).toFixed(1)
                  : 0}%
              </div>
            </div>
            <div>
              <div className="text-xs text-[#a0a9c9] mb-1">Total Drop-off</div>
              <div className="text-2xl font-bold text-[#f59e0b]">
                {currentStages.length > 0
                  ? (100 - ((currentStages[currentStages.length - 1].count / currentStages[0].count) * 100)).toFixed(1)
                  : 0}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
