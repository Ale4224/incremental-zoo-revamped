// Floating trade offer from the Incremental Office for Animal Exchange.
import { SPECIES, speciesImage } from '../game/species.js';
import { commas } from '../game/format.js';
import { h, setText, toggle } from './dom.js';
import { icon } from './icons.js';

export function createOfferPopup(game, { report }) {
  const r = {};
  const side = (key, verb) => h('div', { class: `offer-side offer-${key}` },
    r[`${key}Img`] = h('img', { alt: '', width: 56, height: 56 }),
    h('div', {},
      h('span', { class: 'eyebrow', text: verb }),
      r[`${key}Text`] = h('strong'),
      r[`${key}Note`] = h('span', { class: 'muted small' }),
    ),
  );

  const el = h('aside', { class: 'offer', role: 'dialog', 'aria-label': 'Animal exchange offer', hidden: true },
    h('header', { class: 'offer-head' },
      h('span', { class: 'offer-icon' }, icon('swap')),
      h('div', {},
        h('span', { class: 'eyebrow', text: 'The Incremental Office for Animal Exchange' }),
        h('h3', { text: 'You have an offer' }),
      ),
    ),
    side('get', 'You get'),
    h('div', { class: 'offer-divider' }, icon('swap')),
    side('give', 'You give'),
    h('footer', { class: 'offer-actions' },
      h('button', { class: 'btn btn-ghost', type: 'button', text: 'No, thanks', onClick: () => report(game.declineOffer()) }),
      r.accept = h('button', {
        class: 'btn btn-primary', type: 'button', text: 'Accept trade',
        onClick: () => report(game.acceptOffer(), () => 'Trade complete'),
      }),
    ),
  );

  let shownKey = '';
  let hideTimer = null;
  return {
    el,
    update() {
      const offer = game.currentOffer();
      document.body.classList.toggle('has-offer', Boolean(offer));
      if (!offer) {
        if (!el.hidden && !hideTimer) {
          el.classList.add('leaving');
          hideTimer = setTimeout(() => {
            hideTimer = null;
            el.hidden = true;
            el.classList.remove('leaving');
          }, 250);
        }
        shownKey = '';
        return;
      }
      const key = `${offer.get}:${offer.getNumber}:${offer.give}:${offer.giveNumber}`;
      if (key !== shownKey) {
        shownKey = key;
        clearTimeout(hideTimer);
        hideTimer = null;
        r.getImg.src = speciesImage(offer.get);
        r.giveImg.src = speciesImage(offer.give);
        setText(r.getText, `${commas(offer.getNumber)} ${offer.getNumber === 1 ? SPECIES[offer.get].name : SPECIES[offer.get].plural}`);
        setText(r.giveText, `${commas(offer.giveNumber)} ${offer.giveNumber === 1 ? SPECIES[offer.give].name : SPECIES[offer.give].plural}`);
        el.hidden = false;
        el.classList.remove('leaving');
      }
      const have = game.zoo.animals[offer.give].own;
      setText(r.giveNote, `You have ${commas(have)}`);
      setText(r.getNote, `You have ${commas(game.zoo.animals[offer.get].own)}`);
      toggle(r.giveNote, 'negative', have < offer.giveNumber);
    },
  };
}
