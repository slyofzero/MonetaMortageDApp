interface Props {
  className?: string;
}

export function Chevron({ className }: Props) {
  return (
    <svg
      width="12"
      height="7"
      viewBox="0 0 12 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M0.97168 1L6.20532 6L11.439 1" stroke="#AEAEAE"></path>
    </svg>
  );
}
