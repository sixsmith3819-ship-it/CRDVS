'use client';

import React, { useState } from 'react';
import { Container } from '@/components/layout/Container';
import { Grid } from '@/components/layout/Grid';
import { OffenseCategoryChart, OffenseCategory } from '@/components/analytics';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

/**
 * Demo page for the OffenseCategoryChart component
 * Shows various configurations and use cases
 */
export default function OffenseChartDemoPage() {
  // Sample data for the chart
  const defaultData: OffenseCategory[] = [
    { name: 'Assault', count: 245, color: '#14b8a6' },
    { name: 'Theft', count: 189, color: '#7c3aed' },
    { name: 'Fraud', count: 156, color: '#10b981' },
    { name: 'Traffic', count: 98, color: '#f59e0b' },
    { name: 'Drug Offense', count: 112, color: '#3b82f6' },
    { name: 'Cybercrime', count: 67, color: '#8b5cf6' },
    { name: 'Other', count: 85, color: '#ec4899' },
  ];

  const [selectedCategory, setSelectedCategory] = useState<OffenseCategory | null>(null);
  const [filteredData, setFilteredData] = useState<OffenseCategory[]>(defaultData);

  const handleSegmentClick = (category: OffenseCategory) => {
    setSelectedCategory(category);
  };

  const handleResetFilter = () => {
    setSelectedCategory(null);
    setFilteredData(defaultData);
  };

  const handleFilterByCategory = (category: OffenseCategory) => {
    setFilteredData([category]);
  };

  return (
    <div className="min-h-screen bg-primary-black text-text-primary py-12">
      <Container>
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Offense Category Distribution Chart</h1>
          <p className="text-text-secondary text-lg">
            Interactive donut chart visualization for criminal record analytics
          </p>
        </div>

        {/* Main Chart */}
        <div className="mb-12">
          <OffenseCategoryChart
            data={filteredData}
            title="Offense Category Distribution"
            subtitle={
              selectedCategory
                ? `Filtered: Showing ${selectedCategory.name}`
                : 'All offense categories'
            }
            onSegmentClick={handleSegmentClick}
          />
        </div>

        {/* Selected Category Info */}
        {selectedCategory && (
          <Card className="mb-12 bg-surface border border-elevation">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-4">Selected Category</h3>
                <div className="space-y-2">
                  <p className="text-text-primary">
                    <span className="text-text-secondary">Category: </span>
                    {selectedCategory.name}
                  </p>
                  <p className="text-text-primary">
                    <span className="text-text-secondary">Count: </span>
                    {selectedCategory.count.toLocaleString()}
                  </p>
                  <p className="text-text-primary">
                    <span className="text-text-secondary">Percentage: </span>
                    {(
                      (selectedCategory.count /
                        defaultData.reduce((sum, item) => sum + item.count, 0)) *
                      100
                    ).toFixed(1)}
                    %
                  </p>
                </div>
              </div>
              <div
                className="w-12 h-12 rounded-lg"
                style={{ backgroundColor: selectedCategory.color }}
              />
            </div>
          </Card>
        )}

        {/* Controls */}
        <Card className="mb-12 bg-surface border border-elevation">
          <h3 className="text-lg font-semibold mb-4">Chart Controls</h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Button variant="secondary" onClick={handleResetFilter} size="sm">
              Show All Data
            </Button>
            {defaultData.map((category) => (
              <Button
                key={category.name}
                variant={
                  filteredData.length === 1 &&
                  filteredData[0].name === category.name
                    ? 'primary'
                    : 'secondary'
                }
                onClick={() => handleFilterByCategory(category)}
                size="sm"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </Card>

        {/* Feature Showcase */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Feature Showcase</h2>
          <Grid cols={{ mobile: 1, tablet: 2, desktop: 2 }} gap="base">
            {/* Feature 1: 5-7 Categories */}
            <Card>
              <h4 className="text-lg font-semibold mb-3">✓ 5-7 Offense Categories</h4>
              <p className="text-text-secondary">
                Displays up to 7 different offense types: Assault, Theft, Fraud,
                Traffic, Drug Offense, Cybercrime, and Other categories.
              </p>
            </Card>

            {/* Feature 2: Aurora Palette */}
            <Card>
              <h4 className="text-lg font-semibold mb-3">✓ Aurora Palette Colors</h4>
              <p className="text-text-secondary">
                Uses distinct, high-contrast colors from the Aurora gradient palette
                for clear visual distinction between categories.
              </p>
            </Card>

            {/* Feature 3: Labels & Percentages */}
            <Card>
              <h4 className="text-lg font-semibold mb-3">✓ Labels with Percentages</h4>
              <p className="text-text-secondary">
                Each category displays percentage and count in both the legend and
                on the chart segments for easy reference.
              </p>
            </Card>

            {/* Feature 4: Legend */}
            <Card>
              <h4 className="text-lg font-semibold mb-3">✓ Interactive Legend</h4>
              <p className="text-text-secondary">
                Legend appears below or beside the chart and allows hovering to
                highlight corresponding chart segments.
              </p>
            </Card>

            {/* Feature 5: Glassmorphism */}
            <Card>
              <h4 className="text-lg font-semibold mb-3">✓ Glassmorphism Design</h4>
              <p className="text-text-secondary">
                Card uses glassmorphic background styling with backdrop blur and
                semi-transparent borders for premium appearance.
              </p>
            </Card>

            {/* Feature 6: Center Display */}
            <Card>
              <h4 className="text-lg font-semibold mb-3">✓ Center Total Display</h4>
              <p className="text-text-secondary">
                Center of the donut displays the total number of offenses and
                summary statistics below the chart.
              </p>
            </Card>

            {/* Feature 7: Hover Effects */}
            <Card>
              <h4 className="text-lg font-semibold mb-3">✓ Interactive Hover Effects</h4>
              <p className="text-text-secondary">
                Segments and legend items respond to mouse hover with elevation,
                glow effects, and background changes for visual feedback.
              </p>
            </Card>

            {/* Feature 8: Smooth Animations */}
            <Card>
              <h4 className="text-lg font-semibold mb-3">✓ Smooth Animations</h4>
              <p className="text-text-secondary">
                All transitions use smooth 200ms animations with proper easing
                for fluid user experience and reduced jank.
              </p>
            </Card>

            {/* Feature 9: Dark Spatial Theme */}
            <Card>
              <h4 className="text-lg font-semibold mb-3">✓ Dark Spatial Theme</h4>
              <p className="text-text-secondary">
                Component uses dark background with depth layering and spatial
                elevation to match court-grade professional aesthetic.
              </p>
            </Card>

            {/* Feature 10: Responsive */}
            <Card>
              <h4 className="text-lg font-semibold mb-3">✓ Responsive Sizing</h4>
              <p className="text-text-secondary">
                Chart layout adapts from stacked mobile view to side-by-side
                legend on desktop with responsive Tailwind classes.
              </p>
            </Card>

            {/* Feature 11: WCAG Compliance */}
            <Card>
              <h4 className="text-lg font-semibold mb-3">✓ WCAG AA Compliance</h4>
              <p className="text-text-secondary">
                Uses high-contrast color palette verified for 4.5:1 contrast ratio
                and semantic HTML for screen reader accessibility.
              </p>
            </Card>

            {/* Feature 12: SVG Rendering */}
            <Card>
              <h4 className="text-lg font-semibold mb-3">✓ SVG Rendering</h4>
              <p className="text-text-secondary">
                Built with SVG for optimal performance, scalability, and
                accessibility compared to canvas rendering.
              </p>
            </Card>
          </Grid>
        </div>

        {/* Code Example */}
        <Card className="mt-12 bg-surface border border-elevation">
          <h3 className="text-lg font-semibold mb-4">Usage Example</h3>
          <pre className="bg-primary-dark p-4 rounded-md overflow-x-auto text-sm text-text-secondary">
            {`import { OffenseCategoryChart } from '@/components/analytics';

const data = [
  { name: 'Assault', count: 245, color: '#14b8a6' },
  { name: 'Theft', count: 189, color: '#7c3aed' },
  // ... more categories
];

export function MyAnalyticsPage() {
  return (
    <OffenseCategoryChart
      data={data}
      title="Offense Distribution"
      onSegmentClick={(category) => console.log(category)}
    />
  );
}`}
          </pre>
        </Card>
      </Container>
    </div>
  );
}
