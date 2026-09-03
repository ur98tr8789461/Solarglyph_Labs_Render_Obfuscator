
import { useState } from "react";
import { supabase } from "./lib/supabase";

function App() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    async function handleEmailAuth() {
        setLoading(true);
        setMessage("");

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });

                if (error) throw error;

                setMessage("Account created! Check your email to verify it.");
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) throw error;

                setMessage("Successfully signed in!");
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

    async function handleOAuth(provider: "github" | "discord") {
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

    return (
        <main className="page">
            <div className="login-card">
                <div className="brand">
                    <div className="logo">◈</div>
                    <h1>SolarGlyph</h1>
                    <span>Obfuscator</span>
                </div>

                <div className="header">
                    <h2>{isSignUp ? "Create account" : "Welcome back"}</h2>
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
                        disabled={loading}
                    >
                        <span>GitHub</span>
                    </button>

                    <button
                        className="oauth-button"
                        onClick={() => handleOAuth("discord")}
                        disabled={loading}
                    >
                        <span>Discord</span>
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
                        onChange={(event) => setEmail(event.target.value)}
                    />

                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />

                    <button
                        className="submit-button"
                        onClick={handleEmailAuth}
                        disabled={loading}
                    >
                        {loading
                            ? "Please wait..."
                            : isSignUp
                              ? "Create Account"
                              : "Sign In"}
                    </button>
                </div>

                {message && <div className="message">{message}</div>}

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

