import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, XCircle, AlertCircle, Clock } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  highlight?: boolean;
  trend?: { value: string; isPositive: boolean; label?: string };
  statusBadge?: React.ReactNode;
  onClick?: () => void;
  badge?: React.ReactNode;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title, value, unit, subtitle, icon, highlight, trend, statusBadge, onClick, badge
}) => (
  <div
    onClick={onClick}
    className={`bg-white rounded-2xl p-5 border shadow-subtle flex flex-col justify-between transition-all ${
      highlight ? 'border-brand-200 bg-brand-50/30' : 'border-slate-200/80'
    } ${onClick ? 'cursor-pointer hover:shadow-md hover:border-brand-200' : ''}`}
  >
    <div className="flex items-start justify-between mb-3">
      <div className={`p-2 rounded-xl ${highlight ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-charcoal-500'}`}>
        {icon}
      </div>
      {badge}
    </div>
    <div>
      <p className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider mb-1">{title}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-black text-charcoal-900 tracking-tight">{value}</span>
        {unit && <span className="text-sm font-semibold text-charcoal-500">{unit}</span>}
      </div>
      {subtitle && <p className="text-xs text-charcoal-400 mt-1">{subtitle}</p>}
      {trend && (
        <span className={`mt-2 inline-flex items-center text-xs font-semibold ${trend.isPositive ? 'text-emerald-600' : 'text-rose-500'}`}>
          {trend.isPositive ? '↑' : '↓'} {trend.value}
          {trend.label && <span className="text-charcoal-400 font-normal ml-1">{trend.label}</span>}
        </span>
      )}
      {statusBadge && <div className="mt-2">{statusBadge}</div>}
    </div>
  </div>
);
