import type { FuelCode } from "@/types/emission";

// ========================
// Emission Factor (EF) constants from the WRI Reference Workbook.
// Source: 01_Intro_Glossary sheet — "Fuel & Grid Emission Factor Reference"
// ========================

/** Emission factors keyed by FuelCode; units vary per fuel type */
export const EMISSION_FACTORS: Record<FuelCode, number> = {
  GASOLINE: 2.31, // kgCO2 / liter
  DIESEL: 2.65, // kgCO2 / liter
  B35: 1.61, // kgCO2 / liter
  GRID_ELECTRICITY: 0.7, // kgCO2 / kWh
  MARINE_DIESEL: 3.18, // tCO2  / ton_fuel
  HFO_LFO: 3.17, // tCO2  / ton_fuel
  LNG_LPG: 3.02, // tCO2  / ton_fuel
  JET_FUEL: 3.16, // kgCO2 / kg_fuel
} as const;

/** Aviation fuel density (kg per litre) */
export const AVIATION_FUEL_DENSITY = 0.8; // kg/L
