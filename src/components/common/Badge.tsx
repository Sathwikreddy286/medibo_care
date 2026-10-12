import React from 'react';
import { DoseStatus } from '../../types';

interface DoseBadgeProps {
  status: DoseStatus;
  size?: 'sm' | 'md';
}

export const DoseBadge: React.FC<DoseBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  switch (status) {
    case 'taken':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 ${sizeClasses}`}
        >
          <span className="font-bold text-[13px]">✓</span> Taken
        </span>
      );
    case 'missed':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/80 ${sizeClasses}`}
        >
          <span className="font-bold text-[13px]">✕</span> Missed
        </span>
      );
    case 'delayed':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80 ${sizeClasses}`}
        >
          <span className="font-bold text-[13px]">◐</span> Delayed
        </span>
      );
    case 'upcoming':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-purple-50 text-brand-800 border border-purple-200/80 ${sizeClasses}`}
        >
          <span className="font-bold text-[13px]">○</span> Upcoming
        </span>
      );
  }
};

interface StatusPillProps {
  type: 'success' | 'warning' | 'danger' | 'info' | 'purple';
  label: string;
  icon?: React.ReactNode;
}

export const StatusPill: React.FC<StatusPillProps> = ({ type, label, icon }) => {
  const styles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    purple: 'bg-brand-50 text-brand-800 border-brand-200'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${styles[type]}`}
    >
      {icon}
      {label}
    </span>
  );
};
