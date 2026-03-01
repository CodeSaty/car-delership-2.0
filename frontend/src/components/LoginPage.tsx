"use client";

import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";

export default function LoginPage() {
    const { login } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await login(username.trim(), password);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Login failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--bg-primary)",
                padding: 20,
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Ambient background glows */}
            <div style={{
                position: "fixed", top: "10%", left: "30%",
                width: 700, height: 700, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(201,169,98,0.06) 0%, transparent 60%)",
                pointerEvents: "none", filter: "blur(60px)",
            }} />
            <div style={{
                position: "fixed", bottom: "10%", right: "20%",
                width: 500, height: 500, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(99,102,241,0.04) 0%, transparent 60%)",
                pointerEvents: "none", filter: "blur(60px)",
            }} />

            {/* Floating particles (decorative) */}
            <div style={{
                position: "fixed", inset: 0, pointerEvents: "none",
                background: `radial-gradient(1px 1px at 20% 30%, rgba(201,169,98,0.15), transparent),
                             radial-gradient(1px 1px at 40% 70%, rgba(201,169,98,0.1), transparent),
                             radial-gradient(1px 1px at 60% 20%, rgba(201,169,98,0.12), transparent),
                             radial-gradient(1px 1px at 80% 60%, rgba(201,169,98,0.08), transparent),
                             radial-gradient(1px 1px at 10% 80%, rgba(201,169,98,0.1), transparent),
                             radial-gradient(1px 1px at 90% 40%, rgba(201,169,98,0.08), transparent)`,
            }} />

            <div style={{ width: 460, position: "relative", zIndex: 1 }}>
                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: 44, animation: "fadeInUp 0.6s ease-out" }}>
                    <div
                        style={{
                            width: 80, height: 80,
                            margin: "0 auto 24px",
                            borderRadius: 24,
                            background: "rgba(201,169,98,0.06)",
                            border: "1px solid rgba(201,169,98,0.15)",
                            backdropFilter: "blur(16px)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            boxShadow: "0 8px 32px rgba(201,169,98,0.08)",
                        }}
                    >
                        <svg width="38" height="38" viewBox="0 0 32 20" fill="none">
                            <path d="M2 14 C2 14 4 8 8 7 L12 5 C14 4 18 4 20 5 L24 7 C28 8 30 14 30 14"
                                stroke="#C9A962" strokeWidth="2" strokeLinecap="round" fill="rgba(201,169,98,0.08)" />
                            <ellipse cx="9" cy="15" rx="3" ry="3" fill="#C9A962" opacity="0.5" />
                            <ellipse cx="23" cy="15" rx="3" ry="3" fill="#C9A962" opacity="0.5" />
                            <line x1="2" y1="14" x2="30" y2="14" stroke="#C9A962" strokeWidth="1.5" opacity="0.5" />
                        </svg>
                    </div>
                    <h1 className="gold-text"
                        style={{ fontSize: 36, fontWeight: 800, fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.02em" }}>
                        AURA DRIVE
                    </h1>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", letterSpacing: "0.25em", textTransform: "uppercase", marginTop: 8 }}>
                        Luxury Sales & Analytics Platform
                    </p>
                </div>

                {/* Login Card */}
                <div
                    style={{
                        padding: 40,
                        background: "rgba(14, 14, 22, 0.55)",
                        backdropFilter: "blur(32px)",
                        WebkitBackdropFilter: "blur(32px)",
                        border: "1px solid rgba(201, 169, 98, 0.15)",
                        borderRadius: 24,
                        position: "relative",
                        overflow: "hidden",
                        boxShadow: "0 24px 64px rgba(0, 0, 0, 0.4)",
                        animation: "fadeInUp 0.7s ease-out 0.1s both",
                    }}
                >
                    {/* Top glass edge highlight */}
                    <div style={{
                        position: "absolute", top: 0, left: 0, right: 0, height: 1,
                        background: "linear-gradient(90deg, transparent, rgba(201,169,98,0.2), transparent)",
                    }} />

                    <h2 style={{ fontSize: 22, fontWeight: 600, fontFamily: "'Outfit', sans-serif", marginBottom: 8, textAlign: "center" }}>
                        Welcome Back
                    </h2>
                    <p style={{ fontSize: 13, color: "var(--text-secondary)", textAlign: "center", marginBottom: 32 }}>
                        Enter your credentials to access the platform
                    </p>

                    {error && (
                        <div style={{
                            padding: "12px 18px", marginBottom: 22, borderRadius: 14,
                            background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)",
                            color: "#EF4444", fontSize: 13, textAlign: "center",
                            backdropFilter: "blur(4px)",
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            <div>
                                <label style={{
                                    fontSize: 11, color: "var(--text-secondary)", textTransform: "uppercase",
                                    letterSpacing: "0.1em", display: "block", marginBottom: 8, fontWeight: 600,
                                }}>
                                    Username
                                </label>
                                <input className="input-dark" type="text" required placeholder="e.g., admin"
                                    value={username} onChange={(e) => setUsername(e.target.value)}
                                    autoFocus autoComplete="username"
                                    style={{ width: "100%", padding: "14px 18px", fontSize: 14, borderRadius: 14 }} />
                            </div>
                            <div>
                                <label style={{
                                    fontSize: 11, color: "var(--text-secondary)", textTransform: "uppercase",
                                    letterSpacing: "0.1em", display: "block", marginBottom: 8, fontWeight: 600,
                                }}>
                                    Password
                                </label>
                                <input className="input-dark" type="password" required placeholder="••••••••••"
                                    value={password} onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                    style={{ width: "100%", padding: "14px 18px", fontSize: 14, borderRadius: 14 }} />
                            </div>
                        </div>

                        <button type="submit" className="btn-gold" disabled={loading}
                            style={{
                                width: "100%", padding: "14px 0", marginTop: 32,
                                fontSize: 15, fontWeight: 600, justifyContent: "center",
                                opacity: loading ? 0.6 : 1, borderRadius: 14,
                            }}>
                            {loading ? (
                                <span style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                                    <div style={{ width: 16, height: 16, border: "2px solid rgba(240,240,245,0.3)", borderTop: "2px solid #F0F0F5", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                                    Authenticating...
                                </span>
                            ) : (
                                <span style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                    Sign In
                                </span>
                            )}
                        </button>
                    </form>
                </div>

                {/* Role hint */}
                <div style={{ marginTop: 28, textAlign: "center", fontSize: 12, color: "var(--text-muted)", animation: "fadeIn 1s ease-out 0.5s both" }}>
                    <p style={{ marginBottom: 4 }}>
                        <span style={{ color: "var(--gold)" }}>Managers</span> have full platform access
                    </p>
                    <p>
                        <span style={{ color: "var(--platinum)" }}>Salesmen</span> can view data and record sales
                    </p>
                </div>
            </div>

            {/* Spin animation */}
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
