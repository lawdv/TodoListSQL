const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const tareasRoutes = require("./routes/tareas"); // Rutas de tareas
const { poolPromise } = require("./db"); // Solo importamos el pool, sin conectar de nuevo

const app = express();
const server = http.createServer(app); // Crear el servidor HTTP
const io = new Server(server, {
  cors: {
    origin: "http://192.168.1.89:3000", // Asegúrate de que coincida con tu frontend
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(express.json());
app.use(cors());

// Montar rutas
app.use("/api/tareas", tareasRoutes);

// WebSockets: Detectar conexión de clientes
io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

// Hacer que `io` esté disponible en las rutas
app.set("io", io);

// Iniciar el servidor solo cuando la base de datos esté lista
poolPromise
  .then(() => {
    const PORT = 5000;
    server.listen(PORT, () => {
      console.log(`🚀 Servidor en ejecución en http://192.168.1.89:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error al conectar a SQL Server:", err);
    process.exit(1); // Detener la app si hay error en la conexión
  });
// En este archivo, hemos configurado la conexión a la base de datos y hemos creado un servidor HTTP con Express y Socket.IO. Luego, hemos montado las rutas de tareas y hemos hecho que el servidor escuche en el puerto 5000. Finalmente, hemos hecho que io esté disponible en las rutas para emitir eventos de WebSocket.