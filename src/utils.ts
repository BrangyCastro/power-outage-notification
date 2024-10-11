import { SearchCriterion } from "./interface";

export const criterionLabels: Record<SearchCriterion, string> = {
  [SearchCriterion.UNIQUE_CODE]: "Código único",
  [SearchCriterion.CONTRACT_ACCOUNT]: "Cuenta contrato",
  [SearchCriterion.ID]: "Número de identificación",
};
