import type { RoadFuelCode, RailFuelCode, RailTraction, SeaFuelCode } from "@/types/emission";
import { EMISSION_FACTORS, AVIATION_FUEL_DENSITY } from "@/constants/emission-factors";

// ========================
// Pure calculation functions — one per transport sector.
// Each function returns CO2 in metric tons (t).
// Formulas match the WRI Reference Workbook exactly.
// ========================

/**
 * ROAD — CO2 from fuel combustion.
 * Fuel_L = vehicles × avgKmPerYear × fuelEconomy(L/100km) / 100
 * CO2_t  = Fuel_L × EF(kgCO2/L) / 1000
 */
export function calculateRoadEmission(
    vehicles: number,
    avgKmPerYear: number,
    fuelEconomy: number, // L/100km
    fuelCode: RoadFuelCode,
): number {
    const fuelLiters = (vehicles * avgKmPerYear * fuelEconomy) / 100;
    return (fuelLiters * EMISSION_FACTORS[fuelCode]) / 1000;
}

/**
 * RAIL — CO2 from electricity (kWh) or diesel (liter).
 * CO2_t = energyValue × EF / 1000
 */
export function calculateRailEmission(
    energyValue: number,
    _traction: RailTraction,
    fuelCode: RailFuelCode,
): number {
    return (energyValue * EMISSION_FACTORS[fuelCode]) / 1000;
}

/**
 * SEA — CO2 from marine fuel consumption.
 * Fuel_ton = totalDistanceNM × fuelIntensity(t/NM)
 * CO2_t   = Fuel_ton × EF(tCO2/ton_fuel)
 */
export function calculateSeaEmission(
    totalDistanceNM: number,
    fuelIntensity: number, // t/NM
    fuelCode: SeaFuelCode,
): number {
    const fuelTon = totalDistanceNM * fuelIntensity;
    return fuelTon * EMISSION_FACTORS[fuelCode];
}

/**
 * AVIATION — CO2 from jet fuel combustion.
 * Fuel_kg = totalFlights × avgFuelPerFlightL × density(kg/L)
 * CO2_t   = Fuel_kg × EF(kgCO2/kg) / 1000
 */
export function calculateAviationEmission(
    totalFlights: number,
    avgFuelPerFlightL: number,
): number {
    const fuelKg = totalFlights * avgFuelPerFlightL * AVIATION_FUEL_DENSITY;
    return (fuelKg * EMISSION_FACTORS.JET_FUEL) / 1000;
}
