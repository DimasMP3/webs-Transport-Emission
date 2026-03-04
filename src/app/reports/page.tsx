"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  EMISSION_FACTORS,
  AVIATION_FUEL_DENSITY,
} from "@/constants/emission-factors";
import { FileBarChart, Info } from "lucide-react";

const FORMULA_REFERENCE = [
  {
    sector: "Road",
    formula:
      "Fuel_L = Vehicles × Avg_km/yr × FuelEconomy(L/100km) / 100\nCO₂(t) = Fuel_L × EF(kgCO₂/L) / 1000",
    color: "bg-sky-500/10 text-sky-600",
  },
  {
    sector: "Rail (Electric)",
    formula: "CO₂(t) = Electricity_kWh × EF(kgCO₂/kWh) / 1000",
    color: "bg-violet-500/10 text-violet-600",
  },
  {
    sector: "Rail (Diesel)",
    formula: "CO₂(t) = Diesel_L × EF(kgCO₂/L) / 1000",
    color: "bg-violet-500/10 text-violet-600",
  },
  {
    sector: "Sea",
    formula:
      "Fuel_ton = Distance_NM × FuelIntensity(t/NM)\nCO₂(t) = Fuel_ton × EF(tCO₂/ton_fuel)",
    color: "bg-cyan-500/10 text-cyan-600",
  },
  {
    sector: "Aviation",
    formula: `Fuel_kg = Fuel_L × Density(${AVIATION_FUEL_DENSITY} kg/L)\nCO₂(t) = Fuel_kg × EF(kgCO₂/kg) / 1000`,
    color: "bg-amber-500/10 text-amber-600",
  },
];

const EF_TABLE = [
  {
    code: "GASOLINE",
    name: "Gasoline (road)",
    unit: "kgCO₂/liter",
    value: EMISSION_FACTORS.GASOLINE,
  },
  {
    code: "DIESEL",
    name: "Diesel (road/rail)",
    unit: "kgCO₂/liter",
    value: EMISSION_FACTORS.DIESEL,
  },
  {
    code: "B35",
    name: "Biodiesel blend (B35)",
    unit: "kgCO₂/liter",
    value: EMISSION_FACTORS.B35,
  },
  {
    code: "GRID_ELECTRICITY",
    name: "Grid electricity",
    unit: "kgCO₂/kWh",
    value: EMISSION_FACTORS.GRID_ELECTRICITY,
  },
  {
    code: "MARINE_DIESEL",
    name: "Marine diesel",
    unit: "tCO₂/ton_fuel",
    value: EMISSION_FACTORS.MARINE_DIESEL,
  },
  {
    code: "HFO_LFO",
    name: "HFO/LFO",
    unit: "tCO₂/ton_fuel",
    value: EMISSION_FACTORS.HFO_LFO,
  },
  {
    code: "LNG_LPG",
    name: "LNG/LPG",
    unit: "tCO₂/ton_fuel",
    value: EMISSION_FACTORS.LNG_LPG,
  },
  {
    code: "JET_FUEL",
    name: "Jet fuel",
    unit: "kgCO₂/kg_fuel",
    value: EMISSION_FACTORS.JET_FUEL,
  },
];

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          Reports & Reference
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Emission calculation formulas and emission factor reference table
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 max-w-5xl">
        {/* Formulas */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <FileBarChart className="h-4 w-4" />
              Core CO₂ Calculation Formulas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {FORMULA_REFERENCE.map((item) => (
              <div key={item.sector} className="rounded-lg border p-3">
                <Badge
                  variant="secondary"
                  className={`${item.color} border-0 mb-2`}
                >
                  {item.sector}
                </Badge>
                <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">
                  {item.formula}
                </pre>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* EF Table */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Info className="h-4 w-4" />
              Emission Factor Reference
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Placeholder values from WRI dummy dataset
            </p>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-2 font-medium">Fuel Code</th>
                    <th className="text-left p-2 font-medium">Name</th>
                    <th className="text-right p-2 font-medium">EF Value</th>
                    <th className="text-left p-2 font-medium">Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {EF_TABLE.map((ef) => (
                    <tr key={ef.code} className="border-b last:border-0">
                      <td className="p-2 font-mono text-xs">{ef.code}</td>
                      <td className="p-2">{ef.name}</td>
                      <td className="p-2 text-right font-semibold tabular-nums">
                        {ef.value}
                      </td>
                      <td className="p-2 text-muted-foreground text-xs">
                        {ef.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
