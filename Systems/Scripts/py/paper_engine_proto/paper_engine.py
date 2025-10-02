#!/usr/bin/env python3
"""
Academic Paper Engine — Minimal Prototype (CLI)
------------------------------------------------
Fetch 1–3 recent papers by topic from arXiv and render a digest.
- No API keys required.
- Output: Markdown digest (stdout or file).

Usage:
  python paper_engine.py --topics "computational linguistics, neuroscience" --n 3 --days 14 --outfile digest.md
  python paper_engine.py --config config.yaml

Scheduling:
- Use cron or Windows Task Scheduler to run on your preferred cadence.
"""

import argparse
import datetime as dt
import os
import sys
import textwrap
from typing import List, Dict, Any, Optional
import urllib.parse


try:
    import requests
    import feedparser
    import yaml
    from jinja2 import Template
except ImportError as e:
    sys.stderr.write("Missing dependencies. Please run: pip install -r requirements.txt\n")
    raise

ARXIV_API = "http://export.arxiv.org/api/query"

def parse_args():
    p = argparse.ArgumentParser(description="Academic Paper Engine — arXiv prototype")
    p.add_argument("--topics", type=str, help="Comma-separated list of topics")
    p.add_argument("--n", type=int, default=3, help="Papers per cycle (1-3 recommended)")
    p.add_argument("--days", type=int, default=30, help="Look-back window for recency")
    p.add_argument("--outfile", type=str, default=None, help="Write digest to a Markdown file")
    p.add_argument("--level", choices=["beginner","intermediate","expert"], default="intermediate",
                   help="Reading level for guidance blurbs")
    p.add_argument("--config", type=str, help="YAML config path (overrides CLI flags if provided)")
    return p.parse_args()

def load_config(path: str) -> Dict[str, Any]:
    with open(path, "r") as f:
        return yaml.safe_load(f)

def arxiv_search_query(topics: List[str]) -> str:
    # Combine topics into arXiv query with OR across all fields
    # Example: (all:computational AND all:linguistics) OR (all:neuroscience)
    parts = []
    for t in topics:
        t = t.strip()
        if not t: 
            continue
        words = [w for w in t.split() if w]
        if len(words) == 1:
            parts.append(f'all:"{words[0]}"')
        else:
            inner = " AND ".join([f'all:"{w}"' for w in words])
            parts.append(f'({inner})')
    if not parts:
        return 'all:"machine learning"'
    return " OR ".join(parts)

def fetch_arxiv(topics: List[str], days: int, max_results: int = 25) -> List[Dict[str, Any]]:
    query = arxiv_search_query(topics)
    params = {
        "search_query": query,
        "sortBy": "submittedDate",
        "sortOrder": "descending",
        "start": 0,
        "max_results": max_results
    }
    url = ARXIV_API + "?" + urllib.parse.urlencode(params)
    feed = feedparser.parse(url)
    results = []
    cutoff = dt.datetime.utcnow() - dt.timedelta(days=days)
    for e in feed.entries:
        # Parse dates safely
        published = None
        if hasattr(e, "published_parsed") and e.published_parsed:
            published = dt.datetime(*e.published_parsed[:6])
        elif hasattr(e, "updated_parsed") and e.updated_parsed:
            published = dt.datetime(*e.updated_parsed[:6])
        else:
            published = dt.datetime.utcnow()

        if published < cutoff:
            continue

        pdf_link = None
        for link in e.links:
            if link.get("type") == "application/pdf":
                pdf_link = link.get("href")
                break
        primary_cat = getattr(e, "arxiv_primary_category", {}).get("term", "")
        authors = [a.name for a in getattr(e, "authors", [])]
        results.append({
            "title": e.title.strip(),
            "summary": getattr(e, "summary", "").strip(),
            "published": published,
            "link": getattr(e, "link", ""),
            "pdf": pdf_link,
            "authors": authors,
            "primary_category": primary_cat
        })
    return results

def simple_rank(papers: List[Dict[str, Any]], topics: List[str], top_k: int) -> List[Dict[str, Any]]:
    # Naive relevance: recency + keyword hits in title/summary
    topic_terms = [w.lower().strip() for t in topics for w in t.split() if w.strip()]
    ranked = []
    now = dt.datetime.utcnow()
    for p in papers:
        recency_days = max(1, (now - p["published"]).days)
        recency_score = 1.0 / recency_days  # newer => higher
        text = (p["title"] + " " + p["summary"]).lower()
        kw_hits = sum(text.count(term) for term in topic_terms) if topic_terms else 0
        score = recency_score + (0.2 * kw_hits)
        p["score"] = score
        ranked.append(p)
    ranked.sort(key=lambda x: x["score"], reverse=True)
    return ranked[:top_k]

GUIDANCE_MAP = {
    "beginner": "Start with the abstract. Skim intro & conclusion; skip proofs/appendices first pass.",
    "intermediate": "Read abstract → intro → figures → discussion. Note unfamiliar terms for later.",
    "expert": "Skim contributions and methods. Jump to experiments/limitations; check references for gaps."
}

def why_it_matters_blurb(p: Dict[str, Any]) -> str:
    # Very naive "why it matters": extract first 1–2 sentences from abstract and reframe
    abstract = p.get("summary", "").replace("\n", " ").strip()
    sentences = [s.strip() for s in abstract.split(". ") if s.strip()]
    base = sentences[0] if sentences else ""
    if base:
        return f"This work is relevant because it addresses: {base.rstrip('.')}."
    return "This paper potentially advances the topic with new findings or synthesis."

def render_digest(papers: List[Dict[str, Any]], topics: List[str], level: str) -> str:
    template_path = os.path.join(os.path.dirname(__file__), "templates", "digest_email.md.j2")
    
    # Check if template exists, otherwise use inline template
    if os.path.exists(template_path):
        with open(template_path, "r") as f:
            tpl = Template(f.read())
    else:
        # Fallback inline template
        inline_template = """# Academic Paper Digest — {{ date }}

**Topics:** {{ topics|join(', ') }}
**Reading Level:** {{ level }}

## Reading Guidance
{{ guidance }}

---

{% for paper in papers %}
## {{ loop.index }}. {{ paper.title }}

**Authors:** {{ paper.authors|join(', ') }}
**Published:** {{ paper.published.strftime('%Y-%m-%d') }}
**Category:** {{ paper.primary_category }}

### Abstract
{{ paper.summary }}

### Why It Matters
{{ paper.why_it_matters }}

**Links:**
- [arXiv page]({{ paper.link }})
{% if paper.pdf %}- [PDF]({{ paper.pdf }}){% endif %}

---
{% endfor %}
"""
        tpl = Template(inline_template)
    
    return tpl.render(
        date=dt.datetime.utcnow().strftime("%Y-%m-%d"),
        topics=topics,
        level=level,
        guidance=GUIDANCE_MAP.get(level, GUIDANCE_MAP["intermediate"]),
        papers=papers
    )

def main():
    args = parse_args()
    if args.config:
        cfg = load_config(args.config)
        topics = cfg.get("topics", [])
        n = int(cfg.get("n", 3))
        days = int(cfg.get("days", 30))
        outfile = cfg.get("outfile")
        level = cfg.get("level", "intermediate")
    else:
        topics = [t.strip() for t in (args.topics or "").split(",") if t.strip()]
        n = args.n
        days = args.days
        outfile = args.outfile
        level = args.level

    if not topics:
        topics = ["computational linguistics"]  # sane default

    all_papers = fetch_arxiv(topics=topics, days=days, max_results=50)
    top_papers = simple_rank(all_papers, topics, top_k=max(1, min(3, n)))
    # Add naive "why it matters" blurbs
    for p in top_papers:
        p["why_it_matters"] = why_it_matters_blurb(p)

    digest_md = render_digest(top_papers, topics, level)

    if outfile:
        with open(outfile, "w", encoding="utf-8") as f:
            f.write(digest_md)
        print(f"Wrote digest to {outfile}")
    else:
        print(digest_md)

if __name__ == "__main__":
    main()