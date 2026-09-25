import React from 'react';
import { ExternalLink, ShoppingBag } from 'lucide-react';
import { PLATFORM_REGISTRY } from '../utils/platforms';

interface ShoppingButtonsProps {
  links: Record<string, string>;
  maxDisplay?: number;
}

export const ShoppingButtons: React.FC<ShoppingButtonsProps> = ({ links, maxDisplay = 6 }) => {
  if (!links || Object.keys(links).length === 0) return null;

  const entries = Object.entries(links).slice(0, maxDisplay);

  return (
    <div className="flex flex-wrap items-center gap-1.5 mt-2">
      <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mr-1">
        <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />
        Shop on:
      </span>
      {entries.map(([key, url]) => {
        const platform = PLATFORM_REGISTRY[key.toLowerCase()] || {
          name: key.charAt(0).toUpperCase() + key.slice(1),
          badgeBg: 'bg-slate-100 hover:bg-slate-200',
          badgeText: 'text-slate-800',
          borderColor: 'border-slate-200',
        };

        return (
          <a
            key={key}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            title={`Search on ${platform.name}`}
            className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md border transition-all duration-150 shadow-xs hover:shadow-sm ${platform.badgeBg} ${platform.badgeText} ${platform.borderColor}`}
          >
            <span>{platform.name}</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        );
      })}
    </div>
  );
};
