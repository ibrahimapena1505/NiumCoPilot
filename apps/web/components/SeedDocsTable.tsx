"use client";

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import type { KnowledgeDoc } from '../lib/knowledge';

type Props = {
  docs: KnowledgeDoc[];
};

export function SeedDocsTable({ docs }: Props) {
  if (!docs.length) {
    return (
      <Paper sx={{ p: 3, background: 'rgba(14,24,54,0.6)', border: '1px solid rgba(78,124,255,0.2)' }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Seed URLs
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgb(180,190,210)' }}>
          Provide the CSV at <code>data/nium_all_urls_exhaustive.csv</code> or set the <code>NIUM_CSV_PATH</code> env variable to see a preview of the scraped pages.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Seed URLs ({docs.length.toLocaleString()} showing)
      </Typography>
      <TableContainer component={Paper} sx={{ background: 'rgba(14,24,54,0.75)', border: '1px solid rgba(78,124,255,0.2)' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>URL</TableCell>
              <TableCell>Domain</TableCell>
              <TableCell align="right">Path Depth</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {docs.map((doc) => (
              <TableRow key={doc.url} sx={{ '& td': { borderColor: 'rgba(78,124,255,0.15)' } }}>
                <TableCell>
                  <Link href={doc.url} target="_blank" rel="noopener" sx={{ color: 'rgb(115,205,255)' }}>
                    {doc.url}
                  </Link>
                </TableCell>
                <TableCell>{doc.domain}</TableCell>
                <TableCell align="right">{doc.pathDepth}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}