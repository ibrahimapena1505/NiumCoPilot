"use client";

import { useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  sources?: Array<{ id: number; url: string; title: string }>;
};

export function ChatSection() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!question.trim() || loading) return;

    const newQuestion = question.trim();
    setMessages((prev) => [...prev, { role: "user", content: newQuestion }]);
    setLoading(true);
    setError(null);
    setQuestion("");

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: newQuestion }),
      });

      const raw = await response.text();
      const data = raw ? JSON.parse(raw) : {};

      if (!response.ok) {
        throw new Error(data.error || raw || "Failed to query assistant.");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer ?? "No answer returned.",
          sources: data.sources ?? [],
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ background: "rgba(14,24,54,0.9)", border: "1px solid rgba(78,124,255,0.25)" }}>
      <CardContent>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          Ask Nium Docs
        </Typography>
        <Typography variant="body2" sx={{ color: "rgb(185,196,215)", mb: 3 }}>
          Query the scraped documentation. Responses cite the underlying URLs and stay within demo data scope.
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
          <TextField
            multiline
            minRows={2}
            maxRows={6}
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="e.g. What are the payout limits for virtual cards?"
            disabled={loading}
            InputProps={{
              sx: {
                background: "rgba(5,10,24,0.8)",
                borderRadius: 2,
                color: "#f5f5ff",
              },
            }}
          />
          <Stack direction="row" spacing={2} alignItems="center">
            <Button type="submit" variant="contained" color="info" disabled={loading || !question.trim()}>
              {loading ? (
                <>
                  <CircularProgress size={18} sx={{ mr: 1 }} />
                  Thinking…
                </>
              ) : (
                "Ask"
              )}
            </Button>
            <Typography variant="caption" sx={{ color: "rgb(145,160,185)" }}>
              Powered by OpenAI · Provide clear terms for best results
            </Typography>
          </Stack>
        </Box>
        {error ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        ) : null}
        <Divider sx={{ my: 3, borderColor: "rgba(78,124,255,0.2)" }} />
        <Stack spacing={2}>
          {messages.length === 0 ? (
            <Typography variant="body2" sx={{ color: "rgb(165,175,205)" }}>
              Submit a question to see contextual answers. Recent questions will appear here with citations.
            </Typography>
          ) : (
            messages.map((message, index) => (
              <Box
                key={`${message.role}-${index}`}
                sx={{
                  background: message.role === "user" ? "rgba(78,124,255,0.15)" : "rgba(12,24,64,0.7)",
                  border: "1px solid rgba(78,124,255,0.25)",
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <Typography variant="subtitle2" sx={{ color: "rgb(145,200,255)", mb: 1 }}>
                  {message.role === "user" ? "You" : "Nium Copilot"}
                </Typography>
                {message.role === "assistant" ? (
                  <Box
                    sx={{
                      "& p": { color: "rgb(215,220,235)", mb: 1 },
                      "& strong": { fontWeight: 700, color: "#f5f5ff" },
                      "& ul, & ol": { color: "rgb(215,220,235)", pl: 3, mb: 1 },
                      "& li": { mb: "0.35rem" },
                      "& a": { color: "rgb(115,205,255)" },
                    }}
                  >
                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>{message.content}</ReactMarkdown>
                  </Box>
                ) : (
                  <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                    {message.content}
                  </Typography>
                )}
                {message.sources?.length ? (
                  <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
                    {message.sources.map((source) => (
                      <Button
                        key={source.id}
                        component="a"
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="small"
                        variant="outlined"
                        color="info"
                        sx={{ textTransform: "none" }}
                      >
                        [{source.id}] {source.title}
                      </Button>
                    ))}
                  </Stack>
                ) : null}
              </Box>
            ))
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
