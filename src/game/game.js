// Game state and rules. This is a faithful port of the original zoo.js logic,
// with DOM work removed: actions return results and the UI listens to events.
import { SPECIES, BASE_STATS, BASE_BIRTH_RATES, OMEGA_BR, OMEGA_IX } from './species.js';
import { calculateBadges } from './badges.js';
import { commas, money } from './format.js';

export const SAVE_KEY = 'IZIIGameSave';
export const AMOUNTS = [1, 10, 100, 1000, 10000];
export const MAX_BOOSTS = 20;

const ok = (extra = {}) => ({ ok: true, ...extra });
const fail = (error) => ({ ok: false, error });

function createAnimal(id, { birthRate, deathRate, buyPrice }) {
  return {
    id,
    birthRate,
    deathRate,
    buyPrice,
    brPrice: buyPrice, // birth rate boost price
    brCount: 0,
    drPrice: buyPrice, // death rate mitigation price
    drCount: 0,
    bsPrice: buyPrice, // buy & sell price boost price
    bsCount: 0,
    enPrice: buyPrice * 10, // habitat price
    enCount: 0,
    own: 0,
    maxOwn: 0,
    bought: 0,
    born: 0,
    dead: 0,
    sold: 0,
    maxPop: 100,
    maxPopBought: 0,
  };
}

export function createZoo() {
  return {
    money: 0,
    debt: 0,
    interestRate: 1.00015,
    interestCounter: 0,
    priceIncrement: 1.5,
    total: 0,
    maxTotal: 0,
    animals: BASE_STATS.map((s, id) => createAnimal(id, s)),
    animalsN: BASE_STATS.length,
    sellMarkdown: 0.8,
    creditLimit: 50,
    brBoosts: 0,
    brBoostEffect: 0.9, // changes denominator, less is better
    bsBoosts: 0,
    bsBoostEffect: 1.1, // increases value of animals (both to buy and to sell)
    drBoosts: 0,
    drBoostEffect: 1.1, // changes denominator, more is better
    enBoosts: 0,
    badges: [],
    time: 0,
    timeSecs: 10, // amount of time you can buy
    timeSecsIncrement: 1.1,
    timePrice: 10000,
    timePriceIncrement: 1.25,
    offerNext: 0, // when the next offer arrives
    offerGiveSpecies: 0,
    offerGiveNumber: 0,
    offerGetSpecies: 0,
    offerGetNumber: 0,
    offerActive: 0,
    offerAccepted: 0,
    speciesShown: 0,
    statsCounter: 0,
    resetBadges: 0,
    visitorsTotal: 0,
    visitorsBuy: 10,
    visitorsBuyCost: 100,
    visitorsTime: 60,
    visitorsTimeCost: 100,
    visitorsCounter: 0,
    visitorsLog: 0,
    fines: 0,
  };
}

export function encodeSave(zoo) {
  return btoa(JSON.stringify(zoo));
}

// Parses an exported save. Throws a readable error if it is not valid.
export function decodeSave(text) {
  let data;
  try {
    data = JSON.parse(atob(text.trim()));
  } catch {
    throw new Error("That doesn't look like an Incremental Zoo save.");
  }
  if (!data || !Array.isArray(data.animals) || typeof data.money !== 'number') {
    throw new Error("That doesn't look like an Incremental Zoo save.");
  }
  // Fill in anything an older save might be missing.
  const base = createZoo();
  const zoo = { ...base, ...data };
  zoo.animals = base.animals.map((a, i) => ({ ...a, ...(data.animals[i] || {}) }));
  return zoo;
}

export class Game {
  constructor() {
    this.zoo = createZoo();
    this.needSave = 0;
    this.earned = new Set();
    this.listeners = new Map();
    this.timer = null;
  }

  // ---------------------------------------------------------------- events
  on(event, fn) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event).add(fn);
    return () => this.listeners.get(event).delete(fn);
  }

  emit(event, payload) {
    this.listeners.get(event)?.forEach((fn) => fn(payload));
  }

  log(kind, text, extra = {}) {
    this.emit('log', { kind, text, ...extra });
  }

  // ------------------------------------------------------------ lifecycle
  start() {
    if (!this.timer) this.timer = setInterval(() => this.tick(), 1000);
  }

  // Loads from localStorage. Returns true when a save was found.
  load() {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) {
      this.afterLoad();
      return false;
    }
    try {
      this.zoo = decodeSave(raw);
    } catch (e) {
      console.warn('Could not read save, starting fresh.', e);
      this.zoo = createZoo();
    }
    this.afterLoad();
    return true;
  }

  afterLoad() {
    const z = this.zoo;
    for (let i = 0; i < z.animals.length; i++) {
      if (z.time >= SPECIES[i].wait) z.speciesShown = i + 1;
    }
    z.interestCounter = 8;
    this.earned = new Set(calculateBadges(z));
    z.badges = [...this.earned];
    this.refreshCreditLimit();
    this.emit('reset');
    this.emit('update');
  }

  save() {
    localStorage.setItem(SAVE_KEY, encodeSave(this.zoo));
    this.emit('saved');
  }

  // Schedule a save within `t` seconds (keeps the soonest request).
  setSave(t) {
    if (this.needSave <= 0 || t < this.needSave) this.needSave = t;
  }

  exportSave() {
    return encodeSave(this.zoo);
  }

  importSave(text) {
    const zoo = decodeSave(text); // throws on bad input
    this.zoo = zoo;
    this.save();
    this.afterLoad();
  }

  hardReset() {
    localStorage.removeItem(SAVE_KEY);
    this.zoo = createZoo();
    this.needSave = 0;
    this.afterLoad();
  }

  // ------------------------------------------------------------- queries
  censusSpecies() {
    return this.zoo.animals.filter((a) => a.own > 0).length;
  }

  zooNum() {
    return this.zoo.resetBadges > 0 ? 2 : 1;
  }

  certifiedPhrase() {
    return this.zoo.resetBadges > 0 ? 'Your zoo is certified to care for' : 'You are certified to care for';
  }

  everGotten() {
    return this.zoo.animals.reduce((sum, a) => sum + a.born + a.bought, 0);
  }

  isRevealed(id) {
    return id < this.zoo.speciesShown && id < OMEGA_IX;
  }

  // Seconds until the next species, or null when all are available.
  nextSpecies() {
    const z = this.zoo;
    if (z.speciesShown >= OMEGA_IX) return null;
    const id = z.speciesShown;
    const prevWait = id > 0 ? SPECIES[id - 1].wait : 0;
    return {
      id,
      remaining: SPECIES[id].wait - z.time,
      progress: Math.min(1, Math.max(0, (z.time - prevWait) / (SPECIES[id].wait - prevWait || 1))),
    };
  }

  // The "own N of species id-2" gate for buying the first animal of a species.
  requirement(id) {
    if (id < 2) return null;
    const need = (id - 1) * 100;
    const have = this.zoo.animals[id - 2].own;
    const met = this.zoo.animals[id].bought !== 0 || have >= need;
    return { species: id - 2, need, have, met };
  }

  requirementText(id) {
    if (id < 2) return '';
    return `You must have ${(id - 1) * 100} ${SPECIES[id - 2].plural} to buy the first ${SPECIES[id].name}.`;
  }

  // Probability of a birth / death this second (shown as a percentage).
  birthChance(id) {
    const a = this.zoo.animals[id];
    return a.own / (a.birthRate + a.own);
  }

  deathChance(id) {
    const a = this.zoo.animals[id];
    return a.own / (a.deathRate + a.own * 2);
  }

  formula(id, kind) {
    const a = this.zoo.animals[id];
    let d = kind === 'birth' ? a.birthRate : a.deathRate;
    d = d < 1 ? d.toFixed(2) : d < 10 ? d.toFixed(1) : Math.floor(d);
    return kind === 'birth' ? `${a.own}/(${d}+${a.own})` : `${a.own}/(${d}+${a.own * 2})`;
  }

  sellPrice(id) {
    return this.zoo.animals[id].buyPrice * this.zoo.sellMarkdown;
  }

  boostPrice(kind, id) {
    return this.zoo.animals[id][`${kind}Price`];
  }

  visitorIncomePerSecond() {
    const z = this.zoo;
    return (z.visitorsTotal * this.censusSpecies()) / z.visitorsTime;
  }

  // "Pays for itself in N seconds" for the two visitor upgrades.
  visitorsPayback() {
    const z = this.zoo;
    const species = this.censusSpecies();
    const more = (z.visitorsTime * z.visitorsBuyCost) / (z.visitorsBuy * species);
    let faster = null;
    if (z.visitorsTotal > 0 && z.visitorsTime > 1) {
      const cur = (z.visitorsTotal * species) / z.visitorsTime;
      const next = (z.visitorsTotal * species) / (z.visitorsTime - 1);
      faster = z.visitorsTimeCost / (next - cur);
    }
    return { more, faster };
  }

  refreshCreditLimit() {
    const z = this.zoo;
    let cl = 50;
    for (let i = z.animals.length - 1; i >= 0; i--) {
      if (z.animals[i].own > 1) {
        cl = z.animals[i + 1].buyPrice * 5;
        break;
      }
    }
    z.creditLimit = cl;
  }

  fixDebt() {
    // Forgive sub-cent leftovers so they don't silently grow with interest.
    if (this.zoo.debt <= 0.01) this.zoo.debt = 0;
  }

  totalSellValue() {
    const z = this.zoo;
    return z.animals.reduce((s, a) => s + a.own * a.buyPrice, 0) * z.sellMarkdown;
  }

  stats() {
    const z = this.zoo;
    const acquired = this.everGotten();
    return {
      total: z.total,
      acquired,
      rate: z.time > 0 ? acquired / z.time : 0,
      sellValue: this.totalSellValue(),
      species: z.speciesShown,
      brBoosts: z.brBoosts,
      drBoosts: z.drBoosts,
      bsBoosts: z.bsBoosts,
      enBoosts: z.enBoosts,
      offers: z.offerAccepted,
      fines: z.fines,
      badges: z.badges.length,
      resetBadges: z.resetBadges,
      time: z.time,
      zooNum: this.zooNum(),
      birthMultiplier: this.zooNum() > 1 ? OMEGA_BR / z.animals[OMEGA_IX].birthRate : 1,
    };
  }

  // -------------------------------------------------------------- actions
  done(saveIn, result = ok()) {
    this.setSave(saveIn);
    this.refreshCreditLimit();
    this.emit('update');
    return result;
  }

  borrow(amount) {
    const z = this.zoo;
    this.refreshCreditLimit();
    const room = Math.max(0, z.creditLimit - z.debt);
    if (amount === 'max') {
      if (z.debt > z.creditLimit) return fail(`You're over your ${money(z.creditLimit)} credit limit.`);
      amount = z.creditLimit - z.debt;
      if (amount <= 0) return fail(`You've reached your ${money(z.creditLimit)} credit limit.`);
    } else if (z.debt > z.creditLimit - amount) {
      return fail(`Credit limit is ${money(z.creditLimit)}. You can borrow ${money(room)} more.`);
    }
    z.money += amount;
    z.debt += amount;
    return this.done(1, ok({ amount }));
  }

  payDebt(amount) {
    const z = this.zoo;
    if (z.debt <= 0) return fail("You don't owe anything.");
    if (z.money <= 0) return fail('You have no cash to pay with.');
    if (amount === 'max') amount = z.debt;
    let pay = Math.min(z.debt, amount);
    if (z.money < pay) pay = z.money;
    z.debt -= pay;
    z.money -= pay;
    this.fixDebt();
    return this.done(1, ok({ amount: pay }));
  }

  buy(id, amount) {
    const z = this.zoo;
    const a = z.animals[id];
    const s = SPECIES[id];
    if (z.debt > Number(z.creditLimit.toFixed(2))) {
      return fail("Your debt is over the credit limit, so you can't buy animals. Pay some back first.");
    }
    const price = a.buyPrice * amount;
    if (price > z.money) {
      return fail(`You need ${money(price)} to buy ${commas(amount)} ${amount === 1 ? s.name : s.plural}.`);
    }
    const req = this.requirement(id);
    if (req && !req.met) {
      return fail(`You need at least ${commas(req.need)} ${SPECIES[req.species].plural} to buy your first ${s.name}.`);
    }
    if (a.own + amount > a.maxPop) {
      return fail(`Your ${s.name} habitat isn't big enough for ${commas(amount)} more. Enlarge it first.`);
    }
    z.money -= price;
    a.own += amount;
    a.bought += amount;
    z.total += amount;
    return this.done(10, ok({ price }));
  }

  sell(id, amount) {
    const z = this.zoo;
    const a = z.animals[id];
    if (a.own < amount) {
      return fail(`You only have ${commas(a.own)} ${a.own === 1 ? SPECIES[id].name : SPECIES[id].plural}.`);
    }
    const value = this.sellPrice(id) * amount;
    z.money += value;
    a.own -= amount;
    z.total -= amount;
    a.sold += amount;
    return this.done(10, ok({ value }));
  }

  // kind: 'br' (birth rate), 'dr' (death rate), 'bs' (prices), 'en' (habitat)
  buyBoost(kind, id) {
    const z = this.zoo;
    const a = z.animals[id];
    const s = SPECIES[id];
    const price = a[`${kind}Price`];
    if (kind !== 'en' && a[`${kind}Count`] === MAX_BOOSTS) {
      const msg = {
        br: "You can't increase the birth rate more than 20 times, per species, per zoo.",
        dr: "You can't mitigate the death rate more than 20 times per species.",
        bs: "You can't get higher prices more than 20 times per species.",
      };
      return fail(msg[kind]);
    }
    if (price > z.money) return fail(`You need ${money(price)} for this upgrade.`);

    z.money -= price;
    if (kind === 'br') {
      a.brCount++;
      a.brPrice *= z.priceIncrement;
      a.birthRate *= z.brBoostEffect;
      z.brBoosts++;
      if (a.brCount === MAX_BOOSTS) this.log('boost', `You maxed out the birth rate of ${s.plural}.`, { species: id });
    } else if (kind === 'dr') {
      a.drCount++;
      a.drPrice *= z.priceIncrement;
      a.deathRate *= z.drBoostEffect;
      z.drBoosts++;
      if (a.drCount === MAX_BOOSTS) this.log('boost', `You minimized the death rate of ${s.plural}.`, { species: id });
    } else if (kind === 'bs') {
      a.bsCount++;
      a.bsPrice *= 1.5;
      a.buyPrice *= z.bsBoostEffect;
      z.bsBoosts++;
      if (a.bsCount === MAX_BOOSTS) this.log('boost', `You maxed out prices for buying and selling ${s.plural}.`, { species: id });
    } else if (kind === 'en') {
      a.maxPopBought += 100;
      a.enPrice += (a.maxPopBought * a.buyPrice) / 10;
      a.maxPop += a.maxPopBought;
      a.enCount++;
      z.enBoosts++;
    }
    return this.done(10);
  }

  // "Invest in animal welfare science": skip ahead a random amount of time.
  buyTime() {
    const z = this.zoo;
    if (z.speciesShown >= OMEGA_IX) return fail('You already care for every species.');
    if (z.money < z.timePrice) return fail(`You need ${money(z.timePrice)} to fund this research.`);
    z.money -= z.timePrice;
    const r = Math.random() + Math.random() + Math.random() + Math.random();
    const gained = Math.round(z.timeSecs * r * 0.5);
    z.time += gained;
    z.timeSecs = Math.round(z.timeSecs * 1.1);
    z.timePrice = Math.round(z.timePrice * 1.2);
    return this.done(1, ok({ gained }));
  }

  buyVisitors() {
    const z = this.zoo;
    if (z.money < z.visitorsBuyCost) return fail(`You need ${money(z.visitorsBuyCost)} to attract more visitors.`);
    z.money -= z.visitorsBuyCost;
    const added = Math.round(z.visitorsBuy);
    z.visitorsTotal += added;
    z.visitorsBuy = Math.round(z.visitorsBuy * 1.1);
    z.visitorsBuyCost = Math.round(z.visitorsBuyCost * 1.2);
    return this.done(10, ok({ added }));
  }

  buyVisitorsTime() {
    const z = this.zoo;
    if (z.visitorsTime === 1) return fail('Visitors already arrive every second.');
    if (z.money < z.visitorsTimeCost) return fail(`You need ${money(z.visitorsTimeCost)} for this campaign.`);
    z.money -= z.visitorsTimeCost;
    z.visitorsTime--;
    z.visitorsTimeCost = Math.round(z.visitorsTimeCost * 1.2);
    return this.done(10);
  }

  currentOffer() {
    const z = this.zoo;
    if (!z.offerActive) return null;
    return {
      get: z.offerGetSpecies,
      getNumber: z.offerGetNumber,
      give: z.offerGiveSpecies,
      giveNumber: z.offerGiveNumber,
    };
  }

  declineOffer() {
    const z = this.zoo;
    z.offerNext = 0;
    z.offerActive = 0;
    return this.done(1);
  }

  acceptOffer() {
    const z = this.zoo;
    const give = z.offerGiveSpecies;
    const giveNumber = z.offerGiveNumber;
    const get = z.offerGetSpecies;
    const getNumber = z.offerGetNumber;
    if (z.animals[give].own < giveNumber) {
      return fail(`You don't have enough ${SPECIES[give].plural} to accept that offer.`);
    }
    z.animals[give].own -= giveNumber;
    z.animals[give].sold += giveNumber;
    z.animals[get].own += getNumber;
    z.animals[get].bought += getNumber;
    z.offerAccepted++;
    z.offerNext = 0;
    z.offerActive = 0;
    z.total = z.total + getNumber - giveNumber;
    this.log('offer', `You took ${getNumber} ${SPECIES[get].plural} in exchange for ${giveNumber} ${SPECIES[give].plural}.`, { species: get });
    return this.done(1);
  }

  // Checks whether a new zoo can be started and what the bonus would be.
  newZooPreview() {
    const z = this.zoo;
    this.fixDebt();
    if (z.debt > 0) {
      return fail(`You can't start a new zoo until your current zoo is out of debt (you owe ${money(z.debt)}).`);
    }
    const species = this.censusSpecies();
    const need = this.zooNum() <= 1 ? 12 : 6;
    if (species < need) {
      return fail(`You can't start a new zoo until your ${this.zooNum() <= 1 ? 'first' : 'current'} zoo has at least ${need} species (you have ${species}).`);
    }
    const badges = calculateBadges(z).length;
    return ok({
      badges,
      resetBadges: z.resetBadges,
      multiplier: 1 + (badges * 2) / 1000,
    });
  }

  startNewZoo() {
    const preview = this.newZooPreview();
    if (!preview.ok) return preview;
    const old = this.zoo;
    const fresh = createZoo();
    fresh.resetBadges = old.resetBadges + preview.badges * 2;
    fresh.animals.forEach((a, i) => {
      a.birthRate = BASE_BIRTH_RATES[i] / preview.multiplier;
    });
    this.zoo = fresh;
    this.needSave = 0;
    this.save();
    this.afterLoad();
    this.log('reset', `You opened a new zoo! Birth rates are ${preview.multiplier.toFixed(3)}x better.`);
    return ok();
  }

  // ----------------------------------------------------------------- tick
  getFined(id) {
    const z = this.zoo;
    const a = z.animals[id];
    z.fines++;
    let fine = z.creditLimit / 10;
    let kind;
    if (z.money > fine * 5) {
      // Immediate garnishment of double the fine (covers court fees).
      fine *= 2;
      z.money -= fine;
      this.setSave(1);
      kind = 'money';
    } else if (a.own >= 5) {
      // They take some of your animals.
      a.own -= 5;
      fine = 0;
      kind = 'animals';
    } else {
      // No money or animals: the fine is added to your debt.
      z.debt += fine;
      kind = 'debt';
    }
    const text = kind === 'animals'
      ? `The Animal Bureau removed 5 of your ${SPECIES[id].plural} for overcrowding.`
      : `You were fined ${money(fine)} for overcrowding in your ${SPECIES[id].name} habitat.`;
    this.log('fine', text, { species: id });
    this.emit('fine', { species: id, kind, amount: fine });
  }

  tick() {
    const z = this.zoo;
    const births = [];
    const deaths = [];

    // Interest on debt every ten seconds.
    z.interestCounter++;
    if (z.interestCounter === 10) {
      const was = z.debt;
      z.interestCounter = 0;
      z.debt *= z.interestRate;
      this.fixDebt();
      this.setSave(z.debt !== was ? 1 : 10);
    }

    // Visitors pay $1 per species they can see.
    z.visitorsCounter++;
    if (z.visitorsCounter >= z.visitorsTime && z.visitorsTotal > 0) {
      const income = z.visitorsTotal * this.censusSpecies();
      z.visitorsCounter = 0;
      z.money += income;
      this.setSave(10);
      this.emit('visitors', { income });
      if (z.visitorsLog === 0) {
        z.visitorsLog = 1;
        this.log('visitors', 'Your zoo received its first visitors!');
      }
    }

    // New species become available over time.
    z.time++;
    for (let i = z.speciesShown; i < z.animals.length; i++) {
      if (z.time >= SPECIES[i].wait) {
        z.speciesShown = i + 1;
        this.log('species', `${this.certifiedPhrase()} ${SPECIES[i].plural}!`, { species: i });
        this.emit('species', { id: i });
      }
    }

    // Births and deaths.
    for (let i = 0; i < z.animals.length; i++) {
      const a = z.animals[i];
      if (a.own >= a.maxPop) a.own = a.maxPop;
      if (a.own > 1 && a.own < a.maxPop) {
        const ow = a.own;
        if (Math.floor(Math.random() * (ow + a.birthRate)) <= ow) {
          a.own = Math.min(a.own + 1, a.maxPop);
          z.total++;
          a.born++;
          births.push(i);
        }
        if (Math.floor(Math.random() * (ow * 2 + a.deathRate)) <= ow) {
          a.own--;
          z.total--;
          a.dead++;
          deaths.push(i);
        }
      }
      if (a.own === a.maxPop && Math.floor(Math.random() * 100000) === 12345) {
        this.getFined(i);
      }
    }

    // Offers from the Incremental Office for Animal Exchange.
    if (z.offerNext === 0) {
      z.offerNext = z.time + 111 + Math.round(Math.random() * 111);
    }
    if (z.time >= z.offerNext && z.offerActive === 0) {
      let getSpecies = 0;
      let giveSpecies = 0;
      if (z.animals[0].own === 0 || z.animals[1].own === 0) {
        z.offerNext = 0;
      } else {
        for (let i = z.animals.length - 1; i > 0; i--) {
          if (z.animals[i].own > 0) {
            getSpecies = i;
            giveSpecies = i - 1;
            break;
          }
        }
        if (giveSpecies === 0) z.offerNext = 0;
      }
      if (z.offerNext > 0) {
        const giveOwn = z.animals[giveSpecies].own;
        z.offerGetSpecies = getSpecies;
        z.offerGetNumber = Math.ceil(Math.random() * 10);
        z.offerGiveSpecies = giveSpecies;
        z.offerGiveNumber = giveOwn >= 10 ? Math.ceil(Math.random() * 10) : Math.ceil(Math.random() * giveOwn);
        z.offerActive = 1;
        this.setSave(1);
        this.emit('offer', this.currentOffer());
      }
    }

    // Records.
    for (const a of z.animals) {
      if (a.own > a.maxOwn) a.maxOwn = a.own;
    }
    if (z.total > z.maxTotal) z.maxTotal = z.total;

    // Achievements.
    const badges = calculateBadges(z);
    const fresh = badges.filter((id) => !this.earned.has(id));
    z.badges = badges;
    if (fresh.length) {
      fresh.forEach((id) => this.earned.add(id));
      this.emit('badges', fresh);
    }

    this.refreshCreditLimit();

    if (this.needSave > 0) {
      this.needSave--;
      if (this.needSave <= 0) {
        this.needSave = 0;
        this.save();
      }
    }

    this.emit('tick', { births, deaths });
    this.emit('update');
  }
}


