export default function HomePage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Bienvenido</h1>
      <p className="mt-4 text-gray-600">Ir a la lista de tareas:</p>
      <a href="/tareas" className="text-blue-500 underline">Ver Tareas</a>
    </main>
  );
}
