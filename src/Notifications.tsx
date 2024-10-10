import React, { useEffect, useState } from "react";
import { isSameDay, parse, isWithinInterval } from "date-fns";

interface PlanningDetail {
  alimentador: string;
  fechaCorte: string;
  horaDesde: string;
  horaHasta: string;
  comentario: string;
  fechaRegistro: string;
  fechaHoraCorte: string;
}

interface Notification {
  idUnidadNegocios: number;
  cuentaContrato: string;
  alimentador: string;
  cuen: string;
  direccion: string;
  fechaRegistro: string;
  detallePlanificacion: PlanningDetail[];
}

interface ApiResponse {
  resp: string;
  mensaje: string | null;
  mensajeError: string | null;
  extra: string | null;
  notificaciones: Notification[];
}

interface ResponseAdapter {
  details: {
    idUnidadNegocios: number;
    cuentaContrato: string;
    alimentador: string;
    cuen: string;
    direccion: string;
    fechaRegistro: string;
  };
  notificaciones: { [fechaCorte: string]: PlanningDetail[] };
}

const Notifications: React.FC = () => {
  const [data, setData] = useState<ApiResponse | null>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [identification, setIdentification] = useState<string>("");

  const fetchData = async (identification: string) => {
    if (!identification) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.cnelep.gob.ec/servicios-linea/v1/notificaciones/consultar/${identification}/IDENTIFICACION`
      );
      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }
      const result: ApiResponse = await response.json();

      if (result.resp === "ERROR") {
        setError(result.mensaje);
        setData(null);
      } else {
        setData(result);
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(identification);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Evitar que se recargue la página
    fetchData(identification);
  };

  function agruparPorFechaCorte(data: ApiResponse): ResponseAdapter {
    const agrupado: { [fechaCorte: string]: PlanningDetail[] } = {};

    data.notificaciones.forEach((notificacion) => {
      const {
        idUnidadNegocios,
        cuentaContrato,
        alimentador,
        cuen,
        direccion,
        fechaRegistro,
      } = notificacion;

      notificacion.detallePlanificacion.forEach((detalle) => {
        if (!agrupado[detalle.fechaCorte]) {
          agrupado[detalle.fechaCorte] = [];
        }
        agrupado[detalle.fechaCorte].push(detalle);
      });

      return {
        details: {
          idUnidadNegocios,
          cuentaContrato,
          alimentador,
          cuen,
          direccion,
          fechaRegistro,
        },
        notificaciones: agrupado, // Retorna el agrupado por fecha
      };
    });

    // Retornar el objeto con la estructura ResponseAdapter
    return {
      details: {
        idUnidadNegocios: data.notificaciones[0].idUnidadNegocios,
        cuentaContrato: data.notificaciones[0].cuentaContrato,
        alimentador: data.notificaciones[0].alimentador,
        cuen: data.notificaciones[0].cuen,
        direccion: data.notificaciones[0].direccion,
        fechaRegistro: data.notificaciones[0].fechaRegistro,
      },
      notificaciones: agrupado, // Notificaciones agrupadas por fechaCorte
    };
  }

  const isPowerCut = (
    fechaHoraCorte: string,
    horaDesde: string,
    horaHasta: string
  ): boolean => {
    const now = new Date();

    const cutDateTime = parse(fechaHoraCorte, "yyyy-MM-dd HH:mm", new Date());
    const isSameDate = isSameDay(now, cutDateTime);

    const startDate = new Date(cutDateTime);
    const endDate = new Date(cutDateTime);

    const [startHour, startMinute] = horaDesde.split(":").map(Number);
    const [endHour, endMinute] = horaHasta.split(":").map(Number);

    startDate.setHours(startHour, startMinute, 0, 0);
    endDate.setHours(endHour === 0 ? 24 : endHour, endMinute, 0, 0);

    const isWithinTimeRange = isWithinInterval(now, {
      start: startDate,
      end: endDate,
    });
    return isSameDate && isWithinTimeRange;
  };

  if (loading) {
    return <div className="text-center text-gray-600">Cargando...</div>;
  }

  return (
    <div className="p-4 max-w-3xl mx-auto bg-white rounded-xl shadow-lg">
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={identification}
          onChange={(e) => setIdentification(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full"
          placeholder="Ingrese la identificación"
        />
        <button
          type="submit"
          className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-md"
        >
          Consultar
        </button>
      </form>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {data?.notificaciones && data.notificaciones.length > 0 ? (
        <div className={`grid grid-cols-1 gap-2`}>
          <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold">
              Unidad de Negocios:{" "}
              {agruparPorFechaCorte(data).details.idUnidadNegocios}
            </h2>
            <h3 className="text-lg">
              Cuenta Contrato:{" "}
              {agruparPorFechaCorte(data).details.cuentaContrato}
            </h3>
            <h3 className="text-lg">
              Dirección: {agruparPorFechaCorte(data).details.direccion}
            </h3>
            <h3 className="text-lg">
              Fecha de Registro:{" "}
              {agruparPorFechaCorte(data).details.fechaRegistro}
            </h3>
          </div>
          {Object.entries(agruparPorFechaCorte(data).notificaciones).map(
            ([fechaCorte, detalles]) => {
              return (
                <div
                  key={fechaCorte}
                  className="border rounded-lg p-4 bg-white mb-4 shadow"
                >
                  <h4 className="text-xl font-semibold mb-2">{fechaCorte}</h4>
                  <div className="mt-2 grid grid-cols-1 gap-2">
                    {detalles.map((detalle, index) => {
                      const isActiveCutTime = isPowerCut(
                        detalle.fechaHoraCorte,
                        detalle.horaDesde,
                        detalle.horaHasta
                      );
                      return (
                        <div
                          key={index}
                          className={`p-4 border-l-4  rounded-md ${
                            isActiveCutTime
                              ? "border-red-500 bg-red-50"
                              : "border-blue-500 bg-blue-50"
                          }`}
                        >
                          <p>
                            Hora Desde: {detalle.horaDesde} - Hora Hasta:{" "}
                            {detalle.horaHasta}
                          </p>
                          <p className="text-sm text-gray-600">
                            Comentario: {detalle.comentario}
                          </p>
                          <p className="text-sm text-gray-500">
                            Fecha y Hora de Corte:{" "}
                            {new Date(detalle.fechaHoraCorte).toLocaleString()}
                          </p>
                          {isActiveCutTime && (
                            <p className="text-red-600 font-semibold">
                              ¡Corte Activo!
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }
          )}
        </div>
      ) : (
        <>
          {data?.notificaciones && data?.notificaciones.length < 0 && (
            <p className="text-gray-600">No hay notificaciones disponibles.</p>
          )}
        </>
      )}
    </div>
  );
};

export default Notifications;
