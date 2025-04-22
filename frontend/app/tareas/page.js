"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";
import TareaCard from "./TareaCard";
import ModalNuevaTarea from "./ModalNuevaTarea"; // Importamos el modal

const socket = io("http://192.168.1.89:5000");

export default function HomePage() {
  const [tareas, setTareas] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false); // Controla el modal

  useEffect(() => {
    async function cargarTareas() {
      const respuesta = await fetch("http://192.168.1.89:5000/api/tareas");
      const datos = await respuesta.json();
      setTareas(datos);
    }
    cargarTareas();

    // Escuchar eventos de WebSockets
    socket.on("nuevaTarea", (tarea) => {
      console.log("Nueva tarea recibida:", tarea);
      setTareas((prevTareas) => [...prevTareas, tarea]);
    });

    socket.on("tareaActualizada", (tareaActualizada) => {
      console.log("Tarea actualizada:", tareaActualizada);
      setTareas((prevTareas) =>
        prevTareas.map((t) => (t.id === tareaActualizada.id ? tareaActualizada : t))
      );
    });

    // ✅ Escuchar evento "tareaCerrada"
    socket.on("tareaCerrada", (tareaCerrada) => {
      console.log("Tarea cerrada:", tareaCerrada);
      setTareas((prevTareas) =>
        prevTareas.map((t) => (t.id === tareaCerrada.id ? tareaCerrada : t))
      );
    });

    socket.on("tareaEliminada", (tareaEliminada) => {
      console.log("Tarea eliminada:", tareaEliminada);
      setTareas((prevTareas) => prevTareas.filter((t) => t.id !== tareaEliminada.id));
    });

    return () => {
      socket.off("nuevaTarea");
      socket.off("tareaActualizada");
      socket.off("tareaCerrada"); // ✅ Importante limpiar el evento
      socket.off("tareaEliminada");
    };
  }, []);
  const tareasSinasignar = tareas.filter((tarea) => tarea.estado.trim().toLowerCase() === "sinasignar");
  const tareasPendientes = tareas.filter((tarea) => tarea.estado.trim().toLowerCase() === "pendiente");
  const tareasFinalizadas = tareas.filter((tarea) => tarea.estado.trim().toLowerCase() === "cerrado");

  return (
    <main className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Lista de Tareas</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sección de tareas pendientes */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Sin asignar</h2>
          {tareasSinasignar.length === 0 ? (
            <p className="text-gray-500">No hay tareas sin asignar.</p>
          ) : (
            <div className="grid gap-4">
              {tareasSinasignar
                .sort((a, b) => new Date(a.fecha_ejecucion) - new Date(b.fecha_ejecucion)) // Ordena por fecha
                .map((tarea) => (
                  <TareaCard key={tarea.id} tarea={tarea} />
                ))}
            </div>
          )}
        </div>
        {/* Sección de tareas pendientes */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Pendientes</h2>
          {tareasPendientes.length === 0 ? (
            <p className="text-gray-500">No hay tareas pendientes.</p>
          ) : (
            <div className="grid gap-4">
              {tareasPendientes
                .sort((a, b) => new Date(a.fecha_ejecucion) - new Date(b.fecha_ejecucion)) // Ordena por fecha
                .map((tarea) => (
                  <TareaCard key={tarea.id} tarea={tarea} />
                ))}
            </div>
          )}
        </div>
        

        {/* Sección de tareas finalizadas */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Finalizadas</h2>
          {tareasFinalizadas.length === 0 ? (
            <p className="text-gray-500">No hay tareas finalizadas.</p>
          ) : (
            <div className="grid gap-4">
              {tareasFinalizadas.map((tarea) => (
                <TareaCard key={tarea.id} tarea={tarea} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Botón flotante para agregar nueva tarea */}
      <button
        className="fixed bottom-8 right-8 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition"
        onClick={() => setModalAbierto(true)}
      >
        ➕
      </button>

      {/* Modal para crear nueva tarea */}
      {modalAbierto && <ModalNuevaTarea cerrarModal={() => setModalAbierto(false)} />}
    </main>
  );
}
