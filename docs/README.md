# FantaControl — 2026/27

Local live-auction control board for the eight-manager, 500-FM league described in `AUCTION_BRIEFING_2026-27.md`.

## Auction-day start

```bash
cd /home/perymgael/fantacalcio
python3 auction_terminal.py preflight
python3 auction_terminal.py dashboard
python3 auction_terminal.py watch dashboard
python3 auction_terminal.py commands
```

The terminal is the recommended auction control surface because it reads the latest state on every command.

## Current ready state

- The official Classic database is already loaded: 531 players across 20 clubs.
- Managers are configured: Gabriel, Natale, Leo, Chef, Luca, Selvi, Avvocato and Gabriele.
- The live ledger is empty and ready for the first purchase.
- The static board contains 176 core players plus five explicit durability-watchlist additions.
- The official quotation and statistics workbooks are already loaded; no import step is required.

## CLI-only operation

`auction_terminal.py` is the only auction entry point. Do not run `server.py`; it remains only because the CLI imports its Excel parsing functions. All browser-only assets have been removed.

## Rules encoded

- 500 FM per manager; 24 auction units: 2 goalkeeper club packages, 8 D, 8 C, 6 A.
- Minimum bid is 1 FM. A manager's maximum safe bid is `remaining budget − (remaining auction units − 1)`.
- For goalkeepers, select any P from the club package and record the package price. One P entry represents one three-goalkeeper package.
- Player hard caps combine official FVM, role ceiling, Gabriel's remaining quota and the safe-bid constraint. They are auction guardrails, not season projections; a deliberate role-budget override can be recorded when an exceptional opportunity warrants it.
- Prefer no more than two roster slots from one Serie A club. Player lookup and Gabriel purchases warn before adding a third.
- Avoid combining a goalkeeper package with a defender from the same club. Both purchase directions trigger an advisory warning.

## Data and backups

- The live state is stored locally in `auction_state.json`, created automatically after the first import or sale.
- The one-page auction reference is `AUCTION_DAY_COMMANDS.md`.
- The clean zero-sale recovery state is `backups/auction_state_pre_auction_2026-09-06.json`.
- The reviewed t=0 strategy board is stored separately in `t0_board.json`; the human-readable version is `T0_PLAYER_CATEGORY_BOARD_2026-27.md`.
- `auction_terminal.py` reads categories and order from `t0_board.json`. During the auction, only `auction_state.json` changes; remaining-player queries subtract sold player IDs from the static board.
- Keep periodic filesystem copies of `auction_state.json` during the auction. A clean zero-sale recovery copy is already stored under `backups/`.
- The official list export is authenticated by Fantacalcio. Do not put credentials in this repository or chat.

## Terminal playbook

Every terminal invocation reads the latest `auction_state.json`, so commands can be run safely from separate shell or tmux panes:

```bash
cd /home/perymgael/fantacalcio
python3 auction_terminal.py preflight
python3 auction_terminal.py goalkeepers
python3 auction_terminal.py grid
python3 auction_terminal.py teams
python3 auction_terminal.py defenders
python3 auction_terminal.py defenders --short
python3 auction_terminal.py midfielders
python3 auction_terminal.py midfielders --short
python3 auction_terminal.py attackers
python3 auction_terminal.py attackers --short
python3 auction_terminal.py dashboard
python3 auction_terminal.py commands
python3 auction_terminal.py rosa
python3 auction_terminal.py show rosa
python3 auction_terminal.py budget
python3 auction_terminal.py status
python3 auction_terminal.py player "Malen"
python3 auction_terminal.py recommend A --limit 6
python3 auction_terminal.py remaining D T1 T2
python3 auction_terminal.py remaining C T1 T2
python3 auction_terminal.py remaining A T1 T2
python3 auction_terminal.py sell-package Roma Gabriel 32
python3 auction_terminal.py sell "Malen" Natale 84
python3 auction_terminal.py undo-last
```

`goalkeepers` shows eight goalkeeper-package anchors. **Pair A** shows the primary grid partner; `!` marks a grid plan that fails the two-season defensive gate. Pair B/C are defensively viable alternatives. A perfect grid does not make a weak defence valuable—Roma–Lazio scores `0`, but Lazio remains conditional until its defensive outlook supports the pairing. `sell-package` changes the shared live state, marks all three eligible keepers as sold, and recalculates every manager's safe bid ceiling.

`preflight` validates all required files, the 531-player database, static categories, manager setup, role budgets, quotas, goalkeeper grid, team-context coverage and sale/status consistency. Run it before starting and after any unexpected interruption.

`grid` prints the raw 20×20 Fantacalcio pairing matrix and club-code legend, without any ranking adjustment.

`undo-last` reverses the latest recorded sale, restores all package/player availability, and recalculates the shared auction state. Use it immediately to correct a mistaken entry.

`budget` (or `status`) prints every manager's remaining FM, completion by goalkeeper package / defender / midfielder / attacker, total filled squad slots, and safe next bid. `dashboard` is the compact terminal cockpit: role envelopes, spend, open slots and next planned bids. `watch dashboard` refreshes that cockpit every two seconds; `watch budget` continuously refreshes roster completion. Both stop cleanly with `Ctrl+C`. `commands` is the full terminal command palette. `player "NAME"` gives a fast decision card with the player's category, team-context weight, current availability and relevant special rule. `recommend D|C|A` ranks the available primary-tier targets for the current role.

`rosa` or `show rosa` prints Gabriel's live roster with player/package name, role, purchase price and club, followed by club concentration counts. Goalkeeper packages count as one roster slot. `player "NAME"` and purchases for Gabriel warn when a club already has two or more roster slots, and also warn when the goalkeeper/defender separation rule is violated.

`remaining D T1 T2` prints the available players in selected static categories after subtracting live sales. Omit category filters to print every category for that role.

`sell "PLAYER" MANAGER PRICE` records any defender, midfielder or attacker sale and recalculates every manager's safe next bid. It allows a deliberate Gabriel role-envelope override while preserving the hard league budget and minimum-completion reserve. Use quotes around names containing spaces or initials.

`teams` prints the reusable team-context index. It weights player tiers by projected team strength, role environment, European burden and squad resilience; it is shared by defenders, midfielders and attackers. The source model is in `team_context_2026_27.json`.

`defenders` prints the exact eight-slot construction for the defence modifier, the static 64-player core and its explicit durability watchlist, followed by conditional fallback and avoid/1-FM tiers from the official pool. It ranks profiles for Gabriel's modifier-first strategy rather than mechanically sorting official FVM. Use `defenders --short` only when the late tiers are not needed.

`midfielders` prints the static 64-player core and its explicit durability watchlist, including four high-availability reserve slots, followed by conditional fallback tiers from the complete official pool. It supports 4-3-3 and 4-4-2 first, with 3-4-3 / 3-5-2 as secondary shapes. `C-CTX` applies the team-context model to break close calls inside each tier.

`attackers` prints the static 48-player core and its explicit durability watchlist, starting with Plan A (one alpha scorer) and Plan B (two 70–90 FM elite attackers only if Plan A is lost), then ranks the starting trident and minute-first rotation market using `A-CTX`.

Market levers are stored in the live strategy. Dimarco is currently configured as a raise-only call: open at 25 FM and stop when the price reaches 35 FM. An unanswered open-auction bid can still win him, so the board asks for deliberate confirmation before recording that outcome for Gabriel.
