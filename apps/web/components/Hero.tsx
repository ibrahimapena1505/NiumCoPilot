"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export function Hero() {
  return (
    <Box>
      <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
        Nium Intelligence Pilot
      </Typography>
      <Typography
        variant="body1"
        sx={{ color: "rgb(185,196,215)", maxWidth: 720 }}
      >
        Start-to-finish demo environment that scrapes Nium documentation, builds a
        searchable knowledge base, and surfaces AI-assisted workflows across internal
        tools. This slice focuses on the ingestion pipeline, retrieval UX, and
        integration placeholders ready to be wired into production APIs.
      </Typography>
      <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
        <Button component="a" href="#chat" variant="contained" color="info">
          Launch Demo Chat
        </Button>
        <Button component="a" href="#crawl" variant="outlined" color="info">
          View Crawl Schedule
        </Button>
      </Stack>
    </Box>
  );
}
