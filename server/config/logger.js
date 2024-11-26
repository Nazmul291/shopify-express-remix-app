// logger.js

class Logger {
    constructor() {
      this.appName = "TM";
      this.debug = process.env.DEBUG === "true";
      this.console_log = console.log;
  
      this.colors = {
        reset: "\x1b[0m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m",
      };
    }
  
    log(...args) {
      if (this.debug) {
        this.console_log(`${this.colors.yellow}[${this.appName}]${this.colors.reset}`, ...args);
      }
    }
  
    error(...args) {
      if (this.debug) {
        this.console_log(`${this.colors.red}[${this.appName}]${this.colors.reset}`, ...args);
      }
    }
  }
  
  const logger = new Logger();
  
  // Bind the methods to the logger instance
  console.log = logger.log.bind(logger);
  console.error = logger.error.bind(logger);
  
  export default logger.console_log;
  