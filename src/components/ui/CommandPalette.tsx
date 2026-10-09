'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShieldCheck,
  FileText,
  BarChart2,
  ScrollText,
  Users,
  Activity,
  FilePlus,
  Search,
  Download,
  Moon,
  Command,
} from 'lucide-react';
import { cn } from '@/lib/cn';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CommandCategory = 'Navigation' | 'Records' | 'Admin' | 'Actions';

interface Command {
  id: string;
  label: string;
  category: CommandCategory;
  icon: React.ReactNode;
  shortcut?: string;
  action: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

// ---------------------------------------------------------------------------
// Category badge colors
// ---------------------------------------------------------------------------

const categoryBadgeClasses: Record<CommandCategory, string> = {
  Navigation: 'bg-[rgba(20,184,166,0.15)] text-[#14b8a6] border border-[rgba(20,184,166,0.3)]',
  Records:    'bg-[rgba(99,102,241,0.15)] text-[#818cf8] border border-[rgba(99,102,241,0.3)]',
  Admin:      'bg-[rgba(251,191,36,0.15)] text-[#fbbf24] border border-[rgba(251,191,36,0.3)]',
  Actions:    'bg-[rgba(168,85,247,0.15)] text-[#c084fc] border border-[rgba(168,85,247,0.3)]',
};

// ---------------------------------------------------------------------------
// Fuzzy-match helper (simple: every char in query appears in order in target)
// ---------------------------------------------------------------------------

function fuzzyMatch(query: string, target: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  let qi = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) qi++;
  }
  return qi === q.length;
}

// ---------------------------------------------------------------------------
// CommandPalette component
// ---------------------------------------------------------------------------

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState('');
  const [activeIndex, setActiveIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);

  // Build commands inside the component so router is available
  const commands = React.useMemo<Command[]>(() => [
    // Navigation
    {
      id: 'nav-dashboard',
      label: 'Go to Dashboard',
      category: 'Navigation',
      icon: <LayoutDashboard className="h-4 w-4" />,
      shortcut: 'G D',
      action: () => router.push('/dashboard'),
    },
    {
      id: 'nav-verification',
      label: 'Go to Verification Centre',
      category: 'Navigation',
      icon: <ShieldCheck className="h-4 w-4" />,
      shortcut: 'G V',
      action: () => router.push('/verification'),
    },
    {
      id: 'nav-records',
      label: 'Go to Records',
      category: 'Navigation',
      icon: <FileText className="h-4 w-4" />,
      shortcut: 'G R',
      action: () => router.push('/records'),
    },
    {
      id: 'nav-analytics',
      label: 'Go to Analytics',
      category: 'Navigation',
      icon: <BarChart2 className="h-4 w-4" />,
      shortcut: 'G A',
      action: () => router.push('/analytics'),
    },
    {
      id: 'nav-audit',
      label: 'Go to Audit Log',
      category: 'Navigation',
      icon: <ScrollText className="h-4 w-4" />,
      action: () => router.push('/admin/audit-log'),
    },
    {
      id: 'nav-users',
      label: 'Go to User Management',
      category: 'Navigation',
      icon: <Users className="h-4 w-4" />,
      action: () => router.push('/admin/users'),
    },
    {
      id: 'nav-status',
      label: 'Go to System Status',
      category: 'Navigation',
      icon: <Activity className="h-4 w-4" />,
      action: () => router.push('/system-status'),
    },
    // Records
    {
      id: 'rec-new',
      label: 'New Criminal Record',
      category: 'Records',
      icon: <FilePlus className="h-4 w-4" />,
      shortcut: 'N',
      action: () => router.push('/records/new'),
    },
    {
      id: 'rec-search',
      label: 'Search Records',
      category: 'Records',
      icon: <Search className="h-4 w-4" />,
      shortcut: '/',
      action: () => router.push('/records'),
    },
    // Actions
    {
      id: 'act-export-csv',
      label: 'Export Analytics CSV',
      category: 'Actions',
      icon: <Download className="h-4 w-4" />,
      action: () => router.push('/analytics?export=csv'),
    },
    {
      id: 'act-dark-mode',
      label: 'Toggle Dark Mode (placeholder)',
      category: 'Actions',
      icon: <Moon className="h-4 w-4" />,
      action: () => {
        // Placeholder — dark mode toggle implementation deferred
        console.log('Dark mode toggle placeholder');
      },
    },
  ], [router]);

  // Filtered results
  const filtered = React.useMemo(
    () => commands.filter((cmd) => fuzzyMatch(query, cmd.label) || fuzzyMatch(query, cmd.category)),
    [commands, query],
  );

  // Reset state when palette opens
  React.useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      // Focus input on next frame so the element is mounted/visible
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // Reset active index when results change
  React.useEffect(() => {
    setActiveIndex(0);
  }, [filtered.length]);

  // Scroll active item into view
  React.useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const item = list.children[activeIndex] as HTMLElement | undefined;
    item?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  // Keyboard navigation
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex((i) => (i + 1) % Math.max(filtered.length, 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex((i) => (i - 1 + Math.max(filtered.length, 1)) % Math.max(filtered.length, 1));
          break;
        case 'Enter':
          e.preventDefault();
          if (filtered[activeIndex]) {
            filtered[activeIndex].action();
            onClose();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    },
    [filtered, activeIndex, onClose],
  );

  // Backdrop click closes palette
  const handleBackdropClick = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />

      {/* Palette panel */}
      <div
        className={cn(
          'relative z-10 max-w-xl w-full mx-4',
          'bg-[rgba(15,20,45,0.92)] backdrop-blur-xl',
          'border border-[rgba(255,255,255,0.15)] rounded-2xl',
          'shadow-[0_20px_60px_rgba(0,0,0,0.6)]',
          'overflow-hidden',
          'animate-in fade-in slide-in-from-top-4 duration-200',
        )}
      >
        {/* Search input row */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[rgba(255,255,255,0.08)]">
          <Command className="h-4 w-4 text-[#14b8a6] shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-autocomplete="list"
            aria-controls="command-palette-list"
            aria-activedescendant={filtered[activeIndex] ? `cmd-${filtered[activeIndex].id}` : undefined}
            placeholder="Search commands…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className={cn(
              'flex-1 bg-transparent outline-none border-none',
              'text-white placeholder:text-[#4a5378] text-sm',
              // Aurora teal focus ring handled via wrapper — no per-input ring needed
            )}
          />
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono text-[#4a5378] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)]">
            ESC
          </kbd>
        </div>

        {/* Results list */}
        <ul
          id="command-palette-list"
          ref={listRef}
          role="listbox"
          aria-label="Commands"
          className="max-h-[360px] overflow-y-auto py-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[rgba(255,255,255,0.1)]"
        >
          {filtered.length === 0 ? (
            <li className="px-4 py-8 text-center text-sm text-[#4a5378]" role="option" aria-selected={false}>
              No commands found
            </li>
          ) : (
            filtered.map((cmd, index) => (
              <li
                key={cmd.id}
                id={`cmd-${cmd.id}`}
                role="option"
                aria-selected={index === activeIndex}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 cursor-pointer',
                  'transition-colors duration-100',
                  index === activeIndex
                    ? 'bg-[rgba(20,184,166,0.12)] text-white'
                    : 'text-[#a0a9c9] hover:bg-[rgba(255,255,255,0.05)] hover:text-white',
                )}
                onClick={() => {
                  cmd.action();
                  onClose();
                }}
                onMouseEnter={() => setActiveIndex(index)}
              >
                {/* Icon */}
                <span
                  className={cn(
                    'shrink-0 flex items-center justify-center w-7 h-7 rounded-md',
                    index === activeIndex
                      ? 'bg-[rgba(20,184,166,0.2)] text-[#14b8a6]'
                      : 'bg-[rgba(255,255,255,0.05)] text-[#4a5378]',
                  )}
                  aria-hidden="true"
                >
                  {cmd.icon}
                </span>

                {/* Label */}
                <span className="flex-1 text-sm font-medium truncate">{cmd.label}</span>

                {/* Category badge */}
                <span
                  className={cn(
                    'hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium shrink-0',
                    categoryBadgeClasses[cmd.category],
                  )}
                >
                  {cmd.category}
                </span>

                {/* Keyboard shortcut hint */}
                {cmd.shortcut && (
                  <kbd className="hidden sm:inline-flex items-center gap-0.5 shrink-0">
                    {cmd.shortcut.split(' ').map((key, ki) => (
                      <span
                        key={ki}
                        className="px-1.5 py-0.5 rounded text-[10px] font-mono text-[#4a5378] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)]"
                      >
                        {key}
                      </span>
                    ))}
                  </kbd>
                )}
              </li>
            ))
          )}
        </ul>

        {/* Footer hint */}
        <div className="flex items-center gap-4 px-4 py-2 border-t border-[rgba(255,255,255,0.08)] text-[10px] text-[#4a5378]">
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 rounded bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] font-mono">↑↓</kbd>
            navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 rounded bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] font-mono">↵</kbd>
            select
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 rounded bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] font-mono">esc</kbd>
            close
          </span>
        </div>
      </div>
    </div>
  );
}

export default CommandPalette;
