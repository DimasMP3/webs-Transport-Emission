import type { EmissionRecord } from "@/types/emission";
import {
  calculateRoadEmission,
  calculateRailEmission,
  calculateSeaEmission,
  calculateAviationEmission,
} from "@/utils/calculator";

// ========================
// Seed / mock data that mirrors the WRI dummy dataset.
// Used for demonstration when no CSV is uploaded.
// ========================

export const MOCK_EMISSION_DATA: EmissionRecord[] = [
  // --- Road ---
  {
    id: "road-1",
    sector: "Road",
    category: "Passenger Cars",
    energyConsumption: 20_400_000_000,
    unit: "Liter",
    totalCO2: calculateRoadEmission(20_000_000, 12_000, 8.5, "GASOLINE"),
  },
  {
    id: "road-2",
    sector: "Road",
    category: "Motorcycles",
    energyConsumption: 19_200_000_000,
    unit: "Liter",
    totalCO2: calculateRoadEmission(100_000_000, 8_000, 2.4, "GASOLINE"),
  },
  {
    id: "road-3",
    sector: "Road",
    category: "Light Trucks",
    energyConsumption: 14_700_000_000,
    unit: "Liter",
    totalCO2: calculateRoadEmission(4_200_000, 25_000, 14.0, "DIESEL"),
  },
  {
    id: "road-4",
    sector: "Road",
    category: "Heavy Trucks",
    energyConsumption: 26_880_000_000,
    unit: "Liter",
    totalCO2: calculateRoadEmission(1_600_000, 60_000, 28.0, "B35"),
  },
  {
    id: "road-5",
    sector: "Road",
    category: "Buses",
    energyConsumption: 1_650_000_000,
    unit: "Liter",
    totalCO2: calculateRoadEmission(100_000, 55_000, 30.0, "B35"),
  },

  // --- Rail ---
  {
    id: "rail-1",
    sector: "Rail",
    category: "Commuter Train (Electric)",
    energyConsumption: 80_300_000,
    unit: "kWh",
    totalCO2: calculateRailEmission(80_300_000, "Electric", "GRID_ELECTRICITY"),
  },
  {
    id: "rail-2",
    sector: "Rail",
    category: "MRT (Electric)",
    energyConsumption: 62_086_500,
    unit: "kWh",
    totalCO2: calculateRailEmission(62_086_500, "Electric", "GRID_ELECTRICITY"),
  },
  {
    id: "rail-3",
    sector: "Rail",
    category: "Local Diesel Train",
    energyConsumption: 2_810_500,
    unit: "Liter",
    totalCO2: calculateRailEmission(2_810_500, "Diesel", "DIESEL"),
  },

  // --- Sea ---
  {
    id: "sea-1",
    sector: "Sea",
    category: "Passenger Ferry",
    energyConsumption: 25_200,
    unit: "Ton fuel",
    totalCO2: calculateSeaEmission(1_680_000, 0.015, "MARINE_DIESEL"),
  },
  {
    id: "sea-2",
    sector: "Sea",
    category: "Container Ship (Domestic)",
    energyConsumption: 63_960,
    unit: "Ton fuel",
    totalCO2: calculateSeaEmission(2_132_000, 0.03, "HFO_LFO"),
  },
  {
    id: "sea-3",
    sector: "Sea",
    category: "Tanker (International)",
    energyConsumption: 204_750,
    unit: "Ton fuel",
    totalCO2: calculateSeaEmission(4_875_000, 0.042, "HFO_LFO"),
  },

  // --- Aviation ---
  {
    id: "avi-1",
    sector: "Aviation",
    category: "Domestic Flights",
    energyConsumption: 5_000_000,
    unit: "Liter",
    totalCO2: calculateAviationEmission(10_000, 500),
  },
  {
    id: "avi-2",
    sector: "Aviation",
    category: "International Flights",
    energyConsumption: 12_000_000,
    unit: "Liter",
    totalCO2: calculateAviationEmission(8_000, 1_500),
  },
];
