// Sidebar panels: bank, visitors, research and the activity feed.
import { SPECIES, speciesImage } from '../game/species.js';
import { commas, money, duration } from '../game/format.js';
import { h, setText, setStyle, toggle, setDisabled, flash } from './dom.js';
import { icon } from './icons.js';

function panel(iconName, title, ...children) {
  return h('section', { class: 'panel' },
    h('h2', { class: 'panel-title' }, icon(iconName), h('span', { text: title })),
    ...children);
}

// ------------------------------------------------------------------- bank
export function createBankPanel(game, { report }) {
  const r = {};
  const borrow = (amt) => report(game.borrow(amt));
  const pay = (amt) => report(game.payDebt(amt));

  const el = panel('bank', 'Bank',
    h('div', { class: 'bank-figures' },
      h('div', { class: 'figure' }, h('span', { class: 'figure-label', text: 'Cash' }), r.cash = h('span', { class: 'figure-value' })),
      h('div', { class: 'figure figure-debt' }, h('span', { class: 'figure-label', text: 'Debt' }), r.debt = h('span', { class: 'figure-value' })),
    ),
    h('div', { class: 'credit' },
      h('div', { class: 'credit-head' }, h('span', { text: 'Credit used' }), r.limit = h('span')),
      h('div', { class: 'bar bar-credit' }, r.bar = h('div', { class: 'bar-fill' })),
      h('p', { class: 'muted small', text: 'Interest: 0.015% every 10 seconds. Your limit grows with the biggest species you own.' }),
    ),
    h('div', { class: 'btn-row' },
      h('span', { class: 'row-label', text: 'Borrow' }),
      r.b10 = h('button', { class: 'btn btn-soft', type: 'button', onClick: () => borrow(10), text: '$10' }),
      r.b1k = h('button', { class: 'btn btn-soft', type: 'button', onClick: () => borrow(1000), text: '$1,000' }),
      r.bmax = h('button', { class: 'btn btn-soft', type: 'button', onClick: () => borrow('max'), text: 'Max' }),
    ),
    h('div', { class: 'btn-row' },
      h('span', { class: 'row-label', text: 'Repay' }),
      r.p10 = h('button', { class: 'btn btn-soft', type: 'button', onClick: () => pay(10), text: '$10' }),
      r.p1k = h('button', { class: 'btn btn-soft', type: 'button', onClick: () => pay(1000), text: '$1,000' }),
      r.pmax = h('button', { class: 'btn btn-soft', type: 'button', onClick: () => pay('max'), text: 'All' }),
    ),
  );

  return {
    el,
    cashEl: r.cash,
    update() {
      const z = game.zoo;
      setText(r.cash, money(z.money));
      setText(r.debt, money(z.debt));
      toggle(r.debt, 'negative', z.debt > 0);
      setText(r.limit, `${money(z.debt)} of ${money(z.creditLimit)}`);
      const used = z.creditLimit > 0 ? z.debt / z.creditLimit : 0;
      setStyle(r.bar, 'width', `${Math.min(100, used * 100)}%`);
      toggle(r.bar, 'warn', used > 0.75);
      const room = z.creditLimit - z.debt;
      setDisabled(r.b10, z.debt > z.creditLimit - 10, 'Credit limit reached');
      setDisabled(r.b1k, z.debt > z.creditLimit - 1000, room > 0 ? `You can borrow ${money(room)} more` : 'Credit limit reached');
      setDisabled(r.bmax, room <= 0, 'Credit limit reached');
      const cantPay = z.debt <= 0 ? 'No debt' : z.money <= 0 ? 'No cash' : '';
      [r.p10, r.p1k, r.pmax].forEach((b) => setDisabled(b, Boolean(cantPay), cantPay));
    },
  };
}

// --------------------------------------------------------------- visitors
export function createVisitorsPanel(game, { report }) {
  const r = {};
  const el = panel('users', 'Visitors',
    h('div', { class: 'visitors-head' },
      h('div', {},
        r.count = h('div', { class: 'big-number' }),
        r.every = h('div', { class: 'muted small' }),
      ),
      h('div', { class: 'income' }, r.income = h('strong'), h('span', { class: 'muted small', text: 'per second' })),
    ),
    h('div', { class: 'bar bar-sm bar-visitors' }, r.bar = h('div', { class: 'bar-fill' })),
    r.help = h('p', { class: 'muted small' }),
    r.more = h('button', { class: 'action', type: 'button', onClick: () => report(game.buyVisitors(), (res) => `+${commas(res.added)} visitors`) },
      icon('users'),
      h('span', { class: 'action-body' },
        r.moreTitle = h('span', { class: 'action-title' }),
        r.moreSub = h('span', { class: 'action-sub' }),
      ),
      r.morePrice = h('span', { class: 'action-price' }),
    ),
    r.faster = h('button', { class: 'action', type: 'button', onClick: () => report(game.buyVisitorsTime(), () => 'Visitors arrive more often') },
      icon('megaphone'),
      h('span', { class: 'action-body' },
        r.fasterTitle = h('span', { class: 'action-title' }),
        r.fasterSub = h('span', { class: 'action-sub' }),
      ),
      r.fasterPrice = h('span', { class: 'action-price' }),
    ),
  );

  return {
    el,
    update() {
      const z = game.zoo;
      const species = game.censusSpecies();
      setText(r.count, `${commas(z.visitorsTotal)} visitors`);
      setText(r.every, z.visitorsTime === 1 ? 'arrive every second' : `arrive every ${z.visitorsTime} seconds`);
      setText(r.income, money(game.visitorIncomePerSecond()));
      setStyle(r.bar, 'width', z.visitorsTotal > 0 ? `${Math.min(1, z.visitorsCounter / z.visitorsTime) * 100}%` : '0%');
      setText(r.help, `Each visitor pays $1 for every species on display (${species} now).`);

      const pb = game.visitorsPayback();
      setText(r.moreTitle, `Attract ${commas(z.visitorsBuy)} more visitors`);
      setText(r.moreSub, species > 0 ? `Pays for itself in ${duration(pb.more)}` : 'Put some animals on display first');
      setText(r.morePrice, money(z.visitorsBuyCost));
      setDisabled(r.more, z.money < z.visitorsBuyCost, `Need ${money(z.visitorsBuyCost)}`);

      const maxed = z.visitorsTime === 1;
      r.faster.hidden = maxed;
      if (!maxed) {
        setText(r.fasterTitle, `Advertise: visits every ${z.visitorsTime - 1}s`);
        setText(r.fasterSub, pb.faster != null ? `Pays for itself in ${duration(pb.faster)}` : 'Get visitors first to see the payoff');
        setText(r.fasterPrice, money(z.visitorsTimeCost));
        setDisabled(r.faster, z.money < z.visitorsTimeCost, `Need ${money(z.visitorsTimeCost)}`);
      }
    },
  };
}

// --------------------------------------------------------------- research
export function createResearchPanel(game, { report }) {
  const r = {};
  const el = panel('flask', 'Research',
    r.next = h('div', { class: 'research-next' },
      r.img = h('img', { alt: '', width: 44, height: 44 }),
      h('div', {},
        r.name = h('div', { class: 'research-name' }),
        r.time = h('div', { class: 'muted small' }),
      ),
    ),
    h('div', { class: 'bar bar-sm' }, r.bar = h('div', { class: 'bar-fill' })),
    r.btn = h('button', {
      class: 'action', type: 'button',
      onClick: () => report(game.buyTime(), (res) => `Research paid off: ${duration(res.gained)} closer to the next species`),
    },
    icon('flask'),
    h('span', { class: 'action-body' },
      h('span', { class: 'action-title', text: 'Invest in animal welfare science' }),
      r.sub = h('span', { class: 'action-sub' }),
    ),
    r.price = h('span', { class: 'action-price' }),
    ),
    r.done = h('p', { class: 'research-done' }),
  );

  return {
    el,
    update() {
      const z = game.zoo;
      const next = game.nextSpecies();
      r.next.hidden = !next;
      r.btn.hidden = !next;
      r.bar.parentElement.hidden = !next;
      r.done.hidden = Boolean(next);
      if (!next) {
        setText(r.done, `${game.certifiedPhrase()} all the animals!`);
        return;
      }
      if (r.shown !== next.id) {
        r.shown = next.id;
        r.img.src = speciesImage(next.id);
      }
      setText(r.name, `Next: ${SPECIES[next.id].name}`);
      setText(r.time, `in ${duration(next.remaining)}`);
      setStyle(r.bar, 'width', `${next.progress * 100}%`);
      setText(r.sub, `Cuts the wait by about ${commas(z.timeSecs)} seconds`);
      setText(r.price, money(z.timePrice));
      setDisabled(r.btn, z.money < z.timePrice, `Need ${money(z.timePrice)}`);
    },
  };
}

// ---------------------------------------------------------------- activity
const LOG_KEY = 'IZActivityLog';
const LOG_MAX = 120;
const KIND_ICON = {
  species: 'sparkles', offer: 'swap', fine: 'gavel', visitors: 'users',
  boost: 'arrowUp', badge: 'trophy', reset: 'refresh', info: 'info',
};

export function createActivityPanel() {
  let entries = [];
  try {
    entries = JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
  } catch {
    entries = [];
  }

  const list = h('ol', { class: 'activity-list' });
  const empty = h('p', { class: 'muted small activity-empty', text: 'Things that happen in your zoo will show up here.' });
  const clear = h('button', { class: 'link-btn', type: 'button', text: 'Clear', onClick: () => { entries = []; persist(); render(); } });

  const el = h('section', { class: 'panel activity' },
    h('h2', { class: 'panel-title' }, icon('list'), h('span', { text: 'Activity' }), clear),
    empty,
    list,
  );

  function persist() {
    localStorage.setItem(LOG_KEY, JSON.stringify(entries.slice(0, LOG_MAX)));
  }

  function itemEl(e) {
    const t = new Date(e.at);
    const visual = e.species != null
      ? h('img', { class: 'activity-thumb', src: speciesImage(e.species), alt: '', width: 28, height: 28, loading: 'lazy' })
      : h('span', { class: 'activity-icon' }, icon(KIND_ICON[e.kind] || 'info'));
    return h('li', { class: `activity-item kind-${e.kind}` },
      visual,
      h('div', { class: 'activity-body' },
        h('div', { class: 'activity-text', text: e.text }),
        e.quote && h('div', { class: 'activity-quote', text: e.quote }),
      ),
      h('time', { class: 'activity-time', text: t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }),
    );
  }

  function render() {
    list.replaceChildren(...entries.slice(0, 60).map(itemEl));
    empty.hidden = entries.length > 0;
    clear.hidden = entries.length === 0;
  }
  render();

  return {
    el,
    add(entry) {
      const e = { ...entry, at: Date.now() };
      entries.unshift(e);
      entries.length = Math.min(entries.length, LOG_MAX);
      persist();
      const li = itemEl(e);
      list.prepend(li);
      flash(li, 'entering', 600);
      while (list.children.length > 60) list.lastElementChild.remove();
      empty.hidden = true;
      clear.hidden = false;
    },
    reset() {
      entries = [];
      persist();
      render();
    },
  };
}

