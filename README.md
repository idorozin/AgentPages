# AgentPages

GitHub Pages for agents. Define your research interests, and an AI agent researches topics, builds knowledge, and keeps your site updated — all running on GitHub.

## How It Works

```
user/                →  You define what to research
    ↓
agent/               →  AI maintains knowledge & memory
    ↓
website/src/         →  AI updates the Astro source files
    ↓
docs/                →  Astro builds your website (served by GitHub Pages)
```

A [GitHub Agentic Workflow](https://github.com/github/gh-aw) runs on a 12-hour cron schedule. Each run, the agent:

1. Reads your instructions from `user/`
2. Researches topics using web search (Tavily)
3. Updates its knowledge base in `agent/`
4. Updates the Astro source files in `website/src/`
5. Builds the site (`cd website && npx astro build`) into `docs/`
6. Creates a pull request with the changes (auto-merged via `auto-merge.yml`)

The website is served via GitHub Pages directly from the `docs/` folder.

## Examples

Sites powered by AgentPages:

| Site | Repo | Topic |
|------|------|-------|
| [idorozin.me/agentpages-site](https://idorozin.me/agentpages-site/) | [github.com/idorozin/agentpages-site](https://github.com/idorozin/agentpages-site) | AgentPages project documentation — maintained by an AgentPages agent |
| [idorozin.me/iran-monitor](https://idorozin.me/iran-monitor) | [github.com/idorozin/iran-monitor](https://github.com/idorozin/iran-monitor) | Live conflict tracker — US (Epic Fury) & Israel (Roaring Lion) vs Iran (True Promise IV), ongoing since Feb 28, 2026 |

## Quick Start

### 1. Fork this repository

Click the **Fork** button to create your own copy.

### 2. Install the gh-aw CLI

```bash
gh extension install github/gh-aw
```

### 3. Set up secrets

```bash
# Required: Tavily API key for web search
gh aw secrets set TAVILY_API_KEY --value "tvly-..."

# Required: API key for your chosen AI model (default is Claude)
gh aw secrets set ANTHROPIC_API_KEY --value "sk-ant-..."
```

Get your keys:
- Anthropic: https://console.anthropic.com/
- Tavily: https://tavily.com/ (free tier: 1,000 searches/month)

### 4. Choose your AI model

Open `.github/workflows/research.md` and edit the `engine` block at the top of the file:

```yaml
engine:
  id: claude          # claude | codex | gemini
  model: claude-sonnet-4-6
```

All available models and their required secrets: https://github.github.com/gh-aw/reference/engines/

After changing, recompile: `gh aw compile .github/workflows/research.md`

### 5. Define your research topics

Edit `user/profile.md` with your interests:

```markdown
## What to Research
I'm interested in the latest developments in quantum computing,
particularly error correction, hardware advances, and real-world applications.

## Focus Areas
- Quantum error correction breakthroughs
- Superconducting vs trapped-ion approaches
- Enterprise quantum computing use cases
```

Optionally customize `user/website.md` for site title and style preferences.

### 6. Configure GitHub Pages

Edit `website/astro.config.mjs` and set your repo details:

```js
site: 'https://YOUR_USERNAME.github.io',
base: '/YOUR_REPO_NAME',
```

### 7. Compile and push

```bash
gh aw compile .github/workflows/research.md
git add .
git commit -m "Configure my AgentPages instance"
git push
```

### 8. Enable GitHub Pages

Go to your repo **Settings** → **Pages** → Source: **Deploy from a branch** → Branch: `main`, Folder: `/docs` → **Save**.

### 9. Allow Actions to create pull requests

Go to your repo **Settings** → **Actions** → **General** → scroll to "Workflow permissions" → enable **"Allow GitHub Actions to create and approve pull requests"** → **Save**.

This is required for the agent to open PRs (which are then auto-merged by `auto-merge.yml`).

### 10. Run the agent

Wait for the 12-hour cron, or trigger manually:

```bash
gh aw run research
```

The agent will create a PR with its first batch of research and website updates. Agent PRs are automatically merged via the `auto-merge.yml` workflow.

## Project Structure

```
AgentPages/
├── user/                        # YOUR files (the only folder you edit)
│   ├── profile.md               # Research focus, personality, goals
│   ├── website.md               # Site title, style preferences
│   ├── feedback.md              # Give the agent feedback on its work
│   └── requests/                # Specific research requests
│       └── _template.md         # Template for new requests
├── agent/                       # AGENT's files (managed automatically)
│   ├── knowledge/               # Research findings (one file per topic)
│   └── memory/                  # Action log, plan, state
├── website/                     # Astro source (agent edits these)
│   ├── src/
│   │   ├── layouts/Base.astro   # Shared page layout & CSS
│   │   ├── pages/               # Homepage and topic pages
│   │   └── data/site.json       # Site title, tagline, topic list
│   └── public/                  # Static assets (favicon, etc.)
├── docs/                        # Built website (auto-generated, served by GitHub Pages)
└── .github/workflows/
    ├── research.md              # The agentic workflow definition
    └── auto-merge.yml           # Auto-merges agent PRs
```

**Separation of concerns:** You only touch `user/`. The agent writes to `agent/`, `website/src/`, and `docs/`.

## Giving Feedback

After the agent publishes research, you can guide it:

- **Edit `user/feedback.md`** — tell the agent what you liked, what to change, or what to focus on
- **Create requests in `user/requests/`** — ask the agent to research specific topics
- **Edit `user/profile.md`** — shift your research focus areas

The agent reads all user files at the start of each run and adjusts its behavior accordingly.

## License

MIT
