"use client";

import { useEffect, useState } from "react";
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Legend, PieChart, Pie, Cell, LineChart, Line, ScatterChart, Scatter, ZAxis,
} from "recharts";
import { api, QuarterlyAggregate, Insights, Sale, Vehicle, Client } from "@/lib/api";
import { CarBrandIcon } from "@/components/CarBrandIcon";

function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
}

const BRAND_COLORS: Record<string, string> = {
    Porsche: "#C9A962", Ferrari: "#DC2626", Lamborghini: "#FACC15",
    "Aston Martin": "#10B981", McLaren: "#F97316", Bentley: "#818CF8",
    BMW: "#60A5FA", Mercedes: "#94A3B8",
};
const PIE_COLORS = ["#C9A962", "#E8D5A3", "#B8993A", "#34D399", "#60A5FA", "#818CF8", "#F97316", "#DC2626"];

export default function AnalyticsPage() {
    const [insights, setInsights] = useState<Insights | null>(null);
    const [quarters, setQuarters] = useState<QuarterlyAggregate[]>([]);
    const [sales, setSales] = useState<Sale[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const [ins, q, s, v, c] = await Promise.all([
                    api.getInsights(), api.getQuarterly(), api.getSales(), api.getVehicles(), api.getClients(),
                ]);
                setInsights(ins); setQuarters(q); setSales(s); setVehicles(v); setClients(c);
            } catch (e) { console.error("Failed to load analytics", e); }
            finally { setLoading(false); }
        }
        load();
    }, []);

    if (loading) {
        return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
            <div className="gold-text" style={{ fontSize: 20, fontWeight: 600 }}>Loading Analytics...</div>
        </div>;
    }

    // ── Computed Analytics ──────────────────
    const totalRevenue = quarters.reduce((s, q) => s + q.total_revenue, 0);
    const totalUnits = sales.length;
    const totalCommission = sales.reduce((s, sl) => s + sl.commission, 0);
    const profitMargin = totalRevenue > 0
        ? ((sales.reduce((s, sl) => {
            const v = vehicles.find((vh) => vh.id === sl.vehicle_id);
            return s + (v ? sl.sale_price - v.purchase_price : 0);
        }, 0)) / totalRevenue * 100).toFixed(1)
        : "0.0";

    // Revenue vs Units dual-axis data
    const dualAxisData = quarters.map((q) => ({
        quarter: q.quarter,
        revenue: q.total_revenue,
        units: q.total_units_sold,
        avgPrice: q.average_price,
    }));

    // Price distribution histogram
    const priceRanges = [
        { range: "$200k-250k", min: 200000, max: 250000, count: 0 },
        { range: "$250k-300k", min: 250000, max: 300000, count: 0 },
        { range: "$300k-350k", min: 300000, max: 350000, count: 0 },
        { range: "$350k-400k", min: 350000, max: 400000, count: 0 },
    ];
    sales.forEach((s) => {
        const r = priceRanges.find((pr) => s.sale_price >= pr.min && s.sale_price < pr.max);
        if (r) r.count++;
    });

    // Revenue by brand
    const brandRev: Record<string, number> = {};
    const brandUnits: Record<string, number> = {};
    sales.forEach((s) => {
        const v = vehicles.find((vh) => vh.id === s.vehicle_id);
        if (v) {
            brandRev[v.make] = (brandRev[v.make] || 0) + s.sale_price;
            brandUnits[v.make] = (brandUnits[v.make] || 0) + 1;
        }
    });
    const brandData = Object.entries(brandRev)
        .map(([name, revenue]) => ({ name, revenue, units: brandUnits[name] || 0 }))
        .sort((a, b) => b.revenue - a.revenue);

    // Profit by brand
    const brandProfit: Record<string, number> = {};
    sales.forEach((s) => {
        const v = vehicles.find((vh) => vh.id === s.vehicle_id);
        if (v) brandProfit[v.make] = (brandProfit[v.make] || 0) + (s.sale_price - v.purchase_price);
    });
    const profitData = Object.entries(brandProfit).map(([name, profit]) => ({
        name, profit, margin: brandRev[name] ? (profit / brandRev[name] * 100) : 0,
    })).sort((a, b) => b.profit - a.profit);

    // Commission trend
    const commData = quarters.map((q) => {
        const qSales = sales.filter((s) => {
            const d = new Date(s.sale_date);
            const sq = `Q${Math.ceil((d.getMonth() + 1) / 3)}-${d.getFullYear()}`;
            return sq === q.quarter;
        });
        const comm = qSales.reduce((s, sl) => s + sl.commission, 0);
        return { quarter: q.quarter, commission: comm, commRate: q.total_revenue > 0 ? (comm / q.total_revenue * 100) : 0 };
    });

    // Client value scatter
    const clientScatter = clients.map((c) => {
        const clientSalesCount = sales.filter((s) => s.client_id === c.id).length;
        return { name: `${c.first_name} ${c.last_name[0]}.`, ltv: c.lifetime_value, purchases: clientSalesCount, tier: c.vip_tier };
    });

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>Performance Analytics</h1>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4 }}>Deep-dive insights across all business dimensions</p>
            </div>

            {/* KPI Row (6 cards) */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 14, marginBottom: 24 }}>
                {[
                    { label: "Best Quarter", value: insights?.max_quarter || "—", sub: insights ? formatCurrency(insights.max_revenue) : "", color: "var(--status-available)" },
                    { label: "Worst Quarter", value: insights?.min_quarter || "—", sub: insights ? formatCurrency(insights.min_revenue) : "", color: "var(--danger)" },
                    { label: "Total Revenue", value: formatCurrency(totalRevenue), sub: `${totalUnits} transactions`, color: "var(--gold)" },
                    { label: "Avg Deal Size", value: formatCurrency(totalUnits > 0 ? totalRevenue / totalUnits : 0), sub: "per transaction", color: "var(--gold-light)" },
                    { label: "Profit Margin", value: `${profitMargin}%`, sub: "across all sales", color: "var(--status-available)" },
                    { label: "Commission Pool", value: formatCurrency(totalCommission), sub: `${(totalCommission / totalRevenue * 100).toFixed(1)}% of revenue`, color: "var(--platinum)" },
                ].map((k) => (
                    <div key={k.label} className="glass-card" style={{ padding: "14px 16px" }}>
                        <p style={{ fontSize: 10, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{k.label}</p>
                        <p style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Outfit', sans-serif", color: k.color }}>{k.value}</p>
                        <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>{k.sub}</p>
                    </div>
                ))}
            </div>

            {/* Row 1: Revenue + Units Dual-Axis */}
            <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
                <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 18 }}>Revenue & Units Sold — Quarterly</h2>
                <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={dualAxisData}>
                        <defs>
                            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#C9A962" stopOpacity={0.25} /><stop offset="95%" stopColor="#C9A962" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                        <XAxis dataKey="quarter" stroke="var(--text-muted)" tick={{ fill: "var(--text-secondary)", fontSize: 12 }} />
                        <YAxis yAxisId="left" stroke="var(--text-muted)" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                        <YAxis yAxisId="right" orientation="right" stroke="var(--text-muted)" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                        <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: 12, color: "var(--text-primary)" }}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            formatter={((v: any, name: any) => {
                                if (name === "revenue") return [formatCurrency(v), "Revenue"];
                                return [v, "Units Sold"];
                            }) as any}
                        />
                        <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#C9A962" strokeWidth={2.5} fill="url(#revGrad)" dot={{ fill: "#C9A962", r: 4 }} />
                        <Line yAxisId="right" type="monotone" dataKey="units" stroke="#60A5FA" strokeWidth={2} dot={{ fill: "#60A5FA", r: 4, stroke: "#0A0A0F", strokeWidth: 2 }} />
                        <Legend wrapperStyle={{ color: "var(--text-secondary)", fontSize: 11 }} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Row 2: Brand Performance + Price Distribution + Profit Margins */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 20 }}>
                {/* Brand Revenue */}
                <div className="glass-card" style={{ padding: 22 }}>
                    <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Revenue by Brand</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {brandData.map((b) => {
                            const maxR = brandData[0]?.revenue || 1;
                            return (
                                <div key={b.name}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <CarBrandIcon make={b.name} size={22} />
                                            <span style={{ fontSize: 12, fontWeight: 500 }}>{b.name}</span>
                                        </div>
                                        <span className="gold-text" style={{ fontSize: 11, fontWeight: 600 }}>{formatCurrency(b.revenue)}</span>
                                    </div>
                                    <div style={{ width: "100%", height: 5, background: "rgba(255,255,255,0.04)", borderRadius: 3, overflow: "hidden" }}>
                                        <div style={{
                                            width: `${(b.revenue / maxR) * 100}%`, height: "100%",
                                            background: BRAND_COLORS[b.name] || "#C9A962", borderRadius: 3, transition: "width 0.8s ease",
                                        }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Sale Price Distribution */}
                <div className="glass-card" style={{ padding: 22 }}>
                    <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Sale Price Distribution</h2>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={priceRanges}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis dataKey="range" tick={{ fill: "var(--text-secondary)", fontSize: 10 }} stroke="var(--text-muted)" />
                            <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 11 }} stroke="var(--text-muted)" />
                            <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: 12, color: "var(--text-primary)" }} />
                            <Bar dataKey="count" name="Sales" fill="#C9A962" radius={[4, 4, 0, 0]} barSize={30}>
                                {priceRanges.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Profit Margins by Brand */}
                <div className="glass-card" style={{ padding: 22 }}>
                    <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Profit Margins by Brand</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {profitData.map((p) => (
                            <div key={p.name}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <CarBrandIcon make={p.name} size={20} />
                                        <span style={{ fontSize: 12, fontWeight: 500 }}>{p.name}</span>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <span style={{ fontSize: 11, fontWeight: 600, color: p.profit >= 0 ? "var(--status-available)" : "var(--danger)" }}>
                                            {p.profit >= 0 ? "+" : ""}{formatCurrency(p.profit)}
                                        </span>
                                        <span style={{ fontSize: 10, color: "var(--text-muted)", marginLeft: 6 }}>({p.margin.toFixed(1)}%)</span>
                                    </div>
                                </div>
                                <div style={{ width: "100%", height: 4, background: "rgba(255,255,255,0.04)", borderRadius: 3, overflow: "hidden" }}>
                                    <div style={{
                                        width: `${Math.min(Math.max(p.margin, 0), 50) * 2}%`, height: "100%",
                                        background: p.profit >= 0 ? "var(--status-available)" : "var(--danger)", borderRadius: 3,
                                    }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Row 3: Commission Trend + Client Value Bubble */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {/* Commission Trend */}
                <div className="glass-card" style={{ padding: 24 }}>
                    <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Commission Trend</h2>
                    <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={commData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis dataKey="quarter" stroke="var(--text-muted)" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                            <YAxis stroke="var(--text-muted)" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                            <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: 12, color: "var(--text-primary)" }}
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                formatter={((v: any) => [formatCurrency(v), "Commission"]) as any} />
                            <Line type="monotone" dataKey="commission" stroke="#34D399" strokeWidth={2.5} dot={{ fill: "#34D399", r: 5, stroke: "#0A0A0F", strokeWidth: 2 }} activeDot={{ r: 7 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Client Lifetime Value Ranking */}
                <div className="glass-card" style={{ padding: 24 }}>
                    <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Client Lifetime Value — Top Buyers</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {[...clientScatter].sort((a, b) => b.ltv - a.ltv).slice(0, 6).map((c, i) => {
                            const maxLTV = clientScatter[0]?.ltv || 1;
                            const tierColor: Record<string, string> = { Black: "#F0F0F5", Platinum: "#B8C4D0", Gold: "#C9A962", Standard: "#8A8A9A" };
                            return (
                                <div key={c.name}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 700, width: 18 }}>#{i + 1}</span>
                                            <span style={{ fontSize: 13, fontWeight: 500 }}>{c.name}</span>
                                            <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, background: `${tierColor[c.tier]}15`, color: tierColor[c.tier], fontWeight: 600 }}>{c.tier}</span>
                                        </div>
                                        <span className="gold-text" style={{ fontSize: 12, fontWeight: 600 }}>{formatCurrency(c.ltv)}</span>
                                    </div>
                                    <div style={{ width: "100%", height: 4, background: "rgba(255,255,255,0.04)", borderRadius: 3, overflow: "hidden" }}>
                                        <div style={{ width: `${(c.ltv / maxLTV) * 100}%`, height: "100%", background: tierColor[c.tier] || "#C9A962", borderRadius: 3 }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
