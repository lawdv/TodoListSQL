const { sql, poolPromise } = require("../db"); // ✅ Importa `poolPromise` desde db.js

// Obtener todas las tareas
async function obtenerTareas(req, res) {
  try {
    const pool = await poolPromise; // ✅ Obtener conexión con poolPromise
    const result = await pool
      .request()
      .query("SELECT * FROM pendientes ORDER BY fecha_creacion DESC");

    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Error al obtener las tareas:", err);
    res.status(500).json({ error: "Error al obtener las tareas" });
  }
}

// Crear una nueva tarea
// Crear una nueva tarea
async function crearTarea(req, res) {
  const { titulo, observacion, fecha_ejecucion } = req.body;

  try {
    const pool = await poolPromise; // Obtener conexión del pool
    await pool
      .request()
      .input("titulo", sql.VarChar, titulo)
      .input("observacion", sql.Text, observacion)
      .input("fecha_ejecucion", sql.DateTime, fecha_ejecucion)
      .query(
        "INSERT INTO pendientes (titulo, observacion, fecha_ejecucion, estado) VALUES (@titulo, @observacion, @fecha_ejecucion, 'Pendiente')"
      );

    res.status(201).json({ mensaje: "Tarea creada con éxito" });
  } catch (err) {
    console.error("❌ Error al crear la tarea:", err);
    res.status(500).json({ error: "Error al crear la tarea" });
  }
}

// Editar una tarea
async function editarTarea(req, res) {
  const { id } = req.params;
  const { titulo, observacion, fecha_ejecucion } = req.body;

  try {
    const pool = await poolPromise; // ✅ Obtener conexión con poolPromise
    await pool
      .request()
      .input("id", sql.Int, id)
      .input("titulo", sql.VarChar, titulo)
      .input("observacion", sql.Text, observacion)
      .input("fecha_ejecucion", sql.DateTime, fecha_ejecucion)
      .query(
        "UPDATE pendientes SET titulo = @titulo, observacion = @observacion, fecha_ejecucion = @fecha_ejecucion WHERE id = @id"
      );

    res.json({ mensaje: "Tarea actualizada con éxito" });
  } catch (err) {
    console.error("❌ Error al actualizar la tarea:", err);
    res.status(500).json({ error: "Error al actualizar la tarea" });
  }
}

// Cerrar una tarea
async function cerrarTarea(req, res) {
  const { id } = req.params;
  const { comentario_cierre } = req.body;

  try {
    const pool = await poolPromise; // ✅ Obtener conexión con poolPromise
    await pool
      .request()
      .input("id", sql.Int, id)
      .input("comentario_cierre", sql.Text, comentario_cierre)
      .query(
        "UPDATE pendientes SET estado = 'Cerrado', comentario_cierre = @comentario_cierre, fecha_cierre = GETDATE() WHERE id = @id"
      );

    res.json({ mensaje: "Tarea cerrada con éxito" });
  } catch (err) {
    console.error("❌ Error al cerrar la tarea:", err);
    res.status(500).json({ error: "Error al cerrar la tarea" });
  }
}

module.exports = {
  obtenerTareas,
  crearTarea,
  editarTarea,
  cerrarTarea,
};
