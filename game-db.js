/**
 * game-db.js — Supabase integration for Crystal Realm
 * Gracefully degrades when Supabase is not configured.
 */

(function (global) {
  'use strict';

  const SUPABASE_URL  = (global.SUPABASE_URL)      || '';
  const SUPABASE_KEY  = (global.SUPABASE_ANON_KEY) || '';  /* global uses ANON_KEY suffix */

  let supabase = null;

  /* Lazy-init: only load Supabase SDK if credentials are provided */
  async function getClient() {
    if (supabase) return supabase;
    if (!SUPABASE_URL || !SUPABASE_KEY) return null;
    try {
      const { createClient } = await import(
        'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
      );
      supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
      return supabase;
    } catch (e) {
      console.warn('[game-db] Supabase unavailable:', e.message);
      return null;
    }
  }

  /**
   * Save or upsert game progress to the `game_progress` table.
   * @param {object} data  – { wallet_address, character, floor, stats }
   */
  async function saveProgress(data) {
    const client = await getClient();
    if (!client) {
      console.info('[game-db] saveProgress skipped — Supabase not configured.');
      return { ok: false, reason: 'not_configured' };
    }
    const { error } = await client
      .from('game_progress')
      .upsert({ ...data, updated_at: new Date().toISOString() });
    if (error) {
      console.error('[game-db] saveProgress error:', error.message);
      return { ok: false, reason: error.message };
    }
    return { ok: true };
  }

  /**
   * Register a wallet address for the NFT airdrop queue.
   * @param {string} walletAddress
   * @param {string} character       – 'vibhu' | 'cryptopher'
   * @param {number} floorsCleared
   */
  async function registerAirdrop(walletAddress, character, floorsCleared) {
    const client = await getClient();
    if (!client) {
      console.info('[game-db] registerAirdrop skipped — Supabase not configured.');
      return { ok: false, reason: 'not_configured' };
    }
    const { error } = await client
      .from('airdrop_queue')
      .upsert({
        wallet_address: walletAddress,
        character,
        floors_cleared: floorsCleared,
        registered_at: new Date().toISOString(),
      }, { onConflict: 'wallet_address' });
    if (error) {
      console.error('[game-db] registerAirdrop error:', error.message);
      return { ok: false, reason: error.message };
    }
    return { ok: true };
  }

  /**
   * Record that a wallet has minted/claimed a skin NFT.
   * @param {string} walletAddress
   * @param {string} skinId
   */
  async function trackSkinOwnership(walletAddress, skinId) {
    const client = await getClient();
    if (!client) {
      console.info('[game-db] trackSkinOwnership skipped — Supabase not configured.');
      return { ok: false, reason: 'not_configured' };
    }
    const { error } = await client
      .from('skin_ownership')
      .upsert({
        wallet_address: walletAddress,
        skin_id: skinId,
        claimed_at: new Date().toISOString(),
      }, { onConflict: 'wallet_address,skin_id' });
    if (error) {
      console.error('[game-db] trackSkinOwnership error:', error.message);
      return { ok: false, reason: error.message };
    }
    return { ok: true };
  }

  /* Expose as global so non-module game.js can call them */
  global.GameDB = { saveProgress, registerAirdrop, trackSkinOwnership };

}(window));
