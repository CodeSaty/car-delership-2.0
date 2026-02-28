/**
 * Luxury car brand icons — premium SVG silhouettes with brand-specific colors.
 * Displayed as tiny badge/thumbnails next to vehicle names.
 */

const brandConfig: Record<string, { color: string; accent: string; abbr: string }> = {
    Porsche: { color: "#C9A962", accent: "rgba(201,169,98,0.15)", abbr: "P" },
    Ferrari: { color: "#DC2626", accent: "rgba(220,38,38,0.15)", abbr: "F" },
    Lamborghini: { color: "#FACC15", accent: "rgba(250,204,21,0.12)", abbr: "L" },
    "Aston Martin": { color: "#10B981", accent: "rgba(16,185,129,0.12)", abbr: "AM" },
    McLaren: { color: "#F97316", accent: "rgba(249,115,22,0.15)", abbr: "Mc" },
    Bentley: { color: "#818CF8", accent: "rgba(129,140,248,0.12)", abbr: "B" },
    "Rolls-Royce": { color: "#A78BFA", accent: "rgba(167,139,250,0.12)", abbr: "RR" },
    BMW: { color: "#60A5FA", accent: "rgba(96,165,250,0.12)", abbr: "BMW" },
    Mercedes: { color: "#94A3B8", accent: "rgba(148,163,184,0.12)", abbr: "MB" },
};

export function CarBrandIcon({ make, size = 36 }: { make: string; size?: number }) {
    const cfg = brandConfig[make] || { color: "#B8C4D0", accent: "rgba(184,196,208,0.1)", abbr: make.slice(0, 2) };

    return (
        <div
            style={{
                width: size,
                height: size,
                borderRadius: size * 0.28,
                background: `linear-gradient(135deg, ${cfg.accent}, transparent)`,
                border: `1px solid ${cfg.color}33`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
            }}
        >
            {/* Car silhouette SVG */}
            <svg
                width={size * 0.6}
                height={size * 0.4}
                viewBox="0 0 32 20"
                fill="none"
            >
                <path
                    d="M2 14 C2 14 4 8 8 7 L12 5 C14 4 18 4 20 5 L24 7 C28 8 30 14 30 14"
                    stroke={cfg.color}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    fill={`${cfg.color}15`}
                />
                <ellipse cx="9" cy="15" rx="3" ry="3" fill={cfg.color} opacity="0.4" />
                <ellipse cx="23" cy="15" rx="3" ry="3" fill={cfg.color} opacity="0.4" />
                <line x1="2" y1="14" x2="30" y2="14" stroke={cfg.color} strokeWidth="1" opacity="0.5" />
            </svg>
        </div>
    );
}

/** Larger card-style brand badge for the dashboard cards */
export function CarBrandBadge({ make }: { make: string }) {
    const cfg = brandConfig[make] || { color: "#B8C4D0", accent: "rgba(184,196,208,0.1)", abbr: make.slice(0, 2) };

    return (
        <div
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "3px 10px 3px 3px",
                borderRadius: 20,
                background: cfg.accent,
                border: `1px solid ${cfg.color}22`,
                fontSize: 11,
                fontWeight: 600,
                color: cfg.color,
                letterSpacing: "0.03em",
            }}
        >
            <div
                style={{
                    width: 18,
                    height: 18,
                    borderRadius: 9,
                    background: `${cfg.color}22`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 9,
                    fontWeight: 800,
                }}
            >
                {cfg.abbr.slice(0, 2)}
            </div>
            {make}
        </div>
    );
}

export default CarBrandIcon;
