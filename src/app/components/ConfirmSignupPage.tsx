import { motion } from "motion/react";
import { MailCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import {
  confirmSignUpWithCognito,
  resendCognitoConfirmationCode,
} from "../cognitoAuth";

interface ConfirmSignupPageProps {
  email: string;
  onConfirmed: () => void;
  onBackToLogin: () => void;
}

export function ConfirmSignupPage({
  email,
  onConfirmed,
  onBackToLogin,
}: ConfirmSignupPageProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError(null);
    setInfo(null);

    if (!code.trim()) {
      setError("Please enter the verification code from your email.");
      return;
    }

    setIsSubmitting(true);
    try {
      await confirmSignUpWithCognito({ email, code });
      onConfirmed();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unable to verify code right now. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (isResending) return;
    setError(null);
    setInfo(null);
    setIsResending(true);
    try {
      await resendCognitoConfirmationCode(email);
      setInfo("Verification code sent. Check your email inbox.");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unable to resend code right now. Please try again.");
      }
    } finally {
      setIsResending(false);
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
            <MailCheck className="w-7 h-7 text-white" strokeWidth={1.75} />
          </div>
          <h1
            className="text-4xl tracking-tight"
            style={{
              color: "var(--zen-charcoal)",
              fontWeight: 300,
            }}
          >
            Verify your account
          </h1>
          <p className="text-base" style={{ color: "var(--zen-charcoal-light)" }}>
            Enter the verification code sent to {email}.
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
              htmlFor="verification-code"
              className="text-sm"
              style={{ color: "var(--zen-charcoal)" }}
            >
              Verification code
            </label>
            <input
              id="verification-code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                borderColor: "var(--zen-sand)",
                color: "var(--zen-charcoal)",
              }}
              placeholder="123456"
            />
          </div>

          {error && (
            <p className="text-sm" style={{ color: "#c45c5c" }} role="alert">
              {error}
            </p>
          )}
          {info && (
            <p className="text-sm" style={{ color: "var(--zen-sage-dark)" }}>
              {info}
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
            {isSubmitting ? "Verifying..." : "Verify account"}
          </motion.button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <button
            type="button"
            onClick={handleResendCode}
            disabled={isResending}
            className="text-sm underline underline-offset-2 hover:opacity-80 disabled:opacity-60"
            style={{ color: "var(--zen-sage-dark)" }}
          >
            {isResending ? "Sending..." : "Resend code"}
          </button>
          <p className="text-sm" style={{ color: "var(--zen-charcoal-light)" }}>
            <button
              type="button"
              onClick={onBackToLogin}
              className="underline underline-offset-2 hover:opacity-80"
              style={{ color: "var(--zen-sage-dark)" }}
            >
              Back to login
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
