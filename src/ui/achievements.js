// Achievements tab: zoo-wide milestones plus a row per species.
import { SPECIES, speciesImage } from '../game/species.js';
import { GENERAL_BADGES, SPECIES_BADGES, ALL_BADGES } from '../game/badges.js';
import { commas } from '../game/format.js';
import { h, setText, setStyle, toggle } from './dom.js';
import { icon } from './icons.js';

function badgeEl(b) {
  return h('div', { class: `badge${b.alt ? ' badge-alt' : ''}`, 'data-tip': b.text, tabindex: 0, 'aria-label': b.text },
    h('img', { src: b.image, alt: '', loading: 'lazy', decoding: 'async', width: 44, height: 44 }),
    h('span', { class: 'badge-lock' }, icon('lock')),
  );
}

export function createAchievementsView(game) {
  const badgeEls = new Map();
  const r = {};

  const summary = h('section', { class: 'panel ach-summary' },
    h('div', { class: 'ach-summary-main' },
      h('span', { class: 'ach-trophy' }, icon('trophy')),
      h('div', {},
        h('div', { class: 'ach-count' }, r.count = h('strong'), h('span', { text: ` of ${commas(ALL_BADGES.length)} achievements` })),
        h('div', { class: 'bar' }, r.bar = h('div', { class: 'bar-fill' })),
      ),
    ),
    r.bonus = h('p', { class: 'muted small' }),
  );

  const groups = {};
  for (const b of GENERAL_BADGES) (groups[b.group] ||= []).push(b);
  const general = h('section', { class: 'panel' },
    h('h3', { class: 'section-title', text: 'Zoo milestones' }),
    Object.entries(groups).map(([name, list]) => h('div', { class: 'ach-group' },
      h('div', { class: 'ach-group-head' }, h('span', { text: name }), (r[`g_${name}`] = h('span', { class: 'muted' }))),
      h('div', { class: 'badge-grid' }, list.map((b) => {
        const el = badgeEl(b);
        badgeEls.set(b.id, el);
        return el;
      })),
    )),
  );

  const speciesRows = SPECIES_BADGES.map((list, i) => {
    const row = {};
    row.el = h('div', { class: 'ach-species', style: { '--tint': SPECIES[i].bgc } },
      h('div', { class: 'ach-species-head' },
        h('img', { src: speciesImage(i), alt: '', width: 36, height: 36, loading: 'lazy' }),
        h('span', { class: 'ach-species-name', text: SPECIES[i].name }),
        row.count = h('span', { class: 'muted small' }),
      ),
      h('div', { class: 'badge-grid' }, list.map((b) => {
        const el = badgeEl(b);
        badgeEls.set(b.id, el);
        return el;
      })),
    );
    row.list = list;
    return row;
  });

  const species = h('section', { class: 'panel' },
    h('h3', { class: 'section-title', text: 'Species' }),
    h('div', { class: 'ach-species-list' }, speciesRows.map((row) => row.el)),
  );

  const el = h('div', { class: 'achievements' }, summary, general, species);

  return {
    el,
    update() {
      const z = game.zoo;
      const earned = new Set(z.badges);
      for (const [id, badge] of badgeEls) toggle(badge, 'earned', earned.has(id));

      setText(r.count, commas(earned.size));
      setStyle(r.bar, 'width', `${(earned.size / ALL_BADGES.length) * 100}%`);
      const mult = 1 + (earned.size * 2) / 1000;
      setText(r.bonus,
        `Each achievement makes animals in your next zoo breed 0.2% faster. Starting a new zoo now gives a ${mult.toFixed(3)}× birth-rate bonus.`
        + (z.resetBadges > 0 ? ` You carry ${commas(z.resetBadges)} achievement points from previous zoos.` : ''));

      for (const [name, list] of Object.entries(groups)) {
        setText(r[`g_${name}`], `${list.filter((b) => earned.has(b.id)).length}/${list.length}`);
      }
      speciesRows.forEach((row, i) => {
        const visible = game.isRevealed(i);
        if (row.el.hidden !== !visible) row.el.hidden = !visible;
        if (visible) setText(row.count, `${row.list.filter((b) => earned.has(b.id)).length}/${row.list.length}`);
      });
    },
  };
}
