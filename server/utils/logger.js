const logger = {
  info: (message) => {
    console.log(`[INFO] ${new Date().toISOString()}: ${message}`);
  },
  error: (message, stack = '') => {
    console.error(`[ERROR] ${new Date().toISOString()}: ${message} ${stack}`);
  },
  warn: (message) => {
    console.warn(`[WARN] ${new Date().toISOString()}: ${message}`);
  }
};

export default logger;
