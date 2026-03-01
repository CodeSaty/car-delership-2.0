"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
    managerOnly?: boolean;
}

const navItems: NavItem[] = [
    {
        label: "Dashboard",
        href: "/",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
        ),
    },
    {
        label: "Inventory",
        href: "/inventory",
        managerOnly: true,
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1" />
                <polygon points="12 15 17 21 7 21 12 15" />
            </svg>
        ),
    },
    {
        label: "Clients",
        href: "/clients",
        managerOnly: true,
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
    },
    {
        label: "Sales",
        href: "/sales",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
        ),
    },
    {
        label: "Analytics",
        href: "/analytics",
        managerOnly: true,
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
        ),
    },
    {
        label: "Settings",
        href: "/settings",
        managerOnly: true,
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
        ),
    },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { user, logout, isManager } = useAuth();

    const visibleItems = navItems.filter((item) => !item.managerOnly || isManager);

    const roleColor = isManager ? "var(--gold)" : "var(--platinum)";
    const roleLabel = isManager ? "Manager" : "Salesman";

    return (
        <aside
            style={{
                width: 270,
                minHeight: "100vh",
                background: "rgba(10, 10, 16, 0.75)",
                backdropFilter: "blur(32px)",
                WebkitBackdropFilter: "blur(32px)",
                borderRight: "1px solid rgba(255, 255, 255, 0.05)",
                display: "flex",
                flexDirection: "column",
                padding: "28px 16px",
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: 50,
            }}
        >
            {/* Subtle glow at top */}
            <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 200,
                background: "radial-gradient(ellipse at 50% 0%, rgba(201,169,98,0.06) 0%, transparent 70%)",
                pointerEvents: "none",
            }} />

            {/* Logo */}
            <div style={{ padding: "0 12px", marginBottom: 36, position: "relative" }}>
                <h1
                    className="gold-text"
                    style={{
                        fontSize: 26,
                        fontWeight: 800,
                        fontFamily: "'Outfit', sans-serif",
                        letterSpacing: "-0.02em",
                    }}
                >
                    AURA DRIVE
                </h1>
                <p
                    style={{
                        fontSize: 10,
                        color: "var(--text-muted)",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        marginTop: 4,
                    }}
                >
                    Luxury Analytics
                </p>
            </div>

            {/* User Info Card */}
            {user && (
                <div
                    style={{
                        margin: "0 4px 28px",
                        padding: "16px 18px",
                        borderRadius: 16,
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        backdropFilter: "blur(8px)",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 12,
                                background: `linear-gradient(135deg, ${roleColor}18, ${roleColor}08)`,
                                border: `1px solid ${roleColor}25`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 14,
                                fontWeight: 700,
                                color: roleColor,
                            }}
                        >
                            {user.display_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {user.display_name}
                            </p>
                            <p style={{ fontSize: 11, color: roleColor, fontWeight: 500, marginTop: 1 }}>
                                {roleLabel}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1, position: "relative" }}>
                {visibleItems.map((item, i) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`sidebar-link ${isActive ? "active" : ""}`}
                            style={{ animation: `slideInLeft 0.4s ease-out ${i * 0.05}s both` }}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Divider */}
            <div className="glass-divider" style={{ margin: "0 12px" }} />

            {/* Footer with Logout */}
            <div style={{ padding: "20px 8px 0" }}>
                <button
                    onClick={logout}
                    style={{
                        width: "100%",
                        padding: "11px 16px",
                        borderRadius: 14,
                        border: "1px solid rgba(239,68,68,0.15)",
                        background: "rgba(239,68,68,0.04)",
                        color: "#EF4444",
                        fontSize: 13,
                        fontWeight: 500,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        justifyContent: "center",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        backdropFilter: "blur(4px)",
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.background = "rgba(239,68,68,0.1)";
                        e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)";
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.background = "rgba(239,68,68,0.04)";
                        e.currentTarget.style.borderColor = "rgba(239,68,68,0.15)";
                    }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Sign Out
                </button>
                <p style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 12, textAlign: "center", letterSpacing: "0.05em" }}>Aura Drive v2.0</p>
            </div>
        </aside>
    );
}
