# Academic Paper Engine — Minimal Prototype

A tiny CLI that fetches **1–3 recent papers** from **arXiv** by topic, then renders a **Markdown digest** with abstracts, links, and a short **"How to read"** guide.

> No API keys. Perfect for a first iteration. Extend later with Semantic Scholar, PubMed, Crossref, Notion/Zotero, and email delivery.

---

## Quickstart

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python paper_engine.py --topics "computational linguistics, neuroscience" --n 3 --days 14 --outfile digest.md
```

Or use the YAML config:

```bash
python paper_engine.py --config config.example.yaml
```

This writes `digest.md` (or prints to stdout if `--outfile` omitted).

---

## What it does

- Queries **arXiv** for your topics (no key needed).
- Filters by recency (`--days` look-back).
- Ranks naively by recency and keyword hits.
- Renders a clean **Markdown digest** with:
  - Title, authors, date, category
  - Abstract
  - Links (landing + PDF)
  - “Why it matters” (very lightweight blurb)
  - “How to read” guidance (based on level)

---

## Scheduling (delivery cadence)

Use cron (Linux/macOS):

```cron
# Every Monday at 08:00
0 8 * * 1 /path/to/python /path/to/paper_engine.py --config /path/to/config.example.yaml
```

Windows Task Scheduler works too.

---

## Extending (next 1–2 days of work)

- Add **Semantic Scholar** or **Crossref** to fetch citation counts; re-rank by novelty vs. influence.
- Add email sender (SMTP / AWS SES) with the Markdown rendered into HTML.
- Persist history (SQLite or Supabase) and deduplicate across runs.
- Add **Notion** or **Zotero** export.
- Improve summarization: section-aware summaries, figures-first explainers, or level-specific TL;DR.

---

## Notes

- This is a minimal, readable starting point.
- All dependencies are standard and MIT-friendly.
- The **arXiv API** has polite usage rules; avoid excessive polling.
- Keep papers per cycle to 1–3 to prevent overload.

---

## License

MIT
