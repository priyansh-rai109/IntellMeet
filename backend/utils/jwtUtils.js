/**
 * jwtUtils.js
 * Centralised JWT helpers for IntellMeet.
 *
 * Secrets come from environment variables — never hard-code them.
 * Generate strong secrets with:
 *   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
 *
 * Token lifetimes:
 *   Access token  → 15 minutes  (short-lived, used on every API request)
 *   Refresh token → 7 days      (long-lived, stored server-side and rotated)
 */

const jwt = require('jsonwebtoken');

// ── Constants ────────────────────────────────────────────────────────────────
const ACCESS_TOKEN_EXPIRY  = '15m';   // 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d';    // 7 days

// ── Secret validation at startup ─────────────────────────────────────────────
function requireSecret(name) {
  const value = process.env[name];
  if (!value || value.length < 32) {
    throw new Error(
      `[jwtUtils] Environment variable "${name}" is missing or too short. ` +
      'Generate a strong secret with: ' +
      'node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"'
    );
  }
  return value;
}

// Eagerly validate secrets so the server fails fast at boot, not at auth-time.
const JWT_SECRET         = requireSecret('JWT_SECRET');
const JWT_REFRESH_SECRET = requireSecret('JWT_REFRESH_SECRET');

// ── Token generators ─────────────────────────────────────────────────────────

/**
 * Signs a short-lived access token.
 * Payload: { userId, role }
 * @param {{ _id: string, role: string }} user
 * @returns {string} signed JWT
 */
function generateAccessToken(user) {
  return jwt.sign(
    { userId: String(user._id), role: user.role },
    JWT_SECRET,
    {
      expiresIn: ACCESS_TOKEN_EXPIRY,
      algorithm: 'HS256',
    }
  );
}

/**
 * Signs a long-lived refresh token.
 * Payload: { userId } — deliberately minimal.
 * @param {{ _id: string }} user
 * @returns {string} signed JWT
 */
function generateRefreshToken(user) {
  return jwt.sign(
    { userId: String(user._id) },
    JWT_REFRESH_SECRET,
    {
      expiresIn: REFRESH_TOKEN_EXPIRY,
      algorithm: 'HS256',
    }
  );
}

/**
 * Verifies an access token and returns its decoded payload.
 * Throws a jwt.JsonWebTokenError / jwt.TokenExpiredError on failure.
 * @param {string} token
 * @returns {{ userId: string, role: string, iat: number, exp: number }}
 */
function verifyAccessToken(token) {
  return jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
}

/**
 * Verifies a refresh token and returns its decoded payload.
 * @param {string} token
 * @returns {{ userId: string, iat: number, exp: number }}
 */
function verifyRefreshToken(token) {
  return jwt.verify(token, JWT_REFRESH_SECRET, { algorithms: ['HS256'] });
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
};
