"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { api, Vehicle } from "@/lib/api";
import { getCarSpecs, CarSpecs } from "@/lib/carSpecs";
import { CarBrandIcon } from "@/components/CarBrandIcon";

/* ─── Performance Bar ──────────────────────────────── */
function PerfBar({ label, value, max, unit, color }: { label: string; value: number; max: number; unit: string; color: string }) {
    const pct = Math.min((value / max) * 100, 100);
    return (
        <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color }}>{value} {unit}</span>
            </div>
            <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.06)" }}>
                <div style={{ height: "100%", borderRadius: 3, width: `${pct}%`, background: `linear-gradient(90deg, ${color}88, ${color})`, transition: "width 1.5s ease" }} />
            </div>
        </div>
    );
}

/* ─── Spec Row ─────────────────────────────────────── */
function SpecRow({ label, value }: { label: string; value: string }) {
    return (
        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{label}</span>
            <span style={{ fontSize: 13, color: "var(--text-primary)", fontWeight: 500, textAlign: "right", maxWidth: "60%" }}>{value}</span>
        </div>
    );
}

/* ─── Spec Card ────────────────────────────────────── */
function SpecCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
    return (
        <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ color: "var(--gold)" }}>{icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 600, fontFamily: "'Outfit', sans-serif" }}>{title}</h3>
            </div>
            {children}
        </div>
    );
}

/* ─── Feature Badge ────────────────────────────────── */
function FeatureBadge({ text }: { text: string }) {
    return (
        <span style={{
            display: "inline-block", padding: "6px 14px", borderRadius: 20,
            background: "rgba(201,169,98,0.08)", border: "1px solid rgba(201,169,98,0.15)",
            fontSize: 12, color: "var(--gold)", marginRight: 8, marginBottom: 8,
        }}>
            {text}
        </span>
    );
}

/* ─── Sketchfab 3D Viewer (Real Models with Animations) ─── */
const SKETCHFAB_MODEL_MAP: Record<string, { uid: string; animated: boolean }> = {
    // Porsche (NLM-Group animated models with openable doors & hood)
    "porsche_911 turbo s": { uid: "2c3760d955e44cbfa1115564c9191b5d", animated: true },
    "porsche_cayenne turbo gt": { uid: "de1ffd344c41481892511f7fd332c136", animated: false },
    "porsche_taycan turbo s": { uid: "3657f54c69c242f09fae93104bb20120", animated: false },
    // Ferrari
    "ferrari_f8 tributo": { uid: "8a86c4d634f64f8b8ee836bc93fa6ac8", animated: false },
    "ferrari_roma spider": { uid: "e57f64cb32c54f7e8851ec23875bdff6", animated: false },
    "ferrari_roma": { uid: "cbc0c13c0fb54fc8bbfa79a9ff99e3aa", animated: false },
    "ferrari_296 gtb": { uid: "17f50b26310847b1a1e701edc0598ba4", animated: false },
    // Lamborghini
    "lamborghini_huracán evo": { uid: "ac4bfe9c5e8d42fda5691f78e8931b95", animated: false },
    "lamborghini_urus performante": { uid: "914bbca2f7f54783a00062a695bae0ea", animated: false },
    "lamborghini_revuelto": { uid: "4258ff5b559c45f2a470344f0e04c8cd", animated: false },
    // Aston Martin
    "aston martin_db12": { uid: "18e282919eb9474ebf0644348d66329b", animated: false },
    "aston martin_vantage v12": { uid: "cdef8d1f68084797a717f8942a901497", animated: false },
    // McLaren
    "mclaren_750s": { uid: "c863bfed41894b39bce6e3f7f1b7bc91", animated: false },
    "mclaren_artura": { uid: "d393abd807f04d62b96b1bd82119b5d4", animated: false },
    // Bentley
    "bentley_continental gt speed": { uid: "950dfe70cd5b4f9ab4c1c13a2693d2a5", animated: false },
    "bentley_flying spur": { uid: "d2161a5b0dfd478abdce11cda5d564d4", animated: false },
    // BMW
    "bmw_m5": { uid: "f28407cda1044fd28d82855be8af3e75", animated: false },
};

/* ─── Interactive Control Button ──────────────────── */
function ViewerButton({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            style={{
                display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
                borderRadius: 10, border: active ? "1px solid var(--gold)" : "1px solid rgba(255,255,255,0.1)",
                background: active ? "rgba(201,169,98,0.15)" : "rgba(0,0,0,0.5)",
                backdropFilter: "blur(10px)", color: active ? "var(--gold)" : "rgba(255,255,255,0.7)",
                cursor: "pointer", fontSize: 11, fontWeight: 500, transition: "all 0.2s",
                letterSpacing: "0.02em",
            }}
            onMouseOver={(e) => { if (!active) e.currentTarget.style.borderColor = "rgba(201,169,98,0.4)"; }}
            onMouseOut={(e) => { if (!active) e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
        >
            {icon}
            {label}
        </button>
    );
}

function Interactive3DViewer({ make, model }: { make: string; model: string }) {
    const [modelId, setModelId] = useState<string | null>(null);
    const [isAnimated, setIsAnimated] = useState(false);
    const [status, setStatus] = useState<"loading" | "loaded" | "searching">("loading");
    const [animPlaying, setAnimPlaying] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        const key = `${make}_${model}`.toLowerCase();
        const mapped = SKETCHFAB_MODEL_MAP[key];
        if (mapped) {
            setModelId(mapped.uid);
            setIsAnimated(mapped.animated);
            setStatus("loaded");
            return;
        }

        // Fallback: search Sketchfab API, prefer animated models
        setStatus("searching");
        const q = encodeURIComponent(`${make} ${model}`);
        fetch(`https://api.sketchfab.com/v3/search?type=models&q=${q}&sort_by=-likeCount&count=5`)
            .then(r => r.json())
            .then(data => {
                if (data.results?.length > 0) {
                    // Prefer animated model if available
                    const animated = data.results.find((m: { animationCount: number }) => m.animationCount > 0);
                    const best = animated || data.results[0];
                    setModelId(best.uid);
                    setIsAnimated(best.animationCount > 0);
                    setStatus("loaded");
                } else {
                    setStatus("loading");
                }
            })
            .catch(() => setStatus("loading"));
    }, [make, model]);

    const toggleAnimation = () => {
        setAnimPlaying(!animPlaying);
        // Reload iframe with animation toggled
        if (iframeRef.current && modelId) {
            const base = `https://sketchfab.com/models/${modelId}/embed?autostart=1&transparent=1&ui_theme=dark&ui_infos=0&ui_watermark=0&ui_watermark_link=0&ui_stop=0&ui_color=C9A962&ui_hint=0&ui_controls=1&ui_annotations=0`;
            iframeRef.current.src = animPlaying
                ? base
                : `${base}&animation_autoplay=1`;
        }
    };

    if (status === "loaded" && modelId) {
        const embedParams = [
            "autostart=1", "transparent=1", "ui_theme=dark",
            "ui_infos=0", "ui_watermark=0", "ui_watermark_link=0",
            "ui_stop=0", "ui_color=C9A962", "ui_hint=0",
            "ui_controls=1", "ui_annotations=0",
            animPlaying ? "animation_autoplay=1" : "",
        ].filter(Boolean).join("&");

        return (
            <div style={{
                position: "relative", width: "100%", overflow: "hidden",
            }}>
                <div style={{ position: "relative", paddingBottom: "60%", height: 0 }}>
                    <iframe
                        ref={iframeRef}
                        title={`${make} ${model} 3D Model`}
                        src={`https://sketchfab.com/models/${modelId}/embed?${embedParams}`}
                        style={{
                            position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none",
                        }}
                        allow="autoplay; fullscreen; xr-spatial-tracking"
                        allowFullScreen
                    />
                </div>

                {/* Interactive controls overlay */}
                <div style={{
                    position: "absolute", top: 12, right: 16, display: "flex", gap: 8, flexWrap: "wrap",
                    zIndex: 10,
                }}>
                    {isAnimated && (
                        <ViewerButton
                            active={animPlaying}
                            onClick={toggleAnimation}
                            icon={animPlaying ? (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                            ) : (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                            )}
                            label={animPlaying ? "Stop Animation" : "▶ Open Doors & Hood"}
                        />
                    )}
                    <ViewerButton
                        onClick={() => {
                            if (iframeRef.current) {
                                iframeRef.current.requestFullscreen?.();
                            }
                        }}
                        icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" /></svg>}
                        label="Fullscreen"
                    />
                </div>

                {/* Interaction hints */}
                <div style={{
                    position: "absolute", bottom: 8, right: 16, padding: "4px 12px",
                    borderRadius: 8, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)",
                }}>
                    <p style={{ fontSize: 10, color: "rgba(201,169,98,0.6)", margin: 0, letterSpacing: "0.04em" }}>
                        Drag to rotate · Scroll to zoom · Double-click to focus
                    </p>
                </div>

                {/* Animated model indicator */}
                {isAnimated && (
                    <div style={{
                        position: "absolute", top: 12, left: 16, padding: "6px 12px",
                        borderRadius: 8, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)",
                        border: "1px solid rgba(201,169,98,0.2)",
                        display: "flex", alignItems: "center", gap: 6,
                    }}>
                        <div style={{
                            width: 6, height: 6, borderRadius: "50%",
                            background: "#22C55E",
                            boxShadow: "0 0 6px rgba(34,197,94,0.6)",
                            animation: "pulse 2s ease-in-out infinite",
                        }} />
                        <span style={{ fontSize: 10, color: "var(--gold)", letterSpacing: "0.04em" }}>
                            INTERACTIVE · Doors & Hood Open
                        </span>
                    </div>
                )}
            </div>
        );
    }

    // Loading / Searching state
    return (
        <div style={{
            position: "relative", width: "100%", paddingBottom: "60%",
            overflow: "hidden",
        }}>
            <div style={{
                position: "absolute", inset: 0, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: 20,
            }}>
                <div style={{ width: 120, height: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <CarBrandIcon make={make} size={100} />
                </div>
                <div style={{ textAlign: "center" }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6, fontFamily: "'Outfit', sans-serif" }}>
                        {status === "searching" ? "Finding 3D Model..." : "Loading 3D Viewer..."}
                    </h3>
                    <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
                        {make} {model}
                    </p>
                </div>
                {/* Spinner */}
                <div style={{
                    width: 32, height: 32, border: "3px solid rgba(201,169,98,0.15)",
                    borderTop: "3px solid var(--gold)", borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        </div>
    );
}


/* ═══════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════ */
export default function VehicleDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [vehicle, setVehicle] = useState<Vehicle | null>(null);
    const [specs, setSpecs] = useState<CarSpecs | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"overview" | "engine" | "performance" | "dimensions" | "features">("overview");

    useEffect(() => {
        const id = Number(params.id);
        if (isNaN(id)) { setLoading(false); return; }

        api.getVehicles().then((vehicles) => {
            const v = vehicles.find((v) => v.id === id);
            if (v) {
                setVehicle(v);
                const s = getCarSpecs(v.make, v.model);
                setSpecs(s);
            }
        }).catch(console.error).finally(() => setLoading(false));
    }, [params.id]);

    if (loading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
                <div className="gold-text" style={{ fontSize: 18 }}>Loading vehicle data...</div>
            </div>
        );
    }

    if (!vehicle) {
        return (
            <div style={{ textAlign: "center", paddingTop: 100 }}>
                <h2 style={{ fontSize: 24, marginBottom: 12 }}>Vehicle Not Found</h2>
                <button className="btn-gold" onClick={() => router.push("/inventory")}>← Back to Inventory</button>
            </div>
        );
    }

    const brandColors: Record<string, string> = {
        Porsche: "#C9A962", Ferrari: "#DC2626", Lamborghini: "#FACC15",
        "Aston Martin": "#006847", McLaren: "#FF6B00", Bentley: "#333333", BMW: "#1B62B5",
    };
    const accent = brandColors[vehicle.make] || "var(--gold)";

    // Extract numeric values for performance bars
    const hpNum = specs ? parseInt(specs.engine.horsepower) : 0;
    const tqNum = specs ? parseInt(specs.engine.torque) : 0;
    const topSpd = specs ? parseInt(specs.performance.topSpeed) : 0;
    const accel = specs ? parseFloat(specs.performance.acceleration060) : 0;

    const tabs = [
        { key: "overview", label: "Overview" },
        { key: "engine", label: "Engine & Drivetrain" },
        { key: "performance", label: "Performance" },
        { key: "dimensions", label: "Dimensions" },
        { key: "features", label: "Features & Safety" },
    ] as const;

    return (
        <div style={{ maxWidth: 1300, margin: "0 auto" }}>
            {/* ── Back Button ────────────────────────────── */}
            <button
                onClick={() => router.push("/inventory")}
                style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "8px 16px",
                    borderRadius: 10, border: "1px solid var(--border-subtle)",
                    background: "rgba(255,255,255,0.03)", color: "var(--text-secondary)",
                    cursor: "pointer", fontSize: 13, marginBottom: 24, transition: "all 0.2s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.borderColor = accent)}
                onMouseOut={(e) => (e.currentTarget.style.borderColor = "var(--border-subtle)")}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                Back to Inventory
            </button>

            {/* ── Hero Section: Full-width 3D Model ──────── */}
            <div style={{ position: "relative", marginBottom: 32, marginLeft: -24, marginRight: -24 }}>
                {/* 3D Viewer — full bleed, no border */}
                <Interactive3DViewer make={vehicle.make} model={vehicle.model} />

                {/* Overlaid car info bar at bottom of 3D viewer */}
                <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    background: "linear-gradient(to top, rgba(10,10,14,0.95) 0%, rgba(10,10,14,0.7) 60%, transparent 100%)",
                    padding: "60px 40px 24px",
                }}>
                    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
                        {/* Left: Title */}
                        <div>
                            <div style={{
                                display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 12px",
                                borderRadius: 16, background: `${accent}15`, border: `1px solid ${accent}30`,
                                marginBottom: 10, width: "fit-content",
                            }}>
                                <CarBrandIcon make={vehicle.make} size={16} />
                                <span style={{ fontSize: 11, color: accent, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                    {vehicle.make}
                                </span>
                            </div>
                            <h1 style={{
                                fontSize: 40, fontWeight: 800, fontFamily: "'Outfit', sans-serif",
                                lineHeight: 1.05, marginBottom: 4,
                            }}>
                                {vehicle.model}
                            </h1>
                            <p style={{ fontSize: 14, color: "var(--text-muted)" }}>
                                {vehicle.year} · VIN: {vehicle.vin}
                            </p>
                        </div>

                        {/* Right: Quick stat pills */}
                        {specs && (
                            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                                {[
                                    { val: hpNum, label: "HP", color: accent },
                                    { val: `${accel}s`, label: "0-60", color: accent },
                                    { val: topSpd, label: "MPH", color: accent },
                                    { val: `$${(vehicle.purchase_price / 1000).toFixed(0)}K`, label: "MSRP", color: accent },
                                ].map((s, i) => (
                                    <div key={i} style={{
                                        padding: "10px 18px", borderRadius: 12,
                                        background: "rgba(255,255,255,0.04)", backdropFilter: "blur(10px)",
                                        border: "1px solid rgba(255,255,255,0.06)", textAlign: "center", minWidth: 80,
                                    }}>
                                        <p style={{ fontSize: 22, fontWeight: 800, color: s.color, fontFamily: "'Outfit', sans-serif", margin: 0 }}>
                                            {s.val}
                                        </p>
                                        <p style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0, marginTop: 2 }}>{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Status tags */}
                    <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{
                            padding: "4px 12px", borderRadius: 16, fontSize: 11, fontWeight: 600,
                            background: vehicle.status === "Available" ? "rgba(34,197,94,0.1)" : vehicle.status === "Sold" ? "rgba(239,68,68,0.1)" : "rgba(234,179,8,0.1)",
                            color: vehicle.status === "Available" ? "#22C55E" : vehicle.status === "Sold" ? "#EF4444" : "#EAB308",
                            border: `1px solid ${vehicle.status === "Available" ? "rgba(34,197,94,0.2)" : vehicle.status === "Sold" ? "rgba(239,68,68,0.2)" : "rgba(234,179,8,0.2)"}`,
                        }}>
                            {vehicle.status}
                        </span>
                        {specs && (
                            <>
                                <span style={{ padding: "4px 12px", borderRadius: 16, fontSize: 11, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "var(--text-muted)" }}>
                                    {specs.bodyType}
                                </span>
                                <span style={{ padding: "4px 12px", borderRadius: 16, fontSize: 11, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "var(--text-muted)" }}>
                                    {specs.drivetrain}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Description ────────────────────────────── */}
            {specs && (
                <div className="glass-card" style={{ padding: 28, marginBottom: 32 }}>
                    <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--text-secondary)" }}>
                        {specs.description}
                    </p>
                </div>
            )}

            {/* ── Tab Navigation ─────────────────────────── */}
            {specs && (
                <>
                    <div style={{
                        display: "flex", gap: 4, marginBottom: 32, padding: 4,
                        borderRadius: 14, background: "rgba(255,255,255,0.03)",
                        border: "1px solid var(--border-subtle)",
                    }}>
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                style={{
                                    flex: 1, padding: "12px 0", borderRadius: 10, border: "none",
                                    background: activeTab === tab.key ? `${accent}18` : "transparent",
                                    color: activeTab === tab.key ? accent : "var(--text-secondary)",
                                    fontWeight: activeTab === tab.key ? 600 : 400,
                                    fontSize: 13, cursor: "pointer", transition: "all 0.2s",
                                    borderBottom: activeTab === tab.key ? `2px solid ${accent}` : "2px solid transparent",
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* ── Tab Content ──────────────────────────── */}
                    {activeTab === "overview" && (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                            <SpecCard title="General Information" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>}>
                                <SpecRow label="Make" value={vehicle.make} />
                                <SpecRow label="Model" value={vehicle.model} />
                                <SpecRow label="Year" value={String(vehicle.year)} />
                                <SpecRow label="Body Type" value={specs.bodyType} />
                                <SpecRow label="Doors" value={String(specs.doors)} />
                                <SpecRow label="Seats" value={String(specs.seatingCapacity)} />
                                <SpecRow label="Generation" value={specs.generation} />
                                <SpecRow label="Origin" value={specs.countryOfOrigin} />
                                <SpecRow label="Drivetrain" value={specs.drivetrain} />
                                <SpecRow label="MSRP" value={`$${vehicle.purchase_price.toLocaleString()}`} />
                            </SpecCard>

                            <SpecCard title="Performance Overview" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>}>
                                <PerfBar label="Horsepower" value={hpNum} max={1100} unit="hp" color={accent} />
                                <PerfBar label="Torque" value={tqNum} max={900} unit="lb-ft" color="#22C55E" />
                                <PerfBar label="Top Speed" value={topSpd} max={250} unit="mph" color="#3B82F6" />
                                <PerfBar label="0-60 MPH (lower is better)" value={accel} max={5} unit="sec" color="#EAB308" />
                                <div style={{ marginTop: 12 }}>
                                    <SpecRow label="Quarter Mile" value={specs.performance.quarterMile} />
                                    <SpecRow label="Braking 60-0" value={specs.performance.brakingDistance} />
                                    <SpecRow label="Lateral G" value={specs.performance.lateralG} />
                                </div>
                            </SpecCard>
                        </div>
                    )}

                    {activeTab === "engine" && (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                            <SpecCard title="Engine" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2" /><line x1="6" y1="6" x2="6" y2="2" /><line x1="10" y1="6" x2="10" y2="2" /><line x1="14" y1="6" x2="14" y2="2" /><line x1="18" y1="6" x2="18" y2="2" /></svg>}>
                                <SpecRow label="Type" value={specs.engine.type} />
                                <SpecRow label="Displacement" value={specs.engine.displacement} />
                                <SpecRow label="Configuration" value={specs.engine.configuration} />
                                <SpecRow label="Power" value={specs.engine.horsepower} />
                                <SpecRow label="Torque" value={specs.engine.torque} />
                                <SpecRow label="Fuel System" value={specs.engine.fuelSystem} />
                                <SpecRow label="Aspiration" value={specs.engine.aspiration} />
                                <SpecRow label="Valvetrain" value={specs.engine.valvetrain} />
                                <SpecRow label="Redline" value={specs.engine.redline} />
                            </SpecCard>

                            <SpecCard title="Transmission" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M12 3v6M12 15v6M3 12h6M15 12h6" /></svg>}>
                                <SpecRow label="Type" value={specs.transmission.type} />
                                <SpecRow label="Gears" value={String(specs.transmission.gears)} />
                                <SpecRow label="Drive Type" value={specs.transmission.driveType} />
                                <div style={{ marginTop: 20 }}>
                                    <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, fontFamily: "'Outfit', sans-serif" }}>Fuel Economy</h4>
                                    <SpecRow label="Fuel Type" value={specs.fuel.fuelType} />
                                    <SpecRow label="City" value={specs.fuel.cityMPG} />
                                    <SpecRow label="Highway" value={specs.fuel.highwayMPG} />
                                    <SpecRow label="Combined" value={specs.fuel.combinedMPG} />
                                </div>
                            </SpecCard>
                        </div>
                    )}

                    {activeTab === "performance" && (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                            <SpecCard title="Acceleration & Speed" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 0 1 10 10c0 3.5-1.2 5.7-2 7H4c-.8-1.3-2-3.5-2-7A10 10 0 0 1 12 2z" /><path d="M12 12l3.5-6" /></svg>}>
                                <SpecRow label="0-60 MPH" value={specs.performance.acceleration060} />
                                <SpecRow label="0-100 MPH" value={specs.performance.acceleration0100} />
                                <SpecRow label="Quarter Mile" value={specs.performance.quarterMile} />
                                <SpecRow label="Top Speed" value={specs.performance.topSpeed} />
                            </SpecCard>

                            <SpecCard title="Braking & Handling" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M8 12h8M12 8v8" /></svg>}>
                                <SpecRow label="60-0 Braking" value={specs.performance.brakingDistance} />
                                <SpecRow label="Lateral G" value={specs.performance.lateralG} />
                                <div style={{ marginTop: 16 }}>
                                    <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, fontFamily: "'Outfit', sans-serif" }}>Wheels & Brakes</h4>
                                    <SpecRow label="Front Tires" value={specs.wheels.frontTires} />
                                    <SpecRow label="Rear Tires" value={specs.wheels.rearTires} />
                                    <SpecRow label="Front Brakes" value={specs.wheels.frontBrakes} />
                                    <SpecRow label="Rear Brakes" value={specs.wheels.rearBrakes} />
                                </div>
                            </SpecCard>
                        </div>
                    )}

                    {activeTab === "dimensions" && (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                            <SpecCard title="Exterior Dimensions" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="9" y1="3" x2="9" y2="21" /><line x1="3" y1="9" x2="21" y2="9" /></svg>}>
                                <SpecRow label="Length" value={specs.dimensions.length} />
                                <SpecRow label="Width" value={specs.dimensions.width} />
                                <SpecRow label="Height" value={specs.dimensions.height} />
                                <SpecRow label="Wheelbase" value={specs.dimensions.wheelbase} />
                            </SpecCard>

                            <SpecCard title="Weight & Capacity" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.91 11.12a1 1 0 0 0-.63-.63 6 6 0 1 0-8.95 0" /><circle cx="12" cy="12" r="10" /></svg>}>
                                <SpecRow label="Curb Weight" value={specs.dimensions.curbWeight} />
                                <SpecRow label="Fuel Capacity" value={specs.dimensions.fuelCapacity} />
                                <SpecRow label="Cargo Volume" value={specs.dimensions.cargoVolume} />
                                <SpecRow label="Power-to-Weight" value={`${(hpNum / (parseInt(specs.dimensions.curbWeight.replace(/,/g, "")) / 1000)).toFixed(1)} hp/ton`} />
                            </SpecCard>
                        </div>
                    )}

                    {activeTab === "features" && (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                            <SpecCard title="Key Features" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>}>
                                <div style={{ display: "flex", flexWrap: "wrap" }}>
                                    {specs.features.map((f, i) => <FeatureBadge key={i} text={f} />)}
                                </div>
                            </SpecCard>

                            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                                <SpecCard title="Safety Systems" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>}>
                                    <div style={{ display: "flex", flexWrap: "wrap" }}>
                                        {specs.safety.map((s, i) => <FeatureBadge key={i} text={s} />)}
                                    </div>
                                </SpecCard>

                                <SpecCard title="Interior" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 3h-2l-2 4h-4L6 3H4" /></svg>}>
                                    <div style={{ display: "flex", flexWrap: "wrap" }}>
                                        {specs.interior.map((item, i) => <FeatureBadge key={i} text={item} />)}
                                    </div>
                                </SpecCard>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* ── No Specs Fallback ─────────────────────── */}
            {!specs && (
                <div className="glass-card" style={{ padding: 40, textAlign: "center" }}>
                    <h3 style={{ fontSize: 20, marginBottom: 12, fontFamily: "'Outfit', sans-serif" }}>
                        Vehicle Information
                    </h3>
                    <p style={{ color: "var(--text-secondary)", marginBottom: 20 }}>
                        Detailed specifications for this vehicle are not yet available in our database.
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, maxWidth: 500, margin: "0 auto" }}>
                        <div>
                            <p style={{ fontSize: 24, fontWeight: 700, color: accent }}>{vehicle.make}</p>
                            <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Make</p>
                        </div>
                        <div>
                            <p style={{ fontSize: 24, fontWeight: 700, color: accent }}>{vehicle.model}</p>
                            <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Model</p>
                        </div>
                        <div>
                            <p style={{ fontSize: 24, fontWeight: 700, color: accent }}>{vehicle.year}</p>
                            <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Year</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
