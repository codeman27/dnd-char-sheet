import { ReactNode } from 'react';

interface SheetCardProps {
  title: string;
  hint?: string;
  children: ReactNode;
  noPad?: boolean;
  className?: string;
  headerExtra?: ReactNode;
}

export function SheetCard({ title, hint, children, noPad, className = '', headerExtra }: SheetCardProps) {
  return (
    <div className={`sheet-card ${className}`}>
      <div className="card-header-dark">
        <span>{title}</span>
        {hint && <span className="font-handwriting text-[10px] text-[#8a9ab8] normal-case tracking-normal ml-auto font-normal">{hint}</span>}
        {headerExtra}
      </div>
      <div className={noPad ? '' : 'p-3'}>
        {children}
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  children: ReactNode;
  className?: string;
}

export function Field({ label, children, className = '' }: FieldProps) {
  return (
    <div className={`flex flex-col gap-0.5 mb-2.5 ${className}`}>
      <label className="font-cinzel text-[9px] tracking-widest uppercase text-[#6b6555]">{label}</label>
      {children}
    </div>
  );
}
