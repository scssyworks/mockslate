module.exports = {
  /**
   * Returns a modified string with variables
   * @param {string} msg Message with variables
   * @param {string[]} args Replacement arguments
   * @returns {string}
   */
  formatMessage(msg, args = []) {
    if (typeof msg === 'string') {
      args.forEach((arg, index) => {
        msg = msg.replace(new RegExp(`\\{${index}\\}`, 'g'), arg);
      });
    }
    return msg;
  },
};
