import { useState } from "react";
import { supabase } from "./lib/supabase";

function App() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    async function handleAuth() {
        setLoading(true);
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

    return (
        <main>
            <div>
                <h1>Obfuscator</h1>

                <p>
                    {isSignUp
                        ? "Create your account"
                        : "Sign in to your account"}
                </p>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />

                <button onClick={handleAuth} disabled={loading}>
                    {loading
                        ? "Loading..."
                        : isSignUp
                        ? "Create Account"
                        : "Sign In"}
                </button>

                <button
                    type="button"
                    onClick={() => {
                        setIsSignUp(!isSignUp);
                        setMessage("");
                    }}
                >
                    {isSignUp
                        ? "Already have an account? Sign in"
                        : "Don't have an account? Sign up"}
                </button>

                {message && <p>{message}</p>}
            </div>
        </main>
    );
}

export default App;