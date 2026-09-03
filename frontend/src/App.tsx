
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import type { User } from "@supabase/supabase-js";

type AuthMode = "signin" | "signup";

function App() {
    const [user, setUser] = useState<User | null>(null);
    const [checkingAuth, setCheckingAuth] = useState(true);

    const [mode, setMode] = useState<AuthMode>("signin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function loadUser() {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            setUser(user);
            setCheckingAuth(false);
        }

        loadUser();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    async function handleEmailAuth() {
        if (!email || !password) {
            setMessage("Please enter your email and password.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            if (mode === "signup") {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });

                if (error) throw error;

                setMessage(
                    "Account created. Check your email to verify your account."
                );
            } else {
                const { error } =
                    await supabase.auth.signInWithPassword({
                        email,
                        password,
                    });

                if (error) throw error;
            }
        } catch (error) {
            setMessage(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleOAuth(
        provider: "github" | "discord"
    ) {
        setLoading(true);
        setMessage("");

        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: window.location.origin,
            },
        });

        if (error) {
            setMessage(error.message);
            setLoading(false);
        }
    }

    async function handleSignOut() {
        setLoading(true);
        setMessage("");

        const { error } = await supabase.auth.signOut();

        if (error) {
            setMessage(error.message);
        }

        setLoading(false);
    }

    function getProvider() {
        if (!user) return "Unknown";

        return (
            user.app_metadata?.provider ||
            user.identities?.[0]?.provider ||
            "Unknown"
        );
    }

    if (checkingAuth) {
        return (
            <div className="app">
                <nav className="navbar">
                    <a className="brand" href="/">
                        SolarGlyph Labs
                    </a>
                </nav>

                <main className="auth-page">
                    <div className="auth-loading">
                        Checking your session...
                    </div>
                </main>
            </div>
        );
    }

    /*
     * SIGNED IN
     */
    if (user) {
        return (
            <div className="app">
                {/* NAVBAR */}
                <nav className="navbar">
                    <a className="brand" href="/">
                        SolarGlyph Labs
                    </a>

                    <div className="nav-links">
                        <a href="/">Home</a>
                        <a href="/obfuscator">Obfuscator</a>
                        <button
                            onClick={handleSignOut}
                            disabled={loading}
                        >
                            Sign Out
                        </button>
                    </div>
                </nav>

                {/* ACCOUNT */}
                <main className="auth-page">
                    <section className="auth-container">
                        <div className="auth-heading">
                            <span className="eyebrow">
                                SOLARGLYPH LABS
                            </span>

                            <h1>You're signed in.</h1>

                            <p>
                                Your Obfuscator account is ready.
                            </p>
                        </div>

                        <div className="account-card">
                            <div className="status">
                                <span className="status-dot" />
                                Authenticated
                            </div>

                            <div className="account-row">
                                <span>Email</span>
                                <strong>
                                    {user.email ||
                                        "No email available"}
                                </strong>
                            </div>

                            <div className="account-row">
                                <span>Provider</span>
                                <strong>
                                    {getProvider()}
                                </strong>
                            </div>

                            <div className="account-row">
                                <span>User ID</span>
                                <code>{user.id}</code>
                            </div>
                        </div>

                        <button
                            className="primary-button"
                            onClick={() => {
                                window.location.href =
                                    "/obfuscator";
                            }}
                        >
                            Continue to Obfuscator
                        </button>
                    </section>
                </main>

                {/* FOOTER */}
                <footer className="footer">
                    <div className="footer-content">
                        <div>
                            <strong>SolarGlyph Labs</strong>
                            <p>
                                Tools for developers, made easy.
                            </p>
                        </div>

                        <div className="footer-links">
                            <a href="/">Home</a>
                            <a href="/terms">Terms</a>
                            <a href="/privacy">Privacy</a>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        © {new Date().getFullYear()} SolarGlyph Labs
                    </div>
                </footer>
            </div>
        );
    }

    /*
     * SIGNED OUT
     */
    return (
        <div className="app">
            {/* NAVBAR */}
            <nav className="navbar">
                <a className="brand" href="/">
                    SolarGlyph Labs
                </a>

                <div className="nav-links">
                    <a href="/">Home</a>
                    <a href="/obfuscator">Obfuscator</a>
                </div>
            </nav>

            {/* AUTH */}
            <main className="auth-page">
                <section className="auth-container">
                    <div className="auth-heading">
                        <span className="eyebrow">
                            SOLARGLYPH OBFUSCATOR
                        </span>

                        <h1>
                            {mode === "signin"
                                ? "Welcome back."
                                : "Create your account."}
                        </h1>

                        <p>
                            {mode === "signin"
                                ? "Sign in to continue to SolarGlyph Obfuscator."
                                : "Create an account to get started."}
                        </p>
                    </div>

                    <div className="auth-card">
                        {/* OAUTH */}
                        <div className="oauth-buttons">
                            <button
                                onClick={() =>
                                    handleOAuth("github")
                                }
                                disabled={loading}
                            >
                                Continue with GitHub
                            </button>

                            <button
                                onClick={() =>
                                    handleOAuth("discord")
                                }
                                disabled={loading}
                            >
                                Continue with Discord
                            </button>
                        </div>

                        <div className="divider">
                            <span>OR</span>
                        </div>

                        {/* EMAIL */}
                        <div className="form">
                            <label htmlFor="email">
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(event) =>
                                    setEmail(
                                        event.target.value
                                    )
                                }
                            />

                            <label htmlFor="password">
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(event) =>
                                    setPassword(
                                        event.target.value
                                    )
                                }
                            />

                            <button
                                className="primary-button"
                                onClick={handleEmailAuth}
                                disabled={loading}
                            >
                                {loading
                                    ? "Please wait..."
                                    : mode === "signin"
                                      ? "Sign In"
                                      : "Create Account"}
                            </button>
                        </div>

                        {message && (
                            <div className="auth-message">
                                {message}
                            </div>
                        )}

                        <div className="auth-switch">
                            {mode === "signin"
                                ? "Don't have an account?"
                                : "Already have an account?"}

                            <button
                                onClick={() => {
                                    setMode(
                                        mode === "signin"
                                            ? "signup"
                                            : "signin"
                                    );
                                    setMessage("");
                                }}
                            >
                                {mode === "signin"
                                    ? "Sign Up"
                                    : "Sign In"}
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            {/* FOOTER */}
            <footer className="footer">
                <div className="footer-content">
                    <div>
                        <strong>SolarGlyph Labs</strong>
                        <p>
                            Tools for developers, made easy.
                        </p>
                    </div>

                    <div className="footer-links">
                        <a href="/">Home</a>
                        <a href="/terms">Terms</a>
                        <a href="/privacy">Privacy</a>
                    </div>
                </div>

                <div className="footer-bottom">
                    © {new Date().getFullYear()} SolarGlyph Labs
                </div>
            </footer>
        </div>
    );
}

export default App;
