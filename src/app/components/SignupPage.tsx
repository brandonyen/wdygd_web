import { motion } from "motion/react";
import { UserPlus } from "lucide-react";
import { useState, type FormEvent } from "react";
import axios from "axios";

const USER_CONFIG_API_URL =
  "https://28gthv6fu1.execute-api.us-east-1.amazonaws.com/prod/user-config";

interface SignupPageProps {
  onSignupComplete: (account: {
    fullName: string;
    email: string;
    password: string;
  }) => void;
  onSwitchToLogin: () => void;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function SignupPage({
  onSignupComplete,
  onSwitchToLogin,
}: SignupPageProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError(null);

    const name = fullName.trim();
    const normalizedEmail = email.trim();

    if (!name) {
      setError("Please enter your name.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        USER_CONFIG_API_URL,
        {
          email: normalizedEmail,
        },
        { headers: { "Content-Type": "application/json" } },
      );

      if (response.status < 200 || response.status >= 300) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      onSignupComplete({
        fullName: name,
        email: normalizedEmail,
        password,
      });
    } catch {
      setError(
        "We couldn't create your account right now. Please try again in a moment.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center gap-4 mb-10 text-center">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: "var(--zen-sage)" }}
          >
            <UserPlus className="w-7 h-7 text-white" strokeWidth={1.75} />
          </div>
          <h1
            className="text-4xl tracking-tight"
            style={{
              color: "var(--zen-charcoal)",
              fontWeight: 300,
            }}
          >
            Create your account
          </h1>
          <p
            className="text-base"
            style={{ color: "var(--zen-charcoal-light)" }}
          >
            Sign up to start tracking what you got done in WDYGD.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-8 rounded-3xl"
          style={{
            backgroundColor: "var(--card)",
            boxShadow: "0 24px 48px -12px rgba(0,0,0,0.08)",
          }}
        >
          <div className="space-y-1">
            <label
              htmlFor="signup-name"
              className="text-sm"
              style={{ color: "var(--zen-charcoal)" }}
            >
              Full name
            </label>
            <input
              id="signup-name"
              name="name"
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                borderColor: "var(--zen-sand)",
                color: "var(--zen-charcoal)",
              }}
              placeholder="Ada Lovelace"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="signup-email"
              className="text-sm"
              style={{ color: "var(--zen-charcoal)" }}
            >
              Email
            </label>
            <input
              id="signup-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                borderColor: "var(--zen-sand)",
                color: "var(--zen-charcoal)",
              }}
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="signup-password"
              className="text-sm"
              style={{ color: "var(--zen-charcoal)" }}
            >
              Password
            </label>
            <input
              id="signup-password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                borderColor: "var(--zen-sand)",
                color: "var(--zen-charcoal)",
              }}
              placeholder="At least 8 characters"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="signup-confirm"
              className="text-sm"
              style={{ color: "var(--zen-charcoal)" }}
            >
              Confirm password
            </label>
            <input
              id="signup-confirm"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                borderColor: "var(--zen-sand)",
                color: "var(--zen-charcoal)",
              }}
              placeholder="Repeat password"
            />
          </div>

          {error && (
            <p className="text-sm" style={{ color: "#c45c5c" }} role="alert">
              {error}
            </p>
          )}

          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3.5 rounded-full text-sm font-medium transition-colors"
            style={{
              backgroundColor: "var(--zen-charcoal)",
              color: "white",
              opacity: isSubmitting ? 0.7 : 1,
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
            whileHover={isSubmitting ? {} : { scale: 1.02 }}
            whileTap={isSubmitting ? {} : { scale: 0.98 }}
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </motion.button>
        </form>

        <p
          className="text-center text-sm mt-8"
          style={{ color: "var(--zen-charcoal-light)" }}
        >
          After signing up, you will connect your tools before entering the app.
        </p>
        <p
          className="text-center text-sm mt-3"
          style={{ color: "var(--zen-charcoal-light)" }}
        >
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="underline underline-offset-2 hover:opacity-80"
            style={{ color: "var(--zen-sage-dark)" }}
          >
            Log in
          </button>
        </p>
      </motion.div>
    </div>
  );
}
