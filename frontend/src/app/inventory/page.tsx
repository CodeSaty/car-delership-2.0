"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { api, Vehicle } from "@/lib/api";
import { CarBrandIcon } from "@/components/CarBrandIcon";
import { getKnownMakesAndModels } from "@/lib/carSpecs";

type VehicleStatus = "Available" | "Sold" | "In-Transit" | "Booked";

function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
    }).format(value);
}

/* ── Status Config ─────────────────────────────────── */
const STATUS_CONFIG: Record<VehicleStatus, { color: string; bg: string; border: string; icon: string; label: string }> = {
    Available: { color: "#22C55E", bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.2)", icon: "●", label: "Available" },
    "In-Transit": { color: "#EAB308", bg: "rgba(234,179,8,0.08)", border: "rgba(234,179,8,0.2)", icon: "◆", label: "In-Transit" },
    Booked: { color: "#3B82F6", bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.2)", icon: "■", label: "Booked" },
    Sold: { color: "#EF4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)", icon: "✓", label: "Sold" },
};

/* Valid status transitions */
const STATUS_TRANSITIONS: Record<VehicleStatus, VehicleStatus[]> = {
    Available: ["Booked", "Sold"],
    "In-Transit": ["Available", "Booked", "Sold"],
    Booked: ["Available", "Sold"],
    Sold: [],
};

/* Section display order */
const SECTION_ORDER: VehicleStatus[] = ["Available", "In-Transit", "Booked", "Sold"];

function StatusBadge({ status }: { status: VehicleStatus }) {
    const cfg = STATUS_CONFIG[status];
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px",
            borderRadius: 16, fontSize: 12, fontWeight: 600,
            background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
        }}>
            <span style={{ fontSize: 8 }}>{cfg.icon}</span>
            {cfg.label}
        </span>
    );
}

/* ── Status Change Dropdown ────────────────────────── */
function StatusChanger({
    vehicle, onStatusChange,
}: {
    vehicle: Vehicle;
    onStatusChange: (id: number, newStatus: VehicleStatus) => void;
}) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const transitions = STATUS_TRANSITIONS[vehicle.status as VehicleStatus];

    if (transitions.length === 0) return null;

    return (
        <div style={{ position: "relative" }}>
            <button
                onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
                style={{
                    display: "flex", alignItems: "center", gap: 4, padding: "6px 12px",
                    borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.03)", color: "var(--text-secondary)",
                    cursor: "pointer", fontSize: 11, fontWeight: 500, transition: "all 0.2s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.borderColor = "rgba(201,169,98,0.4)")}
                onMouseOut={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
            >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14" />
                </svg>
                Change Status
            </button>

            {open && (
                <>
                    <div style={{ position: "fixed", inset: 0, zIndex: 40 }} onClick={(e) => { e.stopPropagation(); setOpen(false); }} />
                    <div style={{
                        position: "absolute", top: "100%", right: 0, marginTop: 4, zIndex: 50,
                        background: "rgba(20,20,28,0.98)", backdropFilter: "blur(16px)",
                        border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12,
                        padding: 6, minWidth: 160, boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
                    }}>
                        <p style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", padding: "6px 10px", margin: 0 }}>
                            Move to:
                        </p>
                        {transitions.map((target) => {
                            const cfg = STATUS_CONFIG[target];
                            return (
                                <button
                                    key={target}
                                    disabled={loading}
                                    onClick={async (e) => {
                                        e.stopPropagation();
                                        setLoading(true);
                                        await onStatusChange(vehicle.id, target);
                                        setLoading(false);
                                        setOpen(false);
                                    }}
                                    style={{
                                        display: "flex", alignItems: "center", gap: 8, width: "100%",
                                        padding: "8px 10px", borderRadius: 8, border: "none",
                                        background: "transparent", color: cfg.color, cursor: "pointer",
                                        fontSize: 13, fontWeight: 500, transition: "all 0.15s",
                                        opacity: loading ? 0.5 : 1,
                                    }}
                                    onMouseOver={(e) => (e.currentTarget.style.background = cfg.bg)}
                                    onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
                                >
                                    <span style={{
                                        width: 8, height: 8, borderRadius: "50%",
                                        background: cfg.color, flexShrink: 0,
                                    }} />
                                    {target}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}

/* ── Vehicle Section ───────────────────────────────── */
function VehicleSection({
    status, vehicles, search, onStatusChange, onRowClick,
}: {
    status: VehicleStatus;
    vehicles: Vehicle[];
    search: string;
    onStatusChange: (id: number, newStatus: VehicleStatus) => void;
    onRowClick: (id: number) => void;
}) {
    const filtered = search
        ? vehicles.filter((v) =>
            v.vin.toLowerCase().includes(search.toLowerCase()) ||
            v.make.toLowerCase().includes(search.toLowerCase()) ||
            v.model.toLowerCase().includes(search.toLowerCase())
        )
        : vehicles;

    if (filtered.length === 0 && !search) return null;

    const cfg = STATUS_CONFIG[status];

    return (
        <div style={{ marginBottom: 28 }}>
            {/* Section Header */}
            <div style={{
                display: "flex", alignItems: "center", gap: 12, marginBottom: 12,
                padding: "0 4px",
            }}>
                <div style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "6px 14px", borderRadius: 10,
                    background: cfg.bg, border: `1px solid ${cfg.border}`,
                }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: cfg.color }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: cfg.color, fontFamily: "'Outfit', sans-serif" }}>
                        {cfg.label}
                    </span>
                </div>
                <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>
                    {filtered.length} vehicle{filtered.length !== 1 ? "s" : ""}
                </span>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.04)" }} />
            </div>

            {/* Table */}
            <div className="glass-card" style={{ overflow: "hidden", borderLeft: `3px solid ${cfg.color}` }}>
                {filtered.length === 0 ? (
                    <div style={{ padding: 24, textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
                        No vehicles match your search
                    </div>
                ) : (
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th style={{ width: 50 }}></th>
                                <th>Make</th>
                                <th>Model</th>
                                <th>Year</th>
                                <th>VIN</th>
                                <th>Price</th>
                                <th>Status</th>
                                {STATUS_TRANSITIONS[status].length > 0 && <th style={{ width: 140 }}>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((v) => (
                                <tr key={v.id}
                                    onClick={() => onRowClick(v.id)}
                                    style={{ cursor: "pointer", transition: "all 0.2s ease" }}
                                    onMouseOver={(e) => { e.currentTarget.style.background = "rgba(201,169,98,0.06)"; }}
                                    onMouseOut={(e) => { e.currentTarget.style.background = ""; }}
                                    title={`View ${v.make} ${v.model} details`}
                                >
                                    <td style={{ padding: "10px 14px" }}>
                                        <CarBrandIcon make={v.make} size={34} />
                                    </td>
                                    <td style={{ fontWeight: 600 }}>{v.make}</td>
                                    <td>{v.model}</td>
                                    <td>{v.year}</td>
                                    <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "var(--text-secondary)" }}>{v.vin}</td>
                                    <td className="gold-text" style={{ fontWeight: 600 }}>{formatCurrency(v.purchase_price)}</td>
                                    <td>
                                        <StatusBadge status={v.status as VehicleStatus} />
                                    </td>
                                    {STATUS_TRANSITIONS[status].length > 0 && (
                                        <td onClick={(e) => e.stopPropagation()}>
                                            <StatusChanger vehicle={v} onStatusChange={onStatusChange} />
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

/* ── Empty Form ────────────────────────────────────── */
const emptyForm = {
    vin: "",
    make: "",
    model: "",
    year: new Date().getFullYear(),
    purchase_price: 0,
    status: "Available" as VehicleStatus,
};

/* ═══════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════ */
export default function InventoryPage() {
    const router = useRouter();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ ...emptyForm });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Build Make → Model[] map from the specs database
    const makesAndModels = useMemo(() => getKnownMakesAndModels(), []);
    const sortedMakes = useMemo(() => Object.keys(makesAndModels).sort(), [makesAndModels]);
    const availableModels = form.make ? (makesAndModels[form.make] || []).sort() : [];

    useEffect(() => { loadVehicles(); }, []);

    async function loadVehicles() {
        setLoading(true);
        try {
            const data = await api.getVehicles();
            setVehicles(data);
        } catch (e) { console.error("Failed to load vehicles", e); }
        finally { setLoading(false); }
    }

    async function handleAddVehicle(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            await api.createVehicle({
                vin: form.vin.trim(), make: form.make.trim(), model: form.model.trim(),
                year: Number(form.year), purchase_price: Number(form.purchase_price), status: form.status,
            });
            setShowModal(false);
            setForm({ ...emptyForm });
            await loadVehicles();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to add vehicle");
        } finally { setSubmitting(false); }
    }

    async function handleStatusChange(vehicleId: number, newStatus: VehicleStatus) {
        try {
            await api.updateVehicle(vehicleId, { status: newStatus });
            await loadVehicles();
        } catch (err) {
            console.error("Failed to update status", err);
        }
    }

    // Group vehicles by status
    const grouped = useMemo(() => {
        const map: Record<VehicleStatus, Vehicle[]> = { Available: [], "In-Transit": [], Booked: [], Sold: [] };
        vehicles.forEach((v) => {
            const s = v.status as VehicleStatus;
            if (map[s]) map[s].push(v);
            else map.Available.push(v);
        });
        return map;
    }, [vehicles]);

    // Summary stats
    const totalValue = vehicles.reduce((s, v) => s + v.purchase_price, 0);
    const avgValue = vehicles.length > 0 ? totalValue / vehicles.length : 0;

    return (
        <div>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>Vehicle Inventory</h1>
                    <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4 }}>
                        {vehicles.length} vehicles in your collection
                    </p>
                </div>
                <button className="btn-gold" onClick={() => { setShowModal(true); setError(""); }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add Vehicle
                </button>
            </div>

            {/* Quick Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: 20 }}>
                {[
                    { label: "Total Vehicles", value: vehicles.length, color: "var(--gold)" },
                    { label: "Available", value: grouped.Available.length, color: STATUS_CONFIG.Available.color },
                    { label: "In-Transit", value: grouped["In-Transit"].length, color: STATUS_CONFIG["In-Transit"].color },
                    { label: "Booked", value: grouped.Booked.length, color: STATUS_CONFIG.Booked.color },
                    { label: "Sold", value: grouped.Sold.length, color: STATUS_CONFIG.Sold.color },
                ].map((s) => (
                    <div key={s.label} className="glass-card" style={{ padding: "16px 20px" }}>
                        <p style={{ fontSize: 11, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{s.label}</p>
                        <p style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Outfit', sans-serif", color: s.color }}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Search */}
            <div className="glass-card" style={{ display: "flex", gap: 14, padding: "16px 20px", marginBottom: 24, alignItems: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input className="input-dark" type="text" placeholder="Search by VIN, make, or model across all sections..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: 1 }} />
                {search && (
                    <button onClick={() => setSearch("")} style={{
                        background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 8, padding: "6px 12px", color: "var(--text-secondary)",
                        cursor: "pointer", fontSize: 12,
                    }}>Clear</button>
                )}
            </div>

            {/* Status Sections */}
            {loading ? (
                <div style={{ padding: 60, textAlign: "center", color: "var(--text-secondary)" }}>Loading inventory...</div>
            ) : (
                SECTION_ORDER.map((status) => (
                    <VehicleSection
                        key={status}
                        status={status}
                        vehicles={grouped[status]}
                        search={search}
                        onStatusChange={handleStatusChange}
                        onRowClick={(id) => router.push(`/inventory/${id}`)}
                    />
                ))
            )}

            {/* ── Add Vehicle Modal ── */}
            {showModal && (
                <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }}
                    onClick={() => setShowModal(false)}>
                    <div className="glass-card" style={{ width: 520, padding: 32, border: "1px solid var(--border-accent)", animation: "fadeInUp 0.3s ease-out" }}
                        onClick={(e) => e.stopPropagation()}>
                        <h2 style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Outfit', sans-serif", marginBottom: 24 }}>Add New Vehicle</h2>
                        {error && (
                            <div style={{ padding: "10px 16px", marginBottom: 16, borderRadius: 10, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#EF4444", fontSize: 13 }}>{error}</div>
                        )}
                        <form onSubmit={handleAddVehicle}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                <div>
                                    <label style={{ fontSize: 12, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>
                                        VIN <span style={{ color: "var(--danger)" }}>*</span>
                                    </label>
                                    <input className="input-dark" type="text" required maxLength={17} placeholder="e.g., WP0AB2A71KS999001" value={form.vin}
                                        onChange={(e) => setForm({ ...form, vin: e.target.value })} style={{ width: "100%" }} />
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                                    <div>
                                        <label style={{ fontSize: 12, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Make *</label>
                                        <select className="input-dark" required value={form.make}
                                            onChange={(e) => setForm({ ...form, make: e.target.value, model: "" })} style={{ width: "100%" }}>
                                            <option value="">Select Make</option>
                                            {sortedMakes.map((m) => <option key={m} value={m}>{m}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: 12, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Model *</label>
                                        <select className="input-dark" required value={form.model}
                                            onChange={(e) => setForm({ ...form, model: e.target.value })} style={{ width: "100%" }}
                                            disabled={!form.make}>
                                            <option value="">{form.make ? "Select Model" : "Select a make first"}</option>
                                            {availableModels.map((m) => <option key={m} value={m}>{m}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                                    <div>
                                        <label style={{ fontSize: 12, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Year *</label>
                                        <input className="input-dark" type="number" required min={1900} max={2030} value={form.year}
                                            onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) || 0 })} style={{ width: "100%" }} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: 12, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Purchase Price ($) *</label>
                                        <input className="input-dark" type="number" required min={1} step="0.01" placeholder="e.g., 250000" value={form.purchase_price || ""}
                                            onChange={(e) => setForm({ ...form, purchase_price: parseFloat(e.target.value) || 0 })} style={{ width: "100%" }} />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ fontSize: 12, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Status</label>
                                    <select className="input-dark" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as VehicleStatus })} style={{ width: "100%" }}>
                                        <option value="Available">Available</option>
                                        <option value="In-Transit">In-Transit</option>
                                        <option value="Booked">Booked</option>
                                        <option value="Sold">Sold</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 28 }}>
                                <button type="button" className="btn-outline" onClick={() => setShowModal(false)} disabled={submitting}>Cancel</button>
                                <button type="submit" className="btn-gold" disabled={submitting} style={{ opacity: submitting ? 0.6 : 1 }}>
                                    {submitting ? "Adding..." : "Add Vehicle"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
