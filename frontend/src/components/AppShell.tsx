"use client";

import { useAuth } from "@/lib/AuthContext";
import Sidebar from "@/components/Sidebar";
import LoginPage from "@/components/LoginPage";

export default function AppShell({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();

    // Loading state
    if (loading) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "var(--bg-primary)",
                }}
            >
                <div className="gold-text" style={{ fontSize: 22, fontWeight: 600, fontFamily: "'Outfit', sans-serif" }}>
                    AURA DRIVE
                </div>
            </div>
        );
    }

    // Not logged in → show login page
    if (!user) {
        return <LoginPage />;
    }

    // Logged in → show app with sidebar
    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            <Sidebar />
            <main
                style={{
                    flex: 1,
                    marginLeft: 270,
                    padding: "32px 40px",
                    minHeight: "100vh",
                    background: "var(--bg-primary)",
                }}
            >
                {children}
            </main>
        </div>
    );
}
