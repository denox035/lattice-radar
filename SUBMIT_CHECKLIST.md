# SUBMIT CHECKLIST — LATTICE (token-radar-01)

Entry: **LATTICE — Token Launch Radar**. Model `lattice-1`: 226 rows (40 watchlist +
186 early), calibrated peer multiples, 6-step farm plans. Built in Muse session
`5487a7b0-2843-4026-b358-82df18fb0cc3` (started 2026-11-15T17:22:00Z, after the
competition opened 2026-11-14T10:00:00Z). Verified: 17/17 local gate checks pass,
two runs byte-identical. Deadline: **2026-12-14T10:00:00Z (17:00 WIB)**.
Quota: 5/day, 10 total per account; the last submission before the deadline is final.

## 1. GitHub repo (user / parent)
- [ ] Create a PUBLIC repo `denox035/lattice-radar` (any new repo now qualifies:
      it must be created after the competition opened, 2026-11-14T10:00:00Z).
- [ ] Push this directory's committed files (branch `main`): `main.ts`, `lib/`,
      `vendor/`, `dashboard/`, `screenshots/`, `LICENSE`, `README.md`,
      `.makefun/owner.json`. Do NOT push `token-radar-01-kit/`, `kit.tar.gz`,
      `out1/`, `out2/`, `shot.mjs` (covered by `.gitignore`).
- [ ] Repo About: description `LATTICE — a token launch radar: 226 pre-token
      protocols ranked by calibrated implied value, with farm plans. Built by an
      AI agent for make.fun's "Build the best token launch radar" bounty, $1,325
      in USDC.` — homepage `https://make.fun/bounty/token-radar-01` — topics
      `makefun, ai-agents, bounties, trading`.
      (`gh repo edit denox035/lattice-radar --description '...' --homepage
      'https://make.fun/bounty/token-radar-01' --add-topic 'makefun,ai-agents,bounties,trading'`)
- [ ] Replace `YOUR_REFERRAL_CODE` in README.md with @jurig-1's own referral
      code (`makefun referrals` once logged in), commit, push.

## 2. make.fun account @jurig-1 (parent — connection in progress)
- [ ] Finish `makefun login` with keypair `~/workspace/make-fun/makefun-keypair.json`
      (user approves the link); API key lands in `~/.makefun/credentials`.
- [ ] Link the Solana wallet `8WqZKTAnnU7u911PYuHNRwW5vvNpq3XkN3zfUtPNxrAK` to
      the account (account_wallet check): `node <kit>/cli/makefun.mjs wallet add
      --keypair ~/workspace/make-fun/makefun-keypair.json` — or link it on the
      profile page. `.makefun/owner.json` in the repo already names this wallet.
- [ ] Entry signature at submit time: the same keypair signs `make.fun entry v1`
      (the submit CLI does this; the message is only valid 10 minutes, so sign
      and submit in one go).

## 3. Transcripts bundle (PARENT runs this, AFTER this builder session finishes)
Usage rows for a subagent are written only once its run completes, so the
parent (top-level agent `92f82a9b-ce2b-46c4-9fef-7a3295738932`) runs the bundle,
not the builder. From the kit dir `~/workspace/make-fun/radar/token-radar-01-kit`:
- [ ] Usage file — parent runs with its `muse.db` tool (one JSON object per line):
      `SELECT u.agent_id AS agent_id, u.message_id AS message_id, u.created_at AS
      created_at, u.input_tokens AS input_tokens, u.output_tokens AS output_tokens,
      a.model AS model FROM agent.agent_message_token_usage u JOIN agent.agents a
      ON a.agent_id = u.agent_id WHERE u.agent_id IN
      ('92f82a9b-ce2b-46c4-9fef-7a3295738932','5487a7b0-2843-4026-b358-82df18fb0cc3')
      ORDER BY u.created_at DESC LIMIT 500` → save as
      `~/workspace/make-fun/radar/muse-usage.jsonl`. Re-query if bundle reports
      0 rows (rows land when messages are delivered).
- [ ] Prompt file — the user's exact opening words, word for word, in a file
      OUTSIDE the repo (e.g. `~/workspace/make-fun/radar/prompt.txt`): the user
      message that started this chain ("Read make.fun/skill.md… and list the open
      bounties… pick the one you can build best, and enter it. Use my make.fun
      account @jurig-1…"). Pass with `--prompt-file <file> --prompt-origin
      handed-off --prompt-via "parent agent spawned the radar builder subagent"`.
      (The builder session itself opens with a subagent brief, not the user's words,
      so bundle cannot auto-fill the prompt.)
- [ ] Bundle command:
      `node cli/makefun.mjs bundle --repo ~/workspace/make-fun/radar --session
      ~/agents/agent-5487a7b0-2843-4026-b358-82df18fb0cc3/sessions/5487a7b0-2843-4026-b358-82df18fb0cc3.jsonl
      --no-discover --out ~/workspace/make-fun/radar/transcripts.tar.gz
      --harness muse-app --harness-version 1.3 --provider ipnext
      --model ipnext/avocado-5.17-v2 --effort default --mcp none
      --muse-usage ~/workspace/make-fun/radar/muse-usage.jsonl
      --prompt-file ~/workspace/make-fun/radar/prompt.txt --prompt-origin handed-off
      --prompt-via "parent agent spawned the radar builder subagent"`
      Dry-run first (`--dry-run`): it must list the session as RECORDED
      (muse-app, not handed over) and report usage rows attached. Fix every
      warning it lists before the real bundle.
- [ ] Redaction: bundle already strips e-mails, home paths, usernames and
      credentials. The user's name/handle (@jurig-1, denox035) IS needed for
      the entry (repo owner, wallet) — do NOT redact it. Do not redact code,
      commands, tool output or reasoning.

## 4. Pre-submit check (parent)
- [ ] `node cli/makefun.mjs check --kit ~/workspace/make-fun/radar/token-radar-01-kit
      --repo ~/workspace/make-fun/radar --transcripts ~/workspace/make-fun/radar/transcripts.tar.gz`
      Must pass. (Local gate replica already passed 17/17; see `out1/`.)

## 5. Submit (parent, one command, keypair signs the entry message)
- [ ] `node cli/makefun.mjs submit --competition token-radar-01 --repo-url
      https://github.com/denox035/lattice-radar --commit <full 40-char sha>
      --title "LATTICE — Token Launch Radar" --bundle
      ~/workspace/make-fun/radar/transcripts.tar.gz --keypair
      ~/workspace/make-fun/makefun-keypair.json`
- [ ] Keep the receipt. The entry is judged in development against the four
      house dashboards; the provisional rate shows on the leaderboard.
- [ ] Do NOT submit more than needed: 5/day, 10 total, 20 hard cap. A fix
      re-submits the same repo at a new commit; the last one before the
      deadline is final.

## Known facts
- Starter is house dashboard #2: this entry shares no code with it (own model,
  own dashboard, own farm plans). `vendor/makefun-board.ts` is the kit's own
  library, copied unchanged as the kit instructs.
- `thinking_fresh` is source-bundle-only; this is a repo-path entry, so no
  `makefun init` anchor is needed.
- Screenshots: `1-board.jpg` (board), `2-detail.jpg` (Steakhouse Financial
  detail), `3-filtered.jpg` (Lending filter), all 1280×800 JPEG.
- Dossier: 503,355 bytes (cap 1.5 MiB); dashboard source 22,049 bytes (judge
  reads all of it — under the 65,536-byte text cap).
