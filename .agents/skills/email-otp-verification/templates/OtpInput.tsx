/**
 * Reusable 6-digit OTP input.
 *
 * Features:
 * - Segmented digit boxes (better mobile UX than one wide input)
 * - Paste anywhere fills all boxes
 * - Backspace navigates to previous box when empty
 * - Arrow keys navigate between boxes
 * - autoComplete="one-time-code" + inputMode="numeric" surfaces
 *   SMS/iOS code suggestions and numeric keyboards
 * - Auto-focus first box on mount
 * - Calls onComplete when all 6 digits are filled (optional auto-submit)
 *
 * Controlled component — parent owns the string state.
 */

import {
  useEffect,
  useRef,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";

interface OtpInputProps {
  value: string;
  onChange: (next: string) => void;
  onComplete?: (code: string) => void;
  length?: number;
  autoFocus?: boolean;
  disabled?: boolean;
  className?: string;
}

export function OtpInput({
  value,
  onChange,
  onComplete,
  length = 6,
  autoFocus = true,
  disabled = false,
  className = "",
}: OtpInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({length}, (_, i) => value[i] ?? "");

  useEffect(() => {
    if (autoFocus) refs.current[0]?.focus();
  }, [autoFocus]);

  const setDigit = (i: number, raw: string) => {
    const d = raw.replace(/\D/g, "").slice(-1);
    const next = digits.slice();
    next[i] = d;
    const joined = next.join("");
    onChange(joined);
    if (d && i < length - 1) refs.current[i + 1]?.focus();
    if (joined.length === length && !joined.includes("") && onComplete) {
      onComplete(joined);
    }
  };

  const onKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < length - 1) {
      refs.current[i + 1]?.focus();
    }
  };

  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    if (!text) return;
    e.preventDefault();
    onChange(text.padEnd(0, ""));
    refs.current[Math.min(text.length, length - 1)]?.focus();
    if (text.length === length && onComplete) onComplete(text);
  };

  return (
    <div className={`flex justify-between gap-2 ${className}`} onPaste={onPaste}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          disabled={disabled}
          value={d}
          onChange={(e) => setDigit(i, e.target.value)}
          onKeyDown={(e) => onKeyDown(i, e)}
          className="h-14 w-12 rounded-lg border border-black/10 bg-white text-center font-display text-2xl font-semibold text-dark outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
        />
      ))}
    </div>
  );
}
