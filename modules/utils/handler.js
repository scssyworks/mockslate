const args = require('../arguments');
const { error } = require('../logging');

module.exports = {
  /**
   * Handles errors
   * @param {() => any} callback
   * @param {any} defaultValue
   * @returns {any}
   */
  handler(callback, defaultValue) {
    try {
      return callback();
    } catch (e) {
      if (args.test) {
        error(e);
      }
      return defaultValue;
    }
  },
};
