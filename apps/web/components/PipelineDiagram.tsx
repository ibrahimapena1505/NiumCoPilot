"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

const PIPELINE = [
  { title: "Web Scraper", subtitle: "BeautifulSoup + Playwright", description: "Collects Nium documentation with dynamic rendering support." },
  { title: "Knowledge Base", subtitle: "SQLAlchemy ORM", description: "Normalizes content into structured chunks with metadata." },
  { title: "AI Assistant", subtitle: "OpenAI GPT Integration", description: "Retrieves relevant context and crafts guided responses." },
];

const DOWNSTREAM = [
  ["Competitor Monitor", "Async HTTP"],
  ["Industry Monitor", "RSS Feeds"],
  ["Jira Integration", "REST API"],
  ["Database", "SQLite/PostgreSQL"],
  ["Improvement Proposals", "AI Generated"],
  ["Monitoring Scheduler", "Background Tasks"],
  ["Chat Widget", "Embeddable HTML/JS"],
  ["Admin Dashboard", "Streamlit/Plotly"],
  ["FastAPI Server", "Async"],
];

export function PipelineDiagram() {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        Delivery Blueprint
      </Typography>
      <Grid container spacing={2}>
        {PIPELINE.map((stage, index) => (
          <Grid item key={stage.title} xs={12} md={4}>
            <Card
              sx={{
                background: "rgba(14,24,54,0.85)",
                border: "1px solid rgba(78,124,255,0.3)",
                height: "100%",
              }}
            >
              <CardContent>
                <Typography
                  variant="subtitle2"
                  sx={{
                    textTransform: "uppercase",
                    letterSpacing: 3,
                    color: "rgb(101,155,255)",
                    mb: 1,
                  }}
                >
                  Stage {index + 1}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {stage.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "rgb(180,190,210)", mt: 0.5 }}>
                  {stage.subtitle}
                </Typography>
                <Divider sx={{ my: 2, borderColor: "rgba(101,155,255,0.2)" }} />
                <Typography variant="body2" sx={{ color: "rgb(210,216,231)" }}>
                  {stage.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {DOWNSTREAM.map(([title, subtitle]) => (
          <Grid item key={title} xs={12} sm={6} md={4}>
            <Card sx={{ background: "rgba(14,24,54,0.7)", border: "1px solid rgba(78,124,255,0.2)" }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {title}
                </Typography>
                <Typography variant="body2" sx={{ color: "rgb(180,190,210)" }}>
                  {subtitle}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
