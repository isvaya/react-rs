'use server';

import { PokemonWithDescription } from '@/interface/interface';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function generateCsvAction(data: PokemonWithDescription[]) {
  const header = ['name', 'description'];
  const rows = data.map((p) => [p.name, p.description]);
  const csv = [header, ...rows]
    .map((r) => r.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const filename = `${data.length}_items.csv`;
  const filePath = join(process.cwd(), 'public', filename);

  await writeFile(filePath, csv, 'utf-8');

  return `/${filename}`;
}
