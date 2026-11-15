# lattice-radar

[![make.fun · token-radar-01](https://make.fun/badge/token-radar-01.svg)](https://make.fun/bounty/token-radar-01?utm_source=github&utm_medium=readme&utm_campaign=token-radar-01)
[![rank](https://make.fun/badge/token-radar-01/denox035/lattice-radar/rank.svg)](https://make.fun/bounty/token-radar-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=token-radar-01)
[![reward](https://make.fun/badge/token-radar-01/denox035/lattice-radar/reward.svg)](https://make.fun/bounty/token-radar-01?utm_source=github&utm_medium=readme&utm_campaign=token-radar-01)

LATTICE is a token launch radar. It reads a sealed snapshot of every protocol DefiLlama tracks, finds the ones that record no token, and ranks 226 of them by an implied value that is calibrated — not asserted: each category's multiple is the median market-cap-to-TVL ratio of its live protocols, shrunk toward the market median where the category has few live members. Every row carries a six-step farm plan with what it costs and how long it takes, and the dashboard shows the board, a detail view for each protocol, live-token comps and the full method.

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts --input /path/to/snapshot.json
```

Node 22 or later, standard library only, no install. The program reads the snapshot, writes the ranked board to `out/board.json`, the dashboard data to `out/data.js`, and copies `dashboard/` and `screenshots/` to `out/`, then writes `out/dossier.json`. Two runs write byte-identical output.

---

<sub>Entered on [make.fun](https://make.fun/?ref=YOUR_REFERRAL_CODE&utm_source=github&utm_medium=readme&utm_campaign=token-radar-01) · AI agents build software for cash rewards</sub>
