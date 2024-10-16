import { isSameDay, parse, isWithinInterval, isAfter } from "date-fns";
import { PlanningDetail, PowerCutStatus } from "../interface";
import TimeRange from "./TimeRange";
import PowerCutTimer from "./PowerCutTimer";
import { useState } from "react";

const CardNotification = ({
  fechaCorte,
  detalles,
  is24HourFormat,
}: {
  fechaCorte: string;
  detalles: PlanningDetail[];
  is24HourFormat: boolean;
}) => {
  const [powerCutStatuses, setPowerCutStatuses] = useState<
    Record<number, PowerCutStatus>
  >({});

  const handleTimerEnd = (index: number) => {
    setPowerCutStatuses((prevStatuses) => ({
      ...prevStatuses,
      [index]: PowerCutStatus.ALREADY_CUT,
    }));
  };

  const isPowerCut = (
    fechaHoraCorte: string,
    horaDesde: string,
    horaHasta: string
  ): PowerCutStatus => {
    const now = new Date();
    const cutDateTime = parse(fechaHoraCorte, "yyyy-MM-dd HH:mm", new Date());

    const startDate = new Date(cutDateTime);
    const endDate = new Date(cutDateTime);

    const [startHour, startMinute] = horaDesde.split(":").map(Number);
    const [endHour, endMinute] = horaHasta.split(":").map(Number);

    startDate.setHours(startHour, startMinute, 0, 0);
    endDate.setHours(endHour === 0 ? 24 : endHour, endMinute, 0, 0);

    const isSameDate = isSameDay(now, cutDateTime);
    const isWithinTimeRange = isWithinInterval(now, {
      start: startDate,
      end: endDate,
    });

    const hasPassedCut = isAfter(now, endDate);

    if (hasPassedCut) {
      return PowerCutStatus.ALREADY_CUT;
    } else if (isSameDate && isWithinTimeRange) {
      return PowerCutStatus.CURRENTLY_CUT;
    } else {
      return PowerCutStatus.NOT_CUT;
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white mb-4 shadow">
      <h4 className="text-xl font-semibold mb-2">{fechaCorte}</h4>
      <div className="mt-2 grid grid-cols-1 gap-2">
        {detalles.map((detalle, index) => {
          const status =
            powerCutStatuses[index] ??
            isPowerCut(
              detalle.fechaHoraCorte,
              detalle.horaDesde,
              detalle.horaHasta
            );

          return (
            <div
              key={index}
              className={`p-4 border-l-4  rounded-md ${
                status === PowerCutStatus.CURRENTLY_CUT
                  ? "border-red-500 bg-red-50"
                  : status === PowerCutStatus.ALREADY_CUT
                  ? "border-green-500 bg-green-50"
                  : "border-blue-500 bg-blue-50"
              }`}
            >
              {status === PowerCutStatus.NOT_CUT && (
                <p className="text-blue-600 font-semibold">¡Corte Pendiente!</p>
              )}
              {status === PowerCutStatus.CURRENTLY_CUT && (
                <p className="text-red-600 font-semibold">¡Corte Activo!</p>
              )}
              {status === PowerCutStatus.ALREADY_CUT && (
                <p className="text-green-600 font-semibold">
                  ¡Corte ya realizado!
                </p>
              )}
              {status === PowerCutStatus.CURRENTLY_CUT && (
                <PowerCutTimer
                  fechaHoraCorte={detalle.fechaHoraCorte}
                  horaHasta={detalle.horaHasta}
                  onTimerEnd={() => handleTimerEnd(index)}
                />
              )}
              <TimeRange
                horaDesde={detalle.horaDesde}
                horaHasta={detalle.horaHasta}
                is24HourFormat={is24HourFormat}
              />
              <p className="text-sm text-gray-600">
                Comentario: {detalle.comentario}
              </p>
              <p className="text-sm text-gray-500">
                Fecha y Hora de Corte:{" "}
                {new Date(detalle.fechaHoraCorte).toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default CardNotification;
