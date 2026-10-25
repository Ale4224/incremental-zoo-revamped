# Incremental Zoo — revamped

An idle game by Eduardo Abel Gimenez (magicaweb.com), with bug fixes by Robert Munafo (mrob.com),
rebuilt as a small Vite project with a new interface. The game rules, numbers and save format are
unchanged from the original.

## Run

```sh
npm install
npm run dev      # http://localhost:8080
npm run build    # static site in dist/ (works from any sub-folder)
npm run preview  # serve the build
```

The dev server uses port 8080 on purpose: saves live in the browser's localStorage per address, so
saves from the earlier local copy at `localhost:8080` load automatically. Saves exported from the
original site can be pasted into **⋯ → Import save**.

## Project layout

```
index.html            entry page
public/               images, favicon, original changelog (log.txt)
src/main.js           boots the game and the UI
src/style.css         all styles
src/game/             rules only, no DOM
  species.js          species catalogue, base stats, photo credits
  game.js             state, actions (buy, sell, upgrades, loans, offers, new zoo) and the 1s tick
  badges.js           achievement definitions
  format.js           number and time formatting
src/ui/               interface
  app.js              layout, header, tabs, event wiring
  animals.js          animal cards and species detail popup
  achievements.js     achievements tab
  panels.js           bank, visitors, research, activity feed
  offer.js            trade offer popup
  dialogs.js          help, stats, export/import, new zoo, hard reset, credits, fines
  overlay.js          toasts and modal dialogs (replace alert/confirm)
original/             the untouched downloaded game, for reference
```

## What changed

- No more `alert()`/`confirm()`: errors appear as toasts; confirmations and information are modals.
- A sticky header shows cash, debt, visitor income, animals and species.
- One quantity picker (×1 to ×10K, keys 1–5) replaces the five buy and five sell links on each card.
- Buttons that can't be used are dimmed, and hovering shows the reason (not enough money, habitat full, requirement not met).
- Animal cards show population bars, birth and death chance, unlock requirements with progress, and upgrade previews (for example, "32.5% → 34.9%").
- Clicking a photo opens a live detail popup with stats, formulas and the quote.
- Trade offers appear as a floating card; new species and achievements show as toasts.
- Achievements are checked every second, and the tab also shows locked ones grouped by species.
- Starting a new zoo shows a checklist of requirements and the birth-rate bonus you'll get.
- The activity feed is kept between sessions; Export can copy the code or download it as a file.
- The game also saves when the tab is hidden or closed.
- The layout adapts to tablets and phones.
