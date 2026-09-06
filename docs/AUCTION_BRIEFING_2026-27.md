# Fantacalcio Auction Briefing — 2026/27

## League setup

| Item | Confirmed rule |
|---|---|
| Managers | 8 |
| Budget | 500 FM each |
| Competition | Serie A only |
| Player source | Official Fantacalcio.it 2026/27 Classic list |
| Goalkeepers | Bought by Serie A club: purchasing a club gives its goalkeeper group; two club packages per manager |
| Squad | 8 defenders, 8 midfielders, 6 attackers |
| Auction | Sunday 6 September 2026, 15:30 CEST |

## Scoring modifiers

### Defence modifier

| Defence average | Bonus |
|---:|---:|
| 6.00–6.24 | +1 |
| 6.25–6.49 | +2 |
| 6.50–6.74 | +3 |
| 6.75–6.99 | +4 |
| ≥ 7.00 | +6 |

Additional confirmed bonuses:

- Clean sheet: +1.
- Captain with score above 7.00: +1.
- Player of the Match: +1.

## Matchday-3 timing risk/opportunity

The auction overlaps two live fixtures, both starting at 15:00 CEST:

- Frosinone–Venezia
- Parma–Monza

Later fixtures:

- Bologna–Sassuolo, 18:00
- Juventus–Milan, 20:45

Fixtures already complete before the auction if it starts on time:

- Genoa–Como, Friday 4 September
- Fiorentina–Torino, Saturday 5 September
- Inter–Napoli, Saturday 5 September
- Roma–Atalanta, Saturday 5 September

Source: [Lega Serie A — matchday 3 appointments](https://en.legaseriea.it/serie-a/news/the-referees-for-the-3rd-round-x3064).

## Initial auction strategy

### Budget guardrails

| Unit | Target budget | Rule |
|---|---:|---|
| Two goalkeeper club packages | 40–45 | Buy clean-sheet exposure, but do not overpay for the fashionable first pair. |
| 8 defenders | 115–125 | Three modifier anchors, one fourth starter and four high-availability reserves. |
| 8 midfielders | 130–140 | Four usable starters for 4-4-2 plus four high-availability reserves. |
| 6 attackers | 195–205 | One alpha, two credible starters and three minute-secure reserves. |
| Endgame buffer | Embedded | Role envelopes remain flexible; total-budget completion reserve is always binding. |

### Core principles

1. The defence modifier is powerful: build a repeatable 6.50+ three-defender core rather than accumulating interchangeable defenders.
2. Captain and Player-of-the-Match bonuses favour reliable high-floor players with bonus potential. The captain should normally be a premium attacker or attacking midfielder with regular minutes.
3. Live matches are useful only for structural information: confirmed role, penalty/set-piece duty, injury, or unexpected substitution. Do not chase a goal or punish a blank after 30 minutes.
4. On the first premium purchases, retain enough budget to field two top attackers plus a captain-grade midfield/attack asset.
5. Formation priority is 4-3-3 or 4-4-2. Use 3-4-3 or 3-5-2 only as secondary solutions.
6. Slots 5–8 in defence/midfield and slots 4–6 in attack prioritize expected minutes and a basic average-vote target of 6.00 or better.
7. Prefer no more than two roster slots from one Serie A club; a prospective third player triggers a concentration alert.
8. Do not pair a goalkeeper package with a defender from the same club unless deliberately overriding the risk rule.

## Official source

- [Fantacalcio.it — official 2026/27 Classic quotations, roles and FVM](https://www.fantacalcio.it/QUOTAZIONI-FANTACALCIO)

## Auction-day readiness

- Official 2025/26 and 2026/27 quotation/statistics workbooks are loaded and match the GitHub copies checked on 6 September 2026.
- Live database: 531 players from 20 clubs.
- Static board: 176-player core plus five explicit extra watchlist players.
- Emergency pool: 277 outfield players after Gabriel's explicit exclusions; goalkeepers are handled by packages.
- Live ledger: zero sales at readiness check.

Start with:

```bash
cd /home/perymgael/fantacalcio
python3 auction_terminal.py preflight
python3 auction_terminal.py dashboard
python3 auction_terminal.py commands
```
