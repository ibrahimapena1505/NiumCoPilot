import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import pLimit from 'p-limit';
import * as cheerio from 'cheerio';
import { loadSeedDocuments } from "../../../lib/knowledge";


type RankedDoc = {
  url: string;
  title: string;
  snippet: string;
  score: number;
};

const FETCH_CONCURRENCY = 3;
const MAX_CONTEXT_DOCS = 4;
const FETCH_TIMEOUT_MS = 10000;
const MAX_HTML_LENGTH = 250_000;

function tokenize(input: string): string[] {
  return input
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

function scoreText(text: string, tokens: string[]): number {
  const lower = text.toLowerCase();
  return tokens.reduce((score, token) => {
    if (!token) return score;
    const matches = lower.match(new RegExp(`\\b${token.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}\\b`, 'g'));
    return score + (matches?.length ?? 0);
  }, 0);
}

function buildSnippet(content: string, tokens: string[], maxLength = 600): string {
  const paragraphs = content
    .split(/\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 40);

  if (!paragraphs.length) {
    return content.slice(0, maxLength);
  }

  const rankedParagraphs = paragraphs
    .map((paragraph) => ({
      paragraph,
      score: scoreText(paragraph, tokens),
    }))
    .sort((a, b) => b.score - a.score);

  const best = rankedParagraphs.find((item) => item.score > 0) ?? rankedParagraphs[0];
  return best.paragraph.slice(0, maxLength);
}

async function fetchHtml(url: string): Promise<string | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'user-agent': 'Nium-intelligence-demo/1.0 (https://vercel.com)',
        accept: 'text/html,application/xhtml+xml',
      },
    });
    if (!response.ok) {
      return null;
    }
    const html = await response.text();
    return html.slice(0, MAX_HTML_LENGTH);
  } catch (error) {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchAndRank(url: string, tokens: string[]): Promise<RankedDoc | null> {
  const html = await fetchHtml(url);
  if (!html) return null;
  const $ = cheerio.load(html);
  const title = $('title').text().trim() || url;
  const bodyText = $('main').text().trim() || $('body').text().trim();
  if (!bodyText) return null;
  const score = scoreText(bodyText, tokens);
  if (score === 0) return null;
  const snippet = buildSnippet(bodyText, tokens);
  return { url, title, snippet, score };
}

export async function POST(request: Request) {
  const { question } = await request.json().catch(() => ({ question: '' }));
  if (!question || typeof question !== 'string') {
    return NextResponse.json(
      { error: 'Question is required.' },
      { status: 400 }
    );
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OPENAI_API_KEY not configured.' },
      { status: 500 }
    );
  }

  const seeds = loadSeedDocuments(60);
  if (!seeds.length) {
    return NextResponse.json(
      { error: 'No seed documents available. Ensure the crawl CSV is uploaded.' },
      { status: 500 }
    );
  }

  const tokens = tokenize(question).filter((token) => token.length > 2);
  const limiter = pLimit(FETCH_CONCURRENCY);

  const ranked = (
    await Promise.all(
      seeds.map((doc) => limiter(() => fetchAndRank(doc.url, tokens)))
    )
  )
    .filter((item): item is RankedDoc => Boolean(item))
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_CONTEXT_DOCS);

  if (!ranked.length) {
    return NextResponse.json(
      {
        answer: "I couldn't find relevant Nium documentation for that question yet. Try a different phrasing or add a keyword from the docs.",
        sources: [],
      },
      { status: 200 }
    );
  }

  const context = ranked
    .map((doc, index) => `Source ${index + 1}: ${doc.title}\nURL: ${doc.url}\nExcerpt: ${doc.snippet}`)
    .join('\n\n');

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.2,
    messages: [
      {
        role: 'system',
        content: 'You are an internal knowledge assistant for Nium. Answer using the provided context. Include concise bullet points when helpful. Cite sources as [1](URL). If the context is insufficient, say so and suggest next steps.',
      },
      {
        role: 'user',
        content: `Question: ${question}\n\nContext:\n${context}`,
      },
    ],
  });

  const answer = completion.choices[0]?.message?.content ?? 'No answer generated.';

  return NextResponse.json({
    answer,
    sources: ranked.map((doc, idx) => ({
      id: idx + 1,
      url: doc.url,
      title: doc.title,
    })),
  });
}
