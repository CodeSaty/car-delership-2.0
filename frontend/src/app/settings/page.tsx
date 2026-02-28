"use client";

import { useEffect, useState } from "react";
import { api, HealthInfo } from "@/lib/api";

export default function SettingsPage() {
    const [health, setHealth] = useState<HealthInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await api.getHealth();
                setHealth(data);
            } catch (e) {
                console.error("Failed to load health info", e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    if (loading) {
        return (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "60vh",
                }}
            >
                <div className="gold-text" style={{ fontSize: 20, fontWeight: 600 }}>
                    Loading settings...
                </div>
            </div>
        );
    }

    return (
        <div>
            <div style={{ marginBottom: 32 }}>
                <h1
                    style={{
                        fontSize: 28,
                        fontWeight: 700,
                        fontFamily: "'Outfit', sans-serif",
                    }}
                >
                    Settings & System
                </h1>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4 }}>
                    Platform configuration and database health
                </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                {/* System Health */}
                <div className="glass-card" style={{ padding: 28 }}>
                    <h2
                        style={{
                            fontSize: 16,
                            fontWeight: 600,
                            marginBottom: 24,
                        }}
                    >
                        System Health
                    </h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "12px 0",
                                borderBottom: "1px solid var(--border-subtle)",
                            }}
                        >
                            <span style={{ color: "var(--text-secondary)" }}>Status</span>
                            <span
                                style={{
                                    color: "var(--status-available)",
                                    fontWeight: 600,
                                    textTransform: "uppercase",
                                    fontSize: 13,
                                    letterSpacing: "0.05em",
                                }}
                            >
                                ● {health?.status}
                            </span>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "12px 0",
                                borderBottom: "1px solid var(--border-subtle)",
                            }}
                        >
                            <span style={{ color: "var(--text-secondary)" }}>Database</span>
                            <span style={{ fontWeight: 500 }}>{health?.database}</span>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "12px 0",
                                borderBottom: "1px solid var(--border-subtle)",
                            }}
                        >
                            <span style={{ color: "var(--text-secondary)" }}>Database Size</span>
                            <span style={{ fontWeight: 500 }}>
                                {health
                                    ? `${(health.database_size_bytes / 1024).toFixed(1)} KB`
                                    : "—"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Record Counts */}
                <div className="glass-card" style={{ padding: 28 }}>
                    <h2
                        style={{
                            fontSize: 16,
                            fontWeight: 600,
                            marginBottom: 24,
                        }}
                    >
                        Database Statistics
                    </h2>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr 1fr",
                            gap: 16,
                        }}
                    >
                        {[
                            { label: "Vehicles", value: health?.total_vehicles, icon: "🚗" },
                            { label: "Clients", value: health?.total_clients, icon: "👤" },
                            { label: "Sales", value: health?.total_sales, icon: "💎" },
                        ].map((item) => (
                            <div
                                key={item.label}
                                style={{
                                    textAlign: "center",
                                    padding: 20,
                                    background: "var(--bg-secondary)",
                                    borderRadius: 14,
                                    border: "1px solid var(--border-subtle)",
                                }}
                            >
                                <div style={{ fontSize: 28, marginBottom: 8 }}>{item.icon}</div>
                                <p
                                    className="gold-text"
                                    style={{ fontSize: 24, fontWeight: 700 }}
                                >
                                    {item.value}
                                </p>
                                <p
                                    style={{
                                        fontSize: 12,
                                        color: "var(--text-secondary)",
                                        marginTop: 4,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.08em",
                                    }}
                                >
                                    {item.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Schema Info */}
                <div
                    className="glass-card"
                    style={{ padding: 28, gridColumn: "1 / -1" }}
                >
                    <h2
                        style={{
                            fontSize: 16,
                            fontWeight: 600,
                            marginBottom: 24,
                        }}
                    >
                        Schema Structure
                    </h2>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                        {health?.schema_tables.map((table) => (
                            <div
                                key={table}
                                style={{
                                    padding: "10px 20px",
                                    background: "var(--bg-secondary)",
                                    borderRadius: 10,
                                    border: "1px solid var(--border-subtle)",
                                    fontSize: 14,
                                    fontWeight: 500,
                                    fontFamily: "'JetBrains Mono', monospace",
                                    color: "var(--gold)",
                                }}
                            >
                                {table}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Credentials */}
                <div
                    className="glass-card"
                    style={{ padding: 28, gridColumn: "1 / -1" }}
                >
                    <h2
                        style={{
                            fontSize: 16,
                            fontWeight: 600,
                            marginBottom: 24,
                        }}
                    >
                        API Configuration
                    </h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "12px 0",
                                borderBottom: "1px solid var(--border-subtle)",
                            }}
                        >
                            <span style={{ color: "var(--text-secondary)" }}>API Base URL</span>
                            <code
                                style={{
                                    color: "var(--gold)",
                                    background: "var(--bg-secondary)",
                                    padding: "4px 12px",
                                    borderRadius: 6,
                                    fontSize: 13,
                                }}
                            >
                                http://localhost:8000
                            </code>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "12px 0",
                                borderBottom: "1px solid var(--border-subtle)",
                            }}
                        >
                            <span style={{ color: "var(--text-secondary)" }}>
                                Authentication
                            </span>
                            <span style={{ fontWeight: 500 }}>HTTP Basic Auth</span>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "12px 0",
                            }}
                        >
                            <span style={{ color: "var(--text-secondary)" }}>API Docs</span>
                            <a
                                href="http://localhost:8000/docs"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: "var(--gold)", textDecoration: "none" }}
                            >
                                http://localhost:8000/docs ↗
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
