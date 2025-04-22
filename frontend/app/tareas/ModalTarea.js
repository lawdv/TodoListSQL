"use client";
import { useState } from "react";
import { cerrarTarea, editarTarea, eliminarTarea } from "../api/tareas";

export default function ModalTarea({ tarea, onClose }) {
  const [titulo, setTitulo] = useState(tarea.titulo);
  const [observacion, setObservacion] = useState(tarea.observacion);
  const [estado, setEstado] = useState(tarea.estado);

  // Fecha y hora separadas
  const fechaCompleta = tarea.fecha_ejecucion ? new Date(tarea.fecha_ejecucion) : new Date();
  const [fechaEjecucion, setFechaEjecucion] = useState(fechaCompleta.toISOString().split("T")[0]);
  const [horaEjecucion, setHoraEjecucion] = useState(fechaCompleta.toTimeString().split(":").slice(0, 2).join(":"));

  const [comentario_cierre, setComentarioCierre] = useState(tarea.comentario_cierre || "");


  const handleCerrarTarea = async () => {
    if (!comentario_cierre.trim()) {
      alert("Debes agregar un comentario de cierre.");
      return;
    }

    const exito = await cerrarTarea(tarea.id, comentario_cierre);
    if (exito) {
      onClose(); // Cierra el modal
    } else {
      alert("Error al cerrar la tarea");
    }
  };

  const handleEditarTarea = async () => {
    console.log("Estado al guardar: ", estado);  // Revisa el valor de 'estado' aquí.

    const fechaHoraEjecucion = `${fechaEjecucion} ${horaEjecucion}:00`;
    const tareaActualizada = await editarTarea(tarea.id, titulo, observacion, fechaHoraEjecucion, estado);
    console.log("Tarea actualizada: ", tareaActualizada);  // Revisa la respuesta del servidor aquí.
    if (tareaActualizada) {
      onClose();
    } else {
      alert("Error al actualizar la tarea");
    }
  };


  const handleEliminarTarea = async () => {
    const exito = await eliminarTarea(tarea.id);
    if (exito) {
      onClose();
    } else {
      alert("Error al eliminar la tarea");
    }
  };

  // Función para formatear la fecha
  const formatFecha = (fecha) => {
    if (!fecha) return null;
    const date = new Date(fecha);

    // Convertir la fecha a formato ISO (UTC)
    const isoFecha = date.toISOString();

    // Modificar la cadena ISO para el formato esperado: YYYY-MM-DD HH:MM:SS.MS
    const [datePart, timePart] = isoFecha.split("T");
    const formattedDate = `${datePart} ${timePart.split(".")[0]}`;

    return formattedDate;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold">{tarea.estado === "Pendiente" ? "Editar Tarea" : "Detalles de la Tarea"}</h2>

        <input
          type="text"
          className="w-full mt-2 p-2 border rounded"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          disabled={tarea.estado !== "Pendiente" && tarea.estado !== "Sinasignar"}
        />

        <textarea
          className="w-full mt-2 p-2 border rounded"
          value={observacion}
          onChange={(e) => setObservacion(e.target.value)}
          disabled={tarea.estado !== "Pendiente" && tarea.estado !== "Sinasignar"}
        />
        {/* Mostrar comentario de cierre si la tarea está cerrada */}
        {tarea.estado === "Cerrado" && comentario_cierre && (
          <div className="w-full mt-2 p-2 border rounded bg-gray-100">
            <strong>Comentario de Cierre:</strong>
            <p>{comentario_cierre}</p>
          </div>
        )}
        {/* Mostrar la fecha de cierre si la tarea está cerrada */}
        {tarea.estado === "Cerrado" && tarea.fecha_cierre && (
          <div className="mt-4">
            <h3 className="font-bold">Fecha de Cierre:</h3>
            <p>{formatFecha(tarea.fecha_cierre)}</p>
          </div>
        )}

        <input
          type="date"
          className="w-full mt-2 p-2 border rounded"
          value={fechaEjecucion}
          onChange={(e) => setFechaEjecucion(e.target.value)}
          disabled={tarea.estado !== "Pendiente" && tarea.estado !== "Sinasignar"}
        />

        <input
          type="time"
          className="w-full mt-2 p-2 border rounded"
          value={horaEjecucion}
          onChange={(e) => setHoraEjecucion(e.target.value)}
          disabled={tarea.estado !== "Pendiente" && tarea.estado !== "Sinasignar"}
        />
        <div className="w-full mt-2">
          <label htmlFor="estado" className="block text-sm text-gray-700">Estado</label>
          <select
            id="estado"
            className="w-full mt-2 p-2 border rounded"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            disabled={tarea.estado !== "Pendiente" && tarea.estado !== "Sinasignar"}
          >
            <option value="Sinasignar">Sin asignar</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Cerrada">Cerrada</option> {/* Si deseas agregar más estados */}
          </select>
        </div>

        {/* Si la tarea está pendiente, permitir agregar comentario de cierre */}
        {tarea.estado === "Pendiente" && (
          <textarea
            className="w-full mt-4 p-2 border rounded"
            placeholder="Añadir comentario de cierre..."
            value={comentario_cierre}
            onChange={(e) => setComentarioCierre(e.target.value)}
          />
        )}

        {/* Botones */}
        <div className="flex justify-end mt-4 gap-2">
          {tarea.estado === "Pendiente" && (
            <>
              <button onClick={handleEditarTarea} className="bg-green-500 text-white px-4 py-2 rounded">
                Guardar cambios
              </button>
              <button onClick={handleCerrarTarea} className="bg-blue-500 text-white px-4 py-2 rounded">
                Cerrar Tarea
              </button>
              <button
                onClick={handleEliminarTarea}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Eliminar Tarea
              </button>
            </>
          )}
          {tarea.estado === "Sinasignar" && (
            <>
              <button onClick={handleEditarTarea} className="bg-green-500 text-white px-4 py-2 rounded">
                Guardar cambios
              </button>
              <button
                onClick={handleEliminarTarea}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Eliminar Tarea
              </button>
            </>
          )}
          {tarea.estado === "Cerrado" && (
            <>

              <button
                onClick={handleEliminarTarea}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Eliminar Tarea
              </button>

            </>
          )}
          <button onClick={onClose} className="bg-gray-300 text-black px-4 py-2 rounded">
            Cerrar
          </button>

        </div>
      </div>
    </div>
  );
}
