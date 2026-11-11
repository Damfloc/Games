/**
 * BANG! AI Bot Strategy & Turn Automation
 * Manages bot decision trees, equipment priority, card targeting, and end-of-turn discard logic.
 */

(function(global) {
  'use strict';

  const botDelay = ms => new Promise(res => setTimeout(res, ms));

  async function waitPendingResolutions(maxWaitMs = 30000) {
    const start = Date.now();
    while (gameState.pendingInterrupt || gameState.activeDuel || gameState.attackChain || gameState.pendingDrawChoice || gameState.pendingCheckChoice) {
      if (Date.now() - start > maxWaitMs) {
        console.warn("waitPendingResolutions timed out, proceeding");
        break;
      }
      await botDelay(400);
    }
    await botDelay(400);
  }

  function checkBotTurnTrigger() {
    if (!isCurrentUserHost()) return;
    if (isBotTurnRunning) return;
    const active = roomPlayers[gameState.activePlayerId];
    if (!active || !active.isBot || (!active.isAlive && !(config.enableShadowGunslingers && active.isShadow))) return;
    if (gameState.turnPhase !== "play") return;

    if (botTurnTimer) clearTimeout(botTurnTimer);
    botTurnTimer = setTimeout(() => {
      botTurnTimer = null;
      runBotTurn(active);
    }, 1000);
  }

  async function runBotTurn(bot) {
    if (!isCurrentUserHost() || gameState.status !== "playing" || !bot.isAlive) return;
    if (gameState.activePlayerId !== bot.id || gameState.turnPhase !== "play") return;
    if (isBotTurnRunning) return;

    isBotTurnRunning = true;
    try {
      await waitPendingResolutions();
      if (gameState.activePlayerId !== bot.id || gameState.status !== "playing" || !bot.isAlive) return;

      // 1. Equip any Blue or Green cards in hand
      for (let i = bot.hand.length - 1; i >= 0; i--) {
        if (gameState.status !== "playing" || !bot.isAlive || gameState.activePlayerId !== bot.id) return;
        const c = bot.hand[i];
        if (c && (c.type === "blue" || c.type === "green") && c.sub !== "jail") {
          await botDelay(700);
          if (gameState.status !== "playing" || !bot.isAlive || gameState.activePlayerId !== bot.id) return;
          playCardFromHand(bot.id, i);
        }
      }

      // 2. Activate ready in-play Green cards
      for (let i = bot.inPlay.length - 1; i >= 0; i--) {
        if (gameState.status !== "playing" || !bot.isAlive || gameState.activePlayerId !== bot.id) return;
        const gc = bot.inPlay[i];
        if (gc && gc.type === "green" && gc.isReady) {
          if (gc.name === "Canteen" && bot.currentLp < bot.maxLp) {
            await botDelay(700);
            if (gameState.status !== "playing" || !bot.isAlive || gameState.activePlayerId !== bot.id) return;
            bot.inPlay.splice(i, 1);
            gameState.discardPile.push(gc);
            bot.currentLp++;
            addActivityLog(`🍶 ${bot.name} used Canteen (+1 LP).`);
            broadcastGameState();
          } else if (gc.name === "Pony Express") {
            await botDelay(700);
            if (gameState.status !== "playing" || !bot.isAlive || gameState.activePlayerId !== bot.id) return;
            bot.inPlay.splice(i, 1);
            gameState.discardPile.push(gc);
            bot.hand.push(drawFromDeck(), drawFromDeck(), drawFromDeck());
            addActivityLog(`🐎 ${bot.name} activated Pony Express and drew 3 cards.`);
            broadcastGameState();
          } else if (gc.name === "Howitzer") {
            await botDelay(700);
            if (gameState.status !== "playing" || !bot.isAlive || gameState.activePlayerId !== bot.id) return;
            bot.inPlay.splice(i, 1);
            gameState.discardPile.push(gc);
            updateDiscardPileUI();
            startAttackChain(bot.id, "Howitzer");
            await waitPendingResolutions();
          } else if (["Pepperbox", "Buffalo Rifle", "Knife", "Derringer"].includes(gc.name)) {
            const ignoreRange = (gc.name === "Buffalo Rifle");
            const targetId = chooseBotAttackTarget(bot, ignoreRange);
            if (targetId) {
              await botDelay(700);
              if (gameState.status !== "playing" || !bot.isAlive || gameState.activePlayerId !== bot.id) return;
              bot.inPlay.splice(i, 1);
              gameState.discardPile.push(gc);
              addActivityLog(`⚡ ${bot.name} activated ${gc.name} on ${roomPlayers[targetId].name}!`);
              if (gc.name === "Derringer" && roomPlayers[targetId].hand.length > 0) {
                const stolen = roomPlayers[targetId].hand.pop();
                bot.hand.push(stolen);
              }
              initiateAttackInterrupt(bot.id, targetId, gc.name, 1);
              await waitPendingResolutions();
            }
          }
        }
      }

      // 3. Play Stagecoach, Wells Fargo, Saloon
      for (let i = bot.hand.length - 1; i >= 0; i--) {
        if (gameState.status !== "playing" || !bot.isAlive || gameState.activePlayerId !== bot.id) return;
        const c = bot.hand[i];
        if (c && (c.name === "Stagecoach" || c.name === "Wells Fargo" || c.name === "Saloon")) {
          await botDelay(700);
          if (gameState.status !== "playing" || !bot.isAlive || gameState.activePlayerId !== bot.id) return;
          playCardFromHand(bot.id, i);
        }
      }

      // 4. Heal with Beer if missing LP
      if (bot.currentLp < bot.maxLp) {
        const beerIdx = bot.hand.findIndex(c => c.name === "Beer");
        if (beerIdx !== -1) {
          await botDelay(700);
          if (gameState.status !== "playing" || !bot.isAlive || gameState.activePlayerId !== bot.id) return;
          playCardFromHand(bot.id, beerIdx);
        }
      }

      // 5. Attack target with Duel or BANG!
      const duelIdx = bot.hand.findIndex(c => c.name === "Duel");
      if (duelIdx !== -1) {
        const targetId = chooseBotAttackTarget(bot, true); // Duels can challenge any distance!
        if (targetId) {
          await botDelay(800);
          if (gameState.status !== "playing" || !bot.isAlive || gameState.activePlayerId !== bot.id) return;
          playCardFromHand(bot.id, duelIdx, targetId);
          await waitPendingResolutions();
        }
      } else {
        const bangIdx = bot.hand.findIndex(c => c.name === "BANG!");
        if (bangIdx !== -1) {
          const targetId = chooseBotAttackTarget(bot, false);
          if (targetId) {
            await botDelay(800);
            if (gameState.status !== "playing" || !bot.isAlive || gameState.activePlayerId !== bot.id) return;
            playCardFromHand(bot.id, bangIdx, targetId);
            await waitPendingResolutions();
          }
        }
      }

      // Play utility action cards for bot
      const utilIdx = bot.hand.findIndex(c => ["Gatling", "Indians!"].includes(c.name));
      if (utilIdx !== -1) {
        await botDelay(800);
        if (gameState.status !== "playing" || !bot.isAlive || gameState.activePlayerId !== bot.id) return;
        playCardFromHand(bot.id, utilIdx);
        await waitPendingResolutions();
      }

      // 6. Saloon Shop purchase (Gold Rush)
      if (config.enableGoldRush && gameState.shopCards && (bot.gold || 0) >= 2) {
        const affordIdx = gameState.shopCards.findIndex(sc => sc && (bot.gold || 0) >= sc.cost && !(sc.type === 'gold_black' && bot.inPlay.some(ip => ip.name === sc.name)));
        if (affordIdx !== -1) {
          await botDelay(700);
          if (gameState.status !== "playing" || !bot.isAlive || gameState.activePlayerId !== bot.id) return;
          buyShopCard(affordIdx, bot.id);
        }
      }

      // Ensure all attacks or interrupts are completed before discard phase
      await waitPendingResolutions();
      if (gameState.status !== "playing" || !bot.isAlive || gameState.activePlayerId !== bot.id) return;

      // 7. Phase 3: Discard excess cards down to LP
      await botDelay(800);
      if (gameState.status !== "playing" || !bot.isAlive || gameState.activePlayerId !== bot.id) return;
      botDiscardPhase(bot);
    } finally {
      isBotTurnRunning = false;
    }
  }

  function chooseBotAttackTarget(bot, ignoreRange = false) {
    const living = getLivingPlayersCircle().filter(p => p.id !== bot.id);
    const validTargets = ignoreRange ? living : living.filter(p => canPlayerShootTarget(bot.id, p.id));
    if (validTargets.length === 0) return null;

    const sheriff = living.find(p => p.role === "sheriff");

    // Outlaw AI: shoot the Sheriff!
    if (bot.role === "outlaw") {
      if (sheriff && (ignoreRange || canPlayerShootTarget(bot.id, sheriff.id))) return sheriff.id;
      return validTargets[0].id;
    }

    // Deputy AI: defend the Sheriff, attack non-sheriff
    if (bot.role === "deputy" || bot.role === "sheriff") {
      const nonSheriff = validTargets.filter(p => p.role !== "sheriff");
      return nonSheriff.length > 0 ? nonSheriff[0].id : validTargets[0].id;
    }

    // Renegade AI: balance table; keep Sheriff alive until final 1v1
    if (bot.role === "renegade") {
      if (living.length === 2 && sheriff) return sheriff.id;
      const nonSheriff = validTargets.filter(p => p.role !== "sheriff");
      return nonSheriff.length > 0 ? nonSheriff[0].id : validTargets[0].id;
    }

    return validTargets[0].id;
  }

  function botDiscardPhase(bot) {
    if (gameState.status !== "playing") return;
    if (!isCurrentUserHost()) return;
    if (gameState.activePlayerId !== bot.id) return;
    if (isAdvancingTurn) return;

    if (gameState.pendingInterrupt || gameState.activeDuel || gameState.attackChain || (gameState.generalStoreCards && gameState.generalStoreCards.length > 0)) {
      setTimeout(() => botDiscardPhase(bot), 800);
      return;
    }

    if (bot.isShadow) {
      addActivityLog(`👻 Shadow Gunslinger ${bot.name} discards remaining hand at end of turn.`);
      bot.hand = [];
    } else if (!playerHasAbility(bot, "SEAN_MALLORY")) {
      let maxHand = bot.currentLp;
      if (bot.inPlay.some(c => c.name === "Belt")) maxHand += 2;
      const discardedList = [];
      while (bot.hand.length > maxHand) {
        const discarded = bot.hand.pop();
        gameState.discardPile.push(discarded);
        discardedList.push(discarded);
        addActivityLog(`${bot.name} discarded ${discarded.name} to match Life Points.`);
      }
      const gary = Object.values(roomPlayers).find(p => p.isAlive && playerHasAbility(p, "GARY_LOOTER") && p.id !== bot.id);
      if (gary && discardedList.length > 0) {
        gary.hand.push(...discardedList);
        addActivityLog(`🧤 Gary Looter drew ${discardedList.length} card(s) discarded by ${bot.name}!`);
      }
    }
    broadcastGameState();
    advanceToNextTurn();
  }

  // Bind to global window
  global.botDelay = botDelay;
  global.waitPendingResolutions = waitPendingResolutions;
  global.checkBotTurnTrigger = checkBotTurnTrigger;
  global.runBotTurn = runBotTurn;
  global.chooseBotAttackTarget = chooseBotAttackTarget;
  global.botDiscardPhase = botDiscardPhase;

})(typeof window !== 'undefined' ? window : this);
