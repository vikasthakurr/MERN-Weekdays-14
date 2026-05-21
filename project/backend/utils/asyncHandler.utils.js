/**
 * @file asyncHandler.utils.js
 * @description Higher-order function that wraps async Express route handlers.
 *
 * Eliminates the need for try/catch in every controller by automatically
 * forwarding any rejected promise to Express's next(err), which is then
 * handled by the global error middleware.
 *
 * @example
 * const myController = asyncHandler(async (req, res) => {
 *   const data = await SomeModel.find();
 *   res.json(data);
 * });
 *
 * @param {Function} fn - Async Express request handler
 * @returns {Function} Wrapped handler that catches errors and calls next(err)
 */
const asyncHandler = (fn) => (req, res, next) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
