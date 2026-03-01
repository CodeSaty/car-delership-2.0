"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { api, Vehicle } from "@/lib/api";
import { CarBrandIcon } from "@/components/CarBrandIcon";
import { getKnownMakesAndModels } from "@/lib/carSpecs";

type VehicleStatus = "Available" | "Sold" | "In-Transit" | "Booked";

function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(value);
}

/* ═══════════════════════════════════════════════════
   STATUS CONFIGURATION
   ═══════════════════════════════════════════════════ */
const STATUS_CONFIG: Record<VehicleStatus, {
    color: string; bg: string; border: string; gradient: string;
    label: string; description: string; emptyMsg: string; icon: React.ReactNode;
}> = {
    Available: {
        color: "#22C55E", bg: "rgba(34,197,94,0.06)", border: "rgba(34,197,94,0.2)",
        gradient: "linear-gradient(135deg, rgba(34,197,94,0.12) 0%, rgba(34,197,94,0.02) 100%)",
        label: "Available", description: "Ready for sale",
        emptyMsg: "No vehicles currently available for sale",
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M8 12l3 3 5-5" /></svg>,
    },
    "In-Transit": {
        color: "#F59E0B", bg: "rgba(245,158,11,0.06)", border: "rgba(245,158,11,0.2)",
        gradient: "linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(245,158,11,0.02) 100%)",
        label: "In-Transit", description: "En route to dealership",
        emptyMsg: "No vehicles currently in transit",
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 17H4a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v2" /><path d="M14 17H9" /><circle cx="7.5" cy="17.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" /><path d="M20 9h-6l-2 3h8l2-3z" /><path d="M22 12v3a1 1 0 01-1 1h-1" /></svg>,
    },
    Booked: {
        color: "#6366F1", bg: "rgba(99,102,241,0.06)", border: "rgba(99,102,241,0.2)",
        gradient: "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(99,102,241,0.02) 100%)",
        label: "Booked", description: "Reserved by client",
        emptyMsg: "No vehicles currently booked",
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" /></svg>,
    },
    Sold: {
        color: "#EF4444", bg: "rgba(239,68,68,0.06)", border: "rgba(239,68,68,0.2)",
        gradient: "linear-gradient(135deg, rgba(239,68,68,0.12) 0%, rgba(239,68,68,0.02) 100%)",
        label: "Sold", description: "Completed sales",
        emptyMsg: "No vehicles have been sold yet",
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>,
    },
};

const STATUS_TRANSITIONS: Record<VehicleStatus, VehicleStatus[]> = {
    Available: ["Booked", "Sold"],
    "In-Transit": ["Available", "Booked", "Sold"],
    Booked: ["Available", "Sold"],
    Sold: [],
};

const TAB_ORDER: VehicleStatus[] = ["Available", "In-Transit", "Booked", "Sold"];

/* ═══════════════════════════════════════════════════
   STATUS ACTION BUTTONS
   ═══════════════════════════════════════════════════ */
function StatusActions({
    vehicle, onStatusChange,
}: {
    vehicle: Vehicle;
    onStatusChange: (id: number, newStatus: VehicleStatus) => Promise<void>;
}) {
    const [loading, setLoading] = useState<string | null>(null);
    const transitions = STATUS_TRANSITIONS[vehicle.status as VehicleStatus];

    if (transitions.length === 0) return (
        <div style={{ fontSize: 12, color: "var(--text-muted)", fontStyle: "italic", padding: "8px 0" }}>
            Sale completed
        </div>
    );

    return (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {transitions.map((target) => {
                const cfg = STATUS_CONFIG[target];
                const isLoading = loading === target;
                return (
                    <button
                        key={target}
                        disabled={isLoading}
                        onClick={async (e) => {
                            e.stopPropagation();
                            setLoading(target);
                            await onStatusChange(vehicle.id, target);
                            setLoading(null);
                        }}
                        style={{
                            display: "flex", alignItems: "center", gap: 6,
                            padding: "8px 16px", borderRadius: 10,
                            background: cfg.bg, border: `1px solid ${cfg.border}`,
                            color: cfg.color, cursor: isLoading ? "wait" : "pointer",
                            fontSize: 13, fontWeight: 600, fontFamily: "'Inter', sans-serif",
                            transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                            opacity: isLoading ? 0.6 : 1,
                            transform: "scale(1)",
                        }}
                        onMouseOver={(e) => {
                            if (!isLoading) {
                                e.currentTarget.style.background = cfg.border;
                                e.currentTarget.style.transform = "scale(1.03)";
                                e.currentTarget.style.boxShadow = `0 4px 16px ${cfg.bg}`;
                            }
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = cfg.bg;
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow = "none";
                        }}
                    >
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: cfg.color, flexShrink: 0 }} />
                        {isLoading ? "Moving..." : `Mark ${target}`}
                    </button>
                );
            })}
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   VEHICLE CARD
   ═══════════════════════════════════════════════════ */
function VehicleCard({
    vehicle, onStatusChange, onClick, animDelay,
}: {
    vehicle: Vehicle;
    onStatusChange: (id: number, newStatus: VehicleStatus) => Promise<void>;
    onClick: () => void;
    animDelay: number;
}) {
    const brandColors: Record<string, string> = {
        Porsche: "#C9A962", Ferrari: "#DC2626", Lamborghini: "#FACC15",
        "Aston Martin": "#10B981", McLaren: "#F97316", Bentley: "#818CF8",
        BMW: "#60A5FA", Mercedes: "#94A3B8",
    };
    const accent = brandColors[vehicle.make] || "var(--gold)";

    return (
        <div
            onClick={onClick}
            style={{
                background: "linear-gradient(160deg, rgba(22,22,31,0.95) 0%, rgba(18,18,26,0.8) 100%)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 20, overflow: "hidden", cursor: "pointer",
                transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                animation: `fadeInUp 0.5s ease-out ${animDelay}ms both`,
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.borderColor = `${accent}44`;
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = `0 16px 48px rgba(0,0,0,0.4), 0 0 0 1px ${accent}22`;
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
            }}
        >
            {/* Top accent line */}
            <div style={{ height: 3, background: `linear-gradient(90deg, ${accent}, transparent)` }} />

            {/* Card Content */}
            <div style={{ padding: "24px 28px" }}>
                {/* Header: Brand icon + name + year */}
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                    <CarBrandIcon make={vehicle.make} size={44} />
                    <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <h3 style={{
                                fontSize: 18, fontWeight: 700, fontFamily: "'Outfit', sans-serif",
                                margin: 0,
                            }}>
                                {vehicle.model}
                            </h3>
                            <span style={{
                                fontSize: 11, fontWeight: 600, color: accent,
                                padding: "2px 8px", borderRadius: 6,
                                background: `${accent}12`, border: `1px solid ${accent}25`,
                            }}>
                                {vehicle.year}
                            </span>
                        </div>
                        <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "3px 0 0" }}>
                            {vehicle.make}
                        </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <p className="gold-text" style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Outfit', sans-serif", margin: 0 }}>
                            {formatCurrency(vehicle.purchase_price)}
                        </p>
                    </div>
                </div>

                {/* VIN */}
                <div style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "10px 14px", borderRadius: 10,
                    background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)",
                    marginBottom: 18,
                }}>
                    <span style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>VIN</span>
                    <span style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.05em" }}>
                        {vehicle.vin}
                    </span>
                </div>

                {/* Status Actions */}
                <div onClick={(e) => e.stopPropagation()}>
                    <StatusActions vehicle={vehicle} onStatusChange={onStatusChange} />
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   ADD VEHICLE MODAL
   ═══════════════════════════════════════════════════ */
const emptyForm = {
    vin: "", make: "", model: "",
    year: new Date().getFullYear(), purchase_price: 0,
    status: "Available" as VehicleStatus,
};

function AddVehicleModal({
    show, onClose, onAdded,
}: {
    show: boolean;
    onClose: () => void;
    onAdded: () => void;
}) {
    const [form, setForm] = useState({ ...emptyForm });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const makesAndModels = useMemo(() => getKnownMakesAndModels(), []);
    const sortedMakes = useMemo(() => Object.keys(makesAndModels).sort(), [makesAndModels]);
    const availableModels = form.make ? (makesAndModels[form.make] || []).sort() : [];

    if (!show) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(""); setSubmitting(true);
        try {
            await api.createVehicle({
                vin: form.vin.trim(), make: form.make.trim(), model: form.model.trim(),
                year: Number(form.year), purchase_price: Number(form.purchase_price), status: form.status,
            });
            onClose(); setForm({ ...emptyForm }); onAdded();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to add vehicle");
        } finally { setSubmitting(false); }
    }

    return (
        <div style={{
            position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)",
            animation: "fadeIn 0.2s ease",
        }} onClick={onClose}>
            <div style={{
                width: 560, maxHeight: "90vh", overflowY: "auto",
                background: "linear-gradient(160deg, rgba(22,22,31,0.98), rgba(14,14,20,0.98))",
                border: "1px solid rgba(201,169,98,0.25)", borderRadius: 24,
                padding: "36px 36px 28px", animation: "fadeInUp 0.35s ease-out",
                boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
            }} onClick={(e) => e.stopPropagation()}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
                    <div>
                        <h2 style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Outfit', sans-serif", margin: 0 }}>Add New Vehicle</h2>
                        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>Enter the vehicle details below</p>
                    </div>
                    <button onClick={onClose} style={{
                        width: 36, height: 36, borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)",
                        background: "rgba(255,255,255,0.03)", color: "var(--text-muted)", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>✕</button>
                </div>
                {error && (
                    <div style={{ padding: "12px 18px", marginBottom: 20, borderRadius: 12, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444", fontSize: 13 }}>{error}</div>
                )}
                <form onSubmit={handleSubmit}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                        <div>
                            <label style={{ fontSize: 12, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8, fontWeight: 600 }}>
                                VIN <span style={{ color: "#EF4444" }}>*</span>
                            </label>
                            <input className="input-dark" type="text" required maxLength={17} placeholder="e.g., WP0AB2A71KS999001" value={form.vin}
                                onChange={(e) => setForm({ ...form, vin: e.target.value })} style={{ width: "100%", padding: "12px 18px", borderRadius: 12 }} />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            <div>
                                <label style={{ fontSize: 12, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8, fontWeight: 600 }}>Make *</label>
                                <select className="input-dark" required value={form.make}
                                    onChange={(e) => setForm({ ...form, make: e.target.value, model: "" })} style={{ width: "100%", padding: "12px 18px", borderRadius: 12 }}>
                                    <option value="">Select Make</option>
                                    {sortedMakes.map((m) => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: 12, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8, fontWeight: 600 }}>Model *</label>
                                <select className="input-dark" required value={form.model}
                                    onChange={(e) => setForm({ ...form, model: e.target.value })} style={{ width: "100%", padding: "12px 18px", borderRadius: 12 }}
                                    disabled={!form.make}>
                                    <option value="">{form.make ? "Select Model" : "Select a make first"}</option>
                                    {availableModels.map((m) => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            <div>
                                <label style={{ fontSize: 12, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8, fontWeight: 600 }}>Year *</label>
                                <input className="input-dark" type="number" required min={1900} max={2030} value={form.year}
                                    onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) || 0 })} style={{ width: "100%", padding: "12px 18px", borderRadius: 12 }} />
                            </div>
                            <div>
                                <label style={{ fontSize: 12, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8, fontWeight: 600 }}>Price ($) *</label>
                                <input className="input-dark" type="number" required min={1} step="0.01" placeholder="250000" value={form.purchase_price || ""}
                                    onChange={(e) => setForm({ ...form, purchase_price: parseFloat(e.target.value) || 0 })} style={{ width: "100%", padding: "12px 18px", borderRadius: 12 }} />
                            </div>
                        </div>
                        <div>
                            <label style={{ fontSize: 12, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8, fontWeight: 600 }}>Initial Status</label>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                                {TAB_ORDER.map((s) => {
                                    const cfg = STATUS_CONFIG[s];
                                    const active = form.status === s;
                                    return (
                                        <button key={s} type="button" onClick={() => setForm({ ...form, status: s })}
                                            style={{
                                                padding: "10px 0", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer",
                                                background: active ? cfg.bg : "rgba(255,255,255,0.02)",
                                                border: active ? `2px solid ${cfg.color}` : "1px solid rgba(255,255,255,0.06)",
                                                color: active ? cfg.color : "var(--text-muted)",
                                                transition: "all 0.2s ease",
                                            }}>
                                            {cfg.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 32 }}>
                        <button type="button" className="btn-outline" onClick={onClose} disabled={submitting} style={{ borderRadius: 12, padding: "12px 24px" }}>Cancel</button>
                        <button type="submit" className="btn-gold" disabled={submitting} style={{ borderRadius: 12, padding: "12px 28px", opacity: submitting ? 0.6 : 1 }}>
                            {submitting ? "Adding..." : "Add Vehicle"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   MAIN INVENTORY PAGE
   ═══════════════════════════════════════════════════ */
export default function InventoryPage() {
    const router = useRouter();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<VehicleStatus>("Available");
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);

    useEffect(() => { loadVehicles(); }, []);

    async function loadVehicles() {
        setLoading(true);
        try { setVehicles(await api.getVehicles()); }
        catch (e) { console.error("Failed to load vehicles", e); }
        finally { setLoading(false); }
    }

    async function handleStatusChange(vehicleId: number, newStatus: VehicleStatus) {
        try {
            await api.updateVehicle(vehicleId, { status: newStatus });
            await loadVehicles();
        } catch (err) { console.error("Failed to update status", err); }
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

    // Current tab vehicles (with search filter)
    const currentVehicles = useMemo(() => {
        const list = grouped[activeTab] || [];
        if (!search) return list;
        const q = search.toLowerCase();
        return list.filter((v) =>
            v.vin.toLowerCase().includes(q) || v.make.toLowerCase().includes(q) || v.model.toLowerCase().includes(q)
        );
    }, [grouped, activeTab, search]);

    const cfg = STATUS_CONFIG[activeTab];

    return (
        <div>
            {/* ── Page Header ──────────────────────────────── */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
                <div>
                    <h1 style={{ fontSize: 30, fontWeight: 800, fontFamily: "'Outfit', sans-serif", margin: 0, letterSpacing: "-0.02em" }}>
                        Vehicle Inventory
                    </h1>
                    <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 6 }}>
                        {vehicles.length} vehicles across your collection
                    </p>
                </div>
                <button className="btn-gold" onClick={() => setShowModal(true)} style={{ borderRadius: 12, padding: "12px 24px", fontSize: 14 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add Vehicle
                </button>
            </div>

            {/* ── Status Tab Bar ────────────────────────────── */}
            <div style={{
                display: "flex", gap: 0, marginBottom: 28,
                background: "rgba(255,255,255,0.02)", borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.05)", padding: 5,
            }}>
                {TAB_ORDER.map((status) => {
                    const tabCfg = STATUS_CONFIG[status];
                    const count = grouped[status].length;
                    const isActive = activeTab === status;
                    return (
                        <button
                            key={status}
                            onClick={() => { setActiveTab(status); setSearch(""); }}
                            style={{
                                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                                padding: "16px 20px", borderRadius: 12, border: "none",
                                background: isActive ? tabCfg.gradient : "transparent",
                                cursor: "pointer", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                position: "relative",
                            }}
                        >
                            <span style={{ color: isActive ? tabCfg.color : "var(--text-muted)", transition: "color 0.3s", display: "flex" }}>
                                {tabCfg.icon}
                            </span>
                            <span style={{
                                fontSize: 14, fontWeight: isActive ? 700 : 500,
                                color: isActive ? tabCfg.color : "var(--text-secondary)",
                                fontFamily: "'Outfit', sans-serif", transition: "all 0.3s",
                            }}>
                                {tabCfg.label}
                            </span>
                            <span style={{
                                fontSize: 12, fontWeight: 700,
                                padding: "2px 10px", borderRadius: 20,
                                background: isActive ? `${tabCfg.color}22` : "rgba(255,255,255,0.04)",
                                color: isActive ? tabCfg.color : "var(--text-muted)",
                                transition: "all 0.3s",
                                minWidth: 28, textAlign: "center",
                            }}>
                                {count}
                            </span>
                            {/* Active indicator line */}
                            {isActive && (
                                <div style={{
                                    position: "absolute", bottom: 0, left: "20%", right: "20%", height: 2,
                                    background: tabCfg.color, borderRadius: 1,
                                    transition: "all 0.3s",
                                }} />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* ── Section Header + Search ───────────────────── */}
            <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                marginBottom: 24, gap: 20,
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                        width: 42, height: 42, borderRadius: 12,
                        background: cfg.gradient, border: `1px solid ${cfg.border}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: cfg.color,
                    }}>
                        {cfg.icon}
                    </div>
                    <div>
                        <h2 style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Outfit', sans-serif", margin: 0, color: cfg.color }}>
                            {cfg.label}
                        </h2>
                        <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>{cfg.description}</p>
                    </div>
                </div>

                {/* Search */}
                <div style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 18px", borderRadius: 12,
                    background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                    minWidth: 300, transition: "border-color 0.2s",
                }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text" placeholder={`Search ${cfg.label.toLowerCase()} vehicles...`}
                        value={search} onChange={(e) => setSearch(e.target.value)}
                        style={{
                            flex: 1, background: "none", border: "none", outline: "none",
                            color: "var(--text-primary)", fontSize: 14, fontFamily: "inherit",
                        }}
                    />
                    {search && (
                        <button onClick={() => setSearch("")} style={{
                            background: "none", border: "none", color: "var(--text-muted)",
                            cursor: "pointer", fontSize: 16, lineHeight: 1, padding: 0,
                        }}>✕</button>
                    )}
                </div>
            </div>

            {/* ── Vehicle Grid / Empty State ────────────────── */}
            {loading ? (
                <div style={{
                    padding: 80, textAlign: "center",
                    background: "rgba(255,255,255,0.01)", borderRadius: 20,
                    border: "1px solid rgba(255,255,255,0.04)",
                }}>
                    <div style={{
                        width: 40, height: 40, border: "3px solid rgba(201,169,98,0.15)",
                        borderTop: "3px solid var(--gold)", borderRadius: "50%",
                        animation: "spin 1s linear infinite", margin: "0 auto 16px",
                    }} />
                    <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Loading inventory...</p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            ) : currentVehicles.length === 0 ? (
                <div style={{
                    padding: "80px 40px", textAlign: "center",
                    background: cfg.gradient, borderRadius: 24,
                    border: `1px dashed ${cfg.border}`,
                }}>
                    <div style={{ color: cfg.color, opacity: 0.4, marginBottom: 16, display: "flex", justifyContent: "center" }}>
                        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
                        </svg>
                    </div>
                    <p style={{ fontSize: 16, fontWeight: 600, color: cfg.color, fontFamily: "'Outfit', sans-serif", marginBottom: 6 }}>
                        {search ? "No matching vehicles" : cfg.emptyMsg}
                    </p>
                    <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
                        {search ? "Try adjusting your search terms" : "Vehicles will appear here as they're added"}
                    </p>
                </div>
            ) : (
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
                    gap: 20,
                }}>
                    {currentVehicles.map((v, i) => (
                        <VehicleCard
                            key={v.id}
                            vehicle={v}
                            onStatusChange={handleStatusChange}
                            onClick={() => router.push(`/inventory/${v.id}`)}
                            animDelay={i * 60}
                        />
                    ))}
                </div>
            )}

            {/* Add Vehicle Modal */}
            <AddVehicleModal show={showModal} onClose={() => setShowModal(false)} onAdded={loadVehicles} />

            {/* Animations */}
            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
}
