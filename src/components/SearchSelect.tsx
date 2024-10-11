import React from "react";
import { SearchCriterion } from "../interface";
import { criterionLabels } from "../utils";

// Props for the Select component
interface SelectProps {
  onChange: (value: SearchCriterion) => void;
  selectedCriterionState: [
    SearchCriterion,
    React.Dispatch<React.SetStateAction<SearchCriterion>>
  ];
}

const SearchSelect: React.FC<SelectProps> = ({
  onChange,
  selectedCriterionState,
}) => {
  const [selectedCriterion, setSelectedCriterion] = selectedCriterionState;

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as SearchCriterion;
    setSelectedCriterion(value);
    onChange(value);
  };

  return (
    <div className="relative inline-block w-96">
      <select
        value={selectedCriterion}
        defaultValue={selectedCriterion}
        onChange={handleChange}
        className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2.5 px-4 pr-8 rounded shadow leading-tight focus:outline-none focus:ring focus:ring-blue-500"
      >
        {Object.values(SearchCriterion).map((criterion) => (
          <option key={criterion} value={criterion}>
            {criterionLabels[criterion]}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 10l5 5 5-5H7z"
          />
        </svg>
      </div>
    </div>
  );
};

export default SearchSelect;
