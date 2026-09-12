# AgentX

AI-powered PC monitoring and diagnostics prototype.

## Architecture

```text
Local Python Agent -> Next.js/Vercel API -> Supabase/PostgreSQL
                                      \-> anomaly detection + diagnosis
Next.js dashboard <---------------------/
```

The local agent collects CPU, memory, disk, network, temperature and load metrics. The server stores telemetry, detects threshold/statistical anomalies, and creates evidence-based diagnosis records. AI-assisted diagnosis is the next layer; the current deterministic engine provides a safe fallback.

## Structure

- `agent/` — Python PC monitoring agent
- `web/` — Next.js dashboard and API routes
- `supabase/migrations/` — database schema

## Run the agent

```bash
cd agent
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python agent.py
```

Never put the Supabase service-role key in the local agent.
