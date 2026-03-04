// ========================
// Core domain types for the Transport Emission MRV system.
// All types are centralized here; import from "@/types/emission".
// ========================

/** Supported transport sectors */
export type Sector = "Road" | "Rail" | "Sea" | "Aviation";

/** Fuel codes matching the WRI reference workbook */
export type FuelCode =
    | "GASOLINE"
    | "DIESEL"
    | "B35"
    | "GRID_ELECTRICITY"
    | "MARINE_DIESEL"
    | "HFO_LFO"
    | "LNG_LPG"
    | "JET_FUEL";

/** Road-specific fuel types */
export type RoadFuelCode = Extract<FuelCode, "GASOLINE" | "DIESEL" | "B35">;

/** Rail traction type */
export type RailTraction = "Electric" | "Diesel";

/** Rail-specific fuel types */
export type RailFuelCode = Extract<FuelCode, "GRID_ELECTRICITY" | "DIESEL">;

/** Sea-specific fuel types */
export type SeaFuelCode = Extract<FuelCode, "MARINE_DIESEL" | "HFO_LFO" | "LNG_LPG">;

/** A single consolidated emission record (used for table & chart) */
export interface EmissionRecord {
    id: string;
    sector: Sector;
    category: string;
    energyConsumption: number;
    unit: string;
    totalCO2: number; // in metric tons (t)
}

/** Aggregated emission per sector (used for chart) */
export interface SectorEmission {
    name: Sector;
    co2: number;
}

/** Mapping warna untuk setiap sektor (digunakan oleh Recharts) */
export const SECTOR_COLORS: Record<Sector, string> = {
    Road: "#3b82f6",      // Biru
    Rail: "#10b981",      // Hijau Emerald
    Sea: "#f59e0b",       // Oranye/Amber
    Aviation: "#8b5cf6",  // Ungu
};