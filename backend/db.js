const sql = require("mssql");
require("dotenv").config();

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT, 10),
  options: {
    encrypt: false, // Cambiar a true si usas Azure SQL
    trustServerCertificate: true,
  },
};

// Crear un pool de conexiones y reutilizarlo en toda la app
const poolPromise = new sql.ConnectionPool(dbConfig)
  .connect()
  .then((pool) => {
    console.log("✅ Conectado a SQL Server");
    return pool;
  })
  .catch((err) => {
    console.error("❌ Error en la conexión a SQL Server:", err);
    process.exit(1); // Detener la app si hay error en la conexión
  });

module.exports = { sql, poolPromise };
// En este archivo, hemos configurado la conexión a la base de datos y hemos creado un pool de conexiones para reutilizarlo en toda la app. Luego, hemos exportado sql y poolPromise para usarlos en otros archivos de la app.