import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Hero } from '../components/Hero';
import { IntegrationStatus } from '../components/IntegrationStatus';
import { PipelineDiagram } from '../components/PipelineDiagram';
import { SeedDocsTable } from '../components/SeedDocsTable';
import { loadSeedDocuments } from '../lib/knowledge';

export default function Home() {
  const docs = loadSeedDocuments(50);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Stack spacing={5}>
        <Hero />
        <Divider sx={{ borderColor: 'rgba(78,124,255,0.2)' }} />
        <PipelineDiagram />
        <Divider sx={{ borderColor: 'rgba(78,124,255,0.2)' }} />
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Crawl Seeds Preview
        </Typography>
        <SeedDocsTable docs={docs} />
        <IntegrationStatus />
      </Stack>
    </Container>
  );
}