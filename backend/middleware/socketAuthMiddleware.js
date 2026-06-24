/**
 * socketAuthMiddleware.js
 * Socket.io JWT authentication middleware.
 *
 * Every socket connection MUST present a valid access token in:
 *   socket.handshake.auth.token  (preferred — not logged by proxies)
 *
 * On success: socket.data.userId and socket.data.userRole are populated.
 * On failure: the connection is rejected with an error event before any
 *             room-join or message events can fire.
 *
 * Usage (in server.js, BEFORE registerSocketHandlers):
 *   const socketAuthMiddleware = require('./middleware/socketAuthMiddleware');
 *   io.use(socketAuthMiddleware);
 */

const { verifyAccessToken } = require('../utils/jwtUtils');

/**
 * @param {import('socket.io').Socket} socket
 * @param {Function} next
 */
function socketAuthMiddleware(socket, next) {
  try {
    // Clients must pass the token in socket.handshake.auth.token
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(
        new Error('SOCKET_AUTH_MISSING: No access token provided in handshake.auth.token')
      );
    }

    const decoded = verifyAccessToken(token);

    // Attach verified identity to socket.data so all event handlers can use it
    socket.data.userId   = decoded.userId;
    socket.data.userRole = decoded.role;

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new Error('SOCKET_AUTH_EXPIRED: Access token has expired. Please refresh.'));
    }
    return next(new Error('SOCKET_AUTH_INVALID: Access token is invalid or tampered.'));
  }
}

module.exports = socketAuthMiddleware;
