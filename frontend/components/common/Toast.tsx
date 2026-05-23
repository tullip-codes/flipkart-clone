/**
 * Toast — lightweight notification component.
 *
 * Variants: success | error | info
 * Auto-dismisses after `duration` ms (default 4000).
 * Renders fixed bottom-right on desktop, bottom-center on mobile.
 * No external dependency — pure Tailwind + React.
 *
 * Usage:
 *   const [toast, setToast] = useState<ToastState | null>(null);
 *   setToast({ message: "Email sent!", variant: "success" });
 *   <Toast toast={toast} onClose={() => setToast(null)} />
 */

"use client";

import { useEffect } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

export interface ToastState {
  message: string;
  variant: "success" | "error" | "info";
}

interface ToastProps {
  toast: ToastState | null;
  onClose: () => void;
  duration?: number;
}

const VARIANT_STYLES = {
  success: {
    container: "bg-white border-l-4 border-green-500",
    icon: <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />,
    title: "text-green-700",
  },
  error: {
    container: "bg-white border-l-4 border-red-500",
    icon: <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />,
    title: "text-red-700",
  },
  info: {
    container: "bg-white border-l-4 border-[#2874F0]",
    icon: <Info className="w-5 h-5 text-[#2874F0] flex-shrink-0" />,
    title: "text-[#2874F0]",
  },
};

export default function Toast({ toast, onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [toast, duration, onClose]);

  if (!toast) return null;

  const styles = VARIANT_STYLES[toast.variant];

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`
        fixed bottom-6 right-4 left-4
        sm:left-auto sm:right-6 sm:w-[360px]
        z-[9999] flex items-start gap-3
        ${styles.container}
        rounded-sm shadow-lg px-4 py-3
        animate-in slide-in-from-bottom-4 duration-300
      `}
    >
      {styles.icon}
      <p className={`flex-1 text-sm font-medium ${styles.title} leading-snug`}>
        {toast.message}
      </p>
      <button
        onClick={onClose}
        aria-label="Dismiss"
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}