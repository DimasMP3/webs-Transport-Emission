"use client";

import React, { useRef, useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import {
  UploadCloud,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import type { EmissionRecord } from "@/types/emission";
import { parseSheetRows } from "@/utils/parse-workbook";

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

function csvRowToRecord(
  row: Record<string, string>,
  idx: number,
): EmissionRecord {
  return {
    id: `csv-${idx}`,
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
export function DataUploader({
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

  const parseCsv = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const parsed = (results.data as Record<string, string>[]).map(
            csvRowToRecord,
          );
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

  const parseXlsx = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        const allRecords: EmissionRecord[] = [];
        let globalIdx = 0;

        workbook.SheetNames.forEach((sheetName) => {
          const sheet = workbook.Sheets[sheetName];
          const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(
            sheet,
            {
              defval: "",
            },
          );
          const parsed = parseSheetRows(rows, sheetName, globalIdx);
          allRecords.push(...parsed);
          globalIdx += rows.length;
        });

        onDataParsed(allRecords);
        setRecordCount(allRecords.length);
        setStatus(allRecords.length > 0 ? "success" : "error");
      } catch {
        setStatus("error");
      }
    };
    reader.onerror = () => setStatus("error");
    reader.readAsArrayBuffer(file);
  };

  const handleFile = (file: File) => {
    setStatus("idle");
    setFileName(file.name);
    setRecordCount(0);

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext === "csv") parseCsv(file);
    else if (ext === "xlsx" || ext === "xls") parseXlsx(file);
    else setStatus("error");
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-card p-6 sm:p-8 shadow-sm ring-1 ring-border/50 h-full flex flex-col">
      <div className="mb-6">
        <h3 className="text-xl font-bold tracking-tight text-foreground">
          Import Data
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Accepts raw CSV and WRI Excel files
        </p>
      </div>

      <input
        type="file"
        accept=".csv,.xlsx,.xls"
        className="hidden"
        ref={fileInputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
        className={`flex-1 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all ${isDragging
            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10"
            : "border-muted-foreground/25 hover:border-emerald-500/50 hover:bg-muted/50"
          }`}
      >
        <div className="mb-4 rounded-full bg-emerald-100 p-4 dark:bg-emerald-900/30">
          <UploadCloud className="h-8 w-8 text-emerald-600" />
        </div>
        <p className="font-semibold text-foreground text-base">
          Drag & drop a file here
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          or click below to browse your computer
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md active:scale-95"
          >
            Browse Files
          </button>
          {!hasData && (
            <button
              onClick={onLoadMock}
              className="rounded-full bg-muted px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:bg-muted/80 active:scale-95"
            >
              Load Demo Dataset
            </button>
          )}
          {hasData && (
            <button
              onClick={onClear}
              className="rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 px-5 py-2.5 text-sm font-semibold transition-all hover:bg-rose-200 dark:hover:bg-rose-900/50 active:scale-95"
            >
              Clear Data
            </button>
          )}
        </div>
      </div>

      {status !== "idle" && fileName && (
        <div
          className={`mt-4 flex items-start gap-3 rounded-2xl p-4 text-sm ${status === "success"
              ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-400"
              : "bg-rose-50 text-rose-900 dark:bg-rose-500/10 dark:text-rose-400"
            }`}
        >
          {status === "success" ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          ) : (
            <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
          )}
          <div>
            <p className="font-semibold">
              {status === "success" ? "Upload Successful" : "Upload Failed"}
            </p>
            <p className="mt-1 break-all opacity-80">
              {fileName}{" "}
              {status === "success" && `— processed ${recordCount} records`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
