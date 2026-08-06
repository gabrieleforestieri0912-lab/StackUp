import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  small?: boolean;
  textOnly?: boolean;
}

const Badge: React.FC<BadgeProps> = ({ children, className = '', small = false, textOnly = false }) => {
  if (small) {
    if (textOnly) {
      return (
        <span className={`inline-block text-orange-300 text-sm font-semibold uppercase tracking-[0.12em] mb-4 ${className}`}>
          {children}
        </span>
      );
    }
    return (
      <span className={`inline-block px-3 py-1.5 bg-zinc-900 text-orange-300 text-sm font-semibold uppercase tracking-[0.12em] rounded-lg mb-4 ${className}`}>
        {children}
      </span>
    );
  }
  return (
    <span className={`w-fit px-4 py-4 md:px-6 md:py-6 bg-[#111111] border border-white/8 rounded-lg text-balance text-2xl font-bold tracking-tight text-white md:text-5xl ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
