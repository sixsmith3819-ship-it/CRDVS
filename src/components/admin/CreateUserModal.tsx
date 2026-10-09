'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { UserPlus, Building2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/cn';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Role = 'administrator' | 'police_officer' | 'court_officer' | 'prison_officer';

interface FormValues {
  fullName: string;
  email: string;
  role: string;
  department: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  role?: string;
  department?: string;
  password?: string;
  confirmPassword?: string;
}

export interface CreateUserModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Called when the modal should close */
  onClose: () => void;
  /** Optional callback after successful user creation */
  onSuccess?: (userId: string) => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ROLE_OPTIONS = [
  { value: 'administrator',  label: 'Administrator' },
  { value: 'police_officer', label: 'Police Officer' },
  { value: 'court_officer',  label: 'Court Officer' },
  { value: 'prison_officer', label: 'Prison Officer' },
];

const EMPTY_FORM: FormValues = {
  fullName: '',
  email: '',
  role: '',
  department: '',
  password: '',
  confirmPassword: '',
};

// ---------------------------------------------------------------------------
// Password strength helpers
// ---------------------------------------------------------------------------

interface StrengthResult {
  score: 0 | 1 | 2 | 3 | 4;
  label: 'Too short' | 'Weak' | 'Fair' | 'Strong' | 'Very Strong';
  color: string;
  width: string;
}

function getPasswordStrength(password: string): StrengthResult {
  if (password.length === 0) {
    return { score: 0, label: 'Too short', color: '#3a4254', width: '0%' };
  }
  if (password.length < 8) {
    return { score: 0, label: 'Too short', color: '#dc2626', width: '15%' };
  }

  let score = 0;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const map: StrengthResult[] = [
    { score: 0, label: 'Too short', color: '#dc2626', width: '15%' },
    { score: 1, label: 'Weak',      color: '#dc2626', width: '25%' },
    { score: 2, label: 'Fair',      color: '#f59e0b', width: '50%' },
    { score: 3, label: 'Strong',    color: '#10b981', width: '75%' },
    { score: 4, label: 'Very Strong', color: '#14b8a6', width: '100%' },
  ];

  return map[score] as StrengthResult;
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

function validateForm(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  const name = values.fullName.trim();
  if (!name) {
    errors.fullName = 'Full name is required';
  } else if (name.length < 2) {
    errors.fullName = 'Full name must be at least 2 characters';
  } else if (name.length > 100) {
    errors.fullName = 'Full name must not exceed 100 characters';
  }

  if (!values.email.trim()) {
    errors.email = 'Email address is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Please enter a valid email address';
  }

  if (!values.role) {
    errors.role = 'Please select a role';
  }

  if (!values.department.trim()) {
    errors.department = 'Department is required';
  }

  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
}

// ---------------------------------------------------------------------------
// Sub-component: Password strength bar
// ---------------------------------------------------------------------------

function PasswordStrengthBar({ password }: { password: string }) {
  const strength = getPasswordStrength(password);

  if (!password) return null;

  return (
    <div className="mt-2" aria-live="polite" aria-atomic="true">
      {/* Progress track */}
      <div
        className="h-1.5 w-full rounded-full overflow-hidden"
        style={{ backgroundColor: '#3a4254' }}
        role="presentation"
      >
        <div
          className="h-full rounded-full transition-all duration-300 ease-out"
          style={{
            width: strength.width,
            backgroundColor: strength.color,
          }}
        />
      </div>

      {/* Label */}
      <p className="mt-1 text-xs font-medium" style={{ color: strength.color }}>
        {strength.label}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function CreateUserModal({ isOpen, onClose, onSuccess }: CreateUserModalProps) {
  const { success: showSuccess, error: showError } = useToast();

  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form state every time the modal opens
  useEffect(() => {
    if (isOpen) {
      setValues(EMPTY_FORM);
      setErrors({});
      setTouched({});
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // â”€â”€ Change handlers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const handleChange = useCallback(
    (field: keyof FormValues) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const next = { ...values, [field]: e.target.value };
        setValues(next);

        // Re-validate touched fields in real time
        if (touched[field]) {
          const fieldErrors = validateForm(next);
          setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] }));
        }

        // Special case: if confirmPassword is touched and password changes, re-check both
        if (field === 'password' && touched.confirmPassword) {
          const fieldErrors = validateForm(next);
          setErrors((prev) => ({
            ...prev,
            password: fieldErrors.password,
            confirmPassword: fieldErrors.confirmPassword,
          }));
        }
      },
    [values, touched]
  );

  const handleRoleChange = useCallback(
    (roleValue: string) => {
      const next = { ...values, role: roleValue };
      setValues(next);
      if (touched.role) {
        const fieldErrors = validateForm(next);
        setErrors((prev) => ({ ...prev, role: fieldErrors.role }));
      }
    },
    [values, touched]
  );

  const handleBlur = useCallback(
    (field: keyof FormValues) => () => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const fieldErrors = validateForm(values);
      setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] }));
    },
    [values]
  );

  // â”€â”€ Submit â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Mark all fields as touched so errors appear
      setTouched({
        fullName: true,
        email: true,
        role: true,
        department: true,
        password: true,
        confirmPassword: true,
      });

      const validationErrors = validateForm(values);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      setIsSubmitting(true);

      try {
        const res = await fetch('/api/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: values.fullName.trim(),
            email: values.email.trim().toLowerCase(),
            role: values.role as Role,
            department: values.department.trim(),
            password: values.password,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          showError(
            'User creation failed',
            data.error ?? 'An unexpected error occurred. Please try again.'
          );
          return;
        }

        showSuccess(
          'User created',
          data.message ?? `Account for ${values.fullName.trim()} created successfully.`
        );

        onSuccess?.(data.userId);
        onClose();
      } catch {
        showError(
          'Network error',
          'Could not reach the server. Please check your connection and try again.'
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, onClose, onSuccess, showSuccess, showError]
  );

  // â”€â”€ Derived state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const passwordStrength = getPasswordStrength(values.password);
  const isPasswordWeak =
    values.password.length > 0 && passwordStrength.label === 'Weak';

  // â”€â”€ Render â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New User"
      description="Add a new officer account and assign their role and department."
      size="lg"
      footer={
        <>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          {/* Aurora gradient submit button */}
          <button
            type="submit"
            form="create-user-form"
            disabled={isSubmitting}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white',
              'bg-gradient-to-r from-[#7c3aed] via-[#14b8a6] to-[#10b981]',
              'transition-all duration-200 ease-out',
              'hover:shadow-[0_0_24px_rgba(20,184,166,0.4)] hover:scale-[1.02]',
              'active:scale-[0.98]',
              'focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:ring-offset-2 focus:ring-offset-[#0a0e27]',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none'
            )}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Creatingâ€¦
              </>
            ) : (
              <>
                <UserPlus size={16} aria-hidden="true" />
                Create User
              </>
            )}
          </button>
        </>
      }
    >
      <form
        id="create-user-form"
        onSubmit={handleSubmit}
        noValidate
        aria-label="Create new user form"
      >
        <div className="flex flex-col gap-5">
          {/* â”€â”€ Row 1: Full Name â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <Input
            label="Full Name"
            required
            id="create-user-full-name"
            type="text"
            placeholder="e.g. Inspector John Moyo"
            autoComplete="name"
            value={values.fullName}
            onChange={handleChange('fullName')}
            onBlur={handleBlur('fullName')}
            errorMessage={touched.fullName ? errors.fullName : undefined}
            isValid={
              touched.fullName && !errors.fullName && values.fullName.trim().length >= 2
            }
            maxLength={100}
          />

          {/* â”€â”€ Row 2: Email â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <Input
            label="Email Address"
            required
            id="create-user-email"
            type="email"
            placeholder="user@magistrates.gov.zw"
            autoComplete="email"
            value={values.email}
            onChange={handleChange('email')}
            onBlur={handleBlur('email')}
            errorMessage={touched.email ? errors.email : undefined}
            isValid={
              touched.email &&
              !errors.email &&
              /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())
            }
          />

          {/* â”€â”€ Row 3: Role + Department â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Select
              label="Role"
              required
              placeholder="Select a role"
              options={ROLE_OPTIONS}
              value={values.role}
              onChange={handleRoleChange}
              errorMessage={touched.role ? errors.role : undefined}
            />

            <Input
              label="Department"
              required
              id="create-user-department"
              type="text"
              placeholder="e.g. CID, Traffic, Courts"
              leftIcon={<Building2 size={16} aria-hidden="true" />}
              value={values.department}
              onChange={handleChange('department')}
              onBlur={handleBlur('department')}
              errorMessage={touched.department ? errors.department : undefined}
              isValid={
                touched.department &&
                !errors.department &&
                values.department.trim().length > 0
              }
            />
          </div>

          {/* â”€â”€ Row 4: Password â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <div>
            <Input
              label="Password"
              required
              id="create-user-password"
              type="password"
              placeholder="Minimum 8 characters"
              autoComplete="new-password"
              value={values.password}
              onChange={handleChange('password')}
              onBlur={handleBlur('password')}
              errorMessage={touched.password ? errors.password : undefined}
              helperText={
                !touched.password || !errors.password
                  ? 'Use uppercase, numbers, and symbols for a stronger password'
                  : undefined
              }
            />
            {/* Strength indicator */}
            <PasswordStrengthBar password={values.password} />
          </div>

          {/* â”€â”€ Row 5: Confirm Password â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <Input
            label="Confirm Password"
            required
            id="create-user-confirm-password"
            type="password"
            placeholder="Re-enter password"
            autoComplete="new-password"
            value={values.confirmPassword}
            onChange={handleChange('confirmPassword')}
            onBlur={handleBlur('confirmPassword')}
            errorMessage={touched.confirmPassword ? errors.confirmPassword : undefined}
            isValid={
              touched.confirmPassword &&
              !errors.confirmPassword &&
              values.confirmPassword.length > 0 &&
              values.password === values.confirmPassword
            }
          />

          {/* â”€â”€ Password strength warning â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          {isPasswordWeak && !errors.password && (
            <p
              role="alert"
              className="rounded-lg border px-3 py-2 text-xs"
              style={{
                backgroundColor: 'rgba(245,158,11,0.08)',
                borderColor: 'rgba(245,158,11,0.25)',
                color: '#f59e0b',
              }}
            >
              Consider a stronger password â€” try adding uppercase letters, numbers, or
              symbols.
            </p>
          )}
        </div>
      </form>
    </Modal>
  );
}

export default CreateUserModal;

