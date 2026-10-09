'use client';

import React, { useState, useCallback } from 'react';
import { ShieldOff, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UserStatusToggleProps {
  /** The user's UUID */
  userId: string;
  /** Display name used in the confirmation dialog */
  userName: string;
  /** Current active state of the user */
  active: boolean;
  /**
   * Called after a successful status change with the new active state.
   * Use this to update local UI state (e.g. optimistic update or refetch).
   */
  onStatusChange?: (newActive: boolean) => void;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * UserStatusToggle
 *
 * A button that opens a confirmation modal before activating or deactivating
 * a user account. On confirmation it calls PATCH /api/admin/users/[id] with
 * `{ active: boolean }`.
 *
 * - Deactivating: red-tinted dialog, warns login will be prevented.
 * - Activating:   green-tinted dialog, explains access will be restored.
 *
 * @example
 * <UserStatusToggle
 *   userId={user.id}
 *   userName={user.full_name}
 *   active={user.is_active}
 *   onStatusChange={(active) => setUser(u => ({ ...u, is_active: active }))}
 * />
 */
export function UserStatusToggle({
  userId,
  userName,
  active,
  onStatusChange,
  className,
}: UserStatusToggleProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading]     = useState(false);
  const toast = useToast();

  // Derived intent: what will we do when confirmed?
  const willDeactivate = active;

  const openModal  = useCallback(() => setModalOpen(true),  []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  const handleConfirm = useCallback(async () => {
    setLoading(true);
    const newActive = !active;

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: newActive }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error ?? 'Request failed');
      }

      toast.success(
        newActive ? 'Account Activated' : 'Account Deactivated',
        newActive
          ? `${userName}'s account has been activated. They can now log in.`
          : `${userName}'s account has been deactivated. They can no longer log in.`
      );

      onStatusChange?.(newActive);
      closeModal();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      toast.error('Action Failed', message);
    } finally {
      setLoading(false);
    }
  }, [active, userId, userName, toast, onStatusChange, closeModal]);

  // ── Visual config based on intent ────────────────────────────────────────

  const config = willDeactivate
    ? {
        triggerLabel: 'Deactivate',
        triggerVariant: 'danger' as const,
        TriggerIcon: ShieldOff,
        modalTitle: 'Deactivate Account',
        accentColor: '#dc2626',
        accentBg: 'rgba(220, 38, 38, 0.08)',
        accentBorder: 'rgba(220, 38, 38, 0.25)',
        confirmVariant: 'danger' as const,
        confirmLabel: 'Yes, Deactivate',
        description: (
          <>
            You are about to deactivate{' '}
            <strong className="text-white">{userName}</strong>&apos;s account.
          </>
        ),
        warning:
          'This will immediately prevent them from logging into the system. All of their existing records and activity will be preserved.',
      }
    : {
        triggerLabel: 'Activate',
        triggerVariant: 'success' as const,
        TriggerIcon: ShieldCheck,
        modalTitle: 'Activate Account',
        accentColor: '#10b981',
        accentBg: 'rgba(16, 185, 129, 0.08)',
        accentBorder: 'rgba(16, 185, 129, 0.25)',
        confirmVariant: 'success' as const,
        confirmLabel: 'Yes, Activate',
        description: (
          <>
            You are about to activate{' '}
            <strong className="text-white">{userName}</strong>&apos;s account.
          </>
        ),
        warning:
          'This will restore their access to the system. They will be able to log in with their existing credentials.',
      };

  return (
    <>
      {/* ── Trigger button ─────────────────────────────────────────────────── */}
      <Button
        variant={config.triggerVariant}
        size="sm"
        leftIcon={<config.TriggerIcon size={14} />}
        onClick={openModal}
        className={className}
        aria-label={`${config.triggerLabel} ${userName}`}
      >
        {config.triggerLabel}
      </Button>

      {/* ── Confirmation modal ─────────────────────────────────────────────── */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={config.modalTitle}
        size="sm"
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={closeModal}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant={config.confirmVariant}
              size="sm"
              loading={loading}
              onClick={handleConfirm}
            >
              {config.confirmLabel}
            </Button>
          </>
        }
      >
        {/* Tinted info panel */}
        <div
          className={cn(
            'rounded-xl p-4 mb-2 border',
            'flex flex-col gap-3'
          )}
          style={{
            backgroundColor: config.accentBg,
            borderColor: config.accentBorder,
          }}
        >
          {/* Icon */}
          <div className="flex items-center gap-3">
            <span
              className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: `${config.accentColor}20`,
                color: config.accentColor,
              }}
            >
              <config.TriggerIcon size={18} aria-hidden="true" />
            </span>
            <p className="text-sm text-[#a0a9c9] leading-relaxed">
              {config.description}
            </p>
          </div>

          {/* Warning text */}
          <p className="text-xs text-[#6b7280] leading-relaxed pl-12">
            {config.warning}
          </p>
        </div>
      </Modal>
    </>
  );
}

export default UserStatusToggle;
