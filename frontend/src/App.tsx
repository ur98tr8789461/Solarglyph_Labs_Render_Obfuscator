
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import type { User } from "@supabase/supabase-js";

function App() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [authLoading, setAuthLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Check if the user is already signed in
        async function getUser() {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            setUser(user);
            setLoading(false);
        }

        getUser();

        // Listen for authentication changes
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
        setAuthLoading(true);
        setMessage("");

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });

                if (error) throw error;

                setMessage(
                    "Account created! Check your email to verify your account."
                );
            } else {
                const { error } = await supabase.auth.signInWithPassword({
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
            setAuthLoading(false);
        }
    }

    async function handleOAuth(provider: "github" | "discord") {
        setAuthLoading(true);
        setMessage("");

        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: window.location.origin,
            },
        });

        if (error) {
            setMessage(error.message);
            setAuthLoading(false);
        }
    }

    async function handleSignOut() {
        setAuthLoading(true);

        const { error } = await supabase.auth.signOut();

        if (error) {
            setMessage(error.message);
        }

        setAuthLoading(false);
    }

    function getProvider() {
        if (!user) return "Unknown";

        const provider =
            user.app_metadata?.provider ||
            user.identities?.[0]?.provider;

        if (provider === "github") return "GitHub";
        if (provider === "discord") return "Discord";
        if (provider === "email") return "Email";

        return provider || "Unknown";
    }

    // Initial loading state
    if (loading) {
        return (
            <main className="page">
                <div className="login-card">
                    <p>Checking authentication...</p>
                </div>
            </main>
        );
    }

    // Signed-in state
    if (user) {
        return (
            <main className="page">
                <div className="login-card">
                    <div className="brand">
                        <div className="logo">◈</div>
                        <h1>SolarGlyph</h1>
                        <span>Obfuscator</span>
                    </div>

                    <div className="header">
                        <h2>You're signed in</h2>
                        <p>Your Supabase authentication is working.</p>
                    </div>

                    <div className="message">
                        <strong>🟢 SIGNED IN</strong>

                        <br />
                        <br />

                        <strong>Email</strong>
                        <br />
                        {user.email || "No email available"}

                        <br />
                        <br />

                        <strong>Provider</strong>
                        <br />
                        {getProvider()}

                        <br />
                        <br />

                        <strong>User ID</strong>
                        <br />

                        <code>{user.id}</code>
                    </div>

                    <button
                        className="submit-button"
                        onClick={handleSignOut}
                        disabled={authLoading}
                    >
                        {authLoading ? "Signing out..." : "Sign Out"}
                    </button>
                </div>
            </main>
        );
    }

    // Signed-out state
    return (
        <main className="page">
            <div className="login-card">
                <div className="brand">
                    <div className="logo">◈</div>
                    <h1>SolarGlyph</h1>
                    <span>Obfuscator</span>
                </div>

                <div className="header">
                    <h2>
                        {isSignUp ? "Create account" : "Welcome back"}
                    </h2>

                    <p>
                        {isSignUp
                            ? "Create an account to get started."
                            : "Sign in to continue to the Obfuscator."}
                    </p>
                </div>

                <div className="oauth-buttons">
                    <button
                        className="oauth-button"
                        onClick={() => handleOAuth("github")}
                        disabled={authLoading}
                    >
                        Continue with GitHub
                    </button>

                    <button
                        className="oauth-button"
                        onClick={() => handleOAuth("discord")}
                        disabled={authLoading}
                    >
                        Continue with Discord
                    </button>
                </div>

                <div className="divider">
                    <span>OR</span>
                </div>

                <div className="form">
                    <label>Email</label>

                    <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                    />

                    <label>Password</label>

                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                    />

                    <button
                        className="submit-button"
                        onClick={handleEmailAuth}
                        disabled={authLoading}
                    >
                        {authLoading
                            ? "Please wait..."
                            : isSignUp
                              ? "Create Account"
                              : "Sign In"}
                    </button>
                </div>

                {message && (
                    <div className="message">
                        {message}
                    </div>
                )}

                <div className="switch">
                    {isSignUp
                        ? "Already have an account?"
                        : "Don't have an account?"}

                    <button
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            setMessage("");
                        }}
                    >
                        {isSignUp ? "Sign In" : "Sign Up"}
                    </button>
                </div>
            </div>
        </main>
    );
}

export default App;
