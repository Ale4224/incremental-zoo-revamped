// Top-level layout and event wiring.
import { SPECIES, OMEGA_IX, img, speciesImage } from '../game/species.js';
import { AMOUNTS } from '../game/game.js';
import { BADGES_BY_ID, ALL_BADGES } from '../game/badges.js';
import { commas, money, count } from '../game/format.js';
import { h, setText, toggle, flash } from './dom.js';
import { icon } from './icons.js';
import { toast } from './overlay.js';
import { createAnimalsView, AMOUNT_LABELS } from './animals.js';
import { createAchievementsView } from './achievements.js';
import { createBankPanel, createVisitorsPanel, createResearchPanel, createActivityPanel } from './panels.js';
import { createOfferPopup } from './offer.js';
import {
  openHelp, openStats, openExport, openImport, openNewZoo, openHardReset, openCredits, openDebtFine,
} from './dialogs.js';

const AMOUNT_KEY = 'IZBuyAmount';

export function mountApp(root, game) {
  let amount = Number(localStorage.getItem(AMOUNT_KEY)) || 1;
  if (!AMOUNTS.includes(amount)) amount = 1;
  let tab = 'animals';

  const report = (res, success) => {
    if (!res.ok) {
      toast({ kind: 'error', title: res.error });
    } else if (success) {
      toast({ kind: 'success', title: typeof success === 'function' ? success(res) : success, duration: 2400 });
    }
    return res;
  };
  const ctx = { report, getAmount: () => amount };

  // ------------------------------------------------------------- components
  const bank = createBankPanel(game, ctx);
  const visitors = createVisitorsPanel(game, ctx);
  const research = createResearchPanel(game, ctx);
  const activity = createActivityPanel();
  const animals = createAnimalsView(game, ctx);
  const achievements = createAchievementsView(game);
  const offer = createOfferPopup(game, ctx);

  // ------------------------------------------------------------------ header
  const hud = {};
  const chip = (key, ic, label, extraClass = '') => h('div', { class: `hud-chip ${extraClass}` },
    h('span', { class: 'hud-icon' }, icon(ic)),
    h('span', { class: 'hud-text' },
      h('span', { class: 'hud-label', text: label }),
      hud[key] = h('span', { class: 'hud-value' }),
    ));

  const menu = createMenu([
    { icon: 'download', label: 'Export save', onClick: () => openExport(game) },
    { icon: 'upload', label: 'Import save', onClick: () => openImport(game) },
    { icon: 'refresh', label: 'Start a new zoo…', onClick: () => openNewZoo(game) },
    'sep',
    { icon: 'info', label: 'About & credits', onClick: openCredits },
    { icon: 'trash', label: 'Hard reset…', danger: true, onClick: () => openHardReset(game, () => activity.reset()) },
  ]);

  hud.cashChip = chip('cash', 'coins', 'Cash', 'hud-cash');
  const header = h('header', { class: 'topbar' },
    h('div', { class: 'topbar-inner' },
      h('a', { class: 'brand', href: '#', 'aria-label': 'Incremental Zoo', onClick: (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
        h('img', { src: img('incremental_zoo_resize.png'), alt: 'Incremental Zoo', width: 732, height: 172 })),
      h('div', { class: 'hud' },
        hud.cashChip,
        chip('debt', 'bank', 'Debt', 'hud-debt'),
        chip('income', 'users', 'Visitors'),
        chip('animals', 'paw', 'Animals'),
        chip('species', 'sparkles', 'Species'),
      ),
      h('nav', { class: 'top-actions' },
        hud.saved = h('span', { class: 'saved-indicator', 'aria-live': 'polite' }, icon('check'), 'Saved'),
        iconButton('chart', 'Statistics', () => openStats(game)),
        iconButton('help', 'How to play', () => openHelp()),
        menu.el,
      ),
    ),
  );

  // -------------------------------------------------------------- main area
  const tabs = {};
  const amountBtns = new Map();
  const toolbar = h('div', { class: 'toolbar' },
    h('div', { class: 'tabs', role: 'tablist' },
      tabs.animals = h('button', { class: 'tab', role: 'tab', type: 'button', onClick: () => setTab('animals') },
        icon('paw'), 'Animals', tabs.animalsCount = h('span', { class: 'tab-count' })),
      tabs.achievements = h('button', { class: 'tab', role: 'tab', type: 'button', onClick: () => setTab('achievements') },
        icon('trophy'), 'Achievements', tabs.achCount = h('span', { class: 'tab-count' })),
    ),
    tabs.amount = h('div', { class: 'amount-picker', role: 'group', 'aria-label': 'Quantity to buy or sell' },
      h('span', { class: 'amount-label', text: 'Quantity' }),
      h('div', { class: 'segmented' }, AMOUNTS.map((a, i) => {
        const b = h('button', {
          type: 'button', text: `×${AMOUNT_LABELS[a]}`, 'data-tip': `Press ${i + 1}`,
          onClick: () => setAmount(a),
        });
        amountBtns.set(a, b);
        return b;
      })),
    ),
  );

  const views = {
    animals: h('div', { class: 'view', role: 'tabpanel' }, animals.el),
    achievements: h('div', { class: 'view', role: 'tabpanel', hidden: true }, achievements.el),
  };

  const sidebar = h('aside', { class: 'sidebar' },
    h('div', { class: 'slot-bank' }, bank.el),
    h('div', { class: 'slot-rest' }, visitors.el, research.el, activity.el),
  );
  const main = h('main', { class: 'content' }, toolbar, views.animals, views.achievements);

  root.replaceChildren(
    header,
    h('div', { class: 'layout' }, sidebar, main),
    h('footer', { class: 'site-footer' },
      h('span', {}, 'Incremental Zoo by Eduardo Abel Gimenez, with bug fixes by Robert Munafo. '),
      h('button', { class: 'link-btn', type: 'button', text: 'About & photo credits', onClick: openCredits }),
    ),
    offer.el,
  );

  function setTab(next) {
    tab = next;
    for (const key of ['animals', 'achievements']) {
      views[key].hidden = key !== tab;
      toggle(tabs[key], 'active', key === tab);
      tabs[key].setAttribute('aria-selected', key === tab ? 'true' : 'false');
    }
    tabs.amount.hidden = tab !== 'animals';
    update();
  }

  function setAmount(a) {
    amount = a;
    localStorage.setItem(AMOUNT_KEY, String(a));
    for (const [v, b] of amountBtns) toggle(b, 'active', v === a);
    update();
  }

  // ------------------------------------------------------------------ update
  let lastTitle = '';
  function update() {
    const z = game.zoo;
    setText(hud.cash, money(z.money));
    setText(hud.debt, money(z.debt));
    toggle(hud.debt.closest('.hud-chip'), 'is-negative', z.debt > 0);
    setText(hud.income, `${money(game.visitorIncomePerSecond())}/s`);
    setText(hud.animals, count(Math.max(0, z.total)));
    setText(hud.species, `${game.censusSpecies()} / ${Math.min(z.speciesShown, OMEGA_IX)}`);
    setText(tabs.animalsCount, count(Math.max(0, z.total)));
    setText(tabs.achCount, `${commas(z.badges.length)}/${commas(ALL_BADGES.length)}`);

    bank.update();
    visitors.update();
    research.update();
    offer.update();
    if (tab === 'animals') animals.update();
    else achievements.update();

    const title = `${money(z.money)} · Incremental Zoo`;
    if (title !== lastTitle) document.title = lastTitle = title;
  }

  // ------------------------------------------------------------------ events
  game.on('update', update);
  game.on('tick', (e) => tab === 'animals' && animals.onTick(e));
  game.on('log', (entry) => {
    const extra = entry.kind === 'species' ? { quote: `“${SPECIES[entry.species].quote}” — ${SPECIES[entry.species].who}` } : {};
    activity.add({ ...entry, ...extra });
  });
  game.on('species', ({ id }) => {
    toast({
      kind: 'species',
      image: speciesImage(id),
      title: `New species: ${SPECIES[id].name}!`,
      message: id >= 2 ? game.requirementText(id) : `${game.certifiedPhrase()} ${SPECIES[id].plural}.`,
      quote: `“${SPECIES[id].quote}”`,
    });
    animals.highlight(id);
  });
  game.on('badges', (ids) => {
    const list = ids.map((id) => BADGES_BY_ID.get(id));
    if (list.length === 1) {
      toast({ kind: 'badge', image: list[0].image, title: 'Achievement unlocked', message: list[0].text, duration: 3500 });
    } else {
      const names = list.slice(0, 2).map((b) => b.text).join(' · ');
      toast({
        kind: 'badge', image: list[0].image, duration: 4000,
        title: `${list.length} achievements unlocked`,
        message: list.length > 2 ? `${names} and ${list.length - 2} more` : names,
      });
    }
    if (list.length <= 3) {
      list.forEach((b) => activity.add({ kind: 'badge', text: `Achievement: ${b.text}`, species: b.species }));
    } else {
      activity.add({ kind: 'badge', text: `${list.length} achievements unlocked.` });
    }
  });
  game.on('fine', ({ species, kind, amount: fine }) => {
    if (kind === 'debt') {
      openDebtFine(species, fine);
    } else {
      toast({
        kind: 'warning',
        image: speciesImage(species),
        title: 'Fined for overcrowding',
        message: kind === 'money'
          ? `The Animal Bureau took ${money(fine)} for the crowded ${SPECIES[species].name} habitat.`
          : `The Animal Bureau removed 5 of your ${SPECIES[species].plural}.`,
        duration: 7000,
      });
    }
  });
  game.on('visitors', ({ income }) => {
    const pop = h('span', { class: 'float-gain', text: `+${money(income)}` });
    hud.cashChip.append(pop);
    setTimeout(() => pop.remove(), 1400);
    flash(hud.cashChip, 'pulse', 600);
  });
  game.on('saved', () => flash(hud.saved, 'show', 1600));

  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (document.querySelector('dialog[open]')) return;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    const n = Number(e.key);
    if (n >= 1 && n <= AMOUNTS.length) setAmount(AMOUNTS[n - 1]);
  });

  setAmount(amount);
  setTab('animals');
  return { update };
}

function iconButton(name, label, onClick) {
  return h('button', { class: 'icon-btn', type: 'button', 'aria-label': label, 'data-tip': label, 'data-tip-pos': 'bottom', onClick }, icon(name));
}

function createMenu(items) {
  const list = h('div', { class: 'menu-list', role: 'menu', hidden: true },
    items.map((it) => (it === 'sep'
      ? h('hr')
      : h('button', {
        class: `menu-item${it.danger ? ' danger' : ''}`, type: 'button', role: 'menuitem',
        onClick: () => { close(); it.onClick(); },
      }, icon(it.icon), it.label))),
  );
  const trigger = h('button', {
    class: 'icon-btn', type: 'button', 'aria-label': 'More options', 'aria-haspopup': 'menu', 'aria-expanded': 'false',
    onClick: (e) => { e.stopPropagation(); list.hidden ? open() : close(); },
  }, icon('more'));
  const el = h('div', { class: 'menu' }, trigger, list);

  function open() {
    list.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    list.querySelector('button')?.focus();
  }
  function close() {
    list.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
  }
  document.addEventListener('click', (e) => { if (!el.contains(e.target)) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !list.hidden) { close(); trigger.focus(); } });
  return { el };
}
