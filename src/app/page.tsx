import Link from "next/link";
import { Leaf, BarChart3, Upload, Calculator, ArrowRight, Globe, Shield, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* ===== Navbar ===== */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <Leaf className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">Metropolia MRV</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
            >
              Open Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ===== Organic Hero Section ===== */}
      <section className="relative overflow-hidden pt-24 pb-32 md:pt-40 md:pb-48">
        <div className="mx-auto max-w-6xl px-6 relative z-10">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1] mb-8 text-foreground">
              Simplifying <br />
              Transport Emissions <br />
              <span className="text-emerald-600 dark:text-emerald-400">for Metropolia.</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mb-12 font-medium">
              A comprehensive platform to calculate, consolidate, and report carbon footprints across road, rail, sea, and aviation sectors.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <Link
                href="/dashboard"
                className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full bg-foreground px-8 py-4 text-background font-semibold transition-all hover:scale-105 active:scale-95"
              >
                <span className="relative z-10">Enter Dashboard</span>
                <ArrowRight className="h-5 w-5 relative z-10 transition-transform group-hover:translate-x-1" />
                <div className="absolute inset-0 bg-emerald-600 translate-y-[100%] transition-transform duration-300 group-hover:translate-y-0" />
              </Link>

              <Link
                href="/calculator"
                className="inline-flex items-center justify-center gap-3 rounded-full border-2 border-border bg-transparent px-8 py-4 font-semibold text-foreground transition-all hover:bg-muted hover:border-foreground/30 active:scale-95"
              >
                Manual Calculator
              </Link>
            </div>
          </div>
        </div>

        {/* Abstract Background Shapes */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] rounded-full bg-gradient-to-tr from-emerald-500/20 to-sky-500/20 blur-[120px] -z-10" />
        <div className="absolute left-0 bottom-0 -translate-x-1/2 translate-y-1/3 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-emerald-400/10 to-transparent blur-[100px] -z-10" />
      </section>

      {/* ===== Fluid Capabilities Section ===== */}
      <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Built for clarity.</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              We moved away from fragmented spreadsheets. This platform provides a single source of truth for the National Transport Authority, adhering stringently to WRI standards.
            </p>
            <ul className="space-y-6">
              <li className="flex gap-4 items-start">
                <div className="mt-1 bg-emerald-100 dark:bg-emerald-900/50 p-2 rounded-full text-emerald-600 dark:text-emerald-400">
                  <Upload className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-lg">Smart Data Import</h4>
                  <p className="text-muted-foreground mt-1">Easily drop XLSX, XLS, or CSV files. The system auto-maps columns based on sheet names.</p>
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <div className="mt-1 bg-sky-100 dark:bg-sky-900/50 p-2 rounded-full text-sky-600 dark:text-sky-400">
                  <Calculator className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-lg">Automated Calculation</h4>
                  <p className="text-muted-foreground mt-1">Applies official WRI emission factors instantly across all transport modes.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Visual Abstract Representation of Dashboard */}
          <div className="bg-muted/50 rounded-3xl p-8 relative overflow-hidden border border-border/50">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent" />
            <div className="space-y-4 relative z-10">
              <div className="h-32 rounded-2xl bg-background border border-border/50 shadow-sm p-6">
                <div className="h-4 w-1/3 bg-muted rounded-full mb-4" />
                <div className="h-8 w-1/2 bg-foreground/10 rounded-full" />
              </div>
              <div className="flex gap-4">
                <div className="h-40 flex-1 rounded-2xl bg-emerald-600 p-6 flex items-end">
                  <div className="h-2 w-full bg-white/30 rounded-full" />
                </div>
                <div className="h-40 flex-1 rounded-2xl bg-background border border-border/50 p-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Minimal Footer ===== */}
      <footer className="py-12 border-t">
        <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-emerald-600" />
            <span className="font-semibold tracking-tight">MRV Platform</span>
          </div>
          <p className="text-sm text-muted-foreground font-medium">
            Engineered for the Republic of Metropolia.
          </p>
        </div>
      </footer>
    </div>
  );
}
