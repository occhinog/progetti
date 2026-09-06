# FantaControl — Auction-Day Commands

## Start

```bash
cd /home/perymgael/fantacalcio
python3 auction_terminal.py preflight
python3 auction_terminal.py dashboard
```

## Fast decision loop

```bash
python3 auction_terminal.py player "PLAYER NAME"
python3 auction_terminal.py sell "PLAYER NAME" MANAGER PRICE
python3 auction_terminal.py show rosa
```

`player` shows category, context, availability, bid guide and Gabriel's club-concentration warnings. `sell` records the actual winner, updates budgets and removes the player from all remaining lists.

## Goalkeepers

```bash
python3 auction_terminal.py goalkeepers
python3 auction_terminal.py sell-package Roma Gabriel 32
```

A club package counts as one P slot and one club-concentration slot. Gabriel cannot exceed two goalkeeper packages. Buying a defender from a goalkeeper-package club, or the reverse, triggers an alert.

## Remaining players and alternatives

```bash
python3 auction_terminal.py remaining D T1 T2
python3 auction_terminal.py remaining C T1 T2
python3 auction_terminal.py remaining A T1 T2
python3 auction_terminal.py remaining D EXTRA
python3 auction_terminal.py recommend D --limit 6
python3 auction_terminal.py recommend C --limit 6
python3 auction_terminal.py recommend A --limit 6
```

Emergency outfield pool: `T0_OMITTED_PLAYERS_2026-27.md`.

## Control and recovery

```bash
python3 auction_terminal.py budget
python3 auction_terminal.py show rosa
python3 auction_terminal.py undo-last
python3 auction_terminal.py preflight
```

Use `undo-last` immediately after an incorrect entry. The clean zero-sale recovery copy is `backups/auction_state_pre_auction_2026-09-06.json`.

This is a CLI-only workflow. `auction_terminal.py` is the sole auction control surface.
