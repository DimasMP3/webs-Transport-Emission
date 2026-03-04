import type { EmissionRecord, Sector } from "@/types/emission";

// ========================
// Detect sector from Excel sheet name
// ========================
function detectSector(sheetName: string): Sector | null {
    const lower = sheetName.toLowerCase();
    if (lower.includes("road")) return "Road";
    if (lower.includes("rail")) return "Rail";
    if (lower.includes("sea")) return "Sea";
    if (lower.includes("aviation") || lower.includes("air")) return "Aviation";
    return null;
}

// ========================
// Normalise a header name for flexible matching
// ========================
function norm(s: string): string {
    return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/** Try to read a numeric value from a row, checking multiple possible column names */
function readNum(row: Record<string, unknown>, ...candidates: string[]): number {
    for (const key of Object.keys(row)) {
        const nk = norm(key);
        for (const c of candidates) {
            if (nk === norm(c) || nk.includes(norm(c))) {
                const v = Number(row[key]);
                if (!isNaN(v)) return v;
            }
        }
    }
    return 0;
}

/** Try to read a string value from a row */
function readStr(row: Record<string, unknown>, ...candidates: string[]): string {
    for (const key of Object.keys(row)) {
        const nk = norm(key);
        for (const c of candidates) {
            if (nk === norm(c) || nk.includes(norm(c))) {
                const v = row[key];
                if (v !== undefined && v !== null && String(v).trim() !== "") return String(v).trim();
            }
        }
    }
    return "";
}

// ========================
// Parse a single row from a WRI-format sheet into an EmissionRecord
// ========================
function parseRoadRow(row: Record<string, unknown>, idx: number): EmissionRecord | null {
    const category = readStr(row, "Vehicle_Type", "VehicleType", "vehicle type", "type");
    if (!category) return null; // skip empty/header rows

    const co2 = readNum(row, "CO2 (t)", "CO2(t)", "CO2_t", "co2t", "co2");
    const fuelUse = readNum(row, "Fuel Use (L)", "FuelUse", "fuel use", "fuelL");
    const unit = "Liter";

    return {
        id: `road-${idx}`,
        sector: "Road",
        category,
        energyConsumption: fuelUse,
        unit,
        totalCO2: co2,
    };
}

function parseRailRow(row: Record<string, unknown>, idx: number): EmissionRecord | null {
    const category = readStr(row, "Service/Network", "ServiceNetwork", "service", "network");
    if (!category) return null;

    const co2 = readNum(row, "CO2 (t)", "CO2(t)", "CO2_t", "co2");
    const traction = readStr(row, "Traction", "traction");
    const intensityUnit = readStr(row, "Intensity unit", "IntensityUnit");

    // Determine energy consumption from total distance × intensity or direct value
    const totalDist = readNum(row, "Total distance/yr", "TotalDistance", "total distance");
    const intensity = readNum(row, "Energy intensity", "EnergyIntensity", "intensity");
    const energyConsumption = totalDist * intensity || 0;

    const unit = intensityUnit.includes("kWh") ? "kWh" : "Liter";

    return {
        id: `rail-${idx}`,
        sector: "Rail",
        category: `${category}${traction ? ` (${traction})` : ""}`,
        energyConsumption,
        unit,
        totalCO2: co2,
    };
}

function parseSeaRow(row: Record<string, unknown>, idx: number): EmissionRecord | null {
    const category = readStr(row, "Ship Type", "ShipType", "ship");
    if (!category) return null;

    const co2 = readNum(row, "CO2 (t)", "CO2(t)", "CO2_t", "co2");
    const fuelTon = readNum(row, "Fuel (ton)", "Fuel(ton)", "FuelTon", "fuel ton");
    const scope = readStr(row, "Route Scope", "RouteScope", "scope");

    return {
        id: `sea-${idx}`,
        sector: "Sea",
        category: scope ? `${category} (${scope})` : category,
        energyConsumption: fuelTon,
        unit: "Ton fuel",
        totalCO2: co2,
    };
}

function parseAviationRow(row: Record<string, unknown>, idx: number): EmissionRecord | null {
    // Aviation sheets vary — try common column names
    const category = readStr(row, "Route", "route", "Flight Type", "FlightType", "airline", "type", "Category");
    if (!category) return null;

    const co2 = readNum(row, "CO2 (t)", "CO2(t)", "CO2_t", "co2");
    const fuelL = readNum(row, "Fuel (L)", "FuelL", "fuel", "Fuel Use");
    const fuelKg = readNum(row, "Fuel_kg", "FuelKg", "fuel kg");

    return {
        id: `avi-${idx}`,
        sector: "Aviation",
        category,
        energyConsumption: fuelL || fuelKg,
        unit: fuelL > 0 ? "Liter" : "kg",
        totalCO2: co2,
    };
}

// ========================
// Fallback: generic row (CSV or unknown sheet)
// ========================
function parseGenericRow(row: Record<string, unknown>, idx: number, sector: Sector): EmissionRecord | null {
    // Try to find any "name" / "type" / "category" column
    const category = readStr(row, "Category", "Type", "Name", "name", "Vehicle_Type", "Ship Type", "Service");
    const co2 = readNum(row, "CO2 (t)", "CO2(t)", "CO2_t", "TotalCO2", "co2", "emission");

    // If we can't find a category or CO2 value, skip this row
    if (!category && co2 === 0) return null;

    const energy = readNum(row, "EnergyConsumption", "Fuel Use", "Fuel", "Energy", "consumption");
    const unit = readStr(row, "Unit", "unit", "EF unit", "Intensity unit") || "Unknown";

    return {
        id: `gen-${idx}`,
        sector,
        category: category || "Unknown",
        energyConsumption: energy,
        unit,
        totalCO2: co2,
    };
}

// ========================
// Main: parse an entire sheet's rows given the detected sector
// ========================
export function parseSheetRows(
    rows: Record<string, unknown>[],
    sheetName: string,
    startIdx: number,
): EmissionRecord[] {
    const sector = detectSector(sheetName);
    if (!sector) return []; // Skip non-data sheets like "01_Intro_Glossary"

    const results: EmissionRecord[] = [];

    rows.forEach((row, i) => {
        const idx = startIdx + i;
        let record: EmissionRecord | null = null;

        switch (sector) {
            case "Road":
                record = parseRoadRow(row, idx);
                break;
            case "Rail":
                record = parseRailRow(row, idx);
                break;
            case "Sea":
                record = parseSeaRow(row, idx);
                break;
            case "Aviation":
                record = parseAviationRow(row, idx);
                break;
            default:
                record = parseGenericRow(row, idx, sector);
        }

        // Only include rows that have a non-zero CO2 value or a valid category
        if (record && (record.totalCO2 > 0 || record.category !== "Unknown")) {
            results.push(record);
        }
    });

    return results;
}
