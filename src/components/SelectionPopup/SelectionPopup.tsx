'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { usePokemonStore } from '../../store/usePokemonStore';
import './SelectionPopup.css';

export const SelectionPopup: React.FC = () => {
  const t = useTranslations('Popup');
  const selectedMap = usePokemonStore((s) => s.selected);
  const clearAll = usePokemonStore((s) => s.clearAll);

  const items = Object.values(selectedMap);
  if (items.length === 0) return null;

  const downloadCSV = () => {
    const header = ['name', 'description'];
    const rows = items.map((p) => [p.name, p.description]);
    const csv = [header, ...rows]
      .map((r) => r.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8; ' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${items.length}_items.csv`;
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  };

  return (
    <div className="selection-popup">
      <span>{t('selected', { count: items.length })}</span>
      <button onClick={clearAll}>{t('deselect')}</button>
      <button onClick={downloadCSV}>{t('download')}</button>
    </div>
  );
};
