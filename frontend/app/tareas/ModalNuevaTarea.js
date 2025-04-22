"use client";

import { useState } from "react";

export default function ModalNuevaTarea({ cerrarModal }) {
  const [titulo, setTitulo] = useState("");
  const [observacion, setObservacion] = useState("");
  const [fechaEjecucion, setFechaEjecucion] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const nuevaTarea = {
      titulo,
      observacion,
      fecha_ejecucion: fechaEjecucion,
    };
  
    try {
      const respuesta = await fetch("http://192.168.1.89:5000/api/tareas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevaTarea),
      });
  
      const data = await respuesta.json();
      
      if (!respuesta.ok) {
        throw new Error(data.error || "Error desconocido en la creación de la tarea");
      }
  
      console.log("✅ Tarea creada:", data);
      cerrarModal(); // Cierra el modal tras crear la tarea
    } catch (error) {
      console.error("❌ Error al crear la tarea:", error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Nueva Tarea</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Título</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Observación</label>
            <textarea
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Fecha de Ejecución</label>
            <input
              type="datetime-local"
              value={fechaEjecucion}
              onChange={(e) => setFechaEjecucion(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={cerrarModal} className="px-4 py-2 bg-gray-500 text-white rounded">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
