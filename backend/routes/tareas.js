const express = require("express");
const router = express.Router();
const tareasController = require("../controllers/tareasControllers");
const { sql, poolPromise } = require("../db"); // ✅ Importar poolPromise

// Definir rutas
router.get("/", tareasController.obtenerTareas);

router.get("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      console.log("📌 Buscando tarea con ID:", id); // Log para verificar el ID recibido
  
      const pool = await poolPromise; // ✅ Obtener la conexión

      const resultado = await pool
        .request()
        .input("id", sql.Int, id)
        .query("SELECT * FROM pendientes WHERE id = @id");
  
      console.log("📌 Resultado de la consulta:", resultado.recordset);
  
      if (resultado.recordset.length === 0) {
        return res.status(404).json({ error: "Tarea no encontrada" });
      }
  
      res.json(resultado.recordset[0]);
    } catch (error) {
      console.error("❌ Error en GET /api/tareas/:id:", error); // Ver error en la consola
      res.status(500).json({ error: "Error al obtener la tarea" });
    }
  });

router.post("/", async (req, res) => {
    try {
      const { titulo, observacion, fecha_ejecucion } = req.body;
  
      // ✅ Obtener la conexión al pool antes de usarla
      const pool = await poolPromise;
  
      const nuevaTarea = await pool
        .request()
        .input("titulo", sql.VarChar, titulo)
        .input("observacion", sql.Text, observacion)
        .input("fecha_ejecucion", sql.DateTime, fecha_ejecucion)
        .input("estado", sql.VarChar, "Sinasignar")
        .query(
          "INSERT INTO Pendientes (titulo, observacion, fecha_ejecucion, estado) OUTPUT INSERTED.* VALUES (@titulo, @observacion, @fecha_ejecucion, @estado)"
        );
  
      const tareaCreada = nuevaTarea.recordset[0];
  
      // Emitir evento de nueva tarea
      const io = req.app.get("io");
      io.emit("nuevaTarea", tareaCreada);
  
      res.status(201).json(tareaCreada);
    } catch (error) {
      console.error("❌ Error al crear la tarea:", error);
      res.status(500).json({ error: error.message });
    }
  });
  router.put("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { titulo, observacion, fecha_ejecucion, estado } = req.body;
  
      console.log("Datos recibidos en el backend:", { id, titulo, observacion, fecha_ejecucion, estado }); // Revisa aquí los datos

      
      const pool = await poolPromise; // ✅ Obtener la conexión
      const resultado = await pool
        .request()
        .input("id", sql.Int, id)
        .input("titulo", sql.VarChar, titulo)
        .input("observacion", sql.Text, observacion)
        .input("fecha_ejecucion", sql.DateTime, fecha_ejecucion)
        .input("estado", sql.VarChar, estado)
        .query(
          "UPDATE pendientes SET titulo = @titulo, observacion = @observacion, fecha_ejecucion = @fecha_ejecucion, estado = @estado WHERE id = @id"
        );
  
      if (resultado.rowsAffected[0] === 0) {
        return res.status(404).json({ error: "Tarea no encontrada" });
      }
  
      // Obtener la tarea actualizada
      const tareaActualizada = await pool
        .request()
        .input("id", sql.Int, id)
        .query("SELECT * FROM pendientes WHERE id = @id");
  
      // Emitir evento de actualización
      const io = req.app.get("io");
      io.emit("tareaActualizada", tareaActualizada.recordset[0]);
  
      res.json(tareaActualizada.recordset[0]);
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar la tarea" });
    }
  });
  router.put("/cerrar/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { comentario_cierre } = req.body;
  
      const pool = await poolPromise; // ✅ Obtener la conexión
      const resultado = await pool
        .request()
        .input("id", sql.Int, id)
        .input("comentario_cierre", sql.Text, comentario_cierre)
        .query(
          "UPDATE pendientes SET estado = 'Cerrado', comentario_cierre = @comentario_cierre, fecha_cierre = GETDATE() WHERE id = @id"
        );
  
      if (resultado.rowsAffected[0] === 0) {
        return res.status(404).json({ error: "Tarea no encontrada" });
      }
  
      // Obtener la tarea actualizada
      const tareaCerrada = await pool
        .request()
        .input("id", sql.Int, id)
        .query("SELECT * FROM pendientes WHERE id = @id");
  
      // Emitir evento de actualización
      const io = req.app.get("io");
      io.emit("tareaCerrada", tareaCerrada.recordset[0]);
  
      res.json(tareaCerrada.recordset[0]);
    } catch (error) {
      res.status(500).json({ error: "Error al cerrar la tarea" });
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const pool = await poolPromise;
  
      // Obtener la tarea antes de eliminarla
      const tareaEliminada = await pool
        .request()
        .input("id", sql.Int, id)
        .query("SELECT * FROM pendientes WHERE id = @id");
  
      if (tareaEliminada.recordset.length === 0) {
        return res.status(404).json({ error: "Tarea no encontrada" });
      }
  
      // Eliminar la tarea
      await pool.request().input("id", sql.Int, id).query("DELETE FROM pendientes WHERE id = @id");
  
      // Emitir evento con la tarea eliminada
      const io = req.app.get("io");
      io.emit("tareaEliminada", tareaEliminada.recordset[0]);
  
      res.json({ mensaje: "Tarea eliminada", tarea: tareaEliminada.recordset[0] });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar la tarea" });
    }
  });

module.exports = router;
