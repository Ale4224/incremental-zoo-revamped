// Animal cards: population, trading and per-species upgrades.
import { SPECIES, OMEGA_IX, speciesImage } from '../game/species.js';
import { MAX_BOOSTS } from '../game/game.js';
import { commas, money, pct, duration, count } from '../game/format.js';
import { h, setText, setStyle, toggle, setDisabled, flash } from './dom.js';
import { icon } from './icons.js';
import { openModal } from './overlay.js';

export const AMOUNT_LABELS = { 1: '1', 10: '10', 100: '100', 1000: '1K', 10000: '10K' };

const UPGRADES = [
  { kind: 'br', label: 'Birth rate', icon: 'heart' },
  { kind: 'dr', label: 'Death rate', icon: 'shield' },
  { kind: 'bs', label: 'Value', icon: 'tag' },
  { kind: 'en', label: 'Habitat', icon: 'expand' },
];

export function createAnimalsView(game, { getAmount, report }) {
  const grid = h('div', { class: 'animal-grid' });
  const cards = [];

  for (let id = 0; id < OMEGA_IX; id++) {
    const card = buildCard(id);
    cards.push(card);
    grid.append(card.el);
  }
  const teaser = buildTeaser();
  grid.append(teaser.el);

  function buildCard(id) {
    const s = SPECIES[id];
    const r = {};
    const openInfo = () => openSpeciesModal(game, id);

    const upgrades = UPGRADES.map((u) => {
      const ref = {};
      ref.el = h('button', {
        class: `upgrade upgrade-${u.kind}`, type: 'button',
        onClick: () => report(game.buyBoost(u.kind, id)),
      },
      h('span', { class: 'upgrade-top' },
        icon(u.icon),
        h('span', { class: 'upgrade-label', text: u.label }),
        ref.level = h('span', { class: 'upgrade-level' }),
      ),
      ref.price = h('span', { class: 'upgrade-price' }),
      );
      ref.kind = u.kind;
      return ref;
    });

    r.el = h('article', { class: 'animal-card', style: { '--tint': s.bgc }, dataset: { id } },
      h('div', { class: 'animal-head' },
        h('button', { class: 'animal-photo', type: 'button', 'aria-label': `About the ${s.name}`, onClick: openInfo },
          h('img', { src: speciesImage(id), alt: '', width: 72, height: 72, loading: 'lazy', decoding: 'async' }),
          h('span', { class: 'animal-tier', text: id + 1 }),
        ),
        h('div', { class: 'animal-title' },
          h('h3', { text: s.name }),
          h('div', { class: 'animal-rates' },
            r.birthWrap = h('span', { class: 'rate rate-birth' }, icon('plus'), r.birth = h('span')),
            r.deathWrap = h('span', { class: 'rate rate-death' }, icon('minus'), r.death = h('span')),
          ),
        ),
        h('button', { class: 'icon-btn animal-info', type: 'button', 'aria-label': `${s.name} details`, onClick: openInfo }, icon('info')),
      ),
      h('div', { class: 'animal-pop' },
        h('div', { class: 'pop-numbers' },
          r.own = h('span', { class: 'pop-own' }),
          r.max = h('span', { class: 'pop-max' }),
          r.full = h('span', { class: 'chip chip-red', text: 'Habitat full' }),
        ),
        h('div', { class: 'bar' }, r.bar = h('div', { class: 'bar-fill' })),
      ),
      r.req = h('div', { class: 'animal-req' },
        icon('lock'),
        h('div', { class: 'req-body' },
          r.reqText = h('span', { class: 'req-text' }),
          h('div', { class: 'bar bar-sm' }, r.reqBar = h('div', { class: 'bar-fill' })),
        ),
      ),
      h('div', { class: 'animal-trade' },
        r.buy = h('button', { class: 'btn btn-buy', type: 'button', onClick: () => report(game.buy(id, getAmount())) },
          r.buyLabel = h('span', { class: 'btn-label' }),
          r.buyPrice = h('span', { class: 'btn-sub' }),
        ),
        r.sell = h('button', { class: 'btn btn-sell', type: 'button', onClick: () => report(game.sell(id, getAmount())) },
          r.sellLabel = h('span', { class: 'btn-label' }),
          r.sellPrice = h('span', { class: 'btn-sub' }),
        ),
      ),
      h('div', { class: 'animal-upgrades' }, upgrades.map((u) => u.el)),
    );
    r.upgrades = upgrades;
    r.id = id;
    return r;
  }

  function buildTeaser() {
    const r = {};
    r.el = h('article', { class: 'animal-card teaser' },
      h('div', { class: 'teaser-photo' }, r.img = h('img', { alt: '', width: 72, height: 72 }), icon('lock')),
      h('div', { class: 'teaser-body' },
        h('span', { class: 'eyebrow', text: 'Next species' }),
        r.name = h('h3'),
        r.time = h('p', { class: 'teaser-time' }),
        h('div', { class: 'bar' }, r.bar = h('div', { class: 'bar-fill' })),
        h('p', { class: 'teaser-hint', text: 'Fund animal welfare science to get there sooner.' }),
      ),
    );
    return r;
  }

  function updateCard(c) {
    const z = game.zoo;
    const id = c.id;
    const a = z.animals[id];
    const s = SPECIES[id];
    const revealed = game.isRevealed(id);
    if (c.el.hidden !== !revealed) c.el.hidden = !revealed;
    if (!revealed) return;

    const amt = getAmount();
    const amtLabel = AMOUNT_LABELS[amt];
    const full = a.own >= a.maxPop;

    setText(c.own, commas(a.own));
    setText(c.max, `/ ${commas(a.maxPop)}`);
    toggle(c.full, 'show', full);
    toggle(c.el, 'is-full', full);
    toggle(c.el, 'is-empty', a.own === 0);
    setStyle(c.bar, 'width', `${Math.min(100, (a.own / a.maxPop) * 100)}%`);

    // Birth / death chance per second.
    if (a.own <= 1) {
      setText(c.birth, '—');
      setText(c.death, '—');
      c.birthWrap.dataset.tip = 'Needs at least 2 animals to breed';
      c.deathWrap.dataset.tip = 'Needs at least 2 animals';
    } else {
      setText(c.birth, pct(game.birthChance(id)));
      setText(c.death, pct(game.deathChance(id)));
      c.birthWrap.dataset.tip = full ? 'Habitat full: no births' : `Birth chance each second · ${game.formula(id, 'birth')}`;
      c.deathWrap.dataset.tip = full ? 'Habitat full: no deaths' : `Death chance each second · ${game.formula(id, 'death')}`;
    }

    // First-purchase requirement.
    const req = game.requirement(id);
    const locked = Boolean(req && !req.met);
    toggle(c.req, 'show', locked);
    toggle(c.el, 'is-locked', locked);
    if (locked) {
      setText(c.reqText, `Own ${commas(req.need)} ${SPECIES[req.species].plural} to unlock (${commas(req.have)}/${commas(req.need)})`);
      setStyle(c.reqBar, 'width', `${Math.min(100, (req.have / req.need) * 100)}%`);
    }

    // Buy.
    const buyCost = a.buyPrice * amt;
    setText(c.buyLabel, `Buy ×${amtLabel}`);
    setText(c.buyPrice, money(buyCost));
    let reason = '';
    if (z.debt > Number(z.creditLimit.toFixed(2))) reason = 'Debt is over your credit limit';
    else if (buyCost > z.money) reason = `Need ${money(buyCost)}`;
    else if (locked) reason = `Need ${commas(req.need)} ${SPECIES[req.species].plural} first`;
    else if (a.own + amt > a.maxPop) reason = 'Not enough room in the habitat';
    setDisabled(c.buy, Boolean(reason), reason);

    // Sell.
    setText(c.sellLabel, `Sell ×${amtLabel}`);
    setText(c.sellPrice, `+${money(game.sellPrice(id) * amt)}`);
    setDisabled(c.sell, a.own < amt, a.own < amt ? `You have ${commas(a.own)}` : '');

    // Upgrades.
    for (const u of c.upgrades) {
      const price = a[`${u.kind}Price`];
      if (u.kind === 'en') {
        setText(u.level, `Lv ${a.enCount}`);
        const next = a.maxPop + a.maxPopBought + 100;
        const tip = `Room for ${commas(next)} ${s.plural} (now ${commas(a.maxPop)})`;
        setText(u.price, money(price));
        setDisabled(u.el, price > z.money, price > z.money ? `${tip} · Need ${money(price)}` : tip);
        continue;
      }
      const n = a[`${u.kind}Count`];
      const maxed = n >= MAX_BOOSTS;
      setText(u.level, `${n}/${MAX_BOOSTS}`);
      setText(u.price, maxed ? 'Maxed' : money(price));
      toggle(u.el, 'is-maxed', maxed);
      let tip;
      if (u.kind === 'br') {
        const next = a.own > 1 ? pct(a.own / (a.birthRate * z.brBoostEffect + a.own)) : null;
        tip = next ? `More births: ${pct(game.birthChance(id))} → ${next}` : 'Makes this species breed faster';
      } else if (u.kind === 'dr') {
        const next = a.own > 1 ? pct(a.own / (a.deathRate * z.drBoostEffect + a.own * 2)) : null;
        tip = next ? `Fewer deaths: ${pct(game.deathChance(id))} → ${next}` : 'Makes this species live longer';
      } else {
        tip = `Price ${money(a.buyPrice)} → ${money(a.buyPrice * z.bsBoostEffect)} (buy and sell)`;
      }
      if (maxed) tip = 'Fully upgraded';
      else if (price > z.money) tip += ` · Need ${money(price)}`;
      setDisabled(u.el, maxed || price > z.money, tip);
    }
  }

  function updateTeaser() {
    const next = game.nextSpecies();
    if (teaser.el.hidden !== !next) teaser.el.hidden = !next;
    if (!next) return;
    if (teaser.shown !== next.id) {
      teaser.shown = next.id;
      teaser.img.src = speciesImage(next.id);
      setText(teaser.name, SPECIES[next.id].name);
    }
    setText(teaser.time, `Arrives in ${duration(next.remaining)}`);
    setStyle(teaser.bar, 'width', `${next.progress * 100}%`);
  }

  return {
    el: grid,
    update() {
      cards.forEach(updateCard);
      updateTeaser();
    },
    onTick({ births, deaths }) {
      births.forEach((id) => cards[id] && flash(cards[id].own, 'flash-birth'));
      deaths.forEach((id) => cards[id] && flash(cards[id].own, 'flash-death'));
    },
    highlight(id) {
      const c = cards[id];
      if (!c) return;
      flash(c.el, 'is-new', 6000);
    },
    scrollTo(id) {
      const c = cards[id];
      if (!c || c.el.hidden) return;
      c.el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      flash(c.el, 'is-new', 2500);
    },
  };
}

// Live-updating detail view for a species.
export function openSpeciesModal(game, id) {
  const s = SPECIES[id];
  const rows = {};
  const stat = (key, label) => h('div', { class: 'stat-row' },
    h('span', { class: 'stat-label', text: label }),
    rows[key] = h('span', { class: 'stat-value' }));

  const body = h('div', { class: 'species-detail' },
    h('div', { class: 'species-hero', style: { '--tint': s.bgc } },
      h('img', { src: speciesImage(id), alt: s.name, width: 161, height: 140 }),
      h('blockquote', {},
        h('p', { text: `“${s.quote}”` }),
        h('cite', { text: `— ${s.who}` }),
      ),
    ),
    h('div', { class: 'stat-grid' },
      stat('pop', 'Population'),
      stat('maxOwn', 'Most at once'),
      stat('bought', 'Bought'),
      stat('sold', 'Sold / traded'),
      stat('born', 'Born'),
      stat('dead', 'Died'),
      stat('birth', 'Birth chance'),
      stat('death', 'Death chance'),
      stat('buy', 'Buy price'),
      stat('sell', 'Sell price'),
      stat('boosts', 'Upgrades'),
      stat('habitat', 'Habitat expansions'),
      stat('birthF', 'Birth formula'),
      stat('deathF', 'Death formula'),
    ),
    h('p', { class: 'muted small', text: `Upgrades are listed as birth rate · death rate · value.${id >= 2 ? ' ' + game.requirementText(id) : ''}` }),
  );

  const refresh = () => {
    const a = game.zoo.animals[id];
    setText(rows.pop, `${commas(a.own)} / ${commas(a.maxPop)}`);
    setText(rows.maxOwn, commas(a.maxOwn));
    setText(rows.bought, commas(a.bought));
    setText(rows.sold, commas(a.sold));
    setText(rows.born, commas(a.born));
    setText(rows.dead, commas(a.dead));
    setText(rows.birth, `${pct(game.birthChance(id) || 0)} / s`);
    setText(rows.death, `${pct(game.deathChance(id) || 0)} / s`);
    setText(rows.birthF, game.formula(id, 'birth'));
    setText(rows.deathF, game.formula(id, 'death'));
    setText(rows.buy, money(a.buyPrice));
    setText(rows.sell, money(game.sellPrice(id)));
    setText(rows.boosts, `${a.brCount} · ${a.drCount} · ${a.bsCount} of ${MAX_BOOSTS}`);
    setText(rows.habitat, `${count(a.enCount)}`);
  };
  refresh();
  const off = game.on('update', refresh);
  openModal({
    title: s.name,
    subtitle: `Species #${id + 1}`,
    icon: 'paw',
    body,
    size: 'lg',
    actions: [{ label: 'Close', kind: 'ghost' }],
    onClose: off,
  });
}
