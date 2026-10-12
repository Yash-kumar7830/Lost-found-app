import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone. Are you sure you want to proceed?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  isLoading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md" showClose={!isLoading}>
      <div className="flex items-start gap-4">
        <div
          className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
            isDestructive
              ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
              : 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
          }`}
        >
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h4 className="text-base font-bold text-slate-900 dark:text-white">
            {title}
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            {message}
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <Button
          variant="outline"
          size="md"
          onClick={onClose}
          disabled={isLoading}
        >
          {cancelLabel}
        </Button>
        <Button
          variant={isDestructive ? 'danger' : 'primary'}
          size="md"
          onClick={onConfirm}
          isLoading={isLoading}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
