import "./globals.css";
import '@fortawesome/fontawesome-free/css/all.min.css';



export const metadata = {
  title: "Gestor de Tareas",
  description: "Aplicación para gestionar tareas en tiempo real",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-gray-100 text-gray-900">{children}</body>
    </html>
  );
}
