'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { usePokemonStore } from '../../store/usePokemonStore';
import { generateCsvAction } from '@/app/actions/download-csv';
import './SelectionPopup.css';

export const SelectionPopup: React.FC = () => {
  const t = useTranslations('Popup');
  const selectedMap = usePokemonStore((s) => s.selected);
  const clearAll = usePokemonStore((s) => s.clearAll);

  const items = Object.values(selectedMap);
  if (items.length === 0) return null;

  const downloadCSV = async () => {
    try {
      const fileUrl = await generateCsvAction(items);

      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileUrl.split('/').pop() ?? 'data.csv';
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Ошибка при скачивании CSV:', error);
    }
  };

  return (
    <div className="selection-popup">
      <span>{t('selected', { count: items.length })}</span>
      <button onClick={clearAll}>{t('deselect')}</button>
      <button onClick={downloadCSV}>{t('download')}</button>
    </div>
  );
};
