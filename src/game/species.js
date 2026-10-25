// Static species catalogue. Values are identical to the original game.
// `wait` is the number of played seconds before the species becomes available.

export const OMEGA_BR = 200000;

export const SPECIES = [
  { name: 'Meerkat', plural: 'meerkats', bgc: '#ffc', wait: 0,
    quote: "Meerkat... it's what's for dinner!",
    who: 'Uncle Max - The Lion King' },
  { name: 'Peacock', plural: 'peacocks', bgc: '#72f1ff', wait: 0,
    quote: "Look at the peacock; it's beautiful if you look at it from the front."
      + ' But if you look at it from behind, you discover the truth... Whoever'
      + ' gives in to such self-absorbed vanity has huge misery hiding inside them.',
    who: 'Pope Francis' },
  { name: 'Chameleon', plural: 'chameleons', bgc: '#cfc', wait: 120,
    quote: 'A divorce lawyer is a chameleon with a law book.',
    who: 'Marvin Mitchelson' },
  { name: 'Beaver', plural: 'beavers', bgc: '#f6f3ca', wait: 480,
    quote: 'Beavers do better work than the Corps of Engineers.',
    who: 'Mike Todd' },
  { name: 'Flamingo', plural: 'flamingos', bgc: '#ecc', wait: 900,
    quote: 'The chief difficulty Alice found at first was in managing her flamingo',
    who: "Lewis Carroll - Alice's Adventures in Wonderland" },
  { name: 'Otter', plural: 'otters', bgc: '#ccdae2', wait: 1500,
    quote: 'Otters are natural experimenters.',
    who: 'Karen Pryor, Lads Before the Wind: Diary of a Dolphin Trainer' },
  { name: 'Penguin', plural: 'penguins', bgc: '#dbdbdd', wait: 2300,
    quote: "I've never been in love, but if a penguin can find a soul mate, I'm"
      + ' sure I can, too.',
    who: 'Rebekah Crane, Playing Nice' },
  { name: 'Snake', plural: 'snakes', bgc: '#ffe5b3', wait: 3600,
    quote: "Like Indiana Jones, I don't like snakes - though that might lead some"
      + " to ask why I'm in politics.",
    who: 'Theresa May' },
  { name: 'Turtle', plural: 'turtles', bgc: '#eeda91', wait: 5000,
    quote: 'And the turtles, of course...all the turtles are free, as turtles and,'
      + ' maybe, all creatures should be.',
    who: 'Dr. Seuss, Yertle the Turtle and Other Stories' },
  { name: 'Tapir', plural: 'tapirs', bgc: '#d2d7c0', wait: 6500,
    quote: 'When all of the animals heard that Mrs. Tapir was going extinct,'
      + ' they decided to pay her a visit and see if they could offer her'
      + ' some advice.',
    who: 'Ze Frank, True Facts About the Tapir' },
  { name: 'Crocodile', plural: 'crocodiles', bgc: '#b5f4ea', wait: 8400,
    quote: 'An appeaser is one who feeds a crocodile, hoping it will eat him last.',
    who: 'Winston Churchill' },
  { name: 'Monkey', plural: 'monkeys', bgc: '#e5ccb8', wait: 11000,
    quote: "Just 'cause you got the monkey off your back doesn't mean the circus"
      + ' has left town.',
    who: 'George Carlin' },
  { name: 'Seal', plural: 'seals', bgc: '#fcefc2', wait: 14000,
    quote: 'Writers are a little below clowns and a little above trained seals.',
    who: 'John Steinbeck' },
  { name: 'Kangaroo', plural: 'kangaroos', bgc: '#e1e2e4', wait: 18000,
    quote: "Any time you're near a kangaroo, it's a close call.",
    who: "Jerry O'Connell" },
  { name: 'Anteater', plural: 'anteaters', bgc: '#ced3e9', wait: 24000,
    quote: 'The existence of [the anteater] demonstrates that thinking 71 percent'
      + " of the time, as ants do, won't prevent you from being eaten.",
    who: "John Ralston Saul, The Doubter's Companion" },
  { name: 'Eagle', plural: 'eagles', bgc: '#89c7de', wait: 33000,
    quote: "'Farewell,' they cried, 'Wherever you fare till your eyries receive"
      + " you at the journey's end!' That is the polite thing to say among eagles.",
    who: 'J.R.R. Tolkien, The Annotated Hobbit: The Hobbit, or, There and Back Again' },
  { name: 'Okapi', plural: 'okapis', bgc: '#ffe8c2', wait: 42000,
    quote: "'Of all wild animals, the okapi is considered the shyest, the most subtle.",
    who: 'Time Magazine' },
  { name: 'Ostrich', plural: 'ostriches', bgc: '#fcdcc7', wait: 60000,
    quote: 'Any fool can turn a blind eye but who knows what the ostrich sees in the sand.',
    who: 'Samuel Beckett, Murphy' },
  { name: 'Antelope', plural: 'antelopes', bgc: '#f1e7e5', wait: 100000,
    quote: "Set the gearshift for the high gear of your soul, you've got to run like an"
      + ' antelope out of control!',
    who: 'Trey Anastasio' },
  { name: 'Zebra', plural: 'zebras', bgc: '#e5e3d6', wait: 200000,
    quote: "When a zebra's in the zone, leave him alone.",
    who: 'Marty the Zebra, Madagascar' },
  { name: 'Condor', plural: 'condors', bgc: '#ffc66a', wait: 600000,
    quote: "Give me a condor's quill! Give me Vesuvius crater for an inkstand!",
    who: 'Herman Melville' },
  { name: 'Wolf', plural: 'wolves', bgc: '#cacecd', wait: 1000000,
    quote: 'A gentleman is simply a patient wolf.',
    who: 'Lana Turner' },
  { name: 'Jaguar', plural: 'jaguars', bgc: '#c8b9b2', wait: 2000000,
    quote: 'The jaguar is the third-largest feline after the tiger and the lion,'
      + ' and the largest in the Western Hemisphere.',
    who: 'Wikipedia' },
  { name: 'Bear', plural: 'bears', bgc: '#d5fb98', wait: 4000000,
    quote: 'Be cautious of bears at all times, even when being mauled by a tiger.',
    who: 'Craig Benzine' },
  { name: 'Hippo', plural: 'hippos', bgc: '#e7d6dc', wait: 7000000,
    quote: 'There is an eagle in me that wants to soar, and there is a hippopotamus'
      + ' in me that wants to wallow in the mud.',
    who: 'Carl Sandburg' },
  { name: 'Tiger', plural: 'tigers', bgc: '#e5c29c', wait: 10000000,
    quote: 'Do not blame God for having created the tiger, but thank him for not'
      + ' having given it wings',
    who: 'Indian proverb' },
  { name: 'Giraffe', plural: 'giraffes', bgc: '#d9dde0', wait: 15000000,
    quote: 'God is really only another artist. He invented the giraffe, the elephant,'
      + ' and the cat. He has no real style. He just keeps on trying other things.',
    who: 'Pablo Picasso' },
  { name: 'Shark', plural: 'sharks', bgc: '#e3d1bd', wait: 20000000,
    quote: 'If I swim in the ocean, I have a shark thought. Not a bad one, but just'
      + ' a little one.',
    who: 'Tea Leoni' },
  { name: 'Rhino', plural: 'rhinos', bgc: '#ccb8a0', wait: 30000000,
    quote: "People can have rhinoceros skin, but there's a point when something's"
      + ' going to hurt you.',
    who: 'Janet Jackson' },
  { name: 'Gorilla', plural: 'gorillas', bgc: '#bfbfbf', wait: 40000000,
    quote: "It's a little like wrestling a gorilla. You don't quit when you're tired"
      + ' - you quit when the gorilla is tired.',
    who: 'Robert Strauss' },
  { name: 'Lion', plural: 'lions', bgc: '#e2e0b9', wait: 72000000,
    quote: 'Only in art will the lion lie down with the lamb, and the rose grow'
      + ' without thorn.',
    who: 'Martin Amis' },
  { name: 'Elephant', plural: 'elephants', bgc: '#dbdbdb', wait: 120000000,
    quote: 'One morning I shot an elephant in my pajamas. How he got into my pajamas'
      + " I'll never know.",
    who: 'Groucho Marx' },
  { name: 'Panda', plural: 'pandas', bgc: '#fdf7d3', wait: 180000000,
    quote: "So, you're telling me the zoo commissioned you to make a zombie panda"
      + ' in order to avoid a potential international incident.',
    who: 'Lish McBride, Hold Me Closer, Necromancer' },
  { name: 'Dolphin', plural: 'dolphins', bgc: '#56cbf6', wait: 270000000,
    quote: 'No dolphin who inhabits one of those aquariums or one of those marine'
      + ' lands can be considered normal.',
    who: 'Jacques-Yves Cousteau' },
  { name: 'Orca', plural: 'orcas', bgc: '#cfd7d9', wait: 500000000,
    quote: 'If you were to make little fishes talk, they would talk like whales.',
    who: 'Oliver Goldsmith' },

  // Sentinel species that never unlocks; keeps "next species" maths in range.
  { name: 'Dummy', plural: 'dummies', bgc: '#cfd7d9', wait: 5.0e20,
    quote: 'Wait for it.',
    who: 'Ximenez' },
];

// Index of the sentinel species. Real species are 0 .. OMEGA_IX - 1.
export const OMEGA_IX = SPECIES.length - 1;

// Starting economy for each species in a brand new zoo.
export const BASE_STATS = [
  { birthRate:   200, deathRate:   600, buyPrice:                  10 }, //  0 Meerkat
  { birthRate:   300, deathRate:   650, buyPrice:                  30 }, //  1 Peacock
  { birthRate:   400, deathRate:   700, buyPrice:                  90 }, //  2 Chameleon
  { birthRate:   540, deathRate:   750, buyPrice:                 250 }, //  3 Beaver
  { birthRate:   680, deathRate:   800, buyPrice:                 750 }, //  4 Flamingo
  { birthRate:   820, deathRate:   900, buyPrice:                2000 }, //  5 Otter
  { birthRate:  1000, deathRate:  1000, buyPrice:                6000 }, //  6 Penguin
  { birthRate:  1180, deathRate:  1100, buyPrice:               18000 }, //  7 Snake
  { birthRate:  1360, deathRate:  1200, buyPrice:               50000 }, //  8 Turtle
  { birthRate:  1580, deathRate:  1300, buyPrice:              150000 }, //  9 Tapir
  { birthRate:  1800, deathRate:  1500, buyPrice:              450000 }, // 10 Crocodile
  { birthRate:  2050, deathRate:  1700, buyPrice:             1300000 }, // 11 Monkey
  { birthRate:  2300, deathRate:  1900, buyPrice:             4000000 }, // 12 Seal
  { birthRate:  2600, deathRate:  2100, buyPrice:            12000000 }, // 13 Kangaroo
  { birthRate:  3000, deathRate:  2400, buyPrice:            40000000 }, // 14 Anteater
  { birthRate:  3500, deathRate:  2600, buyPrice:           120000000 }, // 15 Eagle
  { birthRate:  4000, deathRate:  2800, buyPrice:           400000000 }, // 16 Okapi
  { birthRate:  4500, deathRate:  3000, buyPrice:          1500000000 }, // 17 Ostrich
  { birthRate:  5000, deathRate:  3300, buyPrice:          5000000000 }, // 18 Antelope
  { birthRate:  5600, deathRate:  3600, buyPrice:         15000000000 }, // 19 Zebra
  { birthRate:  6200, deathRate:  3900, buyPrice:         50000000000 }, // 20 Condor
  { birthRate:  7000, deathRate:  4200, buyPrice:        200000000000 }, // 21 Wolf
  { birthRate:  8000, deathRate:  4600, buyPrice:        600000000000 }, // 22 Jaguar
  { birthRate:  9200, deathRate:  5000, buyPrice:       2000000000000 }, // 23 Bear
  { birthRate: 10500, deathRate:  5500, buyPrice:       6000000000000 }, // 24 Hippo
  { birthRate: 12000, deathRate:  6000, buyPrice:      20000000000000 }, // 25 Tiger
  { birthRate: 14000, deathRate:  6500, buyPrice:      75000000000000 }, // 26 Giraffe
  { birthRate: 16000, deathRate:  7000, buyPrice:     300000000000000 }, // 27 Shark
  { birthRate: 18500, deathRate:  7500, buyPrice:    1200000000000000 }, // 28 Rhino
  { birthRate: 21000, deathRate:  8000, buyPrice:    5000000000000000 }, // 29 Gorilla
  { birthRate: 24000, deathRate:  8500, buyPrice:   20000000000000000 }, // 30 Lion
  { birthRate: 27000, deathRate:  9000, buyPrice:   80000000000000000 }, // 31 Elephant
  { birthRate: 31000, deathRate:  9500, buyPrice:  300000000000000000 }, // 32 Panda
  { birthRate: 35000, deathRate: 10000, buyPrice: 1200000000000000000 }, // 33 Dolphin
  { birthRate: 40000, deathRate: 10500, buyPrice: 5000000000000000000 }, // 34 Orca
  { birthRate: OMEGA_BR, deathRate: 12000, buyPrice: 5000000000000000000 }, // 35 sentinel
];

// Base birth rates used when starting a new zoo (prestige reset).
export const BASE_BIRTH_RATES = BASE_STATS.map((s) => s.birthRate);

export const PHOTO_CREDITS = [
  ['Meerkat', 'Neil McIntosh'], ['Peacock', 'public domain (Wikimedia Commons)'],
  ['Chameleon', 'William Warby'], ['Beaver', 'dcJohn'],
  ['Flamingo', 'public domain (Wikimedia Commons)'], ['Otter', 'Michael Malz'],
  ['Penguin', 'Paul Boxley'], ['Snake', 'Linda Tanner'], ['Turtle', 'Julien GONG Min'],
  ['Tapir', 'NAPARAZZI'], ['Crocodile', 'Radek Vitoul'], ['Monkey', 'Michael Goodine'],
  ['Seal', 'Yuri Levchenko'], ['Anteater', 'cuatrok77'], ['Kangaroo', 'Scott Calleja'],
  ['Eagle', 'Pat Bell'], ['Okapi', 'Trisha Shears'], ['Ostrich', 'William Warby'],
  ['Antelope', 'Alfo23'], ['Zebra', 'Martin Pettitt'],
  ['Condor', 'USFWS Pacific Southwest Region'], ['Wolf', 'Alois Staudacher'],
  ['Jaguar', 'Alois Staudacher'], ['Bear', 'Moyan Brenn'], ['Hippo', 'William Warby'],
  ['Tiger', 'Alois Staudacher'], ['Giraffe', 'Alois Staudacher'], ['Shark', 'Ed Schipul'],
  ['Rhino', 'macinate'], ['Gorilla', 'Ruben Undheim'], ['Lion', 'Peter Harrison'],
  ['Elephant', 'Arran ET'], ['Panda', 'George Lu'], ['Dolphin', 'Gordon Wrigley'],
  ['Orca', 'Opals-On-Black.com'],
];

const BASE = import.meta.env.BASE_URL;
export const img = (name) => `${BASE}img/${name}`;
export const speciesImage = (id) => img(`${id}.jpg`);
export const speciesAltImage = (id) => img(`${id}f.jpg`);
