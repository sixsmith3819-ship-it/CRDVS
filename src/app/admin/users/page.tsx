'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Users,
  Shield,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Filter,
  UserPlus,
  Edit2,
  Check,
  AlertTriangle,
  X,
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Container } from '@/components/layout/Container';
import { Modal } from '@/components/ui/Modal';
import { useAuth } from '@/lib/hooks/useAuth';
import { cn } from '@/lib/cn';
import { UserStatusBadge } from '@/components/admin/UserStatusBadge';
import { UserStatusToggle } from '@/components/admin/UserStatusToggle';
import { LastLoginBadge } from '@/components/admin/LastLoginBadge';

// ─── Types ────────────────────────────────────────────────────────────────────

type UserRole = 'administrator' | 'police_officer' | 'court_officer' | 'prison_officer';

interface SystemUser {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  department: string | null;
  station: string | null;
  rank: string | null;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
}

type SortKey =
  | 'full_name'
  | 'role'
  | 'department'
  | 'is_active'
  | 'last_login_at'
  | 'created_at';
type SortDir = 'asc' | 'desc';

// ─── Mock data ────────────────────────────────────────────────────────────────
// Replace with a real Supabase query once the backend surface is ready.

const MOCK_USERS: SystemUser[] = [
  {
    id: 'usr-001',
    full_name: 'Det. Sarah Moyo',
    email: 'sarah.moyo@police.gov',
    role: 'administrator',
    department: 'Criminal Investigation',
    station: 'Harare Central',
    rank: 'Detective Inspector',
    is_active: true,
    last_login_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    created_at: '2024-01-15T08:00:00Z',
  },
  {
    id: 'usr-002',
    full_name: 'Ofc. James Chikwanda',
    email: 'james.chikwanda@police.gov',
    role: 'police_officer',
    department: 'Uniform Branch',
    station: 'Harare Central',
    rank: 'Constable',
    is_active: true,
    last_login_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: '2024-03-22T09:00:00Z',
  },
  {
    id: 'usr-003',
    full_name: 'Ct. Grace Mutasa',
    email: 'grace.mutasa@courts.gov',
    role: 'court_officer',
    department: 'High Court',
    station: null,
    rank: 'Senior Court Clerk',
    is_active: true,
    last_login_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    created_at: '2024-02-10T10:00:00Z',
  },
  {
    id: 'usr-004',
    full_name: 'Prs. Leonard Sibanda',
    email: 'leonard.sibanda@prisons.gov',
    role: 'prison_officer',
    department: 'Maximum Security',
    station: 'Chikurubi Prison',
    rank: 'Senior Officer',
    is_active: true,
    last_login_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: '2024-04-01T11:00:00Z',
  },
  {
    id: 'usr-005',
    full_name: 'Ofc. Ruth Zimba',
    email: 'ruth.zimba@police.gov',
    role: 'police_officer',
    department: 'Traffic',
    station: 'Bulawayo Road',
    rank: 'Constable',
    is_active: false,
    last_login_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: '2023-11-05T07:00:00Z',
  },
  {
    id: 'usr-006',
    full_name: 'Ofc. Tendai Ncube',
    email: 'tendai.ncube@police.gov',
    role: 'police_officer',
    department: 'Uniform Branch',
    station: 'Bulawayo South',
    rank: 'Sergeant',
    is_active: true,
    last_login_at: null,
    created_at: '2025-09-01T08:30:00Z',
  },
  {
    id: 'usr-007',
    full_name: 'Ct. Anthony Dube',
    email: 'anthony.dube@courts.gov',
    role: 'court_officer',
    department: 'Magistrate Court',
    station: null,
    rank: 'Magistrate',
    is_active: false,
    last_login_at: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: '2023-06-15T09:00:00Z',
  },
  {
    id: 'usr-008',
    full_name: 'Prs. Patricia Hove',
    email: 'patricia.hove@prisons.gov',
    role: 'prison_officer',
    department: 'Remand',
    station: 'Harare Remand',
    rank: 'Officer',
    is_active: true,
    last_login_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: '2025-01-20T10:00:00Z',
  },
  {
    id: 'usr-009',
    full_name: 'Adm. Farai Dziva',
    email: 'farai.dziva@police.gov',
    role: 'administrator',
    department: 'IT & Systems',
    station: 'Central HQ',
    rank: 'Systems Director',
    is_active: true,
    last_login_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    created_at: '2024-01-05T08:00:00Z',
  },
  {
    id: 'usr-010',
    full_name: 'Ofc. Nyasha Sithole',
    email: 'nyasha.sithole@police.gov',
    role: 'police_officer',
    department: 'Anti-Poaching Unit',
    station: 'Hwange Station',
    rank: 'Constable',
    is_active: true,
    last_login_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    created_at: '2024-04-10T08:30:00Z',
  },
  {
    id: 'usr-011',
    full_name: 'Ct. Shamiso Mpofu',
    email: 'shamiso.mpofu@courts.gov',
    role: 'court_officer',
    department: 'Constitutional Court',
    station: null,
    rank: 'Deputy Registrar',
    is_active: true,
    last_login_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    created_at: '2024-03-01T09:00:00Z',
  },
  {
    id: 'usr-012',
    full_name: 'Ofc. Munyaradzi Dube',
    email: 'munyaradzi.dube@police.gov',
    role: 'police_officer',
    department: 'Narcotics Bureau',
    station: 'Gweru Station',
    rank: 'Sergeant',
    is_active: false,
    last_login_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: '2023-09-20T07:30:00Z',
  },
  {
    id: 'usr-013',
    full_name: 'Prs. Blessing Mahachi',
    email: 'blessing.mahachi@prisons.gov',
    role: 'prison_officer',
    department: 'Masvingo Prison',
    station: 'Masvingo Prison',
    rank: 'Senior Officer',
    is_active: true,
    last_login_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    created_at: '2025-02-14T10:00:00Z',
  },
  {
    id: 'usr-014',
    full_name: 'Ofc. Takudzwa Nyoni',
    email: 'takudzwa.nyoni@police.gov',
    role: 'police_officer',
    department: 'Cyber Crime Unit',
    station: 'Harare Central',
    rank: 'Detective Constable',
    is_active: true,
    last_login_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    created_at: '2025-03-01T10:00:00Z',
  },
  {
    id: 'usr-015',
    full_name: 'Prs. Rutendo Mhungu',
    email: 'rutendo.mhungu@prisons.gov',
    role: 'prison_officer',
    department: 'Khami Medium Security',
    station: 'Khami Prison',
    rank: 'Officer',
    is_active: false,
    last_login_at: null,
    created_at: '2025-06-10T08:00:00Z',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ROLE_CONFIG: Record<UserRole, { label: string; bg: string; text: string }> = {
  administrator:  { label: 'Administrator',  bg: 'rgba(124, 58, 237, 0.15)', text: '#d8b4fe' },
  police_officer: { label: 'Police Officer', bg: 'rgba(20, 184, 166, 0.15)', text: '#5eead4' },
  court_officer:  { label: 'Court Officer',  bg: 'rgba(59, 130, 246, 0.15)', text: '#93c5fd' },
  prison_officer: { label: 'Prison Officer', bg: 'rgba(245, 158, 11, 0.15)', text: '#fcd34d' },
};

function RoleBadge({ role }: { role: UserRole }) {
  const cfg = ROLE_CONFIG[role];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap"
      style={{ backgroundColor: cfg.bg, color: cfg.text }}
    >
      <Shield size={10} aria-hidden="true" />
      {cfg.label}
    </span>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

  return (
    <span
      aria-hidden="true"
      className="flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold text-white select-none"
      style={{ background: 'linear-gradient(135deg, #14b8a6, #7c3aed)' }}
    >
      {initials}
    </span>
  );
}

function PageSkeleton() {
  return (
    <div className="py-6 space-y-6">
      <div className="animate-pulse rounded bg-[rgba(255,255,255,0.06)] h-8 w-56" />
      <div className="animate-pulse rounded bg-[rgba(255,255,255,0.04)] h-4 w-80" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-xl bg-[rgba(255,255,255,0.04)] h-20" />
        ))}
      </div>
      <div className="rounded-xl overflow-hidden border border-[rgba(255,255,255,0.08)]">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-[rgba(255,255,255,0.03)] h-14 border-b border-[rgba(255,255,255,0.05)]"
          />
        ))}
      </div>
    </div>
  );
}

function SortIcon({
  col,
  sortKey,
  sortDir,
}: {
  col: SortKey;
  sortKey: SortKey;
  sortDir: SortDir;
}) {
  if (sortKey !== col) return <ChevronsUpDown size={13} className="text-[#6b7280]" />;
  return sortDir === 'asc' ? (
    <ChevronUp size={13} className="text-[#14b8a6]" />
  ) : (
    <ChevronDown size={13} className="text-[#14b8a6]" />
  );
}

// ─── CreateUserModal ──────────────────────────────────────────────────────────

const DEPARTMENTS = [
  'Criminal Investigation', 'Uniform Branch', 'Traffic', 'Cyber Crime Unit',
  'Anti-Poaching Unit', 'Narcotics Bureau', 'Fraud & Financial Crimes',
  'High Court', 'Magistrate Court', 'Constitutional Court',
  'Maximum Security', 'Remand', 'Masvingo Prison', 'Khami Medium Security',
  'IT & Systems', 'Internal Affairs',
];

interface NewUserForm {
  full_name: string;
  email: string;
  role: UserRole;
  department: string;
  rank: string;
}

const EMPTY_FORM: NewUserForm = {
  full_name: '',
  email: '',
  role: 'police_officer',
  department: '',
  rank: '',
};

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewUserForm) => void;
}

function CreateUserModal({ isOpen, onClose, onSubmit }: CreateUserModalProps) {
  const [form, setForm] = useState<NewUserForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof NewUserForm, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const e: Partial<Record<keyof NewUserForm, string>> = {};
    if (!form.full_name.trim() || form.full_name.trim().length < 2)
      e.full_name = 'Full name must be at least 2 characters.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'A valid email address is required.';
    if (!form.department.trim())
      e.department = 'Department is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const reset = () => { setForm(EMPTY_FORM); setErrors({}); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    onSubmit(form);
    reset();
  };

  const inputCls = (err?: string) =>
    cn(
      'w-full rounded-lg px-3 py-2.5 text-sm text-white',
      'bg-[rgba(255,255,255,0.06)] border placeholder:text-[#4b5563]',
      'focus:outline-none focus:ring-2 transition-colors duration-150',
      err
        ? 'border-[#dc2626] focus:ring-[#dc2626]'
        : 'border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)] focus:ring-[#14b8a6]'
    );

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => { onClose(); reset(); }}
      title="Create New User"
      description="Add a new system user and assign their role and department."
      size="lg"
      footer={
        <>
          <button
            type="button"
            onClick={() => { onClose(); reset(); }}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium',
              'text-[#a0a9c9] bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)]',
              'hover:bg-[rgba(255,255,255,0.1)] transition-colors duration-150',
              'focus:outline-none focus:ring-2 focus:ring-[#14b8a6]'
            )}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="create-user-form"
            disabled={submitting}
            className={cn(
              'inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-white',
              'bg-gradient-to-r from-[#14b8a6] to-[#7c3aed]',
              'hover:opacity-90 active:scale-[0.98] transition-all duration-150',
              'focus:outline-none focus:ring-2 focus:ring-[#14b8a6]',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {submitting
              ? <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              : <Check size={14} />}
            {submitting ? 'Creating…' : 'Create User'}
          </button>
        </>
      }
    >
      <form id="create-user-form" onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Full Name */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cu-name" className="text-xs font-semibold text-[#a0a9c9] uppercase tracking-wider">Full Name</label>
          <input id="cu-name" type="text" placeholder="e.g. Det. Sarah Moyo" value={form.full_name}
            onChange={(e) => setForm((p) => ({ ...p, full_name: e.target.value }))}
            className={inputCls(errors.full_name)} aria-invalid={!!errors.full_name} />
          {errors.full_name && <p className="text-xs text-[#f87171] flex items-center gap-1"><AlertTriangle size={11} />{errors.full_name}</p>}
        </div>
        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cu-email" className="text-xs font-semibold text-[#a0a9c9] uppercase tracking-wider">Email Address</label>
          <input id="cu-email" type="email" placeholder="e.g. officer@police.gov.zw" value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            className={inputCls(errors.email)} aria-invalid={!!errors.email} />
          {errors.email && <p className="text-xs text-[#f87171] flex items-center gap-1"><AlertTriangle size={11} />{errors.email}</p>}
        </div>
        {/* Role */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cu-role" className="text-xs font-semibold text-[#a0a9c9] uppercase tracking-wider">Role</label>
          <select id="cu-role" value={form.role}
            onChange={(e) => setForm((p) => ({ ...p, role: e.target.value as UserRole }))}
            className={inputCls()}>
            {(Object.keys(ROLE_CONFIG) as UserRole[]).map((r) => (
              <option key={r} value={r} className="bg-[#1a1f3a]">{ROLE_CONFIG[r].label}</option>
            ))}
          </select>
        </div>
        {/* Department */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cu-dept" className="text-xs font-semibold text-[#a0a9c9] uppercase tracking-wider">Department</label>
          <input id="cu-dept" list="cu-dept-list" placeholder="e.g. Criminal Investigation" value={form.department}
            onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))}
            className={inputCls(errors.department)} aria-invalid={!!errors.department} />
          <datalist id="cu-dept-list">{DEPARTMENTS.map((d) => <option key={d} value={d} />)}</datalist>
          {errors.department && <p className="text-xs text-[#f87171] flex items-center gap-1"><AlertTriangle size={11} />{errors.department}</p>}
        </div>
        {/* Rank */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cu-rank" className="text-xs font-semibold text-[#a0a9c9] uppercase tracking-wider">Rank / Title <span className="text-[#6b7280] normal-case font-normal">(optional)</span></label>
          <input id="cu-rank" type="text" placeholder="e.g. Inspector" value={form.rank}
            onChange={(e) => setForm((p) => ({ ...p, rank: e.target.value }))}
            className={inputCls()} />
        </div>
        {/* Password note */}
        <div className="rounded-lg bg-[rgba(20,184,166,0.08)] border border-[rgba(20,184,166,0.2)] px-4 py-3">
          <p className="text-xs text-[#5eead4] leading-relaxed">
            A temporary password will be auto-generated and emailed to the user. They will be prompted to change it on first login.
          </p>
        </div>
      </form>
    </Modal>
  );
}

// ─── EditUserModal ────────────────────────────────────────────────────────────

interface EditUserModalProps {
  user: SystemUser | null;
  onClose: () => void;
  onSave: (updated: Partial<SystemUser>) => void;
}

function EditUserModal({ user, onClose, onSave }: EditUserModalProps) {
  const [form, setForm] = useState<Partial<SystemUser>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) setForm({ full_name: user.full_name, role: user.role, department: user.department ?? '', rank: user.rank ?? '' });
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    onSave(form);
  };

  const inputCls = cn(
    'w-full rounded-lg px-3 py-2.5 text-sm text-white',
    'bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)]',
    'hover:border-[rgba(255,255,255,0.2)] focus:ring-2 focus:ring-[#14b8a6] focus:outline-none',
    'transition-colors duration-150'
  );

  return (
    <Modal
      isOpen={!!user}
      onClose={onClose}
      title="Edit User"
      description={user ? `Editing profile for ${user.full_name}` : ''}
      size="md"
      footer={
        <>
          <button type="button" onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-[#a0a9c9] bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.1)] transition-colors focus:outline-none focus:ring-2 focus:ring-[#14b8a6]">
            Cancel
          </button>
          <button type="submit" form="edit-user-form" disabled={submitting}
            className={cn(
              'inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-white',
              'bg-gradient-to-r from-[#14b8a6] to-[#7c3aed] hover:opacity-90 active:scale-[0.98]',
              'transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#14b8a6]',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}>
            {submitting
              ? <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              : <Check size={14} />}
            {submitting ? 'Saving…' : 'Save Changes'}
          </button>
        </>
      }
    >
      <form id="edit-user-form" onSubmit={handleSave} className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="eu-name" className="text-xs font-semibold text-[#a0a9c9] uppercase tracking-wider">Full Name</label>
          <input id="eu-name" type="text" value={form.full_name ?? ''} onChange={(e) => setForm((p) => ({ ...p, full_name: e.target.value }))} className={inputCls} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="eu-role" className="text-xs font-semibold text-[#a0a9c9] uppercase tracking-wider">Role</label>
          <select id="eu-role" value={form.role ?? 'police_officer'} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value as UserRole }))} className={inputCls}>
            {(Object.keys(ROLE_CONFIG) as UserRole[]).map((r) => (
              <option key={r} value={r} className="bg-[#1a1f3a]">{ROLE_CONFIG[r].label}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="eu-dept" className="text-xs font-semibold text-[#a0a9c9] uppercase tracking-wider">Department</label>
          <input id="eu-dept" list="eu-dept-list" value={form.department ?? ''} onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))} className={inputCls} />
          <datalist id="eu-dept-list">{DEPARTMENTS.map((d) => <option key={d} value={d} />)}</datalist>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="eu-rank" className="text-xs font-semibold text-[#a0a9c9] uppercase tracking-wider">Rank / Title</label>
          <input id="eu-rank" type="text" value={form.rank ?? ''} onChange={(e) => setForm((p) => ({ ...p, rank: e.target.value }))} className={inputCls} />
        </div>
      </form>
    </Modal>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function UserManagementPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  // ── Local data state — updated optimistically on toggle ──────────────────
  const [users, setUsers] = useState<SystemUser[]>(MOCK_USERS);

  // ── Modal state ───────────────────────────────────────────────────────────
  const [showCreate, setShowCreate] = useState(false);
  const [editUser, setEditUser] = useState<SystemUser | null>(null);

  // ── Filter / search state ─────────────────────────────────────────────────
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | ''>('');
  const [filterStatus, setFilterStatus] = useState<'active' | 'inactive' | ''>('');
  const [showFilters, setShowFilters] = useState(false);

  // ── Sort state ────────────────────────────────────────────────────────────
  const [sortKey, setSortKey] = useState<SortKey>('full_name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  // ── Pagination ────────────────────────────────────────────────────────────
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // ── Auth guard ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!loading && (!user || profile?.role !== 'administrator')) {
      router.replace('/login');
    }
  }, [loading, user, profile, router]);

  // ── Derived data ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let data = [...users];

    if (search) {
      const q = search.toLowerCase();
      data = data.filter(
        (u) =>
          u.full_name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.department ?? '').toLowerCase().includes(q) ||
          (u.station ?? '').toLowerCase().includes(q) ||
          (u.rank ?? '').toLowerCase().includes(q)
      );
    }

    if (filterRole)                data = data.filter((u) => u.role === filterRole);
    if (filterStatus === 'active')   data = data.filter((u) => u.is_active);
    if (filterStatus === 'inactive') data = data.filter((u) => !u.is_active);

    data.sort((a, b) => {
      const av: string | boolean | null = a[sortKey];
      const bv: string | boolean | null = b[sortKey];
      const aStr = av === null ? '' : String(av);
      const bStr = bv === null ? '' : String(bv);
      const cmp =
        typeof av === 'boolean'
          ? Number(av) - Number(bv as boolean)
          : aStr.localeCompare(bStr);
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return data;
  }, [users, search, filterRole, filterStatus, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = useMemo(
    () => filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [filtered, currentPage]
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterRole, filterStatus, sortKey, sortDir]);

  // ── Stats ─────────────────────────────────────────────────────────────────
  const stats = useMemo(
    () => ({
      total: users.length,
      active: users.filter((u) => u.is_active).length,
      inactive: users.filter((u) => !u.is_active).length,
      admins: users.filter((u) => u.role === 'administrator').length,
    }),
    [users]
  );

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleSort = useCallback(
    (key: SortKey) => {
      setSortDir((prev) =>
        sortKey === key ? (prev === 'asc' ? 'desc' : 'asc') : 'asc'
      );
      setSortKey(key);
    },
    [sortKey]
  );

  const handleStatusChange = useCallback((userId: string, newActive: boolean) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, is_active: newActive } : u))
    );
  }, []);

  const handleCreateUser = useCallback((data: NewUserForm) => {
    const newUser: SystemUser = {
      id: `usr-${String(users.length + 1).padStart(3, '0')}`,
      full_name: data.full_name,
      email: data.email,
      role: data.role,
      department: data.department || null,
      station: null,
      rank: data.rank || null,
      is_active: true,
      last_login_at: null,
      created_at: new Date().toISOString(),
    };
    setUsers((prev) => [newUser, ...prev]);
    setShowCreate(false);
  }, [users.length]);

  const handleEditUser = useCallback((updated: Partial<SystemUser>) => {
    if (!editUser) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === editUser.id ? { ...u, ...updated } : u))
    );
    setEditUser(null);
  }, [editUser]);

  const hasActiveFilters = search || filterRole || filterStatus;

  const clearFilters = () => {
    setSearch('');
    setFilterRole('');
    setFilterStatus('');
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <Layout breadcrumbs={[{ label: 'Admin' }, { label: 'User Management' }]}>
        <Container>
          <PageSkeleton />
        </Container>
      </Layout>
    );
  }

  // Redirect handled by effect above; nothing to render until auth resolves
  if (!user || profile?.role !== 'administrator') return null;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Layout breadcrumbs={[{ label: 'Admin' }, { label: 'User Management' }]}>
      <Container>
        <div className="py-6 space-y-6">

          {/* ── Page header ────────────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              {/* Aurora gradient title */}
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#14b8a6] via-[#818cf8] to-[#c084fc] bg-clip-text text-transparent tracking-tight flex items-center gap-2">
                <Users size={22} className="text-[#14b8a6] shrink-0" aria-hidden="true" />
                User Management
              </h1>
              <p className="mt-1 text-sm text-[#a0a9c9]">
                Manage system accounts, roles, and access permissions.
              </p>
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white',
                'bg-gradient-to-r from-[#14b8a6] to-[#7c3aed]',
                'hover:opacity-90 active:scale-[0.98] transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:ring-offset-2 focus:ring-offset-[#0a0e27]',
                'shadow-[0_0_20px_rgba(20,184,166,0.2)]'
              )}
              aria-label="Create new user"
            >
              <UserPlus size={16} aria-hidden="true" />
              New User
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {(
              [
                { label: 'Total Users',     value: stats.total,    color: '#a0a9c9' },
                { label: 'Active',          value: stats.active,   color: '#10b981' },
                { label: 'Deactivated',     value: stats.inactive, color: '#6b7280' },
                { label: 'Administrators',  value: stats.admins,   color: '#7c3aed' },
              ] as const
            ).map((stat) => (
              <div
                key={stat.label}
                className={cn(
                  'rounded-xl px-4 py-3',
                  'bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)]',
                  'backdrop-blur-sm'
                )}
              >
                <p className="text-xs text-[#a0a9c9] font-medium mb-1">{stat.label}</p>
                <p className="text-2xl font-bold" style={{ color: stat.color }}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* ── Table card ─────────────────────────────────────────────────── */}
          <div
            className={cn(
              'rounded-2xl border overflow-hidden',
              'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)]',
              'backdrop-blur-md'
            )}
          >
            {/* ── Toolbar ─────────────────────────────────────────────────── */}
            <div className="px-5 py-4 border-b border-[rgba(255,255,255,0.07)] flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1 max-w-sm">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280] pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  placeholder="Search name, email, department…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={cn(
                    'w-full pl-9 pr-3 py-2 rounded-lg text-sm',
                    'bg-[rgba(255,255,255,0.05)] text-white placeholder-[#6b7280]',
                    'border border-[rgba(255,255,255,0.1)]',
                    'focus:border-[#14b8a6] focus:ring-1 focus:ring-[#14b8a6] outline-none',
                    'transition-all duration-200'
                  )}
                  aria-label="Search users"
                />
              </div>

              {/* Right controls */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setShowFilters((v) => !v)}
                  className={cn(
                    'inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6]',
                    showFilters
                      ? 'bg-[rgba(20,184,166,0.15)] text-[#5eead4] border border-[rgba(20,184,166,0.3)]'
                      : 'bg-[rgba(255,255,255,0.05)] text-[#a0a9c9] border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.08)]'
                  )}
                  aria-expanded={showFilters}
                  aria-label="Toggle filters"
                >
                  <Filter size={14} aria-hidden="true" />
                  Filters
                  {hasActiveFilters && (
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold bg-[#14b8a6] text-[#0a0e27]">
                      !
                    </span>
                  )}
                </button>

                <span className="text-xs text-[#6b7280] hidden sm:inline">
                  {filtered.length} {filtered.length === 1 ? 'user' : 'users'}
                </span>
              </div>
            </div>

            {/* ── Filter panel ────────────────────────────────────────────── */}
            {showFilters && (
              <div className="px-5 py-4 border-b border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.02)]">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Role */}
                  <div>
                    <label
                      htmlFor="filter-role"
                      className="block text-xs font-medium text-[#a0a9c9] mb-1.5"
                    >
                      Role
                    </label>
                    <select
                      id="filter-role"
                      value={filterRole}
                      onChange={(e) => setFilterRole(e.target.value as UserRole | '')}
                      className={cn(
                        'w-full px-3 py-2 rounded-lg text-sm',
                        'bg-[rgba(255,255,255,0.05)] text-white',
                        'border border-[rgba(255,255,255,0.1)]',
                        'focus:border-[#14b8a6] focus:ring-1 focus:ring-[#14b8a6] outline-none',
                        'transition-all duration-200'
                      )}
                    >
                      <option value="">All roles</option>
                      <option value="administrator">Administrator</option>
                      <option value="police_officer">Police Officer</option>
                      <option value="court_officer">Court Officer</option>
                      <option value="prison_officer">Prison Officer</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label
                      htmlFor="filter-status"
                      className="block text-xs font-medium text-[#a0a9c9] mb-1.5"
                    >
                      Status
                    </label>
                    <select
                      id="filter-status"
                      value={filterStatus}
                      onChange={(e) =>
                        setFilterStatus(e.target.value as 'active' | 'inactive' | '')
                      }
                      className={cn(
                        'w-full px-3 py-2 rounded-lg text-sm',
                        'bg-[rgba(255,255,255,0.05)] text-white',
                        'border border-[rgba(255,255,255,0.1)]',
                        'focus:border-[#14b8a6] focus:ring-1 focus:ring-[#14b8a6] outline-none',
                        'transition-all duration-200'
                      )}
                    >
                      <option value="">All statuses</option>
                      <option value="active">Active only</option>
                      <option value="inactive">Deactivated only</option>
                    </select>
                  </div>

                  {/* Clear */}
                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      disabled={!hasActiveFilters}
                      className={cn(
                        'inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium w-full justify-center',
                        'transition-all duration-200',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6]',
                        hasActiveFilters
                          ? 'bg-[rgba(220,38,38,0.1)] text-[#fca5a5] border border-[rgba(220,38,38,0.2)] hover:bg-[rgba(220,38,38,0.15)]'
                          : 'bg-[rgba(255,255,255,0.03)] text-[#4b5563] border border-[rgba(255,255,255,0.06)] cursor-not-allowed'
                      )}
                    >
                      Clear filters
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── Table ──────────────────────────────────────────────────── */}
            <div className="overflow-x-auto">
              <table
                className="w-full min-w-[700px] border-collapse"
                aria-label="User management table"
              >
                <thead>
                  <tr className="border-b border-[rgba(255,255,255,0.07)]">
                    {(
                      [
                        { key: 'full_name',     label: 'User' },
                        { key: 'role',          label: 'Role' },
                        { key: 'department',    label: 'Department' },
                        { key: 'is_active',     label: 'Status' },
                        { key: 'last_login_at', label: 'Last Login' },
                      ] as { key: SortKey; label: string }[]
                    ).map(({ key, label }) => (
                      <th key={key} scope="col" className="px-4 py-3 text-left">
                        <button
                          onClick={() => handleSort(key)}
                          className={cn(
                            'inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider',
                            'text-[#a0a9c9] hover:text-white transition-colors duration-150',
                            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#14b8a6] rounded'
                          )}
                        >
                          {label}
                          <SortIcon col={key} sortKey={sortKey} sortDir={sortDir} />
                        </button>
                      </th>
                    ))}
                    <th scope="col" className="px-4 py-3 text-right">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#a0a9c9]">
                        Actions
                      </span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-12 text-center text-sm text-[#6b7280]"
                      >
                        No users match the current filters.
                      </td>
                    </tr>
                  ) : (
                    paginated.map((u) => (
                      <tr
                        key={u.id}
                        className={cn(
                          'border-b border-[rgba(255,255,255,0.04)]',
                          'hover:bg-[rgba(255,255,255,0.03)] transition-colors duration-150',
                          !u.is_active && 'opacity-70'
                        )}
                      >
                        {/* User */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar name={u.full_name} />
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-white truncate">
                                {u.full_name}
                              </p>
                              <p className="text-xs text-[#6b7280] truncate">{u.email}</p>
                              {u.rank && (
                                <p className="text-xs text-[#a0a9c9] truncate">{u.rank}</p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="px-4 py-3">
                          <RoleBadge role={u.role} />
                        </td>

                        {/* Department */}
                        <td className="px-4 py-3">
                          <div className="text-sm text-[#a0a9c9]">
                            {u.department ?? <span className="text-[#6b7280]">—</span>}
                          </div>
                          {u.station && (
                            <div className="text-xs text-[#6b7280]">{u.station}</div>
                          )}
                        </td>

                        {/* Status — UserStatusBadge */}
                        <td className="px-4 py-3">
                          <UserStatusBadge active={u.is_active} compact />
                        </td>

                        {/* Last Login — LastLoginBadge */}
                        <td className="px-4 py-3">
                          <LastLoginBadge lastLoginAt={u.last_login_at} />
                        </td>

                        {/* Actions — Edit + UserStatusToggle */}
                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex items-center gap-2 justify-end">
                            {/* Edit button */}
                            <button
                              onClick={() => setEditUser(u)}
                              className={cn(
                                'flex h-8 w-8 items-center justify-center rounded-lg',
                                'text-[#a0a9c9] hover:text-white',
                                'bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.1)]',
                                'transition-all duration-150',
                                'focus:outline-none focus:ring-2 focus:ring-[#14b8a6]'
                              )}
                              aria-label={`Edit ${u.full_name}`}
                            >
                              <Edit2 size={14} aria-hidden="true" />
                            </button>
                            {/* Status toggle */}
                            <UserStatusToggle
                              userId={u.id}
                              userName={u.full_name}
                              active={u.is_active}
                              onStatusChange={(newActive) =>
                                handleStatusChange(u.id, newActive)
                              }
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* ── Pagination ────────────────────────────────────────────── */}
            {totalPages > 1 && (
              <div className="px-5 py-4 border-t border-[rgba(255,255,255,0.07)] flex items-center justify-between gap-4 flex-wrap">
                <p className="text-xs text-[#6b7280]">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                  {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of{' '}
                  {filtered.length} users
                </p>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150',
                      'border border-[rgba(255,255,255,0.1)]',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6]',
                      currentPage === 1
                        ? 'text-[#4b5563] cursor-not-allowed'
                        : 'text-[#a0a9c9] hover:bg-[rgba(255,255,255,0.06)] hover:text-white'
                    )}
                    aria-label="Previous page"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={cn(
                        'w-8 h-8 rounded-lg text-sm font-medium transition-all duration-150',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6]',
                        page === currentPage
                          ? 'bg-[rgba(20,184,166,0.2)] text-[#5eead4] border border-[rgba(20,184,166,0.4)]'
                          : 'text-[#a0a9c9] hover:bg-[rgba(255,255,255,0.06)] hover:text-white'
                      )}
                      aria-label={`Page ${page}`}
                      aria-current={page === currentPage ? 'page' : undefined}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150',
                      'border border-[rgba(255,255,255,0.1)]',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6]',
                      currentPage === totalPages
                        ? 'text-[#4b5563] cursor-not-allowed'
                        : 'text-[#a0a9c9] hover:bg-[rgba(255,255,255,0.06)] hover:text-white'
                    )}
                    aria-label="Next page"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* ── Modals ──────────────────────────────────────────────────────────── */}
      <CreateUserModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreateUser}
      />
      <EditUserModal
        user={editUser}
        onClose={() => setEditUser(null)}
        onSave={handleEditUser}
      />
    </Layout>
  );
}
