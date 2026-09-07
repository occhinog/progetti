# Strategia completa Fantacalcio 2026/27

> Documento condivisibile e autosufficiente. Riunisce regole della lega, logica strategica, divisione completa in Tier e consuntivo dell'asta del 6 settembre 2026. Non richiede software o script.

## 1. Contesto e obiettivo

La strategia è costruita per una lega **Serie A Classic a 8 partecipanti**, con **500 FM** a testa e questa rosa:

| Reparto | Slot |
|---|---:|
| Pacchetti portieri | 2 |
| Difensori | 8 |
| Centrocampisti | 8 |
| Attaccanti | 6 |
| **Totale** | **24** |

Ogni pacchetto portieri comprende i tre portieri eleggibili della stessa squadra di Serie A e vale come un singolo slot d'asta.

Formazioni prioritarie: **4-3-3** e **4-4-2**. Il **3-4-3** e il **3-5-2** sono soluzioni secondarie o d'emergenza.

L'obiettivo non è comprare il maggior numero possibile di nomi famosi, ma costruire:

1. una base difensiva capace di attivare con continuità il modificatore;
2. almeno un centrocampista da bonus e tre compagni realmente schierabili;
3. un attacco con un riferimento principale e minuti affidabili negli altri slot;
4. una rosa completa senza rimanere bloccati dal budget nel finale.

## 2. Regole di punteggio che guidano la strategia

### Modificatore difesa

Il modificatore premia la media del portiere e dei tre migliori difensori schierati in una formazione con almeno quattro difensori.

| Media difensiva | Bonus |
|---:|---:|
| 6,00–6,24 | +1 |
| 6,25–6,49 | +2 |
| 6,50–6,74 | +3 |
| 6,75–6,99 | +4 |
| ≥ 7,00 | +6 |

Altri bonus della lega:

- clean sheet: **+1**;
- capitano con voto superiore a 7,00: **+1**;
- Player of the Match: **+1**.

Conseguenza pratica: tre centrali da buon voto hanno più valore strategico di una collezione di esterni discontinui. Gli esterni da bonus sono complementari, non la base del modificatore.

## 3. Budget e vincoli

| Reparto | Intervallo obiettivo | Valore centrale usato |
|---|---:|---:|
| Due pacchetti portieri | 40–45 FM | 45 FM |
| 8 difensori | 115–125 FM | 120 FM |
| 8 centrocampisti | 130–140 FM | 135 FM |
| 6 attaccanti | 195–205 FM | 200 FM |
| **Totale** | **500 FM** | **500 FM** |

Questi importi sono **envelope di pianificazione**, non muri rigidi. È possibile spostare FM tra i reparti quando il mercato crea un'occasione o quando il prezzo di un obiettivo principale sale, ma due vincoli non si violano mai:

1. budget complessivo massimo di 500 FM;
2. almeno 1 FM disponibile per ogni slot ancora vuoto.

Formula del **rilancio massimo sicuro**:

```text
budget residuo - (slot ancora vuoti dopo questo acquisto × 1 FM)
```

Esempio iniziale: con 500 FM e 24 slot da riempire, l'offerta massima sicura sul primo acquisto è **477 FM**, perché devono restare almeno 23 FM per gli altri 23 slot.

### Regole trasversali di portafoglio

- Preferire al massimo **due slot della stessa squadra di Serie A**.
- Il terzo giocatore dello stesso club è consentito soltanto come override consapevole.
- Evitare di abbinare un pacchetto portieri a un difensore dello stesso club: un'unica partita negativa colpisce due componenti della rosa.
- I posti di riserva premiano prima i **minuti attesi**, poi l'upside.
- Non cambiare valutazione per un singolo gol, assist o insufficienza durante l'asta. Reagire solo a informazioni strutturali: ruolo effettivo, rigori/piazzati, titolarità, infortunio o sostituzione anomala.

## 4. Come leggere i Tier

I Tier rappresentano la **funzione del giocatore nella costruzione della rosa**, non una classifica assoluta valida in ogni lega.

- L'ordine dei giocatori all'interno dello stesso Tier indica la preferenza d'asta alla data del board.
- Non si confrontano punteggi o posizioni tra Tier diversi: prima si decide quale slot serve, poi si sceglie dentro il relativo Tier.
- Il board combina ruolo, Quotazione Attuale, FVM, minuti, media voto, forza della squadra, profondità della rosa ed eventuale impegno europeo.
- I dati delle prime giornate sono segnali, non proiezioni definitive.
- `EXTRA` è una watchlist di giocatori con molti minuti ma media voto iniziale inferiore a 6: non sostituisce automaticamente il core.
- I nomi e le valutazioni sono una fotografia **t=0 del 6 settembre 2026**: prima di riusare il board vanno ricontrollati infortuni, mercato, gerarchie e rigoristi.

### Bacino d'emergenza fuori dai Tier principali

Il listone ufficiale comprende anche **277 giocatori di movimento** lasciati fuori dal core: 120 difensori, 121 centrocampisti e 36 attaccanti. Non sono un Tier equivalente a T1–T6, ma un bacino **fallback/avoid** da consultare soltanto quando:

- i Tier previsti per lo slot sono esauriti;
- serve un titolare a 1 FM per completare la rosa;
- una notizia successiva al board cambia strutturalmente titolarità o ruolo;
- occorre sostituire un obiettivo diventato indisponibile.

Nel bacino d'emergenza si applicano, in quest'ordine, quattro filtri: titolarità attuale, minuti 2025/26, minuti iniziali 2026/27 e contesto della squadra. Un nome famoso senza minuti non supera un titolare meno attraente. Nove giocatori erano stati esclusi manualmente anche da questo bacino e restano fuori per scelta deliberata. I portieri non rientrano nel conteggio perché sono valutati per pacchetto-club.

## 5. Strategia portieri

### Principio guida

La qualità difensiva e la sicurezza del titolare vengono prima della griglia casa/trasferta. Un punteggio griglia basso è migliore e **0 indica alternanza perfetta**, ma la griglia è soltanto uno spareggio tra due difese già affidabili: non crea clean sheet.

La coppia deve idealmente restare fra **40 e 45 FM**, con **50 FM di cap assoluto**.

### Gerarchia dei pacchetti

| Classe | Pacchetto | Storico gol subiti 2025/26–2024/25 | Regola |
|---|---|---:|---|
| Primario | Roma | 31 / 35 | Migliore prima chiamata se il prezzo resta razionale |
| Elite | Napoli | 36 / 27 | Migliore solidità difensiva biennale |
| Elite, mercato difficile | Inter | 35 / 35 | Coppia perfetta con Milan, ma rischio prezzo elevato |
| Preferito | Juventus | 34 / 35 | Solida; non pagare un premio per la griglia con Torino |
| Preferito | Atalanta | 36 / 37 | Difesa costante, griglia meno favorevole |
| Elite, mercato difficile | Milan | 35 / 43 | Valida soprattutto se resta percorribile la coppia con Inter |
| Upside | Como | 29 / 52 | Grande miglioramento nel 2025/26, da validare |
| Condizionale | Lazio | 40 / 49 | Asset di griglia, non ancora asset difensivo |

Filtro usato per le coppie: media dei gol subiti nelle due stagioni non superiore a **42** per entrambe le squadre.

### Carta decisionale Roma

Se si compra Roma:

| Secondo pacchetto | Punteggio griglia | Target coppia | Cap coppia | Decisione |
|---|---:|---:|---:|---|
| Lazio | 0, perfetto | 40–45 FM | 50 FM | Solo se la qualità difensiva della Lazio migliora materialmente |
| Napoli | 3, eccellente | 38–44 FM | 47 FM | Alternativa difensivamente più robusta |
| Juventus | 6, buona | 43–48 FM | 49 FM | Alternativa solida |

Target indicativo del solo pacchetto Roma: **30–34 FM**. Non comprare Lazio per prima solo per inseguire la griglia perfetta.

## 6. Strategia difensori

### Costruzione degli 8 slot

| Blocco | Quantità | Funzione |
|---|---:|---|
| Core centrali | 3 | Base del modificatore: voto medio, titolarità e solidità |
| Quarto titolare | 1 | Centrale o esterno scelto in base alla partita |
| Riserve affidabili | 4 | Minuti regolari; obiettivo MV almeno 6,00 |

Con quattro difensori: schierare i tre migliori centrali più un quarto profilo scelto per partita. Con tre difensori: usare i tre centrali di riferimento. Evitare più di un esterno dal voto base fragile nello stesso undici, salvo matchup chiaramente favorevole ai bonus.

### Tier difensori — 67 giocatori

#### T1 — Ancore da modificatore (3–4 titolari)

Bremer, Rrahmani, Mancini, Pavlovic, Kalulu, Bastoni, Gila, Molina N., Di Lorenzo.

#### Leva di mercato — da chiamare, evitando di vincerlo

**Dimarco**: chiamata a 25 FM, rilanci solo fino a quando il prezzo raggiunge 35 FM. Attenzione: una chiamata non rilanciata può comunque trasformarsi in acquisto.

#### T2 — Upside premium / massimo un acquisto

Wesley, Couto, Tavares N., Solet, Chalobah T., Scalvini.

#### T3 — Centrali titolari preferiti / completare 3–4 centrali

Bisseck, Ramon, Hermoso, Theate, Diego Carlos, De Winter, Buongiorno, Doekhi, Koulierakis, Hien, Lucumì, Akanji.

#### T4 — Esterni di valore / soltanto come secondo esterno

Spinazzola, Miranda J., Valeri, Valle, Dodò, Vojvoda, Zappacosta, Zortea, Cambiaso, Bellanova, N'Dicka.

#### T5 — Rotazione affidabile / slot 5–6

Stones, Bartesaghi, Delprato, Celik, Tiago Gabriel, Comuzzo, Ismajli, Kamara H., Bracaglia, Pedraza, Holm, Mangas.

#### T6 — Fine asta affidabile / slot 7–8

Monterisi, Fortini, Leysen F., Kolasinac, Doig, Haps, Calvani, Oyono A., Correia T., Rodriguez Ju., Floriani Mussolini, Helland, Provstgaard.

#### EXTRA — Minuti alti, media voto iniziale sotto 6

Ostigard, Vasquez, Marcandalli.

## 7. Strategia centrocampisti

### Costruzione degli 8 slot

| Blocco | Quantità | Funzione |
|---|---:|---|
| Premium da bonus | 1 | Differenziale, potenziale da capitano e doppia cifra credibile |
| Titolari offensivi | 2 | Profili da gol/assist per 4-3-3 e 4-4-2 |
| Quarto titolare | 1 | Necessario nel 4-4-2 e prima alternativa offensiva |
| Riserve affidabili | 4 | Titolarità e media voto prima della speculazione |

La fascia **70–100 FM** è riservata esclusivamente a un centrocampista con una proiezione credibile da **10–15 gol** e minuti verificati. Target 70 FM; 100 FM è una scelta all-in, non il prezzo normale. Per tutti gli altri centrocampisti, cap ordinario fra **25 e 40 FM**.

### Tier centrocampisti — 65 giocatori

#### T1 — Candidati da almeno 10 gol / target 70 FM, cap 100 FM

Paz N., Calhanoglu, McTominay, Orsolini, Pulisic, Atta.

**Gate Pulisic:** verificare esplicitamente condizione fisica e minuti prima di trattarlo come super-premium.

#### T2 — Produzione premium / cap 25–40 FM

Rabiot, De Bruyne, Baturina, Mora, Frattesi, Zaccagni, Zaniolo, Vlasic, McKennie, Conceicao, Ekkelenkamp, Taylor K., Goncalves P., Mastantuono, Gonzalez N., Samardzic.

#### T3 — Valore sostenuto dal contesto squadra / cap 25 FM

Da Cunha, Kessiè, Ederson D.S., Zielinski, Modric, Moreira, Diouf, Konè M., Zambo Anguissa, Gudmundsson A., Rowe, Politano, Vergara, Perrone, Bernabè, Barella.

#### T4 — Quarto titolare / upside

Saelemaekers, Cristante, Thorstvedt, Bernardeschi, Volpato, Milla, Calò, Cambiaghi, Baldanzi.

#### T5 — Voto affidabile / slot 5–8

Locatelli, Karlstrom, Romano, Pisilli, Rovella, Zalewski, Sucic P., Lobotka, Ferguson, Isaksen, Chukwueze, Matic, Caqueret, Frendrup, Colpani, Odgaard, Oristanio.

Frendrup, Colpani, Odgaard e Oristanio restano eccezioni di preferenza: sono ammessi nel Tier anche se il segnale iniziale di media voto non supera pienamente il filtro standard.

#### EXTRA — Minuti alti, media voto iniziale sotto 6

Ellertsson.

## 8. Strategia attaccanti

### Costruzione dei 6 slot

**Piano A:** comprare un solo attaccante alpha e costruire attorno a lui un tridente equilibrato.

**Piano B:** se il mercato rende irraggiungibili tutti gli alpha, comprare due attaccanti elite da 70–90 FM ciascuno; il terzo titolare e la panchina devono quindi restare economici.

| Blocco | Quantità | Regola |
|---|---:|---|
| Alpha Piano A | 1 | Bomber principale; target 85–115 FM |
| Coppia elite Piano B | 2 | Solo se il Piano A fallisce; 70–90 FM ciascuno |
| Terzo titolare | 1 | Sensibile al prezzo; riferimento 25–45 FM |
| Riserve | 3 | Minuti prima, upside poi |

### Tier attaccanti — 49 giocatori

#### T1 — Alpha Piano A / comprarne uno

Malen, Martinez L., Hojlund, Ramos G.

#### T2 — Coppia elite Piano B / comprarne due solo se manca l'alpha

Douvikas, Kean, Kolo Muani, Woltemade, Scamacca, Davis K., Berardi, Esposito F.P., Yildiz, Dybala, Krstovic, De Ketelaere, Thuram, Raspadori, Santos A.

#### T3 — Valore per il tridente titolare / sensibili al prezzo

Laurientè, Simeone, Castro S., Pinamonti, Colombo, Dovbyk, Beto, Diao, Soulè, Pellegrino M., Esposito Se., Varela G., Romero D., Tourè E., Kevin Carlos.

#### T4 — Rotazione affidabile / slot 4–6

Adams C., Raimondo, Yeboah J., Boga, Kvernadze, Cutrone, Osmajic, Lontani, Bonny, Adams A., Bowie, Piccoli, Geubbels, Stulic.

#### EXTRA — Minuti alti, media voto iniziale sotto 6

Vitinha O.

## 9. Revisioni manuali bloccate

Queste correzioni sono state deliberate e prevalgono su ogni riordinamento automatico basato sui dati:

| Ruolo | Giocatore | Da | A | Lettura strategica |
|---|---|---:|---:|---|
| D | Akanji | T1 | T3 | Nome e contesto non bastano per classificarlo come ancora |
| D | Solet | T1 | T2 | Upside premium, non base del modificatore |
| D | Molina N. | T2 | T1 | Promosso tra i titolari prioritari |
| D | Di Lorenzo | T2 | T1 | Affidabilità e funzione da modificatore |
| D | N'Dicka | T3 | T4 | Ridotta priorità relativa |
| D | Chalobah T. | T3 | T2 | Upside e contesto premiati |
| D | Scalvini | T3 | T2 | Upside e contesto premiati |
| C | Barella | T2 | T3 | Valore alto, ma produzione fantasy meno da T2 |
| C | Atta | T2 | T1 | Scommessa esplicita da potenziale doppia cifra |
| A | Thuram | T1 | T2 | Non trattato come alpha unico |
| A | Raspadori | T3 | T2 | Promozione per upside e contesto |
| A | Santos A. | T3 | T2 | Promozione per upside e contesto |

## 10. Manuale d'asta senza software

Per usare la strategia con carta, foglio di calcolo o note del telefono:

1. Prima dell'asta, creare 24 righe: 2 P, 8 D, 8 C e 6 A.
2. Accanto a ogni reparto, scrivere budget target, spesa e slot residui.
3. Dopo ogni acquisto, aggiornare subito budget totale, spesa di reparto e slot vuoti.
4. Prima di ogni rilancio, calcolare il massimo sicuro lasciando 1 FM per ciascun posto successivo.
5. Cercare il **profilo necessario**, non il nome più alto rimasto: centrale da modificatore, quarto titolare, riserva di minuti, alpha, ecc.
6. Se si supera il budget di un reparto, indicare immediatamente da quale altro reparto arrivano i FM.
7. Contare i giocatori per club; al terzo slot, fermarsi e motivare l'override.
8. Controllare l'incrocio pacchetto portieri–difensore dello stesso club.
9. Tenere almeno due alternative dello stesso Tier per ogni obiettivo: non rilanciare contro il proprio piano.
10. In chiusura, privilegiare titolari da 1 FM rispetto a scommesse senza minuti.

### Decisione rapida su un giocatore chiamato

```text
1. Quale slot della rosa riempie?
2. Qual è il suo Tier e la sua funzione?
3. Esiste un'alternativa nello stesso Tier?
4. Il prezzo resta dentro il cap del profilo?
5. Il rilancio lascia il budget minimo per completare la rosa?
6. Crea concentrazione di club o sovrapposizione portiere-difensore?
```

Se una risposta è negativa, si lascia il giocatore salvo override esplicito e finanziato.

## 11. Applicazione reale: rosa finale di Gabriel

L'asta è terminata con **24/24 slot**, **489 FM spesi** e **11 FM residui**.

| Reparto | Spesa | Piano centrale | Scostamento |
|---|---:|---:|---:|
| Portieri | 43 FM | 45 FM | -2 FM |
| Difensori | 94 FM | 120 FM | -26 FM |
| Centrocampisti | 123 FM | 135 FM | -12 FM |
| Attaccanti | 229 FM | 200 FM | +29 FM |
| **Totale** | **489 FM** | **500 FM** | **11 FM residui** |

### Rosa e prezzi

| Ruolo | Acquisti |
|---|---|
| P | Atalanta 37; Bologna 6 |
| D | Rrahmani 21; Bisseck 21; Hermoso 9; Dragusin 5; Chalobah T. 20; Scalvini 10; Lucumì 7; Delprato 1 |
| C | Pulisic 69; Atta 25; Gonzalez N. 14; Gudmundsson A. 11; Milla 1; Bernabè 1; Frendrup 1; Locatelli 1 |
| A | Hojlund 165; Colombo 14; Simeone 46; Kevin Carlos 1; Maldini 2; Tourè E. 1 |

### Cosa è stato applicato correttamente

- Pacchetti portieri chiusi a 43 FM, dentro il target; Atalanta–Bologna ha griglia **6**, buona ma non perfetta.
- Difesa costruita attorno a centrali e profili da modificatore: Rrahmani T1, Bisseck/Hermoso/Lucumì T3, più Chalobah e Scalvini T2.
- Centrocampo con un premium a 69 FM, vicino al target da 70, due profili offensivi aggiuntivi e quattro chiusure economiche.
- Piano A in attacco realizzato con Hojlund alpha, sostenuto da Simeone e Colombo come titolari di valore e tre riserve a costo minimo.
- Completamento sempre protetto: nessuno slot lasciato vuoto e 11 FM non spesi.

### Override e rischi emersi

- Hojlund è costato **165 FM**, molto oltre il range alpha di 85–115 FM. L'override è stato finanziato risparmiando 38 FM fra difesa e centrocampo rispetto ai valori centrali.
- L'attacco ha assorbito 229 FM: rosa più dipendente dalla salute e dal rendimento dell'alpha.
- Juventus e Parma hanno tre slot ciascuna, oltre la preferenza di due: la concentrazione è consapevole ma aumenta la correlazione.
- Il pacchetto Atalanta è abbinato a Scalvini, violando la separazione consigliata portiere–difensore; aumenta l'esposizione a una stessa partita negativa.
- Dragusin e Maldini provengono dal bacino fallback/avoid, non dal core principale: acquisti economici di completamento, non obiettivi iniziali.
- Sono stati acquistati due centrocampisti T1, Pulisic e Atta, mentre la costruzione base prevedeva un solo premium: Atta a 25 FM è stato trattato come opportunità, non come seconda asta da 70–100 FM.

## 12. Lezioni da trasferire a un'altra asta

1. **Condividere il metodo, non copiare i prezzi.** I prezzi dipendono da numero di partecipanti, budget, ordine di chiamata e aggressività del tavolo.
2. **Ricalibrare i cap durante l'asta.** Se tutti gli alpha superano nettamente il range previsto, scegliere esplicitamente tra override del Piano A e passaggio al Piano B; non inseguire per inerzia.
3. **Registrare il prezzo di mercato dei primi 2–3 giocatori per ruolo.** Serve a capire rapidamente l'inflazione reale del tavolo.
4. **Separare strategia e dati correnti.** La struttura per slot resta valida; Tier, titolarità, infortuni e rigoristi vanno aggiornati prima di ogni nuova asta.
5. **Fare un consuntivo degli override.** Ogni violazione di cap o concentrazione deve avere una fonte di finanziamento e un rischio dichiarato.

## 13. Fonti e legenda

- Fonte ruoli, quotazioni e FVM: [Fantacalcio.it — Quotazioni Fantacalcio](https://www.fantacalcio.it/quotazioni-fantacalcio).
- Board basato sui file ufficiali 2026/27 e sulle statistiche 2025/26–2026/27 disponibili al 6 settembre 2026.
- **PV**: presenze con voto.
- **MV**: media voto base.
- **QA**: quotazione attuale.
- **FVM**: Fantavalore di mercato.
- **D-CTX / C-CTX / A-CTX**: indicatore di contesto squadra specifico per reparto; considera forza, ambiente offensivo/difensivo, profondità e carico europeo.

**Decisione finale:** la parte riutilizzabile è l'architettura — budget dinamico, funzioni degli slot, Tier e disciplina sui minuti. I nomi sono una fotografia stagionale e devono essere revisionati prima di essere usati in un'altra asta.
