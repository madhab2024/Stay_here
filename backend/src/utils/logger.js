const logger = {
    info: (msg) => console.log(`[INFO] ${new Date().toLocaleTimeString()} - ${msg}`),
    error: (msg, err) => console.error(`[ERROR] ${new Date().toLocaleTimeString()} - ${msg}`, err || ''),
    warn: (msg) => console.warn(`[WARN] ${new Date().toLocaleTimeString()} - ${msg}`),
};
  
module.exports = logger;
