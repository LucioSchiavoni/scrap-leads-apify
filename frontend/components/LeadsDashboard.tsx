"use client";

import React, { useEffect, useState, useCallback, Fragment, useRef } from "react";
import { Copy, Check, Globe, Phone, Mail, Instagram, MapPin, Star, Search, Filter, ChevronDown, ChevronUp, WifiOff, Wifi, Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Lead {
  _id: string;
  title: string;
  estado?: string;
  phone?: string;
  phoneUnformatted?: string;
  emails?: string[];
  instagrams?: string[];
  website?: string;
  countryCode?: string;
  city?: string;
  state?: string;
  address?: string;
  categoryName?: string;
  categories?: string[];
  totalScore?: number;
  reviewsCount?: number;
  url?: string;
  permanentlyClosed?: boolean;
  temporarilyClosed?: boolean;
}

type LeadStatus = "Nuevo" | "Enviado" | "En Conversacion" | "No interesa";

const STATUS_OPTIONS: LeadStatus[] = ["Nuevo", "Enviado", "En Conversacion", "No interesa"];

const STATUS_STYLES: Record<LeadStatus, string> = {
  Nuevo:             "bg-zinc-100 text-zinc-700 border-zinc-300",
  Enviado:           "bg-sky-100 text-sky-700 border-sky-300",
  "En Conversacion": "bg-orange-100 text-orange-700 border-orange-300",
  "No interesa":     "bg-red-100 text-red-700 border-red-300",
};

// ─── Country name map ─────────────────────────────────────────────────────────

const COUNTRY_NAMES: Record<string, string> = {
  UY: "Uruguay",
  ES: "España",
  US: "Estados Unidos",
  MX: "México",
  AR: "Argentina",
  RO: "Romania",
  VE: "Venezuela",
  CO: "Colombia",
  CL: "Chile",
  PE: "Perú",
  BR: "Brasil",
};

function countryName(code?: string) {
  if (!code) return "—";
  return COUNTRY_NAMES[code] ?? code;
}

// ─── Website preview tooltip ─────────────────────────────────────────────────

function WebPreviewLink({ url }: { url: string }) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState<"above" | "below">("below");
  const [imgState, setImgState] = useState<"loading" | "loaded" | "error">("loading");
  const ref = React.useRef<HTMLAnchorElement>(null);
  const previewSrc = `https://image.thum.io/get/width/640/crop/480/${url}`;

  const handleMouseEnter = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setPos(window.innerHeight - rect.bottom < 380 ? "above" : "below");
    }
    setImgState("loading");
    setShow(true);
  };

  return (
    <div className="relative flex items-center gap-1 min-w-0">
      <a
        ref={ref}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs truncate max-w-[130px]"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setShow(false)}
      >
        <Globe className="h-3.5 w-3.5 flex-shrink-0" />
        <span className="truncate">{url.replace(/^https?:\/\/(www\.)?/, "")}</span>
      </a>

      {show && (
        <div
          className={`absolute left-0 z-50 w-[420px] rounded-xl border border-zinc-200 bg-white shadow-2xl overflow-hidden pointer-events-none ${
            pos === "below" ? "top-full mt-2" : "bottom-full mb-2"
          }`}
        >
          {/* Header */}
          <div className="flex items-center gap-2 px-3 py-2 bg-zinc-50 border-b border-zinc-100">
            <Globe className="h-3.5 w-3.5 text-zinc-400 flex-shrink-0" />
            <span className="truncate text-xs text-zinc-600 font-medium">
              {url.replace(/^https?:\/\/(www\.)?/, "")}
            </span>
            {imgState === "loading" && (
              <span className="ml-auto text-[10px] text-zinc-400 whitespace-nowrap animate-pulse">Cargando…</span>
            )}
            {imgState === "loaded" && (
              <span className="ml-auto text-[10px] text-green-500 whitespace-nowrap">Vista previa</span>
            )}
            {imgState === "error" && (
              <span className="ml-auto text-[10px] text-red-400 whitespace-nowrap">Sin preview</span>
            )}
          </div>

          {/* Image area */}
          <div className="relative w-full h-64 bg-zinc-100">
            {/* Loading skeleton */}
            {imgState === "loading" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <svg className="h-6 w-6 animate-spin text-zinc-400" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                <span className="text-xs text-zinc-400">Generando captura…</span>
              </div>
            )}

            {/* Error state */}
            {imgState === "error" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-zinc-400">
                <Globe className="h-8 w-8 opacity-30" />
                <span className="text-xs">No se pudo cargar la vista previa</span>
              </div>
            )}

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewSrc}
              alt="preview"
              className={`w-full h-full object-cover object-top transition-opacity duration-300 ${imgState === "loaded" ? "opacity-100" : "opacity-0"}`}
              onLoad={() => setImgState("loaded")}
              onError={() => setImgState("error")}
            />
          </div>

          {/* Footer */}
          <div className="px-3 py-1.5 bg-zinc-50 border-t border-zinc-100">
            <span className="text-[10px] text-zinc-400 truncate block">{url}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── WhatsApp icon ────────────────────────────────────────────────────────────

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

// ─── Copy button ──────────────────────────────────────────────────────────────

function CopyBtn({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [value]);
  return (
    <button
      onClick={handleCopy}
      title={label ? `Copiar ${label}` : "Copiar"}
      className="ml-1 p-0.5 rounded text-zinc-400 hover:text-zinc-700 transition-colors flex-shrink-0"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

const LS_KEY = "leads-pipeline-data";

// ─── Main dashboard ───────────────────────────────────────────────────────────

export default function LeadsDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // filters
  const [search, setSearch] = useState("");
  const [filterCountry, setFilterCountry] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterWeb, setFilterWeb] = useState("all");
  const [filterEmail, setFilterEmail] = useState("all");
  const [filterInstagram, setFilterInstagram] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  // ── Load from localStorage on mount, or auto-fetch bundled leads.json ──
  useEffect(() => {
    async function init() {
      try {
        const raw = localStorage.getItem(LS_KEY);
        if (raw) {
          setLeads(JSON.parse(raw));
        } else {
          const res = await fetch("/leads.json");
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
              const normalized = data.map((item: Record<string, unknown>) => ({
                ...item,
                _id: (item._id ?? item.placeId ?? item.cid ?? item.title) as string,
                estado: (item.estado ?? "Nuevo") as LeadStatus,
              })) as Lead[];
              setLeads(normalized);
              localStorage.setItem(LS_KEY, JSON.stringify(normalized));
            }
          }
        }
      } catch {}
      setLoading(false);
    }
    init();
  }, []);

  // ── Persist to localStorage whenever leads change ──
  useEffect(() => {
    if (!loading && leads.length > 0) {
      localStorage.setItem(LS_KEY, JSON.stringify(leads));
    }
  }, [leads, loading]);

  // ── Update a lead's estado ──
  const updateStatus = useCallback((id: string, status: LeadStatus) => {
    setLeads((prev) =>
      prev.map((l) => (l._id === id ? { ...l, estado: status } : l))
    );
  }, []);

  // ── Load JSON file ──
  const handleFileLoad = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (!Array.isArray(data)) throw new Error("El archivo no es un array JSON válido");
        // Preserve existing estados from localStorage
        const existing: Lead[] = (() => {
          try { return JSON.parse(localStorage.getItem(LS_KEY) ?? "[]"); } catch { return []; }
        })();
        const estadoMap: Record<string, LeadStatus> = {};
        for (const l of existing) if (l._id && l.estado) estadoMap[l._id] = l.estado as LeadStatus;

        const normalized = data.map((item: Record<string, unknown>) => ({
          ...item,
          _id: (item._id ?? item.placeId ?? item.cid ?? item.title) as string,
          estado: (estadoMap[(item._id ?? item.placeId ?? item.cid) as string] ?? item.estado ?? "Nuevo") as LeadStatus,
        })) as Lead[];

        setLeads(normalized);
        localStorage.setItem(LS_KEY, JSON.stringify(normalized));
      } catch (err) {
        alert("Error al leer el archivo: " + (err as Error).message);
      }
    };
    reader.readAsText(file);
    // reset so same file can be re-loaded
    e.target.value = "";
  }, []);

  // ── Download progress ──
  const handleDownload = useCallback(() => {
    const blob = new Blob([JSON.stringify(leads, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-progreso-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [leads]);

  // Derived filter options
  const countries = [...new Set(leads.map((l) => l.countryCode).filter(Boolean))] as string[];
  const categories = [
    ...new Set(leads.map((l) => l.categoryName).filter(Boolean)),
  ] as string[];

  // Base filter (without web filter) — used to compute web counts
  const baseFiltered = leads.filter((lead) => {
    const q = search.toLowerCase();
    if (
      q &&
      !lead.title?.toLowerCase().includes(q) &&
      !lead.phone?.toLowerCase().includes(q) &&
      !lead.city?.toLowerCase().includes(q) &&
      !lead.categoryName?.toLowerCase().includes(q) &&
      !lead.address?.toLowerCase().includes(q)
    )
      return false;
    if (filterCountry !== "all" && lead.countryCode !== filterCountry) return false;
    if (filterCategory !== "all" && lead.categoryName !== filterCategory) return false;
    return true;
  });

  // Counts for web filter tabs (respect other filters)
  const countSinWeb = baseFiltered.filter((l) => !l.website).length;
  const countConWeb = baseFiltered.filter((l) => !!l.website).length;
  const countAll = baseFiltered.length;

  const countConEmail = baseFiltered.filter((l) => l.emails && l.emails.length > 0).length;
  const countConInstagram = baseFiltered.filter((l) => l.instagrams && l.instagrams.length > 0).length;

  // Full filtered list (including web + email + instagram filters)
  const filtered = baseFiltered.filter((lead) => {
    if (filterWeb === "con" && !lead.website) return false;
    if (filterWeb === "sin" && lead.website) return false;
    if (filterEmail === "con" && !(lead.emails && lead.emails.length > 0)) return false;
    if (filterInstagram === "con" && !(lead.instagrams && lead.instagrams.length > 0)) return false;
    return true;
  });

  const activeFilters = [filterCountry !== "all", filterCategory !== "all"].filter(Boolean).length;

  // Reset to page 1 when filters/search change
  useEffect(() => { setPage(1); }, [search, filterCountry, filterCategory, filterWeb, filterEmail, filterInstagram]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-zinc-500 text-sm animate-pulse">Cargando…</div>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-5 bg-zinc-50">
        <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleFileLoad} />
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-10 flex flex-col items-center gap-4 max-w-sm text-center">
          <div className="bg-zinc-100 rounded-full p-4">
            <Upload className="h-8 w-8 text-zinc-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">Sin leads cargados</h2>
            <p className="text-sm text-zinc-500 mt-1">
              Cargá el archivo <code className="bg-zinc-100 px-1 rounded text-xs">leads.json</code> para comenzar
            </p>
          </div>
          <Button onClick={() => fileInputRef.current?.click()} className="gap-2 w-full">
            <Upload className="h-4 w-4" />
            Cargar leads.json
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200 px-6 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-screen-2xl mx-auto">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleFileLoad}
          />

          <div className="flex items-center justify-between mb-3 gap-4 flex-wrap">
            <div>
              <h1 className="text-xl font-semibold text-zinc-900">Lead Pipeline</h1>
              <p className="text-xs text-zinc-500 mt-0.5">
                {filtered.length} de {leads.length} leads
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Status counters */}
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <span className="bg-zinc-100 px-2 py-1 rounded font-medium">{leads.filter((l) => !l.estado || l.estado === "Nuevo").length} nuevos</span>
                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded font-medium">{leads.filter((l) => l.estado === "Enviado").length} enviados</span>
                <span className="bg-green-50 text-green-700 px-2 py-1 rounded font-medium">{leads.filter((l) => l.estado === "En Conversacion").length} en conv.</span>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-1.5"
                >
                  <Upload className="h-4 w-4" />
                  Cargar leads
                </Button>
                <Button
                  size="sm"
                  onClick={handleDownload}
                  disabled={leads.length === 0}
                  className="gap-1.5"
                >
                  <Download className="h-4 w-4" />
                  Descargar progreso
                </Button>
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Buscar por nombre, teléfono, ciudad, categoría..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10"
            />
          </div>

          {/* Web filter tabs + advanced filters row */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* ── Con/Sin Web toggle tabs ── */}
            <div className="flex items-center rounded-lg border border-zinc-200 bg-zinc-50 p-1 gap-1">
              <button
                onClick={() => setFilterWeb("all")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  filterWeb === "all"
                    ? "bg-white text-zinc-900 shadow-sm border border-zinc-200"
                    : "text-zinc-500 hover:text-zinc-700"
                }`}
              >
                Todos
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${filterWeb === "all" ? "bg-zinc-900 text-white" : "bg-zinc-200 text-zinc-600"}`}>
                  {countAll}
                </span>
              </button>
              <button
                onClick={() => setFilterWeb("sin")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  filterWeb === "sin"
                    ? "bg-amber-500 text-white shadow-sm"
                    : "text-zinc-500 hover:text-amber-600"
                }`}
              >
                <WifiOff className="h-3.5 w-3.5" />
                Sin Web
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${filterWeb === "sin" ? "bg-amber-600 text-white" : "bg-amber-100 text-amber-700"}`}>
                  {countSinWeb}
                </span>
              </button>
              <button
                onClick={() => setFilterWeb("con")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  filterWeb === "con"
                    ? "bg-blue-500 text-white shadow-sm"
                    : "text-zinc-500 hover:text-blue-600"
                }`}
              >
                <Wifi className="h-3.5 w-3.5" />
                Con Web
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${filterWeb === "con" ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-700"}`}>
                  {countConWeb}
                </span>
              </button>
            </div>

            {/* ── Con Email toggle ── */}
            <button
              onClick={() => setFilterEmail(filterEmail === "con" ? "all" : "con")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                filterEmail === "con"
                  ? "bg-blue-500 text-white border-blue-500 shadow-sm"
                  : "bg-zinc-50 text-zinc-500 border-zinc-200 hover:text-blue-600 hover:border-blue-300"
              }`}
            >
              <Mail className="h-3.5 w-3.5" />
              Con Email
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${filterEmail === "con" ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-700"}`}>
                {countConEmail}
              </span>
            </button>

            {/* ── Con Instagram toggle ── */}
            <button
              onClick={() => setFilterInstagram(filterInstagram === "con" ? "all" : "con")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                filterInstagram === "con"
                  ? "bg-pink-500 text-white border-pink-500 shadow-sm"
                  : "bg-zinc-50 text-zinc-500 border-zinc-200 hover:text-pink-600 hover:border-pink-300"
              }`}
            >
              <Instagram className="h-3.5 w-3.5" />
              Con Instagram
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${filterInstagram === "con" ? "bg-pink-600 text-white" : "bg-pink-100 text-pink-700"}`}>
                {countConInstagram}
              </span>
            </button>

            {/* ── Advanced filters (País + Tipo) ── */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-1.5 h-9"
            >
              <Filter className="h-4 w-4" />
              Filtros avanzados
              {activeFilters > 0 && (
                <span className="bg-zinc-900 text-white rounded-full text-[10px] w-4 h-4 flex items-center justify-center">
                  {activeFilters}
                </span>
              )}
              {showFilters ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </Button>

            {(activeFilters > 0 || search || filterWeb !== "all" || filterEmail !== "all" || filterInstagram !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setFilterCountry("all");
                  setFilterCategory("all");
                  setFilterWeb("all");
                  setFilterEmail("all");
                  setFilterInstagram("all");
                }}
                className="text-zinc-400 hover:text-zinc-700 h-9"
              >
                Limpiar todo
              </Button>
            )}
          </div>

          {/* Advanced filters panel (País + Tipo de negocio) */}
          {showFilters && (
            <div className="flex gap-2 mt-2 flex-wrap items-center p-3 bg-zinc-50 rounded-lg border border-zinc-200">
              <span className="text-xs text-zinc-500 font-medium mr-1">Filtrar por:</span>
              <Select value={filterCountry} onValueChange={setFilterCountry}>
                <SelectTrigger className="w-[160px] h-8 text-xs">
                  <SelectValue placeholder="País" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los países</SelectItem>
                  {countries.map((c) => (
                    <SelectItem key={c} value={c}>
                      {countryName(c)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[220px] h-8 text-xs">
                  <SelectValue placeholder="Tipo de negocio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="max-w-screen-2xl mx-auto px-6 py-4">
        <div className="bg-white rounded-lg border border-zinc-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50">
                  <th className="text-left px-4 py-3 font-medium text-zinc-500 text-xs uppercase tracking-wide w-10">#</th>
                  <th className="text-left px-4 py-3 font-medium text-zinc-500 text-xs uppercase tracking-wide">Negocio</th>
                  <th className="text-left px-4 py-3 font-medium text-zinc-500 text-xs uppercase tracking-wide">Contacto</th>
                  <th className="text-left px-4 py-3 font-medium text-zinc-500 text-xs uppercase tracking-wide">WhatsApp</th>
                  <th className="text-left px-4 py-3 font-medium text-zinc-500 text-xs uppercase tracking-wide">Instagram</th>
                  <th className="text-left px-4 py-3 font-medium text-zinc-500 text-xs uppercase tracking-wide">País</th>
                  <th className="text-left px-4 py-3 font-medium text-zinc-500 text-xs uppercase tracking-wide">Web</th>
                  <th className="text-left px-4 py-3 font-medium text-zinc-500 text-xs uppercase tracking-wide">Categoría</th>
                  <th className="text-left px-4 py-3 font-medium text-zinc-500 text-xs uppercase tracking-wide">Rating</th>
                  <th className="text-left px-4 py-3 font-medium text-zinc-500 text-xs uppercase tracking-wide w-[160px]">Estado</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center py-12 text-zinc-400">
                      No hay resultados para los filtros aplicados
                    </td>
                  </tr>
                ) : (
                  paginated.map((lead, idx) => {
                    const status = (lead.estado as LeadStatus) || "Nuevo";
                    const waNumber = lead.phoneUnformatted?.replace(/[^0-9]/g, "");
                    const waLink = waNumber ? `https://wa.me/${waNumber}` : null;
                    const isExpanded = expandedRow === lead._id;

                    return (
                      <Fragment key={lead._id}>
                        <tr
                          className={`border-b border-zinc-100 hover:bg-zinc-50 transition-colors cursor-pointer ${isExpanded ? "bg-zinc-50" : ""}`}
                          onClick={() => setExpandedRow(isExpanded ? null : lead._id)}
                        >
                          {/* # */}
                          <td className="px-4 py-3 text-center text-xs font-mono text-zinc-400 w-10 select-none">
                            {(page - 1) * PAGE_SIZE + idx + 1}
                          </td>

                          {/* Negocio */}
                          <td className="px-4 py-3 max-w-[220px]">
                            <div className="flex items-start gap-1">
                              <div className="min-w-0">
                                <div className="font-medium text-zinc-900 truncate" title={lead.title}>
                                  {lead.title}
                                </div>
                                {lead.city && (
                                  <div className="text-xs text-zinc-400 flex items-center gap-0.5 mt-0.5">
                                    <MapPin className="h-3 w-3 flex-shrink-0" />
                                    <span className="truncate">{lead.city}</span>
                                  </div>
                                )}
                              </div>
                              <CopyBtn value={lead.title} label="nombre" />
                            </div>
                          </td>

                          {/* Contacto */}
                          <td className="px-4 py-3">
                            {lead.emails && lead.emails.length > 0 ? (
                              <div className="flex items-center gap-1">
                                <Mail className="h-3.5 w-3.5 text-blue-400 flex-shrink-0" />
                                <span className="text-zinc-700 text-xs whitespace-nowrap">{lead.emails[0]}</span>
                                <CopyBtn value={lead.emails[0]} label="email" />
                              </div>
                            ) : lead.phone ? (
                              <div className="flex items-center gap-1">
                                <Phone className="h-3.5 w-3.5 text-zinc-400 flex-shrink-0" />
                                <span className="text-zinc-700 font-mono text-xs whitespace-nowrap">{lead.phone}</span>
                                <CopyBtn value={lead.phone} label="teléfono" />
                              </div>
                            ) : (
                              <span className="text-zinc-300 text-xs">—</span>
                            )}
                          </td>

                          {/* WhatsApp */}
                          <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                            {waLink ? (
                              <div className="flex items-center gap-1">
                                <a
                                  href={waLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center justify-center text-white bg-[#25D366] hover:bg-[#1ebe5d] p-1.5 rounded transition-colors"
                                >
                                  <WhatsAppIcon className="h-4 w-4" />
                                </a>
                                <CopyBtn value={waLink} label="link WA" />
                              </div>
                            ) : (
                              <span className="text-zinc-300 text-xs">—</span>
                            )}
                          </td>

                          {/* Instagram */}
                          <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                            {lead.instagrams && lead.instagrams.length > 0 ? (
                              <div className="flex items-center gap-1">
                                <a
                                  href={lead.instagrams[0].startsWith('http') ? lead.instagrams[0] : `https://${lead.instagrams[0]}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs text-pink-600 hover:text-pink-800 font-medium truncate max-w-[140px]"
                                  title={lead.instagrams[0]}
                                >
                                  <Instagram className="h-3.5 w-3.5 flex-shrink-0" />
                                  <span className="truncate">{lead.instagrams[0].replace(/https?:\/\/(www\.)?instagram\.com\/?/, '@').replace(/\/$/, '')}</span>
                                </a>
                                <CopyBtn value={lead.instagrams[0]} label="instagram" />
                              </div>
                            ) : (
                              <span className="text-zinc-300 text-xs">—</span>
                            )}
                          </td>

                          {/* País */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <span className="text-zinc-700 text-xs">{countryName(lead.countryCode)}</span>
                              {lead.countryCode && <CopyBtn value={lead.countryCode} label="país" />}
                            </div>
                          </td>

                          {/* Web */}
                          <td className="px-4 py-3 max-w-[180px]" onClick={(e) => e.stopPropagation()}>
                            {lead.website ? (
                              <div className="flex items-center gap-1 overflow-visible">
                                <WebPreviewLink url={lead.website} />
                                <CopyBtn value={lead.website} label="web" />
                              </div>
                            ) : (
                              <Badge variant="warning" className="text-[10px] py-0 px-1.5">Sin web</Badge>
                            )}
                          </td>

                          {/* Categoría */}
                          <td className="px-4 py-3 max-w-[160px]">
                            <span className="text-zinc-600 text-xs truncate block" title={lead.categoryName}>
                              {lead.categoryName || "—"}
                            </span>
                          </td>

                          {/* Rating */}
                          <td className="px-4 py-3">
                            {lead.totalScore ? (
                              <div className="flex items-center gap-1">
                                <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                                <span className="text-zinc-700 text-xs font-medium">{lead.totalScore.toFixed(1)}</span>
                                {lead.reviewsCount ? (
                                  <span className="text-zinc-400 text-xs">({lead.reviewsCount})</span>
                                ) : null}
                              </div>
                            ) : (
                              <span className="text-zinc-300 text-xs">—</span>
                            )}
                          </td>

                          {/* Estado */}
                          <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                            <select
                              value={status}
                              onChange={(e) => updateStatus(lead._id, e.target.value as LeadStatus)}
                              className={`h-7 text-xs w-[150px] rounded-md border px-2 font-medium cursor-pointer outline-none focus:ring-2 focus:ring-offset-1 focus:ring-zinc-400 transition-colors ${STATUS_STYLES[status]}`}
                            >
                              {STATUS_OPTIONS.map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </td>
                        </tr>

                        {/* Expanded row: all details */}
                        {isExpanded && (
                          <tr className="bg-zinc-50">
                            <td colSpan={10} className="px-6 py-4 border-b border-zinc-100">
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
                                <Detail label="Nombre" value={lead.title} />
                                <Detail label="Teléfono" value={lead.phone} />
                                <Detail label="Teléfono (sin formato)" value={lead.phoneUnformatted} />
                                <Detail label="Dirección" value={lead.address} />
                                <Detail label="Ciudad" value={lead.city} />
                                <Detail label="Estado/Provincia" value={lead.state} />
                                <Detail label="País" value={countryName(lead.countryCode)} />
                                <Detail label="Sitio web" value={lead.website} isLink />
                                <Detail label="Google Maps" value={lead.url} isLink linkLabel="Ver en Maps" />
                                <Detail label="Categoría principal" value={lead.categoryName} />
                                <Detail label="Otras categorías" value={lead.categories?.join(", ")} />
                                <Detail label="Rating" value={lead.totalScore?.toFixed(1)} />
                                <Detail label="Reseñas" value={lead.reviewsCount?.toString()} />
                                {waLink && <Detail label="Link WhatsApp" value={waLink} isLink linkLabel="Abrir WhatsApp" />}
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 px-1">
            <p className="text-xs text-zinc-500">
              Mostrando {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} de {filtered.length} leads
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(1)}
                disabled={page === 1}
                className="h-8 w-8 flex items-center justify-center rounded border border-zinc-200 text-zinc-500 hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed text-xs"
                title="Primera página"
              >
                «
              </button>
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
                className="h-8 w-8 flex items-center justify-center rounded border border-zinc-200 text-zinc-500 hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed text-xs"
                title="Anterior"
              >
                ‹
              </button>

              {/* Page number buttons */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                  if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("…");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, idx) =>
                  p === "…" ? (
                    <span key={`ellipsis-${idx}`} className="h-8 w-8 flex items-center justify-center text-zinc-400 text-xs">
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p as number)}
                      className={`h-8 w-8 flex items-center justify-center rounded border text-xs font-medium transition-colors ${
                        page === p
                          ? "bg-zinc-900 text-white border-zinc-900"
                          : "border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === totalPages}
                className="h-8 w-8 flex items-center justify-center rounded border border-zinc-200 text-zinc-500 hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed text-xs"
                title="Siguiente"
              >
                ›
              </button>
              <button
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
                className="h-8 w-8 flex items-center justify-center rounded border border-zinc-200 text-zinc-500 hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed text-xs"
                title="Última página"
              >
                »
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
  isLink,
  linkLabel,
}: {
  label: string;
  value?: string;
  isLink?: boolean;
  linkLabel?: string;
}) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-zinc-400 font-medium uppercase tracking-wide text-[10px]">{label}</span>
      <div className="flex items-center gap-1">
        {isLink ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline truncate max-w-[180px]"
            title={value}
          >
            {linkLabel || value.replace(/^https?:\/\/(www\.)?/, "")}
          </a>
        ) : (
          <span className="text-zinc-700 break-words">{value}</span>
        )}
        <CopyBtn value={value} />
      </div>
    </div>
  );
}
