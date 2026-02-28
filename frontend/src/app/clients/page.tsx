"use client";

import { useEffect, useState } from "react";
import { api, Client } from "@/lib/api";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(value);
}

const TIER_COLORS: Record<string, string> = { Black: "#F0F0F5", Platinum: "#B8C4D0", Gold: "#C9A962", Standard: "#8A8A9A" };

function VIPBadge({ tier }: { tier: string }) {
    const c = TIER_COLORS[tier] || "#8A8A9A";
    const icons: Record<string, string> = { Black: "♦", Platinum: "◆", Gold: "★", Standard: "○" };
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 12px", borderRadius: 20,
            fontSize: 12, fontWeight: 600, letterSpacing: "0.04em", background: `${c}15`, color: c, border: `1px solid ${c}30`,
        }}>
            {icons[tier] || ""} {tier}
        </span>
    );
}

const emptyClient = {
    first_name: "", last_name: "", email: "", phone: "",
    lifetime_value: 0, vip_tier: "Standard" as "Standard" | "Gold" | "Platinum" | "Black",
};

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [tierFilter, setTierFilter] = useState("");
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ ...emptyClient });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => { loadClients(); }, [tierFilter]);

    async function loadClients() {
        setLoading(true);
        try {
            const params: { vip_tier?: string } = {};
            if (tierFilter) params.vip_tier = tierFilter;
            setClients(await api.getClients(params));
        } catch (e) { console.error("Failed to load clients", e); }
        finally { setLoading(false); }
    }

    async function handleAddClient(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            await api.createClient({
                first_name: form.first_name.trim(), last_name: form.last_name.trim(),
                email: form.email.trim(), phone: form.phone.trim() || null,
                lifetime_value: Number(form.lifetime_value), vip_tier: form.vip_tier,
            });
            setShowModal(false);
            setForm({ ...emptyClient });
            await loadClients();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to add client");
        } finally { setSubmitting(false); }
    }

    const filteredClients = search
        ? clients.filter((c) =>
            `${c.first_name} ${c.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase())
        )
        : clients;

    // Tier stats
    const tierCounts: Record<string, number> = { Black: 0, Platinum: 0, Gold: 0, Standard: 0 };
    clients.forEach((c) => { tierCounts[c.vip_tier] = (tierCounts[c.vip_tier] || 0) + 1; });
    const tierPieData = Object.entries(tierCounts).filter(([, v]) => v > 0).map(([name, value]) => ({ name, value }));
    const totalLTV = clients.reduce((s, c) => s + c.lifetime_value, 0);
    const avgLTV = clients.length > 0 ? totalLTV / clients.length : 0;

    return (
        <div>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>Client Portfolio</h1>
                    <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4 }}>{filteredClients.length} distinguished clients</p>
                </div>
                <button className="btn-gold" onClick={() => { setShowModal(true); setError(""); }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add Client
                </button>
            </div>

            {/* Stats Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14, marginBottom: 20 }}>
                <div className="glass-card" style={{ padding: "16px 20px" }}>
                    <p style={{ fontSize: 11, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Total Clients</p>
                    <p style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Outfit', sans-serif", color: "var(--gold)" }}>{clients.length}</p>
                </div>
                <div className="glass-card" style={{ padding: "16px 20px" }}>
                    <p style={{ fontSize: 11, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Total Lifetime Value</p>
                    <p className="gold-text" style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>{formatCurrency(totalLTV)}</p>
                </div>
                <div className="glass-card" style={{ padding: "16px 20px" }}>
                    <p style={{ fontSize: 11, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Avg Lifetime Value</p>
                    <p style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Outfit', sans-serif", color: "var(--platinum)" }}>{formatCurrency(avgLTV)}</p>
                </div>
                <div className="glass-card" style={{ padding: "16px 20px" }}>
                    <p style={{ fontSize: 11, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>VIP Distribution</p>
                    <div style={{ display: "flex", gap: 10, marginTop: 2 }}>
                        {Object.entries(tierCounts).map(([t, v]) => (
                            <span key={t} style={{ fontSize: 12, color: TIER_COLORS[t], fontWeight: 600 }}>{v} <span style={{ fontSize: 10, fontWeight: 400 }}>{t}</span></span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="glass-card" style={{ display: "flex", gap: 14, padding: "16px 20px", marginBottom: 20, alignItems: "center" }}>
                <select className="input-dark" value={tierFilter} onChange={(e) => setTierFilter(e.target.value)} style={{ minWidth: 160 }}>
                    <option value="">All VIP Tiers</option>
                    <option value="Black">♦ Black</option>
                    <option value="Platinum">◆ Platinum</option>
                    <option value="Gold">★ Gold</option>
                    <option value="Standard">Standard</option>
                </select>
                <input className="input-dark" type="text" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: 1 }} />
            </div>

            {/* Table */}
            <div className="glass-card" style={{ overflow: "hidden" }}>
                {loading ? (
                    <div style={{ padding: 60, textAlign: "center", color: "var(--text-secondary)" }}>Loading clients...</div>
                ) : (
                    <table className="premium-table">
                        <thead>
                            <tr><th>Client</th><th>Email</th><th>Phone</th><th>Lifetime Value</th><th>VIP Tier</th></tr>
                        </thead>
                        <tbody>
                            {filteredClients.map((c) => (
                                <tr key={c.id}>
                                    <td>
                                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                            <div style={{
                                                width: 38, height: 38, borderRadius: "50%",
                                                background: `linear-gradient(135deg, ${TIER_COLORS[c.vip_tier]}22, ${TIER_COLORS[c.vip_tier]}08)`,
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                fontSize: 14, fontWeight: 700, color: TIER_COLORS[c.vip_tier],
                                                border: `1px solid ${TIER_COLORS[c.vip_tier]}30`,
                                            }}>
                                                {c.first_name[0]}{c.last_name[0]}
                                            </div>
                                            <p style={{ fontWeight: 600, fontSize: 14 }}>{c.first_name} {c.last_name}</p>
                                        </div>
                                    </td>
                                    <td style={{ color: "var(--text-secondary)", fontSize: 13 }}>{c.email}</td>
                                    <td style={{ color: "var(--text-secondary)", fontSize: 13 }}>{c.phone || "—"}</td>
                                    <td className="gold-text" style={{ fontWeight: 600 }}>{formatCurrency(c.lifetime_value)}</td>
                                    <td><VIPBadge tier={c.vip_tier} /></td>
                                </tr>
                            ))}
                            {filteredClients.length === 0 && (
                                <tr><td colSpan={5} style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>No clients found</td></tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* ── Add Client Modal ── */}
            {showModal && (
                <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }}
                    onClick={() => setShowModal(false)}>
                    <div className="glass-card" style={{ width: 520, padding: 32, border: "1px solid var(--border-accent)", animation: "fadeInUp 0.3s ease-out" }}
                        onClick={(e) => e.stopPropagation()}>
                        <h2 style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Outfit', sans-serif", marginBottom: 24 }}>Add New Client</h2>
                        {error && (
                            <div style={{ padding: "10px 16px", marginBottom: 16, borderRadius: 10, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#EF4444", fontSize: 13 }}>{error}</div>
                        )}
                        <form onSubmit={handleAddClient}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                                    <div>
                                        <label style={{ fontSize: 12, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>First Name *</label>
                                        <input className="input-dark" type="text" required placeholder="Alexander" value={form.first_name}
                                            onChange={(e) => setForm({ ...form, first_name: e.target.value })} style={{ width: "100%" }} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: 12, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Last Name *</label>
                                        <input className="input-dark" type="text" required placeholder="Rothschild" value={form.last_name}
                                            onChange={(e) => setForm({ ...form, last_name: e.target.value })} style={{ width: "100%" }} />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ fontSize: 12, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Email *</label>
                                    <input className="input-dark" type="email" required placeholder="client@luxmail.com" value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })} style={{ width: "100%" }} />
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                                    <div>
                                        <label style={{ fontSize: 12, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Phone</label>
                                        <input className="input-dark" type="tel" placeholder="+1-212-555-0101" value={form.phone}
                                            onChange={(e) => setForm({ ...form, phone: e.target.value })} style={{ width: "100%" }} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: 12, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>VIP Tier</label>
                                        <select className="input-dark" value={form.vip_tier}
                                            onChange={(e) => setForm({ ...form, vip_tier: e.target.value as any })} style={{ width: "100%" }}>
                                            <option value="Standard">Standard</option>
                                            <option value="Gold">★ Gold</option>
                                            <option value="Platinum">◆ Platinum</option>
                                            <option value="Black">♦ Black</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 28 }}>
                                <button type="button" className="btn-outline" onClick={() => setShowModal(false)} disabled={submitting}>Cancel</button>
                                <button type="submit" className="btn-gold" disabled={submitting} style={{ opacity: submitting ? 0.6 : 1 }}>
                                    {submitting ? "Adding..." : "Add Client"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
