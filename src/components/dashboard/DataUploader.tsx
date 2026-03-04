"use client";

import React, { useRef, useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileSpreadsheet, CheckCircle2, XCircle } from "lucide-react";
import type { EmissionRecord } from "@/types/emission";

// ========================
// Props
// ========================
interface DataUploaderProps {
    onDataParsed: (records: EmissionRecord[]) => void;
    onLoadMock: () => void;
    onClear: () => void;
    hasData: boolean;
}

type UploadStatus = "idle" | "success" | "error";

// ========================
// Helpers — map a raw row object to an EmissionRecord
// ========================
function rowToRecord(row: Record<string, string>, idx: number): EmissionRecord {
    return {
        id: `file-${idx}`,
        sector: (row.Sector as EmissionRecord["sector"]) || "Road",
        category: row.Category || "Unknown",
        energyConsumption: parseFloat(row.EnergyConsumption) || 0,
        unit: row.Unit || "Unknown",
        totalCO2: parseFloat(row.TotalCO2) || 0,
    };
}

// ========================
// Component
// ========================
export default function DataUploader({
    onDataParsed,
    onLoadMock,
    onClear,
    hasData,
}: DataUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [status, setStatus] = useState<UploadStatus>("idle");
    const [fileName, setFileName] = useState<string | null>(null);
    const [recordCount, setRecordCount] = useState(0);

    // ---- CSV parsing (via PapaParse) ----
    const parseCsv = (file: File) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                try {
                    const parsed = (results.data as Record<string, string>[]).map(rowToRecord);
                    onDataParsed(parsed);
                    setRecordCount(parsed.length);
                    setStatus("success");
                } catch {
                    setStatus("error");
                }
            },
            error: () => setStatus("error"),
        });
    };

    // ---- XLSX parsing (via SheetJS) ----
    const parseXlsx = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: "array" });

                // Combine all sheets into one consolidated array
                const allRecords: EmissionRecord[] = [];
                let globalIdx = 0;

                workbook.SheetNames.forEach((sheetName) => {
                    const sheet = workbook.Sheets[sheetName];
                    const rows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, {
                        defval: "",
                    });
                    rows.forEach((row) => {
                        allRecords.push(rowToRecord(row, globalIdx++));
                    });
                });

                onDataParsed(allRecords);
                setRecordCount(allRecords.length);
                setStatus("success");
            } catch {
                setStatus("error");
            }
        };
        reader.onerror = () => setStatus("error");
        reader.readAsArrayBuffer(file);
    };

    // ---- Unified handler ----
    const handleFile = (file: File) => {
        setFileName(file.name);
        setStatus("idle");

        const ext = file.name.split(".").pop()?.toLowerCase();
        if (ext === "csv") {
            parseCsv(file);
        } else if (ext === "xlsx" || ext === "xls") {
            parseXlsx(file);
        } else {
            setStatus("error");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    };

    return (
        <Card
            className={`shadow-sm transition-colors ${isDragging ? "border-emerald-500 bg-emerald-500/5" : ""
                }`}
            onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
        >
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Data Import</CardTitle>
                <p className="text-xs text-muted-foreground">
                    Supports <strong>.csv</strong>, <strong>.xlsx</strong>, and <strong>.xls</strong> files
                </p>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center text-center py-6 border-2 border-dashed rounded-lg border-border bg-muted/30">
                    <UploadCloud
                        className={`h-10 w-10 mb-3 transition-colors ${isDragging ? "text-emerald-500" : "text-muted-foreground/40"
                            }`}
                    />
                    <p className="text-sm font-medium text-foreground mb-1">
                        {isDragging ? "Drop your file here" : "Drag & drop a file"}
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                        CSV or Excel — or click below to browse
                    </p>

                    <div className="flex gap-3 flex-wrap justify-center">
                        <div className="relative">
                            <Button variant="outline" size="sm">
                                <FileSpreadsheet className="h-3.5 w-3.5 mr-1.5" />
                                Browse Files
                            </Button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".csv,.xlsx,.xls"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleFileChange}
                            />
                        </div>
                        <Button size="sm" onClick={onLoadMock}>
                            Load Mock Data
                        </Button>
                        {hasData && (
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                    onClear();
                                    setStatus("idle");
                                    setFileName(null);
                                    setRecordCount(0);
                                }}
                            >
                                Clear
                            </Button>
                        )}
                    </div>
                </div>

                {/* Status feedback */}
                {status === "success" && fileName && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-emerald-600">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>
                            Loaded <strong>{fileName}</strong> — {recordCount} record(s)
                        </span>
                    </div>
                )}
                {status === "error" && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-destructive">
                        <XCircle className="h-4 w-4" />
                        <span>Failed to parse file. Supported: .csv, .xlsx, .xls</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
