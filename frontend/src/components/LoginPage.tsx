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
            }}
        >
            {/* Ambient glow */}
            <div
                style={{
                    position: "fixed",
                    top: "20%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 600,
                    height: 600,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(201,169,98,0.06) 0%, transparent 70%)",
                    pointerEvents: "none",
                }}
            />

            <div
                style={{
                    width: 440,
                    position: "relative",
                    zIndex: 1,
                }}
            >
                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: 40 }}>
                    <div
                        style={{
                            width: 72,
                            height: 72,
                            margin: "0 auto 20px",
                            borderRadius: 20,
                            background: "linear-gradient(135deg, rgba(201,169,98,0.12), rgba(201,169,98,0.03))",
                            border: "1px solid rgba(201,169,98,0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <svg width="36" height="36" viewBox="0 0 32 20" fill="none">
                            <path
                                d="M2 14 C2 14 4 8 8 7 L12 5 C14 4 18 4 20 5 L24 7 C28 8 30 14 30 14"
                                stroke="#C9A962"
                                strokeWidth="2"
                                strokeLinecap="round"
                                fill="rgba(201,169,98,0.1)"
                            />
                            <ellipse cx="9" cy="15" rx="3" ry="3" fill="#C9A962" opacity="0.5" />
                            <ellipse cx="23" cy="15" rx="3" ry="3" fill="#C9A962" opacity="0.5" />
                            <line x1="2" y1="14" x2="30" y2="14" stroke="#C9A962" strokeWidth="1.5" opacity="0.6" />
                        </svg>
                    </div>
                    <h1
                        className="gold-text"
                        style={{
                            fontSize: 32,
                            fontWeight: 800,
                            fontFamily: "'Outfit', sans-serif",
                            letterSpacing: "-0.02em",
                        }}
                    >
                        AURA DRIVE
                    </h1>
                    <p
                        style={{
                            fontSize: 12,
                            color: "var(--text-muted)",
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            marginTop: 6,
                        }}
                    >
                        Luxury Sales & Analytics Platform
                    </p>
                </div>

                {/* Login Card */}
                <div
                    className="glass-card"
                    style={{
                        padding: 36,
                        border: "1px solid var(--border-accent)",
                    }}
                >
                    <h2
                        style={{
                            fontSize: 20,
                            fontWeight: 600,
                            fontFamily: "'Outfit', sans-serif",
                            marginBottom: 8,
                            textAlign: "center",
                        }}
                    >
                        Sign In
                    </h2>
                    <p
                        style={{
                            fontSize: 13,
                            color: "var(--text-secondary)",
                            textAlign: "center",
                            marginBottom: 28,
                        }}
                    >
                        Enter your credentials to access the platform
                    </p>

                    {error && (
                        <div
                            style={{
                                padding: "12px 16px",
                                marginBottom: 20,
                                borderRadius: 10,
                                background: "rgba(239,68,68,0.1)",
                                border: "1px solid rgba(239,68,68,0.25)",
                                color: "#EF4444",
                                fontSize: 13,
                                textAlign: "center",
                            }}
                        >
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                            <div>
                                <label
                                    style={{
                                        fontSize: 12,
                                        color: "var(--text-secondary)",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.08em",
                                        display: "block",
                                        marginBottom: 8,
                                        fontWeight: 500,
                                    }}
                                >
                                    Username
                                </label>
                                <input
                                    className="input-dark"
                                    type="text"
                                    required
                                    placeholder="e.g., admin"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    autoFocus
                                    autoComplete="username"
                                    style={{ width: "100%", padding: "14px 16px", fontSize: 14 }}
                                />
                            </div>
                            <div>
                                <label
                                    style={{
                                        fontSize: 12,
                                        color: "var(--text-secondary)",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.08em",
                                        display: "block",
                                        marginBottom: 8,
                                        fontWeight: 500,
                                    }}
                                >
                                    Password
                                </label>
                                <input
                                    className="input-dark"
                                    type="password"
                                    required
                                    placeholder="••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                    style={{ width: "100%", padding: "14px 16px", fontSize: 14 }}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-gold"
                            disabled={loading}
                            style={{
                                width: "100%",
                                padding: "14px 0",
                                marginTop: 28,
                                fontSize: 14,
                                fontWeight: 600,
                                opacity: loading ? 0.6 : 1,
                                justifyContent: "center",
                            }}
                        >
                            {loading ? (
                                <span>Authenticating...</span>
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
                <div
                    style={{
                        marginTop: 24,
                        textAlign: "center",
                        fontSize: 12,
                        color: "var(--text-muted)",
                    }}
                >
                    <p style={{ marginBottom: 4 }}>
                        <span style={{ color: "var(--gold)" }}>Managers</span> have full platform access
                    </p>
                    <p>
                        <span style={{ color: "var(--platinum)" }}>Salesmen</span> can view data and record sales
                    </p>
                </div>
            </div>
        </div>
    );
}
