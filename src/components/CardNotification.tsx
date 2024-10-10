import { isSameDay, parse, isWithinInterval } from "date-fns";
import { PlanningDetail } from "../interface";

const CardNotification = ({
  fechaCorte,
  detalles,
}: {
  fechaCorte: string;
  detalles: PlanningDetail[];
}) => {
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

  return (
    <div className="border rounded-lg p-4 bg-white mb-4 shadow">
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
                <p className="text-red-600 font-semibold">¡Corte Activo!</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default CardNotification;
