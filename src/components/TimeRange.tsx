import { format, parse, differenceInMinutes, addDays } from "date-fns";
import { useEffect, useState } from "react";

const TimeRange = ({
  horaDesde,
  horaHasta,
  is24HourFormat,
}: {
  horaDesde: string;
  horaHasta: string;
  is24HourFormat: boolean;
}) => {
  const [formattedHoraDesde, setFormattedHoraDesde] = useState("");
  const [formattedHoraHasta, setFormattedHoraHasta] = useState("");

  // Convertir string a objeto Date
  const desdeDate = parse(horaDesde, "HH:mm", new Date());
  let hastaDate = parse(horaHasta, "HH:mm", new Date());

  // Si horaHasta es menor que horaDesde, agregar un día a horaHasta
  if (format(hastaDate, "HH:mm") === "00:00" || hastaDate < desdeDate) {
    hastaDate = addDays(hastaDate, 1); // Añadir un día a hastaDate
  }

  useEffect(() => {
    setFormattedHoraDesde(
      is24HourFormat ? format(desdeDate, "HH:mm") : format(desdeDate, "hh:mm a")
    );

    setFormattedHoraHasta(
      is24HourFormat ? format(hastaDate, "HH:mm") : format(hastaDate, "hh:mm a")
    );
  }, [is24HourFormat]);

  const difference = differenceInMinutes(hastaDate, desdeDate);
  const hours = Math.floor(difference / 60);

  return (
    <div className="">
      <p>
        Desde: {formattedHoraDesde} - Hasta: {formattedHoraHasta}{" "}
        <strong>({hours} horas de corte)</strong>
      </p>
    </div>
  );
};

export default TimeRange;
