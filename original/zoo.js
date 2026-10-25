var VERSION = "Incremental Zoo 20190915";

var IZ = {};

var needSave = 0;
var omegaBR = 200000;

// Add commas to numbers for display
IZ.commas = function(number) {
  number = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return number;
}

// Format a dollar figure with tons of zeros at the end (if needed)
IZ.bigbucks = function(n)
{
  var extra_zeros = "";
  while (n > 1.0e15) {
    n = n / 1000.0;
    extra_zeros = ",000" + extra_zeros;
  }
  return (IZ.commas(Math.floor(n)) + extra_zeros);
}

IZ.init = function() {

  // general
  IZ.Zoo = {
    money: 0,
    debt: 0,
    interestRate: 1.00015,
    interestCounter: 0,
    priceIncrement: 1.50,
    total: 0,
    maxTotal: 0,
    animals: [],
    animalsN: 0,
    sellMarkdown: 0.8,
    creditLimit: 50,
    brBoosts: 0,
    brBoostEffect: 0.90, // changes denominator, less is better
    bsBoosts: 0,
    bsBoostEffect: 1.10, // increases value of animals (both to buy and to sell)
    drBoosts: 0,
    drBoostEffect: 1.10, // changes denominator, more is better
    enBoosts: 0,
    badges: [],
    time: 0,
    timeSecs: 10, //amount of time you can buy
    timeSecsIncrement: 1.1,
    timePrice: 10000,
    timePriceIncrement: 1.25,
    offerNext: 0, // how long until next offer
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
    fines: 0
  }

  // animals
  IZ.animals = [];
  IZ.animalsN = 0;
  IZ.Animal = function(args) {
    this.id = IZ.animalsN;
    this.name = args.name;
    this.plural = args.plural;
    this.image = "img/" + IZ.animalsN + ".jpg";
    this.quote = args.quote;
    this.who = args.who;
    this.bgc = args.bgc; // background color
    this.wait = args.wait;
    IZ.animals[IZ.animalsN] = this;
    IZ.animalsN++;
  }
  // species
  new IZ.Animal ({name: "Meerkat", plural: "meerkats", bgc: "#ffc", wait: 0,
    quote:"Meerkat... it's what's for dinner!",
    who:"Uncle Max - The Lion King"});
  new IZ.Animal ({name: "Peacock", plural: "peacocks", bgc: "#72f1ff", wait: 0,
    quote:"Look at the peacock; it's beautiful if you look at it from the front."
       + " But if you look at it from behind, you discover the truth... Whoever"
       + " gives in to such self-absorbed vanity has huge misery hiding inside them.",
    who:"Pope Francis"});
  new IZ.Animal ({name: "Chameleon", plural: "chameleons", bgc: "#cfc", wait: 120,
    quote:"A divorce lawyer is a chameleon with a law book.",
    who:"Marvin Mitchelson"});
  new IZ.Animal ({name: "Beaver", plural: "beavers", bgc: "#f6f3ca", wait: 480,
    quote:"Beavers do better work than the Corps of Engineers.",
    who:"Mike Todd"});
  new IZ.Animal ({name: "Flamingo", plural: "flamingos", bgc: "#ecc", wait: 900,
    quote:"The chief difficulty Alice found at first was in managing her flamingo",
    who:"Lewis Carroll - Alice's Adventures in Wonderland"});
  new IZ.Animal ({name: "Otter", plural: "otters", bgc: "#ccdae2", wait: 1500,
    quote:"Otters are natural experimenters.",
    who:"Karen Pryor, Lads Before the Wind: Diary of a Dolphin Trainer"});
  new IZ.Animal ({name: "Penguin", plural: "penguins", bgc: "#dbdbdd", wait: 2300,
    quote:"I've never been in love, but if a penguin can find a soul mate, I'm"
       + " sure I can, too.",
    who:"Rebekah Crane, Playing Nice"});
  new IZ.Animal ({name: "Snake", plural: "snakes", bgc: "#ffe5b3", wait: 3600,
    quote:"Like Indiana Jones, I don't like snakes - though that might lead some"
       + " to ask why I'm in politics.",
    who:"Theresa May"});
  new IZ.Animal ({name: "Turtle", plural: "turtles", bgc: "#eeda91", wait: 5000,
    quote:"And the turtles, of course...all the turtles are free, as turtles and,"
       + " maybe, all creatures should be.",
    who:"Dr. Seuss, Yertle the Turtle and Other Stories"});
  new IZ.Animal ({name: "Tapir", plural: "tapirs", bgc: "#d2d7c0", wait: 6500,
    quote:"When all of the animals heard that Mrs. Tapir was going extinct,"
       + " they decided to pay her a visit and see if they could offer her"
       + " some advice.",
    who:"Ze Frank, True Facts About the Tapir"});
  new IZ.Animal ({name: "Crocodile", plural: "crocodiles", bgc: "#b5f4ea", wait: 8400,
    quote:"An appeaser is one who feeds a crocodile, hoping it will eat him last.",
    who:"Winston Churchill"});
  new IZ.Animal ({name: "Monkey", plural: "monkeys", bgc: "#e5ccb8", wait: 11000,
    quote:"Just 'cause you got the monkey off your back doesn't mean the circus"
       + " has left town.",
    who:"George Carlin"});
  new IZ.Animal ({name: "Seal", plural: "seals", bgc: "#fcefc2", wait: 14000,
    quote:"Writers are a little below clowns and a little above trained seals.",
    who:"John Steinbeck"});
  new IZ.Animal ({name: "Kangaroo", plural: "kangaroos", bgc: "#e1e2e4", wait: 18000,
    quote:"Any time you're near a kangaroo, it's a close call.",
    who:"Jerry O'Connell"});
  new IZ.Animal ({name: "Anteater", plural: "anteaters", bgc: "#ced3e9", wait: 24000,
    quote:"The existence of [the anteater] demonstrates that thinking 71 percent"
       + " of the time, as ants do, won't prevent you from being eaten.",
    who:"John Ralston Saul, The Doubter's Companion"});
  new IZ.Animal ({name: "Eagle", plural: "eagles", bgc: "#89c7de", wait: 33000,
    quote:"'Farewell,' they cried, 'Wherever you fare till your eyries receive"
       + " you at the journey's end!' That is the polite thing to say among eagles.",
    who:"J.R.R. Tolkien, The Annotated Hobbit: The Hobbit, or, There and Back Again"});
  new IZ.Animal ({name: "Okapi", plural: "okapis", bgc: "#ffe8c2", wait: 42000,
    quote:"'Of all wild animals, the okapi is considered the shyest, the most subtle.",
    who:"Time Magazine"});
  new IZ.Animal ({name: "Ostrich", plural: "ostriches", bgc: "#fcdcc7", wait: 60000,
    quote:"Any fool can turn a blind eye but who knows what the ostrich sees in the sand.",
    who:"Samuel Beckett, Murphy"});
  new IZ.Animal ({name: "Antelope", plural: "antelopes", bgc: "#f1e7e5", wait: 100000,
    quote:"Set the gearshift for the high gear of your soul, you've got to run like an"
       + " antelope out of control!",
    who:"Trey Anastasio"});
  new IZ.Animal ({name: "Zebra", plural: "zebras", bgc: "#e5e3d6", wait: 200000,
    quote:"When a zebra's in the zone, leave him alone.",
    who:"Marty the Zebra, Madagascar"});
  new IZ.Animal ({name: "Condor", plural: "condors", bgc: "#ffc66a", wait: 600000,
    quote:"Give me a condor's quill! Give me Vesuvius crater for an inkstand!",
    who:"Herman Melville"});
  new IZ.Animal ({name: "Wolf", plural: "wolves", bgc: "#cacecd", wait: 1000000,
    quote:"A gentleman is simply a patient wolf.",
    who:"Lana Turner"});
  new IZ.Animal ({name: "Jaguar", plural: "jaguars", bgc: "#c8b9b2", wait: 2000000,
    quote:"The jaguar is the third-largest feline after the tiger and the lion,"
       + " and the largest in the Western Hemisphere.",
    who:"Wikipedia"});
  new IZ.Animal ({name: "Bear", plural: "bears", bgc: "#d5fb98", wait: 4000000,
    quote:"Be cautious of bears at all times, even when being mauled by a tiger.",
    who:"Craig Benzine"});
  new IZ.Animal ({name: "Hippo", plural: "hippos", bgc: "#e7d6dc", wait: 7000000,
    quote:"There is an eagle in me that wants to soar, and there is a hippopotamus"
       + " in me that wants to wallow in the mud.",
    who:"Carl Sandburg"});
  new IZ.Animal ({name: "Tiger", plural: "tigers", bgc: "#e5c29c", wait: 10000000,
    quote:"Do not blame God for having created the tiger, but thank him for not"
       + " having given it wings",
    who:"Indian proverb"});
  new IZ.Animal ({name: "Giraffe", plural: "giraffes", bgc: "#d9dde0", wait: 15000000,
    quote:"God is really only another artist. He invented the giraffe, the elephant,"
       + " and the cat. He has no real style. He just keeps on tryi ng other things.",
    who:"Pablo Picasso"});
  new IZ.Animal ({name: "Shark", plural: "sharks", bgc: "#e3d1bd", wait: 20000000,
    quote:"If I swim in the ocean, I have a shark thought. Not a bad one, but just"
       + " a little one.",
    who:"Tea Leoni"});
  new IZ.Animal ({name: "Rhino", plural: "rhinos", bgc: "#ccb8a0", wait: 30000000,
    quote:"People can have rhinoceros skin, but there's a point when something's"
       + " going to hurt you.",
    who:"Janet Jackson"});
  new IZ.Animal ({name: "Gorilla", plural: "gorillas", bgc: "#bfbfbf", wait: 40000000,
    quote:"It's a little like wrestling a gorilla. You don't quit when you're tired"
       + " - you quit when the gorilla is tired.",
    who:"Robert Strauss"});
  new IZ.Animal ({name: "Lion", plural: "lions", bgc: "#e2e0b9", wait: 72000000,
    quote:"Only in art will the lion lie down with the lamb, and the rose grow"
       + " without thorn.",
    who:"Martin Amis"});
  new IZ.Animal ({name: "Elephant", plural: "elephants", bgc: "#dbdbdb", wait: 120000000,
    quote:"One morning I shot an elephant in my pajamas. How he got into my pajamas"
       + " I'll never know.",
    who:"Groucho Marx"});
  new IZ.Animal ({name: "Panda", plural: "pandas", bgc: "#fdf7d3", wait: 180000000,
    quote:"So, you're telling me the zoo commissioned you to make a zombie panda"
       + " in order to avoid a potential international incident.",
    who:"Lish McBride, Hold Me Closer, Necromancer"});
  new IZ.Animal ({name: "Dolphin", plural: "dolphins", bgc: "#56cbf6", wait: 270000000,
    quote:"No dolphin who inhabits one of those aquariums or one of those marine"
       + " lands can be considered normal.",
    who:"Jacques-Yves Cousteau"});
  new IZ.Animal ({name: "Orca", plural: "orcas", bgc: "#cfd7d9", wait: 500000000,
    quote:"If you were to make little fishes talk, they would talk like whales.",
    who:"Oliver Goldsmith"});

  new IZ.Animal ({name: "Dummy", plural: "dummies", bgc: "#cfd7d9", wait: 5.0e20,
    quote:"Wait for it.",
    who:"Ximenez"});

  IZ.buyRequire = function(id) {
    if (id < 2) {
      return "";
    }
    return ("You must have " + (100 * (id-1)) + " " + IZ.animals[id-2].plural
         + " to buy the first " + IZ.animals[id].name + ".");
  }

  // Format a number to something with "K" (thousand), "M", "B", "T"
  // (million, billion, trillion), and scientific notation above that
  IZ.fmt = function(n) {
    if (n < 1.0e4) {
      return (n.toFixed(2));
    } else if (n < 1.0e6) {
      return ((n/1000).toFixed(2) + " K");
    } else if (n < 1.0e9) {
      return ((n/1.0e6).toFixed(2) + " M");
    } else if (n < 1.0e12) {
      return ((n/1.0e9).toFixed(2) + " B");
    } else if (n < 1.0e15) {
      return ((n/1.0e12).toFixed(2) + " T");
    } else {
      return(n.toExponential(3));
    }
  }

  // Array with base birth rates for reset system
  IZ.baseBirthRates = [
     200,  300,  400,  540,  680,  820, 1000, 1180, 1360, 1580,
    1800, 2050, 2300, 2600, 3000, 3500, 4000, 4500, 5000, 5600,
    6200, 7000, 8000, 9200,10500,12000,14000,16000,18500,21000,
   24000,27000,31000,35000,40000,omegaBR
  ];

  IZ.Zoo.Animal = function(args) {
    var br2 = Math.floor(200.0 * Math.pow(1.1686, IZ.Zoo.animalsN));
    var dr2 = Math.floor(600.0 * Math.pow(1.0878, IZ.Zoo.animalsN));
    var bp2 = Math.floor(10.0 * Math.pow(3.315, IZ.Zoo.animalsN));
    console.log("N:" + IZ.Zoo.animalsN
      + ", br:" + args.birthRate + " br2:" + br2
      + ", dr:" + args.deathRate + " dr2:" + dr2
      + ", bp:" + args.buyPrice + " bp2:" + bp2);
    this.id = IZ.Zoo.animalsN;
    this.birthRate = args.birthRate;
    this.deathRate = args.deathRate;
    this.buyPrice = args.buyPrice;
    this.brPrice = args.buyPrice; // birth rate boost price - changes later
    this.brCount = 0
    this.drPrice = args.buyPrice; // death rate lowering price - changes later
    this.drCount = 0
    this.bsPrice =  args.buyPrice; // buy & sell boost price - changes later
    this.bsCount = 0
    this.enPrice = args.buyPrice * 10; // habitat price - changes later
    this.enCount = 0
    this.own = 0;
    this.maxOwn = 0;
    this.bought = 0;
    this.born = 0;
    this.dead = 0;
    this.sold = 0;
    this.maxPop = 100;
    this.maxPopBought = 0;
    IZ.Zoo.animals[IZ.Zoo.animalsN] = this;
    IZ.Zoo.animalsN++;
  }
  // species
  new IZ.Zoo.Animal ({birthRate:   200, deathRate:   600, buyPrice:                  10}); //  0 Meerkat
  new IZ.Zoo.Animal ({birthRate:   300, deathRate:   650, buyPrice:                  30}); //  1 Peacock
  new IZ.Zoo.Animal ({birthRate:   400, deathRate:   700, buyPrice:                  90}); //  2 Chameleon
  new IZ.Zoo.Animal ({birthRate:   540, deathRate:   750, buyPrice:                 250}); //  3 Beaver
  new IZ.Zoo.Animal ({birthRate:   680, deathRate:   800, buyPrice:                 750}); //  4 Flamingo
  new IZ.Zoo.Animal ({birthRate:   820, deathRate:   900, buyPrice:                2000}); //  5 Otter
  new IZ.Zoo.Animal ({birthRate:  1000, deathRate:  1000, buyPrice:                6000}); //  6 Penguin
  new IZ.Zoo.Animal ({birthRate:  1180, deathRate:  1100, buyPrice:               18000}); //  7 Snake
  new IZ.Zoo.Animal ({birthRate:  1360, deathRate:  1200, buyPrice:               50000}); //  8 Turtle
  new IZ.Zoo.Animal ({birthRate:  1580, deathRate:  1300, buyPrice:              150000}); //  9 Tapir
  new IZ.Zoo.Animal ({birthRate:  1800, deathRate:  1500, buyPrice:              450000}); // 10 Crocodile
  new IZ.Zoo.Animal ({birthRate:  2050, deathRate:  1700, buyPrice:             1300000}); // 11 Monkey
  new IZ.Zoo.Animal ({birthRate:  2300, deathRate:  1900, buyPrice:             4000000}); // 12 Seal
  new IZ.Zoo.Animal ({birthRate:  2600, deathRate:  2100, buyPrice:            12000000}); // 13 Kangaroo
  new IZ.Zoo.Animal ({birthRate:  3000, deathRate:  2400, buyPrice:            40000000}); // 14 Anteater
  new IZ.Zoo.Animal ({birthRate:  3500, deathRate:  2600, buyPrice:           120000000}); // 15 Eagle
  new IZ.Zoo.Animal ({birthRate:  4000, deathRate:  2800, buyPrice:           400000000}); // 16 Okapi
  new IZ.Zoo.Animal ({birthRate:  4500, deathRate:  3000, buyPrice:          1500000000}); // 17 Ostrich
  new IZ.Zoo.Animal ({birthRate:  5000, deathRate:  3300, buyPrice:          5000000000}); // 18 Antelope
  new IZ.Zoo.Animal ({birthRate:  5600, deathRate:  3600, buyPrice:         15000000000}); // 19 Zebra
  new IZ.Zoo.Animal ({birthRate:  6200, deathRate:  3900, buyPrice:         50000000000}); // 20 Condor
  new IZ.Zoo.Animal ({birthRate:  7000, deathRate:  4200, buyPrice:        200000000000}); // 21 Wolf
  new IZ.Zoo.Animal ({birthRate:  8000, deathRate:  4600, buyPrice:        600000000000}); // 22 Jaguar
  new IZ.Zoo.Animal ({birthRate:  9200, deathRate:  5000, buyPrice:       2000000000000}); // 23 Bear
  new IZ.Zoo.Animal ({birthRate: 10500, deathRate:  5500, buyPrice:       6000000000000}); // 24 Hippo
  new IZ.Zoo.Animal ({birthRate: 12000, deathRate:  6000, buyPrice:      20000000000000});
  new IZ.Zoo.Animal ({birthRate: 14000, deathRate:  6500, buyPrice:      75000000000000});
  new IZ.Zoo.Animal ({birthRate: 16000, deathRate:  7000, buyPrice:     300000000000000});
  new IZ.Zoo.Animal ({birthRate: 18500, deathRate:  7500, buyPrice:    1200000000000000});
  new IZ.Zoo.Animal ({birthRate: 21000, deathRate:  8000, buyPrice:    5000000000000000}); // 29
  new IZ.Zoo.Animal ({birthRate: 24000, deathRate:  8500, buyPrice:   20000000000000000});
  new IZ.Zoo.Animal ({birthRate: 27000, deathRate:  9000, buyPrice:   80000000000000000});
  new IZ.Zoo.Animal ({birthRate: 31000, deathRate:  9500, buyPrice:  300000000000000000});
  new IZ.Zoo.Animal ({birthRate: 35000, deathRate: 10000, buyPrice: 1200000000000000000});
  new IZ.Zoo.Animal ({birthRate: 40000, deathRate: 10500, buyPrice: 5000000000000000000}); // 34

  new IZ.Zoo.Animal ({birthRate: omegaBR, deathRate: 12000, buyPrice: 5000000000000000000});
} // end of IZ.init()

IZ.setSave = function(t) {
  if (needSave <= 0) {
    needSave = t;
  } else if (t < needSave) {
    needSave = t;
  }
}

IZ.qStr = function(i) {
  return ('<i>"' + IZ.animals[i].quote + '"</i> - ' + IZ.animals[i].who);
}

IZ.s_visitorsStatus = function() {
  var rv = "<h2>Your zoo gets " + IZ.commas(IZ.Zoo.visitorsTotal)  + " visitors every ";
  var vt = IZ.Zoo.visitorsTime;
  if (vt == 1) {
    rv = rv + "second";
  } else {
    rv = rv + vt + " seconds";
  }
  rv = rv + ".</h2>";
  return rv;
}

IZ.s_visitorsGet = function() {
  var vb = IZ.Zoo.visitorsBuy;
  var vbc = IZ.Zoo.visitorsBuyCost;
  var species = IZ.censusSpecies();
  var pfi_time = IZ.Zoo.visitorsTime * vbc/(vb*species); // pfi = pays for itself
  var f_vb = IZ.commas(vb);
  var f_vbc = IZ.fmt(vbc);
  var rv = "<a class=\"tooltip3\">"
         // + "vb=" + vb + " vbc=" + vbc + "sp=" + species + " "
         + "<span id=\"gvis\" class=\"tt\">(Pays for itself in "
         + IZ.fmt(pfi_time) + " seconds)</span>"
         + "<h3>Get " + f_vb + " more visitors for $" + f_vbc + "</h3>"
         + "<\a>";
  return rv;
}

IZ.s_visitorsGMF = function() {
  var nv = IZ.Zoo.visitorsTotal; // number of visitors
  var species = IZ.censusSpecies();
  var vt = IZ.Zoo.visitorsTime;
  var cur_mps = nv*species/vt;   // current money per second
  var new_mps = nv*species/(vt-1); // what it will be if user buys this upgrade
  var vtc = IZ.Zoo.visitorsTimeCost;
  var pfi_time = vtc/(new_mps-cur_mps); // pfi = pays for itself
  var f_vtc = IZ.fmt(vtc);
  var rv = "<a class=\"tooltip3\">";
  if (nv > 0) {
    rv = rv // + "nv=" + nv + " sp=" + species + " "
         + "<span id=\"gvmf\" class=\"tt\">"
         + "(Pays for itself in " + IZ.fmt(pfi_time) + " seconds)"
         + "</span>";
  }
  rv = rv + "<h3>"
          + "Get visitors more frequently for $" + f_vtc
          + "</h3>"
          + "<\a>";
  return rv;
}


// create zoo + boosts
IZ.loadZoo = function () {
  var id;
  var slot;
  var name;
  var own;
  var birthRate;
  var image;
  var buyPrice;
  var sellPrice;
  var newDiv;
  var zoo = '<div id="animalsTitle" onclick="IZ.showAnimals()">'
          + '<h2>Animals (0)</h2></div>'
          + '<div id="badgesTitle" onclick="IZ.showBadges()">'
          + '<h2>Achievements (0)</h2></div><div id="animals">';
  for (var i=0; i<IZ.Zoo.animals.length; i++) {

    // build animal div
    id = IZ.Zoo.animals[i].id;
    slot = "animal" + id;
    name = IZ.animals[i].name;
    own = IZ.Zoo.animals[i].own;
    image = IZ.animals[i].image;
    buyPrice = IZ.Zoo.animals[i].buyPrice;
    sellPrice = buyPrice * IZ.Zoo.sellMarkdown;
    buyPrice = IZ.fmt(buyPrice);
    sellPrice = IZ.fmt(sellPrice);
    bgc = IZ.animals[i].bgc;
    quote = 'Bought: ' + IZ.Zoo.animals[i].bought
          + '<br>Sold: ' + IZ.Zoo.animals[i].sold
          + '<br>Born: ' + IZ.Zoo.animals[i].born + '<br>'
          + IZ.buyRequire(i) + '  ' + IZ.qStr(i);
    newDiv = '<div id="' + slot + '" class="animal" style="background-color:' + bgc + '">' +
    '<a class="tooltip2" href="#">' + '<img class="image" src="' + image + '" />' +
    '<span id="tt' + id + '"class="tt">' + quote + '</span></a>' +
    '<h1 class="name">' + name + '</h1>' +
    '<p class="stats">Birth rate: <span id="birthRate' + id + '"> -</span>'
       + '<br>Death rate: <span id="deathRate' + id + '"> -</span></p>' +
    '<h1 id="own' + id + '" class="own">' + own + '</h1>' +
    '<p class="commerce"><span id="buy' + id + '" class="buy" onclick="IZ.buy(this, 1)">Buy 1: $' + buyPrice + '</span><br>' +
    '<span id="buy10' + id + '" class="sell" onclick="IZ.buy(this, 10)">| Buy 10 | </span>' +
    '<span id="buy100' + id + '" class="sell" onclick="IZ.buy(this, 100)">Buy 100 | </span>' +
    '<span id="buy1000' + id + '" class="sell" onclick="IZ.buy(this, 1000)">Buy 1,000 | </span>' +
    '<span id="buy10000' + id + '" class="sell" onclick="IZ.buy(this, 10000)">Buy 10,000 |</span>' +
    '<br><span id="sell' + id + '" class="sell" onclick="IZ.sell(this, 1)">Sell 1: $' + sellPrice +'</span><br>' +
    '<span id="sell10' + id + '" class="sell" onclick="IZ.sell(this, 10)">| Sell 10 | </span>' +
    '<span id="sell100' + id + '" class="sell" onclick="IZ.sell(this, 100)">Sell 100 | </span>' +
    '<span id="sell1000' + id + '" class="sell" onclick="IZ.sell(this, 1000)">Sell 1,000 | </span>' +
    '<span id="sell10000' + id + '" class="sell" onclick="IZ.sell(this, 10000)">Sell 10,000 | </span>' +
    '</p></div>';
    zoo = zoo + newDiv;

    // build animal's boosts divs
    slot = "br" + id;
    buyPrice = IZ.fmt(IZ.Zoo.animals[i].brPrice)
    newDiv = "<a id=\"" + slot + "\" class=\"boosts br\" style=\"background-color:"
      + bgc + "\" onclick=\"IZ.buyBRBoost(this)\">Get a Higher Birth Rate (0):<br>$"
      + buyPrice + "</a>";
    zoo = zoo + newDiv;
    slot = "dr" + id;
    buyPrice = IZ.fmt(IZ.Zoo.animals[i].drPrice);
    newDiv = '<a id="' + slot + '" class="boosts dr" style="background-color:'
      + bgc + '"onclick="IZ.buyDRBoost(this)">Lower the Death Rate: (0)<br>$'
      + buyPrice + "</a>";
    zoo = zoo + newDiv;
    slot = "bs" + id;
    buyPrice = IZ.fmt(IZ.Zoo.animals[i].bsPrice);
    newDiv = '<a id="' + slot + '" class="boosts bs" style="background-color:'
      + bgc + '"  onclick="IZ.buyBSBoost(this)">Get Higher Prices (0):<br>$'
      + buyPrice + "</a>";
    zoo = zoo + newDiv;
    slot = "en" + id;
    buyPrice = IZ.fmt(IZ.Zoo.animals[i].enPrice);
    newDiv = '<a id="' + slot + '" class="boosts en" style="background-color:'
      + bgc + '"onclick="IZ.buyENBoost(this)">Enlarge the habitat: ('
      + IZ.Zoo.animals[id].enCount + ")<br>$" + buyPrice + "</a>";
    zoo = zoo + newDiv;
  }
  zoo = zoo + "</div>"; // close div id="animals"
  zoo = zoo + '<div id="badgesContainer"></div>';

  // total + next + buy time
  newDiv = '<div class="buyTime"><div id="total"></div><div id="next"></div>'
         + '<div id="buyTime" onmousedown="IZ.buyTime()">'
         + "<h3>Invest $1,000 in animal welfare science"
         + "<br>(will reduce the wait by about 10 seconds)"
         + "</h3></div></div>";
  zoo = zoo + newDiv;

  // visitors
  newDiv = '<div class="buytime" id="visitors">'
    + '<div id="visitorsStatus">' + IZ.s_visitorsStatus() + "</div>"
      + "<div id=\"visitorsHelp\">"
        + "<h3>(Each visitor pays $1 for each species in your zoo)"
        + "</h3>"
      + "</div>"
      + "<div id=\"visitorsBuy\" onclick=\"IZ.buyVisitors()\">"
        + IZ.s_visitorsGet()
      + "</div>"
      + "<div id=\"visitorsTimeBuy\" onclick=\"IZ.buyVisitorsTime()\">"
        + IZ.s_visitorsGMF()
      + "</div>"
    + "</div>";
  zoo = zoo + newDiv;

  // photo credits
  zoo = zoo + "<br>"
     + '<div id="photoCredits">'
     + '<span style="font-size: 10pt">'
     + "<b>Incremental Zoo</b> by <b>Eduardo Abel Gimenez (magicaweb.com)</b>"
     + " with bug fixes by Robert Munafo (mrob.com)."
     + ' <a href="log.txt">Changelog</a>'
     + "<br>"
     + "</span>"

     + '<span style="font-size: 8pt">'
     + "<strong>"
     + '<a href="mailto:e.a.gimenez-at-gmail.dot.com">Contact the author.</a>'
     + "</strong>"
     + "&nbsp; - &nbsp;"
     + ' Title image by Sean Freeman - <strong><a href="mailto:right.s.f-at-gmail.dot.com">(contact)</a></strong></div>'
     + "</span>"

     + '<span style="font-size: 7pt">'
     + "<b>Animal photo credits:</b><br>"
     + "&nbsp; &nbsp; &nbsp;"
     + "Except where noted, all photos were published by their authors under a "
     + "<strong>"
     + '<a href="http://creativecommons.org/licenses/by/2.0/">Creative Commons "by" license'
     + "</a></strong>."
     + "<br>"
     + "&nbsp; &nbsp; &nbsp;"
     + " Meerkat, Neil McIntosh."
     + " Peackock, public domain (Wikimedia Commons)."
     + " Chameleon, William Warby."
     + " Beaver, dcJohn."
     + " Flamingo, public domain (Wikimedia Commons)."
     + " Otter, Michael Malz."
     + " Penguin, Paul Boxley."
     + " Snake, Linda Tanner."
     + " Turtle, Julien GONG Min."
     + " Tapir, NAPARAZZI."
     + " Crocodile, Radek Vitoul."
     + " Monkey, Michael Goodine."
     + " Seal, Yuri Levchenko."
     + " Anteater, cuatrok77."
     + " Kangaroo, Scott Calleja."
     + " Eagle, Pat Bell."
     + " Okapi, Trisha Shears."
     + " Ostrich, William Warby."
     + " Antelope, Alfo23."
     + " Zebra, Martin Pettitt."
     + " Condor, USFWS Pacific Southwest Region."
     + " Wolf, Alois Staudacher."
     + " Jaguar, Alois Staudacher."
     + " Bear, Moyan Brenn."
     + " Hippo, William Warby."
     + " Tiger, Alois Staudacher."
     + " Giraffe, Alois Staudacher."
     + " Shark, Ed Schipul."
     + " Rhino, macinate."
     + " Gorilla, Ruben Undheim."
     + " Lion, Peter Harrison."
     + " Elephant, Arran ET."
     + " Panda, George Lu,"
     + " Dolphin, Gordon Wrigley."
     + " Orca, Opals-On-Black.com."
     + " (All from flickr.com, except those marked 'Wikimedia Commons'.)"
     + "<br>"
     + "<br>"
     + "</span>"
     + '<div style="text-align: center; margin-top: 30px; padding: 20px; border-top: 2px solid #999;">'
     + '<div id="hardReset" class="options" onmousedown="IZ.hardReset()" style="margin: 0 auto;">Hard Reset</div>'
     + '<div style="font-size: 8pt; color: #666; margin-top: 10px;">⚠️ Permanently deletes all progress</div>'
     + '</div>'
     ;

  document.getElementById("animalsContainer").innerHTML = zoo;
} // end of loadZoo

// achievements (badges)
IZ.loadBadges = function () {
  document.getElementById("badgesContainer").innerHTML = 'Hello world';
  var board = "";
  var image;
  for (var i = 0; i < IZ.Zoo.animals.length; i++) {

  // for individuals of each species
    board = board + '<div class="badges" id="speciesAmount' + i + '1"><a class="tooltip" href="#">'
      + '<img src="img/' + i + '.jpg" height=48 width=48><span class="tt">You got 1 '
      + IZ.animals[i].name + ' in your Zoo</span></a></div>'
    board = board + '<div class="badges" id="speciesAmount' + i + '100"><a class="tooltip" href="#">'
      + '<img src="img/' + i + '.jpg" height=48 width=48><span class="tt">You got 100 ' + IZ.animals[i].plural + ' in your Zoo</span></a></div>'
    board = board + '<div class="badges" id="speciesAmount' + i + '1000"><a class="tooltip" href="#">'
      + '<img src="img/' + i + '.jpg" height=48 width=48><span class="tt">You got 1,000 ' + IZ.animals[i].plural + ' in your Zoo</span></a></div>'
    board = board + '<div class="badges" id="speciesAmount' + i + '10000"><a class="tooltip" href="#">'
      + '<img src="img/' + i + '.jpg" height=48 width=48><span class="tt">You got 10,000 ' + IZ.animals[i].plural + ' in your Zoo</span></a></div>'
    board = board + '<div class="badges" id="speciesAmount' + i + '100000"><a class="tooltip" href="#">'
      + '<img src="img/' + i + '.jpg" height=48 width=48><span class="tt">You got 100,000 ' + IZ.animals[i].plural + ' in your Zoo</span></a></div>'

  // for born inidividuals of each species
    board = board + '<div class="badges" id="speciesBorn' + i + '1"><a class="tooltip" href="#">'
      + '<img src="img/' + i + '.jpg" height=48 width=48><span class="tt">A ' + IZ.animals[i].name + ' was born in your Zoo</span></a></div>'
    board = board + '<div class="badges" id="speciesBorn' + i + '100"><a class="tooltip" href="#">'
      + '<img src="img/' + i + '.jpg" height=48 width=48><span class="tt">100 ' + IZ.animals[i].plural + ' were born in your Zoo</span></a></div>'
    board = board + '<div class="badges" id="speciesBorn' + i + '1000"><a class="tooltip" href="#">'
      + '<img src="img/' + i + '.jpg" height=48 width=48><span class="tt">1,000 ' + IZ.animals[i].plural + ' were born in your Zoo</span></a></div>'
    board = board + '<div class="badges" id="speciesBorn' + i + '10000"><a class="tooltip" href="#">'
      + '<img src="img/' + i + '.jpg" height=48 width=48><span class="tt">10,000 ' + IZ.animals[i].plural + ' were born in your Zoo</span></a></div>'
    board = board + '<div class="badges" id="speciesBorn' + i + '100000"><a class="tooltip" href="#">'
      + '<img src="img/' + i + '.jpg" height=48 width=48><span class="tt">100,000 ' + IZ.animals[i].plural + ' were born in your Zoo</span></a></div>'

  // for dead inidividuals of each species
    board = board + '<div class="badges" id="speciesDead' + i + '1"><a class="tooltip" href="#">'
      + '<img src="img/' + i + 'f.jpg" height=48 width=48><span class="tt">A ' + IZ.animals[i].name + ' died in your Zoo</span></a></div>'
    board = board + '<div class="badges" id="speciesDead' + i + '100"><a class="tooltip" href="#">'
      + '<img src="img/' + i + 'f.jpg" height=48 width=48><span class="tt">100 ' + IZ.animals[i].plural + ' died in your Zoo</span></a></div>'
    board = board + '<div class="badges" id="speciesDead' + i + '1000"><a class="tooltip" href="#">'
      + '<img src="img/' + i + 'f.jpg" height=48 width=48><span class="tt">1,000 ' + IZ.animals[i].plural + ' died in your Zoo</span></a></div>'
    board = board + '<div class="badges" id="speciesDead' + i + '10000"><a class="tooltip" href="#">'
      + '<img src="img/' + i + 'f.jpg" height=48 width=48><span class="tt">10,000 ' + IZ.animals[i].plural + ' died in your Zoo</span></a></div>'
    board = board + '<div class="badges" id="speciesDead' + i + '100000"><a class="tooltip" href="#">'
      + '<img src="img/' + i + 'f.jpg" height=48 width=48><span class="tt">100,000 ' + IZ.animals[i].plural + ' died in your Zoo</span></a></div>'

  // for bought inidividuals of each species
    board = board + '<div class="badges" id="speciesBought' + i + '1"><a class="tooltip" href="#">'
      + '<img src="img/' + i + '.jpg" height=48 width=48><span class="tt">You bought a ' + IZ.animals[i].name + ' for your Zoo</span></a></div>'
    board = board + '<div class="badges" id="speciesBought' + i + '100"><a class="tooltip" href="#">'
      + '<img src="img/' + i + '.jpg" height=48 width=48><span class="tt">You bought 100 ' + IZ.animals[i].plural + ' for your Zoo</span></a></div>'
    board = board + '<div class="badges" id="speciesBought' + i + '1000"><a class="tooltip" href="#">'
      + '<img src="img/' + i + '.jpg" height=48 width=48><span class="tt">You bought 1,000 ' + IZ.animals[i].plural + ' for your Zoo</span></a></div>'
    board = board + '<div class="badges" id="speciesBought' + i + '10000"><a class="tooltip" href="#">'
      + '<img src="img/' + i + '.jpg" height=48 width=48><span class="tt">You bought 10,000 ' + IZ.animals[i].plural + ' for your Zoo</span></a></div>'
    board = board + '<div class="badges" id="speciesBought' + i + '100000"><a class="tooltip" href="#">'
      + '<img src="img/' + i + '.jpg" height=48 width=48><span class="tt">You bought 100,000 ' + IZ.animals[i].plural + ' for your Zoo</span></a></div>'

  // for sold individuals of each species
    board = board + '<div class="badges flipped" id="speciesSold' + i + '1"><a class="tooltip" href="#">'
      + '<img src="img/' + i + 'f.jpg" height=48 width=48><span class="tt">You sold 1 ' + IZ.animals[i].name + ' from your Zoo</span></a></div>'
    board = board + '<div class="badges flipped" id="speciesSold' + i + '100"><a class="tooltip" href="#">'
      + '<img src="img/' + i + 'f.jpg" height=48 width=48><span class="tt">You sold 100 ' + IZ.animals[i].plural + ' from your Zoo</span></a></div>'
    board = board + '<div class="badges flipped" id="speciesSold' + i + '1000"><a class="tooltip" href="#">'
      + '<img src="img/' + i + 'f.jpg" height=48 width=48><span class="tt">You sold 1,000 ' + IZ.animals[i].plural + ' from your Zoo</span></a></div>'
    board = board + '<div class="badges flipped" id="speciesSold' + i + '10000"><a class="tooltip" href="#">'
      + '<img src="img/' + i + 'f.jpg" height=48 width=48><span class="tt">You sold 10,000 ' + IZ.animals[i].plural + ' from your Zoo</span></a></div>'
    board = board + '<div class="badges flipped" id="speciesSold' + i + '100000"><a class="tooltip" href="#">'
      + '<img src="img/' + i + 'f.jpg" height=48 width=48><span class="tt">You sold 100,000 ' + IZ.animals[i].plural + ' from your Zoo</span></a></div>'

  // for boosts of each species
    board = board + '<div class="badges" id="speciesBR' + i + '10"><a class="tooltip" href="#">'
      + '<img src="img/' + i + '.jpg" height=48 width=48><span class="tt">You bought 10 birth-rate boosts for your ' + IZ.animals[i].plural + '</span></a></div>'
    board = board + '<div class="badges" id="speciesBR' + i + '20"><a class="tooltip" href="#">'
      + '<img src="img/' + i + '.jpg" height=48 width=48><span class="tt">You maxed out the birth-rate of your ' + IZ.animals[i].plural + '</span></a></div>'
    board = board + '<div class="badges" id="speciesDR' + i + '10"><a class="tooltip" href="#">'
      + '<img src="img/' + i + 'f.jpg" height=48 width=48><span class="tt">You bought 10 death-rate reductions for your ' + IZ.animals[i].plural + '</span></a></div>'
    board = board + '<div class="badges" id="speciesDR' + i + '20"><a class="tooltip" href="#">'
      + '<img src="img/' + i + 'f.jpg" height=48 width=48><span class="tt">You minimized the death-rate of your ' + IZ.animals[i].plural + '</span></a></div>'
    board = board + '<div class="badges" id="speciesBS' + i + '10"><a class="tooltip" href="#">'
      + '<img src="img/' + i + '.jpg" height=48 width=48><span class="tt">You bought 10 price boosts for your ' + IZ.animals[i].plural + '</span></a></div>'
    board = board + '<div class="badges" id="speciesBS' + i + '20"><a class="tooltip" href="#">'
      + '<img src="img/' + i + '.jpg" height=48 width=48><span class="tt">You maxed out the price of your ' + IZ.animals[i].plural + '</span></a></div>'
    board = board + '<div class="badges" id="speciesEN' + i + '10"><a class="tooltip" href="#">'
      + '<img src="img/' + i + '.jpg" height=48 width=48><span class="tt">10 times you enlarged the habitats for your ' + IZ.animals[i].plural + '</span></a></div>'
    board = board + '<div class="badges" id="speciesEN' + i + '20"><a class="tooltip" href="#">'
      + '<img src="img/' + i + '.jpg" height=48 width=48><span class="tt">20 times you enlarged the habitats for your ' + IZ.animals[i].plural + '</span></a></div>'
    board = board + '<div class="badges" id="speciesEN' + i + '50"><a class="tooltip" href="#">'
      + '<img src="img/' + i + '.jpg" height=48 width=48><span class="tt">50 times you enlarged the habitats for your ' + IZ.animals[i].plural + '</span></a></div>'
    board = board + '<div class="badges" id="speciesEN' + i + '100"><a class="tooltip" href="#">'
      + '<img src="img/' + i + '.jpg" height=48 width=48><span class="tt">100 times you enlarged the habitats for your ' + IZ.animals[i].plural + '</span></a></div>'
  }

  // for total number of animals
  board = board + '<div class="badges" id="totalAmount1"><a class="tooltip" href="#">'
      + '<img src="img/egg.jpg" height=48 width=48><span class="tt">You obtained 1 animal for your Zoo</span></a></div>'
  board = board + '<div class="badges" id="totalAmount100"><a class="tooltip" href="#">'
      + '<img src="img/egg.jpg" height=48 width=48><span class="tt">You obtained 100 animals for your Zoo</span></a></div>'
  board = board + '<div class="badges" id="totalAmount1000"><a class="tooltip" href="#">'
      + '<img src="img/egg.jpg" height=48 width=48><span class="tt">You obtained 1,000 animals for your Zoo</span></a></div>'
  board = board + '<div class="badges" id="totalAmount10000"><a class="tooltip" href="#">'
      + '<img src="img/egg.jpg" height=48 width=48><span class="tt">You obtained 10,000 animals for your Zoo</span></a></div>'
  board = board + '<div class="badges" id="totalAmount100000"><a class="tooltip" href="#">'
      + '<img src="img/egg.jpg" height=48 width=48><span class="tt">You obtained 100,000 animals for your Zoo</span></a></div>'
  board = board + '<div class="badges" id="totalAmount1000000"><a class="tooltip" href="#">'
      + '<img src="img/egg.jpg" height=48 width=48><span class="tt">You obtained 1,000,000 animals for your Zoo</span></a></div>'
  board = board + '<div class="badges" id="totalAmount10000000"><a class="tooltip" href="#">'
      + '<img src="img/egg.jpg" height=48 width=48><span class="tt">You obtained 10,000,000 animals for your Zoo</span></a></div>'

  // for number of species found
  board = board + '<div class="badges" id="speciesFound10"><a class="tooltip" href="#">'
      + '<img src="img/egg.jpg" height=48 width=48><span class="tt">You found ten different species for your Zoo</span></a></div>'
  board = board + '<div class="badges" id="speciesFound20"><a class="tooltip" href="#">'
      + '<img src="img/egg.jpg" height=48 width=48><span class="tt">You found twenty different species for your Zoo</span></a></div>'
  board = board + '<div class="badges" id="speciesFound30"><a class="tooltip" href="#">'
      + '<img src="img/egg.jpg" height=48 width=48><span class="tt">You found thirty different species for your Zoo</span></a></div>'
  board = board + '<div class="badges" id="speciesFound35"><a class="tooltip" href="#">'
      + '<img src="img/egg.jpg" height=48 width=48><span class="tt">You found thirty five species species for your Zoo. You have them all!</span></a></div>'

  // for number of birthrate boosts bought
  board = board + '<div class="badges" id="brBoosts1"><a class="tooltip" href="#">'
      + '<img src="img/egg.jpg" height=48 width=48><span class="tt">You bought the first birth rate boost for your Zoo</span></a></div>'
  board = board + '<div class="badges" id="brBoosts10"><a class="tooltip" href="#">'
      + '<img src="img/egg.jpg" height=48 width=48><span class="tt">You bought 10 birth rate boosts for your Zoo</span></a></div>'
  board = board + '<div class="badges" id="brBoosts100"><a class="tooltip" href="#">'
      + '<img src="img/egg.jpg" height=48 width=48><span class="tt">You bought 100 birth rate boosts for your Zoo</span></a></div>'
  board = board + '<div class="badges" id="brBoosts200"><a class="tooltip" href="#">'
      + '<img src="img/egg.jpg" height=48 width=48><span class="tt">You bought 200 birth rate boosts for your Zoo</span></a></div>'
  board = board + '<div class="badges" id="brBoosts500"><a class="tooltip" href="#">'
      + '<img src="img/egg.jpg" height=48 width=48><span class="tt">You bought 500 birth rate boosts for your Zoo</span></a></div>'

  // for number of deathrate mitigators bought
  board = board + '<div class="badges" id="drBoosts1"><a class="tooltip" href="#">'
      + '<img src="img/egg.jpg" height=48 width=48><span class="tt">You bought the first death rate mitigator for your Zoo</span></a></div>'
  board = board + '<div class="badges" id="drBoosts10"><a class="tooltip" href="#">'
      + '<img src="img/egg.jpg" height=48 width=48><span class="tt">You bought 10 death rate mitigators for your Zoo</span></a></div>'
  board = board + '<div class="badges" id="drBoosts100"><a class="tooltip" href="#">'
      + '<img src="img/egg.jpg" height=48 width=48><span class="tt">You bought 100 death rate mitigators for your Zoo</span></a></div>'
  board = board + '<div class="badges" id="drBoosts200"><a class="tooltip" href="#">'
      + '<img src="img/egg.jpg" height=48 width=48><span class="tt">You bought 200 death rate mitigators for your Zoo</span></a></div>'
  board = board + '<div class="badges" id="drBoosts500"><a class="tooltip" href="#">'
      + '<img src="img/egg.jpg" height=48 width=48><span class="tt">You bought 500 death rate mitigators for your Zoo</span></a></div>'

  // for number of price boosts bought
  board = board + '<div class="badges" id="bsBoosts1"><a class="tooltip" href="#">'
      + '<img src="img/egg.jpg" height=48 width=48><span class="tt">You bought the first price boost for your Zoo</span></a></div>'
  board = board + '<div class="badges" id="bsBoosts10"><a class="tooltip" href="#">'
      + '<img src="img/egg.jpg" height=48 width=48><span class="tt">You bought 10 price boosts for your Zoo</span></a></div>'
  board = board + '<div class="badges" id="bsBoosts100"><a class="tooltip" href="#">'
      + '<img src="img/egg.jpg" height=48 width=48><span class="tt">You bought 100 price boosts for your Zoo</span></a></div>'
  board = board + '<div class="badges" id="bsBoosts200"><a class="tooltip" href="#">'
      + '<img src="img/egg.jpg" height=48 width=48><span class="tt">You bought 200 price boosts for your Zoo</span></a></div>'
  board = board + '<div class="badges" id="bsBoosts500"><a class="tooltip" href="#">'
      + '<img src="img/egg.jpg" height=48 width=48><span class="tt">You bought 500 price boosts for your Zoo</span></a></div>'

  // for number of habitat boosts bought
  board = board + '<div class="badges" id="enBoosts1"><a class="tooltip" href="#">'
      + '<img src="img/egg.jpg" height=48 width=48><span class="tt">You bought the first habitat expansion for your Zoo</span></a></div>'
  board = board + '<div class="badges" id="enBoosts100"><a class="tooltip" href="#">'
      + '<img src="img/egg.jpg" height=48 width=48><span class="tt">You bought 100 habitat expansions for your Zoo</span></a></div>'
  board = board + '<div class="badges" id="enBoosts200"><a class="tooltip" href="#">'
      + '<img src="img/egg.jpg" height=48 width=48><span class="tt">You bought 200 habitat expansions for your Zoo</span></a></div>'
  board = board + '<div class="badges" id="enBoosts500"><a class="tooltip" href="#">'
      + '<img src="img/egg.jpg" height=48 width=48><span class="tt">You bought 500 habitat expansions for your Zoo</span></a></div>'
  board = board + '<div class="badges" id="enBoosts1000"><a class="tooltip" href="#">'
      + '<img src="img/egg.jpg" height=48 width=48><span class="tt">You bought 1000 habitat expansions for your Zoo</span></a></div>'

  // for time played
  board = board + '<div class="badges" id="time100"><a class="tooltip" href="#">'
      + '<img src="img/clock.jpg" height=48 width=48><span class="tt">Time played: 100 seconds</span></a></div>'
  board = board + '<div class="badges" id="time1000"><a class="tooltip" href="#">'
      + '<img src="img/clock.jpg" height=48 width=48><span class="tt">Time played: 1,000 seconds</span></a></div>'
  board = board + '<div class="badges" id="time10000"><a class="tooltip" href="#">'
      + '<img src="img/clock.jpg" height=48 width=48><span class="tt">Time played: 10,000 seconds</span></a></div>'
  board = board + '<div class="badges" id="time100000"><a class="tooltip" href="#">'
      + '<img src="img/clock.jpg" height=48 width=48><span class="tt">Time played: 100,000 seconds</span></a></div>'
  board = board + '<div class="badges" id="time1000000"><a class="tooltip" href="#">'
      + '<img src="img/clock.jpg" height=48 width=48><span class="tt">Time played: 1,000,000 seconds</span></a></div>'

  document.getElementById("badgesContainer").innerHTML = board;
} // end of loadBadges

// calculate and show badges
IZ.showBadges = function() {
  document.getElementById("animals").style.display = "none";
  document.getElementById("badgesContainer").style.display = "inherit";
  document.getElementById("animalsTitle").style.backgroundColor = "#ccc";
  document.getElementById("badgesTitle").style.backgroundColor = "#fff";
  document.getElementById("animalsTitle").style.borderBottom = "1px solid #999";
  document.getElementById("badgesTitle").style.borderBottom = "0";
  IZ.calculateBadges();
}
IZ.calculateBadges = function() {
  IZ.Zoo.badges.length = 0;
  var amount = [1, 100, 1000, 10000, 100000];
  var speciesBoosts = [10, 20]
  var speciesEN = [10, 20, 50, 100]
  for (var i=0; i<IZ.Zoo.animals.length; i++) {
    for (var j=0; j<amount.length; j++) {
      if (IZ.Zoo.animals[i].maxOwn >= amount[j]) {
        var id = "speciesAmount" + i + amount[j];
        IZ.addBadge(id);
      }
      if (IZ.Zoo.animals[i].born >= amount[j]) {
        var id = "speciesBorn" + i + amount[j];
        IZ.addBadge(id);
      }
      if (IZ.Zoo.animals[i].dead >= amount[j]) {
        var id = "speciesDead" + i + amount[j];
        IZ.addBadge(id);
      }
      if (IZ.Zoo.animals[i].bought >= amount[j]) {
        var id = "speciesBought" + i + amount[j];
        IZ.addBadge(id);
      }
      if (IZ.Zoo.animals[i].sold >= amount[j]) {
        var id = "speciesSold" + i + amount[j];
        IZ.addBadge(id);
      }
    }
    for (var j=0; j<speciesBoosts.length; j++) {
      if (IZ.Zoo.animals[i].brCount >= speciesBoosts[j]) {
        var id = "speciesBR" + i + speciesBoosts[j];
        IZ.addBadge(id);
      }
      if (IZ.Zoo.animals[i].drCount >= speciesBoosts[j]) {
        var id = "speciesDR" + i + speciesBoosts[j];
        IZ.addBadge(id);
      }
      if (IZ.Zoo.animals[i].bsCount >= speciesBoosts[j]) {
        var id = "speciesBS" + i + speciesBoosts[j];
        IZ.addBadge(id);
      }
    }
    for (var j=0; j<speciesEN.length; j++) {
      if (IZ.Zoo.animals[i].enCount >= speciesEN[j]) {
        var id = "speciesEN" + i + speciesEN[j];
        IZ.addBadge(id);
      }
    }
  }
  var totalAmount = [1, 100, 1000, 10000, 100000, 1000000, 10000000]
  for (var j=0; j<totalAmount.length; j++) {
    if (IZ.Zoo.maxTotal >= totalAmount[j]) {
      var id = "totalAmount" + totalAmount[j];
      IZ.addBadge(id);
    }
  }
  var speciesFound = [10, 20, 30, 35]
  for (var j=0; j<speciesFound.length; j++) {
    if (IZ.Zoo.speciesShown >= speciesFound[j]) {
      var id = "speciesFound" + speciesFound[j];
      IZ.addBadge(id);
    }
  }
  var boosts = [1, 10, 100, 200, 500]
  for (var j=0; j<boosts.length; j++) {
    if (IZ.Zoo.brBoosts >= boosts[j]) {
      var id = "brBoosts" + boosts[j];
      IZ.addBadge(id);
    }
    if (IZ.Zoo.drBoosts >= boosts[j]) {
      var id = "drBoosts" + boosts[j];
      IZ.addBadge(id);
    }
    if (IZ.Zoo.bsBoosts >= boosts[j]) {
      var id = "bsBoosts" + boosts[j];
      IZ.addBadge(id);
    }
  }
  var enBoosts = [1, 100, 200, 500, 1000]
  for (var j=0; j<enBoosts.length; j++) {
    if (IZ.Zoo.enBoosts >= enBoosts[j]) {
      var id = "enBoosts" + enBoosts[j];
      IZ.addBadge(id);
    }
  }
  var time = [100, 1000, 10000, 100000, 1000000]
  for (var j=0; j<time.length; j++) {
    if (IZ.Zoo.time >= time[j]) {
      var id = "time" + time[j];
      IZ.addBadge(id);
    }
  }
} // end of calculateBadges

IZ.addBadge = function(id) {
  IZ.Zoo.badges.push(id);
  document.getElementById(id).style.display="inline-block";
}

// show animals tab
IZ.showAnimals = function() {
  document.getElementById("badgesContainer").style.display = "none";
  document.getElementById("animals").style.display = "";
  document.getElementById("badgesTitle").style.backgroundColor = "#ccc";
  document.getElementById("animalsTitle").style.backgroundColor = "#fff";
  document.getElementById("badgesTitle").style.borderBottom = "1px solid #999";
  document.getElementById("animalsTitle").style.borderBottom = "0";
}


// buy time
IZ.buyTime = function() {
  if (IZ.Zoo.money >= IZ.Zoo.timePrice) {
    IZ.Zoo.money -= IZ.Zoo.timePrice;
    IZ.setSave(1); console.log("force save for buying time");
    IZ.updateMoney();
    /* Update the time */
    var ts = IZ.Zoo.timeSecs;
    ts = ts * (Math.random() + Math.random() + Math.random() + Math.random()) * 0.5;
    IZ.Zoo.time += Math.round(ts);
    /* Set the new amount of buyable time and price */
    IZ.Zoo.timeSecs = Math.round(IZ.Zoo.timeSecs * 1.1);
    ts = IZ.Zoo.timeSecs;
    ts = IZ.commas(ts);
    IZ.Zoo.timePrice = Math.round(IZ.Zoo.timePrice * 1.2);
    var price = IZ.fmt(IZ.Zoo.timePrice);
    document.getElementById("buyTime").innerHTML
      = '<div id="buyTime" onclick="IZ.buyTime()">'
      + "<h3>Invest $" + price + " in animal welfare science"
      + "<br>(will reduce the wait by about " + ts + " seconds)"
      + "</h3></div>";
  }
}

IZ.updatePFI = function() {
  document.getElementById("visitorsBuy").innerHTML = IZ.s_visitorsGet();
  document.getElementById("visitorsTimeBuy").innerHTML = IZ.s_visitorsGMF();
}

// visitors
IZ.buyVisitors = function() {
  if (IZ.Zoo.money < IZ.Zoo.visitorsBuyCost) return;
  IZ.Zoo.money -= IZ.Zoo.visitorsBuyCost;
  IZ.setSave(10); console.log("setSave(10) for buy visitors capacity");
  IZ.updateMoney();
  IZ.Zoo.visitorsTotal += Math.round(IZ.Zoo.visitorsBuy);
  IZ.Zoo.visitorsBuy = Math.round(IZ.Zoo.visitorsBuy * 1.1);
  IZ.Zoo.visitorsBuyCost = Math.round(IZ.Zoo.visitorsBuyCost * 1.2);
  document.getElementById("visitorsStatus").innerHTML = IZ.s_visitorsStatus()
  IZ.updatePFI();
}
IZ.hideBVT = function() {
  if (IZ.Zoo.visitorsTime === 1) {
    document.getElementById("visitorsTimeBuy").style.display = "none";
  }
}
IZ.buyVisitorsTime = function() {
  if (IZ.Zoo.money < IZ.Zoo.visitorsTimeCost) return;
  if (IZ.Zoo.visitorsTime === 1) return;
  IZ.Zoo.money -= IZ.Zoo.visitorsTimeCost;
  IZ.setSave(10); console.log("setSave(10) for buy visitor advertising");
  IZ.updateMoney();
  IZ.Zoo.visitorsTime--;
  IZ.Zoo.visitorsTimeCost = Math.round(IZ.Zoo.visitorsTimeCost * 1.2);
  document.getElementById("visitorsStatus").innerHTML = IZ.s_visitorsStatus();
  document.getElementById("visitorsTimeBuy").innerHTML = IZ.s_visitorsGMF();
  IZ.hideBVT();
  IZ.updatePFI();
}

// money and debt
IZ.moneyClick = function(amount) {
  if (amount == "max") {
    // "borrow max"
    if (IZ.Zoo.debt > IZ.Zoo.creditLimit) {
      // already maxed out
      return;
    }
    amount = IZ.Zoo.creditLimit - IZ.Zoo.debt;
  } else {
    // "borrow $10" or $1000
    if (IZ.Zoo.debt > IZ.Zoo.creditLimit - amount) {
      // can't borrow that much
      return;
    }
  }
  IZ.Zoo.money += amount;
  IZ.Zoo.debt += amount;
  IZ.updateMoney();
  IZ.setSave(1); console.log("force save for borrowing");
}

IZ.fixDebt = function()
{
  if (IZ.Zoo.debt <= 0.01) {
    /* If you borrow $10, wait 10 seconds, and pay $10, it looks like your debt is
       $0.00 but it's actually something like $0.000200004. This would eventually
       grow to a visible quantity like $0.01 but by then you might not notice, and
       it could be a problem if you leave the game running unattended for a week. */
    IZ.Zoo.debt = 0;
  }
}

IZ.debtClick = function(amount) {
  if (amount === "max") {
    amount = IZ.Zoo.debt;
  }
  var devolution = IZ.Zoo.debt;
  if (devolution > amount) {
    devolution = amount;
  }
  if (IZ.Zoo.money >= devolution) {
    IZ.Zoo.debt -= devolution;
    IZ.Zoo.money -= devolution;
    IZ.fixDebt();
    IZ.setSave(1); console.log("force save for pay down debt 1");
  } else {
    IZ.Zoo.debt -= IZ.Zoo.money;
    IZ.Zoo.money = 0;
    IZ.fixDebt();
    IZ.setSave(1); console.log("force save for pay down debt 2");
  }
  IZ.updateMoney();
}

IZ.updateMoney = function()
{
  var have = "$" + IZ.fmt(IZ.Zoo.money);
  document.getElementById("have").innerHTML = have;
  var owe = "$" + IZ.fmt(IZ.Zoo.debt);
  document.getElementById("owe").innerHTML = owe;
  var cl = 50;
  for (var i=IZ.Zoo.animals.length-1; i>=0; i--) {
    if (IZ.Zoo.animals[i].own > 1) {
      cl = IZ.Zoo.animals[i+1].buyPrice * 5;
      break;
    }
  }
  IZ.Zoo.creditLimit = cl;
  document.getElementById("limit").innerHTML
                             = 'Credit Limit: ' + IZ.fmt(IZ.Zoo.creditLimit);
}

IZ.brFormula = function(id, terse) {
  var rv = "";
  try {
    var n1 = IZ.Zoo.animals[id].own;
    var d1 = IZ.Zoo.animals[id].birthRate;
    var d2 = IZ.Zoo.animals[id].own;
    var denominator = d1 + d2;
    var pct = n1 / denominator * 100;
    pct = pct.toFixed(2);
    if (terse) {
      rv = pct + "%";
    } else {
      if (d1 < 1) {
        d1 = d1.toFixed(2);
      } else if (d1 < 10) {
        d1 = d1.toFixed(1);
      } else {
        d1 = Math.floor(d1);
      }
      rv = n1 + "/(" + d1 + "+" + d2 + ")";
    }
  }
  catch(e) {
  }
  return rv;
}

// update birth rate
IZ.updateBirthRate = function(id) {
  var idBR = "birthRate" + id;
  if (IZ.Zoo.animals[id].own <= 1) {
    document.getElementById(idBR).innerHTML = ' -';
  } else {
    document.getElementById(idBR).innerHTML = IZ.brFormula(id, 1);
  }
}

IZ.drFormula = function(id, terse) {
  var rv = "";
  try {
    var n1 = IZ.Zoo.animals[id].own;
    var d1 = IZ.Zoo.animals[id].deathRate;
    var d2 = IZ.Zoo.animals[id].own * 2;
    var denominator = d1 + d2;
    var pct = n1 / denominator * 100;
    pct = pct.toFixed(2);
    if (terse) {
      rv = pct + '%';
    } else {
      if (d1 < 1) {
        d1 = d1.toFixed(2);
      } else if (d1 < 10) {
        d1 = d1.toFixed(1);
      } else {
        d1 = Math.floor(d1);
      }
      rv = n1 + '/(' + d1 + '+' + d2 + ')';
    }
  }
  catch(e) {
  }
  return rv;
}

// update death rate
IZ.updateDeathRate = function(id) {
  var idDR = "deathRate" + id;
  if (IZ.Zoo.animals[id].own <= 1) {
    document.getElementById(idDR).innerHTML = ' -';
  } else {
    document.getElementById(idDR).innerHTML = IZ.drFormula(id, 1);
  }
}

//update tooltip
IZ.updateTooltip = function(id) {
  var maxPop = IZ.Zoo.animals[id].maxPop;
  var bought = IZ.Zoo.animals[id].bought;
  var sold = IZ.Zoo.animals[id].sold;
  var born = IZ.Zoo.animals[id].born;
  var dead = IZ.Zoo.animals[id].dead;
  var quote = "";
  quote = IZ.buyRequire(id) + '  ' + IZ.qStr(id);
  var tt = 'Max population: ' + maxPop
         + '<br>&nbsp; Bought: ' + bought + ' &nbsp; Sold: ' + sold
         + '<br>&nbsp; Born: ' + born         + ' Dead: ' + dead
         + '<br>&nbsp; Birth rate: ' + IZ.brFormula(id, 0)
         + '<br>&nbsp; Death rate: ' + IZ.drFormula(id, 0)
         + '<br>' + quote;
  document.getElementById("tt" + id).innerHTML = tt;
}

// update population (with max pop added)
IZ.updatePopulation = function(id) {
  var slot = 'own' + id;
  var pop = IZ.Zoo.animals[id].own;
  pop = IZ.commas(pop);
  var maxPop = IZ.Zoo.animals[id].maxPop;
  maxPop = IZ.commas(maxPop);
  document.getElementById(slot).innerHTML = pop + '<span style="font-size:12px"><br>/' + maxPop + '</span>';
}

// buy an animal
IZ.buy = function(slot, amount) {
  // console.log("buy", slot, amount);
  if (IZ.Zoo.debt > IZ.Zoo.creditLimit.toFixed(2)) {
    alert("You can't buy animals because your debt is too high!");
    return;
  }
  var clicked = slot.id;
  if (amount === 1) {
    var id = clicked.slice(3);
  }
  if (amount === 10) {
    var id = clicked.slice(5);
  }
  if (amount === 100) {
    var id = clicked.slice(6);
  }
  if (amount === 1000) {
    var id = clicked.slice(7);
  }
  if (amount === 10000) {
    var id = clicked.slice(8);
  }
  id = parseInt(id, 10);
  buyPrice = IZ.Zoo.animals[id].buyPrice * amount;
  if (buyPrice > IZ.Zoo.money) {
    alert("You need $" + IZ.fmt(buyPrice) + " to buy " + amount + " " + IZ.animals[id].plural);
    return;
  }
  if (id > 1) {
    var minimum = (id-2)*100 + 100;
    if ((IZ.Zoo.animals[id].bought == 0)
        && (IZ.Zoo.animals[id-2].own < minimum)) {
      alert("You must have at least " + minimum + " " + IZ.animals[id-2].plural
          + " to buy your first " + IZ.animals[id].name + ".");
      return;
    }
  }
  var futureTotal = IZ.Zoo.animals[id].own + amount;
  if (futureTotal <= IZ.Zoo.animals[id].maxPop) {
    IZ.Zoo.money -= buyPrice;
    IZ.setSave(10); console.log("setSave(10) for buy animals");
    IZ.Zoo.animals[id].own += amount;
    IZ.Zoo.animals[id].bought += amount;
    var newNumber = IZ.Zoo.animals[id].own;
    newNumber = IZ.commas(newNumber);
    IZ.updatePopulation(id);
    IZ.updateMoney();
    IZ.updateBirthRate(id);
    IZ.updateDeathRate(id);
    IZ.Zoo.total += amount;
    IZ.updateTooltip(id);
    IZ.updatePFI();
  } else {
    alert("Your " + IZ.animals[id].name
      + " habitat isn't big enough to add " + amount + " "
      + IZ.animals[id].plural + ".");
  }
} // end of IZ.buy()

// sell animals
IZ.sell = function(slot, amount) {
  var clicked = slot.id;
  if (amount === 1) {
    var id = clicked.slice(4);
  }
  if (amount === 10) {
    var id = clicked.slice(6);
  }
  if (amount === 100) {
    var id = clicked.slice(7);
  }
  if (amount === 1000) {
    var id = clicked.slice(8);
  }
  if (amount === 10000) {
    var id = clicked.slice(9);
  }
  id = parseInt(id, 10);
  if (IZ.Zoo.animals[id].own < amount) {
    return;
  }
  sellPrice = IZ.Zoo.animals[id].buyPrice * IZ.Zoo.sellMarkdown;
  IZ.Zoo.money = IZ.Zoo.money + sellPrice * amount;
  IZ.setSave(10); console.log("setSave(10) for sell animals");
  IZ.Zoo.animals[id].own -= amount;
  IZ.Zoo.total -= amount;
  IZ.Zoo.animals[id].sold += amount;
  IZ.updatePopulation(id);
  IZ.updateMoney();
  IZ.updateBirthRate(id)
  IZ.updateTooltip(id);
  IZ.updatePFI();
} // end of IZ.sell()

// buy a BirthRate boost
IZ.buyBRBoost = function(slot) {
  var clicked = slot.id;
  var id = clicked.slice(2);
  id = parseInt(id, 10);
  price = IZ.Zoo.animals[id].brPrice;
  if (price > IZ.Zoo.money) { return; }
  if (IZ.Zoo.animals[id].brCount === 20) {
    alert("You can't increase the birth rate more than 20 times, per species, per zoo.");
    return;
  }
  IZ.Zoo.money -= price;
  IZ.setSave(10); console.log("setSave(10) for imprve birth rate");
  IZ.updateMoney();
  IZ.Zoo.animals[id].brCount++;
  if (IZ.Zoo.animals[id].brCount === 20) {
    document.getElementById(clicked).style.color = "#f00";
    var log = "* You maxed out the birth rate of " + IZ.animals[id].plural;
    IZ.addToLog(log)
  }
  IZ.Zoo.animals[id].brPrice *= IZ.Zoo.priceIncrement;
  var brPriceString = IZ.fmt(IZ.Zoo.animals[id].brPrice);
  IZ.Zoo.animals[id].birthRate *= IZ.Zoo.brBoostEffect;
  IZ.updateBirthRate(id);
  var  slotUpdate = 'Get a Higher Birth Rate: (' + IZ.Zoo.animals[id].brCount + ')<br>$' + brPriceString;
  document.getElementById(clicked).innerHTML = slotUpdate;
  IZ.Zoo.brBoosts++;
}

// buy a DeathRate boost
IZ.buyDRBoost = function(slot) {
  var clicked = slot.id;
  var id = clicked.slice(2);
  id = parseInt(id, 10);
  price = IZ.Zoo.animals[id].drPrice;
  if (price > IZ.Zoo.money) { return; }
  if (IZ.Zoo.animals[id].drCount === 20) {
    alert("You can't mitigate the death rate more than 20 times per species.");
    return;
  }
  IZ.Zoo.money -= price;
  IZ.setSave(10); console.log("setSave(10) for mitigate death rate");
  IZ.updateMoney();
  IZ.Zoo.animals[id].drCount++;
  if (IZ.Zoo.animals[id].drCount === 20) {
    document.getElementById(clicked).style.color = "#f00";
    var log = "* You minimized the death rate of " + IZ.animals[id].plural;
    IZ.addToLog(log)
  }
  IZ.Zoo.animals[id].drPrice *= IZ.Zoo.priceIncrement;
  var drPriceString = IZ.fmt(IZ.Zoo.animals[id].drPrice);
  IZ.Zoo.animals[id].deathRate *= IZ.Zoo.drBoostEffect;
  IZ.updateDeathRate(id);
  var  slotUpdate = 'Lower the Death Rate: (' + IZ.Zoo.animals[id].drCount + ')<br>$' + drPriceString;
  document.getElementById(clicked).innerHTML = slotUpdate;
  IZ.Zoo.drBoosts++;
}

// buy a habitat boost
IZ.buyENBoost = function(slot) {
  var clicked = slot.id;
  var id = clicked.slice(2);
  id = parseInt(id, 10);
  price = IZ.Zoo.animals[id].enPrice;
  if (price > IZ.Zoo.money) {
    return;
  }
  IZ.Zoo.money -= price;
  IZ.setSave(10); console.log("setSave(10) for expand habitat");
  IZ.Zoo.animals[id].maxPopBought += 100;
  IZ.updateMoney();
  IZ.Zoo.animals[id].enPrice += (IZ.Zoo.animals[id].maxPopBought * IZ.Zoo.animals[id].buyPrice / 10);
  var enPriceString = IZ.fmt(IZ.Zoo.animals[id].enPrice);
  IZ.Zoo.animals[id].maxPop += IZ.Zoo.animals[id].maxPopBought;
  IZ.Zoo.enBoosts++;
  IZ.Zoo.animals[id].enCount++;
  var  slotUpdate = 'Enlarge the habitat: (' + IZ.Zoo.animals[id].enCount + ')<br>$' + enPriceString;
  document.getElementById(clicked).innerHTML = slotUpdate;
}

// buy a Buy-Sell price boost
IZ.buyBSBoost = function(slot) {
  var clicked = slot.id;
  var id = clicked.slice(2);
  id = parseInt(id, 10);
  price = IZ.Zoo.animals[id].bsPrice;
  if (price > IZ.Zoo.money) { return; }
  if (IZ.Zoo.animals[id].bsCount === 20) {
    alert("You can't get higher prices more than 20 times per species.");
    return;
  }
  IZ.Zoo.money -= price;
  IZ.setSave(10); console.log("setSave(10) for species marketing");
  IZ.updateMoney();
  IZ.Zoo.animals[id].bsCount++;
  if (IZ.Zoo.animals[id].bsCount === 20) {
    document.getElementById(clicked).style.color = "#f00";
    var log = "* You maxed out prices for buying and selling " + IZ.animals[id].plural;
    IZ.addToLog(log)
  }
  IZ.Zoo.animals[id].bsPrice *= 1.5;
  var bsPriceString = IZ.fmt(IZ.Zoo.animals[id].bsPrice);
  var  slotUpdate = 'Get Higher Prices: (' + IZ.Zoo.animals[id].bsCount + ')<br>$' + bsPriceString;
  document.getElementById(clicked).innerHTML = slotUpdate;
  IZ.Zoo.animals[id].buyPrice *= IZ.Zoo.bsBoostEffect;
  var buyPriceString = IZ.fmt(IZ.Zoo.animals[id].buyPrice);
  var buyId = "buy" + id;
  document.getElementById(buyId).innerHTML = "Buy: $" + buyPriceString;
  var sellPrice = IZ.Zoo.animals[id].buyPrice * IZ.Zoo.sellMarkdown;
  var sellPriceString = IZ.fmt(sellPrice);
  var sellId = "sell" + id;
  document.getElementById(sellId).innerHTML = "Sell: $" + sellPriceString;
  IZ.Zoo.bsBoosts++;
}

// hide instructions that appear on top
IZ.hideWhat = function () {
  document.getElementById("what").style.display = "none";
  document.getElementById("animalsContainer").style.top = "180px";
}

IZ.censusSpecies = function() {
  var rv = 0;
  for (var i=0; i<IZ.Zoo.animals.length; i++) {
    if (IZ.Zoo.animals[i].own > 0) {
      rv++;
    }
  }
  return rv;
}

IZ.everGotten = function() {
  var rv = 0;
  for (var i=0; i<IZ.Zoo.animals.length; i++) {
    rv = rv + IZ.Zoo.animals[i].born   + IZ.Zoo.animals[i].bought;
//    rv = rv - IZ.Zoo.animals[i].dead   - IZ.Zoo.animals[i].sold;
  }
  return rv;
}

IZ.zooNum = function() {
  if (IZ.Zoo.resetBadges > 0) {
    return 2;
  }
  return 1;
}

IZ.newSpeciesMsg = function() {
  if (IZ.Zoo.resetBadges > 0) {
    return "Your zoo is certified to care for";
  }
  return "You are certified to care for";
}

// load saved game
IZ.loadGame = function(importText) {
  if (importText != "") {
    var saveData = JSON.parse(atob(importText));
  } else {
    if (!localStorage['IZIIGameSave']) return;
    var saveData = JSON.parse(atob(localStorage['IZIIGameSave']));
  }
  IZ.Zoo = saveData;

  for (var i=0; i<IZ.Zoo.animals.length; i++) {
    if (IZ.Zoo.time >= IZ.animals[i].wait) {
      id = IZ.Zoo.animals[i].id;
      slot = "animal" + id;
      IZ.Zoo.speciesShown = i + 1;
      document.getElementById(slot).style.display = "inherit";
      slot = "br" + id;
      document.getElementById(slot).style.display = "inline-block";
      slot = "dr" + id;
      document.getElementById(slot).style.display = "inline-block";
      slot = "bs" + id;
      document.getElementById(slot).style.display = "inline-block";
      slot = "en" + id;
      document.getElementById(slot).style.display = "inline-block";
      var log = "* <strong>" + IZ.newSpeciesMsg() + " "
         + IZ.animals[i].plural + "!&nbsp;&nbsp;</strong> "
         + IZ.buyRequire(i) + '  ' + IZ.qStr(i);
      IZ.addToLog(log);
    }
    var brPrice = IZ.Zoo.animals[i].brPrice;
    brPrice = IZ.fmt(brPrice);
    var slot = "br" + i;
    var brCount = IZ.Zoo.animals[i].brCount;
    document.getElementById(slot).innerHTML = 'Get a Higher Birth Rate: (' + brCount + ')<br>$' + brPrice;
    var drPrice = IZ.Zoo.animals[i].drPrice
    drPrice = IZ.fmt(drPrice);
    var slot = "dr" + i;
    var drCount = IZ.Zoo.animals[i].drCount;
    document.getElementById(slot).innerHTML = 'Lower the Death Rate: (' + drCount + ')<br>$' + drPrice;
    var bsPrice = IZ.Zoo.animals[i].bsPrice
    bsPrice = IZ.fmt(bsPrice);
    var slot = "bs" + i;
    var bsCount = IZ.Zoo.animals[i].bsCount;
    document.getElementById(slot).innerHTML = 'Get Higher Prices: (' + bsCount + ')<br>$' + bsPrice;
    var enPrice = IZ.Zoo.animals[i].enPrice
    enPrice = IZ.fmt(enPrice);
    var slot = "en" + i;
    document.getElementById(slot).innerHTML
      = 'Enlarge the habitat: (' + IZ.Zoo.animals[id].enCount + ')<br>$' + enPrice;
    var buyPrice = IZ.Zoo.animals[i].buyPrice;
    var sellPrice = buyPrice * IZ.Zoo.sellMarkdown;
    buyPrice = IZ.fmt(buyPrice);
    sellPrice = IZ.fmt(sellPrice);
    var slot = "buy" + i;
    document.getElementById(slot).innerHTML = 'Buy 1:  '+ buyPrice;
    slot = "sell" + i;
    document.getElementById(slot).innerHTML = 'Sell 1:  '+ sellPrice;
    IZ.updateBirthRate(i);
    IZ.updateDeathRate(i);
    IZ.updateTooltip(i);
  }
  document.getElementById("offerContainer").style.display = "none";
  for (var i=0; i<IZ.Zoo.badges.length; i++) {
    document.getElementById(IZ.Zoo.badges[i]).style.display = "inline-block";
  }
  IZ.updateMoney();
  var omegaIx = IZ.Zoo.animals.length - 1;
  if (IZ.Zoo.speciesShown < omegaIx) {
    var time = IZ.Zoo.timeSecs;
    time = IZ.commas(time);
    var price = IZ.fmt(IZ.Zoo.timePrice);
    document.getElementById("buyTime").innerHTML
      = '<div id="buyTime" onclick="IZ.buyTime()">'
      + "<h3>Invest $" + price + " in animal welfare science"
      + "<br>(will reduce the wait by " + time + " seconds)"
      + "</h3></div>";
    next = IZ.commas(next);
    document.getElementById("next").innerHTML = "<h2>Next species in " + next + " seconds</h2>";
  } else {
    document.getElementById("next").innerHTML = "<h2>"
      + ((IZ.Zoo.resetBadges <= 0) ? "You now know how to care" : "Your zoo is certified")
      + " for all the animals!</h2>";
    document.getElementById("buyTime").innerHTML = '';
  }
  document.getElementById("visitorsStatus").innerHTML = IZ.s_visitorsStatus();
  IZ.updatePFI();
  document.getElementById("visitorsTimeBuy").innerHTML = IZ.s_visitorsGMF();

  IZ.Zoo.interestCounter=8;
  IZ.updateMoney();
  document.getElementById("animalsTitle").innerHTML = "<h2>Animals (" + IZ.Zoo.total + ")</h2>";
  document.getElementById("badgesTitle").innerHTML = "<h2>Achievements (" + IZ.Zoo.badges.length + ")</h2>";
  IZ.hideBVT();
} // End of loadGame

// export save
IZ.exportSave = function() {
  var exportText = localStorage['IZIIGameSave'];
  var exportDiv = '<textarea id="exportText" rows=12 cols=50 >'
    + exportText + '</textarea><div id="exportOk" onmousedown="IZ.exportClose()">Close</div>';
  document.getElementById("exportContainer").innerHTML = exportDiv;
  document.getElementById("exportContainer").style.display="inline";
}
IZ.exportClose = function() {
  document.getElementById("exportContainer").style.display="none";
}
// import save
IZ.importSave = function() {
  var exportDiv = '<textarea id="exportText" rows=12 cols=50 >'
    + '</textarea><div id="exportOk" onmousedown="IZ.importClose()">Import</div>';
  document.getElementById("exportContainer").innerHTML = exportDiv;
  document.getElementById("exportContainer").style.display="inline";
}
IZ.importClose = function() {
  var importText = document.getElementById("exportText").value;
  localStorage['IZIIGameSave'] = importText;
  IZ.loadGame("");
  document.getElementById("exportContainer").style.display="none";
}

// reset3 actually does the "reset"
IZ.reset3 = function() {
  var oldBadges = IZ.Zoo.resetBadges;
  var thisBadges = IZ.Zoo.badges.length*2;
  var newBirthRate = [];
  var multiplier = 1 + (thisBadges / 1000);
  for (var i=0; i<IZ.Zoo.animals.length; i++) {
    newBirthRate[i] = IZ.baseBirthRates[i] / multiplier;
  }
  IZ.init();
  IZ.loadZoo();
  IZ.loadBadges();
  IZ.Zoo.resetBadges = oldBadges + thisBadges;
  for (var i=0; i<IZ.Zoo.animals.length; i++) {
    IZ.Zoo.animals[i].birthRate = newBirthRate[i];
  }
  localStorage['IZIIGameSave'] = btoa(JSON.stringify(IZ.Zoo));
  location.reload(true);
} // end of reset3()

// Confirm that player wants to start a new zoo
IZ.reset2 = function() {
  IZ.calculateBadges();
  var nbad = IZ.Zoo.badges.length*2;
  var rbad = IZ.Zoo.resetBadges;
  var mult = 1 + (nbad / 1000);
  var m2 = mult.toFixed(3);
  var r = "Are you sure you want to start a new zoo?"
        + " You will need to start from nothing,"
        + " but all animals will have a " + m2 + "x better"
        + " birth rate than they do now, because of";
  if (rbad > 0) {
    r = r + " the " + rbad + " achievements you've made running previous"
          + " zoos, and "
  }
  r = r + " the " + IZ.Zoo.badges.length + " achievements you've made running this zoo.";
  r = confirm(r);
  if (r==true) {
    IZ.reset3();
  }
} // end of reset2()

// Basic checks before allowing player to start a new zoo
IZ.reset = function() {
  IZ.fixDebt();
  if (IZ.Zoo.debt > 0) {
    alert("You can't start a new zoo until you get your current zoo out of debt (I got "
      + IZ.Zoo.debt + ").");
    return;
  }
  if (IZ.zooNum() <= 1) {
    if (IZ.censusSpecies() < 12) {
      alert("You can't start a new zoo until your first zoo has at least 12 species.");
      return;
    }
  } else {
    if (IZ.censusSpecies() < 6) {
      alert("You can't start a new zoo until your current zoo has at least 6 species.");
      return;
    }
  }
  IZ.reset2();
}

// Hard Reset - completely wipe all progress and start fresh
IZ.hardReset = function() {
  var r = confirm("Are you sure you want to completely reset everything? " +
                  "This will permanently delete all your progress, achievements, " +
                  "and saved data. You will start completely from scratch as if " +
                  "you opened the game for the first time. This action cannot be undone!");
  if (r == true) {
    // Delete the save from localStorage
    localStorage.removeItem('IZIIGameSave');
    // Reload the page to start fresh
    location.reload(true);
  }
}

// offers
IZ.offerRejected = function() {
  document.getElementById("offerContainer").style.display = "none";
  IZ.Zoo.offerNext = 0;
  IZ.Zoo.offerActive = 0;
  IZ.setSave(1); console.log("force save for decline offer");
}
IZ.offerAccepted = function() {
  document.getElementById("offerContainer").style.display = "none";
  var give = IZ.Zoo.offerGiveSpecies;
  var giveNumber = IZ.Zoo.offerGiveNumber;
  if (IZ.Zoo.animals[give].own < giveNumber) {
    var log = "* <strong>You didn't have enough " + IZ.animals[give].plural + " to accept that offer</strong>";
    IZ.addToLog(log);
    return;
  }
  IZ.Zoo.animals[give].own -= giveNumber;
  IZ.Zoo.animals[give].sold += giveNumber;
  var newNumber = IZ.Zoo.animals[give].own
  newNumber = IZ.commas(newNumber);
  var idOwn = "own" + give;
  document.getElementById(idOwn).innerHTML = newNumber;
  IZ.updateBirthRate(give);
  IZ.updateDeathRate(give);
  IZ.updateTooltip(give);

  var get = IZ.Zoo.offerGetSpecies;
  var getNumber = IZ.Zoo.offerGetNumber;
  IZ.Zoo.animals[get].own += getNumber;
  IZ.Zoo.animals[get].bought += getNumber;
  var newNumber = IZ.Zoo.animals[get].own
  newNumber = IZ.commas(newNumber);
  var idOwn = "own" + get;
  document.getElementById(idOwn).innerHTML = newNumber;
  IZ.updateBirthRate(get);
  IZ.updateDeathRate(get);
  IZ.updateTooltip(get);

  IZ.Zoo.offerAccepted++;
  IZ.Zoo.offerNext = 0;
  IZ.Zoo.offerActive = 0;
  IZ.setSave(1); console.log("force save for accept offer");

  IZ.Zoo.total = IZ.Zoo.total + getNumber - giveNumber;
  var log = "* <strong>You took " + getNumber + " " + IZ.animals[get].plural + " in exchange for " + giveNumber + " " + IZ.animals[give].plural + "</strong>";
  IZ.addToLog(log);
} // End of offerAccepted

IZ.addToLog = function (text) {
  text = text + "<br>" + document.getElementById("log").innerHTML;
  if (text.length > 100000) {
    text = text.slice(0,100000);
  }
  document.getElementById("log").innerHTML = text;
}

IZ.getFined = function(id)
{
  var log = "";
  IZ.Zoo.fines++;
  var fine = IZ.Zoo.creditLimit / 10;
  if (IZ.Zoo.money > (fine * 5)) {
    /* Force immediate payment of double the fine through court-ordered
       garnishment (added amount covers court fees). */
    fine = fine * 2;
    IZ.Zoo.money -= fine;
    IZ.setSave(1); console.log("force save for official fine");
    IZ.updateMoney();
  } else if (IZ.Zoo.animals[id].own >= 5) {
    /* They take some of your animals */
    IZ.Zoo.animals[id].own -= 5;
    fine = 0;
  } else {
    /* Somehow you have neither money nor animals.
       Normal fine: you owe this amount to the bureau, and the longer you
       wait, the more you'll have to pay (late fees) */
    IZ.Zoo.debt += fine;
    IZ.updateMoney();
    var fineDiv = '<h2>The Animal Bureau fined you for overcrowding<br>'
                + 'in your ' + IZ.animals[id].name
                + ' habitat! Check your debt.</h2>'
                + '<div id="fineOk" onmousedown="IZ.fineClose()">Close</div>';
    document.getElementById("fineContainer").innerHTML = fineDiv;
    document.getElementById("fineContainer").style.display="inline";
  }
  if (fine > 0) {
    /* They took money */
    fine = IZ.fmt(fine);
    log = "<strong>You were fined $" + fine + " for overcrowding in your "
       + IZ.animals[id].name + " habitat.</strong>";
  } else {
    /* They took animals */
    log = "<strong>The Animal Bureau removed 5 of your "
        + IZ.animals[id].plural
        + " for overcrowding in their habitat.</strong>";
  }
  IZ.addToLog(log);
}
IZ.fineClose = function() {
  document.getElementById("fineContainer").style.display="none";
}

// stats for log
IZ.createStats = function() {
  var d = new Date();
  var log = "* <strong>Stats</strong> - " + d + ":<br>- You have " + IZ.commas(IZ.Zoo.total) + " animals.<br>";
  var acq = IZ.everGotten();
  var rate = acq / IZ.Zoo.time;
  rate = IZ.fmt(rate);
  log = log + "- You have acquired a total of " + IZ.commas(acq)
            + " animals, at an average rate of " + rate + " per second.<br>";
  var totalValue = 0;
  var value = 0;
  for (i=0; i<IZ.Zoo.animals.length; i++) {
    value = IZ.Zoo.animals[i].own * IZ.Zoo.animals[i].buyPrice;
    totalValue = totalValue + value;
  }
  totalValue = totalValue * IZ.Zoo.sellMarkdown;
  log = log + "- The total selling value of your animals is $" + IZ.bigbucks(totalValue) + ".<br>";
  log = log + ((IZ.Zoo.resetBadges <= 0) ? "- You know how to care" : "- Your zoo is certified")
            + " for " + IZ.Zoo.speciesShown + " species.<br>";
  log = log + "- You bought " + IZ.Zoo.brBoosts + " birth-rate boosts.<br>";
  log = log + "- You bought " + IZ.Zoo.drBoosts + " death-rate mitigations.<br>";
  log = log + "- You bought " + IZ.Zoo.bsBoosts + " price boosts.<br>";
  log = log + "- You bought " + IZ.Zoo.enBoosts + " habitat expansions.<br>";
  log = log + "- You accepted " + IZ.Zoo.offerAccepted
            + " offers from the Incremental Office for Animal Exchange.<br>";
  log = log + "- You were fined " + IZ.Zoo.fines + " times by the Animal Bureau.<br>";
  log = log + "- You have made " + IZ.Zoo.badges.length + " achievements in this zoo.<br>";
  log = log + "- You carry " + IZ.Zoo.resetBadges + " achievement badges from previous zoos.<br>";
  if (IZ.zooNum() <= 1) {
    log = log + "- This is your first zoo.<br>";
  } else {
    var omegaIx = IZ.Zoo.animals.length - 1;
    var brsf = omegaBR / IZ.Zoo.animals[omegaIx].birthRate;
    log = log + "- Birthrates in this zoo are "
                              + brsf.toFixed(2) + "x better than in your previous zoo.<br>";
  }
  if (0) {
    log = log + "... a[33].br = " + IZ.Zoo.animals[33].birthRate + "<br>";
    log = log + "... a[34].br = " + IZ.Zoo.animals[34].birthRate + "<br>";
    log = log + "... a[35].br = " + IZ.Zoo.animals[35].birthRate + "<br>";
  }
  IZ.addToLog(log);
}

IZ.autosave = function() {
  localStorage['IZIIGameSave'] = btoa(JSON.stringify(IZ.Zoo));
}

// general loop
IZ.loop = setInterval(
function() {
  // charge interest on debt every ten seconds. Also, save
  IZ.Zoo.interestCounter++;
  if (IZ.Zoo.interestCounter === 10) {
    var debtWas = IZ.Zoo.debt;
    IZ.Zoo.interestCounter = 0;
    IZ.Zoo.debt = IZ.Zoo.debt * IZ.Zoo.interestRate;
    IZ.fixDebt();
    if (IZ.Zoo.debt != debtWas) {
      IZ.setSave(1); console.log("force save for debt increase to " + IZ.Zoo.debt);
    } else {
      IZ.setSave(10); console.log("setSave(10) for idle");
    }
    IZ.updateMoney();
  }

  // let visitors in
  IZ.Zoo.visitorsCounter++;
  if ((IZ.Zoo.visitorsCounter >= IZ.Zoo.visitorsTime) && (IZ.Zoo.visitorsTotal > 0)) {
    var species = IZ.censusSpecies();
    IZ.Zoo.visitorsCounter = 0;
    IZ.Zoo.money += (IZ.Zoo.visitorsTotal * species);
    IZ.setSave(10); console.log("setSave(10) for visitors");
    IZ.updateMoney();
    if (IZ.Zoo.visitorsLog === 0) {
      log = "<strong>* Your zoo received its first visitors!</strong>";
      IZ.addToLog(log);
      IZ.Zoo.visitorsLog = 1;
    }
  }

  var id;
  var slot;
  var next;
  // display new animals over time
  IZ.Zoo.time++;
  for (var i=IZ.Zoo.speciesShown; i<IZ.Zoo.animals.length; i++) {
    if (IZ.Zoo.time >= IZ.animals[i].wait) {
      id = IZ.Zoo.animals[i].id;
      slot = "animal" + id;
      IZ.Zoo.speciesShown = i + 1;
      document.getElementById(slot).style.display = "inherit";
      slot = "br" + id;
      document.getElementById(slot).style.display = "inline-block";
      slot = "dr" + id;
      document.getElementById(slot).style.display = "inline-block";
      slot = "bs" + id;
      document.getElementById(slot).style.display = "inline-block";
      slot = "en" + id;
      document.getElementById(slot).style.display = "inline-block";
      var log = "* <strong>" + IZ.newSpeciesMsg() + " "
        + IZ.animals[i].plural + "!&nbsp;&nbsp;</strong> "
        + IZ.buyRequire(i) + '  ' + IZ.qStr(i);
      IZ.addToLog(log);
    }
  }
  for (var i=0; i<IZ.Zoo.animals.length; i++) {
    var omegaIx = IZ.Zoo.animals.length - 1;
    if (IZ.Zoo.time >= IZ.animals[i].wait) {
      next = IZ.animals[i+1].wait - IZ.Zoo.time;
      if (IZ.Zoo.speciesShown < omegaIx) {
        var ts = IZ.Zoo.timeSecs;
        ts = IZ.commas(ts);
        var price = IZ.fmt(IZ.Zoo.timePrice);
        document.getElementById("buyTime").innerHTML =
            '<div id="buyTime" onclick="IZ.buyTime()">'
          + "<h3>Invest $" + price + " in animal welfare science"
          + "<br>(will reduce the wait by about " + ts + " seconds)"
          + "</h3></div>"
        next = IZ.commas(next);
        document.getElementById("next").innerHTML
          = "<h2>Next species in " + next + " seconds</h2>";
      } else {
        document.getElementById("next").innerHTML
          = "<h2>" + IZ.newSpeciesMsg() + " all the animals!</h2>";
        document.getElementById("buyTime").innerHTML = '';
      }
    }
  }
  // births and deaths
  for (var i=0; i<IZ.Zoo.animals.length; i++) {
    if (IZ.Zoo.animals[i].own >= IZ.Zoo.animals[i].maxPop) {
      IZ.Zoo.animals[i].own = IZ.Zoo.animals[i].maxPop;
      var id = "own" + i;
      IZ.updatePopulation(i);
      document.getElementById(id).style.color = "#f00";
    }
    var idOwn = "own" + i;
    var newborn = 0;
    var dead = 0;
    var rnd = 0;
    var max1 = 0;
    var ow = 0;
    document.getElementById(idOwn).style.color = "#000";
    if ((IZ.Zoo.animals[i].own > 1) && (IZ.Zoo.animals[i].own < IZ.Zoo.animals[i].maxPop)) {
      ow = IZ.Zoo.animals[i].own;
      max1 = ow + (IZ.Zoo.animals[i].birthRate);
      rnd = Math.random() * max1;
      max1 = Math.floor(max1);
      rnd = Math.floor(rnd);
      if (i == 8) {
        document.getElementById("debug1").innerHTML
                           = '<h2>max=' + max1 + ', rnd=' + rnd + ', own=' + ow + '</h2>';
      }
      if (rnd <= ow) {
        newborn = 1;
        IZ.Zoo.animals[i].own++;
      }
      if (newborn === 1) {
        if (IZ.Zoo.animals[i].own >= IZ.Zoo.animals[i].maxPop) {
          IZ.Zoo.animals[i].own = IZ.Zoo.animals[i].maxPop;
          document.getElementById(idOwn).style.color = "#f00";
        } else {
          document.getElementById(idOwn).style.color = "#484";
        }
        IZ.Zoo.total++;
        IZ.Zoo.animals[i].born++;
      }
      max1 = ow * 2 + (IZ.Zoo.animals[i].deathRate);
      rnd = Math.random() * max1;
      max1 = Math.floor(max1);
      rnd = Math.floor(rnd);
      if (i == 8) {
        document.getElementById("debug2").innerHTML
                           = '<h2>max=' + max1 + ', rnd=' + rnd + ', own=' + ow + '</h2>';
      }
      if (rnd <= ow) {
        dead = 1;
        IZ.Zoo.animals[i].own--;
      }
      if (dead === 1) {
        document.getElementById(idOwn).style.color = "#a44";
        IZ.Zoo.total--;
        IZ.Zoo.animals[i].dead++;
      }
    }
    IZ.updatePopulation(i);
    IZ.updateBirthRate(i);
    IZ.updateDeathRate(i);
    IZ.updateTooltip(i);
    if (IZ.Zoo.animals[i].own === IZ.Zoo.animals[i].maxPop) {
      var fine = Math.random() * 100000;
      if (Math.floor(fine) === 12345) {
        IZ.getFined(i);
      }
    }
  }

  // offers
  if (IZ.Zoo.offerNext === 0) {
    var random = Math.round(Math.random() * 111);
    IZ.Zoo.offerNext = IZ.Zoo.time + 111 + random;
  }

  if ((IZ.Zoo.time >= IZ.Zoo.offerNext) && (IZ.Zoo.offerActive === 0)) {
    var getSpecies = 0;
    var giveSpecies = 0;
    var getNumber = 0;
    var giveNumber = 0;
    if (IZ.Zoo.animals[0].own === 0 || IZ.Zoo.animals[1].own === 0) {
      IZ.Zoo.offerNext = 0;
    } else {
      // choose species for offer
      for (i=IZ.Zoo.animals.length-1; i>0; i--) {
        if (IZ.Zoo.animals[i].own > 0) {
          getSpecies = i;
          giveSpecies = i-1;
          break;
        }
      }
      if (giveSpecies == 0) {
        IZ.Zoo.offerNext = 0;
      }
    }
    if (IZ.Zoo.offerNext > 0) {
      getNumber = Math.ceil(Math.random() * 10);
      if (IZ.Zoo.animals[giveSpecies].own >= 10) {
        giveNumber = Math.ceil(Math.random() * 10);
      } else {
        giveNumber = Math.ceil(Math.random() * IZ.Zoo.animals[giveSpecies].own);
      }
      IZ.Zoo.offerGiveSpecies = giveSpecies;
      IZ.Zoo.offerGiveNumber = giveNumber;
      IZ.Zoo.offerGetSpecies = getSpecies;
      IZ.Zoo.offerGetNumber = getNumber;
      document.getElementById("offer").innerHTML = '<h2>Get ' + getNumber + ' '
        + IZ.animals[getSpecies].plural + '<br>in exchange for<br>'
        + giveNumber + ' ' + IZ.animals[giveSpecies].plural + '</h2>';
      document.getElementById("offerContainer").style.display = "inline";
      IZ.Zoo.offerActive = 1;
      IZ.setSave(1); console.log("force save for create offer");
    }
  } else if (IZ.Zoo.offerActive) {
      document.getElementById("offer").innerHTML = '<h2>Get ' + IZ.Zoo.offerGetNumber + ' '
        + IZ.animals[IZ.Zoo.offerGetSpecies].plural + '<br>in exchange for<br>'
        + IZ.Zoo.offerGiveNumber + ' '
        + IZ.animals[IZ.Zoo.offerGiveSpecies].plural + '</h2>';
      document.getElementById("offerContainer").style.display = "inline";
  }


  document.getElementById("animalsTitle").innerHTML = "<h2>Animals (" + IZ.Zoo.total + ")</h2>";
  document.getElementById("badgesTitle").innerHTML = "<h2>Achievements ("
      + IZ.Zoo.badges.length + ") <span style='font-size:10px'>(Click to update)</span></h2>";
  for (var i=0; i<IZ.Zoo.animals.length; i++) {
    if (IZ.Zoo.animals[i].own > IZ.Zoo.animals[i].maxOwn) {
      IZ.Zoo.animals[i].maxOwn = IZ.Zoo.animals[i].own;
    }
  }
  if (IZ.Zoo.total > IZ.Zoo.maxTotal) {
    IZ.Zoo.maxTotal = IZ.Zoo.total;
  }

  // Force a save if flagged
  if (needSave > 0) {
    needSave--;
    if (needSave <= 0) {
      console.log("saving...");
      IZ.autosave();
      needSave = 0;
    }
  }
}, 1000);

// start
window.onload = function() {
  IZ.init();
  IZ.loadZoo();
  IZ.loadBadges();
  IZ.loadGame("");
}