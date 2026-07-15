import type {
  ButtonHTMLAttributes,
  AnchorHTMLAttributes,
  ReactNode,
} from "react";
import { cn } from "../../../lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * `primary`   — dark surface + border, slide-up green hover fill, icon slot.
 *               Use for main CTAs (e.g. email copy button in footer).
 *
 * `secondary` — same surface/border, compact pill.
 *               Use for nav links, social links (e.g. GitHub, LinkedIn).
 *
 * `light`     — white/brandText bg, dark text, no border.
 *               Use for overlaid labels that appear on dark image hover
 *               (e.g. "Explore Project" badge on project cards).
 */
export type ButtonVariant = "primary" | "secondary" | "light";

interface BaseProps {
  variant?: ButtonVariant;
  /** Only applicable on `primary` — renders a slide-up green fill on hover. */
  slide?: boolean;
  children: ReactNode;
  className?: string;
}

type ButtonAsButton = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

// ─── Styles ───────────────────────────────────────────────────────────────────

const base =
  "inline-flex items-center justify-center gap-2 rounded-full transition-all duration-300 relative overflow-hidden group cursor-pointer select-none";

const variantStyles: Record<ButtonVariant, string> = {
  /**
   * Primary CTA — dark surface, green-tinted border, slide-up hover fill.
   */
  primary:
    "bg-bgSurface border border-bgBorder hover:border-brandGreen/40 text-brandText px-4 py-1.5 text-sm font-mono font-medium tracking-wide",

  /**
   * Secondary pill — same surface treatment, compact sizing.
   * Good for nav items, social links, tag-style labels.
   */
  secondary:
    "bg-bgSurface border border-bgBorder hover:border-brandGreen/40 text-brandTextMuted hover:text-brandText px-4 py-2 text-xs font-mono font-medium tracking-wide",

  /**
   * Light overlay pill — white/brandText background, dark text.
   * Designed for use over dark imagery (project card hover badge).
   */
  light:
    "bg-brandText text-bgDark px-4 py-2 text-xs font-sans font-semibold tracking-wider shadow-xl",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Button(props: ButtonProps) {
  const {
    variant = "primary",
    slide = false,
    children,
    className = "",
    ...rest
  } = props;

  const classes = cn(base, variantStyles[variant], className);

  const slideLayer = slide && variant === "primary" && (
    <span
      aria-hidden="true"
      className="absolute inset-0 bg-brandGreen/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
    />
  );

  if (props.href !== undefined) {
    const { href, ...anchorRest } =
      rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a href={href} className={classes} {...anchorRest}>
        {slideLayer}
        {children}
      </a>
    );
  }

  const buttonRest = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button className={classes} {...buttonRest}>
      {slideLayer}
      {children}
    </button>
  );
}
