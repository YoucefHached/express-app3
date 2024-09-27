const { createLogger, transports, format } = require("winston");

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new transports.Console(), // Pour afficher dans la console
    new transports.File({ filename: "src/logs/app.log" }), // Enregistrer dans un fichier
  ],
});

module.exports = logger;
