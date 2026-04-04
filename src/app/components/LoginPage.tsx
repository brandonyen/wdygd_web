import { motion } from "motion/react";
import { LogIn } from "lucide-react";
import { useState, type FormEvent } from "react";
import { readStoredAccount, type StoredAccount } from "../accountStorage";

interface LoginPageProps {
  onLoginSuccess: (account: StoredAccount) => void;
  onSwitchToSignup: () => void;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function LoginPage({
  onLoginSuccess,
  onSwitchToSignup,
}: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    const stored = readStoredAccount();
    if (!stored) {
      setError("No saved account found. Create one first.");
      return;
    }

    const inputEmail = email.trim().toLowerCase();
    const savedEmail = stored.email.trim().toLowerCase();
    if (inputEmail !== savedEmail) {
      setError("Email does not match this device’s saved account.");
      return;
    }
    if (password !== stored.password) {
      setError("Incorrect password.");
      return;
    }

    onLoginSuccess(stored);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 py-16 bg-background">
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
            <LogIn className="w-7 h-7 text-white" strokeWidth={1.75} />
          </div>
          <h1
            className="text-4xl tracking-tight"
            style={{
              color: "var(--zen-charcoal)",
              fontWeight: 300,
            }}
          >
            Welcome back
          </h1>
          <p
            className="text-base"
            style={{ color: "var(--zen-charcoal-light)" }}
          >
            Log in with the email and password you used to sign up.
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
              htmlFor="login-email"
              className="text-sm"
              style={{ color: "var(--zen-charcoal)" }}
            >
              Email
            </label>
            <input
              id="login-email"
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
              htmlFor="login-password"
              className="text-sm"
              style={{ color: "var(--zen-charcoal)" }}
            >
              Password
            </label>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                borderColor: "var(--zen-sand)",
                color: "var(--zen-charcoal)",
              }}
            />
          </div>

          {error && (
            <p className="text-sm" style={{ color: "#c45c5c" }} role="alert">
              {error}
            </p>
          )}

          <motion.button
            type="submit"
            className="w-full px-6 py-3.5 rounded-full text-sm font-medium transition-colors"
            style={{
              backgroundColor: "var(--zen-charcoal)",
              color: "white",
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Log in
          </motion.button>
        </form>

        <p
          className="text-center text-sm mt-8"
          style={{ color: "var(--zen-charcoal-light)" }}
        >
          New here?{" "}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="underline underline-offset-2 hover:opacity-80"
            style={{ color: "var(--zen-sage-dark)" }}
          >
            Create an account
          </button>
        </p>
      </motion.div>
    </div>
  );
}
