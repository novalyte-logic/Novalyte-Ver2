import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';

type ConfirmationPayload = {
  reason: string;
  confirmationCode: string;
};

interface SensitiveActionDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  busy?: boolean;
  onClose: () => void;
  onConfirm: (payload: ConfirmationPayload) => Promise<void> | void;
}

export function SensitiveActionDialog({
  open,
  title,
  description,
  confirmLabel,
  busy = false,
  onClose,
  onConfirm,
}: SensitiveActionDialogProps) {
  const [reason, setReason] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) {
      setReason('');
      setConfirmationCode('');
      setError('');
    }
  }, [open]);

  const handleConfirm = async () => {
    if (!reason.trim()) {
      setError('Reason is required.');
      return;
    }
    if (!confirmationCode.trim()) {
      setError('Confirmation code is required.');
      return;
    }

    setError('');
    await onConfirm({
      reason: reason.trim(),
      confirmationCode: confirmationCode.trim(),
    });
  };

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={busy ? undefined : onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
          >
            <Card className="w-full max-w-lg border-surface-3 bg-[#0E141D] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-warning/20 bg-warning/10">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-display font-semibold text-white">{title}</h2>
                  <p className="mt-2 text-sm text-text-secondary">{description}</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-secondary">Operator reason</label>
                  <textarea
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    placeholder="Document the operational reason for this action."
                    className="min-h-28 w-full rounded-xl border border-surface-3 bg-[#05070A] px-4 py-3 text-sm text-white outline-none transition-colors focus:border-primary/50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-text-secondary">Confirmation code</label>
                  <input
                    type="password"
                    value={confirmationCode}
                    onChange={(event) => setConfirmationCode(event.target.value)}
                    inputMode="numeric"
                    placeholder="Enter internal code"
                    className="h-12 w-full rounded-xl border border-surface-3 bg-[#05070A] px-4 text-sm font-mono tracking-[0.25em] text-white outline-none transition-colors focus:border-primary/50"
                  />
                </div>
              </div>

              {error ? (
                <div className="mt-4 rounded-xl border border-danger/25 bg-danger/10 px-4 py-3 text-sm text-danger">
                  {error}
                </div>
              ) : null}

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button variant="outline" onClick={onClose} disabled={busy} className="border-surface-3 bg-[#05070A] text-white hover:bg-surface-2">
                  Cancel
                </Button>
                <Button onClick={handleConfirm} disabled={busy} className="font-semibold">
                  {busy ? 'Processing...' : confirmLabel}
                </Button>
              </div>
            </Card>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
