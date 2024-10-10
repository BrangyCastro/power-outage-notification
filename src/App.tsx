import Notifications from "./Notifications";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-800 p-2 text-white text-center">
        <h1 className="text-2xl">
          Horarios de cortes de energía eléctrica{" "}
          <span className="text-sm text-gray-500">v0.0.1 (no oficial)</span>
        </h1>
      </header>
      <main className="flex-grow m-2">
        <Notifications />
      </main>
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto text-center text-gray-500 px-2 text-sm">
          <p>
            Esta página es una mejora de diseño del sitio web oficial de cortes
            de energía de CNELEP, ofreciendo una experiencia más intuitiva y
            moderna para nuestros usuarios. Agradecemos tu visita y esperamos
            que disfrutes de esta nueva interfaz.
          </p>
          <p className="mt-2">
            Sitio web oficial{" "}
            <a
              href="https://serviciosenlinea.cnelep.gob.ec/cortes-energia/"
              target="_blank"
              className="text-blue-400 underline"
            >
              serviciosenlinea.cnelep.gob.ec
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
