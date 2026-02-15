interface PortfolyLogoProps {
  size?: number;
  className?: string;
}

export function PortfolyLogo({ size = 22, className }: PortfolyLogoProps) {
  const scale = size / 22;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 24"
      height={size}
      width={100 * scale}
      fill="none"
      className={className}
      style={{ display: "block" }}
    >
      <text
        x="0"
        y="18"
        fill="currentColor"
        fontFamily='"Space Grotesk", system-ui, sans-serif'
        fontSize="18"
        fontWeight="600"
        letterSpacing="-0.02em"
      >
        portfoly
      </text>
      <circle
        cx="92"
        cy="6"
        r="2.5"
        className="portfoly-dot"
      />
    </svg>
  );
}
