import { format, parse, differenceInMinutes } from "date-fns";
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
  const hastaDate = parse(horaHasta, "HH:mm", new Date());

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
