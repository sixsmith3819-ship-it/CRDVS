'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { AlertTriangle, CheckCircle, Undo2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/cn';
import type { CriminalRecord, RecordStatus, Gender } from '@/types/database';

// Types
export interface EditRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: CriminalRecord;
  userId: string;
  userRole: string;
  onSuccess?: (updatedRecord: CriminalRecord) => void;
  onSave?: (changes: RecordChanges) => Promise<void>;
}

export interface RecordChanges {
  full_name?: string;
  aliases?: string[] | null;
  date_of_birth?: string;
  gender?: Gender;
  national_id_number?: string;
  address?: string | null;
  notes?: string | null;
  status?: RecordStatus;
  risk_level?: number;
}

export interface FieldError {
  [key: string]: string;
}

// Helper Functions
function validateChanges(changes: RecordChanges): FieldError {
  const errors: FieldError = {};

  if (changes.full_name !== undefined) {
    const name = changes.full_name.trim();
    if (!name) {
      errors.full_name = 'Full name is required';
    } else if (name.length < 2) {
      errors.full_name = 'Full name must be at least 2 characters';
    } else if (name.length > 256) {
      errors.full_name = 'Full name cannot exceed 256 characters';
    }
  }

  if (changes.date_of_birth !== undefined) {
    if (!changes.date_of_birth) {
      errors.date_of_birth = 'Date of birth is required';
    }
  }

  if (changes.national_id_number !== undefined) {
    const id = changes.national_id_number.trim();
    if (!id) {
      errors.national_id_number = 'National ID is required';
    } else if (!/^\d{2}-\d{7}[A-Z]\d{2}$/.test(id)) {
      errors.national_id_number = 'Invalid format. Use DD-DDDDDDDADD';
    }
  }

  if (changes.risk_level !== undefined) {
    if (changes.risk_level < 1 || changes.risk_level > 5) {
      errors.risk_level = 'Risk level must be between 1 and 5';
    }
  }

  return errors;
}

function detectChanges(original: CriminalRecord, edited: RecordChanges): RecordChanges {
  const changes: RecordChanges = {};

  if (edited.full_name !== undefined && edited.full_name !== original.full_name) {
    changes.full_name = edited.full_name;
  }
  if (edited.date_of_birth !== undefined && edited.date_of_birth !== original.date_of_birth) {
    changes.date_of_birth = edited.date_of_birth;
  }
  if (edited.gender !== undefined && edited.gender !== original.gender) {
    changes.gender = edited.gender;
  }
  if (edited.national_id_number !== undefined && edited.national_id_number !== original.national_id_number) {
    changes.national_id_number = edited.national_id_number;
  }
  if (edited.address !== undefined && edited.address !== original.address) {
    changes.address = edited.address;
  }
  if (edited.notes !== undefined && edited.notes !== original.notes) {
    changes.notes = edited.notes;
  }
  if (edited.status !== undefined && edited.status !== original.status) {
    changes.status = edited.status;
  }
  if (edited.risk_level !== undefined && edited.risk_level !== original.risk_level) {
    changes.risk_level = edited.risk_level;
  }

  return changes;
}

function isSensitiveField(field: string): boolean {
  const sensitiveFields = ['national_id_number', 'status', 'risk_level'];
  return sensitiveFields.includes(field);
}

// Component
export function EditRecordModal({
  isOpen,
  onClose,
  record,
  userId,
  userRole,
  onSuccess,
  onSave: onCustomSave,
}: EditRecordModalProps) {
  const [formData, setFormData] = useState<RecordChanges>({
    full_name: record.full_name,
    aliases: record.aliases,
    date_of_birth: record.date_of_birth,
    gender: record.gender,
    national_id_number: record.national_id_number,
    address: record.address,
    notes: record.notes,
    status: record.status,
    risk_level: record.risk_level,
  });

  const [errors, setErrors] = useState<FieldError>({});
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<RecordChanges>({});
  const [editHistory, setEditHistory] = useState<{ field: string; oldValue: any; newValue: any }[]>([]);

  const currentChanges = useMemo(
    () => detectChanges(record, formData),
    [record, formData]
  );

  const hasSensitiveChanges = useMemo(
    () => Object.keys(currentChanges).some(isSensitiveField),
    [currentChanges]
  );

  const canEdit = userRole === 'administrator';

  const handleFieldChange = useCallback(
    (field: keyof RecordChanges, value: any) => {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));

      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    },
    []
  );

  const handleRevert = useCallback(() => {
    setFormData({
      full_name: record.full_name,
      aliases: record.aliases,
      date_of_birth: record.date_of_birth,
      gender: record.gender,
      national_id_number: record.national_id_number,
      address: record.address,
      notes: record.notes,
      status: record.status,
      risk_level: record.risk_level,
    });
    setErrors({});
    setEditHistory([]);
    addToast({
      title: 'Changes Reverted',
      message: 'All changes have been reverted to original values',
      type: 'warning',
    });
  }, [record, addToast]);

  const handleSaveClick = useCallback(() => {
    const validationErrors = validateChanges(currentChanges);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      addToast({
        title: 'Validation Error',
        message: 'Please fix all validation errors before saving',
        type: 'error',
      });
      return;
    }

    setPendingChanges(currentChanges);

    if (hasSensitiveChanges) {
      setShowConfirmation(true);
    } else {
      handleConfirmSave(currentChanges);
    }
  }, [currentChanges, hasSensitiveChanges, addToast]);

  const handleConfirmSave = useCallback(
    async (changes: RecordChanges) => {
      setIsLoading(true);
      setShowConfirmation(false);

      try {
        if (onCustomSave) {
          await onCustomSave(changes);
        } else {
          const response = await fetch(`/api/records/${record.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...changes,
              userId,
              oldValues: {
                full_name: record.full_name,
                aliases: record.aliases,
                date_of_birth: record.date_of_birth,
                gender: record.gender,
                national_id_number: record.national_id_number,
                address: record.address,
                notes: record.notes,
                status: record.status,
                risk_level: record.risk_level,
              },
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to save changes');
          }

          const result = await response.json();
          const updatedRecord = result.record || record;
          
          const newHistory = Object.entries(changes).map(([field, newValue]) => ({
            field,
            oldValue: record[field as keyof CriminalRecord],
            newValue,
          }));
          setEditHistory(prev => [...prev, ...newHistory]);

          addToast({
            title: 'Record Updated',
            message: `Successfully updated ${Object.keys(changes).length} field(s)`,
            type: 'success',
          });

          if (onSuccess) {
            onSuccess(updatedRecord);
          }

          setTimeout(() => {
            onClose();
            setFormData({
              full_name: record.full_name,
              aliases: record.aliases,
              date_of_birth: record.date_of_birth,
              gender: record.gender,
              national_id_number: record.national_id_number,
              address: record.address,
              notes: record.notes,
              status: record.status,
              risk_level: record.risk_level,
            });
            setErrors({});
            setEditHistory([]);
          }, 1500);
        }
      } catch (error: any) {
        console.error('Error saving record:', error);
        addToast({
          title: 'Save Failed',
          message: error.message || 'Failed to save changes',
          type: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [record, userId, onCustomSave, onSuccess, onClose, addToast]
  );

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Edit Criminal Record"
        description={`Editing record: ${record.record_id}`}
        size="lg"
        footer={
          <div className="flex items-center gap-3 w-full">
            {editHistory.length > 0 && (
              <div className="text-xs text-[#a0a9c9] flex items-center gap-2 mr-auto">
                <CheckCircle size={14} className="text-[#10b981]" />
                {editHistory.length} change(s) made
              </div>
            )}
            <Button
              variant="tertiary"
              size="md"
              onClick={handleRevert}
              disabled={Object.keys(currentChanges).length === 0}
              leftIcon={<Undo2 size={16} />}
            >
              Revert
            </Button>
            <Button
              variant="tertiary"
              size="md"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleSaveClick}
              loading={isLoading}
              disabled={!canEdit || Object.keys(currentChanges).length === 0}
            >
              Save Changes
            </Button>
          </div>
        }
      >
        {!canEdit && (
          <div
            className={cn(
              'mb-6 p-4 rounded-lg',
              'bg-[rgba(220,38,38,0.1)] border border-[rgba(220,38,38,0.3)]',
              'flex items-start gap-3'
            )}
            role="alert"
          >
            <AlertTriangle size={18} className="text-[#dc2626] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-[#fca5a5]">
                Administrator Access Required
              </p>
              <p className="text-xs text-[#f87171] mt-1">
                Only administrators can edit criminal records.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Personal Information Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Personal Information
            </h3>
            <div className="space-y-4">
              <Input
                label="Full Name"
                value={formData.full_name}
                onChange={(e) => handleFieldChange('full_name', e.target.value)}
                errorMessage={errors.full_name}
                required
                disabled={!canEdit}
                maxLength={256}
              />

              <Input
                label="Date of Birth"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => handleFieldChange('date_of_birth', e.target.value)}
                errorMessage={errors.date_of_birth}
                required
                disabled={!canEdit}
              />

              <Select
                label="Gender"
                value={formData.gender || 'male'}
                onChange={(value) => handleFieldChange('gender', value as Gender)}
                errorMessage={errors.gender}
                disabled={!canEdit}
                options={[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                  { value: 'other', label: 'Other' },
                ]}
              />
            </div>
          </div>

          {/* Identification Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Identification
            </h3>
            <div className="space-y-4">
              <Input
                label="National ID Number"
                value={formData.national_id_number}
                onChange={(e) => handleFieldChange('national_id_number', e.target.value)}
                errorMessage={errors.national_id_number}
                required
                disabled={!canEdit}
                helperText="Format: DD-DDDDDDDADD"
                placeholder="63-6323979A13"
              />

              <Input
                label="Aliases (comma-separated)"
                value={
                  Array.isArray(formData.aliases)
                    ? formData.aliases.join(', ')
                    : ''
                }
                onChange={(e) => {
                  const aliases = e.target.value
                    .split(',')
                    .map(a => a.trim())
                    .filter(a => a.length > 0)
                    .slice(0, 5);
                  handleFieldChange('aliases', aliases.length > 0 ? aliases : null);
                }}
                disabled={!canEdit}
                helperText="Up to 5 aliases, separated by commas"
              />

              <Input
                label="Address"
                value={formData.address || ''}
                onChange={(e) => handleFieldChange('address', e.target.value || null)}
                disabled={!canEdit}
                placeholder="Street address..."
              />
            </div>
          </div>

          {/* Record Status Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Record Status
            </h3>
            <div className="space-y-4">
              <Select
                label="Status"
                value={formData.status || 'active'}
                onChange={(value) => handleFieldChange('status', value as RecordStatus)}
                errorMessage={errors.status}
                disabled={!canEdit}
                options={[
                  { value: 'active', label: 'Active' },
                  { value: 'closed', label: 'Closed' },
                  { value: 'under_investigation', label: 'Under Investigation' },
                  { value: 'acquitted', label: 'Acquitted' },
                  { value: 'deceased', label: 'Deceased' },
                  { value: 'archived', label: 'Archived' },
                ]}
              />

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Risk Level (1-5)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={formData.risk_level || 3}
                    onChange={(e) => handleFieldChange('risk_level', parseInt(e.target.value))}
                    disabled={!canEdit}
                    className={cn(
                      'flex-1 h-2 rounded-full accent-[#14b8a6]',
                      !canEdit && 'opacity-50 cursor-not-allowed'
                    )}
                  />
                  <span className="text-sm font-semibold text-[#14b8a6] min-w-12 text-center">
                    {formData.risk_level || 3}/5
                  </span>
                </div>
                {errors.risk_level && (
                  <p className="text-xs text-[#dc2626] mt-1">{errors.risk_level}</p>
                )}
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Notes
            </h3>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => handleFieldChange('notes', e.target.value || null)}
              disabled={!canEdit}
              placeholder="Additional notes about this record..."
              rows={4}
              className={cn(
                'w-full px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)]',
                'text-white placeholder:text-[#6b7280]',
                'focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:ring-offset-2 focus:ring-offset-[#0a0e27]',
                'transition-all duration-200',
                !canEdit && 'opacity-50 cursor-not-allowed'
              )}
            />
          </div>

          {/* Edit History */}
          {editHistory.length > 0 && (
            <div
              className={cn(
                'p-4 rounded-lg bg-[rgba(20,184,166,0.05)] border border-[rgba(20,184,166,0.2)]'
              )}
            >
              <h4 className="text-sm font-semibold text-[#14b8a6] mb-2">
                Edit History ({editHistory.length})
              </h4>
              <div className="space-y-2">
                {editHistory.map((entry, idx) => (
                  <div key={idx} className="text-xs text-[#a0a9c9]">
                    <span className="font-medium capitalize">{entry.field}:</span>{' '}
                    <span className="line-through text-[#6b7280]">
                      {JSON.stringify(entry.oldValue)}
                    </span>{' '}
                    → <span className="text-[#10b981]">{JSON.stringify(entry.newValue)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Confirmation Dialog for Sensitive Changes */}
      <Modal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        title="Confirm Sensitive Changes"
        description="The following changes affect sensitive fields and require confirmation"
        size="md"
        footer={
          <div className="flex gap-3">
            <Button
              variant="tertiary"
              size="md"
              onClick={() => setShowConfirmation(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => handleConfirmSave(pendingChanges)}
              loading={isLoading}
            >
              Confirm & Save
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div
            className={cn(
              'p-4 rounded-lg bg-[rgba(251,191,36,0.1)] border border-[rgba(251,191,36,0.2)]',
              'flex items-start gap-3'
            )}
          >
            <AlertTriangle size={18} className="text-[#fbbf24] flex-shrink-0 mt-0.5" />
            <div className="text-sm text-[#fbbf24]">
              <p className="font-medium mb-1">
                These changes will be permanently recorded in the audit trail.
              </p>
              <p className="text-xs opacity-90">
                All sensitive field updates require administrator action and are logged for compliance.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {Object.entries(pendingChanges).map(([field, value]) => {
              if (!isSensitiveField(field)) return null;
              const oldValue = record[field as keyof CriminalRecord];
              return (
                <div key={field} className="text-sm p-3 rounded bg-[rgba(255,255,255,0.05)]">
                  <p className="font-medium text-white capitalize">{field}</p>
                  <div className="flex gap-2 mt-1 text-xs text-[#a0a9c9]">
                    <span className="line-through">{JSON.stringify(oldValue)}</span>
                    <span>→</span>
                    <span className="text-[#14b8a6] font-medium">{JSON.stringify(value)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Modal>
    </>
  );
}

export default EditRecordModal;
