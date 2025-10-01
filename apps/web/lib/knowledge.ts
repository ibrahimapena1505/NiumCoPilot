import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'csv-parse/sync';

export type KnowledgeDoc = {
  url: string;
  domain: string;
  pathDepth: number;
};

const MAX_SAMPLE_DOCS = 20;

function resolveCsvPath() {
  const explicit = process.env.NIUM_CSV_PATH;
  if (explicit) {
    return explicit;
  }
  return path.join(process.cwd(), 'data', 'nium_all_urls_exhaustive.csv');
}

export function loadSeedDocuments(limit = MAX_SAMPLE_DOCS): KnowledgeDoc[] {
  const csvPath = resolveCsvPath();
  if (!fs.existsSync(csvPath)) {
    return [];
  }
  const raw = fs.readFileSync(csvPath, 'utf8');
  const records: Array<{ url: string }> = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  return records
    .map((row) => row.url)
    .filter(Boolean)
    .map((url) => {
      try {
        const parsed = new URL(url);
        return {
          url,
          domain: parsed.hostname,
          pathDepth: parsed.pathname.split('/').filter(Boolean).length,
        } satisfies KnowledgeDoc;
      } catch (error) {
        return null;
      }
    })
    .filter(Boolean)
    .slice(0, limit) as KnowledgeDoc[];
}