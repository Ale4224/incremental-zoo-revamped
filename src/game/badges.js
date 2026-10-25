// Achievement definitions. IDs match the original game so old saves stay meaningful.
import { SPECIES, OMEGA_IX, speciesImage, speciesAltImage, img } from './species.js';
import { commas } from './format.js';

const AMOUNTS = [1, 100, 1000, 10000, 100000];
const SPECIES_BOOSTS = [10, 20];
const SPECIES_EN = [10, 20, 50, 100];

function speciesBadges(i) {
  const s = SPECIES[i];
  const n = (v) => commas(v);
  const list = [];
  const add = (id, image, text, test, alt = false) =>
    list.push({ id, image, text, test, species: i, alt });

  for (const a of AMOUNTS) {
    add(`speciesAmount${i}${a}`, speciesImage(i),
      a === 1 ? `Have 1 ${s.name} in your zoo` : `Have ${n(a)} ${s.plural} at once`,
      (z) => z.animals[i].maxOwn >= a);
  }
  for (const a of AMOUNTS) {
    add(`speciesBorn${i}${a}`, speciesImage(i),
      a === 1 ? `A ${s.name} was born in your zoo` : `${n(a)} ${s.plural} were born in your zoo`,
      (z) => z.animals[i].born >= a);
  }
  for (const a of AMOUNTS) {
    add(`speciesDead${i}${a}`, speciesAltImage(i),
      a === 1 ? `A ${s.name} died in your zoo` : `${n(a)} ${s.plural} died in your zoo`,
      (z) => z.animals[i].dead >= a, true);
  }
  for (const a of AMOUNTS) {
    add(`speciesBought${i}${a}`, speciesImage(i),
      a === 1 ? `You bought a ${s.name}` : `You bought ${n(a)} ${s.plural}`,
      (z) => z.animals[i].bought >= a);
  }
  for (const a of AMOUNTS) {
    add(`speciesSold${i}${a}`, speciesAltImage(i),
      a === 1 ? `You sold 1 ${s.name}` : `You sold ${n(a)} ${s.plural}`,
      (z) => z.animals[i].sold >= a, true);
  }
  for (const a of SPECIES_BOOSTS) {
    add(`speciesBR${i}${a}`, speciesImage(i),
      a === 20 ? `Maxed out the birth rate of your ${s.plural}` : `Bought 10 birth-rate boosts for your ${s.plural}`,
      (z) => z.animals[i].brCount >= a);
    add(`speciesDR${i}${a}`, speciesAltImage(i),
      a === 20 ? `Minimized the death rate of your ${s.plural}` : `Bought 10 death-rate reductions for your ${s.plural}`,
      (z) => z.animals[i].drCount >= a, true);
    add(`speciesBS${i}${a}`, speciesImage(i),
      a === 20 ? `Maxed out the price of your ${s.plural}` : `Bought 10 price boosts for your ${s.plural}`,
      (z) => z.animals[i].bsCount >= a);
  }
  for (const a of SPECIES_EN) {
    add(`speciesEN${i}${a}`, speciesImage(i),
      `Enlarged the ${s.name} habitat ${a} times`,
      (z) => z.animals[i].enCount >= a);
  }
  return list;
}

function generalBadges() {
  const list = [];
  const add = (group, id, image, text, test) => list.push({ id, image, text, test, group });
  const egg = img('egg.jpg');
  const clock = img('clock.jpg');

  for (const a of [1, 100, 1000, 10000, 100000, 1000000, 10000000]) {
    add('Collection', `totalAmount${a}`, egg,
      a === 1 ? 'Obtain your first animal' : `Have ${commas(a)} animals at once`,
      (z) => z.maxTotal >= a);
  }
  for (const a of [10, 20, 30, 35]) {
    add('Collection', `speciesFound${a}`, egg,
      a === 35 ? 'Get certified for all 35 species' : `Get certified for ${a} species`,
      (z) => z.speciesShown >= a);
  }
  for (const a of [1, 10, 100, 200, 500]) {
    add('Upgrades', `brBoosts${a}`, egg,
      a === 1 ? 'Buy your first birth-rate boost' : `Buy ${commas(a)} birth-rate boosts`,
      (z) => z.brBoosts >= a);
  }
  for (const a of [1, 10, 100, 200, 500]) {
    add('Upgrades', `drBoosts${a}`, egg,
      a === 1 ? 'Buy your first death-rate mitigator' : `Buy ${commas(a)} death-rate mitigators`,
      (z) => z.drBoosts >= a);
  }
  for (const a of [1, 10, 100, 200, 500]) {
    add('Upgrades', `bsBoosts${a}`, egg,
      a === 1 ? 'Buy your first price boost' : `Buy ${commas(a)} price boosts`,
      (z) => z.bsBoosts >= a);
  }
  for (const a of [1, 100, 200, 500, 1000]) {
    add('Upgrades', `enBoosts${a}`, egg,
      a === 1 ? 'Buy your first habitat expansion' : `Buy ${commas(a)} habitat expansions`,
      (z) => z.enBoosts >= a);
  }
  for (const a of [100, 1000, 10000, 100000, 1000000]) {
    add('Time', `time${a}`, clock, `Play for ${commas(a)} seconds`, (z) => z.time >= a);
  }
  return list;
}

export const GENERAL_BADGES = generalBadges();
export const SPECIES_BADGES = Array.from({ length: OMEGA_IX }, (_, i) => speciesBadges(i));
export const ALL_BADGES = [...SPECIES_BADGES.flat(), ...GENERAL_BADGES];
export const BADGES_BY_ID = new Map(ALL_BADGES.map((b) => [b.id, b]));

// Returns the IDs of every achievement currently earned (same rules as IZ.calculateBadges).
export function calculateBadges(zoo) {
  return ALL_BADGES.filter((b) => b.test(zoo)).map((b) => b.id);
}
