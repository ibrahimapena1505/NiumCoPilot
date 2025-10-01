"use client";

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Grid2 from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';

const INTEGRATIONS = [
  { name: 'Jira', status: 'Placeholder API', detail: 'Mocks issue search & triage.' },
  { name: 'Slack', status: 'Placeholder API', detail: 'Simulated slash command responses.' },
  { name: 'Confluence', status: 'Placeholder API', detail: 'Stubs for space/page search.' },
  { name: 'Metabase', status: 'Placeholder API', detail: 'Static dashboard responses.' },
  { name: 'Salesforce', status: 'Placeholder API', detail: 'Sample deal enrichment payloads.' },
  { name: 'Zendesk', status: 'Placeholder API', detail: 'Ticket insights via mock data.' },
];

export function IntegrationStatus() {
  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        Integration Surface (Demo)
      </Typography>
      <Grid2 container spacing={2} columns={12}>
        {INTEGRATIONS.map((item) => (
          <Grid2 key={item.name} xs={12} md={4}>
            <Card sx={{ background: 'rgba(14,24,54,0.7)', border: '1px solid rgba(78,124,255,0.2)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {item.name}
                  </Typography>
                  <Chip size="small" label={item.status} color="info" variant="outlined" />
                </Box>
                <Typography variant="body2" sx={{ color: 'rgb(180,190,210)' }}>
                  {item.detail}
                </Typography>
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
}
