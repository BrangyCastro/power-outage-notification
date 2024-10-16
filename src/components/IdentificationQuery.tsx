import React, { useState, useEffect, useRef } from "react";
import SearchSelect from "./SearchSelect";
import { SearchCriterion } from "../interface";
import { criterionLabels } from "../utils";

const IdentificationQuery = ({
  identificationState,
  handleSubmit,
  selectedCriterionState,
}: {
  identificationState: [string, React.Dispatch<React.SetStateAction<string>>];
  selectedCriterionState: [
    SearchCriterion,
    React.Dispatch<React.SetStateAction<SearchCriterion>>
  ];
  handleSubmit: (id: string, criterion: SearchCriterion) => void;
}) => {
  const [selectedCriterion, setSelectedCriterion] = selectedCriterionState;
  const [identification, setIdentification] = identificationState;
  const [savedIdentifications, setSavedIdentifications] = useState<string[]>(
    []
  );
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLUListElement | null>(null);

  // Cargar identificaciones guardadas al montar el componente
  useEffect(() => {
    const savedIds: string[] = JSON.parse(
      localStorage.getItem("identifications") || "[]"
    );
    setSavedIdentifications(savedIds);
  }, []);

  // Guardar identificación
  const handleSaveIdentification = () => {
    if (
      identification.trim() &&
      !savedIdentifications.includes(identification)
    ) {
      const updatedIdentifications = [...savedIdentifications, identification];
      setSavedIdentifications(updatedIdentifications);
      localStorage.setItem(
        "identifications",
        JSON.stringify(updatedIdentifications)
      );
    }
  };

  // Manejar el clic en el input
  const handleInputClick = () => {
    setShowDropdown(!showDropdown);
  };

  // Manejar la selección de una identificación guardada
  const handleSelectIdentification = (id: string) => {
    setIdentification(id);
    setShowDropdown(false); // Cerrar el dropdown
  };

  const handleSubmitQuery = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(identification, selectedCriterion);
    handleSaveIdentification();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIdentification(value);
  };

  // Eliminar todas las identificaciones guardadas
  const handleDeleteAll = () => {
    setSavedIdentifications([]);
    localStorage.removeItem("identifications");
    setShowDropdown(false);
  };

  // Eliminar una identificación específica
  const handleDeleteIdentification = (id: string) => {
    const updatedIdentifications = savedIdentifications.filter(
      (savedId) => savedId !== id
    );
    setSavedIdentifications(updatedIdentifications);
    localStorage.setItem(
      "identifications",
      JSON.stringify(updatedIdentifications)
    );
  };

  // Manejar clics fuera del dropdown
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setShowDropdown(false);
    }
  };

  // Efecto para agregar y limpiar el manejador de eventos de clics
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <form
        onSubmit={handleSubmitQuery}
        className="mb-4 flex gap-3 justify-between items-end flex-col md:flex-row"
      >
        <SearchSelect
          onChange={(value) => setSelectedCriterion(value)}
          selectedCriterionState={selectedCriterionState}
        />
        <div className="w-full">
          <input
            type="number"
            value={identification}
            onChange={handleChange}
            onClick={handleInputClick}
            placeholder={`Escribe tu ${criterionLabels[
              selectedCriterion
            ].toLowerCase()}`}
            className="w-full p-2 border rounded"
          />
          {showDropdown && savedIdentifications.length > 0 && (
            <ul
              ref={dropdownRef}
              className="absolute bg-white border border-gray-300 mt-1 w-full max-w-96 rounded-md shadow-lg z-10 max-h-40 overflow-auto"
            >
              <li className="p-2 hover:bg-gray-200 cursor-pointer flex justify-between items-center">
                <button
                  onClick={handleDeleteAll}
                  className="text-red-400 text-xs"
                >
                  Eliminar todas las identificaciones
                </button>
              </li>
              {savedIdentifications.map((id, index) => (
                <li
                  key={index}
                  onClick={() => handleSelectIdentification(id)}
                  className="p-2 hover:bg-gray-200 cursor-pointer flex justify-between items-center"
                >
                  {id}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteIdentification(id);
                    }}
                    className="text-red-400 text-xs"
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          type="submit"
          className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-md"
        >
          Consultar
        </button>
      </form>
    </>
  );
};

export default IdentificationQuery;
