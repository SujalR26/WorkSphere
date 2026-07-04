import apiClient from '../../api/client.js';

// Generates a high-entropy cryptographically random string for PKCE state/verifier
const generateRandomString = (length) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const values = window.crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values)
    .map((x) => possible[x % possible.length])
    .join('');
};

// Base64url encodes an ArrayBuffer
const base64UrlEncode = (buffer) => {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

// Computes the SHA-256 hash of the verifier and base64url encodes it
const generateChallenge = async (verifier) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await window.crypto.subtle.digest('SHA-256', data);
  return base64UrlEncode(hash);
};

export const redirectToPing = async () => {
  try {
    const state = generateRandomString(32);
    const verifier = generateRandomString(64);
    const challenge = await generateChallenge(verifier);

    // Save to sessionStorage for verification in the callback phase
    sessionStorage.setItem('ping_auth_state', state);
    sessionStorage.setItem('ping_auth_verifier', verifier);

    // Request the authentication URL from the backend
    const res = await apiClient.get('/auth/ping/auth-url', {
      params: {
        code_challenge: challenge,
        state: state
      }
    });

    if (res.success && res.authUrl) {
      window.location.href = res.authUrl;
    } else {
      throw new Error('Failed to generate authorization URL');
    }
  } catch (error) {
    console.error('Ping redirect initialization error:', error);
    throw error;
  }
};

export const handlePingCallback = async (code, state, mockEmail = null) => {
  const savedState = sessionStorage.getItem('ping_auth_state');
  const verifier = sessionStorage.getItem('ping_auth_verifier');

  // Clear from session storage immediately for security
  sessionStorage.removeItem('ping_auth_state');
  sessionStorage.removeItem('ping_auth_verifier');

  if (!state || state !== savedState) {
    throw new Error('Invalid state parameter. Possible CSRF attack detected.');
  }

  if (!code || !verifier) {
    throw new Error('Missing code or PKCE verifier parameter.');
  }

  // Call the backend endpoint to exchange code & verifier for session cookie
  const res = await apiClient.post('/auth/ping/callback', {
    code,
    codeVerifier: verifier,
    mockEmail
  });

  return res;
};
