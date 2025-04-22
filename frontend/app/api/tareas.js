const API_URL = "http://192.168.1.89:5000/api"; // Asegúrate de usar el puerto correcto

export async function obtenerTareas() {
  const res = await fetch(`${API_URL}/tareas`, { cache: "no-store" });
  return res.ok ? await res.json() : [];
}

export async function cerrarTarea(id, comentario_cierre) {
    const res = await fetch(`${API_URL}/tareas/cerrar/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comentario_cierre }),
    });
  
    return res.ok;
  }
export async function editarTarea(id, titulo, observacion, fecha_ejecucion, estado) {
    const res = await fetch(`${API_URL}/tareas/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ titulo, observacion, fecha_ejecucion, estado }),
    });
  
    return res.ok ? await res.json() : null;
  }
  export async function eliminarTarea(id) {
    const res = await fetch(`${API_URL}/tareas/${id}`, {
      method: "DELETE",
    });
  
    return res.ok;
  }

