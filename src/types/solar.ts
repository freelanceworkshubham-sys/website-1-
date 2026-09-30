export interface SolarCalculationInputs {
  monthlyBill: number;
  roofArea: number; // in sq ft
  sunHours: number; // peak sun hours per day
  batteryCapacity: number; // in kWh
  roofType: 'shingle' | 'tile' | 'metal' | 'flat';
}

export interface SolarCalculationResults {
  systemSizeKw: number;
  panelCount: number;
  annualProductionKwh: number;
  firstYearSavings: number;
  twentyFiveYearSavings: number;
  co2OffsetTons: number;
  treesEquivalent: number;
  paybackYears: number;
  gridIndependencePercent: number;
  federalTaxCreditValue: number;
  estimatedNetCost: number;
}

export interface SystemTier {
  id: string;
  name: string;
  tagline: string;
  idealFor: string;
  panelEfficiency: string;
  warrantyYears: number;
  inverterType: string;
  batteryIncluded: boolean;
  estPayback: string;
  specs: {
    maxOutput: string;
    degradationRate: string;
    snowWindRating: string;
    monitoringApp: string;
  };
}
