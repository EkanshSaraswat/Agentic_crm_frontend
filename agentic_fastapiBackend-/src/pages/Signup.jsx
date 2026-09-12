import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signUp(name, email, password);
      await signIn(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-paper-light">
      <div className="hidden md:flex md:w-2/5 bg-primary-ink relative flex-col justify-between p-10 text-paper-white">
        <div>
          <div className="font-serif text-3xl font-bold tracking-wider text-accent-cream">LEDGER</div>
          <p className="text-xs uppercase tracking-widest text-accent-sepia/70 mt-1">Autonomous CRM Suite</p>
        </div>
        <div className="space-y-4 my-auto relative z-10">
          <h2 className="font-serif text-2xl text-paper-white leading-snug">
            Join your team on Ledger and manage customer pipelines with ease.
          </h2>
        </div>
        <div className="font-mono text-xs text-accent-sepia/60 relative z-10">
          v2.4.0 • Ink & Paper Edition
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-paper-light px-6 py-12">
        <div className="w-full max-w-sm space-y-6">
          <div>
            <h1 className="font-serif text-3xl text-primary-ink">Create an account</h1>
            <p className="text-sm text-muted-charcoal mt-1">Get started with your Ledger workspace</p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded border border-red-200">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-charcoal mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-paper-card border border-accent-sepia/30 px-3 py-2 text-sm text-primary-ink rounded focus:outline-none focus:ring-2 focus:ring-primary-ink/20"
                placeholder="Jane Doe"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-charcoal mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-paper-card border border-accent-sepia/30 px-3 py-2 text-sm text-primary-ink rounded focus:outline-none focus:ring-2 focus:ring-primary-ink/20"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-charcoal mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-paper-card border border-accent-sepia/30 px-3 py-2 text-sm text-primary-ink rounded focus:outline-none focus:ring-2 focus:ring-primary-ink/20"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-ink text-paper-white py-2.5 text-sm font-medium rounded hover:bg-primary-ink/90 transition-colors disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-xs text-center text-muted-charcoal">
            Already have an account?{" "}
            <Link to="/" className="text-primary-ink font-semibold underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
