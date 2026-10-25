// Modal dialogs: help, stats, save transfer, new zoo, hard reset, credits, fines.
import { SPECIES, OMEGA_IX, PHOTO_CREDITS, speciesImage } from '../game/species.js';
import { commas, money, bigbucks, fmt, duration } from '../game/format.js';
import { h } from './dom.js';
import { icon } from './icons.js';
import { openModal, confirmDialog, toast } from './overlay.js';

const BASE = import.meta.env.BASE_URL;

export function openHelp({ firstTime = false } = {}) {
  const steps = [
    ['bank', 'Borrow', 'Take a small loan from the bank to get started.'],
    ['paw', 'Buy pairs', 'Buy animals, at least two of each species, so they can breed.'],
    ['clock', 'Be patient', 'Wait for them to breed. Sell some, then buy other animals.'],
    ['wallet', 'Repay', 'Pay back your debt before the cumulative interest gets too high.'],
    ['trophy', 'Earn badges', 'Achievements make every future zoo breed faster.'],
    ['refresh', 'Start over, faster', 'Open a new zoo and you will advance more quickly.'],
  ];
  const body = h('div', { class: 'help' },
    h('ol', { class: 'help-steps' }, steps.map(([ic, title, text]) => h('li', {},
      h('span', { class: 'help-icon' }, icon(ic)),
      h('div', {}, h('strong', { text: title }), h('p', { text })),
    ))),
    h('div', { class: 'help-tips' },
      h('h3', { text: 'Good to know' }),
      h('ul', {},
        h('li', { text: 'Each species unlocks after some playing time. Research shortens the wait.' }),
        h('li', { text: 'From the third species on, you need a number of the species two steps back before your first purchase.' }),
        h('li', { text: 'Full habitats stop breeding, and the Animal Bureau may fine you for overcrowding.' }),
        h('li', { text: 'The Office for Animal Exchange sends trade offers from time to time.' }),
        h('li', {}, 'Keys ', h('kbd', { text: '1' }), '–', h('kbd', { text: '5' }), ' pick how many animals to buy or sell. Click a photo for details.'),
        h('li', { text: 'The game saves itself in this browser. Use Export to back up your zoo.' }),
      ),
    ),
  );
  openModal({
    title: firstTime ? 'Welcome to Incremental Zoo' : 'How to play',
    subtitle: 'An idle game about patience, pairs and paying back the bank.',
    icon: 'paw',
    body,
    size: 'lg',
    actions: [{ label: firstTime ? "Let's open the zoo" : 'Got it', kind: 'primary', autofocus: true }],
  });
}

export function openStats(game) {
  const s = game.stats();
  const tile = (ic, label, value, note) => h('div', { class: 'stat-tile' },
    h('span', { class: 'stat-tile-icon' }, icon(ic)),
    h('span', { class: 'stat-tile-label', text: label }),
    h('strong', { class: 'stat-tile-value', text: value }),
    note && h('span', { class: 'muted small', text: note }));

  const body = h('div', { class: 'stats' },
    h('div', { class: 'stat-tiles' },
      tile('paw', 'Animals now', commas(s.total)),
      tile('sparkles', 'Animals acquired', commas(s.acquired), `${fmt(s.rate)} per second`),
      tile('coins', 'Selling value', `$${bigbucks(s.sellValue)}`),
      tile('clock', 'Time played', duration(s.time)),
      tile('check', game.zoo.resetBadges > 0 ? 'Certified species' : 'Species you care for', commas(s.species)),
      tile('trophy', 'Achievements', commas(s.badges), s.resetBadges ? `+${commas(s.resetBadges)} carried over` : null),
      tile('heart', 'Birth-rate boosts', commas(s.brBoosts)),
      tile('shield', 'Death-rate mitigations', commas(s.drBoosts)),
      tile('tag', 'Price boosts', commas(s.bsBoosts)),
      tile('expand', 'Habitat expansions', commas(s.enBoosts)),
      tile('swap', 'Offers accepted', commas(s.offers)),
      tile('gavel', 'Fines', commas(s.fines)),
    ),
    h('p', { class: 'muted small stats-foot', text: s.zooNum <= 1
      ? 'This is your first zoo.'
      : `Birth rates in this zoo are ${s.birthMultiplier.toFixed(2)}× better than in your first zoo.` }),
  );
  openModal({ title: 'Zoo statistics', icon: 'chart', body, size: 'lg', actions: [{ label: 'Close', kind: 'ghost' }] });
}

export function openExport(game) {
  game.save();
  const code = game.exportSave();
  const area = h('textarea', { class: 'code-area', readonly: true, rows: 7, spellcheck: 'false', value: code });
  const body = h('div', {},
    h('p', { class: 'muted', text: 'Copy this code somewhere safe. You can paste it into Import on any device to restore your zoo.' }),
    area,
  );
  const stamp = new Date().toISOString().slice(0, 10);
  openModal({
    title: 'Export your zoo',
    icon: 'download',
    body,
    actions: [
      {
        label: 'Download file', kind: 'ghost', icon: 'file',
        onClick: () => {
          const blob = new Blob([code], { type: 'text/plain' });
          const a = h('a', { href: URL.createObjectURL(blob), download: `incremental-zoo-${stamp}.txt` });
          a.click();
          setTimeout(() => URL.revokeObjectURL(a.href), 1000);
          return false;
        },
      },
      {
        label: 'Copy code', kind: 'primary', icon: 'copy', autofocus: true,
        onClick: async () => {
          try {
            await navigator.clipboard.writeText(code);
          } catch {
            area.select();
            document.execCommand('copy');
          }
          toast({ kind: 'success', title: 'Save code copied', message: 'Paste it into Import to restore your zoo.' });
        },
      },
    ],
  });
  requestAnimationFrame(() => area.select());
}

export function openImport(game) {
  const area = h('textarea', { class: 'code-area', rows: 7, spellcheck: 'false', placeholder: 'Paste your save code here…' });
  const error = h('p', { class: 'form-error', hidden: true });
  const file = h('input', { type: 'file', accept: '.txt,text/plain', hidden: true });
  file.addEventListener('change', async () => {
    const f = file.files?.[0];
    if (f) area.value = (await f.text()).trim();
  });
  const body = h('div', {},
    h('p', { class: 'muted', text: 'Importing replaces the zoo in this browser. Export first if you want to keep it.' }),
    area,
    error,
    h('button', { class: 'link-btn', type: 'button', onClick: () => file.click() }, icon('file'), 'Load from a file'),
    file,
  );
  openModal({
    title: 'Import a zoo',
    icon: 'upload',
    body,
    actions: [
      { label: 'Cancel', kind: 'ghost' },
      {
        label: 'Import', kind: 'primary', icon: 'upload',
        onClick: () => {
          try {
            game.importSave(area.value);
          } catch (e) {
            error.textContent = e.message;
            error.hidden = false;
            area.focus();
            return false;
          }
          toast({ kind: 'success', title: 'Zoo imported', message: 'Welcome back!' });
        },
      },
    ],
  });
  requestAnimationFrame(() => area.focus());
}

export function openNewZoo(game, onStarted) {
  const z = game.zoo;
  game.fixDebt();
  const need = game.zooNum() <= 1 ? 12 : 6;
  const species = game.censusSpecies();
  const preview = game.newZooPreview();
  const badges = z.badges.length;
  const mult = 1 + (badges * 2) / 1000;

  const check = (okay, text) => h('li', { class: okay ? 'ok' : 'todo' }, icon(okay ? 'check' : 'x'), h('span', { text }));
  const body = h('div', { class: 'newzoo' },
    h('p', { text: 'You will start again from nothing, but all animals in the new zoo will breed faster thanks to your achievements.' }),
    h('div', { class: 'newzoo-bonus' },
      h('span', { class: 'muted small', text: 'Birth-rate bonus' }),
      h('strong', { text: `${mult.toFixed(3)}×` }),
      h('span', { class: 'muted small', text: z.resetBadges > 0
        ? `From ${commas(badges)} achievements in this zoo (and ${commas(z.resetBadges)} points from previous zoos).`
        : `From the ${commas(badges)} achievements you've made running this zoo.` }),
    ),
    h('ul', { class: 'checklist' },
      check(z.debt <= 0, z.debt <= 0 ? 'Your zoo is out of debt' : `Pay off your debt (${money(z.debt)})`),
      check(species >= need, `At least ${need} species in your zoo (${species}/${need})`),
    ),
  );

  openModal({
    title: 'Start a new zoo?',
    icon: 'refresh',
    body,
    actions: [
      { label: preview.ok ? 'Keep this zoo' : 'Close', kind: 'ghost' },
      preview.ok && {
        label: 'Start new zoo', kind: 'primary', icon: 'refresh',
        onClick: () => {
          const res = game.startNewZoo();
          if (!res.ok) {
            toast({ kind: 'error', title: "Can't start a new zoo", message: res.error });
            return false;
          }
          onStarted?.();
          toast({ kind: 'success', title: 'A brand new zoo!', message: `Animals now breed ${mult.toFixed(3)}× faster.` });
        },
      },
    ].filter(Boolean),
  });
}

export async function openHardReset(game, onReset) {
  const yes = await confirmDialog({
    title: 'Erase everything?',
    icon: 'trash',
    tone: 'danger',
    message: 'This permanently deletes all your progress, achievements and saved data. You will start from scratch as if you opened the game for the first time. This cannot be undone.',
    confirmLabel: 'Erase my zoo',
  });
  if (!yes) return;
  game.hardReset();
  onReset?.();
  toast({ kind: 'info', title: 'Everything was reset', message: 'A fresh start. Borrow some money to begin.' });
}

export function openCredits() {
  const body = h('div', { class: 'credits' },
    h('p', {},
      h('strong', { text: 'Incremental Zoo' }), ' by ', h('strong', { text: 'Eduardo Abel Gimenez' }),
      ' (magicaweb.com), with bug fixes by Robert Munafo (mrob.com). Title image by Sean Freeman.'),
    h('p', {},
      h('a', { href: `${BASE}log.txt`, target: '_blank', rel: 'noopener' }, 'Changelog'),
      ' · ',
      h('a', { href: 'https://magicaweb.com/zoo/', target: '_blank', rel: 'noopener' }, 'Original game'),
      ' · ',
      h('a', { href: 'mailto:e.a.gimenez-at-gmail.dot.com' }, 'Contact the author'),
    ),
    h('h3', { text: 'Animal photos' }),
    h('p', { class: 'muted small' },
      'Except where noted, all photos were published by their authors under a ',
      h('a', { href: 'http://creativecommons.org/licenses/by/2.0/', target: '_blank', rel: 'noopener' }, 'Creative Commons "by" license'),
      '. All from flickr.com, except those marked Wikimedia Commons.'),
    h('ul', { class: 'credit-list' }, PHOTO_CREDITS.map(([animal, who], i) => h('li', {},
      h('img', { src: speciesImage(i), alt: '', width: 24, height: 24, loading: 'lazy' }),
      h('span', {}, h('strong', { text: animal }), ` — ${who}`),
    ))),
  );
  openModal({ title: 'About & credits', icon: 'info', body, size: 'lg', actions: [{ label: 'Close', kind: 'ghost' }] });
}

// Fine that went onto your debt (the original showed a dedicated popup for this one).
export function openDebtFine(id, amount) {
  openModal({
    title: 'Fined for overcrowding',
    icon: 'gavel',
    tone: 'danger',
    body: h('div', { class: 'fine' },
      h('img', { src: speciesImage(id), alt: '', width: 80, height: 70 }),
      h('p', { text: `The Animal Bureau fined you ${money(amount)} for overcrowding in your ${SPECIES[id].name} habitat. The fine was added to your debt.` }),
    ),
    actions: [{ label: 'OK', kind: 'primary', autofocus: true }],
  });
}

// Shown when the player returns to a background tab.
export function openAwaySummary(game, before, seconds) {
  const now = game.snapshot();
  const signed = (v, f) => `${v >= 0 ? '+' : '−'}${f(Math.abs(v))}`;
  const tile = (ic, label, value, note) => h('div', { class: 'stat-tile' },
    h('span', { class: 'stat-tile-icon' }, icon(ic)),
    h('span', { class: 'stat-tile-label', text: label }),
    h('strong', { class: 'stat-tile-value', text: value }),
    note && h('span', { class: 'muted small', text: note }));

  const newSpecies = [];
  for (let i = before.speciesShown; i < Math.min(now.speciesShown, OMEGA_IX); i++) newSpecies.push(i);
  const fines = now.fines - before.fines;
  const badges = now.badges - before.badges;

  const body = h('div', { class: 'away' },
    h('div', { class: 'stat-tiles' },
      tile('coins', 'Cash', signed(now.money - before.money, money), `now ${money(now.money)}`),
      tile('bank', 'Debt', money(now.debt), now.debt !== before.debt ? `was ${money(before.debt)}` : null),
      tile('heart', 'Births', commas(now.born - before.born)),
      tile('minus', 'Deaths', commas(now.dead - before.dead)),
      tile('paw', 'Animals', signed(now.total - before.total, commas), `now ${commas(Math.max(0, now.total))}`),
      tile('trophy', 'Achievements', `+${commas(badges)}`),
      fines > 0 && tile('gavel', 'Fines', commas(fines), 'See the activity feed'),
    ),
    newSpecies.length > 0 && h('div', { class: 'away-species' },
      h('h3', { text: newSpecies.length === 1 ? 'New species available' : `${newSpecies.length} new species available` }),
      h('ul', {}, newSpecies.map((i) => h('li', {},
        h('img', { src: speciesImage(i), alt: '', width: 40, height: 40 }),
        h('span', { text: SPECIES[i].name }),
      ))),
    ),
    game.currentOffer() && h('p', { class: 'away-note' }, icon('swap'), 'A trade offer is waiting for you.'),
  );

  openModal({
    title: 'While you were away',
    subtitle: `You were gone for ${duration(seconds)}. Your zoo kept running.`,
    icon: 'clock',
    body,
    size: 'lg',
    actions: [{ label: 'Back to the zoo', kind: 'primary', autofocus: true }],
  });
}
