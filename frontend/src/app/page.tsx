"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  Legend,
} from "recharts";
import { api, QuarterlyAggregate, Sale, Vehicle, Client } from "@/lib/api";
import { CarBrandIcon, CarBrandBadge } from "@/components/CarBrandIcon";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

interface EnrichedSale extends Sale {
  vehicleName?: string;
  vehicleMake?: string;
  clientName?: string;
}

const PIE_COLORS = ["#C9A962", "#E8D5A3", "#B8993A", "#96793A", "#D4B86A", "#A0884C"];
const STATUS_COLORS = { Available: "#34D399", Sold: "#C9A962", "In-Transit": "#60A5FA" };

export default function DashboardPage() {
  const [quarters, setQuarters] = useState<QuarterlyAggregate[]>([]);
  const [sales, setSales] = useState<EnrichedSale[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [q, s, v, c] = await Promise.all([
          api.getQuarterly(),
          api.getSales(),
          api.getVehicles(),
          api.getClients(),
        ]);
        setQuarters(q);
        const enriched = s.map((sale) => {
          const vehicle = v.find((vh) => vh.id === sale.vehicle_id);
          const client = c.find((cl) => cl.id === sale.client_id);
          return {
            ...sale,
            vehicleName: vehicle ? `${vehicle.make} ${vehicle.model}` : "Unknown",
            vehicleMake: vehicle?.make || "Unknown",
            clientName: client ? `${client.first_name} ${client.last_name}` : "Unknown",
          };
        });
        setSales(enriched);
        setVehicles(v);
        setClients(c);
      } catch (e) {
        console.error("Failed to load dashboard data", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // ── Computed data ──────────────────
  const currentQ = quarters.length > 0 ? quarters[quarters.length - 1] : null;
  const prevQ = quarters.length > 1 ? quarters[quarters.length - 2] : null;
  const totalRevenue = quarters.reduce((s, q) => s + q.total_revenue, 0);
  const totalCommission = sales.reduce((s, sl) => s + sl.commission, 0);
  const totalUnitsSold = sales.length;
  const avgPrice = totalUnitsSold > 0 ? totalRevenue / totalUnitsSold : 0;

  const revenueTrend = prevQ && currentQ
    ? ((currentQ.total_revenue - prevQ.total_revenue) / prevQ.total_revenue * 100).toFixed(1)
    : "0.0";

  // Revenue by brand
  const brandRevenue: Record<string, number> = {};
  sales.forEach((s) => {
    if (s.vehicleMake) brandRevenue[s.vehicleMake] = (brandRevenue[s.vehicleMake] || 0) + s.sale_price;
  });
  const brandPieData = Object.entries(brandRevenue)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Inventory status breakdown
  const statusCounts: Record<string, number> = { Available: 0, Sold: 0, "In-Transit": 0 };
  vehicles.forEach((v) => { statusCounts[v.status] = (statusCounts[v.status] || 0) + 1; });
  const statusPieData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

  // Commission per quarter
  const commissionByQ: Record<string, number> = {};
  sales.forEach((s) => {
    const d = new Date(s.sale_date);
    const q = `Q${Math.ceil((d.getMonth() + 1) / 3)}-${d.getFullYear()}`;
    commissionByQ[q] = (commissionByQ[q] || 0) + s.commission;
  });
  const commissionData = quarters.map((q) => ({
    quarter: q.quarter,
    commission: commissionByQ[q.quarter] || 0,
    revenue: q.total_revenue,
  }));

  // VIP tier distribution
  const tierCounts: Record<string, number> = { Black: 0, Platinum: 0, Gold: 0, Standard: 0 };
  clients.forEach((c) => { tierCounts[c.vip_tier] = (tierCounts[c.vip_tier] || 0) + 1; });
  const TIER_COLORS: Record<string, string> = { Black: "#F0F0F5", Platinum: "#B8C4D0", Gold: "#C9A962", Standard: "#8A8A9A" };
  const tierData = Object.entries(tierCounts)
    .map(([name, value]) => ({ name, value, fill: TIER_COLORS[name] || "#888" }));

  // Top models by revenue
  const modelRev: Record<string, { revenue: number; make: string }> = {};
  sales.forEach((s) => {
    const v = vehicles.find((vh) => vh.id === s.vehicle_id);
    if (v) {
      const key = `${v.make} ${v.model}`;
      if (!modelRev[key]) modelRev[key] = { revenue: 0, make: v.make };
      modelRev[key].revenue += s.sale_price;
    }
  });
  const topModels = Object.entries(modelRev)
    .map(([name, d]) => ({ name: name.length > 18 ? name.slice(0, 18) + "…" : name, revenue: d.revenue, make: d.make }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 6);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
        <div className="gold-text" style={{ fontSize: 20, fontWeight: 600 }}>Loading Aura Drive...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>
          Executive Dashboard
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4 }}>
          Real-time overview of your luxury dealership performance
        </p>
      </div>

      {/* ── KPI Cards (6 cards in 2 rows) ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginBottom: 28 }}>
        {[
          { label: "Total Revenue", value: formatCurrency(totalRevenue), icon: "💰", trend: `${Number(revenueTrend) >= 0 ? "+" : ""}${revenueTrend}%`, up: Number(revenueTrend) >= 0 },
          { label: "Vehicles Sold", value: totalUnitsSold.toString(), icon: "🏎️", trend: `${totalUnitsSold} all-time`, up: true },
          { label: "Avg Sale Price", value: formatCurrency(avgPrice), icon: "📊", trend: "Per vehicle", up: true },
          { label: "Total Commission", value: formatCurrency(totalCommission), icon: "💎", trend: `${(totalCommission / totalRevenue * 100).toFixed(1)}% margin`, up: true },
          { label: "Active Clients", value: clients.length.toString(), icon: "👥", trend: `${tierCounts.Black} VIP Black`, up: true },
          { label: "Fleet Size", value: vehicles.length.toString(), icon: "🏁", trend: `${statusCounts.Available} available`, up: true },
        ].map((kpi, i) => (
          <div
            key={kpi.label}
            className={`glass-card kpi-glow animate-fade-in animate-stagger-${Math.min(i + 1, 4)}`}
            style={{ padding: 22 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ fontSize: 11, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                  {kpi.label}
                </p>
                <p className="gold-text" style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>
                  {kpi.value}
                </p>
                <p style={{ fontSize: 12, color: kpi.up ? "var(--status-available)" : "var(--danger)", marginTop: 6, fontWeight: 500 }}>
                  {kpi.up ? "↑" : "↓"} {kpi.trend}
                </p>
              </div>
              <span style={{ fontSize: 28, opacity: 0.8 }}>{kpi.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Row 1: Revenue + Commission Trend ── */}
      <div className="glass-card" style={{ padding: 28, marginBottom: 20 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Revenue & Commission Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={commissionData}>
            <defs>
              <linearGradient id="goldG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C9A962" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#C9A962" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="commG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34D399" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="quarter" stroke="var(--text-muted)" tick={{ fill: "var(--text-secondary)", fontSize: 12 }} />
            <YAxis stroke="var(--text-muted)" tick={{ fill: "var(--text-secondary)", fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: 12, color: "var(--text-primary)" }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={((v: any) => [formatCurrency(v), ""]) as any}
            />
            <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#C9A962" strokeWidth={2.5} fill="url(#goldG)" dot={{ fill: "#C9A962", r: 4, strokeWidth: 2, stroke: "#0A0A0F" }} />
            <Area type="monotone" dataKey="commission" name="Commission" stroke="#34D399" strokeWidth={2} fill="url(#commG)" dot={{ fill: "#34D399", r: 3, strokeWidth: 2, stroke: "#0A0A0F" }} />
            <Legend wrapperStyle={{ color: "var(--text-secondary)", fontSize: 12 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ── Row 2: 3-panel (Brand Pie + Inventory Status + VIP Tiers) ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Brand Revenue Pie */}
        <div className="glass-card" style={{ padding: 22 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Revenue by Brand</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={brandPieData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" paddingAngle={3} strokeWidth={0}>
                {brandPieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip
                contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: 12, color: "var(--text-primary)" }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={((v: any) => [formatCurrency(v), "Revenue"]) as any}
              />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8, justifyContent: "center" }}>
            {brandPieData.slice(0, 4).map((b, i) => (
              <span key={b.name} style={{ fontSize: 10, color: PIE_COLORS[i], display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: PIE_COLORS[i], display: "inline-block" }} />
                {b.name}
              </span>
            ))}
          </div>
        </div>

        {/* Inventory Status Donut */}
        <div className="glass-card" style={{ padding: 22 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Inventory Status</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={statusPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={4} strokeWidth={0}>
                {statusPieData.map((entry) => (
                  <Cell key={entry.name} fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS] || "#888"} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: 12, color: "var(--text-primary)" }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", justifyContent: "center", gap: 14, marginTop: 8 }}>
            {statusPieData.map((s) => (
              <span key={s.name} style={{ fontSize: 11, display: "flex", alignItems: "center", gap: 5, color: STATUS_COLORS[s.name as keyof typeof STATUS_COLORS] }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "currentColor", display: "inline-block" }} />
                {s.name} ({s.value})
              </span>
            ))}
          </div>
        </div>

        {/* VIP Tier Distribution */}
        <div className="glass-card" style={{ padding: 22 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Client VIP Tiers</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: "10px 0" }}>
            {tierData.map((t) => (
              <div key={t.name}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: t.fill }}>{t.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: t.fill }}>{t.value}</span>
                </div>
                <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.04)", borderRadius: 3, overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${clients.length > 0 ? (t.value / clients.length) * 100 : 0}%`,
                      height: "100%",
                      background: t.fill,
                      borderRadius: 3,
                      transition: "width 0.8s ease",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Row 3: Recent Sales (with car icons) + Top Models ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 20 }}>
        {/* Recent Sales */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600 }}>Recent Sales</h2>
            <a href="/sales" style={{ fontSize: 12, color: "var(--gold)", textDecoration: "none" }}>View All →</a>
          </div>
          <table className="premium-table">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Client</th>
                <th>Date</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {sales.slice(-6).reverse().map((sale) => (
                <tr key={sale.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <CarBrandIcon make={sale.vehicleMake || ""} size={30} />
                      <span style={{ fontWeight: 500, fontSize: 13 }}>{sale.vehicleName}</span>
                    </div>
                  </td>
                  <td style={{ color: "var(--text-secondary)", fontSize: 13 }}>{sale.clientName}</td>
                  <td style={{ color: "var(--text-secondary)", fontSize: 12 }}>
                    {new Date(sale.sale_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" })}
                  </td>
                  <td className="gold-text" style={{ fontWeight: 600, fontSize: 13 }}>
                    {formatCurrency(sale.sale_price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Performing Models — horizontal bars */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Top Models by Revenue</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {topModels.map((m, i) => {
              const maxRev = topModels[0]?.revenue || 1;
              return (
                <div key={m.name}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <CarBrandIcon make={m.make} size={24} />
                      <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-primary)" }}>{m.name}</span>
                    </div>
                    <span className="gold-text" style={{ fontSize: 12, fontWeight: 600 }}>{formatCurrency(m.revenue)}</span>
                  </div>
                  <div style={{ width: "100%", height: 5, background: "rgba(255,255,255,0.04)", borderRadius: 3, overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${(m.revenue / maxRev) * 100}%`,
                        height: "100%",
                        background: `linear-gradient(90deg, #B8993A, #E8D5A3)`,
                        borderRadius: 3,
                        transition: "width 1s ease",
                      }}
                    />
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
