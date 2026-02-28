"use client";

import { useEffect, useState } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
    PieChart, Pie, Cell,
} from "recharts";
import { api, Sale, Vehicle, Client } from "@/lib/api";
import { CarBrandIcon } from "@/components/CarBrandIcon";

function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(value);
}

interface EnrichedSale extends Sale {
    vehicleName: string;
    vehicleMake: string;
    clientName: string;
    profit: number;
}

const emptyForm = { vehicle_id: 0, client_id: 0, sale_price: 0, sale_date: "", commission: 0 };

export default function SalesPage() {
    const [sales, setSales] = useState<EnrichedSale[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ ...emptyForm });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => { load(); }, []);

    async function load() {
        setLoading(true);
        try {
            const [s, v, c] = await Promise.all([api.getSales(), api.getVehicles(), api.getClients()]);
            setVehicles(v);
            setClients(c);
            const enriched = s.map((sale) => {
                const vehicle = v.find((vh) => vh.id === sale.vehicle_id);
                const client = c.find((cl) => cl.id === sale.client_id);
                return {
                    ...sale,
                    vehicleName: vehicle ? `${vehicle.make} ${vehicle.model}` : "Unknown",
                    vehicleMake: vehicle?.make || "",
                    clientName: client ? `${client.first_name} ${client.last_name}` : "Unknown",
                    profit: vehicle ? sale.sale_price - vehicle.purchase_price : 0,
                };
            });
            setSales(enriched);
        } catch (e) { console.error("Failed to load sales", e); }
        finally { setLoading(false); }
    }

    async function handleRecordSale(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            await api.createSale({
                vehicle_id: Number(form.vehicle_id),
                client_id: Number(form.client_id),
                sale_price: Number(form.sale_price),
                sale_date: form.sale_date,
                commission: Number(form.commission),
            });
            setShowModal(false);
            setForm({ ...emptyForm });
            await load();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to record sale");
        } finally { setSubmitting(false); }
    }

    const totalRevenue = sales.reduce((s, sl) => s + sl.sale_price, 0);
    const totalProfit = sales.reduce((s, sl) => s + sl.profit, 0);
    const totalCommission = sales.reduce((s, sl) => s + sl.commission, 0);
    const avgDealSize = sales.length > 0 ? totalRevenue / sales.length : 0;

    // Monthly breakdown
    const monthlyData: Record<string, { revenue: number; commission: number; deals: number }> = {};
    sales.forEach((s) => {
        const d = new Date(s.sale_date);
        const key = `${d.toLocaleString("en", { month: "short" })} ${d.getFullYear().toString().slice(2)}`;
        if (!monthlyData[key]) monthlyData[key] = { revenue: 0, commission: 0, deals: 0 };
        monthlyData[key].revenue += s.sale_price;
        monthlyData[key].commission += s.commission;
        monthlyData[key].deals += 1;
    });
    const monthlyChart = Object.entries(monthlyData).map(([month, d]) => ({ month, ...d }));

    // Top salespeople by commission (aggregated by client for simplicity)
    const commByClient: Record<string, number> = {};
    sales.forEach((s) => { commByClient[s.clientName] = (commByClient[s.clientName] || 0) + s.commission; });
    const topCommission = Object.entries(commByClient).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5);
    const COMM_COLORS = ["#C9A962", "#E8D5A3", "#34D399", "#60A5FA", "#818CF8"];

    const availableVehicles = vehicles.filter((v) => v.status === "Available");

    return (
        <div>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>Sales Ledger</h1>
                    <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4 }}>{sales.length} transactions recorded</p>
                </div>
                <button className="btn-gold" onClick={() => { setShowModal(true); setError(""); setForm({ ...emptyForm, sale_date: new Date().toISOString().split("T")[0] }); }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Record Sale
                </button>
            </div>

            {/* KPI Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
                {[
                    { label: "Total Revenue", value: formatCurrency(totalRevenue), color: "var(--gold)" },
                    { label: "Total Profit", value: formatCurrency(totalProfit), color: "var(--status-available)" },
                    { label: "Total Commission", value: formatCurrency(totalCommission), color: "var(--platinum)" },
                    { label: "Avg Deal Size", value: formatCurrency(avgDealSize), color: "var(--gold-light)" },
                ].map((s) => (
                    <div key={s.label} className="glass-card" style={{ padding: "16px 20px" }}>
                        <p style={{ fontSize: 11, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{s.label}</p>
                        <p style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Outfit', sans-serif", color: s.color }}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 0.6fr", gap: 20, marginBottom: 20 }}>
                {/* Monthly Revenue + Commission */}
                <div className="glass-card" style={{ padding: 24 }}>
                    <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Monthly Revenue & Commission</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={monthlyChart} barGap={4}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis dataKey="month" stroke="var(--text-muted)" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                            <YAxis stroke="var(--text-muted)" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                            <Tooltip
                                contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: 12, color: "var(--text-primary)" }}
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                formatter={((v: any) => [formatCurrency(v)]) as any}
                            />
                            <Bar dataKey="revenue" name="Revenue" fill="#C9A962" radius={[4, 4, 0, 0]} barSize={20} />
                            <Bar dataKey="commission" name="Commission" fill="#34D399" radius={[4, 4, 0, 0]} barSize={20} />
                            <Legend wrapperStyle={{ color: "var(--text-secondary)", fontSize: 11 }} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Commission by Client Pie */}
                <div className="glass-card" style={{ padding: 24 }}>
                    <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Commission by Client</h2>
                    <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                            <Pie data={topCommission} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" paddingAngle={3} strokeWidth={0}>
                                {topCommission.map((_, i) => <Cell key={i} fill={COMM_COLORS[i]} />)}
                            </Pie>
                            <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: 12, color: "var(--text-primary)" }}
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                formatter={((v: any) => [formatCurrency(v)]) as any} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
                        {topCommission.map((c, i) => (
                            <span key={c.name} style={{ fontSize: 10, color: COMM_COLORS[i], display: "flex", alignItems: "center", gap: 3 }}>
                                <span style={{ width: 6, height: 6, borderRadius: 2, background: COMM_COLORS[i], display: "inline-block" }} />
                                {c.name.split(" ")[0]}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sales Table */}
            <div className="glass-card" style={{ overflow: "hidden" }}>
                {loading ? (
                    <div style={{ padding: 60, textAlign: "center", color: "var(--text-secondary)" }}>Loading sales...</div>
                ) : (
                    <table className="premium-table">
                        <thead>
                            <tr><th></th><th>Vehicle</th><th>Client</th><th>Date</th><th>Sale Price</th><th>Commission</th><th>Profit</th></tr>
                        </thead>
                        <tbody>
                            {[...sales].reverse().map((s) => (
                                <tr key={s.id}>
                                    <td style={{ width: 40, padding: "10px 12px" }}><CarBrandIcon make={s.vehicleMake} size={30} /></td>
                                    <td style={{ fontWeight: 600, fontSize: 13 }}>{s.vehicleName}</td>
                                    <td style={{ color: "var(--text-secondary)", fontSize: 13 }}>{s.clientName}</td>
                                    <td style={{ color: "var(--text-secondary)", fontSize: 12 }}>
                                        {new Date(s.sale_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                    </td>
                                    <td className="gold-text" style={{ fontWeight: 600 }}>{formatCurrency(s.sale_price)}</td>
                                    <td style={{ color: "var(--platinum)", fontWeight: 500 }}>{formatCurrency(s.commission)}</td>
                                    <td style={{ color: s.profit >= 0 ? "var(--status-available)" : "var(--danger)", fontWeight: 600 }}>
                                        {s.profit >= 0 ? "+" : ""}{formatCurrency(s.profit)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* ── Record Sale Modal ── */}
            {showModal && (
                <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }}
                    onClick={() => setShowModal(false)}>
                    <div className="glass-card" style={{ width: 520, padding: 32, border: "1px solid var(--border-accent)", animation: "fadeInUp 0.3s ease-out" }}
                        onClick={(e) => e.stopPropagation()}>
                        <h2 style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Outfit', sans-serif", marginBottom: 24 }}>Record New Sale</h2>
                        {error && (
                            <div style={{ padding: "10px 16px", marginBottom: 16, borderRadius: 10, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#EF4444", fontSize: 13 }}>{error}</div>
                        )}
                        <form onSubmit={handleRecordSale}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                <div>
                                    <label style={{ fontSize: 12, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Vehicle *</label>
                                    <select className="input-dark" required value={form.vehicle_id} onChange={(e) => setForm({ ...form, vehicle_id: parseInt(e.target.value) })} style={{ width: "100%" }}>
                                        <option value={0} disabled>Select a vehicle...</option>
                                        {availableVehicles.map((v) => (
                                            <option key={v.id} value={v.id}>{v.make} {v.model} ({v.year}) — {formatCurrency(v.purchase_price)}</option>
                                        ))}
                                        {availableVehicles.length === 0 && <option value={0} disabled>No available vehicles</option>}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: 12, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Client *</label>
                                    <select className="input-dark" required value={form.client_id} onChange={(e) => setForm({ ...form, client_id: parseInt(e.target.value) })} style={{ width: "100%" }}>
                                        <option value={0} disabled>Select a client...</option>
                                        {clients.map((c) => (
                                            <option key={c.id} value={c.id}>{c.first_name} {c.last_name} — {c.vip_tier}</option>
                                        ))}
                                    </select>
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                                    <div>
                                        <label style={{ fontSize: 12, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Sale Price ($) *</label>
                                        <input className="input-dark" type="number" required min={1} step="0.01" placeholder="e.g., 300000" value={form.sale_price || ""}
                                            onChange={(e) => setForm({ ...form, sale_price: parseFloat(e.target.value) || 0 })} style={{ width: "100%" }} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: 12, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Sale Date *</label>
                                        <input className="input-dark" type="date" required value={form.sale_date}
                                            onChange={(e) => setForm({ ...form, sale_date: e.target.value })} style={{ width: "100%" }} />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ fontSize: 12, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Commission ($) *</label>
                                    <input className="input-dark" type="number" required min={0} step="0.01" placeholder="e.g., 15000" value={form.commission || ""}
                                        onChange={(e) => setForm({ ...form, commission: parseFloat(e.target.value) || 0 })} style={{ width: "100%" }} />
                                </div>
                            </div>
                            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 28 }}>
                                <button type="button" className="btn-outline" onClick={() => setShowModal(false)} disabled={submitting}>Cancel</button>
                                <button type="submit" className="btn-gold" disabled={submitting} style={{ opacity: submitting ? 0.6 : 1 }}>
                                    {submitting ? "Recording..." : "Record Sale"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
