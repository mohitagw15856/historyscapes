/* ============================================================
   Saga 02 — The Odyssey — journey data
   Contributors: edit THIS file. Coordinates are positions on
   the 1000x620 mythic chart (not strict geography — half these
   places are legendary). Every stop needs all three persona facts.
   ============================================================ */

const ODYSSEY_DATA = {
  title: "The Odyssey",
  intro:
    "The war is won. Odysseus — king of Ithaca, inventor of the Trojan Horse — " +
    "sets sail for home with 12 ships and around 600 men. The trip should take " +
    "a few weeks. It takes ten years, and he arrives alone. This is the map of " +
    "why.",
  stops: [
    {
      id: 1, name: "Troy", sub: "The voyage begins", icon: "🔥", x: 900, y: 150,
      years: "Year 0",
      story:
        "Troy smoulders behind them as twelve ships catch the wind for Ithaca. The men are " +
        "veterans, the holds are full of plunder, and home is maybe three weeks away. But " +
        "Odysseus's cunning won the war by tricking a god's favourite city — and Poseidon, " +
        "Athena and the sea itself keep long memories.",
      facts: {
        explorer: "Ithaca is only about 900 km from Troy — a modern car could drive it in a day. Odysseus is about to spend TEN YEARS covering that distance.",
        moviebuff: "Nolan's The Odyssey (2026) opens with this departure — a war epic pivoting into a survival voyage in a single cut. It was shot with IMAX film cameras on real Mediterranean coastlines.",
        historian: "The Odyssey was composed around the 8th century BCE, in 24 books of dactylic hexameter, and opens mid-story — in medias res — a device storytellers have copied ever since.",
      },
    },
    {
      id: 2, name: "The Cicones", sub: "Ismarus, land of the first mistake", icon: "⚔️", x: 790, y: 95,
      years: "Year 1",
      story:
        "First stop: a raid on Ismarus, city of the Cicones. It goes well — until Odysseus's " +
        "men refuse to leave, feasting on the beach 'like fools.' The Cicones return with " +
        "reinforcements at dawn and kill six men from every ship. Lesson one of the voyage: " +
        "the crew's greed is as dangerous as any monster.",
      facts: {
        explorer: "The crew's first enemy wasn't a monster — it was not knowing when to stop partying. Six sailors from every ship were lost because nobody would leave the beach!",
        moviebuff: "Screenwriters call this the 'mirror moment' setup: every disaster in the Odyssey rhymes with this one — the crew ignores good advice, and pays.",
        historian: "The Cicones were a real Thracian people; Homer's Ismarus was famous for its wine — the same strong wine Odysseus carries onward and later uses on the Cyclops. A neat bit of narrative continuity.",
      },
    },
    {
      id: 3, name: "The Lotus-Eaters", sub: "The island of forgetting", icon: "🌸", x: 640, y: 520,
      years: "Year 1",
      story:
        "Storms drive the fleet off the map. They land among the Lotus-Eaters, gentle hosts " +
        "who offer the sweet lotus fruit. Whoever eats it forgets home entirely — forgets " +
        "Ithaca, family, the voyage, everything — and wants only to stay, grazing on " +
        "forgetfulness. Odysseus has to drag his weeping scouts back to the ships and tie " +
        "them to the benches.",
      facts: {
        explorer: "A fruit so tasty it made sailors forget their own homes! Odysseus had to carry his friends back to the ship while they cried about leaving the snacks.",
        moviebuff: "Every 'seductive trap' episode in fiction — the Matrix's blue pill, Star Trek's pleasure planets — is a descendant of this island. Comfort as the enemy of the journey.",
        historian: "Ancient geographers placed the Lotus-Eaters on the Libyan/Tunisian coast, possibly Djerba. Candidates for the 'lotus' include jujube fruit and blue water-lily — both mildly narcotic in folklore.",
      },
    },
    {
      id: 4, name: "The Cyclops", sub: "Polyphemus's cave", icon: "👁️", x: 480, y: 420,
      years: "Year 1",
      story:
        "The most famous stop. Trapped in the cave of Polyphemus — a one-eyed giant who eats " +
        "six of the crew — Odysseus gets him drunk on Ismarian wine, tells him his name is " +
        "'Nobody,' and blinds him with a sharpened stake. When Polyphemus roars for help, his " +
        "neighbours hear 'Nobody is hurting me!' and go back to bed. The escape is perfect... " +
        "until Odysseus, sailing away, can't resist shouting his real name. Polyphemus tells " +
        "his father: Poseidon, god of the sea they must now cross.",
      facts: {
        explorer: "The 'Nobody' trick is 3,000 years old and still the cleverest escape in any story. But then Odysseus ruined it by bragging — never tell the giant your real name!",
        moviebuff: "O Brother, Where Art Thou? turned Polyphemus into a one-eyed Bible salesman played by John Goodman — the Coen brothers' whole film is the Odyssey in 1930s Mississippi.",
        historian: "One theory for the Cyclops legend: ancient Greeks finding fossil skulls of dwarf elephants on Mediterranean islands — the large central nasal cavity looks uncannily like a single eye socket.",
      },
    },
    {
      id: 5, name: "Aeolus", sub: "The bag of winds", icon: "💨", x: 390, y: 300,
      years: "Year 1–2",
      story:
        "The wind-king Aeolus gifts Odysseus every contrary wind tied up in a leather bag, " +
        "leaving only the gentle west wind to blow them home. For nine days they sail; on the " +
        "tenth, Ithaca is in sight — close enough to see people tending fires. Odysseus, " +
        "exhausted, falls asleep. The crew, convinced the bag holds hidden treasure, opens " +
        "it. The escaping storm hurls them all the way back to Aeolus, who refuses to help " +
        "twice: clearly, this man is cursed.",
      facts: {
        explorer: "They could SEE home — actual smoke from actual Ithaca chimneys — when the crew opened the mystery bag. Whoosh. All the way back to the start. Worst moment to get curious, ever.",
        moviebuff: "This is the cruellest 'so close' beat in literature — the same gut-punch engine behind every heist film where the alarm trips at the last second.",
        historian: "Aeolus's floating island was later identified with the Aeolian Islands north of Sicily — still named after him today, and still volcanic and windswept.",
      },
    },
    {
      id: 6, name: "The Laestrygonians", sub: "Harbour of the giants", icon: "🪨", x: 300, y: 180,
      years: "Year 2",
      story:
        "A beautiful natural harbour, cliffs on all sides. Eleven ships anchor inside; only " +
        "Odysseus, oddly cautious, moors outside the entrance. The Laestrygonians — giants — " +
        "appear on the cliffs and hurl boulders down onto the trapped fleet, spearing sailors " +
        "'like fish.' Eleven ships are destroyed in minutes. Only Odysseus's own ship, " +
        "anchored outside, escapes. Six hundred men have become forty-five.",
      facts: {
        explorer: "The perfect-looking harbour was actually a trap — like a bathtub you can't climb out of. Odysseus parked outside 'just in case,' and it saved his ship. Trust the careful instinct!",
        moviebuff: "This is the Odyssey's 'Red Wedding' — the sudden, brutal loss that resets the stakes. From here on it's one ship against the sea.",
        historian: "Homer describes a place where 'the paths of night and day are close' — some scholars read this as garbled sailors' reports of high-latitude summer nights, brought home along ancient trade routes.",
      },
    },
    {
      id: 7, name: "Circe", sub: "The witch of Aeaea", icon: "🐷", x: 430, y: 150,
      years: "Year 2–3",
      story:
        "On Aeaea, the enchantress Circe welcomes a scouting party with a feast — then taps " +
        "them with her wand and turns them into pigs. Armed with a protective herb from " +
        "Hermes (the mysterious 'moly'), Odysseus resists her magic and makes her restore " +
        "his men. Then, strangely, the voyage pauses: Circe becomes an ally, and the crew " +
        "stays a full year feasting and recovering, until the men beg Odysseus to remember " +
        "Ithaca. Her parting advice: to get home, you must first sail to the Land of the Dead.",
      facts: {
        explorer: "Circe turned sailors into actual pigs! But the strangest part: she then became their friend, and everyone stayed at her house for a whole year. Even epic heroes need a rest stop.",
        moviebuff: "Madeline Miller's novel Circe (2018) retold this whole saga from the witch's point of view and became a global bestseller — proof these characters still headline stories 28 centuries later.",
        historian: "The Greeks located Aeaea at Monte Circeo on Italy's west coast, which is still called that today. 'Moly' has been speculatively identified as the snowdrop — which contains galantamine, a real anticholinergic-poisoning antidote.",
      },
    },
    {
      id: 8, name: "Land of the Dead", sub: "The edge of the world", icon: "💀", x: 110, y: 90,
      years: "Year 3",
      story:
        "At the world's misty edge, Odysseus digs a trench, pours offerings, and calls the " +
        "dead. The prophet Tiresias tells him how to get home — and warns him not to touch " +
        "the cattle of the Sun. Then come the harder meetings: his mother, who died of grief " +
        "waiting for him; and Achilles, greatest of the Greeks, who delivers the Odyssey's " +
        "darkest line — he would rather be a living farmhand than king of all the dead.",
      facts: {
        explorer: "Odysseus talked to ghosts to get directions home! He met his old friend Achilles, who told him a secret: being alive and ordinary beats being a famous ghost, every time.",
        moviebuff: "Every 'hero visits the underworld' scene — from Gladiator's wheat fields to Harry Potter's King's Cross — walks a path Homer paved in Book 11.",
        historian: "The nekyia (summoning the dead) is the oldest surviving underworld journey in Greek literature — a scene so influential that Virgil, Dante and Milton each rebuilt their afterlives on its floor plan.",
      },
    },
    {
      id: 9, name: "The Sirens", sub: "The song no one survives", icon: "🎶", x: 200, y: 300,
      years: "Year 3",
      story:
        "The Sirens' song pulls sailors onto the rocks — no one who hears it survives. " +
        "Odysseus, incurably curious, wants to be the first. Following Circe's advice, he " +
        "plugs his crew's ears with beeswax and has himself lashed to the mast, ordered to " +
        "be ignored no matter how he begs. The song promises not beauty but knowledge — " +
        "'we know everything that happens on the earth.' He screams to be untied. The crew " +
        "rows on.",
      facts: {
        explorer: "Odysseus found the one cheat code for an unbeatable monster: tie yourself up first! He's the only person in any story who heard the Sirens' song and lived.",
        moviebuff: "'Tied to the mast' is now an actual term in economics and psychology for locking your future self out of bad choices — named directly after this scene.",
        historian: "In Homer, Sirens aren't mermaids — later Greek art shows them as bird-bodied women. Their bribe is telling: they tempt Odysseus with total knowledge, the one thing the cleverest Greek can't resist.",
      },
    },
    {
      id: 10, name: "Scylla & Charybdis", sub: "The impossible strait", icon: "🌀", x: 300, y: 420,
      years: "Year 3",
      story:
        "A narrow strait, two monsters. On one side Charybdis, a whirlpool that swallows " +
        "the sea three times a day; on the other Scylla, six heads on serpent necks, each " +
        "taking a sailor from any passing deck. Circe's grim arithmetic: sail close to " +
        "Scylla, because losing six men is better than losing everyone. Odysseus obeys, " +
        "and hears his six scream his name as they're lifted away — the hardest moment, " +
        "he says, of the entire voyage.",
      facts: {
        explorer: "'Between Scylla and Charybdis' means being stuck between two bad choices — like picking between broccoli and spinach, except the broccoli has six heads.",
        moviebuff: "This is cinema's original trolley problem: the captain who must choose which of his own people to lose. Every submarine and disaster movie has restaged it.",
        historian: "Tradition places the strait at Messina, between Sicily and Italy, where real tidal vortices form. 'Charybdis' swallowing the sea thrice daily may preserve a garbled account of its tidal cycle.",
      },
    },
    {
      id: 11, name: "Cattle of the Sun", sub: "Thrinacia, the forbidden feast", icon: "🐄", x: 400, y: 520,
      years: "Year 3",
      story:
        "Tiresias's warning was explicit: whatever happens, do not eat the cattle of Helios. " +
        "Storms trap the crew on the island for a month; the food runs out. While Odysseus " +
        "sleeps, the starving crew slaughters the sacred herd — the meat lows on the spits " +
        "as it cooks, a divine horror-show. Helios demands justice. Back at sea, Zeus's " +
        "thunderbolt shatters the last ship. Everyone drowns except the one man who didn't " +
        "eat: Odysseus, clinging to wreckage.",
      facts: {
        explorer: "The cooked meat MOOED on the grill — the universe's way of saying 'you really shouldn't have.' Only Odysseus skipped the forbidden barbecue, and only Odysseus survived.",
        moviebuff: "The Odyssey's opening lines spoil this ending on purpose: 'they perished through their own blind folly.' Homer invented the spoiler-that-makes-it-worse, 2,700 years before Titanic.",
        historian: "Thrinacia ('three-pointed') was identified by the ancients with Sicily, whose triangular shape earned it the name Trinacria — still on Sicily's flag today as the three-legged triskelion.",
      },
    },
    {
      id: 12, name: "Calypso", sub: "Seven years on Ogygia", icon: "🏝️", x: 150, y: 520,
      years: "Years 3–10",
      story:
        "Odysseus washes up alone on Ogygia, island of the nymph Calypso. She heals him, " +
        "loves him — and keeps him. For seven years. She even offers the ultimate prize: " +
        "immortality, if he'll stay forever. He refuses it. Every day he sits on the shore " +
        "weeping for Ithaca and for Penelope — a mortal wife, a mortal life. Finally Athena " +
        "lobbies Zeus, Hermes delivers the order, and Calypso, heartbroken, helps him build " +
        "a raft.",
      facts: {
        explorer: "Calypso offered Odysseus the chance to live FOREVER on a paradise island — and he said no thanks, I miss my family. Seven whole years of homesickness couldn't wear him down.",
        moviebuff: "This is the emotional core Nolan's film reportedly centres on: a man offered eternity who chooses mortality. Refusing immortality is the single most-quoted 'theme statement' in the whole epic.",
        historian: "Odysseus spends more time on Ogygia — seven of the ten years — than everywhere else combined. The famous monsters occupy mere weeks; the epic's real subject is endurance, not adventure.",
      },
    },
    {
      id: 13, name: "The Phaeacians", sub: "Scheria, the last harbour", icon: "🛶", x: 120, y: 380,
      years: "Year 10",
      story:
        "Poseidon spots the raft and smashes it in one last storm. Odysseus swims two days " +
        "to Scheria, crawling ashore naked with nothing left — no ship, no crew, no treasure, " +
        "not even a name. Princess Nausicaa finds him; the Phaeacian court hosts a feast. " +
        "When a bard sings of the Trojan Horse, the stranger begins to weep — and at last " +
        "reveals himself. Everything we know of the voyage, Odysseus tells here. The " +
        "Phaeacians, master sailors, carry him home in a single magical night.",
      facts: {
        explorer: "Odysseus arrived with literally nothing — not even clothes! — and left on the fastest ship in the world. Sometimes you have to lose everything before the last stroke of luck finds you.",
        moviebuff: "Homer's structure is radical: stops 2–11 are all flashback, narrated by Odysseus at this dinner table. The unreliable first-person war story — Usual Suspects, Life of Pi — starts at this feast.",
        historian: "Scheria was identified by the ancients with Corfu. Some scholars read the Phaeacians' effortless ships and rich gardens as a memory of Minoan-era sea power, refracted through centuries of retelling.",
      },
    },
    {
      id: 14, name: "Ithaca", sub: "Home — and one last fight", icon: "🏹", x: 170, y: 230,
      years: "Year 10 · journey's end",
      story:
        "Twenty years after leaving, Odysseus wakes on his own beach — and Athena disguises " +
        "him as a beggar, because home has become enemy territory: 108 suitors squat in his " +
        "hall, courting Penelope and eating his kingdom. Only his old dog Argos recognises " +
        "him — wagging his tail once before dying. Penelope, as cunning as her husband, " +
        "announces a contest: she'll marry whoever can string Odysseus's great bow. Only " +
        "one man in the hall can. He strings it, turns, and the reckoning begins. Then, " +
        "at last: Penelope tests him with the secret of their marriage bed — carved from " +
        "a living olive tree, immovable — and twenty years of distance close in one embrace.",
      facts: {
        explorer: "After 20 years, his dog Argos still recognised him first — one happy tail wag after two decades of waiting. And Penelope had her own trick: a secret about their bed that only the real Odysseus could know.",
        moviebuff: "The bow-stringing reveal is the granddaddy of every 'hidden badass' scene — John Wick in the casino, Aragorn at the Council. Audiences have loved this exact beat for 2,700 years.",
        historian: "Penelope's loom trick — weaving a shroud by day, unpicking it by night for three years — makes her Odysseus's true intellectual equal. Modern Ithaca (Ithaki) still stands, though whether Homer's palace is there remains an open dig.",
      },
    },
  ],
};
