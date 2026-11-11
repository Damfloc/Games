/**
 * BANG! Card Database, Expansions & Character Registry
 * Contains official card pools for Base Game, Dodge City, High Noon, Wild West Show, and Gold Rush.
 */

(function(global) {
  'use strict';

  // 1. BASE CARDS (80 Cards Total)
  // Suits: H (Hearts), D (Diamonds), C (Clubs), S (Spades)
  const BASE_CARDS = [
    // Brown Actions (63 Total)
    ...Array(25).fill().map((_, i) => ({ id: `bang_${i}`, name: "BANG!", type: "brown", suit: ["C","D","S","H"][i%4], value: (i%13)+1, icon: "🔫", desc: "Shoot a player in weapon range." })),
    ...Array(12).fill().map((_, i) => ({ id: `missed_${i}`, name: "Missed!", type: "brown", suit: ["C","S"][i%2], value: (i%13)+1, icon: "🛡️", desc: "Cancel a BANG! shot against you." })),
    ...Array(6).fill().map((_, i) => ({ id: `beer_${i}`, name: "Beer", type: "brown", suit: "H", value: (i%6)+6, icon: "🍺", desc: "Regain 1 Life Point. (Not usable in 1v1)." })),
    ...Array(4).fill().map((_, i) => ({ id: `panic_${i}`, name: "Panic!", type: "brown", suit: ["H","D"][i%2], value: (i%4)+8, icon: "🫳", desc: "Draw 1 card from a player at distance 1." })),
    ...Array(4).fill().map((_, i) => ({ id: `cat_balou_${i}`, name: "Cat Balou", type: "brown", suit: ["D","H","C","S"][i%4], value: (i%4)+9, icon: "💥", desc: "Force any player to discard 1 card." })),
    ...Array(3).fill().map((_, i) => ({ id: `duel_${i}`, name: "Duel", type: "brown", suit: ["D","C","S"][i%3], value: (i%3)+11, icon: "⚔️", desc: "Challenge a player. Alternate playing BANG! First to fail loses 1 LP." })),
    ...Array(2).fill().map((_, i) => ({ id: `stagecoach_${i}`, name: "Stagecoach", type: "brown", suit: "S", value: 9, icon: "🐴", desc: "Draw 2 cards from deck. (Triggers Wild West Show!)" })),
    ...Array(2).fill().map((_, i) => ({ id: `indians_${i}`, name: "Indians!", type: "brown", suit: "D", value: (i === 0 ? 1 : 13), icon: "🏹", desc: "All other players must discard a BANG! or lose 1 LP." })),
    ...Array(2).fill().map((_, i) => ({ id: `general_store_${i}`, name: "General Store", type: "brown", suit: ["C","S"][i], value: (i === 0 ? 9 : 12), icon: "🏬", desc: "Reveal cards for each player. Each chooses 1 in turn order." })),
    { id: "gatling_0", name: "Gatling", type: "brown", suit: "H", value: 10, icon: "🔥", desc: "Shoot at ALL other players! Each must play Missed! or lose 1 LP." },
    { id: "saloon_0", name: "Saloon", type: "brown", suit: "H", value: 5, icon: "🥂", desc: "All living players regain 1 Life Point." },
    { id: "wells_fargo_0", name: "Wells Fargo", type: "brown", suit: "H", value: 3, icon: "💰", desc: "Draw 3 cards from deck. (Triggers Wild West Show!)" },

    // Blue Equipment (17 Total)
    ...Array(3).fill().map((_, i) => ({ id: `schofield_${i}`, name: "Schofield", type: "blue", sub: "weapon", range: 2, suit: ["C","S"][i%2], value: (i%3)+11, icon: "🎯", desc: "Weapon: Reach targets up to distance 2." })),
    ...Array(2).fill().map((_, i) => ({ id: `volcanic_${i}`, name: "Volcanic", type: "blue", sub: "weapon", range: 1, unlimitedBang: true, suit: ["S","C"][i], value: 10, icon: "⚡", desc: "Weapon: Range 1. You may play any number of BANG! cards." })),
    { id: "remington_0", name: "Remington", type: "blue", sub: "weapon", range: 3, suit: "C", value: 13, icon: "🎯", desc: "Weapon: Reach targets up to distance 3." },
    { id: "rev_carabine_0", name: "Rev. Carabine", type: "blue", sub: "weapon", range: 4, suit: "C", value: 1, icon: "🎯", desc: "Weapon: Reach targets up to distance 4." },
    { id: "winchester_0", name: "Winchester", type: "blue", sub: "weapon", range: 5, suit: "S", value: 8, icon: "🎯", desc: "Weapon: Reach targets up to distance 5." },
    ...Array(2).fill().map((_, i) => ({ id: `mustang_${i}`, name: "Mustang", type: "blue", sub: "horse", suit: "H", value: (i === 0 ? 8 : 9), icon: "🐎", desc: "Other players see you at distance +1." })),
    ...Array(2).fill().map((_, i) => ({ id: `barrel_${i}`, name: "Barrel", type: "blue", sub: "barrel", suit: "S", value: (i === 0 ? 12 : 13), icon: "🛢️", desc: "When shot by BANG!, flip top card. Hearts = dodge!" })),
    ...Array(3).fill().map((_, i) => ({ id: `jail_${i}`, name: "Jail", type: "blue", sub: "jail", suit: ["S","H"][i%2], value: (i%3)+10, icon: "🔒", desc: "Play on a player (not Sheriff). Flip Hearts at turn start or skip turn." })),
    { id: "scope_0", name: "Scope", type: "blue", sub: "scope", suit: "S", value: 1, icon: "🔭", desc: "You see all other players at distance -1." },
    { id: "dynamite_0", name: "Dynamite", type: "blue", sub: "dynamite", suit: "H", value: 2, icon: "🧨", desc: "Flip at turn start. Spades 2-9 explodes for 3 dmg! Otherwise passes left." }
  ];

  // 2. DODGE CITY EXPANSION DECK (40 Cards)
  const DODGE_CITY_CARDS = [
    // Green Delayed Actions (15 Total - Played face up, activated on subsequent turn by discarding)
    { id: "dc_iron_plate_0", name: "Iron Plate", type: "green", suit: "D", value: 1, icon: "🛡️", desc: "Discard to cancel a BANG! (acts as Missed!)." },
    { id: "dc_iron_plate_1", name: "Iron Plate", type: "green", suit: "S", value: 12, icon: "🛡️", desc: "Discard to cancel a BANG! (acts as Missed!)." },
    { id: "dc_dodge_0", name: "Dodge", type: "green", suit: "H", value: 13, icon: "🏃", desc: "Discard to cancel a BANG! AND draw 1 card." },
    { id: "dc_dodge_1", name: "Dodge", type: "green", suit: "C", value: 7, icon: "🏃", desc: "Discard to cancel a BANG! AND draw 1 card." },
    { id: "dc_bible_0", name: "Bible", type: "green", suit: "H", value: 10, icon: "📖", desc: "Discard to cancel a BANG! AND draw 1 card." },
    { id: "dc_sombrero_0", name: "Sombrero", type: "green", suit: "C", value: 7, icon: "🤠", desc: "Discard to cancel a BANG! (acts as Missed!)." },
    { id: "dc_ten_gallon_0", name: "Ten Gallon Hat", type: "green", suit: "C", value: 10, icon: "🎩", desc: "Discard to cancel a BANG! (acts as Missed!)." },
    { id: "dc_canteen_0", name: "Canteen", type: "green", suit: "H", value: 7, icon: "🍶", desc: "Discard to regain 1 Life Point." },
    { id: "dc_pony_express_0", name: "Pony Express", type: "green", suit: "D", value: 10, icon: "🐎", desc: "Discard to draw 3 cards from deck." },
    { id: "dc_conestoga_0", name: "Conestoga", type: "green", suit: "D", value: 9, icon: "🛒", desc: "Discard to steal 1 card from any player regardless of distance." },
    { id: "dc_howitzer_0", name: "Howitzer", type: "green", suit: "S", value: 9, icon: "💣", desc: "Discard to fire a Gatling at all other players." },
    { id: "dc_pepperbox_0", name: "Pepperbox", type: "green", suit: "C", value: 12, icon: "🔫", desc: "Discard to shoot a BANG! at a player in range." },
    { id: "dc_buffalo_rifle_0", name: "Buffalo Rifle", type: "green", suit: "C", value: 13, icon: "🎯", desc: "Discard to shoot a BANG! at any player regardless of distance." },
    { id: "dc_knife_0", name: "Knife", type: "green", suit: "H", value: 8, icon: "🗡️", desc: "Discard to shoot a BANG! at distance 1." },
    { id: "dc_derringer_0", name: "Derringer", type: "green", suit: "S", value: 7, icon: "🔫", desc: "Discard to shoot a BANG! at distance 1 AND draw 1 card from them." },

    // Brown / Blue Discard-to-Play Mechanics & Extra Copies (25 Total)
    { id: "dc_punch_0", name: "Punch", type: "brown", suit: "H", value: 10, icon: "🥊", desc: "Shoot a BANG! at distance 1. Does not count toward turn limit." },
    { id: "dc_springfield_0", name: "Springfield", type: "brown", discardCost: 1, suit: "S", value: 13, icon: "🎯", desc: "Discard 1 extra card: Shoot a BANG! at any distance." },
    { id: "dc_tequila_0", name: "Tequila", type: "brown", discardCost: 1, suit: "C", value: 9, icon: "🍾", desc: "Discard 1 extra card: Regain 1 Life Point." },
    { id: "dc_whiskey_0", name: "Whiskey", type: "brown", discardCost: 1, suit: "H", value: 12, icon: "🥃", desc: "Discard 1 extra card: Regain 2 Life Points!" },
    { id: "dc_brawl_0", name: "Brawl", type: "brown", discardCost: 1, suit: "S", value: 11, icon: "💥", desc: "Discard 1 extra card: Force ALL other players to discard 1 card." },
    { id: "dc_rag_time_0", name: "Rag Time", type: "brown", discardCost: 1, suit: "H", value: 9, icon: "🪕", desc: "Discard 1 extra card: Steal 1 card from any player regardless of distance." },
    ...Array(4).fill().map((_, i) => ({ id: `dc_bang_${i}`, name: "BANG!", type: "brown", suit: ["S","C","D"][i%3], value: (i%5)+4, icon: "🔫", desc: "Shoot a player in weapon range." })),
    ...Array(3).fill().map((_, i) => ({ id: `dc_missed_${i}`, name: "Missed!", type: "brown", suit: ["D","C"][i%2], value: (i%3)+6, icon: "🛡️", desc: "Cancel a BANG! shot against you." })),
    ...Array(2).fill().map((_, i) => ({ id: `dc_beer_${i}`, name: "Beer", type: "brown", suit: "H", value: (i%2)+6, icon: "🍺", desc: "Regain 1 Life Point." })),
    ...Array(2).fill().map((_, i) => ({ id: `dc_panic_${i}`, name: "Panic!", type: "brown", suit: "H", value: 11, icon: "🫳", desc: "Draw 1 card from a player at distance 1." })),
    ...Array(2).fill().map((_, i) => ({ id: `dc_cat_balou_${i}`, name: "Cat Balou", type: "brown", suit: "C", value: 8, icon: "💥", desc: "Force any player to discard 1 card." })),
    { id: "dc_indians_0", name: "Indians!", type: "brown", suit: "D", value: 5, icon: "🏹", desc: "All other players must discard a BANG! or lose 1 LP." },
    { id: "dc_general_store_0", name: "General Store", type: "brown", suit: "S", value: 10, icon: "🏬", desc: "Draft 1 card per player." },
    { id: "dc_silver_0", name: "Silver", type: "blue", sub: "weapon", range: 2, suit: "D", value: 13, icon: "🎯", desc: "Weapon: Reach targets up to distance 2." },
    { id: "dc_remington_extra", name: "Remington", type: "blue", sub: "weapon", range: 3, suit: "H", value: 6, icon: "🎯", desc: "Weapon: Reach targets up to distance 3." },
    { id: "dc_barrel_extra", name: "Barrel", type: "blue", sub: "barrel", suit: "C", value: 13, icon: "🛢️", desc: "When shot by BANG!, flip top card. Hearts = dodge!" },
    { id: "dc_hideout_0", name: "Hideout", type: "blue", sub: "horse", suit: "D", value: 13, icon: "🛖", desc: "Other players see you at distance +1 (stacks with Mustang!)." },
    { id: "dc_binoculars_0", name: "Binoculars", type: "blue", sub: "scope", suit: "D", value: 10, icon: "🔭", desc: "You see all other players at distance -1 (stacks with Scope!)." }
  ];

  // 3. HIGH NOON EVENT DECK (13 Cards - High Noon at bottom)
  const HIGH_NOON_EVENTS = [
    { id: "hn_blessing", name: "Blessing", desc: "All cards are considered Hearts for this entire round.", effect: "hearts_suit" },
    { id: "hn_curse", name: "Curse", desc: "All cards are considered Spades for this entire round.", effect: "spades_suit" },
    { id: "hn_ghost_town", name: "Ghost Town", desc: "Eliminated players return as ghosts with 3 cards for this round.", effect: "ghosts" },
    { id: "hn_gold_rush", name: "Gold Rush", desc: "Turns proceed in reverse (counter-clockwise) order.", effect: "reverse_order" },
    { id: "hn_hangover", name: "Hangover", desc: "All character special abilities are disabled for this round.", effect: "no_abilities" },
    { id: "hn_shootout", name: "Shootout", desc: "Each player may play a second BANG! card on their turn.", effect: "extra_bang" },
    { id: "hn_the_reverend", name: "The Reverend", desc: "No Beer cards can be played this round.", effect: "no_beer" },
    { id: "hn_train_arrival", name: "Train Arrival", desc: "Each player draws 1 additional card at the start of their turn.", effect: "draw_extra" },
    { id: "hn_thirst", name: "Thirst", desc: "Each player draws 1 fewer card at the start of their turn.", effect: "draw_less" },
    { id: "hn_the_doctor", name: "The Doctor", desc: "The player(s) with the fewest LP regain 1 LP at turn start.", effect: "heal_lowest" },
    { id: "hn_the_sermon", name: "The Sermon", desc: "Players cannot play any BANG! cards this round.", effect: "no_bangs" },
    { id: "hn_the_daltons", name: "The Daltons", desc: "When revealed, anyone with Blue cards in play must discard 1 Blue card.", effect: "discard_blue" },
    { id: "hn_high_noon", name: "High Noon", desc: "All players lose 1 LP at the start of their turn! (Permanent effect).", effect: "bleed_turn" }
  ];

  // 4. WILD WEST SHOW EVENT DECK (10 Cards - WWS card at bottom)
  const WILD_WEST_SHOW_EVENTS = [
    { id: "wws_bone_orchard", name: "Bone Orchard", desc: "At the start of their turn, dead players return to life with 1 LP.", effect: "revive_1lp" },
    { id: "wws_darling_val", name: "Darling Valentine", desc: "At start of turn, discard your hand and draw equal new cards.", effect: "mulligan_hand" },
    { id: "wws_dorothy_rage", name: "Dorothy Rage", desc: "On your turn, you may force another player to play a card from hand.", effect: "force_card" },
    { id: "wws_gag", name: "Gag", desc: "All players must remain completely silent (no chat).", effect: "silence" },
    { id: "wws_helena_zontero", name: "Helena Zontero", desc: "Flip top card: if Hearts/Diamonds, all players regain 1 LP.", effect: "helena_heal" },
    { id: "wws_lady_rosa", name: "Lady Rosa", desc: "Every player draws 1 extra card at the start of their turn.", effect: "draw_extra" },
    { id: "wws_miss_susanna", name: "Miss Susanna", desc: "On your turn, you must play at least 3 cards or lose 1 LP.", effect: "play_three" },
    { id: "wws_showdown", name: "Showdown", desc: "All cards may be played as BANG!, and all cards may be played as Missed!.", effect: "omni_cards" },
    { id: "wws_sacagaway", name: "Sacagaway", desc: "All players play with their hands face up (visible to everyone).", effect: "open_hands" },
    { id: "wws_wild_west_show", name: "Wild West Show", desc: "The Sheriff dying no longer ends the game! Winner is the Last Gunslinger Standing!", effect: "battle_royale" }
  ];

  // 5. GOLD RUSH EXPANSION EQUIPMENT DECK (24 Cards)
  const GOLD_RUSH_CARDS = [
    // Brown-Bordered Instant Equipment (11 Total)
    { id: "gr_bottle_0", name: "Bottle", type: "gold_brown", cost: 2, icon: "🍾", desc: "Instantly acts as a Beer, Panic!, or BANG!." },
    { id: "gr_bottle_1", name: "Bottle", type: "gold_brown", cost: 2, icon: "🍾", desc: "Instantly acts as a Beer, Panic!, or BANG!." },
    { id: "gr_accomplice_0", name: "Accomplice", type: "gold_brown", cost: 2, icon: "🤝", desc: "Steal 1 card from any player's hand." },
    { id: "gr_calumet_0", name: "Calumet", type: "gold_brown", cost: 3, icon: "🪶", desc: "You are completely immune to Diamond cards until your next turn." },
    { id: "gr_gold_rush_0", name: "Gold Rush", type: "gold_brown", cost: 4, icon: "💰", desc: "Instantly regain all Life Points! Ends your turn immediately." },
    { id: "gr_horseshoe_0", name: "Horseshoe", type: "gold_brown", cost: 2, icon: "🧲", desc: "Whenever you draw for a check ('draw!'), flip 1 extra card." },
    { id: "gr_pardner_0", name: "Pardner", type: "gold_brown", cost: 2, icon: "🤠", desc: "Instantly draw 2 cards from the deck." },
    { id: "gr_union_pacific_0", name: "Union Pacific", type: "gold_brown", cost: 4, icon: "🚂", desc: "Instantly draw 4 cards from the deck." },
    { id: "gr_gun_belt_0", name: "Gun Belt", type: "gold_brown", cost: 2, icon: "🥋", desc: "Your max hand size limit is increased by 1 for this turn." },
    { id: "gr_shot_0", name: "Shot", type: "gold_brown", cost: 1, icon: "💥", desc: "Fire a free BANG! at any target in range (doesn't count toward limit)." },
    { id: "gr_bandidos_0", name: "Bandidos", type: "gold_brown", cost: 2, icon: "🎭", desc: "All other players must discard 1 card or lose 1 Life Point." },

    // Black-Bordered Persistent Equipment (13 Total)
    { id: "gr_boots_0", name: "Boots", type: "gold_black", cost: 3, icon: "👢", desc: "Whenever you lose 1 LP, immediately draw 1 card from the deck." },
    { id: "gr_pickaxe_0", name: "Pickaxe", type: "gold_black", cost: 4, icon: "⛏️", desc: "Draw 1 extra card at the start of your turn." },
    { id: "gr_rhum_0", name: "Rhum", type: "gold_black", cost: 3, icon: "🥃", desc: "Flip top card: if Hearts or Diamonds, gain 2 LP; otherwise gain 1 LP." },
    { id: "gr_gold_pan_0", name: "Gold Pan", type: "gold_black", cost: 2, icon: "🥘", desc: "Once per turn on your turn, pay 1 gold to draw 1 card." },
    { id: "gr_shotgun_0", name: "Shotgun", type: "gold_black", cost: 3, icon: "⚡", desc: "Whenever you hit a player with a BANG!, they also discard 1 card." },
    { id: "gr_bad_rock_0", name: "Bad Rock", type: "gold_black", cost: 3, icon: "🪨", desc: "When targeted by BANG!, pay 1 gold to dodge instead of Missed!." },
    { id: "gr_belt_0", name: "Belt", type: "gold_black", cost: 3, icon: "🪢", desc: "Your hand size limit at end of turn is increased by 2." },
    { id: "gr_warrant_0", name: "Warrant", type: "gold_black", cost: 3, icon: "📜", desc: "Whenever another player is eliminated, you gain 2 Gold Nuggets." },
    { id: "gr_lucky_charm_0", name: "Lucky Charm", type: "gold_black", cost: 2, icon: "🍀", desc: "Whenever you lose 1 Life Point, you gain 1 Gold Nugget." },
    { id: "gr_talisman_0", name: "Talisman", type: "gold_black", cost: 3, icon: "🧿", desc: "Players at distance 1 see you at distance +1." },
    { id: "gr_bounty_0", name: "Bounty", type: "gold_black", cost: 2, icon: "🏷️", desc: "Place on an opponent; whoever deals damage to them gains 1 Gold." },
    { id: "gr_casino_0", name: "Casino", type: "gold_black", cost: 2, icon: "🎰", desc: "Pay 1 gold and flip: if Hearts, gain 2 Gold Nuggets." },
    { id: "gr_gold_mine_0", name: "Gold Mine", type: "gold_black", cost: 3, icon: "🪙", desc: "Gain 1 Gold Nugget at the start of each of your turns." }
  ];

  // 6. COMPLETE CHARACTER REGISTRY (39 Characters)
  const CHARACTERS = {
    // Base Game (16)
    BART_CASSIDY: { name: "Bart Cassidy", lp: 4, icon: "🤕", pack: "base", desc: "Each time he loses 1 LP, he draws 1 card from the deck." },
    BLACK_JACK: { name: "Black Jack", lp: 4, icon: "🃏", pack: "base", desc: "Shows the 2nd card he draws: if Hearts or Diamonds, he draws a 3rd card." },
    CALAMITY_JANET: { name: "Calamity Janet", lp: 4, icon: "👢", pack: "base", desc: "She can play BANG! cards as Missed!, and Missed! cards as BANG!." },
    EL_GRINGO: { name: "El Gringo", lp: 3, icon: "🌵", pack: "base", desc: "Each time he loses 1 LP from a player, he draws 1 random card from their hand." },
    JESSE_JONES: { name: "Jesse Jones", lp: 4, icon: "🕶️", pack: "base", desc: "He may draw his 1st card from another player's hand instead of the deck." },
    JOURDONNAIS: { name: "Jourdonnais", lp: 4, icon: "🛢️", pack: "base", desc: "He has a built-in Barrel: flips a card when attacked; Hearts = dodge!" },
    KIT_CARLSON: { name: "Kit Carlson", lp: 4, icon: "📜", pack: "base", desc: "Draw phase: looks at the top 3 cards of the deck, chooses 2, and returns 1." },
    LUCKY_DUKE: { name: "Lucky Duke", lp: 4, icon: "🎲", pack: "base", desc: "Whenever he flips a card for a check, he flips 2 and chooses preferred result." },
    PAUL_REGRET: { name: "Paul Regret", lp: 3, icon: "🐎", pack: "base", desc: "Built-in Mustang: other players see him at distance +1." },
    PEDRO_RAMIREZ: { name: "Pedro Ramirez", lp: 4, icon: "⛏️", pack: "base", desc: "He may draw his 1st card from the discard pile instead of the deck." },
    ROSE_DOOLAN: { name: "Rose Doolan", lp: 4, icon: "🔭", pack: "base", desc: "Built-in Scope: she sees all other players at distance -1." },
    SID_KETCHUM: { name: "Sid Ketchum", lp: 4, icon: "🥩", pack: "base", desc: "He may discard any 2 cards at any time on his turn to regain 1 LP." },
    SLAB_THE_KILLER: { name: "Slab the Killer", lp: 4, icon: "🪓", pack: "base", desc: "Players trying to cancel his BANG! must play 2 Missed! cards." },
    SUZY_LAFAYETTE: { name: "Suzy Lafayette", lp: 4, icon: "👒", pack: "base", desc: "As soon as she has no cards in hand, she draws 1 card from the deck." },
    VULTURE_SAM: { name: "Vulture Sam", lp: 4, icon: "🦅", pack: "base", desc: "Whenever a player is eliminated, Sam acquires all their hand and in-play cards." },
    WILLY_THE_KID: { name: "Willy the Kid", lp: 4, icon: "⚡", pack: "base", desc: "Built-in Volcanic: he may play any number of BANG! cards on his turn." },

    // Dodge City (15)
    APACHE_KID: { name: "Apache Kid", lp: 3, icon: "🏹", pack: "dc", desc: "Cards of the Diamond suit played by other players have no effect on him." },
    BELLE_STAR: { name: "Belle Star", lp: 4, icon: "⭐", pack: "dc", desc: "During her turn, other players' in-play cards have no effect." },
    BILL_NOFACE: { name: "Bill Noface", lp: 4, icon: "🎭", pack: "dc", desc: "Draw phase: draws 1 card plus 1 card for each missing Life Point." },
    CHUCK_WENGAM: { name: "Chuck Wengam", lp: 4, icon: "🍺", pack: "dc", desc: "On his turn, he may lose 1 LP to immediately draw 2 cards." },
    DOC_HOLYDAY: { name: "Doc Holyday", lp: 4, icon: "🩺", pack: "dc", desc: "Once per turn, he may discard 2 cards to shoot a free BANG!." },
    ELENA_FUENTE: { name: "Elena Fuente", lp: 3, icon: "💃", pack: "dc", desc: "She may use any card from her hand as a Missed!." },
    GREG_DIGGER: { name: "Greg Digger", lp: 4, icon: "⚰️", pack: "dc", desc: "Whenever another player dies, he immediately regains 2 Life Points." },
    HERB_HUNTER: { name: "Herb Hunter", lp: 4, icon: "🎯", pack: "dc", desc: "Whenever another player dies, he immediately draws 2 cards from deck." },
    JOSE_DELGADO: { name: "Jose Delgado", lp: 4, icon: "📘", pack: "dc", desc: "May discard a blue card in hand to draw 2 cards (up to 2 times/turn)." },
    MOLLY_STARK: { name: "Molly Stark", lp: 4, icon: "🛡️", pack: "dc", desc: "Whenever she plays or discards a card out of turn, she draws 1 card." },
    PAT_BRENNAN: { name: "Pat Brennan", lp: 4, icon: "🐴", pack: "dc", desc: "Draw phase: may draw 1 in-play card from any player instead of 2 from deck." },
    PIXIE_PETE: { name: "Pixie Pete", lp: 3, icon: "🧚", pack: "dc", desc: "Draw phase: draws 3 cards from the deck instead of 2." },
    SEAN_MALLORY: { name: "Sean Mallory", lp: 3, icon: "📦", pack: "dc", desc: "He has no maximum hand size limit at the end of his turn." },
    TEQUILA_JOE: { name: "Tequila Joe", lp: 4, icon: "🥃", pack: "dc", desc: "Whenever he plays a Beer card, he regains 2 Life Points instead of 1." },
    VERA_CUSTER: { name: "Vera Custer", lp: 3, icon: "🪞", pack: "dc", desc: "At the start of the round, she copies another living character's ability." },

    // Wild West Show (8)
    FLINT_WESTWOOD: { name: "Flint Westwood", lp: 4, icon: "🔄", pack: "wws", desc: "Once per turn, trade 1 card from hand for 2 random cards from another player." },
    BIG_SPENCER: { name: "Big Spencer", lp: 9, icon: "🦾", pack: "wws", desc: "Starts with 9 LP and 5 cards; cannot play Missed! cards." },
    LEE_VAN_KLIFF: { name: "Lee Van Kliff", lp: 4, icon: "🔁", pack: "wws", desc: "May discard a BANG! to repeat the effect of a brown card just played." },
    YOUL_GRINNER: { name: "Youl Grinner", lp: 4, icon: "😈", pack: "wws", desc: "Before drawing, each player with more cards than him must give him 1 card." },
    JOHN_PAIN: { name: "John Pain", lp: 4, icon: "🖐️", pack: "wws", desc: "If he has <6 cards, he takes any card drawn for checks by other players." },
    GREYGORY_DECK: { name: "Greygory Deck", lp: 4, icon: "🔀", pack: "wws", desc: "At turn start, gains the abilities of 2 random basic characters for the turn." },
    GARY_LOOTER: { name: "Gary Looter", lp: 5, icon: "🧤", pack: "wws", desc: "He draws all excess cards discarded by other players at end of turn." },
    TEREN_KILL: { name: "Teren Kill", lp: 3, icon: "🩸", pack: "wws", desc: "When eliminated, draws!: if not Spades, survives with 1 LP and draws 1 card." },

    // Gold Rush (8 Characters)
    DON_BELL: { name: "Don Bell", lp: 4, icon: "🔔", pack: "gr", desc: "At the end of his turn, he draws! If Hearts or Diamonds, he takes 1 extra turn (max 1 extra)." },
    DUTCH_WILL: { name: "Dutch Will", lp: 4, icon: "🍺", pack: "gr", desc: "Draw phase: draws 2 cards, must discard 1, and gains 1 Gold Nugget." },
    JACKY_MURIETA: { name: "Jacky Murieta", lp: 4, icon: "🗡️", pack: "gr", desc: "He may pay 2 Gold Nuggets to play an extra BANG! on his turn." },
    JOSH_MCCLOUD: { name: "Josh McCloud", lp: 4, icon: "📦", pack: "gr", desc: "He may pay 2 Gold Nuggets to draw and play the top hidden Equipment card." },
    MADAM_YTO: { name: "Madam Yto", lp: 4, icon: "💃", pack: "gr", desc: "Whenever any player plays a Beer card, she immediately draws 1 card from the deck." },
    PRETTY_LUZENA: { name: "Pretty Luzena", lp: 4, icon: "👒", pack: "gr", desc: "Her first shop purchase each turn costs 1 less Gold Nugget." },
    SIMEON_PICOS: { name: "Simeon Picos", lp: 4, icon: "🌵", pack: "gr", desc: "Each time he loses 1 Life Point, he gains 1 Gold Nugget from the bank." },
    UNCLE_WILL: { name: "Uncle Will", lp: 4, icon: "🏬", pack: "gr", desc: "Once per turn, he may play any card from his hand as a General Store." }
  };

  function playerHasAbility(player, charKey) {
    if (!player) return false;
    if (player.charKey === charKey) return true;
    if (player.copiedCharKey === charKey) return true;
    if (player.greygoryAbilities && player.greygoryAbilities.includes(charKey)) return true;
    return false;
  }

  // Bind to global window
  global.BASE_CARDS = BASE_CARDS;
  global.DODGE_CITY_CARDS = DODGE_CITY_CARDS;
  global.HIGH_NOON_EVENTS = HIGH_NOON_EVENTS;
  global.WILD_WEST_SHOW_EVENTS = WILD_WEST_SHOW_EVENTS;
  global.GOLD_RUSH_CARDS = GOLD_RUSH_CARDS;
  global.CHARACTERS = CHARACTERS;
  global.playerHasAbility = playerHasAbility;

})(typeof window !== 'undefined' ? window : this);
