module.exports = {
  formatMessage(msg, args = []) {
    if (typeof msg === 'string') {
      args.forEach((arg, index) => {
        msg = msg.replace(new RegExp(`\\{${index}\\}`, 'g'), arg);
      });
    }
    return msg;
  },
};
