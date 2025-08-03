import React from 'react';
import { usePokemonStore } from '../../store/usePokemonStore';
import './SelectionPopup.css';

export const SelectionPopup: React.FC = () => {
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
    URL.revokeObjectURL(url);
  };

  return (
    <div className="selection-popup">
      <span>Selected {items.length} elements</span>
      <button onClick={clearAll}>Deselect all</button>
      <button onClick={downloadCSV}>Download CSV</button>
    </div>
  );
};
