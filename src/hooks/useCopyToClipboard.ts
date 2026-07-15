import { useState, useCallback, useRef } from "react";

/**
 * Copies text to clipboard with automatic reset after a timeout.
 * Handles both the modern Clipboard API and a textarea fallback.
 *
 * @param resetDelay - Milliseconds before `copied` resets to false (default: 3000).
 * @returns A tuple of `[copy, copied]`.
 */
export function useCopyToClipboard(
  resetDelay = 3000,
): [copy: (text: string) => void, copied: boolean] {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const copy = useCallback(
    (text: string) => {
      const onSuccess = () => {
        setCopied(true);
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setCopied(false), resetDelay);
      };

      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text).then(onSuccess, () => {
          fallbackCopy(text);
          onSuccess();
        });
      } else {
        fallbackCopy(text);
        onSuccess();
      }
    },
    [resetDelay],
  );

  return [copy, copied];
}

/** Textarea-based fallback for environments without the Clipboard API. */
function fallbackCopy(text: string): void {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  try {
    document.execCommand("copy");
  } catch {
    /* noop */
  }
  document.body.removeChild(textarea);
}
