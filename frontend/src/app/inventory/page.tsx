"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, Vehicle } from "@/lib/api";
import { CarBrandIcon } from "@/components/CarBrandIcon";

function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
    }).format(value);
}

function StatusBadge({ status }: { status: string }) {
    const cls =
        status === "Available"
            ? "status-available"
            : status === "Sold"
                ? "status-sold"
                : "status-transit";
    return (
        <span className={`status-badge ${cls}`}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", display: "inline-block" }} />
            {status}
        </span>
    );
}

const emptyForm = {
    vin: "",
    make: "",
    model: "",
    year: new Date().getFullYear(),
    purchase_price: 0,
    status: "Available" as "Available" | "Sold" | "In-Transit",
};

export default function InventoryPage() {
    const router = useRouter();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("");
    const [makeFilter, setMakeFilter] = useState("");
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ ...emptyForm });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => { loadVehicles(); }, [statusFilter, makeFilter]);

    async function loadVehicles() {
        setLoading(true);
        try {
            const params: { status?: string; make?: string } = {};
            if (statusFilter) params.status = statusFilter;
            if (makeFilter) params.make = makeFilter;
            const data = await api.getVehicles(params);
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

    const filteredVehicles = search
        ? vehicles.filter((v) =>
            v.vin.toLowerCase().includes(search.toLowerCase()) ||
            v.make.toLowerCase().includes(search.toLowerCase()) ||
            v.model.toLowerCase().includes(search.toLowerCase())
        )
        : vehicles;

    const uniqueMakes = [...new Set(vehicles.map((v) => v.make))];

    // Summary stats
    const totalValue = vehicles.reduce((s, v) => s + v.purchase_price, 0);
    const avgValue = vehicles.length > 0 ? totalValue / vehicles.length : 0;
    const availCount = vehicles.filter((v) => v.status === "Available").length;

    return (
        <div>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>Vehicle Inventory</h1>
                    <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4 }}>
                        {filteredVehicles.length} vehicles in your collection
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
                {[
                    { label: "Total Vehicles", value: vehicles.length, color: "var(--gold)" },
                    { label: "Available Now", value: availCount, color: "var(--status-available)" },
                    { label: "Fleet Value", value: formatCurrency(totalValue), color: "var(--gold-light)" },
                    { label: "Avg Value", value: formatCurrency(avgValue), color: "var(--platinum)" },
                ].map((s) => (
                    <div key={s.label} className="glass-card" style={{ padding: "16px 20px" }}>
                        <p style={{ fontSize: 11, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{s.label}</p>
                        <p style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Outfit', sans-serif", color: s.color }}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="glass-card" style={{ display: "flex", gap: 14, padding: "16px 20px", marginBottom: 20, alignItems: "center" }}>
                <select className="input-dark" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ minWidth: 140 }}>
                    <option value="">All Status</option>
                    <option value="Available">Available</option>
                    <option value="Sold">Sold</option>
                    <option value="In-Transit">In-Transit</option>
                </select>
                <select className="input-dark" value={makeFilter} onChange={(e) => setMakeFilter(e.target.value)} style={{ minWidth: 140 }}>
                    <option value="">All Makes</option>
                    {uniqueMakes.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
                <input className="input-dark" type="text" placeholder="Search VIN, make, or model..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: 1 }} />
            </div>

            {/* Table with car brand icons */}
            <div className="glass-card" style={{ overflow: "hidden" }}>
                {loading ? (
                    <div style={{ padding: 60, textAlign: "center", color: "var(--text-secondary)" }}>Loading inventory...</div>
                ) : (
                    <table className="premium-table">
                        <thead>
                            <tr><th></th><th>Make</th><th>Model</th><th>Year</th><th>VIN</th><th>Purchase Price</th><th>Status</th></tr>
                        </thead>
                        <tbody>
                            {filteredVehicles.map((v) => (
                                <tr key={v.id}
                                    onClick={() => router.push(`/inventory/${v.id}`)}
                                    style={{ cursor: "pointer", transition: "all 0.2s ease" }}
                                    onMouseOver={(e) => { e.currentTarget.style.background = "rgba(201,169,98,0.06)"; }}
                                    onMouseOut={(e) => { e.currentTarget.style.background = ""; }}
                                    title={`View ${v.make} ${v.model} details`}
                                >
                                    <td style={{ width: 50, padding: "10px 14px" }}>
                                        <CarBrandIcon make={v.make} size={34} />
                                    </td>
                                    <td style={{ fontWeight: 600 }}>{v.make}</td>
                                    <td>{v.model}</td>
                                    <td>{v.year}</td>
                                    <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "var(--text-secondary)" }}>{v.vin}</td>
                                    <td className="gold-text" style={{ fontWeight: 600 }}>{formatCurrency(v.purchase_price)}</td>
                                    <td style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <StatusBadge status={v.status} />
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" style={{ opacity: 0.4 }}><path d="M9 18l6-6-6-6" /></svg>
                                    </td>
                                </tr>
                            ))}
                            {filteredVehicles.length === 0 && (
                                <tr><td colSpan={7} style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>No vehicles found</td></tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

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
                                        <input className="input-dark" type="text" required placeholder="e.g., Porsche" value={form.make}
                                            onChange={(e) => setForm({ ...form, make: e.target.value })} style={{ width: "100%" }} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: 12, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Model *</label>
                                        <input className="input-dark" type="text" required placeholder="e.g., 911 Turbo S" value={form.model}
                                            onChange={(e) => setForm({ ...form, model: e.target.value })} style={{ width: "100%" }} />
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
                                    <select className="input-dark" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })} style={{ width: "100%" }}>
                                        <option value="Available">Available</option>
                                        <option value="Sold">Sold</option>
                                        <option value="In-Transit">In-Transit</option>
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
