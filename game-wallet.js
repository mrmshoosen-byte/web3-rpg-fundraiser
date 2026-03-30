/**
 * game-wallet.js — Phantom Wallet integration for Crystal Realm
 * Detects Phantom, connects, gets address, and mocks NFT minting.
 */

(function (global) {
  'use strict';

  /**
   * Get the Phantom provider if installed.
   * @returns {object|null}
   */
  function getPhantomProvider() {
    if (global.solana && global.solana.isPhantom) return global.solana;
    if (global.phantom && global.phantom.solana && global.phantom.solana.isPhantom) {
      return global.phantom.solana;
    }
    return null;
  }

  /**
   * Check if Phantom wallet is available in this browser.
   * @returns {boolean}
   */
  function isPhantomAvailable() {
    return getPhantomProvider() !== null;
  }

  /**
   * Prompt the user to connect their Phantom wallet.
   * @returns {Promise<{ok:boolean, address?:string, error?:string}>}
   */
  async function connectPhantom() {
    const provider = getPhantomProvider();
    if (!provider) {
      return {
        ok: false,
        error: 'Phantom wallet not found. Please install the Phantom browser extension.',
      };
    }
    try {
      const resp = await provider.connect();
      const address = resp.publicKey.toString();
      return { ok: true, address };
    } catch (err) {
      if (err.code === 4001) {
        return { ok: false, error: 'Connection rejected by user.' };
      }
      return { ok: false, error: err.message || 'Unknown wallet error.' };
    }
  }

  /**
   * Return the currently-connected wallet address (if any) without prompting.
   * @returns {Promise<string|null>}
   */
  async function getWalletAddress() {
    const provider = getPhantomProvider();
    if (!provider) return null;
    try {
      if (provider.isConnected && provider.publicKey) {
        return provider.publicKey.toString();
      }
      /* Try eager connect (no popup) */
      const resp = await provider.connect({ onlyIfTrusted: true });
      return resp.publicKey.toString();
    } catch (_) {
      return null;
    }
  }

  /**
   * Mock NFT mint — simulates the minting flow without a live program.
   * Logs the intent; replace with real on-chain call for production.
   *
   * @param {string} walletAddress
   * @param {object} skinData  – { skinId, character, floor, timestamp }
   * @returns {Promise<{ok:boolean, txId?:string, error?:string}>}
   */
  async function mockMintNFT(walletAddress, skinData) {
    if (!walletAddress) {
      return { ok: false, error: 'No wallet address provided.' };
    }
    /* Simulate network latency */
    await new Promise((r) => setTimeout(r, 1800));
    /* Solana transaction signatures are 88 base58-encoded characters */
    const SOLANA_TX_SIG_LENGTH = 88;
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz123456789';
    let txId = '';
    for (let i = 0; i < SOLANA_TX_SIG_LENGTH; i++) {
      txId += chars[Math.floor(Math.random() * chars.length)];
    }
    console.info('[game-wallet] Mock mint → wallet:', walletAddress, '| skin:', skinData, '| tx:', txId);
    return { ok: true, txId };
  }

  /* Expose as global */
  global.GameWallet = { isPhantomAvailable, connectPhantom, getWalletAddress, mockMintNFT };

}(window));
