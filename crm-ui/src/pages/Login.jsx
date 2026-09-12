import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Login() {
  const { token, signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@ledger.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccess = async () => {
    setLoading(true);
    try {
      await signIn("demo.admin@ledger.com", "demo123");
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
            Streamline your deal pipeline, customer context, and integrations.
          </h2>
          <p className="text-sm text-accent-sepia/80">
            Full-featured CRM interface connected directly to your FastAPI backend.
          </p>
        </div>
        <div className="font-mono text-xs text-accent-sepia/60 relative z-10">
          v2.4.0 • Ink & Paper Edition
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-paper-light px-6 py-12">
        <div className="w-full max-w-sm space-y-6">
          <div>
            <h1 className="font-serif text-3xl text-primary-ink">Sign in</h1>
            <p className="text-sm text-muted-charcoal mt-1">Enter your credentials or use Instant Access</p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded border border-red-200">
              {error}
            </div>
          )}

          <div className="p-4 bg-accent-cream/40 border border-accent-sepia/20 rounded-lg space-y-3">
            <div className="flex items-center justify-between text-xs text-primary-ink font-medium">
              <span className="flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-accent-sepia" />
                <span>Quick Access</span>
              </span>
              <span className="text-muted-charcoal text-[11px]">Bypass login</span>
            </div>
            <button
              type="button"
              onClick={handleDemoAccess}
              disabled={loading}
              className="w-full bg-primary-ink text-paper-white py-2.5 px-4 rounded text-sm font-medium hover:bg-primary-ink/90 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Instant Demo Access</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-accent-sepia/20 w-full" />
            <span className="bg-paper-light px-3 text-xs text-muted-charcoal uppercase tracking-wider font-mono">or</span>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
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
              className="w-full border border-accent-sepia/40 bg-paper-card text-primary-ink py-2.5 text-sm font-medium rounded hover:bg-accent-cream transition-colors disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in with Email"}
            </button>
          </form>

          <p className="text-xs text-center text-muted-charcoal">
            New here?{" "}
            <Link to="/signup" className="text-primary-ink font-semibold underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}