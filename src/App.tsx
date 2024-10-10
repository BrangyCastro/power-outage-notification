import Notifications from "./Notifications";

function App() {
  return (
    <>
      <header className="bg-gray-800 p-2 text-white text-center">
        <h1 className="text-2xl">
          Horarios de cortes de energía eléctrica{" "}
          <span className="text-sm text-gray-500">v0.0.1 (no oficial)</span>
        </h1>
      </header>
      <div className="m-2">
        <Notifications />
      </div>
    </>
  );
}

export default App;
