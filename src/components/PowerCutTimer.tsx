import React, { useEffect, useState } from "react";
import { parse, isAfter, differenceInMilliseconds } from "date-fns";

const PowerCutTimer: React.FC<{
  fechaHoraCorte: string;
  horaHasta: string;
}> = ({ fechaHoraCorte, horaHasta }) => {
  const [remainingTime, setRemainingTime] = useState<number>(0);

  useEffect(() => {
    const now = new Date();
    const cutDateTime = parse(fechaHoraCorte, "yyyy-MM-dd HH:mm", new Date());

    const [endHour, endMinute] = horaHasta.split(":").map(Number);
    const endDate = new Date(cutDateTime);
    endDate.setHours(endHour === 0 ? 24 : endHour, endMinute, 0, 0);

    if (isAfter(now, endDate)) {
      setRemainingTime(0);
    }
    setRemainingTime(differenceInMilliseconds(endDate, now));
  }, [horaHasta, fechaHoraCorte]);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prevTime) => {
        const newTime = prevTime - 1000; // Disminuir el tiempo en 1 segundo
        return newTime < 0 ? 0 : newTime; // Asegurarse de no tener valores negativos
      });
    }, 1000);

    return () => clearInterval(timer); // Limpiar el intervalo al desmontar
  }, []);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      "0"
    );
    const seconds = String(totalSeconds % 60).padStart(2, "0");

    return { hours, minutes, seconds };
  };

  const formattedTime = formatTime(remainingTime);

  return (
    <div>
      <h3 className="text-base font-bold">
        Tiempo restante para que regrese la luz:
      </h3>
      <div className="text-lg flex items-center justify-center gap-1 py-2">
        <div className="flex flex-col gap-1 items-center">
          <span className="p-1 px-5 bg-gray-50 border rounded-md">
            {formattedTime.hours}
          </span>
          <span className="text-xs text-gray-500">horas</span>
        </div>
        <span className="mb-6">:</span>
        <div className="flex flex-col gap-1 items-center">
          <span className="p-1 px-5 bg-gray-50 border rounded-md">
            {formattedTime.minutes}
          </span>
          <span className="text-xs text-gray-500">minutos</span>
        </div>
        <span className="mb-6">:</span>
        <div className="flex flex-col gap-1 items-center">
          <span className="p-1 px-5 bg-gray-50 border rounded-md">
            {formattedTime.seconds}
          </span>
          <span className="text-xs text-gray-500">segundos</span>
        </div>
      </div>
    </div>
  );
};

export default PowerCutTimer;
