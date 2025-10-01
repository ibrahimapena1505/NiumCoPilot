from __future__ import annotations

from functools import lru_cache
from pathlib import Path, PurePosixPath
from typing import Annotated
from urllib.parse import urlparse

import pandas as pd
from fastapi import Depends, FastAPI, HTTPException
from pydantic import BaseModel, Field

CSV_DEFAULT = Path(__file__).resolve().parents[2] / "data" / "nium_all_urls_exhaustive.csv"

app = FastAPI(
    title="Nium Intelligence Demo API",
    description="Placeholder backend connecting crawler outputs to downstream integrations.",
    version="0.1.0",
)


class Document(BaseModel):
    url: str = Field(..., example="https://docs.nium.com/api")
    domain: str = Field(..., example="docs.nium.com")
    path_depth: int = Field(..., ge=0)


class IntegrationResponse(BaseModel):
    system: str
    status: str
    summary: str
    sample_payload: dict[str, str]


@lru_cache
def get_dataframe(csv_path: str | None = None) -> pd.DataFrame:
    path = Path(csv_path) if csv_path else CSV_DEFAULT
    if not path.exists():
        return pd.DataFrame(columns=["url", "domain", "path_depth"])

    df = pd.read_csv(path)
    if "url" not in df.columns:
        raise ValueError("CSV must contain a 'url' column")

    df = df.dropna(subset=["url"]).copy()

    def extract_domain(value: str) -> str:
        try:
            return urlparse(value).netloc
        except Exception:
            return ""

    def extract_depth(value: str) -> int:
        try:
            parsed = urlparse(value)
            pure_path = PurePosixPath(parsed.path)
            return len([segment for segment in pure_path.parts if segment not in ("/", "")])
        except Exception:
            return 0

    df["domain"] = df["url"].apply(extract_domain)
    df["path_depth"] = df["url"].apply(extract_depth)
    return df


def dataframe_dependency() -> pd.DataFrame:
    csv_path = Path.cwd() / "data" / "nium_all_urls_exhaustive.csv"
    return get_dataframe(str(csv_path))


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/documents", response_model=list[Document])
def list_documents(
    df: Annotated[pd.DataFrame, Depends(dataframe_dependency)],
    limit: int = 100,
) -> list[Document]:
    records = df.head(limit).to_dict(orient="records")
    return [Document(**record) for record in records]


INTEGRATION_PLACEHOLDERS = {
    "jira": IntegrationResponse(
        system="Jira",
        status="placeholder",
        summary="Mocks Jira issue search with deterministic demo payloads.",
        sample_payload={
            "query": "project = NIUM AND text ~ 'transaction limit'",
            "issues": "2",
            "link": "https://jira.example.com/browse/NIUM-123",
        },
    ),
    "slack": IntegrationResponse(
        system="Slack",
        status="placeholder",
        summary="Simulated slash command response for #support channel.",
        sample_payload={
            "command": "/nium-assist",
            "response": "Found 3 relevant docs and 1 active incident.",
        },
    ),
    "confluence": IntegrationResponse(
        system="Confluence",
        status="placeholder",
        summary="Returns static page metadata mimicking Confluence search.",
        sample_payload={
            "space": "Nium Ops",
            "page": "Nium Payout Playbook",
            "url": "https://confluence.example.com/x/abcd",
        },
    ),
    "metabase": IntegrationResponse(
        system="Metabase",
        status="placeholder",
        summary="Demo analytics card for payment reconciliation KPIs.",
        sample_payload={
            "dashboard": "Payments Health",
            "metric": "Refund SLA",
            "value": "98%",
        },
    ),
    "salesforce": IntegrationResponse(
        system="Salesforce",
        status="placeholder",
        summary="Replicates sales insight card for merchant onboarding.",
        sample_payload={
            "account": "Acme Fintech",
            "stage": "Negotiation",
            "next_step": "Review payout tiers",
        },
    ),
    "zendesk": IntegrationResponse(
        system="Zendesk",
        status="placeholder",
        summary="Ticket enrichment output for support automation flow.",
        sample_payload={
            "ticket_id": "#34567",
            "sentiment": "frustrated",
            "recommendation": "Escalate to Tier 2",
        },
    ),
}


@app.get("/integrations/{system}", response_model=IntegrationResponse)
def get_integration(system: str) -> IntegrationResponse:
    key = system.lower()
    if key not in INTEGRATION_PLACEHOLDERS:
        raise HTTPException(status_code=404, detail="Integration not defined")
    return INTEGRATION_PLACEHOLDERS[key]


@app.post("/bugs/draft-fix")
def draft_bug_fix(payload: dict[str, str]) -> dict[str, str]:
    """Creates a deterministic mock bug fix suggestion."""
    title = payload.get("title", "Unknown issue").strip().lower().replace(" ", "-") or "issue"
    repo = payload.get("repository", "platform")
    return {
        "status": "placeholder",
        "summary": f"Draft fix for '{payload.get('title', 'Unknown issue')}' in {repo} prepared. Awaiting developer approval.",
        "branch": f"demo/fix-{title}",
    }