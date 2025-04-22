import { useState } from "react";
import ModalTarea from "./ModalTarea"; // Asegúrate de que este archivo exista

export default function TareaCard({ tarea }) {
  const [mostrarModal, setMostrarModal] = useState(false);

  const colorClase =
    tarea.estado === "finalizada" ? "bg-green-100 border-green-400" : "bg-white border-gray-200";

    // Función para formatear la fecha en la zona horaria local
    const formatFechacierre = (fecha) => {
      if (!fecha) return null;
      const date = new Date(fecha);
    
      // Convertir la fecha a UTC antes de hacer la conversión a zona horaria local
      const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
    
      // Ahora formateamos en la zona horaria local
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,  // Usa el formato de 12 horas (AM/PM)
      };
    
      return utcDate.toLocaleString("es-ES", options);
    };

    const formatFechaejecucion = (fecha) => {
      if (!fecha) return null;
      const date = new Date(fecha);
    
      // Formatear la fecha en la zona horaria local sin convertirla a UTC
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,  // Usa el formato de 12 horas (AM/PM)
      };
    
      return date.toLocaleString("es-ES", options);
    };

  return (
    <>
      <div
        className={`shadow-md rounded-lg p-4 border ${colorClase} cursor-pointer hover:shadow-lg transition`}
        onClick={() => setMostrarModal(true)}
      >
        <h2 className="text-lg font-bold text-gray-800">{tarea.titulo}</h2>
        <p className="text-gray-600">{tarea.observacion}</p>
        <p className="text-sm text-gray-500 mt-2">
          Fecha programada: {formatFechaejecucion(tarea.fecha_ejecucion)}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Fecha cierre: {formatFechacierre(tarea.fecha_cierre)}
        </p>
      </div>

      {mostrarModal && (
        <ModalTarea tarea={tarea} onClose={() => setMostrarModal(false)} />
      )}
    </>
  );
}
